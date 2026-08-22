import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Récupération de l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData || { username: 'Utilisateur NOVA', bio: 'Bienvenue sur mon profil !', followers: 0, following: 0 });

        // Récupération des posts de l'utilisateur
        const { data: posts } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id);
        setUserPosts(posts || []);
      }
    } catch (err) {
      console.error('Erreur chargement profil:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00F0FF" style={styles.center} />;
  }

  return (
    <View style={styles.container}>
      {/* En-tête Profil */}
      <View style={styles.header}>
        <Image
          source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>@{profile?.username || 'nova_user'}</Text>
        <Text style={styles.bio}>{profile?.bio || 'Créateur de contenu sur NOVA 🚀'}</Text>

        {/* Statistiques */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile?.followers || 0}</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile?.following || 0}</Text>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Vidéos</Text>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.btnText}>Éditer le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.vipBtn}>
            <Text style={styles.vipText}>👑 Devenir VIP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grille des publications */}
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.thumbnail_url || item.url }} style={styles.gridImage} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune publication pour le moment.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  center: { flex: 1, backgroundColor: '#0F0F1A', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#1A1A2E' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#00F0FF', marginBottom: 10 },
  username: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bio: { color: '#8E8E93', fontSize: 13, marginTop: 4, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statLabel: { color: '#8E8E93', fontSize: 12 },
  actionRow: { flexDirection: 'row', marginTop: 18, gap: 10 },
  editBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  vipBtn: { backgroundColor: 'linear-gradient(45deg, #FFD700, #FF8C00)', backgroundColor: '#FFD700', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  vipText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  gridImage: { width: '33%', height: 120, margin: 1, backgroundColor: '#222' },
  emptyText: { color: '#8E8E93', textAlign: 'center', marginTop: 40 }
});
      
