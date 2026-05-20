import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
          <Eyebrow color={theme.amber}>GLOW UP</Eyebrow>
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
          <Image
            source={require('../../assets/icon.png')}
            style={StyleSheet.absoluteFill}
            resizeMode="repeat"
          />

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
