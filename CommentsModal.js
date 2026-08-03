import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  PanResponder, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommentsModal({ visible, onClose, videoId }) {
  const [comments, setComments] = useState([
    { id: '1', user: 'alex_dev', text: 'Top la vidéo 🔥' },
    { id: '2', user: 'sarah_m', text: 'Le projet Nova avance super bien !' }
  ]);
  const [newComment, setNewComment] = useState('');

  // Gestion du glissement vers le bas pour fermer
  const panY = new Animated.Value(0);
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dy > 0) {
        panY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 150) {
        onClose();
        panY.setValue(0);
      } else {
        resetPositionAnim.start();
      }
    },
  });

  const addComment = () => {
    if (newComment.trim() === '') return;
    setComments([...comments, { id: Date.now().toString(), user: 'Moi', text: newComment }]);
    setNewComment('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Animated.View 
          style={[styles.modalContent, { transform: [{ translateY: panY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Barre de glissement */}
          <View style={styles.dragBar} />

          <Text style={styles.title}>{comments.length} commentaires</Text>

          {/* Liste des commentaires */}
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentUser}>@{item.user}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            style={styles.commentsList}
          />

          {/* Saisie d'un nouveau commentaire */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ajouter un commentaire..."
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton} onPress={addComment}>
              <Ionicons name="arrow-up-circle" size={32} color="#FF2D55" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '60%',
    padding: 15,
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: '#555',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    marginBottom: 15,
  },
  commentUser: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#262626',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
});
