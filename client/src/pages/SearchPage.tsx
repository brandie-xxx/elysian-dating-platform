import SearchFilters from "@/components/SearchFilters";
import ProfileCard from "@/components/ProfileCard";
import { useState } from "react";
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // todo: remove mock functionality
  const mockProfiles = [
    {
      id: "1",
      name: "Emma",
      age: 28,
      location: "San Francisco, CA",
      bio: "Coffee enthusiast, yoga instructor, and adventure seeker. Looking for someone who shares my passion for life.",
      interests: ["Yoga", "Coffee", "Hiking", "Photography"],
      photos: [profileImage]
    },
    {
      id: "2",
      name: "Alex", 
      age: 26,
      location: "Oakland, CA",
      bio: "Software engineer by day, rock climber by weekend. Love outdoor adventures and cozy movie nights.",
      interests: ["Rock Climbing", "Tech", "Movies", "Cooking"],
      photos: [profileImage]
    },
    {
      id: "3",
      name: "Jordan",
      age: 30,
      location: "Berkeley, CA",
      bio: "Artist and traveler with a passion for discovering hidden gems in the city.",
      interests: ["Art", "Travel", "Photography", "Food"],
      photos: [profileImage]
    },
    {
      id: "4",
      name: "Casey",
      age: 25, 
      location: "Palo Alto, CA",
      bio: "Fitness trainer and nutrition coach. Helping others achieve their health goals while exploring life's adventures.",
      interests: ["Fitness", "Nutrition", "Hiking", "Dancing"],
      photos: [profileImage]
    }
  ];

  const handleSearch = (query: string) => {
    setIsSearching(true);
    console.log(`Searching for: ${query}`);
    
    // Simulate search
    setTimeout(() => {
      const filtered = mockProfiles.filter(profile => 
        profile.name.toLowerCase().includes(query.toLowerCase()) ||
        profile.bio.toLowerCase().includes(query.toLowerCase()) ||
        profile.interests.some(interest => 
          interest.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // Simulate filter application
    const filtered = mockProfiles.filter(profile => {
      const ageMatch = profile.age >= filters.ageRange[0] && profile.age <= filters.ageRange[1];
      const interestMatch = filters.interests.length === 0 || 
        filters.interests.some((interest: string) => profile.interests.includes(interest));
      
      return ageMatch && interestMatch;
    });
    setSearchResults(filtered);
  };

  const handleLike = (id: string) => {
    console.log(`Liked profile: ${id}`);
  };

  const handlePass = (id: string) => {
    console.log(`Passed on profile: ${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Search & Discover
        </h1>
        <p className="text-muted-foreground">
          Find people who match your preferences and interests
        </p>
      </div>

      <div className="mb-8">
        <SearchFilters 
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-2">Searching...</p>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((profile) => (
            <ProfileCard
              key={profile.id}
              {...profile}
              onLike={handleLike}
              onPass={handlePass}
            />
          ))}
        </div>
      )}

      {!isSearching && searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Use the search and filters above to find your perfect match
          </p>
          <p className="text-sm text-muted-foreground">
            Try searching by interests, location, or adjusting your preferences
          </p>
        </div>
      )}
    </div>
  );
}