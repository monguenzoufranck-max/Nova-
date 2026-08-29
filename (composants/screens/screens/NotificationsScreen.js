import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../supabaseClient';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, type, created_at, sender:profiles!sender_id(username)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      }
    } catch (err) {
      console.log('Erreur notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0A0A12', '#121225']} style={styles.container}>
      <Text style={styles.title}>Notifications 🔔</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notifCard}>
              <Text style={styles.notifIcon}>
                {item.type === 'like' ? '❤️' : item.type === 'follow' ? '👤' : '💬'}
              </Text>
              <Text style={styles.notifText}>
                <Text style={styles.username}>@{item.sender?.username || 'Quelqu\'un'}</Text>{' '}
                {item.type === 'like' ? 'a aimé votre publication' : 'a commencé à vous suivre'}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucune notification reçue.</Text>}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  title: { color: '#00F0FF', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C2E', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2C2C3E' },
  notifIcon: { fontSize: 22, marginRight: 12 },
  notifText: { color: '#FFF', fontSize: 14, flex: 1 },
  username: { fontWeight: 'bold', color: '#00F0FF' },
  empty: { color: '#8E8E93', textAlign: 'center', marginTop: 40 },
});
    
