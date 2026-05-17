import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { GhostButton, PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { AnalysisError, analyzePhoto } from '../services/analysisApi';
import { buildSeedAnalysis, buildSeedRecs } from '../services/recommend';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onDone: () => void;
  onBack: () => void;
}

const ITEMS = [
  'Locating face landmarks',
  'Measuring face shape ratio',
  'Reading hair type and volume',
  'Cross-checking the cut catalog',
  'Filtering for your style and effort',
];

export function AnalyzingScreen({ onDone, onBack }: Props) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'running' | 'error'>('running');
  const [errorMsg, setErrorMsg] = useState('');
  const [attempt, setAttempt] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // onDone identity changes every render — keep it in a ref so the analysis
  // effect runs once per attempt, not on every parent re-render.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Run the real analysis once per attempt.
  useEffect(() => {
    let cancelled = false;
    setStatus('running');
    setStep(0);

    (async () => {
      const { photoUri, photoBase64, quizAnswers, setAnalysis, setRecs } =
        useAppStore.getState();
      try {
        const { analysis, recs } = await analyzePhoto({
          photoUri: photoUri ?? '',
          photoBase64: photoBase64 ?? '',
          quizAnswers,
        });
        if (cancelled) return;
        setAnalysis(analysis);
        setRecs(recs);
        onDoneRef.current();
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(
          e instanceof AnalysisError
            ? e.message
            : 'Something went wrong analyzing your photo.',
        );
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Cycle the progress checklist while the request is in flight.
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(
      () => setStep((s) => (s + 1) % (ITEMS.length + 1)),
      620,
    );
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  /** Offline fallback — proceed with a neutral estimate when the API fails. */
  const useEstimate = () => {
    const { photoUri, setAnalysis, setRecs } = useAppStore.getState();
    setAnalysis(buildSeedAnalysis(photoUri ?? ''));
    setRecs(buildSeedRecs());
    onDoneRef.current();
  };

  if (status === 'error') {
    return (
      <Screen
        footer={
          <View style={{ gap: 10 }}>
            <PrimaryButton block onPress={() => setAttempt((a) => a + 1)}>
              <Icon name="sparkle" size={18} color={theme.accentFg} />
              <Text style={[styles.btnText, { color: theme.accentFg }]}>
                Try again
              </Text>
            </PrimaryButton>
            <GhostButton block onPress={useEstimate}>
              <Text style={[styles.btnText, { color: theme.fg1 }]}>
                Continue with a quick estimate
              </Text>
            </GhostButton>
            <GhostButton block onPress={onBack}>
              <Text style={[styles.btnText, { color: theme.fg1 }]}>
                Retake photo
              </Text>
            </GhostButton>
          </View>
        }
      >
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Eyebrow color={theme.bad}>ANALYSIS FAILED</Eyebrow>
        </View>
        <View style={styles.errorWrap}>
          <View style={[styles.errorIcon, { backgroundColor: theme.bg2 }]}>
            <Icon name="camera" size={28} color={theme.bad} />
          </View>
          <Text
            style={[
              styles.title,
              { color: theme.fg0, fontFamily: theme.fonts.display, textAlign: 'center' },
            ]}
          >
            We couldn't read your photo
          </Text>
          <Text style={{ color: theme.fg2, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            {errorMsg}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <Eyebrow color={theme.amber}>ANALYZING</Eyebrow>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 40 }}>
        <View>
          <Text
            style={[
              styles.title,
              { color: theme.fg0, fontFamily: theme.fonts.display },
            ]}
          >
            Reading your face
            <Animated.Text style={{ color: theme.amber, opacity: pulseAnim }}>
              …
            </Animated.Text>
          </Text>
          <Text style={{ color: theme.fg2, fontSize: 15 }}>
            This takes a few seconds. Don't close the app.
          </Text>
        </View>

        <View style={styles.scanWrap}>
          <Svg width={200} height={240} viewBox="0 0 200 240">
            <Ellipse
              cx="100"
              cy="120"
              rx="62"
              ry="80"
              fill={theme.bg1}
              stroke={theme.amber}
              strokeWidth={1}
              strokeDasharray="3 5"
            />
            <Path
              d="M40 100 Q40 50 100 46 Q160 50 160 100 Q150 78 100 76 Q50 78 40 100 Z"
              fill={theme.amber}
              fillOpacity={0.5}
            />
            {[
              [78, 105],
              [122, 105],
              [100, 128],
              [86, 148],
              [114, 148],
              [100, 162],
            ].map(([x, y], i) => (
              <Circle
                key={i}
                cx={x}
                cy={y}
                r={i < step ? 3 : 2}
                fill={i < step ? theme.amber : theme.fg4}
              />
            ))}
          </Svg>
        </View>

        <View style={{ gap: 10 }}>
          {ITEMS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <View
                key={i}
                style={[
                  styles.itemRow,
                  { opacity: done ? 1 : active ? 0.85 : 0.35 },
                ]}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: done ? theme.amber : theme.bg2,
                    borderWidth: 1,
                    borderColor: done ? theme.amber : theme.line,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done && <Icon name="check" size={12} color={theme.accentFg} />}
                  {active && (
                    <Animated.View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: theme.amber,
                        opacity: pulseAnim,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: theme.fonts.mono,
                    fontSize: 12,
                    color: theme.fg1,
                    letterSpacing: 0.2,
                  }}
                >
                  {label}
                </Text>
              </View>
            );
          })}
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
    marginBottom: 6,
  },
  scanWrap: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorWrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
