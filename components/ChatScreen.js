import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'NOVA Team', text: 'Bienvenue sur la messagerie NOVA ! 🚀', type: 'text', time: '12:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Simulation d'envoi de message texte
  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Moi',
      text: inputText,
      type: 'text',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  // Action Envoi Média (Photos/Vidéos)
  const handlePickMedia = (mediaType) => {
    Alert.alert(`Envoi de ${mediaType}`, `Sélectionne une ${mediaType} depuis ta galerie.`);
  };

  // Action Enregistrement Vocal
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      Alert.alert('Vocal envoyé !', 'La note vocale a été transmise.');
    } else {
      setIsRecording(true);
    }
  };

  // Action Appel Vidéo / Vocal
  const startCall = (type) => {
    Alert.alert(`Appel ${type}`, `Lancement de l'appel ${type} en direct...`);
  };

  return (
    <View style={styles.container}>
      {/* En-tête du Chat avec boutons d'appel */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Discussion NOVA</Text>
          <Text style={styles.userStatus}>En ligne</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => startCall('Vocal')}>
            <Text style={styles.iconText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => startCall('Vidéo')}>
            <Text style={styles.iconText}>📹</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'Moi' ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.senderText}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        )}
      />

      {/* Barre de saisie style WhatsApp */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.actionIconBtn} onPress={() => handlePickMedia('Photo / Vidéo')}>
          <Text style={styles.iconText}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Message..."
          placeholderTextColor="#8E8E93"
          value={inputText}
          onChangeText={setInputText}
        />

        {inputText.length > 0 ? (
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendBtnText}>➔</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.voiceBtn, isRecording && styles.recordingVoiceBtn]} 
            onPress={toggleVoiceRecording}
          >
            <Text style={styles.iconText}>{isRecording ? '⏹️' : '🎙️'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#1A1A2E', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  userInfo: { flexDirection: 'column' },
  userName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  userStatus: { color: '#00F0FF', fontSize: 12 },
  headerActions: { flexDirection: 'row' },
  headerIconBtn: { marginLeft: 15, padding: 6 },
  iconText: { fontSize: 20 },
  messageList: { padding: 16 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 10, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#FF2A85' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  senderText: { color: '#00F0FF', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  messageText: { color: '#FFF', fontSize: 14 },
  timeText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 9, textAlign: 'right', marginTop: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1A1A2E', borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  actionIconBtn: { padding: 8 },
  textInput: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: '#FFF', marginHorizontal: 8 },
  sendBtn: { backgroundColor: '#00F0FF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  voiceBtn: { padding: 8 },
  recordingVoiceBtn: { backgroundColor: 'rgba(255, 42, 133, 0.4)', borderRadius: 20 }
});
      
