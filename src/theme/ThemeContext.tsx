import React, { createContext, useContext, useMemo, useState } from 'react';
import { AccentKey, Theme, ThemeMode, buildTheme } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  accent: AccentKey;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialMode = 'dark',
  initialAccent = 'acid',
}: {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  initialAccent?: AccentKey;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [accent, setAccent] = useState<AccentKey>(initialAccent);

  const value = useMemo(
    () => ({
      theme: buildTheme(mode, accent),
      mode,
      accent,
      setMode,
      setAccent,
    }),
    [mode, accent],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const v = useContext(ThemeContext);
  if (!v) throw new Error('useTheme must be used inside ThemeProvider');
  return v;
}
