import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollKey?: string | number;
  /** When true, content sits flush against the top (no safe-area padding) */
  flushTop?: boolean;
  scrollViewStyle?: ViewStyle;
}

export function Screen({
  children,
  footer,
  scrollKey,
  flushTop,
  scrollViewStyle,
}: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    ref.current?.scrollTo({ y: 0, animated: false });
  }, [scrollKey]);

  return (
    <View style={[styles.app, { backgroundColor: theme.bg0 }]}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingTop: flushTop ? 0 : insets.top },
          scrollViewStyle,
        ]}
      >
        {children}
      </ScrollView>
      {footer && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 30 + insets.bottom,
            backgroundColor: theme.bg0,
          }}
        >
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
