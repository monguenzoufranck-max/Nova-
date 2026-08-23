import { supabase } from '../supabaseClient';

// Fonction d'envoi du fichier vidéo vers Supabase Storage & Database
const uploadVideoToSupabase = async (fileUri) => {
  try {
    // 1. Convertir le fichier local en Blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileName = `video_${Date.now()}.mp4`;
    const filePath = `public/${fileName}`;

    // 2. Envoyer le fichier dans le bucket Storage 'videos'
    const { data: storageData, error: storageError } = await supabase.storage
      .from('videos')
      .upload(filePath, blob, {
        contentType: 'video/mp4',
      });

    if (storageError) throw storageError;

    // 3. Récupérer l'URL publique de la vidéo
    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    // 4. Ajouter l'entrée dans la table SQL 'posts'
    const { error: dbError } = await supabase.from('posts').insert([
      {
        video_url: publicUrl,
        caption: 'Nouvelle vidéo publiée sur NOVA ! 🚀',
      },
    ]);

    if (dbError) throw dbError;

    Alert.alert('Succès 🎉', 'Ta vidéo est en ligne sur NOVA !');
  } catch (error) {
    console.error('Erreur lors du transfert :', error.message);
    Alert.alert('Erreur', "Échec de l'envoi de la vidéo.");
  }
};
    
