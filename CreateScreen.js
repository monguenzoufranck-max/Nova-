import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function CreateScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Autorisation de la caméra requise.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fonction pour sélectionner une vidéo depuis la galerie
  const pickVideoFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Vidéo sélectionnée :', result.assets[0].uri);
      Alert.alert('Succès', 'Vidéo sélectionnée prête à être publiée !');
      // Prochaine étape : envoi du fichier result.assets[0].uri vers Supabase Storage
    }
  };

  const handleRecord = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        const data = await cameraRef.current.recordAsync();
        console.log('Vidéo enregistrée :', data.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          {/* Option pour tourner la caméra */}
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
          >
            <Text style={styles.iconText}>🔄</Text>
          </TouchableOpacity>

          {/* Barre d'action inférieure */}
          <View style={styles.bottomBar}>
            {/* Bouton d'importation Galerie */}
            <TouchableOpacity style={styles.galleryButton} onPress={pickVideoFromGallery}>
              <Text style={styles.galleryText}>🖼️ Galerie</Text>
            </TouchableOpacity>

            {/* Bouton principal Enregistrer */}
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recording]}
              onPress={handleRecord}
            />

            {/* Espaceur pour équilibrer la mise en page */}
            <View style={{ width: 70 }} />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F1A' },
  text: { color: '#FFF', marginBottom: 20 },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  iconCircle: { alignSelf: 'flex-end', marginTop: 40, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
  iconText: { fontSize: 22 },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  galleryButton: { backgroundColor: 'rgba(28, 28, 46, 0.8)', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#00F0FF' },
  galleryText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  recordButton: { width: 75, height: 75, borderRadius: 40, borderWidth: 5, borderColor: '#FFF', backgroundColor: '#FF2D55' },
  recording: { backgroundColor: '#00F0FF', transform: [{ scale: 0.8 }] },
  button: { backgroundColor: '#00F0FF', padding: 12, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: 'bold' },
});
      
