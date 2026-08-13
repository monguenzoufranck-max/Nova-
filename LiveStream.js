const sendGift = async (type, value) => {
  const { error } = await supabase.from('gifts').insert({
    sender_id: (await supabase.auth.getUser()).data.user.id,
    receiver_id: host_id, // L'ID du créateur du live
    gift_type: type,
    value: value,
    live_id: channelId
  });

  if (!error) {
    alert("Cadeau envoyé ! 🎁");
  }
};

// Remplace ton bouton actuel par celui-ci :
<TouchableOpacity 
  style={styles.giftButton} 
  onPress={() => sendGift('rose', 10)}
>
  <Ionicons name="gift" size={26} color="#FFD700" />
</TouchableOpacity>
    
