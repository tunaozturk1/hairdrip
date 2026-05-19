/**
 * Runtime config, inlined into the app bundle by Expo at build time from
 * `.env` (`EXPO_PUBLIC_*` vars).
 *
 * WARNING: `OPENAI_API_KEY` ships *inside* the shipped app bundle and can be
 * extracted by anyone who downloads the app. This is a deliberate demo-grade
 * tradeoff — for a public release the OpenAI call belongs behind a server that
 * holds the key. Keep a hard spend cap on the key.
 *
 * `EXPO_PUBLIC_*` vars are inlined at bundler startup, not hot-reloaded —
 * restart `npm start` after changing `.env`.
 */
export const OPENAI_API_KEY = (process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '').trim();

/** Vision-capable model for the face-analysis call. */
export const OPENAI_MODEL =
  (process.env.EXPO_PUBLIC_OPENAI_MODEL ?? '').trim() || 'gpt-5.4';

/** Image-edit model for the "see it on you" try-on preview. */
export const OPENAI_IMAGE_MODEL =
  (process.env.EXPO_PUBLIC_OPENAI_IMAGE_MODEL ?? '').trim() || 'gpt-image-2';

/**
 * Render quality for the try-on image edit: `low` | `medium` | `high`.
 * Defaults to `high` — lower settings smooth skin texture, acne and stubble
 * away, so the face stops looking like the actual user.
 */
export const OPENAI_IMAGE_QUALITY =
  (process.env.EXPO_PUBLIC_OPENAI_IMAGE_QUALITY ?? '').trim() || 'high';

/**
 * Output size for the try-on image edit, e.g. `1024x1024` or `1024x1536`.
 * Defaults to portrait `1024x1536` to match the 4:5 selfie — a square output
 * forces the model to recompose the face and distorts it.
 */
export const OPENAI_IMAGE_SIZE =
  (process.env.EXPO_PUBLIC_OPENAI_IMAGE_SIZE ?? '').trim() || '1024x1536';

/** True when an OpenAI API key has been configured. */
export const isApiConfigured = OPENAI_API_KEY.length > 0;
