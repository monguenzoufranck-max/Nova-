import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');

// Données de démonstration (à remplacer plus tard par Supabase)
const DUMMY_VIDEOS = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-2659-large.mp4',
    user: '@alex_nova',
    description: 'Premier test de la plateforme NOVA ! 🚀',
    likes: '12.4K',
    comments: '452',
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-neon-sign-41561-large.mp4',
    user: '@design_master',
    description: 'Aperçu du mode sombre 🌙',
    likes: '8.1K',
    comments: '120',
  },
];

export default function HomeScreen() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      {/* Lecteur Vidéo */}
      <Video
        source={{ uri: item.videoUrl }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={activeVideoIndex === index}
        isLooping
      />

      {/* Overlay d'informations (bas) */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Boutons d'interaction (droite) */}
      <View style={styles.rightOverlay}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>❤️</Text>
          <Text style={styles.iconLabel}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>💬</Text>
          <Text style={styles.iconLabel}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🔗</Text>
          <Text style={styles.iconLabel}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_VIDEOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
          setActiveVideoIndex(newIndex);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { width, height, justifyContent: 'center' },
  video: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  bottomOverlay: { position: 'absolute', bottom: 80, left: 16, right: 80 },
  username: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  description: { color: '#FFF', fontSize: 14 },
  rightOverlay: { position: 'absolute', bottom: 100, right: 16, alignItems: 'center' },
  iconButton: { alignItems: 'center', marginBottom: 20 },
  iconText: { fontSize: 28 },
  iconLabel: { color: '#FFF', fontSize: 12, marginTop: 4 },
});
