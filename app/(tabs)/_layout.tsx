// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { backgroundColor: '#fff', height: 55 },
        tabBarLabelStyle: { marginBottom: 4 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="addTransaction"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
