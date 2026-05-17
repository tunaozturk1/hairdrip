import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Badge, RegretBadge } from '../components/Badge';
import { PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { FitRing } from '../components/FitRing';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { TryOnCard } from '../components/TryOnCard';
import { HAIRCUTS } from '../data';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  id: string;
  onBack: () => void;
  onBarber: (id: string) => void;
}

export function DetailScreen({ id, onBack, onBarber }: Props) {
  const { theme } = useTheme();
  const recs = useAppStore((s) => s.recs);
  // Prefer the scored rec (personalized fit + why + history reason); fall back
  // to the catalog when the detail is opened outside a scored run.
  const scored = recs.find((h) => h.id === id);
  const c = scored ?? HAIRCUTS.find((h) => h.id === id);
  if (!c) return null;

  const previewSentence = `"Top ${c.barber.top
    .toLowerCase()
    .split('.')[0]
    .replace(/^keep /, '')}, ${c.barber.sides.toLowerCase().split('.')[0]}…"`;

  return (
    <Screen
      footer={
        <PrimaryButton block onPress={() => onBarber(c.id)}>
          <Icon name="scissors" size={18} color={theme.accentFg} />
          <Text style={[styles.btnText, { color: theme.accentFg }]}>Create Barber Card</Text>
        </PrimaryButton>
      }
    >
      <TopBar onBack={onBack} />
      <View style={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: 24 }}>
        <View
          style={[
            styles.hero,
            { backgroundColor: theme.bgCardHi, borderColor: theme.lineSoft },
          ]}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 320 280"
            style={StyleSheet.absoluteFill as any}
          >
            <Defs>
              <RadialGradient id="detail-glow" cx="0.5" cy="0.4" r="0.7">
                <Stop offset="0%" stopColor={theme.amber} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={theme.amber} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="320" height="280" fill="url(#detail-glow)" />
            <G transform="translate(160 152)">
              <Ellipse cx="0" cy="20" rx="68" ry="86" fill={theme.bg1} stroke={theme.line} strokeWidth={1} />
              <Path
                d="M-64 -8 Q-62 -76 0 -78 Q62 -76 64 -8 Q60 -46 40 -56 Q10 -64 -10 -58 Q-40 -52 -64 -8 Z"
                fill={theme.amber}
                fillOpacity={0.9}
              />
              <Path
                d="M-44 -26 Q-36 -18 -22 -20 Q-8 -16 6 -22 Q20 -18 36 -26 Q26 -8 0 -4 Q-26 -8 -44 -26 Z"
                fill={theme.amberDim}
              />
            </G>
          </Svg>
          <View style={styles.heroBadges}>
            <RegretBadge level={c.regret} />
            <Badge kind="amber">FIT {c.fit}%</Badge>
          </View>
          <View style={styles.heroRing}>
            <FitRing value={c.fit} size={56} stroke={5} />
          </View>
          <Text
            style={[
              styles.heroRef,
              { color: theme.fg3, fontFamily: theme.fonts.mono },
            ]}
          >
            REF · {c.id.toUpperCase()}
          </Text>
        </View>

        <Eyebrow color={theme.amber} style={{ marginBottom: 8 }}>
          RECOMMENDED FOR YOU
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          {c.name}
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          <Badge kind="neutral">{c.maint.toUpperCase()}</Badge>
          <Badge kind="neutral">⏱ {c.effort.toUpperCase()}</Badge>
        </View>

        <TryOnCard haircut={c} />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.bgCard,
              borderColor: theme.lineSoft,
              borderRadius: theme.radii.lg,
              marginBottom: 14,
            },
          ]}
        >
          <Eyebrow color={theme.amber} style={{ marginBottom: 8 }}>
            WHY IT FITS
          </Eyebrow>
          <Text style={{ fontSize: 15, color: theme.fg1, lineHeight: 22 }}>{c.why}</Text>
        </View>

        {scored?.reason && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.amberBg,
                borderColor: theme.amber,
                borderRadius: theme.radii.lg,
                marginBottom: 14,
              },
            ]}
          >
            <Eyebrow color={theme.amber} style={{ marginBottom: 8 }}>
              ADJUSTED FROM YOUR HISTORY
            </Eyebrow>
            <Text style={{ fontSize: 14, color: theme.fg1, lineHeight: 21 }}>
              {scored.reason}
            </Text>
          </View>
        )}

        <View style={styles.twoCol}>
          <View
            style={[
              styles.card,
              styles.colCard,
              {
                backgroundColor: theme.bgCard,
                borderColor: theme.lineSoft,
                borderRadius: theme.radii.lg,
              },
            ]}
          >
            <Text
              style={{
                color: theme.good,
                fontFamily: theme.fonts.mono,
                fontSize: 11,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              ✓ GOOD FOR
            </Text>
            {c.goodFor.map((g, i) => (
              <Text key={i} style={{ fontSize: 13, color: theme.fg1, lineHeight: 18, paddingVertical: 3 }}>
                {g}
              </Text>
            ))}
          </View>
          <View
            style={[
              styles.card,
              styles.colCard,
              {
                backgroundColor: theme.bgCard,
                borderColor: theme.lineSoft,
                borderRadius: theme.radii.lg,
              },
            ]}
          >
            <Text
              style={{
                color: theme.bad,
                fontFamily: theme.fonts.mono,
                fontSize: 11,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              ✗ AVOID IF
            </Text>
            {c.avoidIf.map((g, i) => (
              <Text key={i} style={{ fontSize: 13, color: theme.fg1, lineHeight: 18, paddingVertical: 3 }}>
                {g}
              </Text>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.bgCard,
              borderColor: theme.lineSoft,
              borderRadius: theme.radii.lg,
              marginTop: 14,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Eyebrow color={theme.amber}>BARBER CARD · PREVIEW</Eyebrow>
            <Text
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 10,
                color: theme.fg3,
                letterSpacing: 0.8,
              }}
            >
              EN · METRIC
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: theme.fg2, lineHeight: 22, marginBottom: 8 }}>
            {previewSentence}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: theme.fg3,
              fontFamily: theme.fonts.mono,
              letterSpacing: 0.4,
            }}
          >
            + 5 more instructions
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 280,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 18,
    position: 'relative',
  },
  heroBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    gap: 6,
  },
  heroRing: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  heroRef: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 10,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  colCard: {
    flex: 1,
    padding: 14,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
