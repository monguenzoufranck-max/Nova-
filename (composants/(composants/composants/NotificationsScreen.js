import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

const DEMO_NOTIFS = [
  { id: '1', title: 'Nouveau Like', desc: 'a aimé votre publication.', time: 'Il y a 5 min' },
  { id: '2', title: 'Nouveau Cadeau 💎', desc: 'vous a envoyé un Diamant !', time: 'Il y a 20 min' },
  { id: '3', title: 'Nouvel Abonné', desc: 'a commencé à vous suivre.', time: 'Il y a 1h' },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(DEMO_NOTIFS);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notifications 🔔</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notifCard}>
            <Text style={styles.notifTitle}>{item.title}</Text>
            <Text style={styles.notifDesc}>{item.desc}</Text>
            <Text style={styles.notifTime}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 50, paddingHorizontal: 16 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  notifCard: { backgroundColor: '#1A1A2E', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  notifTitle: { color: '#00F0FF', fontWeight: 'bold', fontSize: 14 },
  notifDesc: { color: '#FFF', fontSize: 13, marginTop: 2 },
  notifTime: { color: '#8E8E93', fontSize: 10, marginTop: 6 }
});
          
