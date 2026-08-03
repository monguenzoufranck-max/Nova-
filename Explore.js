import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const itemSize = width / 2 - 15;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Données de démo pour la grille "Tendances"
  const [trendingItems] = useState([
    { id: '1', title: 'Nouveau challenge Nova 🔥', views: '45.2k', tag: '#NovaChallenge' },
    { id: '2', title: 'Tuto React Native complet', views: '12.8k', tag: '#DevApp' },
    { id: '3', title: 'Extrait de Live incroyable !', views: '98.1k', tag: '#Live' },
    { id: '4', title: 'Setup de dev 2026 💻', views: '32.0k', tag: '#Tech' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des utilisateurs, vidéos..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Titre Tendances */}
      <Text style={styles.sectionTitle}>Tendance sur Nova 🔥</Text>

      {/* Grille des contenus de découverte */}
      <FlatList
        data={trendingItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardPlaceholder}>
              <Ionicons name="play-circle-outline" size={40} color="rgba(255,255,255,0.7)" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTag}>{item.tag}</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.viewsRow}>
                <Ionicons name="eye-outline" size={12} color="#AAA" />
                <Text style={styles.viewsText}>{item.views}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#262626',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  card: {
    width: itemSize,
    backgroundColor: '#111',
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222',
  },
  cardPlaceholder: {
    height: 180,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    padding: 10,
  },
  cardTag: {
    color: '#FF2D55',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  viewsText: {
    color: '#AAA',
    fontSize: 11,
    marginLeft: 4,
  },
});
    
