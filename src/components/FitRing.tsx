import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

interface FitRingProps {
  value: number;
  size?: number;
  stroke?: number;
}

export function FitRing({ value, size = 64, stroke = 6 }: FitRingProps) {
  const { theme } = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.bg3}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.amber}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={off}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text
          style={{
            fontFamily: theme.fonts.display,
            fontSize: size * 0.32,
            fontWeight: '700',
            lineHeight: size * 0.32,
            color: theme.fg0,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 8,
            color: theme.fg3,
            letterSpacing: 0.8,
            marginTop: 2,
          }}
        >
          FIT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
