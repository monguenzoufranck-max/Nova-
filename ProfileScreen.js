import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 3;

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfileAndVideos();
  }, []);

  const fetchUserProfileAndVideos = async () => {
    setLoading(true);
    try {
      // 1. Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Charger les infos de profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile({
          username: user.email?.split('@')[0] || 'Utilisateur',
          avatar_url: null,
          bio: 'Bienvenue sur mon profil NOVA !',
        });
      }

      // 3. Charger les vidéos créées par cet utilisateur
      const { data: videosData, error } = await supabase
        .from('posts')
        .select('id, video_url, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setUserVideos(videosData || []);
      }
    } catch (err) {
      console.log('Erreur lors du chargement du profil:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <View style={styles.videoPlaceholder}>
        <Ionicons name="play-circle-outline" size={32} color="#00F0FF" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER PROFIL */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholderLarge}>
              <Ionicons name="person" size={40} color="#888" />
            </View>
          )}
        </View>

        <Text style={styles.username}>@{profile?.username || 'utilisateur'}</Text>
        <Text style={styles.bio}>{profile?.bio || 'Aucune biographie.'}</Text>

        {/* STATISTIQUES */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userVideos.length}</Text>
            <Text style={styles.statLabel}>Vidéos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>
        </View>

        {/* BOUTON MODIFIER PROFIL */}
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>

      {/* GRILLE DES VIDÉOS */}
      <FlatList
        data={userVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={48} color="#444" />
            <Text style={styles.emptyText}>Aucune vidéo publiée pour l'instant</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholderLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1F1F35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7B2CBF',
  },
  username: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    color: '#AAA',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  editBtn: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00F0FF',
  },
  editBtnText: {
    color: '#00F0FF',
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    paddingTop: 2,
  },
  gridItem: {
    width: COLUMN_WIDTH - 2,
    height: COLUMN_WIDTH * 1.4,
    margin: 1,
    backgroundColor: '#151525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
});
    
