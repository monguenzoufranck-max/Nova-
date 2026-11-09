import React, { useState, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Switch
} from 'react-native';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur capturée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oups ! Une erreur est survenue.</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.toString()}
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.primaryBtnText}>Réessayer</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const UserIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.userHead} />
    <View style={styles.userBody} />
  </View>
);

const FacebookIcon = () => (
  <View style={[styles.iconContainer, { backgroundColor: '#1877F2', borderRadius: 12 }]}>
    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>f</Text>
  </View>
);

const AppleIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}></Text>
  </View>
);

const GoogleIcon = () => (
  <View style={[styles.iconContainer, { borderWidth: 1, borderColor: '#EA4335', borderRadius: 12 }]}>
    <Text style={{ color: '#EA4335', fontWeight: 'bold', fontSize: 14 }}>G</Text>
  </View>
);

const TwitterIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={{ color: '#1DA1F2', fontSize: 16 }}>🐦</Text>
  </View>
);

const InstagramIcon = () => (
  <View style={[styles.iconContainer, { backgroundColor: '#E4405F', borderRadius: 6 }]}>
    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>📷</Text>
  </View>
);

function MainApp() {
  const [screen, setScreen] = useState('full_settings');
  const [activeModal, setActiveModal] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: '🌎FRANCK 💥 BOKOYA🌎',
    username: 'franck.bokoya2',
    bio: '',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80',
    isPrivate: false,
    viewsActive: true,
  });

  const handleSocialLogin = (provider) => {
    Alert.alert('Connexion réussie', `Bienvenue via ${provider} !`);
    setScreen('side_menu');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('login');
  };

  if (screen === 'side_menu') {
    return (
      <SafeAreaView style={styles.menuOverlayLayout}>
        <StatusBar barStyle="light-content" />
        <View style={styles.menuSheet}>
          <Text style={styles.sheetSectionTitle}>Ressources</Text>
          <TouchableOpacity style={styles.balanceCard}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>👛</Text>
              <Text style={styles.balanceText}>Solde</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.redDot} />
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.sheetSectionTitle}>Outils personnels</Text>
          <TouchableOpacity style={styles.sheetRow} onPress={() => setScreen('full_settings')}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>🕒</Text>
              <Text style={styles.sheetRowText}>Centre des activités</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetRow}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>☁️</Text>
              <Text style={styles.sheetRowText}>Vidéos hors ligne</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetRow}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>🔳</Text>
              <Text style={styles.sheetRowText}>Ton code QR</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <Text style={styles.sheetSectionTitle}>Outils de création et professionnels</Text>
          <TouchableOpacity style={styles.sheetRow}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>🧑‍🎨</Text>
              <Text style={styles.sheetRowText}>NOVA Studio</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sheetRow} onPress={() => setScreen('full_settings')}>
            <View style={styles.rowLeft}>
              <Text style={styles.sheetIcon}>⚙️</Text>
              <Text style={styles.sheetRowText}>Paramètres et confidentialité</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeSheetBtn} onPress={() => setScreen('profile_edit')}>
            <Text style={styles.closeSheetText}>Fermer / Voir Profil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'full_settings') {
    return (
      <SafeAreaView style={styles.cyberDarkLayout}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.cyberHeader}>
          <TouchableOpacity onPress={() => setScreen('profile_edit')} style={styles.backBtn}>
            <Text style={styles.cyberBackIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.cyberMainTitle}>Paramètres et activité</Text>
          <TouchableOpacity onPress={() => setScreen('side_menu')}>
            <Text style={{ fontSize: 18, color: '#00F2FE' }}>☰</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.cyberScrollContainer}>
          <View style={styles.cyberToggleRow}>
            <View>
              <Text style={styles.cyberToggleTitle}>Vues du profil</Text>
              <Text style={styles.cyberToggleSub}>Historique des vues actif</Text>
            </View>
            <Switch
              value={currentUser.viewsActive}
              onValueChange={(val) => setCurrentUser({ ...currentUser, viewsActive: val })}
              trackColor={{ false: '#333', true: '#00F2FE' }}
              thumbColor={currentUser.viewsActive ? '#FFFFFF' : '#888'}
            />
          </View>

          <Text style={styles.cyberSectionHeader}>COMMENT VOUS UTILISEZ NOVA</Text>
          <View style={styles.cyberModalCard}>
            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Enregistrements', desc: 'Retrouve tous tes contenus et éléments enregistrés au même endroit.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#00F2FE' }]}>🔖</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Enregistrements</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Archives', desc: 'Consulte la liste de tes anciennes stories et publications archivées.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FF758C' }]}>🕐</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Archives</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Votre activité', desc: 'Statistiques sur le temps passé, les interactions et les recherches.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#38EF7D' }]}>📊</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Votre activité</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cyberItemRow, { borderBottomWidth: 0 }]} onPress={() => setActiveModal({ title: 'Notifications', desc: 'Gère les alertes push, e-mails et SMS.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#F7B731' }]}>🔔</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Notifications</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cyberSectionHeader}>QUI PEUT VOIR VOTRE CONTENU</Text>
          <View style={styles.cyberModalCard}>
            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Confidentialité du profil', desc: 'Bascule entre un compte public et un compte privé.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FF416C' }]}>🔒</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Confidentialité du profil</Text>
                <Text style={styles.cyberItemSub}>Public</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Amis proches', desc: 'Partage tes contenus exclusivement avec tes amis sélectionnés.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#38EF7D' }]}>⭐</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Amis proches</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Comptes bloqués', desc: 'Gestion de la liste noire des comptes bloqués.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FF4757' }]}>🚫</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Comptes bloqués</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cyberItemRow, { borderBottomWidth: 0 }]} onPress={() => setActiveModal({ title: 'Masquer la story', desc: 'Empêche certains comptes de voir tes stories.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#74B9FF' }]}>🙈</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Masquer la story</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cyberSectionHeader}>INTERACTIONS ET FILTRES</Text>
          <View style={styles.cyberModalCard}>
            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Identifications et mentions', desc: 'Contrôle qui peut t’identifier dans des publications ou commentaires.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#00F2FE' }]}>@</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Identifications et mentions</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Commentaires', desc: 'Autorisations et filtres automatiques sur les commentaires.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FF6B6B' }]}>💬</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Commentaires</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Partages et réutilisations', desc: 'Autorise la reprise de tes vidéos pour des duos ou collages.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#A3CB38' }]}>🔄</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Partages et réutilisations</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Comptes restreints', desc: 'Limite les interactions sans avoir à bloquer complètement.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FDA7DF' }]}>🔕</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Comptes restreints</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Mots masqués', desc: 'Masque les commentaires et messages contenant des mots indésirables.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#D6A2E8' }]}>Aa</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Mots masqués</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Synchronisation des contacts', desc: 'Trouve facilement tes amis inscrits sur l’application.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#00F2FE' }]}>📇</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Synchronisation des contacts</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cyberItemRow, { borderBottomWidth: 0 }]} onPress={() => setActiveModal({ title: "S'abonner aux comptes d'amis et inviter des amis", desc: "Envoie des invitations et découvre de nouveaux profils." })}>
              <Text style={[styles.cyberItemIcon, { color: '#F7B731' }]}>👥</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>S'abonner aux comptes d'amis et inviter des amis</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cyberSectionHeader}>PLUS D'INFORMATIONS ET ASSISTANCE</Text>
          <View style={styles.cyberModalCard}>
            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Signaler un problème', desc: 'Envoie un rapport aux équipes de modération et de support.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#FF4757' }]}>⚠️</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Signaler un problème</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setActiveModal({ title: 'Aide', desc: 'Consulte les guides d’utilisation et la foire aux questions.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#00F2FE' }]}>🛟</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Aide</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cyberItemRow, { borderBottomWidth: 0 }]} onPress={() => setActiveModal({ title: 'Conditions et politiques', desc: 'Consulte les règles d’utilisation, la politique de confidentialité et les mentions légales.' })}>
              <Text style={[styles.cyberItemIcon, { color: '#A3CB38' }]}>ℹ️</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Conditions et politiques</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cyberSectionHeader}>CONNEXION</Text>
          <View style={styles.cyberModalCard}>
            <TouchableOpacity style={styles.cyberItemRow} onPress={() => setScreen('login')}>
              <Text style={styles.cyberItemIcon}>🔀</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={styles.cyberItemTitle}>Changer de compte</Text>
                <Text style={styles.cyberItemSub}>Connecté : @{currentUser.username}</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cyberItemRow, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <Text style={styles.cyberItemIcon}>🚪</Text>
              <View style={styles.cyberTextContainer}>
                <Text style={[styles.cyberItemTitle, { color: '#FF4757' }]}>Se déconnecter</Text>
              </View>
              <Text style={styles.cyberChevron}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.appVersionText}>v47.6.3 (2024706030)</Text>
        </ScrollView>

        <Modal visible={!!activeModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{activeModal?.title}</Text>
              <Text style={styles.modalDesc}>{activeModal?.desc}</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
                <Text style={styles.modalCloseText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (screen === 'profile_edit') {
    return (
      <SafeAreaView style={styles.profileEditLayout}>
        <StatusBar barStyle="light-content" />
        <View style={styles.profileTopHeader}>
          <TouchableOpacity style={styles.profileBackBtn} onPress={() => setScreen('full_settings')}>
            <Text style={styles.profileBackIcon}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBgBtn}>
            <Text style={styles.addBgBtnText}>Ajouter un arrière-plan</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.profileEditScroll}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: currentUser.profilePic }} style={styles.avatarImg} />
              <View style={styles.cameraBadge}>
                <Text style={{ fontSize: 16 }}>📷</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Text style={styles.changePhotoText}>Changer de photo
