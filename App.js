import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importation de tes écrans
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import CreateScreen from './src/screens/CreateScreen';
import LiveScreen from './src/screens/LiveScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Importation du bouton central personnalisé
import CreateButton from './src/components/CreateButton';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FF2D55',
          tabBarInactiveTintColor: '#888888',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Découvrir') {
              iconName = focused ? 'compass' : 'compass-outline';
            } else if (route.name === 'Direct') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Découvrir" component={ExploreScreen} />
        
        {/* Onglet Créer avec le bouton personnalisé Néon 3D */}
        <Tab.Screen 
          name="Créer" 
          component={CreateScreen} 
          options={{
            tabBarLabel: () => null, // Masque le texte sous le bouton central
            tabBarButton: (props) => (
              <CreateButton onPress={props.onPress} />
            ),
          }} 
        />
        
        <Tab.Screen name="Direct" component={LiveScreen || View} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
          
