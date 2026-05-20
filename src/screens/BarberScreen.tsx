import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { GhostButton, PrimaryButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { HAIRCUTS } from '../data';
import { useAppStore } from '../store/appStore';
import type { SavedCard } from '../store/types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  id: string;
  onBack: () => void;
  onSaved: () => void;
}

export function BarberScreen({ id, onBack, onSaved }: Props) {
  const { theme } = useTheme();
  const c = HAIRCUTS.find((h) => h.id === id);
  const saveCard = useAppStore((s) => s.saveCard);
  const addHistory = useAppStore((s) => s.addHistory);
  const alreadySaved = useAppStore((s) =>
    s.savedCards.some((x) => x.haircutId === id),
  );
  const [saved, setSaved] = useState(alreadySaved);
  // Minimal in-place rating prompt (Phase 5). The full LogCutSheet is Phase 6.
  const [logging, setLogging] = useState(false);
  const [score, setScore] = useState(8);
  const [tooShort, setTooShort] = useState(false);
  const [again, setAgain] = useState(true);
  if (!c) return null;
  const b = c.barber;

  const ref = `HC-${(
    (Math.abs(c.id.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)) * 7) %
    99999
  )
    .toString()
    .padStart(5, '0')}`;
  const date = 'MAY 13, 2026 · 14:22';

  const buildCard = (): SavedCard => ({
    id: `card-${c.id}-${Date.now()}`,
    savedAt: Date.now(),
    haircutId: c.id,
    haircutName: c.name,
    ref,
    barber: b,
  });

  const handleSave = () => {
    if (!saved) saveCard(buildCard());
    setSaved(true);
  };

  const handleLog = () => {
    if (!saved) saveCard(buildCard());
    addHistory({
      id: `h-${c.id}-${Date.now()}`,
      loggedAt: Date.now(),
      haircutId: c.id,
      family: c.family,
      name: c.name,
      score,
      notes: logNote(score, tooShort, again),
      tooShort,
      again,
    });
    onSaved();
  };

  return (
    <Screen
      footer={
        <PrimaryButton
          block
          onPress={logging ? handleLog : () => setLogging(true)}
        >
          <Icon name="check" size={18} color={theme.accentFg} />
          <Text style={[styles.btnText, { color: theme.accentFg }]}>
            {logging ? 'Save to history' : 'I got the cut — log it'}
          </Text>
        </PrimaryButton>
      }
    >
      <TopBar
        onBack={onBack}
        right={
          <Pressable
            onPress={handleSave}
            accessibilityLabel="Save"
            style={[
              styles.iconBtn,
              {
                backgroundColor: saved ? theme.amber : theme.bg2,
                borderColor: theme.lineSoft,
              },
            ]}
          >
            <Icon
              name={saved ? 'check' : 'save'}
              size={15}
              color={saved ? theme.accentFg : theme.fg1}
            />
          </Pressable>
        }
      />

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 8 }}>
          SHOW THIS TO YOUR BARBER
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          Don't let the barber guess.
        </Text>

        {/* Receipt */}
        <View style={styles.receiptOuter}>
          <Notches edge="top" />
          <View style={styles.receipt}>
            {/* header */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  letterSpacing: 2.5,
                  color: '#1a1612',
                  fontFamily: theme.fonts.mono,
                }}
              >
                GLOW UP
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  marginTop: 2,
                  opacity: 0.65,
                  color: '#1a1612',
                  fontFamily: theme.fonts.mono,
                }}
              >
                · BARBER INSTRUCTION CARD ·
              </Text>
            </View>

            <Dashed />

            <ReceiptKV k="REF" v={ref} bold />
            <ReceiptKV k="DATE" v={date} />
            <ReceiptKV k="FOR" v="FRONT-OF-CHAIR" />

            <Dashed />

            <View style={{ alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, letterSpacing: 1.6, color: '#1a1612', fontFamily: theme.fonts.mono }}>
                STYLE
              </Text>
              <Text
                style={{
                  fontFamily: theme.fonts.display,
                  fontSize: 18,
                  fontWeight: '700',
                  marginTop: 2,
                  color: '#1a1612',
                  textAlign: 'center',
                }}
              >
                {b.style}
              </Text>
            </View>

            <Dashed />

            <ReceiptRow label="TOP" text={b.top} />
            <ReceiptRow label="SIDES" text={b.sides} />
            <ReceiptRow label="FRONT" text={b.front} />
            <ReceiptRow label="BACK" text={b.back} />

            <Dashed />

            <View
              style={{
                backgroundColor: 'rgba(224, 89, 78, 0.12)',
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginHorizontal: -6,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: 'rgba(150, 40, 30, 0.5)',
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  letterSpacing: 1.6,
                  color: '#8a2a20',
                  marginBottom: 4,
                  fontFamily: theme.fonts.mono,
                }}
              >
                ✗ DO NOT DO
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#3d1a14',
                  lineHeight: 18,
                  fontFamily: theme.fonts.mono,
                }}
              >
                {b.avoid}
              </Text>
            </View>

            <Dashed />

            <Text
              style={{
                fontSize: 11,
                lineHeight: 17,
                fontStyle: 'italic',
                opacity: 0.85,
                color: '#1a1612',
                fontFamily: theme.fonts.mono,
              }}
            >
              NOTE — {b.note}
            </Text>

            <Dashed />

            <Barcode ref_={ref} />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 10,
                letterSpacing: 4,
                color: '#1a1612',
                fontFamily: theme.fonts.mono,
              }}
            >
              {ref}
            </Text>

            <Dashed />

            <Text
              style={{
                textAlign: 'center',
                fontSize: 10,
                letterSpacing: 1.2,
                opacity: 0.6,
                color: '#1a1612',
                fontFamily: theme.fonts.mono,
              }}
            >
              THANK YOU · MEASURE TWICE, CUT ONCE
            </Text>
          </View>
          <Notches edge="bottom" />

          {saved && (
            <View
              style={[
                styles.stamp,
                {
                  backgroundColor: theme.amber,
                  shadowColor: theme.accentGlow,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.accentFg,
                  fontFamily: theme.fonts.mono,
                  fontSize: 10,
                  letterSpacing: 1,
                }}
              >
                ★ SAVED
              </Text>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18, marginBottom: 14 }}>
          <GhostButton
            style={{ flex: 1 }}
            onPress={() => Alert.alert('Share', 'Sharing the card…')}
          >
            <Icon name="share" size={16} color={theme.fg1} />
            <Text style={[styles.ghostText, { color: theme.fg1 }]}>Share</Text>
          </GhostButton>
          <GhostButton style={{ flex: 1 }} onPress={onSaved}>
            <Icon name="plus" size={16} color={theme.fg1} />
            <Text style={[styles.ghostText, { color: theme.fg1 }]}>Plan</Text>
          </GhostButton>
        </View>

        {logging && (
          <RatingPanel
            score={score}
            onScore={setScore}
            tooShort={tooShort}
            onTooShort={setTooShort}
            again={again}
            onAgain={setAgain}
          />
        )}
      </View>
    </Screen>
  );
}

