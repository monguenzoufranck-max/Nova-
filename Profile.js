import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const itemSize = width / 3;

export default function Profile({ userProfile }) {
  const profile = userProfile || {
    username: 'franck_monguenzou',
    name: 'Franck Monguenzou',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Fondateur de Nova 🚀 | Créateur de contenu',
    following: 120,
    followers: '15.4k',
    likes: '89.2k',
  };

  // Exemple de vidéos publiées par l'utilisateur
  const [userVideos] = useState([
    { id: '1', views: '1.2k' },
    { id: '2', views: '4.5k' },
    { id: '3', views: '800' },
    { id: '4', views: '12k' },
    { id: '5', views: '3.1k' },
  ]);

  return (
    <View style={styles.container}>
      {/* En-tête Profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>

        {/* Statistiques (Abonnements / Abonnés / J'aime) */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.following}</Text>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.followers}</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.likes}</Text>
            <Text style={styles.statLabel}>J'aime</Text>
          </View>
        </View>

        {/* Bio & Boutons */}
        <Text style={styles.bio}>{profile.bio}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grille des vidéos */}
      <FlatList
        data={userVideos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.videoGridItem}>
            <Ionicons name="play" size={16} color="#FFF" style={styles.playIcon} />
            <Text style={styles.viewCount}>{item.views}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#333',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
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
    height: 15,
    backgroundColor: '#333',
  },
  bio: {
    color: '#DDD',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#222',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconBtn: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 20,
  },
  videoGridItem: {
    width: itemSize,
    height: itemSize * 1.3,
    backgroundColor: '#1a1a1a',
    borderWidth: 0.5,
    borderColor: '#000',
    justifyContent: 'flex-end',
    padding: 8,
  },
  playIcon: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  viewCount: {
    color: '#FFF',
    fontSize: 11,
    marginLeft: 18,
  },
});
    
