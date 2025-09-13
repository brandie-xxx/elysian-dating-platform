import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import MessagesPage from "@/pages/MessagesPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleGetStarted = () => {
    setCurrentPage("discover");
  };

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
