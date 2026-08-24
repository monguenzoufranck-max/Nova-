import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../supabaseClient';
import CommentModal from './CommentModal';

const { height, width } = Dimensions.get('window');

// Données de secours si la BDD est vide
const DUMMY_VIDEOS = [
  {
    id: '1',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-2659-large.mp4',
    caption: 'Bienvenue sur NOVA ! 🚀 #NOVA3D',
    profiles: { username: 'alex_nova' },
    likes_count: 12400,
  },
  {
    id: '2',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-neon-sign-41561-large.mp4',
    caption: 'Le design futuriste est en place 🌙 #LeGrandStyle',
    profiles: { username: 'design_master' },
    likes_count: 8100,
  },
];

function VideoItem({ item, isActive, onOpenComments }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);
  const [following, setFollowing] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Animations
  const heartScale = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Animation du grand cœur au centre (Double Tap)
  const triggerCenterHeart = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 0, duration: 200, delay: 400, useNativeDriver: true }),
    ]).start();
  };

  // Gestion du Double-Tap sur la vidéo
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (!liked) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      triggerCenterHeart();
    } else {
      setLastTap(now);
    }
  };

  // Gestion du clic sur le bouton Like
  const handleLikePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  // Partage de la vidéo
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Regarde cette vidéo sur NOVA ! 🚀\n"${item.caption}"\n${item.video_url}`,
      });
    } catch (error) {
      console.log('Erreur de partage :', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.videoContainer}>
        {/* Lecteur Vidéo */}
        <Video
          source={{ uri: item.video_url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={isActive}
          isLooping
        />

        {/* Cœur Animé au centre (Double Tap) */}
        <Animated.View style={[styles.centerHeart, { transform: [{ scale: heartScale }] }]}>
          <Text style={{ fontSize: 90 }}>❤️</Text>
        </Animated.View>

        {/* Overlay bas : Infos créateur & Légende */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.username}>@{item.profiles?.username || 'utilisateur'}</Text>
          <Text style={styles.description}>{item.caption}</Text>
        </View>

        {/* Overlay droit : Actions (Profil + Suivre, Like, Comment, Share) */}
        <View style={styles.rightOverlay}>
          {/* Avatar + Bouton Suivre (+ / ✓) */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <TouchableOpacity
              style={[styles.followBadge, following && styles.followingBadge]}
              onPress={() => setFollowing(!following)}
            >
              <Text style={styles.followText}>{following ? '✓' : '+'}</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Like */}
          <TouchableOpacity style={styles.iconButton} onPress={handleLikePress}>
            <Animated.Text style={[styles.iconText, { transform: [{ scale: buttonScale }] }]}>
              {liked ? '❤️' : '🤍'}
            </Animated.Text>
            <Text style={[styles.iconLabel, liked && styles.likedText]}>{likesCount}</Text>
          </TouchableOpacity>

          {/* Bouton Commentaires */}
          <TouchableOpacity style={styles.iconButton} onPress={onOpenComments}>
            <Text style={styles.iconText}>💬</Text>
            <Text style={styles.iconLabel}>Avis</Text>
          </TouchableOpacity>

          {/* Bouton Partager */}
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Text style={styles.iconText}>🔗</Text>
            <Text style={styles.iconLabel}>Partager</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url)');

      if (error || !data || data.length === 0) {
        setVideos(DUMMY_VIDEOS);
      } else {
        setVideos(data);
      }
    } catch (err) {
      setVideos(DUMMY_VIDEOS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <VideoItem
            item={item}
            isActive={activeIndex === index}
            onOpenComments={() => setShowComments(true)}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.y / height);
          setActiveIndex(newIndex);
        }}
      />

      {/* Fenêtre des commentaires */}
      <CommentModal visible={showComments} onClose={() => setShowComments(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F1A' },
  videoContainer: { width, height, justifyContent: 'center' },
  video: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  centerHeart: { position: 'absolute', alignSelf: 'center', zIndex: 10 },
  bottomOverlay: { position: 'absolute', bottom: 80, left: 16, right: 80 },
  username: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  description: { color: '#FFF', fontSize: 14, lineHeight: 18 },
  rightOverlay: { position: 'absolute', bottom: 90, right: 12, alignItems: 'center' },
  avatarWrapper: { marginBottom: 20, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1C1C2E', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#00F0FF' },
  followBadge: { position: 'absolute', bottom: -6, backgroundColor: '#FF2D55', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  followingBadge: { backgroundColor: '#00F0FF' },
  followText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  iconButton: { alignItems: 'center', marginBottom: 18 },
  iconText: { fontSize: 28 },
  iconLabel: { color: '#FFF', fontSize: 11, marginTop: 2 },
  likedText: { color: '#FF2D55', fontWeight: 'bold' },
});
      
