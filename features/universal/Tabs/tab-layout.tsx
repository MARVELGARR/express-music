


import { Tabs } from 'expo-router';
import { Home, Search, Library } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1DB954', tabBarStyle: { backgroundColor: '#000' } }}>
      <Tabs.Screen
        name="index" // Matches index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="search" // Matches search.tsx
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} />,
        }}
      />
      <Tabs.Screen
        name="library" // Matches library.tsx
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Library color={color} />,
        }}
      />
    </Tabs>
  );
}