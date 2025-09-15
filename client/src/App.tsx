import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModalProvider } from "@/components/SignupModal";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import FooterNew from "@/components/FooterNew";
import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
// Note: Landing import removed (unused/missing file) to avoid TS error
import MessagesPage from "@/pages/MessagesPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/not-found";
import AccountPage from "@/pages/Account";
import MatchesPage from "@/pages/Matches";
import ChatsPage from "@/pages/Chats";
import FavouritesPage from "@/pages/Favourites";
import CommunitiesPage from "@/pages/Communities";
import React from "react";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <>{children}</>;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-signup-modal"));
  }
  return (
    <HomePage
      onGetStarted={() =>
        window.dispatchEvent(new CustomEvent("open-signup-modal"))
      }
    />
  );
}

function AppRouter() {
  const { isLoading } = useAuth();
  const [, navigate] = useLocation();

  const handlePageChange = (page: string) => {
    const map: Record<string, string> = {
      home: "/",
      discover: "/discover",
      matches: "/matches",
      chats: "/chats",
      communities: "/communities",
      account: "/account",
    };
    const path = map[page] ?? "/";
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-rose-500 text-2xl mb-4">✨</div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onPageChange={handlePageChange} />
      <main className="flex-1">
        <Switch>
          <Route
            path="/"
            component={() => (
              <HomePage
                onGetStarted={() =>
                  window.dispatchEvent(new CustomEvent("open-signup-modal"))
                }
              />
            )}
          />
          <Route
            path="/discover"
            component={() => (
              <RequireAuth>
                <DiscoverPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/messages"
            component={() => (
              <RequireAuth>
                <MessagesPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/search"
            component={() => (
              <RequireAuth>
                <SearchPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/account"
            component={() => (
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/matches"
            component={() => (
              <RequireAuth>
                <MatchesPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/chats"
            component={() => (
              <RequireAuth>
                <ChatsPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/favourites"
            component={() => (
              <RequireAuth>
                <FavouritesPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/communities"
            component={() => (
              <RequireAuth>
                <CommunitiesPage />
              </RequireAuth>
            )}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
      <FooterNew />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <ModalProvider>
            <Toaster />
            <AppRouter />
          </ModalProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
