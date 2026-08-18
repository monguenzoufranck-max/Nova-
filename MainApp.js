import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import VideoFeed from './VideoFeed';
import RecordVideoScreen from './RecordVideoScreen';
import ProfileScreen from './ProfileScreen';

// --- IMPORT DES ASSETS GRAPHIQUES (LES GEMMES 3D) ---
const GemmeProfile = require('../actifs/gemmes/icon_profile.png');
const GemmeVideo = require('../actifs/gemmes/icon_video.png');
const GemmeMessage = require('../actifs/gemmes/icon_message.png');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function GemLabel({ focused, title }) {
  return (
    <Text style={[styles.gemLabel, focused && styles.gemLabelFocused]}>
      {title}
    </Text>
  );
}

function GemIcon({ focused, source }) {
  return (
    <View style={styles.gemIconContainer}>
      <Image
        source={source}
        style={[styles.gemIcon, focused && styles.gemIconFocused]}
        resizeMode="contain"
      />
      {focused && <View style={styles.gemActiveGlow} />}
    </View>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mon Profil" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Vidéo"
        component={VideoFeed}
        options={{
          tabBarLabel: ({ focused }) => <GemLabel focused={focused} title="Vidéo" />,
          tabBarIcon: ({ focused }) => <GemIcon focused={focused} source={GemmeVideo} />,
        }}
      />
      <Tab.Screen
        name="Message"
        component={RecordVideoScreen}
        options={{
          tabBarLabel: ({ focused }) => <GemLabel focused={focused} title="Message" />,
          tabBarIcon: ({ focused }) => <GemIcon focused={focused} source={GemmeMessage} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          tabBarLabel: ({ focused }) => <GemLabel focused={focused} title="Profil" />,
          tabBarIcon: ({ focused }) => <GemIcon focused={focused} source={GemmeProfile} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F0F1A',
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gemIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
  },
  gemIcon: {
    width: 32,
    height: 32,
    opacity: 0.7,
  },
  gemIconFocused: {
    width: 40,
    height: 40,
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  gemActiveGlow: {
    position: 'absolute',
    bottom: -5,
    width: 15,
    height: 3,
    backgroundColor: '#00F0FF',
    borderRadius: 2,
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  gemLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  gemLabelFocused: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
    
