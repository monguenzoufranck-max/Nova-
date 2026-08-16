import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importation de tes écrans
import VideoFeed from './components/VideoFeed';
import CreatePost from './components/CreatePost';
import ProfileScreen from './components/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0A0A14',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#00F0FF',
          tabBarInactiveTintColor: '#888888',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Créer') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={28} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={VideoFeed} />
        <Tab.Screen name="Créer" component={CreatePost} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
          }
          
