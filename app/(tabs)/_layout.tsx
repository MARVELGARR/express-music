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
                tabBarStyle: {
                    backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                    borderTopColor: isDark ? '#1c1c1e' : '#e5e5ea',
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    paddingTop: 6,
                    height: 60,
                },
                tabBarActiveTintColor: '#ff385c',
                tabBarInactiveTintColor: isDark ? '#666' : '#aaa',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
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
