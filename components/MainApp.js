import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import VideoFeed from './VideoFeed';
import RecordVideoScreen from './RecordVideoScreen';
import ProfileScreen from './ProfileScreen';

// --- IMPORT DES ASSETS GRAPHIQUES (LES GEMMES 3D) ---
const GemmeProfile = require('../assets/gemmes/icon_profile.png');
const GemmeVideo = require('../assets/gemmes/icon_video.png');
const GemmeMessage = require('../assets/gemmes/icon_message.png');

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
      {focused && <View style={styles.gemActiveHalo} />}
    </View>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0A0A14' }, headerTintColor: '#FFF' }}>
      <Stack.Screen name="Mon Profil" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function MainApp() {
  return (
    <Tab.Navigator
      initialRouteName="Video"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.gemTabContainer}>
              <GemIcon focused={focused} source={GemmeProfile} />
              <GemLabel focused={focused} title="PROFILE" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Video"
        component={VideoFeed}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.gemTabContainer}>
              <GemIcon focused={focused} source={GemmeVideo} />
              <GemLabel focused={focused} title="VIDEO" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={RecordVideoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.gemTabContainer}>
              <GemIcon focused={focused} source={GemmeMessage} />
              <GemLabel focused={focused} title="MESSAGE" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
    height: 85,
    position: 'absolute',
    bottom: 0,
    elevation: 0,
    paddingBottom: 15,
  },
  gemTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  gemIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemIcon: {
    width: 38,
    height: 38,
    opacity: 0.85,
  },
  gemIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  gemActiveHalo: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFF',
    opacity: 0.2,
  },
  gemLabel: {
    color: '#AAA',
    fontSize: 10,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gemLabelFocused: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
    
