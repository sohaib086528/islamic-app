import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';

import HomeScreen from '../screens/Home/HomeScreen';
import QuranScreen from '../screens/Quran/QuranScreen';
import SurahReaderScreen from '../screens/Quran/SurahReaderScreen';
import AudioPlayerScreen from '../screens/Audio/AudioPlayerScreen';
import PrayerScreen from '../screens/Prayer/PrayerScreen';
import QiblaScreen from '../screens/Qibla/QiblaScreen';
import CalendarScreen from '../screens/Calendar/CalendarScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import BookmarksScreen from '../screens/Bookmarks/BookmarksScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Quran: '📖',
  Prayer: '🕌',
  Qibla: '🧭',
  Settings: '⚙️',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D1117',
          borderTopColor: '#30363D',
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#8B949E',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name] || '•'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Quran" component={QuranScreen} />
      <Tab.Screen name="Prayer" component={PrayerScreen} />
      <Tab.Screen name="Qibla" component={QiblaScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="SurahReader" component={SurahReaderScreen} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { hasCompletedOnboarding } = useSettingsStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
