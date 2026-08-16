import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from './supabase'; // Vérifie le chemin de ton fichier client Supabase

export default function CommentairesModal({ visible, onClose, videoId }) {
  const [commentaires, setCommentaires] = useState([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les commentaires quand la fenêtre s'ouvre
  useEffect(() => {
    if (visible && videoId) {
      chargerCommentaires();
    }
  }, [visible, videoId]);

  // Récupération des commentaires
  const chargerCommentaires = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (!error) {
      setCommentaires(data || []);
    }
    setLoading(false);
  };

  // Envoi d'un nouveau commentaire
  const publierCommentaire = async () => {
    if (!nouveauCommentaire.trim()) return;

    // Récupération de l'utilisateur connecté (Syntaxe Supabase v2)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Connecte-toi pour publier un commentaire');
      return;
    }

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          video_id: videoId,
          user_id: user.id,
          content: nouveauCommentaire.trim(),
        }
      ]);

    if (!error) {
      setNouveauCommentaire('');
      chargerCommentaires(); // Rafraîchir la liste après publication
    }
  };

  const renderCommentaire = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={18} color="#888" />
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.username}>@utilisateur</Text>
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
      <TouchableOpacity style={styles.likeBtn}>
        <Ionicons name="heart-outline" size={16} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          {/* EN-TÊTE DE LA MODAL */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{commentaires.length} commentaires</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* LISTE DES COMMENTAIRES */}
          {loading ? (
            <ActivityIndicator color="#00F0FF" style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={commentaires}
              renderItem={renderCommentaire}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          )}

          {/* BARRE DE SAISIE */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ajouter un commentaire..."
              placeholderTextColor="#666"
              value={nouveauCommentaire}
              onChangeText={setNouveauCommentaire}
            />
            <TouchableOpacity onPress={publierCommentaire} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '65%',
    backgroundColor: '#0A0A14',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#1F1F35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  contentText: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
  },
  likeBtn: {
    padding: 5,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#05050D',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#151525',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#FFF',
    fontSize: 14,
    marginRight: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7B2CBF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
    
