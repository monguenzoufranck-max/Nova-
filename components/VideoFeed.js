import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MonetisationModal from './MonetisationModal';

const { width, height } = Dimensions.get('window');

export default function VideoFeed() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Zone de contenu Vidéo */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoText}>Flux Vidéo NOVA</Text>
      </View>

      {/* Barre d'actions latérale (style TikTok / Reels) */}
      <View style={styles.sideBar}>
        {/* Bouton VIP / Gemmes Monétisation */}
        <TouchableOpacity 
          style={styles.vipButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.vipButtonIcon}>💎</Text>
          <Text style={styles.vipButtonText}>VIP</Text>
        </TouchableOpacity>
      </View>

      {/* Composant Pop-up / Modal Monétisation */}
      <MonetisationModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1A',
  },
  videoText: {
    color: '#00F0FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sideBar: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  vipButton: {
    backgroundColor: 'rgba(255, 42, 133, 0.2)',
    borderWidth: 1,
    borderColor: '#FF2A85',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2A85',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  vipButtonIcon: {
    fontSize: 22,
  },
  vipButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
            
