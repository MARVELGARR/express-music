import { Tabs } from 'expo-router';
import { Home, Library, Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                animation: 'none',
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
