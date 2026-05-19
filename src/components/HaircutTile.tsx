import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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

  // Crossfade the photo in once it loads; gently pulse the placeholder
  // silhouette until then so the tile never reads as empty.
  const [loaded, setLoaded] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loaded || !photo) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 850, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [loaded, photo, pulse]);

  const placeholderOpacity = photo
    ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] })
    : 1;

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
      {/* Placeholder — visible until the photo has faded in, and the permanent
          state for any cut that has no reference photo. */}
      {!loaded && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: placeholderOpacity }]}
        >
          {/* striped placeholder background */}
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: theme.bg2 }]}
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
        </Animated.View>
      )}

      {/* Real reference photo of the cut. Explicit 100%×100% size (see
          `styles.fill`) — an <Image> otherwise lays out at its intrinsic
          1024px width and overflows the tile. Fades and settles in on load. */}
      {photo && (
        <Animated.Image
          source={photo}
          style={[
            styles.fill,
            {
              opacity: fade,
              transform: [
                {
                  scale: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.06, 1],
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
          onLoad={() =>
            Animated.timing(fade, {
              toValue: 1,
              duration: 320,
              useNativeDriver: true,
            }).start(() => setLoaded(true))
          }
        />
      )}

      {label && (
        <View style={styles.labelWrap}>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
    position: 'relative',
  },
  // The photo fills the tile. Explicit 100%×100% (not `flex` or
  // `alignSelf: 'stretch'`) — an <Image> reports an intrinsic measured size
  // that `stretch` does not override, so without an explicit width the image
  // rendered 1024px wide and overflowed the tile.
  fill: {
    width: '100%',
    height: '100%',
  },
  // Label sits over the bottom-left corner regardless of fill content.
  labelWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
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
  },
});
