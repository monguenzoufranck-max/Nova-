import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { supabase } from '../supabase';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'NOVA Team', text: 'Bienvenue sur la messagerie NOVA ! 🚀', type: 'text', time: '12:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Envoi de message texte
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

  // Envoi de Media (Photo/Vidéo depuis la galerie)
  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Accès à la galerie requis.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const selectedAsset = result.assets[0];
      const newMsg = {
        id: Date.now().toString(),
        sender: 'Moi',
        type: selectedAsset.type === 'video' ? 'video' : 'image',
        uri: selectedAsset.uri,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
    }
  };

  // Gestion des enregistrements vocaux
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Erreur enregistrement:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    const newMsg = {
      id: Date.now().toString(),
      sender: 'Moi',
      type: 'audio',
      uri: uri,
      text: '🎵 Note vocale',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Discussion NOVA</Text>
          <Text style={styles.userStatus}>En ligne</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => Alert.alert('Appel Vocal', 'Lancement de l\'appel...')}>
            <Text style={styles.iconText}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => Alert.alert('Appel Vidéo', 'Lancement du visio...')}>
            <Text style={styles.iconText}>📹</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'Moi' ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.senderText}>{item.sender}</Text>
            {item.type === 'image' && <Image source={{ uri: item.uri }} style={styles.mediaImage} />}
            {item.type === 'text' && <Text style={styles.messageText}>{item.text}</Text>}
            {item.type === 'audio' && <Text style={styles.messageText}>{item.text}</Text>}
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        )}
      />

      {/* Barre de Saisie */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.actionIconBtn} onPress={pickMedia}>
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
            onPress={isRecording ? stopRecording : startRecording}
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
  mediaImage: { width: 200, height: 150, borderRadius: 12, marginVertical: 4 },
  timeText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 9, textAlign: 'right', marginTop: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1A1A2E', borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  actionIconBtn: { padding: 8 },
  textInput: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: '#FFF', marginHorizontal: 8 },
  sendBtn: { backgroundColor: '#00F0FF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  voiceBtn: { padding: 8 },
  recordingVoiceBtn: { backgroundColor: 'rgba(255, 42, 133, 0.4)', borderRadius: 20 }
});
