import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.muted,
    tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.border },
    tabBarLabelStyle: { fontWeight: '700' }
  }}>
    <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="animais" options={{ title: 'Rebanho', tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" color={color} size={size} /> }} />
  </Tabs>;
}