/** One-line generic history note derived from the rating (no free-text yet). */
function logNote(score: number, tooShort: boolean, again: boolean): string {
  const base =
    score >= 8
      ? 'Happy with this one.'
      : score <= 4
      ? "Didn't love this one."
      : 'It was okay.';
  return `${base}${tooShort ? ' Came back too short.' : ''}${
    again ? '' : ' Would not repeat.'
  }`;
}

interface RatingPanelProps {
  score: number;
  onScore: (n: number) => void;
  tooShort: boolean;
  onTooShort: (v: boolean) => void;
  again: boolean;
  onAgain: (v: boolean) => void;
}

/** Minimal rating prompt — satisfaction score + two toggles (Phase 5). */
function RatingPanel({
  score,
  onScore,
  tooShort,
  onTooShort,
  again,
  onAgain,
}: RatingPanelProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.ratingCard,
        { backgroundColor: theme.bgCard, borderColor: theme.lineSoft },
      ]}
    >
      <Eyebrow color={theme.amber} style={{ marginBottom: 4 }}>
        HOW DID IT GO?
      </Eyebrow>
      <Text style={{ fontSize: 13, color: theme.fg2, marginBottom: 10 }}>
        We factor this into your next set of matches.
      </Text>
      <Text
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 10,
          letterSpacing: 0.8,
          color: theme.fg3,
          marginBottom: 8,
        }}
      >
        SATISFACTION · {score}/10
      </Text>
      <View style={styles.scoreRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const on = n <= score;
          return (
            <Pressable
              key={n}
              onPress={() => onScore(n)}
              accessibilityLabel={`Score ${n}`}
              style={[
                styles.scoreChip,
                {
                  backgroundColor: on ? theme.amber : theme.bg2,
                  borderColor: on ? theme.amber : theme.lineSoft,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 12,
                  color: on ? theme.accentFg : theme.fg2,
                }}
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <Toggle
          label="Came back too short"
          on={tooShort}
          onPress={() => onTooShort(!tooShort)}
        />
        <Toggle
          label="Would get it again"
          on={again}
          onPress={() => onAgain(!again)}
        />
      </View>
    </View>
  );
}

function Toggle({
  label,
  on,
  onPress,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggle,
        {
          backgroundColor: on ? theme.amberBg : theme.bg2,
          borderColor: on ? theme.amber : theme.lineSoft,
        },
      ]}
    >
      <Icon
        name={on ? 'check' : 'plus'}
        size={13}
        color={on ? theme.amber : theme.fg3}
      />
      <Text
        style={{
          flex: 1,
          fontSize: 12.5,
          color: on ? theme.fg0 : theme.fg2,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Dashed() {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(26,22,18,0.35)',
        marginVertical: 10,
      }}
    />
  );
}

