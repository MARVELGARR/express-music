


import { Tabs } from 'expo-router';
import { Home, Library } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ animation: "none", headerShown: false }}>
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

