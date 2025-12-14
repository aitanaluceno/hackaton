import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TAB_BAR_BACKGROUND_COLOR = '#25292e'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: TAB_BAR_BACKGROUND_COLOR, 
          borderTopColor: TAB_BAR_BACKGROUND_COLOR, 
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected, 
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault, 
        
        headerStyle: {
          backgroundColor: TAB_BAR_BACKGROUND_COLOR, 
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text, 
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inici',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jocs"
        options={{
          title: 'Jocs',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gamecontroller.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="estadistiques"
        options={{
          title: 'Estadístiques',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preguntes"
        options={{
          title: 'Preguntes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="questionmark.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
