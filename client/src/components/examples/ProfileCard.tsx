import ProfileCard from '../ProfileCard';
import { ThemeProvider } from '../ThemeProvider';
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function ProfileCardExample() {
  // todo: remove mock functionality
  const mockProfile = {
    id: "1",
    name: "Emma",
    age: 28,
    location: "San Francisco, CA",
    bio: "Coffee enthusiast, yoga instructor, and adventure seeker. Looking for someone who shares my passion for life and exploring new places. Let's grab a coffee and see where it goes!",
    interests: ["Yoga", "Coffee", "Hiking", "Photography", "Travel", "Books"],
    photos: [profileImage]
  };

  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <ProfileCard 
          {...mockProfile}
          onLike={(id) => console.log('Liked:', id)}
          onPass={(id) => console.log('Passed:', id)}
        />
      </div>
    </ThemeProvider>
  );
}