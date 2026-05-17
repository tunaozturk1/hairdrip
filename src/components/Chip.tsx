import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface ChipProps {
  selected?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Chip({ selected = false, onPress, children, style }: ChipProps) {
  const { theme } = useTheme();
  if (selected) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.wrap,
          {
            opacity: pressed ? 0.9 : 1,
            shadowColor: theme.accentGlow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 3,
          },
          style,
        ]}
      >
        <LinearGradient
          colors={theme.accentGradient as any}
          locations={theme.accentGradientStops as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <ChipInner color={theme.accentFg}>{children}</ChipInner>
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        styles.unselected,
        {
          backgroundColor: pressed ? theme.bg2 : theme.bg1,
          borderColor: theme.line,
        },
        style,
      ]}
    >
      <ChipInner color={theme.fg1}>{children}</ChipInner>
    </Pressable>
  );
}

function ChipInner({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <View style={styles.inner}>
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  unselected: {
    borderWidth: 1,
  },
  gradient: {
    borderRadius: 14,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  text: {
    fontSize: 14.5,
    fontWeight: '500',
  },
});
