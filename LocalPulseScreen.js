import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function LocalPulseScreen() {
  const [location, setLocation] = useState(null);
  const [nearbyVideos, setNearbyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initLocationAndVideos() {
      try {
        // 1. Demander la permission de géolocalisation
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission de géolocalisation refusée');
          setLoading(false);
          return;
        }

        // 2. Récupérer la position actuelle
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        setLocation({ latitude, longitude });

        // 3. Charger les vidéos géolocalisées depuis Supabase
        await fetchNearbyVideos(latitude, longitude);
      } catch (err) {
        console.error('Erreur initialisation Pulse Local:', err.message);
      } finally {
        setLoading(false);
      }
    }

    initLocationAndVideos();
  }, []);

  const fetchNearbyVideos = async (lat, lng) => {
    // Récupération des vidéos possédant des coordonnées GPS
    const { data, error } = await supabase
      .from('videos')
      .select('id, caption, latitude, longitude, user_id')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      console.error('Erreur chargement vidéos:', error.message);
    } else {
      setNearbyVideos(data || []);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>Recherche des ondes NOVA autour de vous...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={darkMapStyle} // Optionnel : style sombre pour coller à l'UI NOVA
      >
        {nearbyVideos.map((video) => (
          <Marker
            key={video.id}
            coordinate={{
              latitude: video.latitude,
              longitude: video.longitude,
            }}
            title={video.caption ? video.caption.substring(0, 30) + '...' : 'Vidéo NOVA'}
            description="Appuyez pour voir la capsule"
          >
            <View style={styles.markerContainer}>
              <Ionicons name="play-circle" size={32} color="#00E5FF" />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

// Style de carte sombre personnalisé (Dark Mode)
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#AAA',
    fontSize: 14,
  },
  markerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
});
