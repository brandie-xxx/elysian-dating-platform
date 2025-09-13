import ProfileCard from "@/components/ProfileCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function DiscoverPage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // todo: remove mock functionality
  const mockProfiles = [
    {
      id: "1",
      name: "Chipo",
      age: 28,
      location: "Harare, Zimbabwe",
      bio: "Love exploring the beautiful landscapes of Zimbabwe, from Victoria Falls to the Eastern Highlands. Looking for someone to share adventures and deep conversations.",
      interests: ["Travel", "Photography", "Hiking", "Culture", "Music", "Literature"],
      photos: [profileImage]
    },
    {
      id: "2", 
      name: "Thabo",
      age: 26,
      location: "Cape Town, South Africa",
      bio: "Software developer who loves Table Mountain hikes and braai weekends. Passionate about technology and African innovation.",
      interests: ["Tech", "Hiking", "Braai", "Innovation", "Music", "Art"],
      photos: [profileImage]
    },
    {
      id: "3",
      name: "Nomsa",
      age: 30,
      location: "Gaborone, Botswana", 
      bio: "Artist celebrating African heritage through contemporary works. Love discovering local talent and supporting community arts.",
      interests: ["Art", "Culture", "Community", "Design", "Heritage", "Museums"],
      photos: [profileImage]
    }
  ];

  const currentProfile = mockProfiles[currentProfileIndex];

  const handleLike = (id: string) => {
    console.log(`Liked profile: ${id}`);
    nextProfile();
  };

  const handlePass = (id: string) => {
    console.log(`Passed on profile: ${id}`);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const refreshProfiles = () => {
    setIsLoading(true);
    console.log("Refreshing profiles...");
    setTimeout(() => {
      setIsLoading(false);
      setCurrentProfileIndex(0);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Discover Your Match
        </h1>
        <p className="text-muted-foreground">
          Swipe through profiles and find your perfect connection
        </p>
      </div>

      <div className="flex justify-center mb-6">
        {currentProfile && !isLoading ? (
          <ProfileCard
            {...currentProfile}
            onLike={handleLike}
            onPass={handlePass}
          />
        ) : (
          <div className="w-full max-w-sm mx-auto h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              {isLoading ? (
                <>
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Finding new matches...</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">No more profiles to show</p>
                  <Button onClick={refreshProfiles} data-testid="refresh-profiles">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Profile {currentProfileIndex + 1} of {mockProfiles.length}
      </div>
    </div>
  );
}