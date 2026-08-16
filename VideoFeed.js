import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Video } from 'expo-av';
import { supabase } from '../supabase';

const { height } = Dimensions.get('window');

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, video_url')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: item.video_url }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay
            isLooping
            isMuted={false}
          />
        </View>
      )}
      pagingEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0A0A14', justifyContent: 'center' },
  videoContainer: { height: height },
  video: { width: '100%', height: '100%' },
});
      
