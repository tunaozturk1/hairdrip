/**
 * Seed analysis + recommendations.
 *
 * Until the real Claude-vision backend lands (Phase 4), these provide a
 * deterministic fallback so the result/recs screens render real store data.
 * `buildSeedRecs` also stays as the offline fallback when the API is
 * unreachable.
 */
import { HAIRCUTS } from '../data';
import type { AnalysisResult, ScoredHaircut } from '../store/types';

/** Rank the full catalog by its baseline fit score. */
export function buildSeedRecs(): ScoredHaircut[] {
  return [...HAIRCUTS]
    .sort((a, b) => b.fit - a.fit)
    .map((h, i) => ({ ...h, rank: i + 1, baseFit: h.fit }));
}

/** A neutral placeholder face read, tagged with the photo it (didn't) analyze. */
export function buildSeedAnalysis(photoUri: string): AnalysisResult {
  return {
    shape: 'Oval',
    shapeConfidence: 91,
    hair: 'Wavy, medium thickness',
    volume: 'Medium-high',
    forehead: 'Medium, partially visible',
    current: 'Grown-out medium cut',
    styleSummary: 'low-volume, textured',
    notes: [
      'Your face is slightly longer than wide — add width near the temples, not height on top.',
      'Medium-density wavy hair holds texture well — fringe and crop cuts will work.',
      'Avoid styles that add length: tall quiffs, slick-backs, full pompadours.',
    ],
    photoUri,
    createdAt: Date.now(),
  };
}
