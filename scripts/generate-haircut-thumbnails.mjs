/**
 * One-off: generate a static reference photo for each catalog haircut.
 *
 * Run manually — NOT part of the app bundle:
 *   node scripts/generate-haircut-thumbnails.mjs   (or: npm run gen:thumbs)
 *
 * Reads the OpenAI key/model from `.env` (the EXPO_PUBLIC_* vars Expo would
 * normally inline — parsed here directly since Node does no inlining). Calls
 * the image *generations* endpoint (there is no source selfie for a generic
 * reference shot) and writes assets/haircuts/<id>.png.
 *
 * The `HAIRCUTS` summary below mirrors src/data.ts — kept inline so the script
 * needs no TS build step. If the catalog changes, update this list too.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'haircuts');

/** Minimal parse of `.env` — KEY=VALUE lines, ignores comments/blanks. */
function loadEnv() {
  let raw = '';
  try {
    raw = readFileSync(join(ROOT, '.env'), 'utf8');
  } catch {
    return {};
  }
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const API_KEY = (
  env.EXPO_PUBLIC_OPENAI_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
  ''
).trim();
const MODEL = (
  env.EXPO_PUBLIC_OPENAI_IMAGE_MODEL ||
  process.env.EXPO_PUBLIC_OPENAI_IMAGE_MODEL ||
  'gpt-image-2'
).trim();

if (!API_KEY) {
  console.error(
    'Missing EXPO_PUBLIC_OPENAI_API_KEY — set it in .env before running.',
  );
  process.exit(1);
}

/** Mirrors HAIRCUTS in src/data.ts — id, name, barber style, one-liner. */
const HAIRCUTS = [
  {
    id: 'fringe-low-taper',
    name: 'Textured Fringe + Low Taper',
    barberStyle: 'Textured Fringe with Low Taper',
    short: 'Modern, school-safe, low effort.',
  },
  {
    id: 'french-crop',
    name: 'French Crop',
    barberStyle: 'French Crop',
    short: 'Sharp, clean, almost no styling.',
  },
  {
    id: 'messy-medium',
    name: 'Messy Medium Cut',
    barberStyle: 'Messy Medium Cut',
    short: 'Relaxed, longer, daily styling.',
  },
  {
    id: 'mid-fade-pomp',
    name: 'Mid Fade + Loose Pomp',
    barberStyle: 'Mid Fade with Loose Pompadour',
    short: 'Stronger contrast, more presence.',
  },
  {
    id: 'buzz-1',
    name: 'Buzz #1',
    barberStyle: 'Buzz #1 All Over',
    short: 'Reset button.',
  },
];

function buildPrompt(h) {
  return [
    `Studio reference photo of a young man with a "${h.name}" haircut — ${h.barberStyle}.`,
    h.short,
    'Plain neutral grey background, soft even lighting, front three-quarter angle,',
    'photorealistic, head and shoulders, clear view of the hair.',
  ].join(' ');
}

async function generateOne(h) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(h),
      size: '1024x1536',
      quality: 'medium',
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      if (body?.error?.message) detail = ` ${body.error.message}`;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(`HTTP ${res.status}.${detail}`);
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error('response contained no image');

  const outPath = join(OUT_DIR, `${h.id}.png`);
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  return outPath;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${HAIRCUTS.length} thumbnails with model "${MODEL}"…\n`);

  let ok = 0;
  const failed = [];
  for (const h of HAIRCUTS) {
    process.stdout.write(`  ${h.id} … `);
    try {
      const path = await generateOne(h);
      console.log(`done → ${path}`);
      ok += 1;
    } catch (e) {
      console.log(`FAILED: ${e instanceof Error ? e.message : e}`);
      failed.push(h.id);
    }
  }

  console.log(`\n${ok}/${HAIRCUTS.length} generated.`);
  if (failed.length) {
    console.log(`Failed: ${failed.join(', ')} — re-run to retry.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
