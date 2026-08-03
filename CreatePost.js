import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase';

export default function CreatePost({ onClose }) {
  const [caption, setCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePublish = async () => {
    if (!videoUrl.trim()) {
      Alert.alert('Erreur', 'Veuillez ajouter un lien ou sélectionner une vidéo.');
      return;
    }

    setUploading(true);

    try {
      // Enregistrement de la publication dans Supabase
      const { data, error } = await supabase.from('videos').insert([
        {
          url: videoUrl,
          description: caption,
          likes: 0,
          comments_count: 0,
          created_at: new Date(),
        },
      ]);

      if (error) throw error;

      Alert.alert('Succès', 'Votre vidéo a été publiée sur Nova !');
      onClose();
    } catch (error) {
      Alert.alert('Erreur de publication', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle publication</Text>
        <TouchableOpacity 
          style={[styles.publishBtn, uploading && styles.disabledBtn]} 
          onPress={handlePublish}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.publishBtnText}>Publier</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Formulaire de création */}
      <View style={styles.formContainer}>
        {/* Zone de sélection de vidéo */}
        <TouchableOpacity style={styles.videoPicker}>
          <Ionicons name="cloud-upload-outline" size={50} color="#FF2D55" />
          <Text style={styles.pickerText}>Appuyer pour sélectionner une vidéo</Text>
          <Text style={styles.pickerSubText}>Format vertical MP4 recommandé</Text>
        </TouchableOpacity>

        {/* Alternative pour coller un lien MP4 (pour les tests) */}
        <TextInput
          style={styles.inputUrl}
          placeholder="Ou coller l'URL direct de la vidéo (ex: .mp4)..."
          placeholderTextColor="#666"
          value={videoUrl}
          onChangeText={setVideoUrl}
        />

        {/* Légende & Hashtags */}
        <TextInput
          style={styles.captionInput}
          placeholder="Rédiger une légende... #nova #viral"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={caption}
          onChangeText={setCaption}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  publishBtn: {
    backgroundColor: '#FF2D55',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  publishBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
  },
  videoPicker: {
    height: 180,
    backgroundColor: '#111',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  pickerText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  pickerSubText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  inputUrl: {
    backgroundColor: '#161616',
    color: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 13,
  },
  captionInput: {
    backgroundColor: '#161616',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
  },
});
    
