# HaircutCon

An app that helps teenage boys and young men choose a haircut that fits their face, hair type, lifestyle, and confidence level.

## The problem

Many boys and young men:

- **don't know what haircut suits them** — face shape, hair type, and volume all matter, but it's hard to judge for yourself;
- **can't clearly explain what they want** to a barber, so they end up pointing at a vague reference or trusting guesswork;
- **leave the barber unhappy** with a result that doesn't match what they pictured.

HaircutCon closes that gap end to end.

## How it works

1. **Onboarding quiz** — a few questions about hair type, thickness, problem areas, style, and how much daily effort you want.
2. **Selfie** — take or pick a photo; it's downscaled on-device before upload.
3. **Analysis** — the photo and quiz answers are analyzed to read your face shape, hair, and volume.
4. **Recommendations** — a ranked list of cuts from the catalog, each with a personalized fit score and a plain-language reason.
5. **Detail + barber card** — for any cut, see exactly what to ask for: top, sides, front, back, what to avoid, and a note — wording you can show your barber directly.
6. **History** — log how a past cut went. Future recommendations are nudged by what actually worked for you.

## Tech stack

- [Expo](https://expo.dev/) / React Native (TypeScript), new architecture enabled
- [Zustand](https://github.com/pmndrs/zustand) for state, persisted to AsyncStorage
- OpenAI for face analysis and the virtual "see it on you" try-on preview

## Getting started

```bash
npm install
cp .env.example .env      # then add your OpenAI API key
npm start                 # Expo dev server — press i / a / w for a target
```

`npm run ios` / `npm run android` / `npm run web` open a specific target directly.

### Environment

Set these in `.env` (see `.env.example`):

| Variable | Purpose | Default |
| --- | --- | --- |
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key | _required_ |
| `EXPO_PUBLIC_OPENAI_MODEL` | Vision model for face analysis | `gpt-5.4` |
| `EXPO_PUBLIC_OPENAI_IMAGE_MODEL` | Image model for try-on previews | `gpt-image-1` |

`EXPO_PUBLIC_*` vars are inlined into the bundle at startup and are **not** hot-reloaded — restart `npm start` after editing `.env`. The key ships inside the app bundle, which is a demo-grade tradeoff; a production release should move the OpenAI calls behind a server. Keep a hard spend cap on the key.

## Project layout

```
App.tsx            Screen flow (hand-rolled switch-based navigation)
src/screens/       One file per flow screen
src/components/    Shared presentational primitives
src/services/      Photo capture, OpenAI calls, recommendation scoring
src/store/         Zustand store + shared domain types
src/data.ts        Haircut catalog — the source of truth for recommendations
src/theme/         Theme tokens and context
```

See [CLAUDE.md](CLAUDE.md) for a deeper architecture overview.
