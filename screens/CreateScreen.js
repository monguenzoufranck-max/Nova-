import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseClient';

export default function CreateScreen({ navigation }) {
  const [videoUri, setVideoUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // Sélectionner une vidéo depuis la galerie
  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'Accès à la galerie nécessaire pour publier une vidéo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    }
  };

  // Téléverser la vidéo sur Supabase Storage et ajouter l'entrée dans la table 'posts'
  const handlePublish = async () => {
    if (!videoUri) {
      Alert.alert('Erreur', 'Veuillez sélectionner une vidéo.');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Préparation du fichier
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const fileName = `${user.id}/${Date.now()}.mp4`;

      // Upload dans le bucket Storage 'videos'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, blob, {
          contentType: 'video/mp4',
        });

      if (uploadError) throw uploadError;

      // URL publique de la vidéo
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Insertion dans la table 'posts'
      const { error: insertError } = await supabase.from('posts').insert([
        {
          user_id: user.id,
          video_url: publicUrl,
          caption: caption.trim(),
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert('Succès 🎉', 'Ta vidéo a été publiée sur NOVA !');
      setVideoUri(null);
      setCaption('');
      if (navigation) navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erreur de publication', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une publication 🎥</Text>

      {/* Zone de sélection de vidéo */}
      <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
        {videoUri ? (
          <Text style={styles.videoSelectedText}>✅ Vidéo sélectionnée</Text>
        ) : (
          <View style={styles.pickerPlaceholder}>
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.pickerText}>Choisir une vidéo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Légende / Description */}
      <TextInput
        style={styles.captionInput}
        placeholder="Écris une légende ou des #hashtags..."
        placeholderTextColor="#8E8E93"
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      {/* Bouton Publier */}
      <TouchableOpacity
        style={styles.publishButton}
        onPress={handlePublish}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.publishButtonText}>Publier sur NOVA</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 60, paddingHorizontal: 20 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  videoPicker: {
    height: 200,
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C2C3E',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  pickerPlaceholder: { alignItems: 'center' },
  plusIcon: { color: '#00F0FF', fontSize: 40, fontWeight: 'bold' },
  pickerText: { color: '#8E8E93', fontSize: 14, marginTop: 8 },
  videoSelectedText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 16 },
  captionInput: {
    backgroundColor: '#1C1C2E',
    color: '#FFF',
    padding: 14,
    borderRadius: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  publishButton: {
    backgroundColor: '#00F0FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  publishButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
      
