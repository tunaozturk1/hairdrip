/**
 * Runs the face-analysis call.
 *
 * Sends the compressed selfie + quiz answers straight to the OpenAI vision
 * model and turns its strict-JSON reply into a face read plus a ranked,
 * explained recommendation set. The haircut catalog (`src/data.ts`) is the
 * single source of truth — it's projected into both the prompt and the strict
 * response schema on every call.
 */
import { OPENAI_API_KEY, OPENAI_MODEL, isApiConfigured } from '../config/env';
import { HAIRCUTS } from '../data';
import { buildResponseSchema, buildSystemPrompt } from './prompt';
import type { CatalogEntry } from './prompt';
import type { AnalysisResult, OnboardingAnswers, ScoredHaircut } from '../store/types';

export type AnalysisErrorKind =
  | 'config'
  | 'network'
  | 'timeout'
  | 'server'
  | 'parse';

/** A typed failure the analysis screen can present (and offer a fallback for). */
export class AnalysisError extends Error {
  kind: AnalysisErrorKind;
  constructor(kind: AnalysisErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = 'AnalysisError';
  }
}

/** Shape of the strict-JSON object the model returns in `message.content`. */
interface AnalyzeResponse {
  analysis: {
    shape: string;
    shapeConfidence: number;
    hair: string;
    volume: string;
    forehead: string;
    current: string;
    styleSummary: string;
    notes: string[];
    facialFeatures: string;
  };
  ranking: { id: string; fit: number; why: string }[];
}

/** The slice of OpenAI's chat-completions envelope we actually read. */
interface OpenAICompletion {
  choices?: {
    finish_reason?: string;
    message?: { content?: string };
  }[];
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const TIMEOUT_MS = 45_000;
/** ~12 MB of base64 — generous for a 1024px JPEG, blocks accidental abuse. */
const MAX_IMAGE_CHARS = 12 * 1024 * 1024;

function clampFit(n: number): number {
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export async function analyzePhoto(args: {
  photoUri: string;
  photoBase64: string;
  quizAnswers: OnboardingAnswers | null;
}): Promise<{ analysis: AnalysisResult; recs: ScoredHaircut[] }> {
  if (!isApiConfigured) {
    throw new AnalysisError('config', 'The analysis service is not configured.');
  }
  if (!args.photoBase64) {
    throw new AnalysisError('config', 'No photo was available to analyze.');
  }
  if (args.photoBase64.length > MAX_IMAGE_CHARS) {
    throw new AnalysisError('config', 'That photo is too large to analyze.');
  }

  // Slim projection of the catalog — enough for the model to rank and explain,
  // and the source for both the prompt text and the strict id enum.
  const catalog: CatalogEntry[] = HAIRCUTS.map((h) => ({
    id: h.id,
    name: h.name,
    family: h.family,
    regret: h.regret,
    maint: h.maint,
    tag: h.tag,
    short: h.short,
  }));

  const messages = [
    { role: 'system', content: buildSystemPrompt(catalog) },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `User quiz answers (JSON): ${JSON.stringify(
            args.quizAnswers ?? {},
          )}`,
        },
        {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${args.photoBase64}` },
        },
      ],
    },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        // GPT-5-family models reject `max_tokens`; this budget must also cover
        // internal reasoning tokens, so it's larger than the visible output.
        max_completion_tokens: 4000,
        reasoning_effort: 'low',
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'haircut_analysis',
            strict: true,
            schema: buildResponseSchema(catalog),
          },
        },
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new AnalysisError('timeout', 'Analysis took too long. Please try again.');
    }
    throw new AnalysisError('network', 'Could not reach the analysis service.');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    // OpenAI errors come back as { error: { message, type, code } }.
    let detail = '';
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body?.error?.message) detail = ` ${body.error.message}`;
    } catch {
      // A non-JSON body (often a 5xx) — the status alone has to carry it.
    }
    if (res.status === 401 || res.status === 403) {
      throw new AnalysisError(
        'config',
        'The OpenAI API key is missing or invalid.',
      );
    }
    if (res.status === 429) {
      throw new AnalysisError(
        'server',
        'The analysis service is busy or out of quota. Please try again.',
      );
    }
    throw new AnalysisError(
      'server',
      `Analysis failed (HTTP ${res.status}).${detail}`,
    );
  }

  let completion: OpenAICompletion;
  try {
    completion = (await res.json()) as OpenAICompletion;
  } catch {
    throw new AnalysisError('parse', 'Got an unreadable response from the service.');
  }

  const choice = completion.choices?.[0];
  if (choice?.finish_reason === 'length') {
    throw new AnalysisError(
      'parse',
      'The analysis response was cut off. Please try again.',
    );
  }
  const content = choice?.message?.content;
  if (typeof content !== 'string' || content.length === 0) {
    throw new AnalysisError('parse', 'The analysis response was empty.');
  }

  let data: AnalyzeResponse;
  try {
    data = JSON.parse(content) as AnalyzeResponse;
  } catch {
    throw new AnalysisError('parse', 'Got an unreadable response from the service.');
  }

  if (!data?.analysis || !Array.isArray(data.ranking)) {
    throw new AnalysisError('parse', 'The analysis response was incomplete.');
  }

  const a = data.analysis;
  const analysis: AnalysisResult = {
    shape: a.shape ?? 'Unknown',
    shapeConfidence: clampFit(a.shapeConfidence),
    hair: a.hair ?? '—',
    volume: a.volume ?? '—',
    forehead: a.forehead ?? '—',
    current: a.current ?? '—',
    styleSummary: a.styleSummary ?? 'balanced',
    notes: Array.isArray(a.notes) ? a.notes.slice(0, 4) : [],
    facialFeatures: a.facialFeatures ?? '',
    photoUri: args.photoUri,
    createdAt: Date.now(),
  };

  const recs: ScoredHaircut[] = data.ranking
    .map((r) => {
      const h = HAIRCUTS.find((x) => x.id === r.id);
      if (!h) return null;
      return {
        ...h,
        fit: clampFit(r.fit),
        why: r.why?.trim() || h.why,
        baseFit: h.fit,
        rank: 0,
      };
    })
    .filter((x): x is ScoredHaircut => x !== null)
    .sort((x, y) => y.fit - x.fit)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  if (recs.length === 0) {
    throw new AnalysisError('parse', 'No haircuts were returned by the service.');
  }

  return { analysis, recs };
}
