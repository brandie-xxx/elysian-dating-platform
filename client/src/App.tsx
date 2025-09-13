import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import MessagesPage from "@/pages/MessagesPage";
import SearchPage from "@/pages/SearchPage";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    setCurrentPage("discover");
  };

  // Show loading spinner while checking authentication
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

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {currentPage !== "home" && (
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      
      <main className="flex-1">
        {currentPage === "home" && <HomePage onGetStarted={handleGetStarted} />}
        {currentPage === "discover" && <DiscoverPage />}
        {currentPage === "messages" && <MessagesPage />}
        {currentPage === "search" && <SearchPage />}
        {currentPage === "profile" && (
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Profile Settings</h1>
            <p className="text-muted-foreground font-sans">Profile management coming soon!</p>
          </div>
        )}
        {currentPage === "settings" && (
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Account Settings</h1>
            <p className="text-muted-foreground font-sans">Settings panel coming soon!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
