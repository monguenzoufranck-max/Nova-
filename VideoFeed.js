import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase';
import CommentairesModal from './CommentairesModal'; // Assure-toi que le fichier est dans le même dossier

const { height, width } = Dimensions.get('window');

export default function VideoItem({ video }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nbCommentaires, setNbCommentaires] = useState(0);
  const [liked, setLiked] = useState(false);

  // Charger le nombre exact de commentaires depuis Supabase
  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!video?.id) return;
      
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', video.id);

      if (!error) {
        setNbCommentaires(count || 0);
      }
    };

    fetchCommentCount();
  }, [video?.id]);

  return (
    <View style={styles.container}>
      {/* BARRE ACTION LATÉRALE DROITE */}
      <View style={styles.rightBar}>
        {/* BOUTON LIKE */}
        <TouchableOpacity style={styles.iconContainer} onPress={() => setLiked(!liked)}>
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={35} 
            color={liked ? "#FF2A5F" : "#FFF"} 
          />
          <Text style={styles.iconText}>12.5K</Text>
        </TouchableOpacity>

        {/* BOUTON COMMENTAIRE */}
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="chatbubble-ellipses" size={33} color="#FFF" />
          <Text style={styles.iconText}>{nbCommentaires}</Text>
        </TouchableOpacity>

        {/* BOUTON PARTAGE */}
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="share-social" size={33} color="#FFF" />
          <Text style={styles.iconText}>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* FENÊTRE SURGISSANTE DES COMMENTAIRES */}
      <CommentairesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        videoId={video?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  rightBar: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
      
