import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import Navigation from './Navigation';
import { fetchNovaFeed } from './supabase';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const feedData = await fetchNovaFeed();
    setVideos(feedData);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF2D55" />
        </View>
      ) : (
        <Navigation videos={videos} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
        
