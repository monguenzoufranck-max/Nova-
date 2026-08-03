import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function VideoFeed({ videos = [] }) {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.videoCard}>
      {/* Simulation zone vidéo */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoText}>Vidéo Nova: {item.title || 'Extrait'}</Text>
      </View>

      {/* Superposition des boutons d'interaction */}
      <View style={styles.sideBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id)}>
          <Ionicons 
            name={liked[item.id] ? "heart" : "heart-outline"} 
            size={35} 
            color={liked[item.id] ? "#FF2D55" : "#FFF"} 
          />
          <Text style={styles.iconText}>{item.likes || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FFF" />
          <Text style={styles.iconText}>{item.comments_count || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={32} color="#FFF" />
          <Text style={styles.iconText}>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Informations de l'auteur en bas */}
      <View style={styles.bottomBar}>
        <Text style={styles.username}>@{item.profiles?.username || 'utilisateur'}</Text>
        <Text style={styles.description}>{item.description || 'Bienvenue sur Nova !'}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos.length > 0 ? videos : [{ id: '1', title: 'Démo Nova' }]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      decelerationRate="fast"
    />
  );
}

const styles = StyleSheet.create({
  videoCard: {
    width: width,
    height: height,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sideBar: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    right: 80,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#FFF',
    fontSize: 14,
  },
});
    
