import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from './supabaseClient';

// Écrans principaux
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CreateScreen from './screens/CreateScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.createButton}>
              <Text style={styles.createIcon}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification de la session au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouteur de changement d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && session.user ? <MainTabs /> : <AuthScreen />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: '#0F0F1A',
    borderTopWidth: 1,
    borderTopColor: '#1C1C2E',
    height: 60,
    paddingBottom: 5,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  createButton: {
    width: 44,
    height: 30,
    backgroundColor: '#00F0FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#FF2D55',
    borderRightWidth: 3,
    borderRightColor: '#00F0FF',
  },
  createIcon: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
          
