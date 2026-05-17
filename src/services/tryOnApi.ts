/**
 * Virtual try-on — renders the user's selfie wearing a chosen haircut.
 *
 * Sends the stored selfie + a description of the selected cut to OpenAI's
 * image-edit endpoint and returns the generated image as a base64 PNG string.
 * The OpenAI key ships in the app bundle — see `src/config/env.ts`.
 */
import { OPENAI_API_KEY, OPENAI_IMAGE_MODEL } from '../config/env';
import type { Haircut } from '../data';

const OPENAI_EDIT_URL = 'https://api.openai.com/v1/images/edits';
/** Image generation is slow — allow well past a typical 30-60s run. */
const TIMEOUT_MS = 120_000;
/** Portrait — closest to the 4:5 selfie, good framing for a head-and-hair shot. */
const SIZE = '1024x1536';
/** `medium` keeps faces clean without `high`'s extra cost. */
const QUALITY = 'medium';

/** Human-readable instruction set for the image model. */
function buildTryOnPrompt(h: Haircut): string {
  return [
    `Give the person in this photo a new men's hairstyle: "${h.name}" — ${h.barber.style}.`,
    h.short,
    'Keep their face, facial features, skin tone, expression, glasses, clothing,',
    'pose, lighting and background exactly the same.',
    'Change only the hair so it matches the described cut.',
    'Natural, photorealistic result.',
  ].join(' ');
}

/**
 * Generate a try-on preview. Returns a base64 PNG (no `data:` prefix).
 * Throws `Error` with a user-facing message on any failure.
 */
export async function generateTryOn(args: {
  photoUri: string;
  haircut: Haircut;
}): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('The image service is not configured.');
  }
  if (!args.photoUri) {
    throw new Error('No photo was available — retake your selfie first.');
  }

  const form = new FormData();
  form.append('model', OPENAI_IMAGE_MODEL);
  form.append('prompt', buildTryOnPrompt(args.haircut));
  form.append('size', SIZE);
  form.append('quality', QUALITY);
  // `high` input fidelity preserves the person's face far better on edits.
  form.append('input_fidelity', 'high');
  form.append('image', {
    uri: args.photoUri,
    name: 'selfie.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(OPENAI_EDIT_URL, {
      method: 'POST',
      // No Content-Type — fetch sets the multipart boundary itself.
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('The preview took too long. Please try again.');
    }
    throw new Error('Could not reach the image service.');
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
      // Non-JSON error body — the status alone has to carry it.
    }
    if (res.status === 429) {
      throw new Error(
        `The image service is busy or out of quota.${
          detail || ' Please try again shortly.'
        }`,
      );
    }
    throw new Error(`Preview failed (HTTP ${res.status}).${detail}`);
  }

  let json: { data?: { b64_json?: string }[] };
  try {
    json = (await res.json()) as { data?: { b64_json?: string }[] };
  } catch {
    throw new Error('Got an unreadable response from the image service.');
  }

  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('The image service returned no image.');
  }
  return b64;
}
