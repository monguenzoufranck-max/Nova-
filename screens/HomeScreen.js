import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../supabaseClient';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('forYou');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, video_url, caption, likes_count, profiles(username)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.log('Erreur chargement vidéos :', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    try {
      const updatedLikes = (currentLikes || 0) + 1;

      // Mise à jour locale instantanée
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId ? { ...p, likes_count: updatedLikes } : p
        )
      );

      // Mise à jour sur Supabase
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: updatedLikes })
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.log('Erreur lors du Like :', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveTab('following')}>
          <Text style={[styles.headerText, activeTab === 'following' && styles.activeHeaderText]}>
            Abonnements
          </Text>
          {activeTab === 'following' && <View style={styles.indicator} />}
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => setActiveTab('forYou')}>
          <Text style={[styles.headerText, activeTab === 'forYou' && styles.activeHeaderText]}>
            Pour toi
          </Text>
          {activeTab === 'forYou' && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00F0FF" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              {/* Lecteur Vidéo */}
              {item.video_url ? (
                <Video
                  source={{ uri: item.video_url }}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoText}>🎥 Aperçu Vidéo NOVA</Text>
                </View>
              )}

              {/* Bouton Like latéral */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(item.id, item.likes_count)}
                >
                  <Text style={styles.actionIcon}>❤️</Text>
                  <Text style={styles.actionCount}>{item.likes_count || 0}</Text>
                </TouchableOpacity>
              </View>

              {/* Infos Légende & Auteur */}
              <View style={styles.overlay}>
                <Text style={styles.author}>@{item.profiles?.username || 'utilisateur'}</Text>
                <Text style={styles.caption}>{item.caption}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  headerText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 16, fontWeight: 'bold' },
  activeHeaderText: { color: '#FFF', fontSize: 18 },
  separator: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 14 },
  indicator: { height: 3, backgroundColor: '#00F0FF', borderRadius: 2, marginTop: 4 },
  postContainer: { height: height, width: '100%', justifyContent: 'center', alignItems: 'center' },
  video: { ...StyleSheet.absoluteFillObject },
  videoPlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1C1C2E', justifyContent: 'center', alignItems: 'center' },
  videoText: { color: '#8E8E93', fontSize: 18 },
  actionsContainer: { position: 'absolute', right: 16, bottom: 120, alignItems: 'center' },
  actionButton: { alignItems: 'center', marginVertical: 8 },
  actionIcon: { fontSize: 32 },
  actionCount: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginTop: 4 },
  overlay: { position: 'absolute', bottom: 80, left: 16, right: 80 },
  author: { color: '#00F0FF', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  caption: { color: '#FFF', fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
               
