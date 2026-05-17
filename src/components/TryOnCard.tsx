/**
 * "See it on you" — generates and shows the user's selfie wearing this cut.
 *
 * The result is cached in the store keyed by haircut id, so reopening Detail
 * or returning to an already-previewed cut is instant and costs nothing.
 */
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import type { Haircut } from '../data';
import { generateTryOn } from '../services/tryOnApi';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme/ThemeContext';
import { GhostButton, PrimaryButton } from './Buttons';
import { Eyebrow } from './Eyebrow';
import { Icon } from './Icon';

interface Props {
  haircut: Haircut;
}

export function TryOnCard({ haircut }: Props) {
  const { theme } = useTheme();
  const photoUri = useAppStore((s) => s.photoUri);
  const image = useAppStore((s) => s.tryOnImages[haircut.id]);
  const setTryOnImage = useAppStore((s) => s.setTryOnImage);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const run = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const b64 = await generateTryOn({ photoUri: photoUri ?? '', haircut });
      setTryOnImage(haircut.id, b64);
      setStatus('idle');
    } catch (e) {
      setErrorMsg(
        e instanceof Error ? e.message : 'Could not generate the preview.',
      );
      setStatus('error');
    }
  };

  // Order matters: a regenerate keeps the old `image` in the store, so the
  // loading/error states must be checked before it.
  function renderBody() {
    if (status === 'loading') {
      return (
        <View style={[styles.stateBox, { backgroundColor: theme.bg2 }]}>
          <ActivityIndicator color={theme.amber} />
          <Text style={[styles.stateText, { color: theme.fg2 }]}>
            Generating your preview…{'\n'}This can take up to a minute.
          </Text>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <>
          <View style={[styles.stateBox, { backgroundColor: theme.bg2 }]}>
            <Icon name="camera" size={22} color={theme.bad} />
            <Text style={[styles.stateText, { color: theme.fg2 }]}>
              {errorMsg}
            </Text>
          </View>
          <PrimaryButton block onPress={run}>
            <Icon name="sparkle" size={16} color={theme.accentFg} />
            <Text style={[styles.btnText, { color: theme.accentFg }]}>
              Try again
            </Text>
          </PrimaryButton>
        </>
      );
    }

    if (image) {
      return (
        <>
          <Image
            source={{ uri: `data:image/png;base64,${image}` }}
            style={[styles.image, { borderColor: theme.lineSoft }]}
            resizeMode="cover"
          />
          <Text style={[styles.disclaimer, { color: theme.fg3 }]}>
            AI preview — an approximation, not a guaranteed result.
          </Text>
          <GhostButton block onPress={run}>
            <Icon name="sparkle" size={16} color={theme.fg1} />
            <Text style={[styles.btnText, { color: theme.fg1 }]}>
              Regenerate
            </Text>
          </GhostButton>
        </>
      );
    }

    return (
      <>
        <Text style={[styles.blurb, { color: theme.fg2 }]}>
          Render your photo with this exact cut before you commit to it.
        </Text>
        <PrimaryButton block onPress={run}>
          <Icon name="sparkle" size={16} color={theme.accentFg} />
          <Text style={[styles.btnText, { color: theme.accentFg }]}>
            See it on you
          </Text>
        </PrimaryButton>
      </>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.bgCard,
          borderColor: theme.lineSoft,
          borderRadius: theme.radii.lg,
        },
      ]}
    >
      <Eyebrow color={theme.amber} style={{ marginBottom: 10 }}>
        SEE IT ON YOU
      </Eyebrow>
      {renderBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    aspectRatio: 1024 / 1536,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  blurb: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  stateBox: {
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
