import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { PrimaryButton } from '../components/Buttons';
import { Chip } from '../components/Chip';
import { Eyebrow } from '../components/Eyebrow';
import { Icon } from '../components/Icon';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { QUIZ } from '../data';
import type { OnboardingAnswers } from '../store/types';
import { useTheme } from '../theme/ThemeContext';

export type { OnboardingAnswers };

interface Props {
  onDone: (a: OnboardingAnswers) => void;
  onBack: () => void;
}

export function OnboardingScreen({ onDone, onBack }: Props) {
  const { theme } = useTheme();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    hair: null,
    thick: null,
    problem: [],
    style: null,
    maint: null,
  });
  const q = QUIZ[idx];

  const canNext = () => {
    if (q.id === 'hair') return !!answers.hair && !!answers.thick;
    if (q.id === 'problem') return answers.problem.length > 0;
    if (q.id === 'style') return !!answers.style;
    if (q.id === 'maint') return !!answers.maint;
    return false;
  };

  const next = () => {
    if (idx === QUIZ.length - 1) onDone(answers);
    else setIdx((i) => i + 1);
  };
  const prev = () => {
    if (idx === 0) onBack();
    else setIdx((i) => i - 1);
  };

  const select = <K extends keyof OnboardingAnswers>(key: K, v: OnboardingAnswers[K]) =>
    setAnswers((a) => ({ ...a, [key]: v }));
  const toggleProblem = (v: string) =>
    setAnswers((a) => ({
      ...a,
      problem: a.problem.includes(v) ? a.problem.filter((x) => x !== v) : [...a.problem, v],
    }));

  const eyebrowLabel =
    q.id === 'hair'
      ? 'HAIR PROFILE'
      : q.id === 'problem'
      ? 'PAST EXPERIENCES'
      : q.id === 'style'
      ? 'STYLE TARGET'
      : 'MAINTENANCE';

  return (
    <Screen
      scrollKey={q.id}
      footer={
        <PrimaryButton block onPress={next} disabled={!canNext()}>
          <Text style={[styles.btnText, { color: theme.accentFg }]}>
            {idx === QUIZ.length - 1 ? 'Continue to scan' : 'Next'}
          </Text>
          <Icon name="arrow-right" size={18} color={theme.accentFg} />
        </PrimaryButton>
      }
    >
      <TopBar
        onBack={prev}
        step={idx}
        total={QUIZ.length}
        right={
          <Text
            style={[
              styles.stepCount,
              { color: theme.fg3, fontFamily: theme.fonts.mono },
            ]}
          >
            {idx + 1} / {QUIZ.length}
          </Text>
        }
      />

      <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}>
        <Eyebrow color={theme.amber} style={{ marginBottom: 12 }}>
          {eyebrowLabel}
        </Eyebrow>
        <Text style={[styles.title, { color: theme.fg0, fontFamily: theme.fonts.display }]}>
          {q.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.fg2 }]}>{q.subtitle}</Text>

        {q.id === 'hair' && (
          <>
            <View style={styles.grid2}>
              {q.options.map((o) => (
                <Chip
                  key={o.v}
                  selected={answers.hair === o.v}
                  onPress={() => select('hair', o.v)}
                  style={{ width: '48.5%' }}
                >
                  <HairIcon
                    kind={o.v}
                    sel={answers.hair === o.v}
                    selColor={theme.accentFg}
                    unselColor={theme.amber}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      { color: answers.hair === o.v ? theme.accentFg : theme.fg1 },
                    ]}
                  >
                    {o.label}
                  </Text>
                </Chip>
              ))}
            </View>
            <Eyebrow style={{ marginBottom: 10 }}>THICKNESS</Eyebrow>
            <View style={styles.rowGap8}>
              {q.second!.options.map((o) => (
                <Chip
                  key={o.v}
                  selected={answers.thick === o.v}
                  onPress={() => select('thick', o.v)}
                  style={{ flex: 1, justifyContent: 'center' as any }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: answers.thick === o.v ? theme.accentFg : theme.fg1,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {o.label}
                  </Text>
                </Chip>
              ))}
            </View>
          </>
        )}

        {q.id === 'problem' && (
          <View style={{ gap: 8 }}>
            {q.options.map((o) => {
              const on = answers.problem.includes(o.v);
              return (
                <Chip key={o.v} selected={on} onPress={() => toggleProblem(o.v)}>
                  <View style={styles.problemRow}>
                    <Text
                      style={[
                        styles.chipText,
                        { color: on ? theme.accentFg : theme.fg1, flex: 1 },
                      ]}
                    >
                      {o.label}
                    </Text>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        borderWidth: 1.5,
                        borderColor: on ? '#1a0f00' : theme.line,
                        backgroundColor: on ? '#1a0f00' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on && <Icon name="check" size={14} color={theme.amber} />}
                    </View>
                  </View>
                </Chip>
              );
            })}
          </View>
        )}

        {q.id === 'style' && (
          <View style={styles.grid2}>
            {q.options.map((o) => (
              <Chip
                key={o.v}
                selected={answers.style === o.v}
                onPress={() => select('style', o.v)}
                style={{ width: '48.5%', paddingVertical: 20 }}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: answers.style === o.v ? theme.accentFg : theme.fg1,
                      textAlign: 'center',
                      width: '100%',
                    },
                  ]}
                >
                  {o.label}
                </Text>
              </Chip>
            ))}
          </View>
        )}

        {q.id === 'maint' && (
          <View style={{ gap: 10 }}>
            {q.options.map((o) => {
              const on = answers.maint === o.v;
              return (
                <Chip key={o.v} selected={on} onPress={() => select('maint', o.v)}>
                  <View>
                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: 16,
                        color: on ? theme.accentFg : theme.fg1,
                      }}
                    >
                      {o.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: on ? theme.accentFg : theme.fg3,
                        opacity: on ? 0.75 : 1,
                        marginTop: 4,
                      }}
                    >
                      {o.sub}
                    </Text>
                  </View>
                </Chip>
              );
            })}
          </View>
        )}
      </View>
    </Screen>
  );
}

