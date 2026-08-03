import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoFeed from './VideoFeed';
import LiveStream from './LiveStream';
import Profile from './Profile';

export default function Navigation({ videos }) {
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'live', 'profile'

  return (
    <View style={styles.container}>
      {/* Affichage de l'écran selon l'onglet actif */}
      <View style={styles.screenContainer}>
        {currentTab === 'feed' && <VideoFeed videos={videos} />}
        {currentTab === 'live' && <LiveStream onClose={() => setCurrentTab('feed')} />}
        {currentTab === 'profile' && <Profile />}
      </View>

      {/* Barre de navigation en bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('feed')}
        >
          <Ionicons 
            name={currentTab === 'feed' ? "home" : "home-outline"} 
            size={24} 
            color={currentTab === 'feed' ? "#FFF" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'feed' && styles.activeTabText]}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('live')}
        >
          <View style={styles.liveBadgeIcon}>
            <Ionicons 
              name="radio-outline" 
              size={24} 
              color={currentTab === 'live' ? "#FF2D55" : "#888"} 
            />
          </View>
          <Text style={[styles.tabText, currentTab === 'live' && styles.activeTabText]}>
            Live
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('profile')}
        >
          <Ionicons 
            name={currentTab === 'profile' ? "person" : "person-outline"} 
            size={24} 
            color={currentTab === 'profile' ? "#FFF" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'profile' && styles.activeTabText]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#000',
    borderTopWidth: 0.5,
    borderTopColor: '#222',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabText: {
    color: '#888',
    fontSize: 10,
    marginTop: 3,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  liveBadgeIcon: {
    position: 'relative',
  },
});
    
