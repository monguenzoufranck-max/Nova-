import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../supabase';

import MonetisationModal from './MonetisationModal';
import MusicPickerModal from './MusicPickerModal';
import CommentairesModal from './CommentairesModal';
import GiftingModal from './GiftingModal';

const { height, width } = Dimensions.get('window');

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [vipModalVisible, setVipModalVisible] = useState(false);
  const [musicModalVisible, setMusicModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  
  const [selectedTrack, setSelectedTrack] = useState('Son original');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Récupérer la liste des fichiers enregistrés dans le bucket 'videos'
      const { data, error } = await supabase.storage.from('videos').list();

      if (error) throw error;

      if (data && data.length > 0) {
        // Générer les URLs publiques pour chaque vidéo
        const videoList = data.map(file => {
          const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(file.name);
          return { id: file.id, url: publicUrlData.publicUrl, name: file.name };
        });
        setVideos(videoList);
      }
    } catch (err) {
      console.error('Erreur chargement vidéos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00F0FF" />
        <Text style={styles.loadingText}>Chargement du flux NOVA...</Text>
      </View>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <View style={styles.container}>
      {currentVideo ? (
        <Video
          source={{ uri: currentVideo.url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🎥 Aucune vidéo publiée pour le moment.</Text>
          <Text style={styles.emptySubtext}>Rends-toi sur l'onglet Caméra pour enregistrer la première !</Text>
        </View>
      )}

      {/* Bouton du Son */}
      <TouchableOpacity 
        style={styles.musicBar} 
        onPress={() => setMusicModalVisible(true)}
      >
        <Text style={styles.musicText}>🎵 Son : {selectedTrack}</Text>
      </TouchableOpacity>

      {/* Barre d'actions à droite */}
      <View style={styles.sideBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => setCommentsModalVisible(true)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn} 
          onPress={() => setGiftModalVisible(true)}
        >
          <Text style={styles.actionIcon}>🎁</Text>
          <Text style={styles.actionText}>Cadeau</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.vipButton} 
          onPress={() => setVipModalVisible(true)}
        >
          <Text style={styles.vipButtonIcon}>💎</Text>
          <Text style={styles.vipButtonText}>VIP</Text>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <MonetisationModal visible={vipModalVisible} onClose={() => setVipModalVisible(false)} />
      <MusicPickerModal visible={musicModalVisible} onClose={() => setMusicModalVisible(false)} onSelectTrack={(track) => setSelectedTrack(track.title)} />
      <CommentairesModal visible={commentsModalVisible} onClose={() => setCommentsModalVisible(false)} />
      <GiftingModal visible={giftModalVisible} onClose={() => setGiftModalVisible(false)} onSendGift={(gift) => alert(`Cadeau ${gift.name} envoyé !`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { width: width, height: height },
  loadingContainer: { flex: 1, backgroundColor: '#0F0F1A', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#00F0FF', marginTop: 10, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  emptySubtext: { color: '#8E8E93', fontSize: 13, textAlign: 'center' },
  musicBar: { position: 'absolute', bottom: 30, left: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  musicText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  sideBar: { position: 'absolute', right: 15, bottom: 90, alignItems: 'center' },
  actionBtn: { alignItems: 'center', marginBottom: 18 },
  actionIcon: { fontSize: 26 },
  actionText: { color: '#FFF', fontSize: 11, marginTop: 4, fontWeight: '600' },
  vipButton: { backgroundColor: 'rgba(255, 42, 133, 0.2)', borderWidth: 1, borderColor: '#FF2A85', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  vipButtonIcon: { fontSize: 22 },
  vipButtonText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
});
    
