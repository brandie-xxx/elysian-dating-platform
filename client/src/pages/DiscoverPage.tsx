import ProfileCard from "@/components/ProfileCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import profileImage from "@assets/generated_images/diverse_dating_profile_photos_10e01b24.png";

export default function DiscoverPage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // todo: remove mock functionality
  const mockProfiles = [
    {
      id: "1",
      name: "Amara",
      age: 28,
      location: "Nairobi, Kenya",
      bio: "Passionate about wildlife conservation and African storytelling. Love exploring from Maasai Mara to the coast of Mombasa. Seeking someone who shares my love for adventure and meaningful conversations.",
      interests: [
        "Conservation",
        "Photography",
        "Storytelling",
        "Culture",
        "Travel",
        "Nature",
      ],
      photos: [profileImage],
    },
    {
      id: "2",
      name: "Ibrahim",
      age: 26,
      location: "Lagos, Nigeria",
      bio: "Tech entrepreneur building solutions for African markets. From Afrobeats concerts to quiet beach walks in Lagos. Looking for genuine connection with someone who dreams big.",
      interests: [
        "Technology",
        "Music",
        "Business",
        "Innovation",
        "Culture",
        "Art",
      ],
      photos: [profileImage],
    },
    {
      id: "3",
      name: "Selam",
      age: 30,
      location: "Addis Ababa, Ethiopia",
      bio: "Coffee lover (from the birthplace of coffee!) and cultural historian. Fascinated by our rich African heritage and excited to explore it with someone special.",
      interests: [
        "History",
        "Coffee",
        "Culture",
        "Heritage",
        "Literature",
        "Travel",
      ],
      photos: [profileImage],
    },
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
                  <p className="text-muted-foreground">
                    Finding new matches...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    No more profiles to show
                  </p>
                  <Button
                    variant="default"
                    onClick={refreshProfiles}
                    data-testid="refresh-profiles"
                  >
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
