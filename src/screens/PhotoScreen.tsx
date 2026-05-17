import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Circle, Defs, Ellipse, Mask, Path, Rect } from 'react-native-svg';
import { GhostButton, PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { Icon, IconName } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { captureSelfie, processCapture } from '../services/photo';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function PhotoScreen({ onNext, onBack }: Props) {
  const { theme } = useTheme();
  const setPhoto = useAppStore((s) => s.setPhoto);
  const [taken, setTaken] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [permDenied, setPermDenied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Ask for camera access on mount so the live preview is ready to go.
  useEffect(() => {
    if (camPerm && !camPerm.granted && camPerm.canAskAgain) {
      requestCamPerm();
    }
  }, [camPerm, requestCamPerm]);

  const camGranted = camPerm?.granted ?? false;
  const camBlocked = !!camPerm && !camPerm.granted && !camPerm.canAskAgain;

  const handleTakePhoto = async () => {
    if (capturing) return;
    if (!camGranted) {
      const res = await requestCamPerm();
      if (!res.granted) setPermDenied(true);
      return;
    }
    if (!cameraRef.current) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (!photo) return;
      const processed = await processCapture(photo.uri, photo.width, photo.height);
      setPreview(processed.uri);
      setPhoto(processed.uri, processed.base64);
      setTaken(true);
    } catch {
      Alert.alert('Something went wrong', 'Could not capture that photo. Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  const handleUpload = async () => {
    setPermDenied(false);
    const result = await captureSelfie('library');
    if (result.ok) {
      setPreview(result.uri);
      setPhoto(result.uri, result.base64);
      setTaken(true);
    } else if (result.reason === 'denied') {
      setPermDenied(true);
    } else if (result.reason === 'error') {
      Alert.alert('Something went wrong', 'Could not load that photo. Please try again.');
    }
    // 'canceled' — the user backed out; do nothing.
  };

  const handleRetake = () => {
    setTaken(false);
    setPreview(null);
    setPhoto(null, null);
  };

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    if (!taken) loop.start();
    return () => loop.stop();
  }, [taken, scanAnim]);

  const tips: { ico: IconName; t: string }[] = [
    { ico: 'light', t: 'Good lighting' },
    { ico: 'face', t: 'Neutral expression' },
    { ico: 'no-hat', t: 'No hat or hood' },
    { ico: 'eye', t: 'Hair fully visible' },
  ];

  return (
    <Screen
      footer={
        !taken ? (
          <View style={{ gap: 10 }}>
            <PrimaryButton block onPress={handleTakePhoto} disabled={capturing}>
              <Icon name="camera" size={18} color={theme.accentFg} />
              <Text style={[styles.btnText, { color: theme.accentFg }]}>
                {capturing ? 'Capturing…' : 'Take photo'}
              </Text>
            </PrimaryButton>
            <GhostButton block onPress={handleUpload}>
              <Icon name="upload" size={16} color={theme.fg1} />
              <Text style={[styles.btnText, { color: theme.fg1 }]}>
                Upload from camera roll
              </Text>
            </GhostButton>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <PrimaryButton block onPress={onNext}>
              <Icon name="sparkle" size={18} color={theme.accentFg} />
              <Text style={[styles.btnText, { color: theme.accentFg }]}>
                Analyze my face
              </Text>
            </PrimaryButton>
            <GhostButton block onPress={handleRetake}>
              <Text style={[styles.btnText, { color: theme.fg1 }]}>Retake</Text>
            </GhostButton>
          </View>
        )
      }
    >
      <TopBar onBack={onBack} />
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 12 }}>
          STEP 02 · SCAN
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          Let's find what actually fits your face.
        </Text>
        <Text style={[styles.subtitle, { color: theme.fg2 }]}>
          Line your face up inside the oval. We analyze face shape, hair type,
          and volume.
        </Text>

        <View
          style={[
            styles.viewfinder,
            { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
          ]}
        >
          {taken && preview ? (
            <Image
              source={{ uri: preview }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : camGranted ? (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="front"
            />
          ) : null}
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 200 250"
            style={StyleSheet.absoluteFill as any}
            pointerEvents="none"
          >
            <Defs>
              <Mask id="faceMask">
                <Rect width="200" height="250" fill="white" />
                <Ellipse cx="100" cy="120" rx="55" ry="75" fill="black" />
              </Mask>
            </Defs>
            <Rect width="200" height="250" fill="rgba(15,11,7,0.55)" mask="url(#faceMask)" />
            <Ellipse
              cx="100"
              cy="120"
              rx="55"
              ry="75"
              fill="none"
              stroke={taken ? theme.good : theme.amber}
              strokeWidth={1.4}
              strokeDasharray="4 4"
            />
            {taken &&
              [
                [80, 105],
                [120, 105],
                [100, 128],
                [88, 150],
                [112, 150],
                [100, 160],
              ].map(([x, y], i) => (
                <Circle key={i} cx={x} cy={y} r="2" fill={theme.good} />
              ))}
            {[
              [18, 18],
              [182, 18],
              [18, 232],
              [182, 232],
            ].map(([x, y], i) => (
              <Path
                key={i}
                d={`M${x - 8} ${y} h16 M${x} ${y - 8} v16`}
                stroke={taken ? theme.good : theme.amber}
                strokeWidth={1.2}
                fill="none"
              />
            ))}
          </Svg>

          {!taken && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.scanLine,
                {
                  backgroundColor: theme.amberBgStrong,
                  transform: [
                    {
                      translateY: scanAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 350],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          {!taken && !camGranted && (
            <View style={styles.camOff} pointerEvents="none">
              <Icon name="camera" size={22} color={theme.fg2} />
              <Text style={[styles.camOffText, { color: theme.fg2 }]}>
                {camBlocked
                  ? 'Camera access is off'
                  : 'Allow camera access to start'}
              </Text>
            </View>
          )}

          <View style={styles.hudTop}>
            <Text
              style={[
                styles.hudText,
                {
                  color: taken ? theme.good : theme.amber,
                  fontFamily: theme.fonts.mono,
                },
              ]}
            >
              ● {taken ? 'CAPTURED' : 'ALIGN FACE'}
            </Text>
            <Text
              style={[
                styles.hudText,
                {
                  color: taken ? theme.good : theme.amber,
                  fontFamily: theme.fonts.mono,
                },
              ]}
            >
              FRONT · LIVE
            </Text>
          </View>

          {taken && (
            <View style={styles.hudBottom}>
              <Text
                style={[
                  styles.hudText,
                  { color: theme.good, fontFamily: theme.fonts.mono },
                ]}
              >
                FACE LOCKED
              </Text>
              <Text
                style={[
                  styles.hudText,
                  { color: theme.good, fontFamily: theme.fonts.mono },
                ]}
              >
                QUALITY 94%
              </Text>
            </View>
          )}
        </View>

        {(permDenied || camBlocked) && (
          <View
            style={[
              styles.permBox,
              { backgroundColor: theme.bg1, borderColor: theme.bad },
            ]}
          >
            <Text style={{ fontSize: 13, color: theme.fg1, lineHeight: 19 }}>
              Camera and photo access is off. Turn it on in Settings to scan your face.
            </Text>
            <GhostButton block onPress={() => Linking.openSettings()}>
              <Icon name="arrow-right" size={15} color={theme.fg1} />
              <Text style={[styles.btnText, { color: theme.fg1 }]}>Open Settings</Text>
            </GhostButton>
          </View>
        )}

        <View style={styles.tipsGrid}>
          {tips.map((tip) => (
            <View
              key={tip.t}
              style={[
                styles.tipRow,
                { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
              ]}
            >
              <View
                style={[
                  styles.tipIcon,
                  { backgroundColor: theme.amberBg },
                ]}
              >
                <Icon name={tip.ico} size={14} color={theme.amber} />
              </View>
              <Text style={{ fontSize: 13, color: theme.fg1, flex: 1 }}>{tip.t}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  viewfinder: {
    aspectRatio: 4 / 5,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
  },
  camOff: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  camOffText: {
    fontSize: 13,
    fontWeight: '500',
  },
  hudTop: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudBottom: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudText: {
    fontSize: 10,
    letterSpacing: 1,
  },
  permBox: {
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipRow: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
