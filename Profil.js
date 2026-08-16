import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  FlatList, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

// Données fictives pour la grille de vidéos
const USER_VIDEOS = [
  { id: '1', views: '12.4K' },
  { id: '2', views: '85.1K' },
  { id: '3', views: '3.2K' },
  { id: '4', views: '450K' },
  { id: '5', views: '1.2M' },
  { id: '6', views: '9.8K' },
];

export default function Profil({ navigation }) {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'likes' | 'lock'

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoThumbnail}>
      <View style={styles.videoOverlay}>
        <Ionicons name="play" size={14} color="#FFF" />
        <Text style={styles.viewsText}>{item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIconBtn}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerUsername}>@amenia.ossibi</Text>
        
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SECTION AVATAR & NOM */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.addAvatarBtn}>
              <Ionicons name="add" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.displayName}>Amenia Ossibi</Text>
          <Text style={styles.bioText}>Créateur de contenu sur Nova 🌌 | Design & Tech</Text>
        </View>

        {/* COMPTEURS / STATISTIQUES */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Abonnements</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>28.5K</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>340.2K</Text>
            <Text style={styles.statLabel}>J'aime</Text>
          </View>
        </View>

        {/* BOUTONS D'ACTION */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Modifier le profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons name="share-social-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* ONGLETS DE SÉLECTION */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'grid' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons 
              name="grid-outline" 
              size={22} 
              color={activeTab === 'grid' ? '#00F0FF' : '#888'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'likes' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('likes')}
          >
            <Ionicons 
              name="heart-outline" 
              size={24} 
              color={activeTab === 'likes' ? '#00F0FF' : '#888'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'lock' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('lock')}
          >
            <Ionicons 
              name="lock-closed-outline" 
              size={22} 
              color={activeTab === 'lock' ? '#00F0FF' : '#888'} 
            />
          </TouchableOpacity>
        </View>

        {/* GRILLE DE VIDÉOS */}
        <FlatList 
          data={USER_VIDEOS}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050D',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerIconBtn: {
    padding: 5,
  },
  headerUsername: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  avatarBorder: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1A1A2E',
  },
  addAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00F0FF',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#05050D',
  },
  displayName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bioText: {
    color: '#AAA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statNumber: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#7B2CBF',
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBtn: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00F0FF',
  },
  gridContainer: {
    paddingTop: 1,
  },
  videoThumbnail: {
    width: ITEM_SIZE - 2,
    height: ITEM_SIZE * 1.3,
    backgroundColor: '#151525',
    margin: 1,
    justifyContent: 'flex-end',
    padding: 6,
  },
  videoOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
    
