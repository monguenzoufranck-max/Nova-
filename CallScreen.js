// src/screens/CallScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function CallScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Simulation de la vue vidéo distante */}
      <View style={styles.videoContainer}>
        <View style={styles.remoteVideoPlaceholder}>
          <Text style={styles.placeholderText}>Caméra distante (NOVA Call)</Text>
        </View>

        {/* Aperçu vidéo local (petite vignette) */}
        <View style={styles.localVideoPlaceholder}>
          <Text style={styles.localText}>Vous</Text>
        </View>
      </View>

      {/* Barre de contrôle des appels */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.activeControl]} 
          onPress={() => setIsMuted(!isMuted)}
        >
          <Text style={styles.controlButtonText}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={() => alert("Appel terminé")}
        >
          <Text style={styles.controlButtonText}>Raccrocher</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.activeControl]} 
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Text style={styles.controlButtonText}>{isVideoOff ? "Cam On" : "Cam Off"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
    justifyContent: 'space-between',
  },
  videoContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#121214',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  placeholderText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  localVideoPlaceholder: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  localText: {
    color: '#ffffff',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
  },
  controlButton: {
    backgroundColor: '#1c1c1e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    minWidth: 90,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  activeControl: {
    backgroundColor: '#374151',
  },
  controlButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
    
