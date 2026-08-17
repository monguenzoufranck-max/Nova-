import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { supabase } from '../supabase';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    getProfile();
    fetchUserVideos();
  }, []);

  // Charger les données du profil
  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) return;

      let { data, error } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || null);
      }
    } catch (error) {
      console.log('Erreur chargement profil:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les vidéos publiées par cet utilisateur
  const fetchUserVideos = async () => {
    const user = supabase.auth.user();
    if (!user) return;

    const { data } = await supabase
      .from('posts')
      .select('id, video_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setUserVideos(data);
  };

  // Importer et envoyer un avatar vers le bucket "avatars"
  const pickAndUploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.cancelled) return;

      setUploading(true);
      const user = supabase.auth.user();
      const file = result;
      const fileExt = result.uri.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const formData = new FormData();
      formData.append('files', {
        uri: result.uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData);

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
      setAvatarUrl(publicUrl);
      Alert.alert('Succès', 'Photo de profil mise à jour !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setUploading(false);
    }
  };

  // Sauvegarder les modifications du profil
  const updateProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      Alert.alert('Succès', 'Profil enregistré avec succès !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Entête du profil */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickAndUploadAvatar} disabled={uploading}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.inputUsername}
          placeholder="Pseudo"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.inputBio}
          placeholder="Ajoute une bio..."
          placeholderTextColor="#888"
          value={bio}
          onChangeText={setBio}
        />

        <TouchableOpacity style={styles.btnSave} onPress={updateProfile}>
          <Text style={styles.btnSaveText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      {/* Grille des vidéos publiées */}
      <Text style={styles.sectionTitle}>Mes Publications</Text>
      <FlatList
        data={userVideos}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <Video
              source={{ uri: item.video_url }}
              style={styles.gridVideo}
              resizeMode="cover"
              shouldPlay={false}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14', paddingTop: 50 },
  center: { flex: 1, backgroundColor: '#0A0A14', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#00F0FF' },
  avatarPlaceholder: { backgroundColor: '#1A1A2E', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#00F0FF', fontSize: 32, fontWeight: 'bold' },
  inputUsername: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 12, textAlign: 'center' },
  inputBio: { color: '#AAA', fontSize: 14, marginTop: 6, textAlign: 'center' },
  btnSave: { marginTop: 15, backgroundColor: '#00F0FF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  btnSaveText: { color: '#0A0A14', fontWeight: 'bold' },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 15, marginBottom: 10 },
  gridItem: { width: width / 3, height: 160, padding: 2 },
  gridVideo: { width: '100%', height: '100%', borderRadius: 4 },
});
        
