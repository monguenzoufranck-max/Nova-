import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../lib/supabaseClient';
import { translateToAnyLanguage } from '../services/universalTranslate';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

// Langue cible de l'utilisateur (peut être récupérée depuis son profil ou les paramètres de l'appareil)
const USER_TARGET_LANG = 'fr'; 

export default function UniversalFeedScreen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translatingId, setTranslatingId] = useState(null);

  useEffect(() => {
    fetchFeedVideos();
  }, []);

  const fetchFeedVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles:user_id(username, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Traduction automatique des légendes à la volée pour le feed multilingue
      const translatedVideos = await Promise.all(
        (data || []).map(async (vid) => {
          if (!vid.caption) return vid;
          try {
            // Appel à l'Edge Function pour traduire dans la langue de l'utilisateur
            const translatedCaption = await translateToAnyLanguage(vid.caption, USER_TARGET_LANG);
            return { ...vid, displayCaption: translatedCaption };
          } catch (err) {
            return { ...vid, displayCaption: vid.caption }; // Fallback en cas d'erreur
          }
        })
      );

      setVideos(translatedVideos);
    } catch (err) {
      console.error('Erreur chargement feed multilingue:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>Chargement du flux universel...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.videoCard}>
            {/* Vidéo en arrière-plan */}
            <Video
              source={{ uri: item.url }}
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping
            />

            {/* Overlay d'informations et traduction */}
            <View style={styles.overlay}>
              <View style={styles.userRow}>
                <Ionicons name="person-circle" size={32} color="#FFF" />
                <Text style={styles.username}>@{item.profiles?.username || 'nova_creator'}</Text>
              </View>

              <Text style={styles.caption}>{item.displayCaption || item.caption}</Text>

              <View style={styles.translatorBadge}>
                <Ionicons name="globe" size={14} color="#00E5FF" />
                <Text style={styles.translatorText}>Traduit automatiquement en {USER_TARGET_LANG.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  videoCard: {
    width: width,
    height: height,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  translatorBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  translatorText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '600',
  },
});
          
