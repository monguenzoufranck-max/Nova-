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
  Image,
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import i18n from '../i18n';

export default function SettingsScreen({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState(i18n.locale);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [username, setUsername] = useState('Amenia Ossibi');
  const [status, setStatus] = useState('En ligne sur NOVA');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPinEnabled, setIsPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState('1234');

  // Nouveaux états pour la photo et la vidéo de profil
  const [avatarUri, setAvatarUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setCurrentLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  // Fonction pour choisir une photo de profil
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  // Fonction pour choisir/enregistrer une vidéo (boucle de 5s)
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 5, // Limite à 5 secondes
      quality: 0.8,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      Alert.alert("Succès", "Vidéo avatar de 5s enregistrée !");
    }
  };

  const handleSaveProfile = () => {
    Alert.alert("Succès", "Profil et médias mis à jour avec succès !");
  };

  return (
    <SafeAreaView style={[styles.container, !isDarkMode && styles.lightContainer]}>
      <View style={[styles.header, !isDarkMode && styles.lightHeader]}>
        <Text style={[styles.headerTitle, !isDarkMode && styles.lightText]}>
          {i18n.t('settings')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION PROFIL & MÉDIAS (PHOTO & VIDÉO 5S) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil & Médias Nova</Text>
          
          <View style={styles.mediaContainer}>
            {/* Aperçu Photo */}
            <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarPlaceholderText}>📸 Photo</Text>
              )}
            </TouchableOpacity>

            {/* Aperçu Vidéo 5s */}
            <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
              <Text style={styles.videoPlaceholderText}>
                {videoUri ? "🎬 Vidéo 5s active" : "🎥 Vidéo (5s)"}
              </Text>
            </TouchableOpacity>
          </View>

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

        {/* SECTION LANGUE */}
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

        {/* SECTION THÈME */}
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

        {/* SECTION NOTIFICATIONS ET SONS */}
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

        {/* SECTION SÉCURITÉ */}
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
  mediaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  avatarPicker: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholderText: {
    color: '#8e8e93',
    fontSize: 12,
    textAlign: 'center',
  },
  videoPicker: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
    paddingHorizontal: 10,
  },
  videoPlaceholderText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
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
      
