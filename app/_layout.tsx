import { useMediaLibrarys } from '@/core/media-library';
import { AudioPlayerProvider } from '@/core/audio-player';
import { MiniPlayer } from '@/features/player/components/mini-player';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import * as React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const { getPermissions, songs } = useMediaLibrarys();

  useEffect(() => {
    getPermissions();
    if (songs) {
      SplashScreen.hideAsync();
    }
  }, []);

  return (
    <AudioPlayerProvider>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: "modal" }} />
          </Stack>
          <MiniPlayer />
        </View>
        <PortalHost />
      </ThemeProvider>
    </AudioPlayerProvider>
  );
}
