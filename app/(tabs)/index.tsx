
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon'
import { } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import { MoonStarIcon, Search, Settings, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text, View } from 'react-native';

export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
  singular?: boolean;
}



const SCREEN_OPTIONS: ScreenType = {
  headerTitle: "",
  headerTransparent: true,
  headerRight: ({ tintColor }) => (
    <View className='flex-1 flex-row items-center '>
      <Link href={"/search"} className='flex-1'>
        <View className=' w-full gap-4 flex bg-muted flex-row items-center border-primary border p-1 rounded-xl '>
          <Search size={20} color={tintColor} />
          <Text className='text-muted-foreground '>Search songs, playlist and artist</Text>
        </View>
      </Link>
      <ThemeToggle />
    </View>
  ),
  headerLeft: ({ tintColor }) => (
    <>
      <Link className='p-2' href={"/settings"}>
        <Settings color={tintColor} className='text-foreground' />
      </Link>
    </>
  )

};



export default function Screen() {

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
