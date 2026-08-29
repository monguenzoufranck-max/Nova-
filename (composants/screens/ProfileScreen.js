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
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Récupérer le profil
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setUsername(data.username || '');
          setBio(data.bio || '');
        }

        // Compter le nombre de publications de l'utilisateur
        const { count, error: countError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (!countError) {
          setPostsCount(count || 0);
        }
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();

      const updates = {
        id: user.id,
        username: username.trim(),
        bio: bio.trim(),
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      Alert.alert('Succès 🎉', 'Profil mis à jour !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
      {/* Photo de profil par défaut */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username ? username.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        <Text style={styles.statsText}>{postsCount} Publication(s)</Text>
      </View>

      {/* Formulaire de modification */}
      <View style={styles.form}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Ex: alex_nova"
          placeholderTextColor="#8E8E93"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Bio / Description</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Parle-nous de toi..."
          placeholderTextColor="#8E8E93"
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateProfile}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 60, paddingHorizontal: 20 },
  centered: { flex: 1, backgroundColor: '#0F0F1A', justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1C1C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00F0FF',
    marginBottom: 10,
  },
  avatarText: { color: '#00F0FF', fontSize: 36, fontWeight: 'bold' },
  statsText: { color: '#8E8E93', fontSize: 14 },
  form: { width: '100%' },
  label: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  input: {
    backgroundColor: '#1C1C2E',
    color: '#FFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  bioInput: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#00F0FF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
  logoutButton: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: { color: '#FF2D55', fontWeight: 'bold', fontSize: 15 },
});
        
