import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

// Import de tous tes composants
import VideoFeed from './composants/VideoFeed';
import CameraScreen from './composants/CameraScreen';
import ChatScreen from './composants/ChatScreen';
import SettingsScreen from './composants/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#00F0FF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarIcon: ({ focused }) => {
            let icon = '🏠';
            if (route.name === 'Flux') icon = '🔥';
            else if (route.name === 'Caméra') icon = '📷';
            else if (route.name === 'Chat') icon = '💬';
            else if (route.name === 'Profil') icon = '⚙️';

            return <Text style={{ fontSize: focused ? 22 : 18 }}>{icon}</Text>;
          },
        })}
      >
        <Tab.Screen name="Flux" component={VideoFeed} />
        <Tab.Screen name="Caméra" component={CameraScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profil" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F0F1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
          
