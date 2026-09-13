import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ProgramsScreen from './src/screens/ProgramsScreen';
import ContactScreen from './src/screens/ContactScreen';
import MoreScreen from './src/screens/MoreScreen';

import type { RootTabParamList } from './src/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const DARK = '#1d1c18';
const GOLD = '#FCD116';
const INACTIVE = '#55524a';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Schedule: '◷',
    Programs: '⊞',
    Contact: '✉',
    More: '≡',
  };
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, { color: focused ? GOLD : INACTIVE }]}>
        {icons[label] ?? '●'}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={DARK} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: DARK,
              borderTopColor: '#2e2d28',
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
            },
            tabBarActiveTintColor: GOLD,
            tabBarInactiveTintColor: INACTIVE,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            },
            tabBarIcon: ({ focused }) => (
              <TabIcon label={route.name} focused={focused} />
            ),
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
          <Tab.Screen name="Programs" component={ProgramsScreen} />
          <Tab.Screen name="Contact" component={ContactScreen} />
          <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
});
