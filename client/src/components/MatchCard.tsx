import { MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MatchCardProps {
  id: string;
  name: string;
  age: number;
  photo: string;
  mutualInterests: string[];
  matchPercentage: number;
  lastMessage?: string;
  isOnline?: boolean;
  onClick?: (id: string) => void;
}

export default function MatchCard({ 
  id, name, age, photo, mutualInterests, matchPercentage, lastMessage, isOnline, onClick 
}: MatchCardProps) {
  
  const handleClick = () => {
    console.log(`Clicked on match: ${name}`);
    onClick?.(id);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Starting conversation with ${name}`);
  };

  return (
    <Card 
      className="p-4 hover-elevate active-elevate-2 cursor-pointer" 
      onClick={handleClick}
      data-testid={`match-card-${id}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={photo}
            alt={`${name}'s photo`}
            className="w-12 h-12 rounded-full object-cover"
            data-testid={`match-photo-${id}`}
          />
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium truncate" data-testid={`match-name-${id}`}>
              {name}, {age}
            </h4>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-primary fill-primary" />
              <span>{matchPercentage}%</span>
            </div>
          </div>
          
          {mutualInterests.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {mutualInterests.slice(0, 3).join(", ")}
              {mutualInterests.length > 3 && ` +${mutualInterests.length - 3} more`}
            </p>
          )}
          
          {lastMessage && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {lastMessage}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleMessage}
          data-testid={`message-button-${id}`}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}