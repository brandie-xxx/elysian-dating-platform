import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, LogOut } from "lucide-react";
import type { User } from "@shared/schema";

export default function Home() {
  const { user, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-rose-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <Card className="p-8 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 mb-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Elysian, {user?.firstName || "Friend"}!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Your journey to find meaningful connections across Zimbabwe
                starts here.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-3"
                  data-testid="button-complete-profile"
                >
                  Complete Your Profile
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 px-8 py-3"
                  data-testid="button-start-matching"
                >
                  Start Matching
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="p-6 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate cursor-pointer"
              data-testid="card-discover"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Discover
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Browse and connect with new people
                </p>
              </div>
            </Card>

            <Card
              className="p-6 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate cursor-pointer"
              data-testid="card-matches"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Matches
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  View your mutual connections
                </p>
              </div>
            </Card>

            <Card
              className="p-6 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate cursor-pointer"
              data-testid="card-messages"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Messages
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Chat with your matches
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
