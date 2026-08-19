import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';

export default function AuthScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert('Inscription', error.message);
      else Alert.alert('Succès', 'Vérifie ton e-mail pour valider ton compte !');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Connexion', error.message);
      else if (onLoginSuccess) onLoginSuccess();
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOVA 🚀</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Créer un compte' : 'Bienvenue à nouveau'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse E-mail"
        placeholderTextColor="#8E8E93"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#8E8E93"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Chargement...' : isSignUp ? "S'inscrire" : 'Se connecter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchBtn}>
        <Text style={styles.switchText}>
          {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', justifyContent: 'center', padding: 24 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#00F0FF', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#FFF', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 16, color: '#FFF', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  button: { backgroundColor: '#FF2A85', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#00F0FF', fontSize: 13 },
});
    
