import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  G,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Circle,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../components/Badge';
import { PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { useTheme } from '../theme/ThemeContext';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Screen
      footer={
        <View>
          <PrimaryButton block onPress={onNext}>
            <Text style={[styles.btnText, { color: theme.accentFg }]}>Find my haircut</Text>
            <Icon name="arrow-right" size={18} color={theme.accentFg} />
          </PrimaryButton>
          <Text
            style={[
              styles.takesText,
              { fontFamily: theme.fonts.mono, color: theme.fg3 },
            ]}
          >
            Takes under 2 minutes · No account needed
          </Text>
        </View>
      }
    >
      <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
        <View style={styles.headerRow}>
          <Eyebrow color={theme.amber}>HAIRCUTCON · MVP</Eyebrow>
          <Eyebrow>v0.1</Eyebrow>
        </View>

        <View
          style={[
            styles.hero,
            {
              borderColor: theme.lineSoft,
              backgroundColor: theme.bg2,
            },
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 300 280"
            style={StyleSheet.absoluteFill as any}
          >
            <Defs>
              <RadialGradient id="hero-glow" cx="0.6" cy="0.4" r="0.7">
                <Stop offset="0%" stopColor={theme.amber} stopOpacity={0.35} />
                <Stop offset="100%" stopColor={theme.amber} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="300" height="280" fill="url(#hero-glow)" />
            <G transform="translate(150 140)">
              <Ellipse cx="0" cy="20" rx="62" ry="78" fill={theme.bg1} stroke={theme.line} strokeWidth={1} />
              <Path
                d="M-58 -10 Q-56 -68 0 -70 Q56 -68 58 -10 Q56 -42 38 -52 Q10 -60 -10 -54 Q-38 -48 -58 -10 Z"
                fill={theme.amber}
                fillOpacity={0.85}
              />
              <Path
                d="M-40 -22 Q-32 -16 -20 -18 Q-8 -14 4 -20 Q18 -16 32 -22 Q24 -8 0 -6 Q-24 -8 -40 -22 Z"
                fill={theme.amberDim}
              />
              <Circle cx="-16" cy="14" r="1.5" fill={theme.fg2} />
              <Circle cx="16" cy="14" r="1.5" fill={theme.fg2} />
              <Path
                d="M-10 36 Q0 42 10 36"
                fill="none"
                stroke={theme.fg2}
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            </G>
            {[
              [20, 20],
              [280, 20],
              [20, 260],
              [280, 260],
            ].map(([x, y], i) => (
              <G key={i} stroke={theme.fg3} strokeOpacity={0.5} strokeWidth={1} fill="none">
                <Path d={`M${x - 8} ${y} h16 M${x} ${y - 8} v16`} />
              </G>
            ))}
          </Svg>

          <View style={styles.heroBadge}>
            <Badge kind="amber">SCAN READY</Badge>
          </View>
          <Text
            style={[
              styles.heroMeta,
              { fontFamily: theme.fonts.mono, color: theme.fg3 },
            ]}
          >
            N=12,481 CUTS · 3 BARBERS REVIEWED
          </Text>
        </View>

        <Text style={[styles.h1, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          Avoid another <Text style={{ color: theme.amber }}>bad haircut.</Text>
        </Text>
        <Text style={[styles.lede, { color: theme.fg2 }]}>
          Upload a selfie. Get cuts that actually fit your face — and a card to show your barber, word-for-word.
        </Text>

        <View style={styles.steps}>
          {[
            { n: '01', l: 'Scan face' },
            { n: '02', l: 'Get matches' },
            { n: '03', l: 'Show barber' },
          ].map((s) => (
            <View
              key={s.n}
              style={[
                styles.stepCard,
                { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
              ]}
            >
              <Text style={[styles.stepNum, { color: theme.amber, fontFamily: theme.fonts.mono }]}>
                {s.n}
              </Text>
              <Text style={[styles.stepLabel, { color: theme.fg1 }]}>{s.l}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  hero: {
    height: 280,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 28,
    position: 'relative',
  },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  heroMeta: {
    position: 'absolute',
    bottom: 14,
    right: 16,
    fontSize: 10,
    letterSpacing: 1,
  },
  h1: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: 14,
    maxWidth: 320,
  },
  lede: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 320,
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  stepCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepNum: {
    fontSize: 10,
    letterSpacing: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  takesText: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 11,
    letterSpacing: 0.7,
  },
});
