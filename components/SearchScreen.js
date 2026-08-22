import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../supabase';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${text}%`);

    setResults(data || []);
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un profil ou un tag..."
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {/* Résultats de recherche */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userCard}>
            <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.bio} numberOfLines={1}>{item.bio || 'Membre NOVA'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length > 0 ? (
            <Text style={styles.emptyText}>Aucun utilisateur trouvé.</Text>
          ) : (
            <Text style={styles.emptyText}>Tape un nom pour lancer la recherche.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A', paddingTop: 50 },
  searchBarContainer: { paddingHorizontal: 16, marginBottom: 15 },
  searchInput: { backgroundColor: '#1A1A2E', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#FFF' },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  username: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  bio: { color: '#8E8E93', fontSize: 12 },
  emptyText: { color: '#8E8E93', textAlign: 'center', marginTop: 40 }
});
