import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, Dimensions, TouchableOpacity, 
  FlatList, TextInput, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Exemples de cadeaux virtuels 3D / Néon
const GIFTS = [
  { id: '1', name: 'Flamme 🔥', icon: 'flame', color: '#FF5E00' },
  { id: '2', name: 'Cœur 💖', icon: 'heart', color: '#FF2D55' },
  { id: '3', name: 'Étoile ⭐', icon: 'star', color: '#FFD700' },
  { id: '4', name: 'Fusee 🚀', icon: 'rocket', color: '#00E5FF' },
];

export default function LiveScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '1', user: 'Alex', text: 'Bienvenue sur le Live NOVA ! 🔥' },
    { id: '2', user: 'Sarah', text: 'Trop classe le design 3D !' },
  ]);
  const [inputText, setInputText] = useState('');
  const [floatingGifts, setFloatingGifts] = useState([]);

  // Ajouter un message au chat en direct
  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: 'Moi', text: inputText }
    ]);
    setInputText('');
  };

  // Envoyer un cadeau virtuel 3D (animation flottante)
  const sendGift = (gift) => {
    const newGift = {
      id: Date.now().toString(),
      icon: gift.icon,
      color: gift.color,
    };
    setFloatingGifts((prev) => [...prev, newGift]);

    // Masquer l'animation après 2.5 secondes
    setTimeout(() => {
      setFloatingGifts((prev) => prev.filter((g) => g.id !== newGift.id));
    }, 2500);
  };

  return (
    <View style={styles.container}>
      {/* Simulation du flux vidéo Live (Fond sombre stylisé) */}
      <View style={styles.liveVideoBackground}>
        {/* Badge "EN DIRECT" */}
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
          <Text style={styles.spectatorsCount}>👁️ 1.2K</Text>
        </View>

        {/* Bouton pour fermer le Live */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Animations des cadeaux virtuels envoyés */}
      <View style={styles.giftsContainer} pointerEvents="none">
        {floatingGifts.map((gift) => (
          <View key={gift.id} style={styles.floatingGiftItem}>
            <Ionicons name={gift.icon} size={42} color={gift.color} />
          </View>
        ))}
      </View>

      {/* Ombrage bas pour la lisibilité */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.bottomGradient}
      />

      {/* Zone du Chat en Direct */}
      <View style={styles.chatSection}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageBubble}>
              <Text style={styles.messageUser}>@{item.user}: </Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Barre de sélection des cadeaux 3D */}
        <View style={styles.giftsBar}>
          {GIFTS.map((gift) => (
            <TouchableOpacity 
              key={gift.id} 
              style={styles.giftButton} 
              onPress={() => sendGift(gift)}
              activeOpacity={0.7}
            >
              <Ionicons name={gift.icon} size={22} color={gift.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Zone de saisie du message */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Envoyer un message..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#FF2D55" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  liveVideoBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A12',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.25)',
    borderWidth: 1,
    borderColor: '#FF2D55',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  liveBadgeText: {
    color: '#FF2D55',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 8,
  },
  spectatorsCount: {
    color: '#FFF',
    fontSize: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 350,
  },
  chatSection: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  messagesList: {
    maxHeight: 180,
    marginBottom: 10,
  },
  messageBubble: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  messageUser: {
    color: '#FF2D55',
    fontWeight: 'bold',
    fontSize: 13,
  },
  messageText: {
    color: '#FFF',
    fontSize: 13,
  },
  giftsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#121212',
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  giftButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 45,
  },
  sendBtn: {
    padding: 8,
  },
  giftsContainer: {
    position: 'absolute',
    right: 30,
    bottom: 200,
    alignItems: 'center',
  },
  floatingGiftItem: {
    marginBottom: 15,
  },
});
                       
