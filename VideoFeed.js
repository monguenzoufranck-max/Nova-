import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../supabase';
import LikeButton from './LikeButton';
import CommentairesModal from './CommentairesModal';

const { height, width } = Dimensions.get('window');

export default function VideoFeed() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

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

  const openComments = (postId) => {
    setActivePostId(postId);
    setCommentModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.videoCard}>
            <Video
              source={{ uri: item.video_url }}
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping
            />
            {/* Action Bar sur le côté droit */}
            <View style={styles.rightBar}>
              <LikeButton postId={item.id} />
              
              <TouchableOpacity style={styles.iconBtn} onPress={() => openComments(item.id)}>
                <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FFF" />
                <Text style={styles.iconText}>Avis</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal des commentaires */}
      {activePostId && (
        <CommentairesModal
          visible={commentModalVisible}
          postId={activePostId}
          onClose={() => setCommentModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  center: { flex: 1, backgroundColor: '#0A0A14', justifyContent: 'center', alignItems: 'center' },
  videoCard: { width: width, height: height, justifyContent: 'center' },
  video: { width: '100%', height: '100%', position: 'absolute' },
  rightBar: { position: 'absolute', right: 15, bottom: 100, alignItems: 'center' },
  iconBtn: { alignItems: 'center', marginTop: 20 },
  iconText: { color: '#FFF', fontSize: 12, marginTop: 4, fontWeight: 'bold' },
});
      
