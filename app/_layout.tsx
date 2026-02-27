import { useMediaLibrarys } from '@/core/media-library';
import { AudioPlayerProvider } from '@/core/audio-player';
import { MiniPlayer } from '@/features/player/components/mini-player';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

import * as React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

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
            {/* Main tab navigator */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Detail / App screens — stack on top of tabs, no tab bar */}
            <Stack.Screen
              name="(app)"
              options={{ headerShown: false }}
            />
            {/* 404 */}
            <Stack.Screen name="+not-found" />
          </Stack>
          {/* Persistent mini-player sits above the tab bar */}
          <MiniPlayer />
        </View>
        <PortalHost />
      </ThemeProvider>
    </AudioPlayerProvider>
  );
}
