import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const HASHTAGS = ['#NOVA', '#Cyberpunk', '#Afrorave', '#Tech2026', '#MusicVibes'];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="🔍 Rechercher un créateur, un hashtag..." 
          placeholderTextColor="#8E8E93"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>TRENDS & HASHTAGS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
          {HASHTAGS.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>DÉCOUVRIR LES CRÉATEURS</Text>
        <View style={styles.grid}>
          <View style={styles.gridCard}><Text style={styles.cardText}>🔥 Top Vidéo 1</Text></View>
          <View style={styles.gridCard}><Text style={styles.cardText}>💎 Trend VIP</Text></View>
          <View style={styles.gridCard}><Text style={styles.cardText}>🎵 Musique Populaire</Text></View>
          <View style={styles.gridCard}><Text style={styles.cardText}>⚡ Live Stream</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 15, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  searchBar: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#FFF' },
  content: { padding: 16 },
  sectionTitle: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginTop: 15, marginBottom: 10 },
  tagsContainer: { flexDirection: 'row', marginBottom: 10 },
  tagBadge: { backgroundColor: 'rgba(0, 240, 255, 0.15)', borderWidth: 1, borderColor: '#00F0FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tagText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', height: 120, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});
            
