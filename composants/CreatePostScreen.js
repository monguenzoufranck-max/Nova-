import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';

export default function CreatePostScreen({ navigation }) {
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // Capturer via l'appareil photo
  const openCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission requise', 'Accès à la caméra refusé.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
    }
  };

  // Téléverser et créer la publication
  const handlePublish = async () => {
    if (!mediaUri) {
      Alert.alert('Attention', 'Sélectionne ou prends une photo/vidéo avant de publier.');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté.');

      // 1. Envoi dans le bucket Supabase 'posts'
      const response = await fetch(mediaUri);
      const blob = await response.blob();
      const fileName = `${user.id}/${Date.now()}`;

      const { error: storageError } = await supabase.storage.from('posts').upload(fileName, blob);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName);

      // 2. Insertion dans la table 'posts'
      const { error: dbError } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          url: urlData.publicUrl,
          type: mediaType,
          caption: caption,
        }
      ]);

      if (dbError) throw dbError;

      Alert.alert('Succès ! 🚀', 'Ta publication est en ligne !');
      setMediaUri(null);
      setCaption('');
      if (navigation) navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une publication 🎥</Text>

      {/* Aperçu Média */}
      <TouchableOpacity style={styles.previewBox} onPress={openCamera}>
        {mediaUri ? (
          <Image source={{ uri: mediaUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.cameraIcon}>📸</Text>
            <Text style={styles.placeholderText}>Appuie pour prendre une photo ou vidéo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Champ Légende */}
      <TextInput
        style={styles.captionInput}
        placeholder="Écris une légende..."
        placeholderTextColor="#8E8E93"
        multiline
        value={caption}
        onChangeText={setCaption}
      />

      {/* Bouton Publier */}
      {uploading ? (
        <ActivityIndicator size="large" color="#00F0FF" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
          <Text style={styles.publishText}>Publier sur NOVA</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', padding: 20, paddingTop: 60 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  previewBox: { width: '100%', height: 260, backgroundColor: '#1A1A2E', borderRadius: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  previewImage: { width: '100%', height: '100%' },
  placeholderContainer: { alignItems: 'center' },
  cameraIcon: { fontSize: 40, marginBottom: 8 },
  placeholderText: { color: '#8E8E93', fontSize: 14 },
  captionInput: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, color: '#FFF', marginTop: 16, height: 90, textAlignVertical: 'top' },
  publishBtn: { backgroundColor: '#FF2A85', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  publishText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
    
