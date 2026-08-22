import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import { supabase } from '../supabase';

const GIFTS_LIST = [
  { id: '1', name: 'Rose 🌹', cost: 5 },
  { id: '2', name: 'Cœur ❤️', cost: 10 },
  { id: '3', name: 'Diamant 💎', cost: 50 },
  { id: '4', name: 'Couronne VIP 👑', cost: 200 },
];

export default function GiftsModal({ visible, onClose, receiverId }) {
  const [loading, setLoading] = useState(false);

  const sendGift = async (gift) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Erreur', 'Connecte-toi pour envoyer un cadeau.');
        return;
      }

      // 1. Récupérer le solde de l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();

      const currentCoins = profile?.coins || 0;

      if (currentCoins < gift.cost) {
        Alert.alert('Solde insuffisant', 'Recharge tes pièces pour envoyer ce cadeau.');
        return;
      }

      // 2. Déduire les pièces
      await supabase
        .from('profiles')
        .update({ coins: currentCoins - gift.cost })
        .eq('id', user.id);

      // 3. Enregistrer la transaction
      await supabase.from('gift_transactions').insert([
        { sender_id: user.id, receiver_id: receiverId, gift_name: gift.name, cost: gift.cost }
      ]);

      Alert.alert('Succès !', `Tu as envoyé ${gift.name} ! 🎉`);
      onClose();
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Envoyer un cadeau 🎁</Text>

          <FlatList
            data={GIFTS_LIST}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.giftCard} 
                onPress={() => sendGift(item)}
                disabled={loading}
              >
                <Text style={styles.giftName}>{item.name}</Text>
                <Text style={styles.giftCost}>🪙 {item.cost} pièces</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1A1A2E', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '50%' },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  giftCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', margin: 6, padding: 15, borderRadius: 12, alignItems: 'center' },
  giftName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  giftCost: { color: '#FFD700', fontSize: 12, marginTop: 4 },
  closeBtn: { marginTop: 15, padding: 12, backgroundColor: '#FF2A85', borderRadius: 12, alignItems: 'center' },
  closeText: { color: '#FFF', fontWeight: 'bold' }
});
          
