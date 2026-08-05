import { Linking, Alert } from 'react-native';

// Fonction pour recharger son solde en Mobile Money
const handleRechargeWallet = async (amount, phoneNumber) => {
  try {
    // 1. Appel de ton serveur / fonction Supabase pour créer la transaction
    const response = await fetch('HTTPS_DE_TON_API_DE_PAIEMENT/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount,
        currency: 'XAF', // Ou XOF / EUR selon la zone
        phone: phoneNumber,
        description: 'Recharge Portefeuille Nova',
      }),
    });

    const data = await response.json();

    if (data.payment_url) {
      // 2. Redirection de l'utilisateur vers la page sécurisée Mobile Money
      await Linking.openURL(data.payment_url);
    } else {
      Alert.alert('Erreur', 'Impossible de générer le lien de paiement.');
    }
  } catch (error) {
    Alert.alert('Erreur', error.message);
  }
};
