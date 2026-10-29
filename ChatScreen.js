// src/screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { createClient } from '@supabase/supabase_js';
import i18n from '../i18n';

// Configuration Supabase (remplace avec tes identifiants Supabase si nécessaire)
const SUPABASE_URL = 'https://ton-projet.supabase.co';
const SUPABASE_ANON_KEY = 'ta-cle-anon';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Récupération des messages existants
    fetchMessages();

    // Écoute des nouveaux messages en temps réel via Supabase
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prevMessages) => [payload.new, ...prevMessages]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      content: inputText,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('messages').insert([newMessage]);

    if (!error) {
      setInputText('');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{i18n.t('messaging')}</Text>
      </View>

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderMessageItem}
        inverted
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Zone de saisie du message */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez un message..."
            placeholderTextColor="#8e8e93"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
    backgroundColor: '#121214',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageBubble: {
    backgroundColor: '#1f1f24',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
      
