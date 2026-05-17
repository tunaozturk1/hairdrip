import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { GhostButton } from '../components/Buttons';
import { Eyebrow } from '../components/Eyebrow';
import { HaircutTile } from '../components/HaircutTile';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { summarizeHistory } from '../services/recScoring';
import { useAppStore } from '../store/appStore';
import type { HistoryEntry } from '../store/types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onBack: () => void;
  onAdd: () => void;
  onRestart: () => void;
}

/** Epoch ms → "Apr 2026". */
function formatMonth(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

export function HistoryScreen({ onBack, onAdd, onRestart }: Props) {
  const { theme } = useTheme();
  const items = useAppStore((s) => s.history);
  const empty = items.length === 0;
  const avg = empty
    ? '—'
    : (items.reduce((a, b) => a + b.score, 0) / items.length).toFixed(1);

  return (
    <Screen>
      <TopBar
        onBack={onBack}
        right={
          <Pressable
            onPress={onRestart}
            accessibilityLabel="Restart"
            style={[
              styles.iconBtn,
              { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
            ]}
          >
            <Icon name="plus" size={16} color={theme.fg1} />
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 12 }}>
          HAIRCUT MEMORY
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          What worked. What didn't.
        </Text>
        <Text style={[styles.subtitle, { color: theme.fg2 }]}>
          {empty
            ? 'Log a cut after each visit. We factor your last results into every future match.'
            : `We learn from your last ${items.length} cut${
                items.length === 1 ? '' : 's'
              }. The next match factors them in.`}
        </Text>

        {!empty && (
          <>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
              <Stat n={`${avg}/10`} l="AVG SATISFACTION" />
              <Stat n={String(items.filter((i) => i.score >= 7).length)} l="WINS" />
              <Stat n={String(items.filter((i) => i.tooShort).length)} l="TOO SHORT" />
            </View>

            <View style={{ gap: 12 }}>
              {items.map((h) => (
                <HistoryRow key={h.id} h={h} />
              ))}
            </View>
          </>
        )}

        {empty && (
          <View
            style={[
              styles.emptyBox,
              { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
            ]}
          >
            <View style={[styles.patternIcon, { backgroundColor: theme.amberBg }]}>
              <Icon name="history" size={16} color={theme.amber} />
            </View>
            <Text style={{ fontSize: 14, color: theme.fg2, textAlign: 'center', lineHeight: 20 }}>
              No cuts logged yet.{'\n'}Your haircut memory starts with your first one.
            </Text>
          </View>
        )}

        <GhostButton block style={{ marginTop: 16 }} onPress={onAdd}>
          <Icon name="plus" size={16} color={theme.fg1} />
          <Text style={{ color: theme.fg1, fontSize: 16, fontWeight: '500' }}>
            Log another cut
          </Text>
        </GhostButton>

        {!empty && (
          <View
            style={[
              styles.patternBox,
              { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
            ]}
          >
            <View style={[styles.patternIcon, { backgroundColor: theme.amberBg }]}>
              <Icon name="sparkle" size={16} color={theme.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: theme.fg1, fontWeight: '500' }}>
                Pattern detected
              </Text>
              <Text style={{ fontSize: 13, color: theme.fg2, marginTop: 2, lineHeight: 19 }}>
                {summarizeHistory(items) ??
                  'We factor your logged cuts into every future match.'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: theme.bg1, borderColor: theme.lineSoft },
      ]}
    >
      <Text
        style={{
          fontFamily: theme.fonts.display,
          fontSize: 22,
          fontWeight: '700',
          marginBottom: 4,
          color: theme.fg0,
        }}
      >
        {n}
      </Text>
      <Text
        style={{
          fontFamily: theme.fonts.mono,
          fontSize: 9.5,
          color: theme.fg3,
          letterSpacing: 0.8,
        }}
      >
        {l}
      </Text>
    </View>
  );
}

function HistoryRow({ h }: { h: HistoryEntry }) {
  const { theme } = useTheme();
  const good = h.score >= 7;
  const scoreColor = good ? theme.good : h.score >= 5 ? theme.warn : theme.bad;
  const date = formatMonth(h.loggedAt);
  return (
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
      <View style={{ width: 84 }}>
        <HaircutTile id={h.haircutId ?? h.id} height={96} label={date.toUpperCase()} />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Eyebrow style={{ marginBottom: 2 }}>{date}</Eyebrow>
            <Text
              style={{
                fontFamily: theme.fonts.display,
                fontSize: 17,
                fontWeight: '700',
                color: theme.fg0,
                letterSpacing: -0.3,
              }}
            >
              {h.name}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: '700',
              fontSize: 22,
              color: scoreColor,
            }}
          >
            {h.score}
            <Text style={{ color: theme.fg3, fontSize: 12 }}>/10</Text>
          </Text>
        </View>
        <Text style={{ fontSize: 12.5, color: theme.fg2, lineHeight: 18 }}>{h.notes}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 'auto' }}>
          {h.tooShort && <Badge kind="bad">TOO SHORT</Badge>}
          {h.again ? <Badge kind="good">WOULD REPEAT</Badge> : <Badge kind="bad">NOT AGAIN</Badge>}
        </View>
      </View>
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
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 18,
    lineHeight: 22,
  },
  stat: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 14,
    gap: 14,
    borderWidth: 1,
  },
  patternBox: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  patternIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    marginTop: 4,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
