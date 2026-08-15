import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VideoFeed = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER (HAUT DE L'ÉCRAN) */}
      <View style={styles.header}>
        {/* Bouton Profil + avec accès rapide */}
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Profile')}
          style={styles.profileHeaderBtn}
        >
          <Ionicons name="person-circle-outline" size={38} color="#FFF" />
          <View style={styles.plusBadge}>
            <Ionicons name="add-circle" size={14} color="#FF0050" />
          </View>
        </TouchableOpacity>

        {/* Onglets centraux */}
        <View style={styles.tabsContainer}>
          <Text style={styles.tabInactive}>Following</Text>
          <Text style={styles.tabActive}>For You</Text>
        </View>

        {/* Icône de recherche */}
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* BARRE LATÉRALE DROITE (SANS AVATAR) */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart" size={35} color="#FFF" />
          <Text style={styles.iconText}>2.1M</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-ellipses" size={32} color="#FFF" />
          <Text style={styles.iconText}>45K</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="bookmark" size={32} color="#FFF" />
          <Text style={styles.iconText}>12K</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-social" size={32} color="#FFF" />
          <Text style={styles.iconText}>8.9K</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="disc" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

// STYLES DE L'INTERFACE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  profileHeaderBtn: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabInactive: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 15,
  },
  tabActive: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  searchBtn: {
    padding: 5,
  },
  sidebar: {
    position: 'absolute',
    bottom: 80,
    right: 12,
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
});

export default VideoFeed;
  
