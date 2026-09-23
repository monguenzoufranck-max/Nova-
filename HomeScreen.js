import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient'; // Ajuste le chemin selon ton projet

const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, profiles(username, avatar_url)');
    
    if (error) {
      console.log('Erreur Supabase:', error.message);
    } else {
      setVideos(data);
    }
  };

  const renderItem = ({ item, index }) => {
    const isPlaying = index === currentIndex;

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.video_url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={isPlaying}
          isLooping
        />

        {/* Action Buttons Overlay */}
        <View style={styles.rightBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart" size={35} color="#FF2D55" />
            <Text style={styles.iconText}>{item.likes_count || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-ellipses" size={32} color="#FFF" />
            <Text style={styles.iconText}>{item.comments_count || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social" size={32} color="#FFF" />
            <Text style={styles.iconText}>Partager</Text>
          </TouchableOpacity>
        </View>

        {/* Video Info Overlay */}
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@{item.profiles?.username || 'utilisateur'}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
          setCurrentIndex(newIndex);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { width: width, height: height, justifyContent: 'center' },
  video: { width: '100%', height: '100%', position: 'absolute' },
  rightBar: { position: 'absolute', right: 15, bottom: 100, alignItems: 'center' },
  iconButton: { alignItems: 'center', marginBottom: 20 },
  iconText: { color: '#FFF', fontSize: 12, marginTop: 4, fontWeight: '600' },
  bottomInfo: { position: 'absolute', bottom: 40, left: 15, right: 80 },
  username: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  description: { color: '#FFF', fontSize: 14 }
});
      
