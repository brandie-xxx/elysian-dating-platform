import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/20 dark:bg-black/20 border-b border-white/30 dark:border-gray-800/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Elysian
            </h1>
          </div>
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20"
            data-testid="button-header-login"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Connect Hearts
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                In Zimbabwe
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Experience the beauty of authentic connections with Elysian - Zimbabwe's premier dating platform connecting hearts from Harare to Bulawayo, Victoria Falls to Mutare.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-6 text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
                data-testid="button-hero-login"
              >
                <Sparkles className="mr-2 h-5 w-5" strokeWidth={1.5} />
                Start Your Journey
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="p-8 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Authentic Connections
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Meet genuine people who share your values, culture, and dreams across beautiful Zimbabwe.
                </p>
              </div>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Smart Matching
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our intelligent algorithm connects you with compatible partners based on shared interests and values.
                </p>
              </div>
            </Card>

            <Card className="p-8 backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/30 dark:border-gray-800/30 hover-elevate">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Safe & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your privacy and safety are our priority with verified profiles and secure messaging.
                </p>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Find Your Match?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of Zimbabwean singles who have found love through Elysian
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/20 px-8 py-6 text-lg font-semibold"
              data-testid="button-cta-login"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}