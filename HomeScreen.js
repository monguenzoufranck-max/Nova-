import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Video } from 'expo-av';

const { height, width } = Dimensions.get('window');

// Composant pour le bouton Like interactif
function LikeButton({ initialLikes }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    // Animation de rebond
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Inversion de l'état du Like et mise à jour du compteur
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
      <Animated.Text
        style={[
          styles.iconText,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        {liked ? '❤️' : '🤍'}
      </Animated.Text>
      <Text style={[styles.iconLabel, liked && styles.likedText]}>
        {likesCount}
      </Text>
    </TouchableOpacity>
  );
}

// Exemple d'intégration dans renderItem
/*
<View style={styles.rightOverlay}>
  <LikeButton initialLikes={12400} />
  ...
</View>
*/

const styles = StyleSheet.create({
  iconButton: { alignItems: 'center', marginBottom: 20 },
  iconText: { fontSize: 28 },
  iconLabel: { color: '#FFF', fontSize: 12, marginTop: 4 },
  likedText: { color: '#FF2D55', fontWeight: 'bold' },
});
      
