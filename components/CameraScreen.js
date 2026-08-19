import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) return <View style={styles.container} />;
  if (hasPermission === false) return <View style={styles.container}><Text style={styles.text}>Accès caméra refusé</Text></View>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
            <Text style={styles.text}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recordBtn} />
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
  recordBtn: { width: 75, height: 75, borderRadius: 40, borderWidth: 6, borderColor: '#FF2A85', backgroundColor: '#FFF' },
});
