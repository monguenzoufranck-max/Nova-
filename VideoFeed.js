import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VideoFeed = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER UNIQUE NOVA */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Profile')}
          style={styles.profileHeaderBtn}
        >
          <Ionicons name="person-circle" size={40} color="#00F0FF" />
          <View style={styles.plusBadge}>
            <Ionicons name="add" size={12} color="#000" />
          </View>
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <Text style={styles.tabInactive}>Orbit</Text>
          <View style={styles.activeDot} />
          <Text style={styles.tabActive}>Exploration</Text>
        </View>

        <TouchableOpacity style={styles.iconCircleBtn}>
          <Ionicons name="planet-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* SIDEBAR EN CAPSULE VERRE */}
      <View style={styles.glassSidebar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-sharp" size={28} color="#FF2A6D" />
          <Text style={styles.iconText}>2.1M</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubbles" size={26} color="#FFF" />
          <Text style={styles.iconText}>45K</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="paper-plane" size={25} color="#FFF" />
          <Text style={styles.iconText}>8.9K</Text>
        </TouchableOpacity>

        {/* Orbe audio cosmique */}
        <TouchableOpacity style={styles.audioOrb}>
          <Ionicons name="disc-outline" size={24} color="#00F0FF" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAV FLOATTANTE */}
      <View style={styles.floatingBottomNav}>
        <TouchableOpacity>
          <Ionicons name="compass-sharp" size={26} color="#00F0FF" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="people-outline" size={24} color="#888" />
        </TouchableOpacity>

        {/* Bouton Créer stylisé */}
        <TouchableOpacity style={styles.novaCreateBtn}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="flash-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050D',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  profileHeaderBtn: {
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#00F0FF',
    borderRadius: 8,
    padding: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabInactive: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00F0FF',
    marginHorizontal: 10,
  },
  tabActive: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassSidebar: {
    position: 'absolute',
    bottom: 110,
    right: 15,
    backgroundColor: 'rgba(15, 15, 25, 0.65)',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  audioOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: 'rgba(10, 10, 20, 0.85)',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  novaCreateBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7B2CBF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoFeed;
                 
