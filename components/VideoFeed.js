import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../supabase';
import LikeButton from './LikeButton';
import CommentairesModal from './CommentairesModal';
import ShareButton from './ShareButton';

const { height, width } = Dimensions.get('window');

export default function VideoFeed() {
  const [posts, setPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [lastTap, setLastTap] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Charger les vidéos ainsi que le profil (pseudo, avatar) de leur auteur
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        video_url,
        created_at,
        user_id,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Erreur chargement posts:', error.message);
    } else if (data) {
      setPosts(data);
      if (data.length > 0) setActivePostId(data[0].id);
    }
  };

  // Gestion du défilement vertical plein écran (Paging)
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActivePostId(viewableItems[0].item.id);
    }
  };

  // Support du Double-Tap pour Liker la vidéo
  const handleDoubleTap = (postId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Déclencher le like (géré via le composant LikeButton ou logique personnalisée)
      console.log('Double tap détecté sur le post :', postId);
    } else {
      setLastTap(now);
    }
  };

  const renderItem = ({ item }) => {
    const profile = item.profiles || {};
    const username = profile.username || 'Utilisateur';
    const avatarUrl = profile.avatar_url;

    return (
      <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id)}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: item.video_url }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={item.id === activePostId}
            isLooping
          />

          {/* Superposition des détails de l'auteur (Bas Gauche) */}
          <View style={styles.overlayLeft}>
            <View style={styles.authorRow}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.authorAvatar} />
              ) : (
                <View style={[styles.authorAvatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.authorUsername}>@{username}</Text>
            </View>
          </View>

          {/* Superposition des boutons d'actions sociales (Bas Droite) */}
          <View style={styles.overlayRight}>
            <LikeButton postId={item.id} />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setSelectedPostForComments(item.id)}
            >
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>

            <ShareButton videoUrl={item.video_url} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
      />

      {/* Modal de Commentaires en Overlay */}
      {selectedPostForComments && (
        <CommentairesModal
          postId={selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { width, height, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  overlayLeft: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    right: 80,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00F0FF',
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#1A1A2E',
    justify: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#00F0FF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  authorUsername: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  overlayRight: {
    position: 'absolute',
    bottom: 40,
    right: 15,
    alignItems: 'center',
  },
  actionButton: {
    marginVertical: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
  },
});
                                           
