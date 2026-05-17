import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'camera'
  | 'upload'
  | 'sparkle'
  | 'share'
  | 'save'
  | 'plus'
  | 'scissors'
  | 'close'
  | 'history'
  | 'eye'
  | 'no-hat'
  | 'light'
  | 'face';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 18, color = '#fff' }: IconProps) {
  const sw = 1.7;
  const stroke = color;
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
  } as const;

  switch (name) {
    case 'arrow-right':
      return (
        <Svg {...common}>
          <Path d="M5 12h14M13 6l6 6-6 6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'arrow-left':
      return (
        <Svg {...common}>
          <Path d="M19 12H5M11 6l-6 6 6 6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...common}>
          <Path d="M4 12l5 5L20 6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'camera':
      return (
        <Svg {...common}>
          <Path
            d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="13" r="3.5" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'upload':
      return (
        <Svg {...common}>
          <Path d="M12 16V4M6 10l6-6 6 6M4 20h16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg {...common}>
          <Path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7L19 16z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'share':
      return (
        <Svg {...common}>
          <Circle cx="6" cy="12" r="2.5" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="6" r="2.5" stroke={stroke} strokeWidth={sw} />
          <Circle cx="18" cy="18" r="2.5" stroke={stroke} strokeWidth={sw} />
          <Path d="M8.2 11l7.6-4M8.2 13l7.6 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'save':
      return (
        <Svg {...common}>
          <Path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...common}>
          <Path d="M12 5v14M5 12h14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'scissors':
      return (
        <Svg {...common}>
          <Circle cx="6" cy="6" r="3" stroke={stroke} strokeWidth={sw} />
          <Circle cx="6" cy="18" r="3" stroke={stroke} strokeWidth={sw} />
          <Path d="M8.1 8.1L20 20M8.1 15.9L20 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...common}>
          <Path d="M6 6l12 12M18 6L6 18" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'history':
      return (
        <Svg {...common}>
          <Path d="M3 12a9 9 0 109-9c-2.7 0-5.1 1.2-6.8 3M3 4v5h5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M12 7v5l3 2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'eye':
      return (
        <Svg {...common}>
          <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw} />
        </Svg>
      );
    case 'no-hat':
      return (
        <Svg {...common}>
          <Path d="M3 16h18M6 16l2-6a4 4 0 018 0l2 6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M3 21l18-18" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'light':
      return (
        <Svg {...common}>
          <Circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth={sw} />
          <Path
            d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'face':
      return (
        <Svg {...common}>
          <Circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
          <Path d="M9 10.5h.01M15 10.5h.01" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M8.5 15c1 1 2.1 1.5 3.5 1.5s2.5-.5 3.5-1.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    default:
      return null;
  }
}
