import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_500Medium,
  useFonts as useBricolage,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  useFonts as useGeist,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  useFonts as useGeistMono,
} from '@expo-google-fonts/geist-mono';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useAppStore } from './src/store/appStore';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PhotoScreen } from './src/screens/PhotoScreen';
import { AnalyzingScreen } from './src/screens/AnalyzingScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { RecsScreen } from './src/screens/RecsScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { BarberScreen } from './src/screens/BarberScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';

type ScreenName =
  | 'welcome'
  | 'onboarding'
  | 'photo'
  | 'analyzing'
  | 'result'
  | 'recs'
  | 'detail'
  | 'barber'
  | 'history';

function AppShell() {
  const { theme, mode } = useTheme();
  const [screen, setScreen] = useState<ScreenName>('welcome');
  const [pickedId, setPickedId] = useState('fringe-low-taper');

  const go = (s: ScreenName) => setScreen(s);

  let view: React.ReactNode = null;
  switch (screen) {
    case 'welcome':
      view = <WelcomeScreen onNext={() => go('onboarding')} />;
      break;
    case 'onboarding':
      view = (
        <OnboardingScreen
          onDone={(answers) => {
            useAppStore.getState().setQuizAnswers(answers);
            go('photo');
          }}
          onBack={() => go('welcome')}
        />
      );
      break;
    case 'photo':
      view = (
        <PhotoScreen onNext={() => go('analyzing')} onBack={() => go('onboarding')} />
      );
      break;
    case 'analyzing':
      view = (
        <AnalyzingScreen onDone={() => go('result')} onBack={() => go('photo')} />
      );
      break;
    case 'result':
      view = <ResultScreen onNext={() => go('recs')} onBack={() => go('photo')} />;
      break;
    case 'recs':
      view = (
        <RecsScreen
          onBack={() => go('result')}
          onPick={(id) => {
            setPickedId(id);
            go('detail');
          }}
          onHistory={() => go('history')}
        />
      );
      break;
    case 'detail':
      view = (
        <DetailScreen
          id={pickedId}
          onBack={() => go('recs')}
          onBarber={(id) => {
            setPickedId(id);
            go('barber');
          }}
        />
      );
      break;
    case 'barber':
      view = (
        <BarberScreen
          id={pickedId}
          onBack={() => go('detail')}
          onSaved={() => go('history')}
        />
      );
      break;
    case 'history':
      view = (
        <HistoryScreen
          onBack={() => go('recs')}
          onAdd={() => go('photo')}
          onRestart={() => go('welcome')}
        />
      );
      break;
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg0 }]}>
      <StatusBar barStyle={mode === 'light' ? 'dark-content' : 'light-content'} />
      {view}
    </View>
  );
}

export default function App() {
  const [bricolageLoaded] = useBricolage({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
  });
  const [geistLoaded] = useGeist({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
  });
  const [monoLoaded] = useGeistMono({
    GeistMono_400Regular,
    GeistMono_500Medium,
  });

  const fontsLoaded = bricolageLoaded && geistLoaded && monoLoaded;
  const hydrated = useAppStore((s) => s.hydrated);

  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="dark" initialAccent="electric">
        {fontsLoaded && hydrated ? (
          <AppShell />
        ) : (
          <View style={[styles.root, styles.loading]}>
            <ActivityIndicator color="#c7f25c" />
          </View>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    backgroundColor: '#15110d',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
