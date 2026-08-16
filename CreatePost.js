import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';

export default function CreatePost({ navigation }) {
  const [uploading, setUploading] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const publishVideo = async () => {
    if (!videoUri) {
      Alert.alert('Erreur', 'Choisis une vidéo d\'abord.');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const response = await fetch(videoUri);
      const blob = await response.blob();
      const fileName = `${user.id}/${Date.now()}.mp4`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, blob);

      if (error) throw error;

      const videoUrl = supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl;

      await supabase.from('posts').insert([
        {
          user_id: user.id,
          video_url: videoUrl,
          created_at: new Date(),
        },
      ]);

      Alert.alert('Succès', 'Vidéo publiée !');
      setVideoUri(null);
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle publication</Text>
      <TouchableOpacity style={styles.selectBtn} onPress={pickVideo}>
        <Ionicons name="film-outline" size={40} color="#00F0FF" />
        <Text style={styles.selectText}>{videoUri ? 'Vidéo prête' : 'Choisir une vidéo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.publishBtn, uploading && { opacity: 0.5 }]} 
        onPress={publishVideo}
        disabled={uploading}
      >
        {uploading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.publishText}>Publier</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 40 },
  selectBtn: { width: '100%', height: 180, borderWidth: 2, borderColor: '#00F0FF', borderStyle: 'dashed', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  selectText: { color: '#FFF', marginTop: 10, fontSize: 16 },
  publishBtn: { width: '100%', height: 50, backgroundColor: '#7B2CBF', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  publishText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
        
