// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  Switch, 
  TextInput, 
  ScrollView,
  Alert 
} from 'react-native';
import i18n from '../i18n';

export default function SettingsScreen({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState(i18n.locale);
  
  // États pour les 4 fonctionnalités
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [username, setUsername] = useState('Amenia Ossibi');
  const [status, setStatus] = useState('En ligne sur NOVA');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState('1234');

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setCurrentLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const handleSaveProfile = () => {
    Alert.alert("Succès", "Profil mis à jour avec succès !");
  };

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.lightContainer]}>
      <View style={[styles.header, !isDarkMode && styles.lightHeader]}>
        <Text style={[styles.headerTitle, !isDarkMode && styles.lightText]}>
          {i18n.t('settings')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. SECTION LANGUE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('language')}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.langButton, currentLang === 'fr' && styles.activeButton]}
              onPress={() => changeLanguage('fr')}
            >
              <Text style={[styles.buttonText, currentLang === 'fr' && styles.activeText]}>Français</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langButton, currentLang === 'en' && styles.activeButton]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[styles.buttonText, currentLang === 'en' && styles.activeText]}>English</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. SECTION THÈME (MODE SOMBRE / CLAIR) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <View style={styles.rowItem}>
            <Text style={[styles.rowText, !isDarkMode && styles.lightSubText]}>Mode Sombre</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#6366f1' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 3. SECTION PROFIL UTILISATEUR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil Utilisateur</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom / Pseudo</Text>
            <TextInput
              style={[styles.input, !isDarkMode && styles.lightInput]}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#8e8e93"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Statut</Text>
            <TextInput
              style={[styles.input, !isDarkMode && styles.lightInput]}
              value={status}
              onChangeText={setStatus}
              placeholderTextColor="#8e8e93"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Enregistrer le profil</Text>
          </TouchableOpacity>
        </View>

        {/* 4. SECTION NOTIFICATIONS ET SONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications et Sons</Text>
          <View style={styles.rowItem}>
            <Text style={[styles.rowText, !isDarkMode && styles.lightSubText]}>Activer les notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#6366f1' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={[styles.rowText, !isDarkMode && styles.lightSubText]}>Effets sonores</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#767577', true: '#6366f1' }}
              thumbColor={soundEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 5. SECTION SÉCURITÉ ET CONFIDENTIALITÉ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={styles.rowItem}>
            <Text style={[styles.rowText, !isDarkMode && styles.lightSubText]}>Verrouillage par code PIN</Text>
            <Switch
              value={isPinEnabled}
              onValueChange={setIsPinEnabled}
              trackColor={{ false: '#767577', true: '#6366f1' }}
              thumbColor={isPinEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          {isPinEnabled && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Code PIN (ex: 1234)</Text>
              <TextInput
                style={[styles.input, !isDarkMode && styles.lightInput]}
                value={pinCode}
                onChangeText={setPinCode}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  lightContainer: {
    backgroundColor: '#f5f5f7',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
    backgroundColor: '#121214',
    alignItems: 'center',
  },
  lightHeader: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e5ea',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#121214',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1c1c1e',
  },
  sectionTitle: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  activeButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  activeText: {
    color: '#ffffff',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowText: {
    color: '#ffffff',
    fontSize: 15,
  },
  lightSubText: {
    color: '#333333',
  },
  inputGroup: {
    marginTop: 10,
  },
  inputLabel: {
    color: '#8e8e93',
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  lightInput: {
    backgroundColor: '#e5e5ea',
    color: '#000000',
    borderColor: '#d1d1d6',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
  
