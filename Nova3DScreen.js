// src/screens/Nova3DScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated, Easing } from 'react-native';

export default function Nova3DScreen() {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [coreStatus, setCoreStatus] = useState('ACTIF');
  const [energyLevel, setEnergyLevel] = useState(98);

  useEffect(() => {
    // Animation de pulsation continue
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animation de rotation continue de l'anneau
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePulseCore = () => {
    setEnergyLevel((prev) => Math.min(prev + 2, 100));
    setCoreStatus('SURCHARGE');
    setTimeout(() => setCoreStatus('ACTIF'), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Holographique */}
      <View style={styles.header}>
        <Text style={styles.title}>NOVA CORE 3D</Text>
        <Text style={styles.subtitle}>Interface Holographique de Réseau</Text>
      </View>

      {/* Visualiseur 3D Central */}
      <View style={styles.visualizerContainer}>
        {/* Anneau extérieur rotatif */}
        <Animated.View style={[styles.outerRing, { transform: [{ rotate: spin }] }]} />

        {/* Sphère holographique pulsante */}
        <Animated.View style={[styles.coreSphere, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.coreInnerGlow} />
        </Animated.View>

        {/* Halo de fond */}
        <View style={styles.backgroundGlow} />
      </View>

      {/* Tableau de bord & Statuts */}
      <View style={styles.dashboard}>
        <View style={styles.statusRow}>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>STATUT NOYAU</Text>
            <Text style={[styles.statusValue, coreStatus === 'SURCHARGE' && styles.warningText]}>
              {coreStatus}
            </Text>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>ÉNERGIE</Text>
            <Text style={styles.statusValue}>{energyLevel}%</Text>
          </View>
        </View>

        {/* Bouton d'interaction */}
        <TouchableOpacity style={styles.interactButton} onPress={handlePulseCore}>
          <Text style={styles.interactButtonText}>STIMULER LE NOYAU</Text>
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    color: '#6366f1',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#8e8e93',
    fontSize: 13,
    marginTop: 4,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  outerRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
  },
  coreSphere: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  coreInnerGlow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a5b4fc',
  },
  dashboard: {
    padding: 20,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2c2c2e',
    alignItems: 'center',
  },
  statusLabel: {
    color: '#8e8e93',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#f59e0b',
  },
  interactButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  interactButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});
                      
