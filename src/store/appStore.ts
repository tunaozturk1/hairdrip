/**
 * Global app store. The spine of all data flow — quiz answers, the analyzed
 * face profile, ranked recommendations, saved cards and haircut history.
 *
 * Session data (quizAnswers, photoUri, analysis, recs) is intentionally NOT
 * persisted: a stale face scan is worse than none. Durable data (savedCards,
 * history, lastQuizAnswers) is persisted to AsyncStorage via `persist`.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyHistoryAdjustments } from '../services/recScoring';
import type {
  AnalysisResult,
  HistoryEntry,
  OnboardingAnswers,
  SavedCard,
  ScoredHaircut,
} from './types';

interface AppState {
  /** False until persisted state has rehydrated from AsyncStorage. */
  hydrated: boolean;

  // --- session (not persisted) ---
  quizAnswers: OnboardingAnswers | null;
  photoUri: string | null;
  photoBase64: string | null;
  analysis: AnalysisResult | null;
  recs: ScoredHaircut[];
  /** Generated "see it on you" previews, keyed by haircut id (base64 PNG). */
  tryOnImages: Record<string, string>;

  // --- durable (persisted) ---
  lastQuizAnswers: OnboardingAnswers | null;
  savedCards: SavedCard[];
  history: HistoryEntry[];

  // --- actions ---
  setQuizAnswers: (a: OnboardingAnswers) => void;
  setPhoto: (uri: string | null, base64: string | null) => void;
  setAnalysis: (a: AnalysisResult | null) => void;
  setRecs: (r: ScoredHaircut[]) => void;
  setTryOnImage: (haircutId: string, base64: string) => void;
  saveCard: (c: SavedCard) => void;
  addHistory: (h: HistoryEntry) => void;
  /** Clear the current run (quiz/photo/analysis/recs); keep durable data. */
  resetSession: () => void;
  /** Wipe everything, including saved cards and history. */
  resetAll: () => void;
}

const emptySession = {
  quizAnswers: null,
  photoUri: null,
  photoBase64: null,
  analysis: null,
  recs: [] as ScoredHaircut[],
  tryOnImages: {} as Record<string, string>,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,

      ...emptySession,

      lastQuizAnswers: null,
      savedCards: [],
      history: [],

      setQuizAnswers: (a) => set({ quizAnswers: a, lastQuizAnswers: a }),
      setPhoto: (uri, base64) => set({ photoUri: uri, photoBase64: base64 }),
      setAnalysis: (a) => set({ analysis: a }),
      // Apply the history guardrail at the single choke point so every run
      // gets it exactly once, regardless of which screen sets the recs.
      setRecs: (r) => set((s) => ({ recs: applyHistoryAdjustments(r, s.history) })),
      setTryOnImage: (haircutId, base64) =>
        set((s) => ({
          tryOnImages: { ...s.tryOnImages, [haircutId]: base64 },
        })),
      saveCard: (c) =>
        set((s) => ({
          savedCards: [
            c,
            ...s.savedCards.filter((x) => x.haircutId !== c.haircutId),
          ],
        })),
      addHistory: (h) => set((s) => ({ history: [h, ...s.history] })),
      resetSession: () => set({ ...emptySession }),
      resetAll: () =>
        set({
          ...emptySession,
          lastQuizAnswers: null,
          savedCards: [],
          history: [],
        }),
    }),
    {
      name: 'haircutcon/v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Only durable slices are written to disk.
      partialize: (s) => ({
        lastQuizAnswers: s.lastQuizAnswers,
        savedCards: s.savedCards,
        history: s.history,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);
