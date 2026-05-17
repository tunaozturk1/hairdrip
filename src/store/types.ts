/**
 * Shared domain types for the app store. Single source of truth — screens and
 * services import from here rather than redefining shapes inline.
 */
import type { BarberCard, Haircut } from '../data';

/** Answers collected by the 4-step onboarding quiz. */
export interface OnboardingAnswers {
  hair: string | null;
  thick: string | null;
  problem: string[];
  style: string | null;
  maint: string | null;
}

/**
 * Result of analyzing the user's selfie. Superset of the old static
 * `FaceProfile` plus the photo it was derived from and a timestamp.
 */
export interface AnalysisResult {
  shape: string;
  shapeConfidence: number;
  hair: string;
  volume: string;
  forehead: string;
  current: string;
  /** Headline phrase, e.g. "low-volume, textured". */
  styleSummary: string;
  notes: string[];
  photoUri: string;
  createdAt: number;
}

/**
 * A catalog haircut scored against the current user. `fit` and `why` hold the
 * personalized values; the remaining catalog fields are carried through.
 */
export interface ScoredHaircut extends Haircut {
  /** 1-based position in the ranked list. */
  rank: number;
  /** Catalog fit before any history adjustment, for reference. */
  baseFit: number;
  /** Set when history adjusted this cut's score (Phase 5). */
  reason?: string;
}

/** A barber card the user explicitly saved. */
export interface SavedCard {
  id: string;
  savedAt: number;
  haircutId: string;
  haircutName: string;
  ref: string;
  barber: BarberCard;
}

/** A past haircut the user logged, with their satisfaction feedback. */
export interface HistoryEntry {
  id: string;
  loggedAt: number;
  haircutId: string | null;
  /** Cut family ('fade' | 'crop' | ...) for history-based rec adjustments. */
  family: string | null;
  name: string;
  score: number;
  notes: string;
  tooShort: boolean;
  again: boolean;
}