function ReceiptKV({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
      <Text style={{ fontSize: 11, color: '#1a1612', fontFamily: theme.fonts.mono }}>{k}</Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: bold ? '700' : '400',
          color: '#1a1612',
          fontFamily: theme.fonts.mono,
        }}
      >
        {v}
      </Text>
    </View>
  );
}

function ReceiptRow({ label, text }: { label: string; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 6 }}>
      <Text
        style={{
          width: 52,
          fontSize: 10,
          letterSpacing: 1.6,
          paddingTop: 2,
          fontWeight: '700',
          color: '#1a1612',
          fontFamily: theme.fonts.mono,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 12,
          lineHeight: 18,
          color: '#1a1612',
          fontFamily: theme.fonts.mono,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function Barcode({ ref_ }: { ref_: string }) {
  const bars = Array.from({ length: 48 }, (_, i) => {
    const seed = (i * 17 + ref_.charCodeAt(i % ref_.length)) % 13;
    const w = seed % 3 === 0 ? 3 : seed % 2 === 0 ? 2 : 1;
    const h = 28 + (seed % 3) * 4;
    return { w, h };
  });
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 1.5,
        height: 38,
        marginVertical: 8,
      }}
    >
      {bars.map((b, i) => (
        <View key={i} style={{ width: b.w, height: b.h, backgroundColor: '#1a1612' }} />
      ))}
    </View>
  );
}

/**
 * Approximate the receipt's perforated top/bottom edge with a row of half-circles.
 * The dark holes punch into the paper-color rectangle.
 */
function Notches({ edge }: { edge: 'top' | 'bottom' }) {
  const HOLE_SIZE = 12;
  const HOLES = 18;
  return (
    <View
      style={{
        height: HOLE_SIZE / 2,
        flexDirection: 'row',
        backgroundColor: '#f3ece0',
        justifyContent: 'space-around',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: HOLES }).map((_, i) => (
        <View
          key={i}
          style={{
            width: HOLE_SIZE,
            height: HOLE_SIZE,
            borderRadius: HOLE_SIZE / 2,
            backgroundColor: '#15110d',
            marginTop: edge === 'top' ? -HOLE_SIZE / 2 : 0,
            marginBottom: edge === 'bottom' ? -HOLE_SIZE / 2 : 0,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  receiptOuter: {
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 12,
  },
  receipt: {
    backgroundColor: '#f3ece0',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  stamp: {
    position: 'absolute',
    top: 20,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    transform: [{ rotate: '8deg' }],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  ghostText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  scoreChip: {
    flexGrow: 1,
    minWidth: 26,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
