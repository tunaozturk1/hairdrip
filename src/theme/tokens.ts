export type ThemeMode = 'dark' | 'light';
export type AccentKey =
  | 'amber'
  | 'electric'
  | 'acid'
  | 'sunset'
  | 'iris'
  | 'cooldown'
  | 'unwind';

export interface AccentPalette {
  amber: string;
  amberHi: string;
  amberDim: string;
  amberBg: string;
  amberBgStrong: string;
  accentGradient: string[];
  accentGradientStops?: number[];
  accentGlow: string;
  accentFg: string;
}

export interface BasePalette {
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  bgCard: string;
  bgCardHi: string;
  line: string;
  lineSoft: string;
  fg0: string;
  fg1: string;
  fg2: string;
  fg3: string;
  fg4: string;
  good: string;
  warn: string;
  bad: string;
  goodBg: string;
  warnBg: string;
  badBg: string;
}

export interface Theme extends BasePalette, AccentPalette {
  mode: ThemeMode;
  accent: AccentKey;
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  radii: { sm: number; md: number; lg: number; xl: number };
}

const DARK_BASE: BasePalette = {
  bg0: '#15110d',
  bg1: '#1c1813',
  bg2: '#24201a',
  bg3: '#2d2820',
  bgCard: '#1f1b16',
  bgCardHi: '#28231c',
  line: '#3a342b',
  lineSoft: '#2a251f',
  fg0: '#f5efe5',
  fg1: '#e6dfd2',
  fg2: '#aba095',
  fg3: '#756c60',
  fg4: '#4f4a42',
  good: '#7ec77a',
  warn: '#e5a948',
  bad: '#e0594e',
  goodBg: 'rgba(126, 199, 122, 0.14)',
  warnBg: 'rgba(229, 169, 72, 0.14)',
  badBg: 'rgba(224, 89, 78, 0.14)',
};

const LIGHT_BASE: BasePalette = {
  bg0: '#f0ebe2',
  bg1: '#ece7dd',
  bg2: '#e3ddd1',
  bg3: '#d6cfbf',
  bgCard: '#fbf7f0',
  bgCardHi: '#fffcf6',
  line: '#c9c0ae',
  lineSoft: '#ddd5c4',
  fg0: '#1a1612',
  fg1: '#2c2620',
  fg2: '#5b5246',
  fg3: '#847a6c',
  fg4: '#aba095',
  good: '#5ea35e',
  warn: '#b8862f',
  bad: '#b03b32',
  goodBg: 'rgba(94, 163, 94, 0.14)',
  warnBg: 'rgba(184, 134, 47, 0.14)',
  badBg: 'rgba(176, 59, 50, 0.14)',
};

const ACCENTS: Record<AccentKey, AccentPalette> = {
  amber: {
    amber: '#f0a04b',
    amberHi: '#ffb766',
    amberDim: '#c97f33',
    amberBg: 'rgba(240, 160, 75, 0.12)',
    amberBgStrong: 'rgba(240, 160, 75, 0.22)',
    accentGradient: ['#ffb766', '#f0a04b', '#c97f33'],
    accentGradientStops: [0, 0.6, 1],
    accentGlow: 'rgba(240, 160, 75, 0.5)',
    accentFg: '#1a0f00',
  },
  electric: {
    amber: '#6ee0ff',
    amberHi: '#9aeaff',
    amberDim: '#3aa6c4',
    amberBg: 'rgba(110, 224, 255, 0.12)',
    amberBgStrong: 'rgba(110, 224, 255, 0.22)',
    accentGradient: ['#9aeaff', '#6ee0ff', '#3aa6c4'],
    accentGradientStops: [0, 0.6, 1],
    accentGlow: 'rgba(110, 224, 255, 0.5)',
    accentFg: '#001820',
  },
  acid: {
    amber: '#c7f25c',
    amberHi: '#def48a',
    amberDim: '#92b53c',
    amberBg: 'rgba(199, 242, 92, 0.12)',
    amberBgStrong: 'rgba(199, 242, 92, 0.22)',
    accentGradient: ['#def48a', '#c7f25c', '#92b53c'],
    accentGradientStops: [0, 0.6, 1],
    accentGlow: 'rgba(199, 242, 92, 0.5)',
    accentFg: '#14180a',
  },
  sunset: {
    amber: '#ff7e6a',
    amberHi: '#ffa37a',
    amberDim: '#c44a55',
    amberBg: 'rgba(255, 126, 106, 0.13)',
    amberBgStrong: 'rgba(255, 126, 106, 0.24)',
    accentGradient: ['#ffd166', '#ff8c5a', '#ff5e8a', '#c042ff'],
    accentGradientStops: [0, 0.4, 0.75, 1],
    accentGlow: 'rgba(255, 94, 138, 0.55)',
    accentFg: '#2a0610',
  },
  iris: {
    amber: '#a892ff',
    amberHi: '#c3b3ff',
    amberDim: '#7158d9',
    amberBg: 'rgba(168, 146, 255, 0.14)',
    amberBgStrong: 'rgba(168, 146, 255, 0.24)',
    accentGradient: ['#5dd3ff', '#8ba8ff', '#b990ff', '#f0a3ff'],
    accentGradientStops: [0, 0.45, 0.75, 1],
    accentGlow: 'rgba(168, 146, 255, 0.5)',
    accentFg: '#0d0822',
  },
  cooldown: {
    amber: '#ffaa66',
    amberHi: '#ffc99a',
    amberDim: '#c97250',
    amberBg: 'rgba(255, 170, 102, 0.14)',
    amberBgStrong: 'rgba(255, 170, 102, 0.24)',
    accentGradient: ['#ff4d4d', '#ffb347', '#8fc99f'],
    accentGradientStops: [0, 0.5, 1],
    accentGlow: 'rgba(255, 130, 90, 0.55)',
    accentFg: '#1a0a06',
  },
  unwind: {
    amber: '#c8a8ff',
    amberHi: '#dcc5ff',
    amberDim: '#8b6fd0',
    amberBg: 'rgba(200, 168, 255, 0.14)',
    amberBgStrong: 'rgba(200, 168, 255, 0.24)',
    accentGradient: ['#ffe23b', '#d4a5ff', '#7cc2e6'],
    accentGradientStops: [0, 0.55, 1],
    accentGlow: 'rgba(180, 170, 230, 0.5)',
    accentFg: '#0d0a1a',
  },
};

export function buildTheme(mode: ThemeMode, accent: AccentKey): Theme {
  const base = mode === 'light' ? LIGHT_BASE : DARK_BASE;
  return {
    ...base,
    ...ACCENTS[accent],
    mode,
    accent,
    fonts: {
      display: 'BricolageGrotesque_700Bold',
      body: 'Geist_400Regular',
      mono: 'GeistMono_400Regular',
    },
    radii: { sm: 10, md: 16, lg: 22, xl: 28 },
  };
}

export const ACCENT_OPTIONS: { value: AccentKey; label: string }[] = [
  { value: 'amber', label: 'Amber' },
  { value: 'electric', label: 'Electric' },
  { value: 'acid', label: 'Acid' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'iris', label: 'Iris' },
  { value: 'cooldown', label: 'Cooldown' },
  { value: 'unwind', label: 'Unwind' },
];
