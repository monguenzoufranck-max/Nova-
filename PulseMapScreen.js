import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

// Style sombre Cyberpunk pour la carte
const mapDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f101d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#00f0ff' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f101d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1d1e38' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#ff007a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#05050a' }] },
];

// Données de démonstration pour les Pulsars
const DEMO_PULSARS = [
  {
    id: '1',
    latitude: -4.2634,
    longitude: 15.2429,
    username: '@amenia_boss',
    title: 'Cyberpunk Vibes #NOVA',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-lit-city-street-at-night-41525-large.mp4',
  },
  {
    id: '2',
    latitude: -4.2700,
    longitude: 15.2800,
    username: '@nova_creator',
    title: 'Night Life Pulse 4K',
    videoUrl: '',
  },
];

export default function PulseMapScreen() {
  const [selectedPulsar, setSelectedPulsar] = useState(null);

  return (
    <View style={styles.container}>
      {/* Carte interactives */}
      <MapView
        style={styles.map}
        customMapStyle={mapDarkStyle}
        initialRegion={{
          latitude: -4.2634,
          longitude: 15.2429,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {DEMO_PULSARS.map((pulsar) => (
          <Marker
            key={pulsar.id}
            coordinate={{ latitude: pulsar.latitude, longitude: pulsar.longitude }}
            onPress={() => setSelectedPulsar(pulsar)}
          >
            {/* Cercle lumineux Néon / Pulsar */}
            <View style={styles.pulsarRing}>
              <View style={styles.pulsarCore} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* En-tête futuriste */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NOVA</Text>
        <Text style={styles.headerSub}>PULSE MAP</Text>
      </View>

      {/* Bulle Vidéo Flottante 3D au clic */}
      {selectedPulsar && (
        <View style={styles.videoCard}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedPulsar(null)}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.badge4k}>
            <Text style={styles.badgeText}>4K</Text>
          </View>

          <View style={styles.videoPlaceholder}>
            <Text style={{ color: '#00F0FF', fontSize: 40 }}>▶</Text>
          </View>

          <Text style={styles.userText}>{selectedPulsar.username}</Text>
          <Text style={styles.titleText}>{selectedPulsar.title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  map: { width: '100%', height: '100%' },
  header: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: '#00F0FF', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  headerSub: { color: '#FFF', fontSize: 12, letterSpacing: 4 },
  pulsarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulsarCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF007A',
  },
  videoCard: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: 'rgba(18, 18, 37, 0.95)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    alignItems: 'center',
  },
  closeBtn: { position: 'absolute', top: 10, right: 15 },
  closeText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  badge4k: {
    position: 'absolute',
    top: 12,
    left: 15,
    backgroundColor: '#FF007A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  videoPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: { color: '#FF007A', fontWeight: 'bold', fontSize: 14 },
  titleText: { color: '#FFF', fontSize: 12, marginTop: 2 },
});
   
