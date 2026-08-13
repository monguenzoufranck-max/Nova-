import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase';

export default function LiveStream({ route, navigation }) {
  const [viewerCount, setViewerCount] = useState(1);
  const { channelId, hostName } = route.params || {};

  return (
    <View style={styles.container}>
      {/* En-tête du Live */}
      <View style={styles.header}>
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>{hostName || 'Créateur'}</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>EN DIRECT</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Compteur de spectateurs */}
      <View style={styles.viewerBadge}>
        <Ionicons name="eye" size={16} color="#FFF" />
        <Text style={styles.viewerText}>{viewerCount}</Text>
      </View>

      {/* Zone d'interaction (Bouton Cadeau) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.giftButton}>
          <Ionicons name="gift" size={26} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justify: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  hostName: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  liveBadge: {
    backgroundColor: '#FF2D55',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  viewerBadge: {
    position: 'absolute',
    top: 100,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewerText: {
    color: '#FFF',
    marginLeft: 5,
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 15,
    alignItems: 'flex-end',
  },
  giftButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justify: 'center',
    alignItems: 'center',
  },
});
    
