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
      name: "Fatima",
      age: 28,
      location: "Casablanca, Morocco",
      bio: "Fashion designer inspired by African textiles and modern aesthetics. Love exploring medinas and beach sunsets. Seeking someone who appreciates art and culture.",
      interests: ["Fashion", "Design", "Culture", "Art", "Travel", "Photography"],
      photos: [profileImage]
    },
    {
      id: "2",
      name: "Kofi", 
      age: 26,
      location: "Accra, Ghana",
      bio: "Musician blending traditional highlife with contemporary sounds. When I'm not in the studio, I'm exploring local markets or chilling at the beach.",
      interests: ["Music", "Culture", "Innovation", "Food", "Art", "Community"],
      photos: [profileImage]
    },
    {
      id: "3",
      name: "Thandiwe",
      age: 30,
      location: "Johannesburg, South Africa",
      bio: "Documentary filmmaker capturing untold African stories. Passionate about social justice and authentic connections across our beautiful continent.",
      interests: ["Film", "Storytelling", "Justice", "Culture", "Travel", "Heritage"],
      photos: [profileImage]
    },
    {
      id: "4",
      name: "Jabari",
      age: 25, 
      location: "Kampala, Uganda",
      bio: "Environmental scientist working on sustainable solutions for our communities. Love hiking, good conversation, and exploring East Africa's natural beauty.",
      interests: ["Environment", "Science", "Nature", "Sustainability", "Hiking", "Innovation"],
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