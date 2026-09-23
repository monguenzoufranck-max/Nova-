import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar 
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(12400);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Lecteur Vidéo Plein Écran */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-dancing-in-a-studio-41315-large.mp4' }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
      />

      {/* Ombrage dégradé en bas pour bien lire le texte */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bottomGradient}
      />

      {/* Section Informations Vidéo (Bas Gauche) */}
      <View style={styles.videoInfo}>
        <Text style={styles.username}>@amenia_nova</Text>
        <Text style={styles.description} numberOfLines={2}>
          Bienvenue sur le prototype de l'application NOVA ! 🚀 #ReactNative #Figma #Design3D
        </Text>
      </View>

      {/* Barre d'actions verticales (Droite) */}
      <View style={styles.actionBar}>
        {/* Bouton Like */}
        <View style={styles.actionItem}>
          <TouchableOpacity 
            style={[styles.actionBtn, isLiked && styles.actionBtnLiked]} 
            onPress={handleLike}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={isLiked ? "#FF2D55" : "#FFF"} 
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>{likesCount.toLocaleString()}</Text>
        </View>

        {/* Bouton Commentaire */}
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-ellipses-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.actionText}>342</Text>
        </View>

        {/* Bouton Partage */}
        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="share-social-outline" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.actionText}>Partager</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 90,
    zIndex: 2,
  },
  username: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
  },
  actionBar: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
    zIndex: 2,
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionBtnLiked: {
    backgroundColor: 'rgba(255, 45, 85, 0.2)',
    borderColor: '#FF2D55',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
});
    
