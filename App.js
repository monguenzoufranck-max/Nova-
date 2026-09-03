import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

// Import de ton nouvel écran Pulse Map
import PulseMapScreen from './screens/PulseMapScreen';

const Tab = createBottomTabNavigator();

// Composants temporaires pour les autres onglets
function HomeScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Fil d'actualité NOVA 🚀</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Profil Utilisateur 👤</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0A0A12',
            borderTopColor: '#00F0FF',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#00F0FF',
          tabBarInactiveTintColor: '#8E8E93',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ tabBarLabel: 'Feeds' }} 
        />
        <Tab.Screen 
          name="PulseMap" 
          component={PulseMapScreen} 
          options={{ tabBarLabel: 'Pulse Map 🌐' }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ tabBarLabel: 'Profil' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A12',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
    
