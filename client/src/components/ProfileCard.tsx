import { Heart, X, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  photos: string[];
  onLike?: (id: string) => void;
  onPass?: (id: string) => void;
}

export default function ProfileCard({ 
  id, name, age, location, bio, interests, photos, onLike, onPass 
}: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(true);
    console.log(`Liked profile: ${name}`);
    onLike?.(id);
  };

  const handlePass = () => {
    console.log(`Passed on profile: ${name}`);
    onPass?.(id);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden hover-elevate">
      <div className="relative aspect-[3/4] bg-muted">
        {photos[0] && (
          <img
            src={photos[currentPhotoIndex] || photos[0]}
            alt={`${name}'s photo`}
            className="w-full h-full object-cover"
            data-testid={`profile-photo-${id}`}
          />
        )}
        
        {photos.length > 1 && (
          <div className="absolute inset-0 flex">
            <button 
              className="flex-1" 
              onClick={prevPhoto}
              data-testid={`prev-photo-${id}`}
            />
            <button 
              className="flex-1" 
              onClick={nextPhoto}
              data-testid={`next-photo-${id}`}
            />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white">
            <h3 className="text-xl font-semibold" data-testid={`name-${id}`}>
              {name}, {age}
            </h3>
            <div className="flex items-center text-sm text-white/80 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span data-testid={`location-${id}`}>{location}</span>
            </div>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="absolute top-2 left-2 right-2">
            <div className="flex space-x-1">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground" data-testid={`bio-${id}`}>
          {bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {interests.slice(0, 6).map((interest, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        <div className="flex justify-center space-x-4 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-2"
            onClick={handlePass}
            data-testid={`pass-button-${id}`}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            className={`h-12 w-12 rounded-full ${isLiked ? 'animate-pulse' : ''}`}
            onClick={handleLike}
            data-testid={`like-button-${id}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}