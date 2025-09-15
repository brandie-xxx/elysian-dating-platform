import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useLocation } from "wouter";

export default function Header({
  currentPage,
  onPageChange,
  // legacy callbacks used by Landing page
  onLoginClick,
  onSignupClick,
}: {
  currentPage?: string;
  onPageChange?: (page: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  const go = (page: string) => {
    if (onPageChange) return onPageChange(page);
    // map page keys to paths
    const map: Record<string, string> = {
      home: "/",
      discover: "/discover",
      matches: "/matches",
      chats: "/chats",
      communities: "/communities",
      account: "/account",
      settings: "/account",
    };
    const path = map[page] ?? "/";
    // For protected pages, store the intended path so we can redirect post-login/signup
    const protectedPages = new Set([
      "/discover",
      "/messages",
      "/search",
      "/matches",
      "/chats",
      "/favourites",
      "/communities",
      "/account",
    ]);
    if (protectedPages.has(path)) {
      try {
        sessionStorage.setItem("postAuthRedirect", path);
      } catch (e) {
        // ignore storage errors
      }
    }

    // If user is on the landing page, allow Header to trigger in-page scroll anchors via events
    if (path === "/" && typeof window !== "undefined") {
      // map special pages to landing anchors
      if (page === "home") {
        navigate(path);
        return;
      }
      if (page === "login") {
        window.dispatchEvent(new CustomEvent("scroll-to-login"));
        return;
      }
      if (page === "signup") {
        window.dispatchEvent(new CustomEvent("scroll-to-signup"));
        return;
      }
    }

    navigate(path);
  };

  return (
    <header className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-b border-white/30 dark:border-gray-800/30">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => go("home")}
          >
            Elysian
          </h1>
          <nav className="hidden md:flex items-center space-x-3">
            <button
              className="text-sm text-foreground hover:underline"
              onClick={() => go("discover")}
            >
              Discover
            </button>
            <button
              className="text-sm text-foreground hover:underline"
              onClick={() => go("matches")}
            >
              Matches
            </button>
            <button
              className="text-sm text-foreground hover:underline"
              onClick={() => go("chats")}
            >
              Chats
            </button>
            <button
              className="text-sm text-foreground hover:underline"
              onClick={() => go("communities")}
            >
              Communities
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={() => go("account")}
            variant="outline"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20"
          >
            Account
          </Button>
          <Button
            onClick={() => {
              // if legacy onSignupClick prop passed, call it (landing page usage)
              if (onSignupClick) return onSignupClick();
              // prefer opening the signup modal
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-signup-modal"));
                // also set a post-auth redirect to account by default
                try {
                  sessionStorage.setItem("postAuthRedirect", "/account");
                } catch (e) {}
                return;
              }
              return go("settings");
            }}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-md shadow-md hover:from-rose-600 hover:to-rose-700"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
