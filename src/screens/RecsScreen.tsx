import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, RegretBadge } from '../components/Badge';
import { Eyebrow } from '../components/Eyebrow';
import { FitRing } from '../components/FitRing';
import { HaircutTile } from '../components/HaircutTile';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useAppStore } from '../store/appStore';
import type { ScoredHaircut } from '../store/types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onBack: () => void;
  onPick: (id: string) => void;
  onHistory: () => void;
}

type Filter = 'all' | 'low' | 'bold';

export function RecsScreen({ onBack, onPick, onHistory }: Props) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const recs = useAppStore((s) => s.recs);
  const analysis = useAppStore((s) => s.analysis);

  const visible: ScoredHaircut[] =
    filter === 'low'
      ? recs.filter((c) => c.regret === 'low')
      : filter === 'bold'
      ? recs.filter((c) => c.regret !== 'low')
      : recs;

  return (
    <Screen>
      <TopBar
        onBack={onBack}
        right={
          <Pressable
            onPress={onHistory}
            accessibilityLabel="History"
            style={[
              styles.iconBtn,
              { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
            ]}
          >
            <Icon name="history" size={16} color={theme.fg1} />
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 12 }}>
          {recs.length} MATCHES
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          Cuts that actually fit you.
        </Text>
        <Text style={[styles.subtitle, { color: theme.fg2 }]}>
          Ranked by face shape, hair type, and the effort you said you'd put in.
        </Text>

        <View
          style={[
            styles.seg,
            { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
          ]}
        >
          {(['all', 'low', 'bold'] as Filter[]).map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.segBtn,
                filter === f && { backgroundColor: theme.bgCardHi },
              ]}
            >
              <Text
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 11,
                  letterSpacing: 0.7,
                  textTransform: 'uppercase',
                  color: filter === f ? theme.fg0 : theme.fg2,
                }}
              >
                {f === 'all' ? 'All' : f === 'low' ? 'Low regret' : 'Bolder'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, gap: 14, paddingBottom: 24 }}>
        {visible.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => onPick(c.id)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.bgCard,
                borderColor: theme.lineSoft,
                borderRadius: theme.radii.lg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={{ width: 110 }}>
              <HaircutTile id={c.id} height={132} label={c.maint.toUpperCase()} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  {c.tag && (
                    <Eyebrow color={theme.amber} style={{ marginBottom: 4 }}>
                      {c.tag.toUpperCase()}
                    </Eyebrow>
                  )}
                  <Text
                    style={{
                      fontFamily: theme.fonts.display,
                      fontSize: 18,
                      fontWeight: '700',
                      letterSpacing: -0.3,
                      color: theme.fg0,
                      lineHeight: 20,
                    }}
                  >
                    {c.name}
                  </Text>
                </View>
                <FitRing value={c.fit} size={54} stroke={5} />
              </View>
              <Text style={{ color: theme.fg2, fontSize: 13, lineHeight: 18 }}>{c.short}</Text>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                <RegretBadge level={c.regret} />
                <Badge kind="neutral">{c.maint.toUpperCase()}</Badge>
              </View>
              {c.reason && (
                <View
                  style={[
                    styles.reasonRow,
                    { backgroundColor: theme.amberBg },
                  ]}
                >
                  <Icon name="history" size={11} color={theme.amber} />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 11,
                      lineHeight: 15,
                      color: theme.amber,
                    }}
                  >
                    {c.reason}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        <View
          style={[
            styles.tipBox,
            { backgroundColor: theme.bg1, borderColor: theme.line },
          ]}
        >
          <View
            style={[styles.tipIcon, { backgroundColor: theme.amberBg }]}
          >
            <Icon name="sparkle" size={16} color={theme.amber} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: theme.fg1, fontWeight: '500' }}>
              What we factored in
            </Text>
            <Text style={{ fontSize: 12, color: theme.fg3, marginTop: 2 }}>
              {analysis?.notes?.[0] ??
                'Ranked by your face shape, hair type, and effort level.'}
            </Text>
          </View>
        </View>
      </View>
    </Screen>
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
  seg: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  segBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderWidth: 1,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tipBox: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
