import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from './Icon';
import { StepDots } from './StepDots';
import { useTheme } from '../theme/ThemeContext';

interface TopBarProps {
  onBack?: () => void;
  step?: number;
  total?: number;
  right?: React.ReactNode;
}

export function TopBar({ onBack, step, total, right }: TopBarProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityLabel="Back"
          style={[
            styles.iconBtn,
            { backgroundColor: theme.bg2, borderColor: theme.lineSoft },
          ]}
        >
          <Icon name="arrow-left" size={16} color={theme.fg1} />
        </Pressable>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <View style={styles.steps}>
        {step != null && total != null && <StepDots count={total} idx={step} />}
      </View>
      {right ?? <View style={{ width: 36 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: { flex: 1 },
});
