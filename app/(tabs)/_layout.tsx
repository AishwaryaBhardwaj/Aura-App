import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { theme } from '../../src/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    async function checkOnboardingState() {
      try {
        const onboarded = await AsyncStorage.getItem('@hasCompletedOnboarding');
        if (onboarded === 'true') {
          setHasOnboarded(true);
        }
      } catch (e) {
        console.error('Storage error', e);
      } finally {
        setIsReady(true);
      }
    }
    checkOnboardingState();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.backgroundTop, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!hasOnboarded) {
    return <Redirect href="/lovers-story" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A1A1A', // Deep Charcoal
        tabBarInactiveTintColor: 'rgba(26, 26, 26, 0.6)', // 60% opaque charcoal
        tabBarStyle: { backgroundColor: '#F7E7CE', borderTopColor: theme.colors.border }, // Champagne Gold
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: '#F7E7CE' }, // Champagne Gold
        headerTintColor: '#1A1A1A', // Deep Charcoal
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily Trio',
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Aura Map',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: 'The Lab',
          tabBarIcon: ({ color }) => <TabBarIcon name="flask" color={color} />,
        }}
      />
    </Tabs>
  );
}