function HairIcon({
  kind,
  sel,
  selColor,
  unselColor,
}: {
  kind: string;
  sel: boolean;
  selColor: string;
  unselColor: string;
}) {
  const c = sel ? selColor : unselColor;
  const sw = 1.6;
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
  } as const;
  switch (kind) {
    case 'straight':
      return (
        <Svg {...common}>
          <Path d="M6 4v16M10 4v16M14 4v16M18 4v16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'wavy':
      return (
        <Svg {...common}>
          <Path
            d="M5 6c2 2 4 0 6-2M5 12c2 2 4 0 6-2M5 18c2 2 4 0 6-2M13 6c2 2 4 0 6-2M13 12c2 2 4 0 6-2M13 18c2 2 4 0 6-2"
            stroke={c}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'curly':
      return (
        <Svg {...common}>
          <Circle cx="7" cy="7" r="2" stroke={c} strokeWidth={sw} />
          <Circle cx="13" cy="9" r="2" stroke={c} strokeWidth={sw} />
          <Circle cx="9" cy="14" r="2" stroke={c} strokeWidth={sw} />
          <Circle cx="15" cy="16" r="2" stroke={c} strokeWidth={sw} />
        </Svg>
      );
    case 'coily':
      return (
        <Svg {...common}>
          {[
            [8, 8],
            [13, 7],
            [17, 9],
            [7, 13],
            [12, 14],
            [16, 15],
            [9, 18],
            [14, 19],
          ].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r="1.5" stroke={c} strokeWidth={sw} />
          ))}
        </Svg>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  stepCount: {
    fontSize: 11,
    letterSpacing: 0.7,
  },
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
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    rowGap: 10,
    marginBottom: 24,
  },
  rowGap8: {
    flexDirection: 'row',
    gap: 8,
  },
  chipText: {
    fontSize: 14.5,
    fontWeight: '500',
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
