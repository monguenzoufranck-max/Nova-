import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [userProfile, setUserProfile] = useState({
    username: "Franck_Monguenzou",
    is_verified: true, // Badge bleu certifié
    monetization_status: "active"
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* En-tête / Profil utilisateur */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Text style={styles.username}>@{userProfile.username}</Text>
          {userProfile.is_verified && (
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color="#1DA1F2" 
              style={styles.badge} 
            />
          )}
        </View>

        {/* Statut Monétisation */}
        <TouchableOpacity style={styles.monetizationBadge}>
          <Text style={styles.monetizationText}>⭐ Le Grand Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Zone Vidéo Principal NOVA */}
      <View style={styles.videoContainer}>
        <Ionicons name="play-circle-outline" size={80} color="#FFF" />
        <Text style={styles.videoPlaceholderText}>Lecteur Vidéo Nova</Text>
      </View>

      {/* Menu / Interactions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={28} color="#FFF" />
          <Text style={styles.iconText}>J'aime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={28} color="#FFF" />
          <Text style={styles.iconText}>Commentaires</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="radio-outline" size={28} color="#FFF" />
          <Text style={styles.iconText}>Live</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    marginLeft: 6,
  },
  monetizationBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  monetizationText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  videoPlaceholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
});
    
