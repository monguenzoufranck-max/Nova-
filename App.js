// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ChatScreen from './src/screens/ChatScreen';
import CallScreen from './src/screens/CallScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import i18n from './src/i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState('chat');
  const [, setRefreshKey] = useState(0);

  // Fonction pour forcer le rafraîchissement des textes lors du changement de langue
  const handleLanguageChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Affichage de l'écran actif */}
      <View style={styles.screenContainer}>
        {currentTab === 'chat' && <ChatScreen />}
        {currentTab === 'call' && <CallScreen />}
        {currentTab === 'settings' && <SettingsScreen onLanguageChange={handleLanguageChange} />}
      </View>

      {/* Barre de navigation inférieure */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'chat' && styles.activeTab]}
          onPress={() => setCurrentTab('chat')}
        >
          <Text style={[styles.tabText, currentTab === 'chat' && styles.activeTabText]}>
            {i18n.t('messaging')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'call' && styles.activeTab]}
          onPress={() => setCurrentTab('call')}
        >
          <Text style={[styles.tabText, currentTab === 'call' && styles.activeTabText]}>
            Appels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, currentTab === 'settings' && styles.activeTab]}
          onPress={() => setCurrentTab('settings')}
        >
          <Text style={[styles.tabText, currentTab === 'settings' && styles.activeTabText]}>
            {i18n.t('settings')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1f1f24',
  },
  tabText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6366f1',
  },
});
    
