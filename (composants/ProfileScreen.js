import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('utilisateur_nova');
  const [bio, setBio] = useState('Entrepreneur & Créateur sur NOVA 🚀');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username || 'utilisateur_nova');
        setBio(data.bio || 'Entrepreneur & Créateur sur NOVA 🚀');
      }
    } catch (error) {
      console.log('Erreur profil :', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) {
        Alert.alert('Info', 'Modifications enregistrées en local !');
        setIsEditing(false);
        return;
      }

      const updates = {
        id: user.id,
        username,
        bio,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      Alert.alert('Succès', 'Profil mis à jour !');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Erreur', error.message);
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
      {/* En-tête Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Pseudo"
              placeholderTextColor="#8E8E93"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Bio"
              placeholderTextColor="#8E8E93"
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.bio}>{bio}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Vidéos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>45K</Text>
          <Text style={styles.statLabel}>J'aime</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 60, alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F1A' },
  avatarContainer: { alignItems: 'center', width: '100%', paddingHorizontal: 20 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1C1C2E', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#00F0FF' },
  avatarText: { fontSize: 40 },
  infoContainer: { alignItems: 'center', width: '100%' },
  username: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  bio: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  editButton: { backgroundColor: '#1C1C2E', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#00F0FF' },
  editButtonText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 13 },
  editForm: { width: '100%', alignItems: 'center' },
  input: { width: '80%', backgroundColor: '#1C1C2E', color: '#FFF', padding: 10, borderRadius: 10, marginBottom: 10, textAlign: 'center' },
  bioInput: { height: 60 },
  saveButton: { backgroundColor: '#00F0FF', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
  saveButtonText: { color: '#000', fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 20, marginTop: 30, borderTopWidth: 1, borderColor: '#1C1C2E', paddingTop: 20 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#FFF', fontSize: 12, marginTop: 2 },
});
    
