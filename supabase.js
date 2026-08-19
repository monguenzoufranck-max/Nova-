import { createClient } from '@supabase/supabase-js';

// Configuration de la connexion à Supabase
const SUPABASE_URL = 'https://TON_PROJET_SUPABASE.supabase.co';
const SUPABASE_ANON_KEY = 'TA_CLE_ANONYME_SUPABASE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour récupérer les vidéos du fil d'actualité
export const fetchNovaFeed = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles(username, avatar_url, is_verified)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur chargement feed Nova:", error);
    return [];
  }
  return data;
};import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par les clés fournies dans ton tableau de bord Supabase
const SUPABASE_URL = 'https://TON_PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'TA_CLE_ANON_PUBLIC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

