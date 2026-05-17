import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type BadgeKind = 'good' | 'warn' | 'bad' | 'amber' | 'neutral';

export function Badge({
  kind,
  children,
  showDot = true,
  style,
}: {
  kind: BadgeKind;
  children: React.ReactNode;
  showDot?: boolean;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  const palette: Record<BadgeKind, { bg: string; fg: string }> = {
    good: { bg: theme.goodBg, fg: theme.good },
    warn: { bg: theme.warnBg, fg: theme.warn },
    bad: { bg: theme.badBg, fg: theme.bad },
    amber: { bg: theme.amberBg, fg: theme.amber },
    neutral: { bg: theme.bg3, fg: theme.fg2 },
  };
  const { bg, fg } = palette[kind];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {showDot && <View style={[styles.dot, { backgroundColor: fg }]} />}
      <Text style={[styles.label, { color: fg, fontFamily: theme.fonts.mono }]}>
        {children}
      </Text>
    </View>
  );
}

export function RegretBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const kind = level === 'low' ? 'good' : level === 'medium' ? 'warn' : 'bad';
  const label = level === 'low' ? 'Low regret' : level === 'medium' ? 'Med regret' : 'High regret';
  return (
    <Badge kind={kind}>
      {label.toUpperCase()}
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 6,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10.5,
    letterSpacing: 0.6,
    fontWeight: '500',
  },
});
