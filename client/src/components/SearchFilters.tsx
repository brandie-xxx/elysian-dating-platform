import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onFiltersChange?: (filters: any) => void;
}

export default function SearchFilters({ onSearch, onFiltersChange }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState([22, 35]);
  const [distance, setDistance] = useState([25]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // todo: remove mock functionality
  const availableInterests = [
    "Photography", "Hiking", "Coffee", "Travel", "Yoga", "Music",
    "Art", "Cooking", "Reading", "Fitness", "Dancing", "Movies"
  ];

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
    onSearch?.(searchQuery);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const updated = prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest];
      
      onFiltersChange?.({ ageRange, distance, interests: updated });
      return updated;
    });
  };

  const handleAgeChange = (value: number[]) => {
    setAgeRange(value);
    onFiltersChange?.({ ageRange: value, distance, interests: selectedInterests });
  };

  const handleDistanceChange = (value: number[]) => {
    setDistance(value);
    onFiltersChange?.({ ageRange, distance: value, interests: selectedInterests });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            placeholder="Search by name, interests, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
        <Button onClick={handleSearch} data-testid="search-button">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="filters-toggle"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Age Range</Label>
            <Slider
              value={ageRange}
              onValueChange={handleAgeChange}
              max={60}
              min={18}
              step={1}
              className="w-full"
              data-testid="age-slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{ageRange[0]} years</span>
              <span>{ageRange[1]} years</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Distance</Label>
            <Slider
              value={distance}
              onValueChange={handleDistanceChange}
              max={100}
              min={1}
              step={1}
              className="w-full"
              data-testid="distance-slider"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Up to {distance[0]} miles away
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Interests</Label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => toggleInterest(interest)}
                  data-testid={`interest-${interest}`}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {(selectedInterests.length > 0 || ageRange[0] !== 22 || ageRange[1] !== 35 || distance[0] !== 25) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedInterests.length > 0 && `${selectedInterests.length} interests`}
                {selectedInterests.length > 0 && (ageRange[0] !== 22 || ageRange[1] !== 35) && ", "}
                {(ageRange[0] !== 22 || ageRange[1] !== 35) && `${ageRange[0]}-${ageRange[1]} years`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAgeRange([22, 35]);
                  setDistance([25]);
                  setSelectedInterests([]);
                }}
                data-testid="clear-filters"
              >
                Clear All
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}