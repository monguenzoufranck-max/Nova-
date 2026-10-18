import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabaseClient';

const { height } = Dimensions.get('window');

export default function VideoDuelScreen({ duelId }) {
  const [duelData, setDuelData] = useState(null);
  const [votesChallenger, setVotesChallenger] = useState(0);
  const [votesOpponent, setVotesOpponent] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // 1. Charger les infos du duel
    fetchDuelDetails();

    // 2. Écouter les votes en temps réel via Supabase Realtime
    const subscription = supabase
      .channel(`duel:${duelId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'duels', filter: `id=eq.${duelId}` }, (payload) => {
        setVotesChallenger(payload.new.votes_challenger);
        setVotesOpponent(payload.new.votes_opponent);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [duelId]);

  const fetchDuelDetails = async () => {
    const { data, error } = await supabase
      .from('duels')
      .select('*, challenger:videos!challenger_video_id(*), opponent:videos!opponent_video_id(*)')
      .eq('id', duelId)
      .single();

    if (data) {
      setDuelData(data);
      setVotesChallenger(data.votes_challenger || 0);
      setVotesOpponent(data.votes_opponent || 0);
    }
  };

  const handleVote = async (target) => {
    if (hasVoted) return;

    const columnToIncrement = target === 'challenger' ? 'votes_challenger' : 'votes_opponent';
    const currentVotes = target === 'challenger' ? votesChallenger : votesOpponent;

    setHasVoted(true);
    if (target === 'challenger') setVotesChallenger(prev => prev + 1);
    else setVotesOpponent(prev => prev + 1);

    await supabase
      .from('duels')
      .update({ [columnToIncrement]: currentVotes + 1 })
      .eq('id', duelId);
  };

  if (!duelData) return <View style={styles.container} />;

  const totalVotes = votesChallenger + votesOpponent || 1;
  const challengerPercent = Math.round((votesChallenger / totalVotes) * 100);
  const opponentPercent = Math.round((votesOpponent / totalVotes) * 100);

  return (
    <View style={styles.container}>
      {/* Haut : Challenger */}
      <View style={styles.videoHalf}>
        <Video
          source={{ uri: duelData.challenger?.url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
        <TouchableOpacity 
          style={[styles.voteBtn, styles.voteBtnTop]} 
          onPress={() => handleVote('challenger')}
        >
          <Ionicons name="flame" size={24} color="#FF3B30" />
          <Text style={styles.voteText}>{challengerPercent}%</Text>
        </TouchableOpacity>
      </View>

      {/* Barre de séparation "VS" */}
      <View style={styles.vsBadge}>
        <Text style={styles.vsText}>VS</Text>
      </View>

      {/* Bas : Opposant */}
      <View style={styles.videoHalf}>
        <Video
          source={{ uri: duelData.opponent?.url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
        <TouchableOpacity 
          style={[styles.voteBtn, styles.voteBtnBottom]} 
          onPress={() => handleVote('opponent')}
        >
          <Ionicons name="flame" size={24} color="#00E5FF" />
          <Text style={styles.voteText}>{opponentPercent}%</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoHalf: {
    height: height / 2,
    width: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  vsBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  vsText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 18,
  },
  voteBtn: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  voteBtnTop: {
    bottom: 20,
  },
  voteBtnBottom: {
    top: 20,
  },
  voteText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
  
