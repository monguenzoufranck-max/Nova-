import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabaseClient';

// Distance maximale en mètres pour déverrouiller la capsule
const UNLOCK_RADIUS_METERS = 50;

// Formule de Haversine pour calculer la distance entre deux points GPS
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
}

export default function TimeCapsuleScreen({ capsuleId }) {
  const [capsule, setCapsule] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLocationAndCapsule();
  }, [capsuleId]);

  const checkLocationAndCapsule = async () => {
    try {
      // 1. Demander la permission GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Active le GPS pour déverrouiller cette capsule !');
        setLoading(false);
        return;
      }

      // 2. Récupérer la position GPS actuelle
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUserLocation(location.coords);

      // 3. Charger les coordonnées de la capsule depuis Supabase
      const { data, error } = await supabase
        .from('time_capsules')
        .select('*, video:videos(*)')
        .eq('id', capsuleId)
        .single();

      if (error || !data) {
        Alert.alert('Erreur', 'Capsule introuvable.');
        setLoading(false);
        return;
      }

      setCapsule(data);

      // 4. Calculer la distance entre l'utilisateur et la capsule
      const dist = calculateDistanceMeters(
        location.coords.latitude,
        location.coords.longitude,
        data.latitude,
        data.longitude
      );

      setDistance(Math.round(dist));

      // 5. Vérifier si l'utilisateur est assez proche
      if (dist <= UNLOCK_RADIUS_METERS) {
        setIsUnlocked(true);
      }
    } catch (err) {
      console.error('Erreur vérification capsule:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>Vérification de ta position GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isUnlocked ? (
        // CONTENU DÉVERROUILLÉ : La vidéo s'affiche
        <View style={styles.unlockedContainer}>
          <Video
            source={{ uri: capsule?.video?.url }}
            style={styles.fullVideo}
            resizeMode="cover"
            shouldPlay
            isLooping
          />
          <View style={styles.unlockedBadge}>
            <Ionicons name="lock-open" size={18} color="#00E5FF" />
            <Text style={styles.unlockedText}>Capsule Déverrouillée !</Text>
          </View>
        </View>
      ) : (
        // CONTENU VERROUILLÉ : L'utilisateur est trop loin
        <View style={styles.lockedContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={64} color="#00E5FF" />
          </View>

          <Text style={styles.title}>Capsule Temporelle Sécurisée</Text>
          <Text style={styles.description}>
            Tu es à <Text style={styles.highlight}>{distance} mètres</Text> de cette capsule.
          </Text>

          <View style={styles.infoCard}>
            <Ionicons name="walk" size={24} color="#FFF" />
            <Text style={styles.infoText}>
              Rapproche-toi à moins de <Text style={styles.highlight}>50 mètres</Text> de ce lieu pour découvrir le secret vidéo caché ici.
            </Text>
          </View>

          <TouchableOpacity style={styles.retryBtn} onPress={checkLocationAndCapsule}>
            <Ionicons name="refresh" size={20} color="#000" />
            <Text style={styles.retryBtnText}>Actualiser ma position</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#AAA',
    fontSize: 14,
  },
  unlockedContainer: {
    flex: 1,
    position: 'relative',
  },
  fullVideo: {
    width: '100%',
    height: '100%',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  unlockedText: {
    color: '#00E5FF',
    fontWeight: 'bold',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: '#AAA',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  highlight: {
    color: '#00E5FF',
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#DDD',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E5FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  retryBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
  
