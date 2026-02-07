


import { Tabs } from 'expo-router';
import { Home, Search, Library } from 'lucide-react-native';
import { StyleSheet } from 'nativewind';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ animation: "none", }}>
      <Tabs.Screen
        name="index" // Matches index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library" // Matches search.tsx

        options={{
          title: 'library',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

