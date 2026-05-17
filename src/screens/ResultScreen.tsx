import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { buildSeedAnalysis } from '../services/recommend';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ResultScreen({ onNext, onBack }: Props) {
  const { theme } = useTheme();
  const analysis = useAppStore((s) => s.analysis);
  const p = analysis ?? buildSeedAnalysis('');

  return (
    <Screen
      footer={
        <PrimaryButton block onPress={onNext}>
          <Text style={[styles.btnText, { color: theme.accentFg }]}>See my matches</Text>
          <Icon name="arrow-right" size={18} color={theme.accentFg} />
        </PrimaryButton>
      }
    >
      <TopBar
        onBack={onBack}
        right={
          <Text style={[styles.eyebrowRight, { color: theme.fg3, fontFamily: theme.fonts.mono }]}>
            PROFILE
          </Text>
        }
      />
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 12 }}>
          SCAN COMPLETE
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          You'll suit <Text style={{ color: theme.amber }}>{p.styleSummary}</Text> styles.
        </Text>
        <Text style={[styles.subtitle, { color: theme.fg2 }]}>
          Based on a {p.shapeConfidence}% confident read of your face shape and hair.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.bgCard,
              borderColor: theme.lineSoft,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <View
            style={[
              styles.faceCardImg,
              { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
            ]}
          >
            {p.photoUri ? (
              <Image
                source={{ uri: p.photoUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
            <Svg width="100%" height="100%" viewBox="0 0 88 110">
              <Ellipse
                cx="44"
                cy="58"
                rx="26"
                ry="34"
                fill={theme.bg1}
                stroke={theme.amber}
                strokeWidth={1}
              />
              <Path
                d="M19 50 Q19 24 44 22 Q69 24 69 50 Q60 38 44 36 Q28 38 19 50 Z"
                fill={theme.amber}
                fillOpacity={0.7}
              />
              <G stroke={theme.amber} strokeWidth={0.8} fill="none" strokeDasharray="2 2">
                <Line x1="18" y1="58" x2="70" y2="58" />
                <Line x1="44" y1="24" x2="44" y2="92" />
              </G>
              <SvgText x="74" y="60" fontSize="6" fill={theme.fg3} fontFamily="monospace">
                W
              </SvgText>
              <SvgText x="46" y="98" fontSize="6" fill={theme.fg3} fontFamily="monospace">
                H
              </SvgText>
            </Svg>
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow style={{ marginBottom: 8 }}>FACE</Eyebrow>
            <View style={styles.statGrid}>
              <StatCell label="SHAPE" value={p.shape} />
              <StatCell label="HAIR" value={p.hair} />
              <StatCell label="VOLUME" value={p.volume} />
              <StatCell label="FOREHEAD" value={p.forehead} />
            </View>
          </View>
        </View>

        <Eyebrow style={{ marginBottom: 10 }}>WHAT THIS MEANS</Eyebrow>
        <View style={{ gap: 10, marginBottom: 24 }}>
          {p.notes.map((n, i) => (
            <View
              key={i}
              style={[
                styles.noteRow,
                { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
              ]}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 11,
                  color: theme.amber,
                  width: 22,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text style={{ flex: 1, fontSize: 14, color: theme.fg1, lineHeight: 20 }}>{n}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ width: '50%', paddingBottom: 10 }}>
      <Text
        style={{
          color: theme.fg3,
          fontSize: 11,
          fontFamily: theme.fonts.mono,
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <Text style={{ color: theme.fg0, fontWeight: '600', fontSize: 14, marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrowRight: {
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 22,
    lineHeight: 22,
  },
  card: {
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
  },
  faceCardImg: {
    width: 88,
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
