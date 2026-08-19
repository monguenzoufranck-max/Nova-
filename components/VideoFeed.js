import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MonetisationModal from './MonetisationModal';
import MusicPickerModal from './MusicPickerModal';

export default function VideoFeed() {
  const [vipModalVisible, setVipModalVisible] = useState(false);
  const [musicModalVisible, setMusicModalVisible] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('Cyberpunk Vibe');
  const [likes, setLikes] = useState(1200);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.container}>
      {/* Zone Vidéo */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoText}>Flux Vidéo NOVA</Text>
        
        {/* Bandeau Musique en bas */}
        <TouchableOpacity 
          style={styles.musicBar} 
          onPress={() => setMusicModalVisible(true)}
        >
          <Text style={styles.musicText}>🎵 Son : {selectedTrack}</Text>
        </TouchableOpacity>
      </View>

      {/* Barre d'actions latérale */}
      <View style={styles.sideBar}>
        {/* Bouton Like */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        {/* Bouton Commentaires */}
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>342</Text>
        </TouchableOpacity>

        {/* Bouton Partage */}
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>

        {/* Bouton VIP */}
        <TouchableOpacity 
          style={styles.vipButton} 
          onPress={() => setVipModalVisible(true)}
        >
          <Text style={styles.vipButtonIcon}>💎</Text>
          <Text style={styles.vipButtonText}>VIP</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <MonetisationModal 
        visible={vipModalVisible} 
        onClose={() => setVipModalVisible(false)} 
      />
      <MusicPickerModal 
        visible={musicModalVisible} 
        onClose={() => setMusicModalVisible(false)}
        onSelectTrack={(track) => setSelectedTrack(track.title)}
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  musicBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  musicText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sideBar: {
    position: 'absolute',
    right: 15,
    bottom: 90,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 18,
  },
  actionIcon: {
    fontSize: 26,
  },
  actionText: {
    color: '#FFF',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
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
