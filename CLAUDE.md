# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

Glow Up helps teenage boys and young men pick a haircut that fits their face shape, hair type, lifestyle, and confidence level. It addresses three problems: many don't know what cut suits them, can't clearly explain what they want to a barber, and leave the chair unhappy with the result.

The flow maps directly onto these: the **analysis** stage answers "what suits me," the **barber card** (`BarberScreen` / `src/data.ts` `BarberCard`) gives them precise wording to show a barber, and **history** logs outcomes so future recommendations improve. Keep this audience in mind — copy should be plain-spoken and confidence-building, not jargon-heavy.

## Commands

```bash
npm start          # Expo dev server (Metro), then press i / a / w for a target
npm run ios        # start + open iOS simulator
npm run android    # start + open Android emulator
npm run web        # start + open in browser
npx tsc --noEmit   # typecheck (no test runner or linter is configured)
```

There is no test suite. `src/services/recScoring.ts` is written to be testable in isolation (pure, no React/store imports) if tests are added.

## Environment

Copy `.env.example` to `.env`. The app reads `EXPO_PUBLIC_*` vars via `src/config/env.ts`:
`EXPO_PUBLIC_OPENAI_API_KEY`, `EXPO_PUBLIC_OPENAI_MODEL` (default `gpt-5.4`), `EXPO_PUBLIC_OPENAI_IMAGE_MODEL` (default `gpt-image-2`).

`EXPO_PUBLIC_*` vars are inlined at bundler startup, **not hot-reloaded** — restart `npm start` after editing `.env`. The OpenAI key ships inside the app bundle (demo-grade tradeoff); for a real release the OpenAI calls belong behind a server.

## Architecture

A single-screen Expo / React Native app (`com.haircutcon.app`, name "Glow Up") that analyzes a selfie to recommend men's haircuts.

**Navigation is hand-rolled.** `App.tsx` holds a `useState` screen name and a `switch` — there is no navigation library. The 9 screens run in a fixed flow: `welcome → onboarding → photo → analyzing → result → recs → detail → barber → history`. Screens receive `onNext`/`onBack`/etc. callbacks as props; the picked haircut id is lifted into `App.tsx` state.

**`src/store/appStore.ts` (Zustand) is the data spine.** It splits state into two slices:
- *Session* (`quizAnswers`, `photoUri`, `photoBase64`, `analysis`, `recs`, `tryOnImages`) — deliberately **not** persisted; a stale face scan is worse than none.
- *Durable* (`lastQuizAnswers`, `savedCards`, `history`) — persisted to AsyncStorage via `persist` + `partialize`. `App.tsx` waits on the `hydrated` flag before rendering.

`src/store/types.ts` is the single source of truth for domain shapes — screens and services import from there.

**The haircut catalog `src/data.ts` (`HAIRCUTS`) is the source of truth for recommendations.** On every analysis call it is projected into both the LLM prompt text and the strict JSON-schema id enum (`src/services/prompt.ts`), so the model can only return catalog ids.

**Analysis pipeline:**
1. `src/services/photo.ts` — captures a selfie, downscales to 1024px wide, re-encodes JPEG + base64.
2. `src/services/analysisApi.ts` — POSTs photo + quiz answers to OpenAI chat-completions with a strict `json_schema` response. Returns `{ analysis, recs }`. Failures throw a typed `AnalysisError` (`kind`: `config | network | timeout | server | parse`).
3. `AnalyzingScreen` runs this once per attempt. On `AnalysisError` it shows retry / "continue with a quick estimate" (`buildSeedAnalysis`/`buildSeedRecs` from `src/services/recommend.ts`, a deterministic offline fallback) / retake.

**History guardrail:** `src/services/recScoring.ts` `applyHistoryAdjustments` nudges each rec's `fit` (±10 cap) by the user's logged outcomes for that cut *family*, then re-ranks. This is applied at one choke point — `appStore.setRecs` — so every run gets it exactly once regardless of caller.

**Try-on:** `src/services/tryOnApi.ts` sends the selfie + cut description to OpenAI's image-edit endpoint; results are cached in `tryOnImages` keyed by haircut id.

**Theming:** `src/theme/` — `ThemeContext` provides `theme`/`mode`/`accent`; `tokens.ts` holds color tokens. App boots in dark mode with the `acid` accent. Components style off `useTheme()`, not hardcoded colors.

## Conventions

- Path alias `@/*` → `src/*` (tsconfig); TypeScript `strict` is on.
- `src/components/` — shared presentational primitives; `src/screens/` — one file per flow screen; `src/services/` — side-effecting / pure logic, no React.
