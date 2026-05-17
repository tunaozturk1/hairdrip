/**
 * Selfie capture: permission request, camera/library pick, downscale, and
 * base64 encoding for the analysis upload.
 *
 * The result is resized to a max width and re-encoded as JPEG so the analysis
 * upload stays small and cheap. All failure modes are returned as data.
 */
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/** Max width of the processed selfie. */
const MAX_WIDTH = 1024;

export type CaptureResult =
  | { ok: true; uri: string; base64: string }
  | { ok: false; reason: 'denied' | 'canceled' | 'error' };

/** Resize (if wide), re-encode as JPEG, and return both a URI and base64. */
async function process(
  uri: string,
  width: number,
): Promise<{ uri: string; base64: string }> {
  const context = ImageManipulator.manipulate(uri);
  if (width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const ref = await context.renderAsync();
  const out = await ref.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
    base64: true,
  });
  return { uri: out.uri, base64: out.base64 ?? '' };
}

/**
 * Process a photo captured by the in-app camera: center-crop to the 4:5
 * viewfinder framing, downscale, and re-encode as JPEG + base64.
 */
export async function processCapture(
  uri: string,
  width: number,
  height: number,
): Promise<{ uri: string; base64: string }> {
  const context = ImageManipulator.manipulate(uri);

  // Center-crop to 4:5 portrait so the saved photo matches what the oval
  // viewfinder showed the user.
  const targetRatio = 4 / 5;
  let cropW = width;
  if (width / height > targetRatio) {
    cropW = Math.round(height * targetRatio);
    context.crop({
      originX: Math.round((width - cropW) / 2),
      originY: 0,
      width: cropW,
      height,
    });
  } else {
    const cropH = Math.round(width / targetRatio);
    context.crop({
      originX: 0,
      originY: Math.round((height - cropH) / 2),
      width,
      height: cropH,
    });
  }

  if (cropW > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const ref = await context.renderAsync();
  const out = await ref.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
    base64: true,
  });
  return { uri: out.uri, base64: out.base64 ?? '' };
}

/** Capture a selfie from the camera or the photo library. */
export async function captureSelfie(
  source: 'camera' | 'library',
): Promise<CaptureResult> {
  try {
    const perm =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return { ok: false, reason: 'denied' };

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    };
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            ...options,
            cameraType: ImagePicker.CameraType.front,
          })
        : await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled || !result.assets?.length) {
      return { ok: false, reason: 'canceled' };
    }
    const asset = result.assets[0];
    const processed = await process(asset.uri, asset.width ?? MAX_WIDTH + 1);
    return { ok: true, ...processed };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
