
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon'
import { } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, Search, Settings, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
  singular?: boolean;
}



export default function Screen() {

  return (
    <SafeAreaView>

      <View className='flex flex-row items-center justify-between'>
        <View>
          <Link className='p-2' href={"/settings"}>
            <Settings className='text-foreground' />
          </Link>
        </View>
        <View className='flex-1'>
          <Link href={"/search"} className=''>
            <View className=' w-full gap-4 flex bg-muted flex-row items-center border-primary border p-1 rounded-xl '>
              <Search size={20} />
              <Text className='text-muted-foreground '>Search songs, playlist and artist</Text>
            </View>
          </Link>
        </View>
        <ThemeToggle />
      </View>

    </SafeAreaView>

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
