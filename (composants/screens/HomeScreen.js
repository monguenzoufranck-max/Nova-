import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabaseClient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, video_url, caption, media_type, likes_count, profiles(username)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.log('Erreur :', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    const newLikes = (currentLikes || 0) + 1;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: newLikes } : p))
    );
    await supabase.from('posts').update({ likes_count: newLikes }).eq('id', postId);
  };

  return (
    <LinearGradient colors={['#0A0A12', '#121225', '#05050A']} style={styles.container}>
      {/* En-tête Header avec Dégradé Neon */}
      <View style={styles.topHeader}>
        <LinearGradient
          colors={['#00F0FF', '#7000FF', '#FF007A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoGradientBorder}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoTitle}>NOVA 4K</Text>
          </View>
        </LinearGradient>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card3DContainer}>
              {/* Carte principale avec effet Glassmorphism & Ombre 3D */}
              <LinearGradient
                colors={['#1E1E38', '#14142B', '#0D0D1E']}
                style={styles.postCard}
              >
                {/* En-tête de la publication */}
                <View style={styles.postHeader}>
                  <LinearGradient
                    colors={['#00F0FF', '#FF007A']}
                    style={styles.avatarBorder}
                  >
                    <View style={styles.avatarInner}>
                      <Text style={styles.avatarText}>
                        {item.profiles?.username
                          ? item.profiles.username.charAt(0).toUpperCase()
                          : '👤'}
                      </Text>
                    </View>
                  </LinearGradient>
                  <Text style={styles.author}>@{item.profiles?.username || 'utilisateur'}</Text>
                </View>

                {/* Description */}
                {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}

                {/* Média (Photo / Vidéo) avec bordure lumineuse */}
                {item.video_url && (
                  <View style={styles.mediaContainer3D}>
                    {item.media_type === 'image' ? (
                      <Image source={{ uri: item.video_url }} style={styles.mediaImage} resizeMode="cover" />
                    ) : (
                      <Video
                        source={{ uri: item.video_url }}
                        style={styles.mediaVideo}
                        resizeMode="cover"
                        useNativeControls
                        isLooping
                      />
                    )}
                  </View>
                )}

                {/* Barre de boutons avec effet Néon */}
                <View style={styles.actionsBar}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLike(item.id, item.likes_count)}
                  >
                    <Text style={styles.actionIcon}>❤️</Text>
                    <Text style={styles.actionTextLike}>{item.likes_count || 0}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>Commenter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionIcon}>⚡</Text>
                    <Text style={styles.actionTextShare}>Partager</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 45 },
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
  },
  logoGradientBorder: {
    padding: 2,
    borderRadius: 20,
    // Ombre 3D
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  logoBadge: {
    backgroundColor: '#0A0A12',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 18,
  },
  logoTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
  
  // Structure de la carte 3D
  card3DContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
    // Effet d'ombre en relief 3D
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  postCard: {
    borderRadius: 22,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    marginRight: 12,
  },
  avatarInner: {
    flex: 1,
    backgroundColor: '#0A0A12',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 18 },
  author: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  caption: { color: '#E2E8F0', fontSize: 15, paddingHorizontal: 16, marginBottom: 12, lineHeight: 20 },
  
  mediaContainer3D: {
    width: '100%',
    height: 320,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mediaImage: { width: '100%', height: '100%' },
  mediaVideo: { width: '100%', height: '100%' },
  
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 20 },
  actionText: { color: '#A0AEC0', fontSize: 13, fontWeight: '700' },
  actionTextLike: { color: '#FF007A', fontSize: 14, fontWeight: '800' },
  actionTextShare: { color: '#00F0FF', fontSize: 13, fontWeight: '700' },
});
                       
