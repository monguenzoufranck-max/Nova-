import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  FlatList, 
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

export default function LiveStream({ isHost = false, onClose }) {
  const [comments, setComments] = useState([
    { id: '1', user: 'marc_live', text: 'Salut le live ! 👋' },
    { id: '2', user: 'clara99', text: 'Bonne qualité de stream 🔥' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [viewerCount, setViewerCount] = useState(142);

  const sendComment = () => {
    if (newComment.trim() === '') return;
    setComments([...comments, { id: Date.now().toString(), user: 'Moi', text: newComment }]);
    setNewComment('');
  };

  return (
    <View style={styles.container}>
      {/* Zone Vidéo du Live */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.liveTag}>🔴 EN DIRECT</Text>
      </View>

      {/* Barre supérieure : Infos hôte & Spectateurs */}
      <View style={styles.topBar}>
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>{isHost ? 'Mon Live Nova' : '@createur_live'}</Text>
          <View style={styles.viewerBadge}>
            <Ionicons name="eye" size={14} color="#FFF" />
            <Text style={styles.viewerText}>{viewerCount}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Flux des commentaires en temps réel */}
      <View style={styles.chatSection}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.chatBubble}>
              <Text style={styles.chatUser}>@{item.user}: </Text>
              <Text style={styles.chatText}>{item.text}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Barre d'interaction bas */}
      <View style={styles.bottomBar}>
        <TextInput
          style={styles.chatInput}
          placeholder="Envoyer un message..."
          placeholderTextColor="#AAA"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendComment}>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart" size={28} color="#FF2D55" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveTag: {
    backgroundColor: '#FF2D55',
    color: '#FFF',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hostName: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  viewerText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 4,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
  chatSection: {
    position: 'absolute',
    bottom: 90,
    left: 15,
    width: width * 0.75,
    maxHeight: 200,
  },
  chatBubble: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  chatUser: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 13,
  },
  chatText: {
    color: '#FFF',
    fontSize: 13,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 25,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendBtn: {
    backgroundColor: '#FF2D55',
    padding: 10,
    borderRadius: 25,
    marginRight: 8,
  },
  heartBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 25,
  },
});
  
