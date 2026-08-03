import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoFeed from './VideoFeed';
import LiveStream from './LiveStream';
import Explore from './Explore';
import Profile from './Profile';
import CreatePost from './CreatePost';

export default function Navigation({ videos }) {
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed', 'explore', 'live', 'profile'
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <View style={styles.container}>
      {/* Affichage de l'écran principal */}
      <View style={styles.screenContainer}>
        {currentTab === 'feed' && <VideoFeed videos={videos} />}
        {currentTab === 'explore' && <Explore />}
        {currentTab === 'live' && <LiveStream onClose={() => setCurrentTab('feed')} />}
        {currentTab === 'profile' && <Profile />}
      </View>

      {/* Modale de Création / Publication */}
      <Modal visible={showCreateModal} animationType="slide">
        <CreatePost onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Barre de navigation bas */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('feed')}>
          <Ionicons 
            name={currentTab === 'feed' ? "home" : "home-outline"} 
            size={22} 
            color={currentTab === 'feed' ? "#FFF" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'feed' && styles.activeTabText]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('explore')}>
          <Ionicons 
            name={currentTab === 'explore' ? "compass" : "compass-outline"} 
            size={22} 
            color={currentTab === 'explore' ? "#FFF" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'explore' && styles.activeTabText]}>Découvrir</Text>
        </TouchableOpacity>

        {/* Bouton central de Création (+) */}
        <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('live')}>
          <Ionicons 
            name={currentTab === 'live' ? "radio" : "radio-outline"} 
            size={22} 
            color={currentTab === 'live' ? "#FF2D55" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'live' && styles.activeTabText]}>Live</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('profile')}>
          <Ionicons 
            name={currentTab === 'profile' ? "person" : "person-outline"} 
            size={22} 
            color={currentTab === 'profile' ? "#FFF" : "#888"} 
          />
          <Text style={[styles.tabText, currentTab === 'profile' && styles.activeTabText]}>Profil</Text>
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
  createButton: {
    backgroundColor: '#FFF',
    width: 42,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
    
