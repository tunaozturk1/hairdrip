/**
 * Save a generated try-on preview into the device photo library.
 *
 * The try-on image is held in the store as a raw base64 PNG string. The OS
 * photo library saves from a file URI, not base64 — so we write the bytes to a
 * temp file in the cache directory first, then hand that file to MediaLibrary.
 *
 * Failures throw a plain `Error` with a user-facing message, matching how
 * `tryOnApi.ts` surfaces errors.
 */
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import type { Haircut } from '../data';

/** Save the base64 PNG preview of `haircut` to the device gallery. */
export async function saveTryOnToGallery(
  base64: string,
  haircut: Haircut,
): Promise<void> {
  if (!base64) {
    throw new Error('No preview image to save — generate one first.');
  }

  // `true` requests write-only access, the narrowest scope we need.
  const perm = await MediaLibrary.requestPermissionsAsync(true);
  if (!perm.granted) {
    throw new Error(
      'Photo access is needed to save the preview. Enable it in Settings.',
    );
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error('Could not save the preview — no cache directory.');
  }

  const fileUri = `${FileSystem.cacheDirectory}haircutcon-tryon-${haircut.id}.png`;

  try {
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await MediaLibrary.saveToLibraryAsync(fileUri);
  } catch {
    throw new Error('Could not save the preview to your photos.');
  }
}
