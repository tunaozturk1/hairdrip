/**
 * Static reference photos for each catalog haircut, keyed by `Haircut.id`.
 *
 * Kept out of `src/data.ts` so that file stays pure data with no asset
 * `require()`s. The PNGs are produced once by
 * `scripts/generate-haircut-thumbnails.mjs` and committed under `assets/`.
 *
 * Look up with `HAIRCUT_IMAGES[id]` — an id with no entry yields `undefined`,
 * which callers fall back on gracefully.
 */
import type { ImageSourcePropType } from 'react-native';

export const HAIRCUT_IMAGES: Record<string, ImageSourcePropType> = {
  'fringe-low-taper': require('../../assets/haircuts/fringe-low-taper.png'),
  'french-crop': require('../../assets/haircuts/french-crop.png'),
  'messy-medium': require('../../assets/haircuts/messy-medium.png'),
  'mid-fade-pomp': require('../../assets/haircuts/mid-fade-pomp.png'),
  'buzz-1': require('../../assets/haircuts/buzz-1.png'),
};
