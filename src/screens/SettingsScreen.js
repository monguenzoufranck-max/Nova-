// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaStorage, SafeAreaView } from 'react-native';
import i18n from '../i18n';

export default function SettingsScreen({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState(i18n.locale);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setCurrentLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{i18n.t('settings')}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{i18n.t('language')}</Text>
        
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
  content: {
    padding: 20,
  },
  label: {
    color: '#8e8e93',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    paddingVertical: 14,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#ffffff',
  },
});
                                                 
