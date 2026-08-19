import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';

const MESSAGES = [
  { id: '1', sender: 'Alex', text: 'Salut ! J'ai adoré ta dernière vidéo 🚀', time: '12:40' },
  { id: '2', sender: 'Moi', text: 'Merci beaucoup ! Ça fait plaisir 🔥', time: '12:42' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(MESSAGES);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'Moi', text: input, time: 'Maintenant' }]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Messagerie NOVA</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'Moi' ? styles.myBubble : styles.theirBubble]}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Envoyer un message..."
          placeholderTextColor="#8E8E93"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  header: { paddingTop: 50, paddingBottom: 15, alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  messageList: { padding: 15 },
  bubble: { padding: 12, borderRadius: 16, marginBottom: 10, maxWidth: '80%' },
  myBubble: { backgroundColor: '#6C5CE7', alignSelf: 'flex-end' },
  theirBubble: { backgroundColor: 'rgba(255, 255, 255, 0.1)', alignSelf: 'flex-start' },
  sender: { color: '#00F0FF', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  messageText: { color: '#FFF', fontSize: 14 },
  time: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 9, marginTop: 4, textAlign: 'right' },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: '#000' },
  input: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, paddingHorizontal: 15, color: '#FFF' },
  sendButton: { marginLeft: 10, backgroundColor: '#FF2A85', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendText: { color: '#FFF', fontWeight: 'bold' },
});
