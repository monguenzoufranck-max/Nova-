import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { supabase } from '../supabase';

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === 'granted' && audioStatus.status === 'granted');
    })();
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      if (cameraRef.current) {
        try {
          setIsRecording(true);
          const videoData = await cameraRef.current.recordAsync({ maxDuration: 60 });
          await uploadVideo(videoData.uri);
        } catch (e) {
          console.error(e);
          setIsRecording(false);
        }
      }
    }
  };

  const uploadVideo = async (uri) => {
    try {
      setUploading(true);
      const filename = `video_${Date.now()}.mp4`;
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: filename,
        type: 'video/mp4',
      });

      // Téléversement dans le bucket 'videos' de Supabase
      const { data, error } = await supabase.storage.from('videos').upload(filename, formData);

      if (error) throw error;

      Alert.alert('Succès ! 🚀', 'Ta vidéo a été publiée sur NOVA.');
      if (navigation) navigation.navigate('Flux');
    } catch (error) {
      Alert.alert('Erreur de publication', error.message);
    } finally {
      setUploading(false);
      setIsRecording(false);
    }
  };

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return <View style={styles.container}><Text style={styles.text}>Accès caméra/micro refusé</Text></View>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#00F0FF" />
            <Text style={styles.uploadText}>Publication en cours...</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
            <Text style={styles.text}>🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.recordBtn, isRecording && styles.recordingBtn]}
            onPress={toggleRecording}
            disabled={uploading}
          >
            <View style={isRecording ? styles.innerSquare : styles.innerCircle} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1, justifyContent: 'flex-end' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 40 },
  text: { fontSize: 20, color: 'white' },
  flipBtn: { padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30 },
  recordBtn: { width: 75, height: 75, borderRadius: 40, borderWidth: 6, borderColor: '#FF2A85', justifyContent: 'center', alignItems: 'center' },
  recordingBtn: { borderColor: '#00F0FF' },
  innerCircle: { width: 55, height: 55, borderRadius: 30, backgroundColor: '#FF2A85' },
  innerSquare: { width: 30, height: 30, borderRadius: 6, backgroundColor: '#00F0FF' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  uploadText: { color: '#FFF', marginTop: 10, fontWeight: 'bold' },
});
                       
