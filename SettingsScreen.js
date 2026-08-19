import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres & Réglages</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SECTION PORTEFEUILLE / MONÉTISATION */}
        <Text style={styles.sectionTitle}>MONÉTISATION & GEMMES</Text>
        <View style={styles.card}>
          <View style={styles.walletRow}>
            <View>
              <Text style={styles.walletLabel}>Solde de Gemmes</Text>
              <Text style={styles.walletBalance}>1,250 💎</Text>
            </View>
            <TouchableOpacity style={styles.rechargeBtn}>
              <Text style={styles.rechargeBtnText}>Recharger</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION COMPTE */}
        <Text style={styles.sectionTitle}>COMPTE</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.itemRow}>
            <Text style={styles.itemText}>Modifier le profil</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.itemRow}>
            <Text style={styles.itemText}>Sécurité & Mot de passe</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION CONFIDENTIALITÉ */}
        <Text style={styles.sectionTitle}>CONFIDENTIALITÉ & NOTIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.itemRowSwitch}>
            <Text style={styles.itemText}>Compte Privé</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#333', true: '#00F0FF' }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.itemRowSwitch}>
            <Text style={styles.itemText}>Notifications Push</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333', true: '#FF2A85' }}
            />
          </View>
        </View>

        {/* BOUTON DÉCONNEXION */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    color: '#A0A0C0',
    fontSize: 12,
  },
  walletBalance: {
    color: '#00F0FF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  rechargeBtn: {
    backgroundColor: '#FF2A85',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  rechargeBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemRowSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemText: {
    color: '#FFF',
    fontSize: 15,
  },
  arrow: {
    color: '#666',
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  logoutBtn: {
    marginTop: 35,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
    
