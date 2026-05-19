import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { HAIRCUT_IMAGES } from '../data/haircutImages';
import { useTheme } from '../theme/ThemeContext';

interface HaircutTileProps {
  id: string;
  height?: number;
  label?: string;
}

export function HaircutTile({ id, height = 168, label }: HaircutTileProps) {
  const { theme } = useTheme();
  const seed = id ? id.charCodeAt(0) + id.length : 0;
  const rot = ((seed * 17) % 30) - 15;
  const gradId = `g-${id}`;
  const photo = HAIRCUT_IMAGES[id];

  return (
    <View
      style={[
        styles.tile,
        {
          height,
          backgroundColor: theme.bg3,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      {photo ? (
        // Real reference photo of the cut.
        <Image
          source={photo}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLoad={(e) =>
            console.log('[HaircutTile] LOADED', id, e.nativeEvent?.source)
          }
          onError={(e) =>
            console.log('[HaircutTile] ERROR', id, e.nativeEvent?.error)
          }
        />
      ) : (
        <>
          {/* striped placeholder background */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.bg2, opacity: 1 },
            ]}
          />
          <View
            style={[StyleSheet.absoluteFill, styles.stripes, { opacity: 0.5 }]}
          />
          {/* head silhouette */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { alignItems: 'center', justifyContent: 'center', opacity: 0.6 },
            ]}
          >
            <Svg width="60%" height="80%" viewBox="0 0 100 120">
              <Defs>
                <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={theme.amber} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={theme.amber} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Ellipse
                cx="50"
                cy="68"
                rx="26"
                ry="32"
                fill={theme.bg1}
                stroke={theme.line}
                strokeWidth={0.8}
                transform={`rotate(${rot / 8} 50 60)`}
              />
              <Path
                d="M24 60 Q26 28 50 24 Q74 28 76 60 Q74 44 50 40 Q26 44 24 60 Z"
                fill={`url(#${gradId})`}
                stroke={theme.amber}
                strokeOpacity={0.4}
                strokeWidth={0.6}
                transform={`rotate(${rot / 8} 50 60)`}
              />
            </Svg>
          </View>
        </>
      )}
      {label && (
        <Text
          style={[
            styles.label,
            // Over a photo, a scrim keeps the mono label legible; over the
            // placeholder it reads fine against the dark fill.
            photo
              ? { fontFamily: theme.fonts.mono, color: '#fff', backgroundColor: 'rgba(0,0,0,0.55)' }
              : { fontFamily: theme.fonts.mono, color: theme.fg3 },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stripes: {
    // approximation of the repeating striped overlay
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    margin: 8,
    borderRadius: 6,
    overflow: 'hidden',
    zIndex: 1,
  },
});
