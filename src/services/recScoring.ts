/**
 * History guardrail (Phase 5).
 *
 * The Claude-vision backend ranks cuts against the user's face and quiz, but it
 * can't see what happened *after* past haircuts. This pure module nudges each
 * cut's fit score from the user's own logged outcomes — a deterministic,
 * capped adjustment so the History feature actually changes recommendations.
 *
 * No React/store imports: trivially testable in isolation.
 */
import type { HistoryEntry, ScoredHaircut } from '../store/types';

/** Hard cap on how far any one family can move (plan: ±10 fit). */
const CAP = 10;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

interface FamilySignal {
  /** Net fit delta for the family, clamped to ±CAP. */
  delta: number;
  /** Number of logged cuts in this family. */
  count: number;
  /** Mean satisfaction score across this family's logged cuts. */
  avgScore: number;
  /** How many of them came back too short. */
  tooShortCount: number;
}

/**
 * Aggregate logged outcomes per cut family. Each entry contributes
 * `(score - 6)` (satisfaction, range -5..+4) minus penalties for a cut that
 * came back too short or that the user wouldn't repeat. Contributions sum
 * across the family, then the total is clamped to ±CAP.
 */
function familySignals(history: HistoryEntry[]): Map<string, FamilySignal> {
  const acc = new Map<
    string,
    { sum: number; count: number; scoreSum: number; tooShortCount: number }
  >();

  for (const h of history) {
    if (!h.family) continue;
    const contribution =
      h.score - 6 + (h.tooShort ? -3 : 0) + (h.again ? 0 : -2);
    const a = acc.get(h.family) ?? {
      sum: 0,
      count: 0,
      scoreSum: 0,
      tooShortCount: 0,
    };
    a.sum += contribution;
    a.count += 1;
    a.scoreSum += h.score;
    a.tooShortCount += h.tooShort ? 1 : 0;
    acc.set(h.family, a);
  }

  const signals = new Map<string, FamilySignal>();
  for (const [family, a] of acc) {
    signals.set(family, {
      delta: clamp(a.sum, -CAP, CAP),
      count: a.count,
      avgScore: a.scoreSum / a.count,
      tooShortCount: a.tooShortCount,
    });
  }
  return signals;
}

/** Plain-language explanation of one family's adjustment, for `reason`. */
function reasonFor(family: string, s: FamilySignal): string {
  const cuts = `${family} cut${s.count === 1 ? '' : 's'}`;
  if (s.delta < 0) {
    const tail =
      s.tooShortCount > 0
        ? ` and ${s.tooShortCount > 1 ? 'they' : 'it'} came back too short`
        : '';
    return `Down-ranked ${-s.delta} pts — you rated ${cuts} ${Math.round(
      s.avgScore,
    )}/10${tail}.`;
  }
  return `Boosted ${s.delta} pts — your logged ${cuts} went well.`;
}

/**
 * Nudge each rec's `fit` by what the user's logged history says about its
 * family, then re-sort and re-rank. Pure: returns a new array, never mutates
 * the input. `baseFit` is left untouched; the delta lives in `reason`.
 */
export function applyHistoryAdjustments(
  recs: ScoredHaircut[],
  history: HistoryEntry[],
): ScoredHaircut[] {
  const signals = familySignals(history);
  if (signals.size === 0) return recs;

  return recs
    .map((rec) => {
      const s = signals.get(rec.family);
      if (!s || s.delta === 0) return { ...rec, reason: undefined };
      return {
        ...rec,
        fit: clamp(rec.fit + s.delta, 0, 100),
        reason: reasonFor(rec.family, s),
      };
    })
    .sort((a, b) => b.fit - a.fit)
    .map((rec, i) => ({ ...rec, rank: i + 1 }));
}

/**
 * The single strongest plain-language pattern across the user's logged cuts —
 * the real version of HistoryScreen's old hardcoded line. Returns `null` for
 * empty history.
 */
export function summarizeHistory(history: HistoryEntry[]): string | null {
  if (history.length === 0) return null;

  const tooShort = history.filter((h) => h.tooShort).length;
  if (tooShort >= 2) {
    return `Cuts came back too short ${tooShort} of ${history.length} times. We down-rank tighter cuts in your matches.`;
  }

  // Worst-performing family with enough signal to act on.
  const signals = familySignals(history);
  let worst: { family: string; s: FamilySignal } | null = null;
  for (const [family, s] of signals) {
    if (s.delta < 0 && (!worst || s.delta < worst.s.delta)) {
      worst = { family, s };
    }
  }
  if (worst) {
    return `Your ${worst.family} cuts have under-delivered (avg ${Math.round(
      worst.s.avgScore,
    )}/10). We down-rank that family in your next match.`;
  }

  const wins = history.filter((h) => h.score >= 7).length;
  if (wins === history.length) {
    return 'Every logged cut landed well. Keep showing the barber card.';
  }
  return `${wins} of ${history.length} logged cuts landed well. We factor the rest into your next match.`;
}
