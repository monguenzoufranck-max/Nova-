import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function AuthScreen({ navigation }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Création automatique du profil dans la table 'profiles'
        if (data.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              username: username || email.split('@')[0],
              updated_at: new Date(),
            },
          ]);
        }

        Alert.alert('Succès 🎉', 'Compte créé avec succès !');
      } else {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      Alert.alert('Erreur d\'authentification', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo & Titre */}
      <Text style={styles.logoText}>NOVA</Text>
      <Text style={styles.subtitle}>
        {isSignUp ? 'Crée ton compte pour rejoindre l\'aventure' : 'Ravi de te revoir !'}
      </Text>

      {/* Formulaire */}
      <View style={styles.form}>
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur (@pseudo)"
            placeholderTextColor="#8E8E93"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          placeholderTextColor="#8E8E93"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#8E8E93"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.authButtonText}>
              {isSignUp ? 'S\'inscrire' : 'Se connecter'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Basculer entre Connexion et Inscription */}
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchText}>
          {isSignUp
            ? 'Déjà un compte ? <Text style={styles.highlight}>Se connecter</Text>'
            : 'Pas encore de compte ? <Text style={styles.highlight}>S\'inscrire</Text>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justify: 'center',
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00F0FF',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E93',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 36,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#1C1C2E',
    color: '#FFF',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C3E',
  },
  authButton: {
    backgroundColor: '#00F0FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  highlight: {
    color: '#FF2D55',
    fontWeight: 'bold',
  },
});
          
