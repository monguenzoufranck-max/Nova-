import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image } from 'react-native';

export default function MonetisationModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.glassContainer}>
          
          {/* Badge "PLUS POPULAIRE" avec dégradé rose/violet */}
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>MÁS POPULAR • VIP</Text>
          </View>

          {/* Titre principal */}
          <Text style={styles.title}>Supernova Pass</Text>
          <Text style={styles.subtitle}>
            Accède à du contenu exclusif, des effets VIP et gagne 2x plus de gemmes.
          </Text>

          {/* Carte de prix translucide */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceText}>10€ <Text style={styles.oldPrice}>15€</Text></Text>
              <Text style={styles.periodText}>par mois</Text>
            </View>

            {/* Bouton d'essai gratuit */}
            <TouchableOpacity style={styles.tryButton}>
              <Text style={styles.tryButtonText}>Tester 7 jours →</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton d'action principal */}
          <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>Débloquer le Pass</Text>
          </TouchableOpacity>

          {/* Bouton pour fermer */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  glassContainer: {
    width: '100%',
    backgroundColor: 'rgba(25, 25, 45, 0.85)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  popularBadge: {
    backgroundColor: '#FF2A85',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  popularBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#A0A0C0',
    lineHeight: 18,
    marginBottom: 20,
  },
  priceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  oldPrice: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  periodText: {
    fontSize: 11,
    color: '#888',
  },
  tryButton: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00F0FF',
  },
  tryButtonText: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#888',
    fontSize: 13,
  },
});
            
