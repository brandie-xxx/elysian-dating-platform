import { Heart, Moon, Sun, Settings, MessageCircle, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export default function Header({ currentPage = "discover", onPageChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (page: string) => {
    console.log(`Navigating to ${page}`);
    onPageChange?.(page);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-8">
        <div className="mr-4 hidden md:flex">
          <button 
            onClick={() => handleNavigation('discover')}
            className="flex items-center space-x-2 hover-elevate rounded-lg px-2 py-1"
            data-testid="logo-button"
          >
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="font-display text-lg font-semibold">Elysian</span>
          </button>
        </div>

        <nav className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium md:justify-start md:space-x-8">
          <Button
            variant={currentPage === "discover" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigation('discover')}
            data-testid="nav-discover"
          >
            <Heart className="h-4 w-4 mr-2" />
            Discover
          </Button>
          
          <Button
            variant={currentPage === "messages" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigation('messages')}
            data-testid="nav-messages"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </Button>
          
          <Button
            variant={currentPage === "search" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigation('search')}
            data-testid="nav-search"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={currentPage === "profile" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleNavigation('profile')}
            data-testid="nav-profile"
          >
            <User className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleNavigation('settings')}
            data-testid="nav-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}