
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
  singular?: boolean;
}

const SCREEN_OPTIONS: ScreenType = {
  headerTitle: 'express-music',
  headerTransparent: true,
  headerRight: () => (
    <>
      <Avatar className="size-12 border-white bg-black" alt={" user "}>
        <AvatarImage source={require('@/assets/images/react-native-reusables-light.png')} />
        <AvatarFallback>
          <Text className=''>{"UN"}</Text>
        </AvatarFallback>
      </Avatar>
      <ThemeToggle />
    </>
  ),


};



export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
