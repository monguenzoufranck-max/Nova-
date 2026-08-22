import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { supabase } from '../supabase';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Écoute en temps réel des nouveaux messages (Realtime)
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Récupérer les messages existants
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Erreur chargement messages:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Envoi de message texte
  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');

    const { error } = await supabase.from('messages').insert([
      { sender: 'Moi', type: 'text', text: textToSend }
    ]);

    if (error) Alert.alert('Erreur', error.message);
  };

  // Téléverser un fichier sur Supabase Storage
  const uploadToSupabase = async (uri, folderName) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${folderName}/${Date.now()}`;

      const { error } = await supabase.storage.from('chat-media').upload(fileName, blob);
      if (error) throw error;

      const { data } = supabase.storage.from('chat-media').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('Erreur upload:', err.message);
      return null;
    }
  };

  // Envoi de Photo / Vidéo
  const pickMedia = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission requise', 'Accès à la galerie refusé.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const publicUrl = await uploadToSupabase(asset.uri, asset.type === 'video' ? 'videos' : 'images');

      if (publicUrl) {
        await supabase.from('messages').insert([
          { sender: 'Moi', type: asset.type === 'video' ? 'video' : 'image', uri: publicUrl }
        ]);
      }
    }
  };

  // Enregistrement Audio
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Erreur micro:', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    const publicUrl = await uploadToSupabase(uri, 'audio');
    if (publicUrl) {
      await supabase.from('messages').insert([
        { sender: 'Moi', type: 'audio', text: '🎵 Note vocale', uri: publicUrl }
      ]);
    }
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

      {/* Chargement ou Liste de messages */}
      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" style={{ flex: 1 }} />
      ) : (
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
            </View>
          )}
        />
      )}

      {/* Barre de saisie */}
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
  theirMessage: { alignSelf: 'start', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  senderText: { color: '#00F0FF', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  messageText: { color: '#FFF', fontSize: 14 },
  mediaImage: { width: 200, height: 150, borderRadius: 12, marginVertical: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1A1A2E', borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  actionIconBtn: { padding: 8 },
  textInput: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, color: '#FFF', marginHorizontal: 8 },
  sendBtn: { backgroundColor: '#00F0FF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  voiceBtn: { padding: 8 },
  recordingVoiceBtn: { backgroundColor: 'rgba(255, 42, 133, 0.4)', borderRadius: 20 }
});import GiftsModal from './GiftsModal';

// Dans ton JSX :
<GiftsModal 
  visible={showGifts} 
  onClose={() => setShowGifts(false)} 
  receiverId="ID_DE_L_UTILISATEUR" 
/>
              
                              
