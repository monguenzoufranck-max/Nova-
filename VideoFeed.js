import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import CommentsModal from './CommentsModal';

const { height, width } = Dimensions.get('window');

export default function VideoFeed({ videos = [] }) {
  const [liked, setLiked] = useState({});
  const [paused, setPaused] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlayPause = (id) => {
    setPaused((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openComments = (id) => {
    setSelectedVideoId(id);
    setShowComments(true);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 }).current;

  const renderItem = ({ item, index }) => {
    const isCurrentPlaying = index === activeVideoIndex;
    const isPausedManually = paused[item.id];

    return (
      <TouchableWithoutFeedback onPress={() => togglePlayPause(item.id)}>
        <View style={styles.videoCard}>
          {/* Lecteur Vidéo expo-av */}
          {item.url ? (
            <Video
              source={{ uri: item.url }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isCurrentPlaying && !isPausedManually}
              isLooping
              useNativeControls={false}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoText}>Vidéo Nova: {item.title || 'Démo'}</Text>
            </View>
          )}

          {/* Indicateur Pause au milieu si mis en pause */}
          {isPausedManually && (
            <View style={styles.pauseOverlay}>
              <Ionicons name="play" size={60} color="rgba(255,255,255,0.7)" />
            </View>
          )}

          {/* Barre d'actions à droite */}
          <View style={styles.sideBar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id)}>
              <Ionicons 
                name={liked[item.id] ? "heart" : "heart-outline"} 
                size={35} 
                color={liked[item.id] ? "#FF2D55" : "#FFF"} 
              />
              <Text style={styles.iconText}>{item.likes || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => openComments(item.id)}>
              <Ionicons name="chatbubble-ellipses-outline" size={32} color="#FFF" />
              <Text style={styles.iconText}>{item.comments_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-social-outline" size={32} color="#FFF" />
              <Text style={styles.iconText}>Partager</Text>
            </TouchableOpacity>
          </View>

          {/* Infos en bas */}
          <View style={styles.bottomBar}>
            <Text style={styles.username}>@{item.profiles?.username || 'utilisateur'}</Text>
            <Text style={styles.description}>{item.description || 'Bienvenue sur Nova !'}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={videos.length > 0 ? videos : [{ id: '1', title: 'Démo Nova' }]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef}
      />

      <CommentsModal 
        visible={showComments} 
        onClose={() => setShowComments(false)} 
        videoId={selectedVideoId} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    width: width,
    height: height,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    padding: 10,
  },
  sideBar: {
    position: 'absolute',
    right: 15,
    bottom: 120,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 80,
    left: 15,
    right: 80,
  },
  username: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#FFF',
    fontSize: 14,
  },
});
    
