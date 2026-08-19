import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

const GIFTS = [
  { id: '1', name: 'Cœur Néon', price: 10, icon: '💖' },
  { id: '2', name: 'Éclair VIP', price: 50, icon: '⚡' },
  { id: '3', name: 'Couronne', price: 200, icon: '👑' },
  { id: '4', name: 'Super Nova', price: 500, icon: '🌟' },
  { id: '5', name: 'Lion Majestueux', price: 1000, icon: '🦁' },
];

export default function GiftingModal({ visible, onClose, onSendGift }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>🎁 Envoyer un Cadeau</Text>
          
          <FlatList
            data={GIFTS}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.giftCard}
                onPress={() => {
                  if (onSendGift) onSendGift(item);
                  onClose();
                }}
              >
                <Text style={styles.giftIcon}>{item.icon}</Text>
                <Text style={styles.giftName}>{item.name}</Text>
                <Text style={styles.giftPrice}>{item.price} 💎</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  container: { height: '50%', backgroundColor: '#0F0F1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  title: { color: '#FF2A85', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  giftCard: { flex: 1, margin: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  giftIcon: { fontSize: 32 },
  giftName: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  giftPrice: { color: '#00F0FF', fontSize: 10, marginTop: 2 },
  closeBtn: { marginTop: 10, paddingVertical: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#FFF', fontWeight: 'bold' },
});
    
