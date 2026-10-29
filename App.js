// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
});
  
