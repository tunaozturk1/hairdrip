import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function StepDots({ count, idx }: { count: number; idx: number }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 999,
            backgroundColor: i <= idx ? theme.amber : theme.bg3,
          }}
        />
      ))}
    </View>
  );
}
