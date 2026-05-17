import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface BaseProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  block?: boolean;
}

export function PrimaryButton({ children, onPress, disabled, style, block }: BaseProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryWrap,
        block && { alignSelf: 'stretch' },
        {
          opacity: disabled ? 0.4 : pressed ? 0.92 : 1,
          shadowColor: theme.accentGlow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={theme.accentGradient as any}
        locations={theme.accentGradientStops as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryGradient}
      >
        <View style={styles.primaryInner}>
          {typeof children === 'string' ? (
            <Text style={[styles.primaryText, { color: theme.accentFg }]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ children, onPress, style, block }: BaseProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.ghost,
        block && { alignSelf: 'stretch' },
        {
          backgroundColor: pressed ? theme.bg2 : 'transparent',
          borderColor: theme.line,
        },
        style,
      ]}
    >
      <View style={styles.ghostInner}>
        {typeof children === 'string' ? (
          <Text style={[styles.ghostText, { color: theme.fg1 }]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryWrap: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryGradient: {
    borderRadius: 999,
  },
  primaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
    gap: 8,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.08,
  },
  ghost: {
    borderRadius: 999,
    borderWidth: 1,
  },
  ghostInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  ghostText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
