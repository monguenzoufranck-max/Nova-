import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, TextInput, 
  ScrollView, ActivityIndicator, Alert, Dimensions 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabaseClient';

const { width } = Dimensions.get('window');

const FILTERS = [
  { id: 'normal', name: 'Normal', color: 'transparent' },
  { id: 'neon', name: 'Néon', color: 'rgba(255, 45, 85, 0.2)' },
  { id: 'bw', name: 'N&B', color: 'rgba(0, 0, 0, 0.5)' },
  { id: 'vintage', name: 'Vintage', color: 'rgba(255, 180, 50, 0.25)' },
  { id: 'cool', name: 'Cool', color: 'rgba(0, 150, 255, 0.2)' },
];

export default function CreateScreen({ navigation }) {
  const [videoUri, setVideoUri] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [uploading, setUploading] = useState(false);

  // Sélectionner une vidéo depuis la galerie
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

  // Publier la vidéo sur Supabase Storage & DB
  const handleUpload = async () => {
    if (!videoUri) return Alert.alert('Attention', 'Veuillez sélectionner une vidéo.');

    try {
      setUploading(true);
      const user = supabase.auth.user();
      
      const fileName = `${user ? user.id : 'anon'}/${Date.now()}.mp4`;
      const response = await fetch(videoUri);
      const blob = await response.blob();

      // Upload dans le bucket 'videos'
      const { error: storageError } = await supabase.storage
        .from('videos')
        .upload(fileName, blob);

      if (storageError) throw storageError;

      // Récupération de l'URL publique
      const { publicURL } = supabase.storage.from('videos').getPublicUrl(fileName);

      // Insertion dans la base de données
      const { error: dbError } = await supabase.from('videos').insert([
        {
          user_id: user ? user.id : null,
          video_url: publicURL,
          description: description,
          filter: selectedFilter,
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert('Succès 🚀', 'Votre vidéo a été publiée sur NOVA !');
      setVideoUri(null);
      setDescription('');
      navigation.navigate('Accueil');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setUploading(false);
    }
  };

  const activeFilterColor = FILTERS.find(f => f.id === selectedFilter)?.color || 'transparent';

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Créer un contenu</Text>

      {/* Zone de prévisualisation de la vidéo avec le filtre actif */}
      <TouchableOpacity style={styles.previewContainer} onPress={pickVideo} activeOpacity={0.8}>
        {videoUri ? (
          <View style={styles.videoPreview}>
            <Ionicons name="film-outline" size={48} color="#FF2D55" />
            <Text style={styles.videoSelectedText}>Vidéo sélectionnée</Text>
            {/* Calque de filtre appliqué */}
            <View style={[styles.filterOverlay, { backgroundColor: activeFilterColor }]} pointerEvents="none" />
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Ionicons name="cloud-upload-outline" size={50} color="#FF2D55" />
            <Text style={styles.placeholderText}>Appuyez pour choisir une vidéo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sélecteur de filtres visuels */}
      <Text style={styles.sectionLabel}>Filtres & Ambiance 3D</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {FILTERS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.filterChip,
              selectedFilter === item.id && styles.filterChipSelected
            ]}
            onPress={() => setSelectedFilter(item.id)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === item.id && styles.filterChipTextSelected
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Champ de description */}
      <TextInput
        style={styles.input}
        placeholder="Ajoutez une légende et des #hashtags..."
        placeholderTextColor="#666"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Bouton de publication */}
      {uploading ? (
        <ActivityIndicator size="large" color="#FF2D55" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity onPress={handleUpload} activeOpacity={0.85} style={styles.publishWrapper}>
          <LinearGradient
            colors={['#FF5E7E', '#FF2D55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.publishBtn}
          >
            <Text style={styles.publishBtnText}>Publier sur NOVA</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 20,
  },
  placeholderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
  videoPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  videoSelectedText: {
    color: '#FFF',
    marginTop: 8,
    fontWeight: '600',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionLabel: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  filtersScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipSelected: {
    borderColor: '#FF2D55',
    backgroundColor: 'rgba(255, 45, 85, 0.15)',
  },
  filterChipText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#FF2D55',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#121212',
    color: '#FFF',
    padding: 15,
    borderRadius: 12,
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  publishWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  publishBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
          
