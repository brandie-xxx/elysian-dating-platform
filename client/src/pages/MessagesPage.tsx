import MatchCard from "@/components/MatchCard";
import ChatMessage from "@/components/ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft } from "lucide-react";
import { useState } from "react";
import profileImage from '@assets/generated_images/diverse_dating_profile_photos_10e01b24.png';

export default function MessagesPage() {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // todo: remove mock functionality
  const mockMatches = [
    {
      id: "1",
      name: "Alex",
      age: 26,
      photo: profileImage,
      mutualInterests: ["Photography", "Hiking", "Coffee"],
      matchPercentage: 89,
      lastMessage: "Hey! Love your photos from the hike last weekend 📸",
      isOnline: true
    },
    {
      id: "2", 
      name: "Sam",
      age: 29,
      photo: profileImage,
      mutualInterests: ["Travel", "Art", "Music"],
      matchPercentage: 82,
      lastMessage: "That gallery opening was amazing! Thanks for the recommendation.",
      isOnline: false
    },
    {
      id: "3",
      name: "Taylor",
      age: 27,
      photo: profileImage,
      mutualInterests: ["Yoga", "Cooking", "Books"],
      matchPercentage: 91,
      lastMessage: "Would love to try that new restaurant you mentioned!",
      isOnline: true
    }
  ];

  const mockMessages = [
    {
      id: "1",
      content: "Hey there! I saw you love hiking too. Have you been to the Golden Gate trails?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isOwn: false,
      senderName: "Alex",
      senderPhoto: profileImage
    },
    {
      id: "2", 
      content: "Yes! I was just there last weekend. The views were absolutely breathtaking. Would love to go again sometime!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isOwn: true
    },
    {
      id: "3",
      content: "That sounds perfect! I know some great spots off the beaten path. Maybe we could plan a hiking date? ⛰️",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: false,
      senderName: "Alex",
      senderPhoto: profileImage
    },
    {
      id: "4",
      content: "I'd love that! How about this Saturday morning? The weather looks perfect.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isOwn: true
    }
  ];

  const selectedMatchData = mockMatches.find(m => m.id === selectedMatch);

  const handleMatchClick = (matchId: string) => {
    setSelectedMatch(matchId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    console.log(`Sending message to ${selectedMatchData?.name}: ${newMessage}`);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (selectedMatch) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Chat Header */}
        <div className="flex items-center space-x-3 p-4 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedMatch(null)}
            data-testid="back-to-matches"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <img
            src={selectedMatchData?.photo}
            alt={selectedMatchData?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          
          <div>
            <h2 className="font-semibold">{selectedMatchData?.name}</h2>
            <p className="text-xs text-muted-foreground">
              {selectedMatchData?.isOnline ? "Online now" : "Last seen recently"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
              data-testid="message-input"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              data-testid="send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Your Matches
        </h1>
        <p className="text-muted-foreground">
          Start a conversation with someone special
        </p>
      </div>

      <div className="space-y-4">
        {mockMatches.map((match) => (
          <MatchCard
            key={match.id}
            {...match}
            onClick={handleMatchClick}
          />
        ))}
      </div>

      {mockMatches.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No matches yet</p>
          <p className="text-sm text-muted-foreground">
            Keep swiping to find your perfect match!
          </p>
        </Card>
      )}
    </div>
  );
}