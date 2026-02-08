import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import * as React from 'react';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      {/* <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
        <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: "modal" }} />


      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
