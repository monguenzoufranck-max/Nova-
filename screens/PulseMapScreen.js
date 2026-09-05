import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Video } from 'expo-av';

// Client Supabase
import { supabase } from '../supabaseClient';

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

export default function PulseMapScreen() {
  const [pulsars, setPulsars] = useState([]);
  const [selectedPulsar, setSelectedPulsar] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initPulseMap();
  }, []);

  const initPulseMap = async () => {
    try {
      // 1. Demande de la position GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        // Position par défaut si refusée
        setRegion({
          latitude: -4.2634,
          longitude: 15.2429,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      // 2. Récupération des posts géolocalisés sur Supabase
      const { data, error } = await supabase
        .from('posts')
        .select('id, latitude, longitude, video_url, location_name, user_id')
        .not('latitude', 'is', null);

      if (!error && data) {
        setPulsars(data);
      }
    } catch (e) {
      console.log('Erreur chargement Pulse Map:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00F0FF" />
        <Text style={styles.loadingText}>Initialisation du Pulse Radar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carte interactives */}
      <MapView
        style={styles.map}
        customMapStyle={mapDarkStyle}
        initialRegion={region}
        showsUserLocation={true}
      >
        {pulsars.map((pulsar) => (
          <Marker
            key={pulsar.id}
            coordinate={{
              latitude: Number(pulsar.latitude),
              longitude: Number(pulsar.longitude),
            }}
            onPress={() => setSelectedPulsar(pulsar)}
          >
            {/* Pulsar Néon */}
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
            <Text style={styles.badgeText}>PULSE</Text>
          </View>

          {/* Lecteur Vidéo Expo */}
          {selectedPulsar.video_url ? (
            <Video
              source={{ uri: selectedPulsar.video_url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={styles.videoPlayer}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={{ color: '#00F0FF' }}>Vidéo indisponible</Text>
            </View>
          )}

          <Text style={styles.userText}>
            {selectedPulsar.location_name || 'Lieu inconnu'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A12' },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#00F0FF', marginTop: 12, letterSpacing: 1 },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 240, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulsarCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF007A',
  },
  videoCard: {
    position: 'absolute',
    bottom: 40,
    left: width * 0.08,
    width: width * 0.84,
    backgroundColor: 'rgba(18, 18, 37, 0.95)',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#00F0FF',
    alignItems: 'center',
  },
  closeBtn: { position: 'absolute', top: 10, right: 15, zIndex: 10 },
  closeText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  badge4k: {
    position: 'absolute',
    top: 12,
    left: 15,
    backgroundColor: '#FF007A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  videoPlayer: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginVertical: 10,
  },
  videoPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#1C1C2E',
    borderRadius: 16,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 13 },
});
    
