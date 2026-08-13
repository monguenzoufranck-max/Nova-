import StoryBar from './StoryBar';

// À l'intérieur de ton écran d'accueil :
<View style={{ flex: 1 }}>
  <StoryBar 
    onAddStory={() => console.log("Ouvrir l'appareil photo")} 
    onSelectStory={(story) => console.log("Afficher la story", story)} 
  />
  {/* Le reste de ton fil vidéo ici */}
</View>
      
