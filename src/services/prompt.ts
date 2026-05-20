/**
 * Prompt + JSON schema builders for the face-analysis call.
 *
 * Both are built per call from the haircut catalog (`src/data.ts`), so the
 * prompt text and the strict schema's id enum always match the live catalog.
 */

export interface CatalogEntry {
  id: string;
  name: string;
  family: string;
  regret: string;
  maint: string;
  tag: string | null;
  short: string;
}

export function buildSystemPrompt(catalog: CatalogEntry[]): string {
  const lines = catalog
    .map(
      (c) =>
        `- ${c.id}: ${c.name} — family ${c.family}, ${c.regret} regret, ${c.maint} maintenance${
          c.tag ? `, tagged "${c.tag}"` : ''
        }. ${c.short}`,
    )
    .join('\n');

  return `You are the analysis engine for Glow Up, an app that recommends men's haircuts and writes barber instructions.

You receive ONE front-facing selfie and the user's quiz answers (hair type, thickness, past problems, desired style, daily effort).

Your job:
1. Analyze the photo. Determine face shape (e.g. Oval, Round, Square, Heart, Oblong, Diamond), an honest confidence 0-100, hair type/texture, hair volume, and a forehead description. Note the current hair state.
2. Write a one-line "styleSummary" — the kind of styles that suit this person (e.g. "low-volume, textured").
3. Write 2-3 short, specific "notes" — concrete observations that reference what you actually see in the photo, not generic advice.
4. Write a "facialFeatures" line — a precise, neutral description of the person's distinctive NON-HAIR features, used later to keep an AI try-on preview looking like the same person. Cover: facial hair (beard/stubble/moustache and its density), skin (acne, blemishes, freckles, moles, scars, complexion/tone), glasses, and any other identifying traits. Describe only what is visible; if a feature is absent, say so briefly (e.g. "clean-shaven, clear skin, no glasses"). This is not advice — do not flatter or soften it.
5. Rank EVERY haircut in the catalog below for THIS person. Give each a "fit" score 0-100 and a one-sentence "why" specific to their face and stated preferences.

Catalog:
${lines}

Ranking rules:
- Weight face shape, hair type/volume, the desired style, and daily-effort tolerance.
- Down-rank cuts that conflict with the user's stated past problems (e.g. "barber cuts too short" → lower fade/buzz scores).
- Be honest: a poor match scores low. Do not flatter.
- Return a ranking entry for every catalog id.`;
}

/** Strict JSON schema — every object closed, every property required. */
export function buildResponseSchema(catalog: CatalogEntry[]): Record<string, unknown> {
  const ids = catalog.map((c) => c.id);
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      analysis: {
        type: 'object',
        additionalProperties: false,
        properties: {
          shape: { type: 'string' },
          shapeConfidence: { type: 'number' },
          hair: { type: 'string' },
          volume: { type: 'string' },
          forehead: { type: 'string' },
          current: { type: 'string' },
          styleSummary: { type: 'string' },
          notes: { type: 'array', items: { type: 'string' } },
          facialFeatures: { type: 'string' },
        },
        required: [
          'shape',
          'shapeConfidence',
          'hair',
          'volume',
          'forehead',
          'current',
          'styleSummary',
          'notes',
          'facialFeatures',
        ],
      },
      ranking: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', enum: ids },
            fit: { type: 'number' },
            why: { type: 'string' },
          },
          required: ['id', 'fit', 'why'],
        },
      },
    },
    required: ['analysis', 'ranking'],
  };
}
