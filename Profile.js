import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from './i18n';

export default function Profile() {
  const { t, locale, switchLanguage } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#555" />
        </View>
        <Text style={styles.username}>@franck_nova</Text>
        <Text style={styles.bio}>Créateur sur Nova 🚀</Text>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>{t('posts')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>{t('followers')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>340</Text>
            <Text style={styles.statLabel}>{t('following')}</Text>
          </View>
        </View>

        {/* Choix de la langue */}
        <View style={styles.langSection}>
          <Text style={styles.langTitle}>{t('changeLanguage')} :</Text>
          <View style={styles.langButtons}>
            <TouchableOpacity 
              style={[styles.langBtn, locale === 'fr' && styles.activeLangBtn]} 
              onPress={() => switchLanguage('fr')}
            >
              <Text style={styles.langBtnText}>🇫🇷 Français</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.langBtn, locale === 'en' && styles.activeLangBtn]} 
              onPress={() => switchLanguage('en')}
            >
              <Text style={styles.langBtnText}>🇬🇧 English</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  username: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    color: '#AAA',
    fontSize: 13,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#222',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  langSection: {
    marginTop: 15,
    alignItems: 'center',
  },
  langTitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  langButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  langBtn: {
    backgroundColor: '#161616',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeLangBtn: {
    borderColor: '#FF2D55',
    backgroundColor: '#220810',
  },
  langBtnText: {
    color: '#FFF',
    fontSize: 12,
  },
});
    
