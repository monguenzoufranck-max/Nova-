// src/i18n.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Définition des traductions pour NOVA
const translations = {
  en: {
    welcome: "Welcome to NOVA",
    tagline: "The next-gen social network",
    messaging: "Messages & Calls",
    settings: "Settings",
    language: "Language",
  },
  fr: {
    welcome: "Bienvenue sur NOVA",
    tagline: "Le réseau social nouvelle génération",
    messaging: "Messages & Appels",
    settings: "Paramètres",
    language: "Langue",
  },
};

const i18n = new I18n(translations);

// Définir la langue par rapport à l'appareil ou utiliser l'anglais par défaut
i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;

export default i18n;
