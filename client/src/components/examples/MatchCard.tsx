import MatchCard from '../MatchCard';
import { ThemeProvider } from '../ThemeProvider';
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function MatchCardExample() {
  // todo: remove mock functionality
  const mockMatch = {
    id: "1",
    name: "Alex",
    age: 26,
    photo: profileImage,
    mutualInterests: ["Photography", "Hiking", "Coffee"],
    matchPercentage: 89,
    lastMessage: "Hey! Love your photos from the hike last weekend 📸",
    isOnline: true
  };

  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <MatchCard 
          {...mockMatch}
          onClick={(id) => console.log('Clicked match:', id)}
        />
      </div>
    </ThemeProvider>
  );
}