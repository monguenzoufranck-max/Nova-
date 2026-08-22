import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Importation de tes écrans
import HomeScreen from './composants/HomeScreen'; // Ton fil d'actualité vidéo
import SearchScreen from './composants/SearchScreen';
import CreatePostScreen from './composants/CreatePostScreen';
import ChatScreen from './composants/ChatScreen';
import ProfileScreen from './composants/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0F0F1A',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#00F0FF',
          tabBarInactiveTintColor: '#8E8E93',
        }}
      >
        <Tab.Screen 
          name="Accueil" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🏚️'}</Text>
          }}
        />
        <Tab.Screen 
          name="Recherche" 
          component={SearchScreen} 
          options={{
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>🔍</Text>
          }}
        />
        <Tab.Screen 
          name="Créer" 
          component={CreatePostScreen} 
          options={{
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 24 }}>➕</Text>
          }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>💬</Text>
          }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20 }}>👤</Text>
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
            }
          
