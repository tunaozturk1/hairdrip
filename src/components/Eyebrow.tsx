import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function Eyebrow({
  children,
  color,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.eyebrow,
        { color: color ?? theme.fg3, fontFamily: theme.fonts.mono },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
