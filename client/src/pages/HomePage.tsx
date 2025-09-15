import HeroSection from "@/components/HeroSection";
import SharedFeatures from "@/components/SharedFeatures";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DailyMatches from "@/components/DailyMatches";

interface HomePageProps {
  onGetStarted?: () => void;
}

export default function HomePage({ onGetStarted }: HomePageProps) {
  const handleGetStarted = () => {
    console.log("Getting started...");
    onGetStarted?.();
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        onGetStarted={handleGetStarted}
        onLearnMore={() => console.log("Learn more clicked")}
      />

      {/* Features Section */}
      {/* Daily Matches Section */}
      {/* Removed Today's Matches section as requested */}
      {/* <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Today's Matches
          </h2>
          <p className="text-muted-foreground mb-6">
            Curated picks for you — swipe, like, or message.
          </p>
          <DailyMatches />
        </div>
      </section>
      <SharedFeatures />

      {/* Success Stories Examples Section */}
      <section className="py-12 px-4 bg-primary/10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold mb-6">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
              <p className="mb-4 italic">
                "I met my soulmate on Elysian. Our values aligned perfectly, and
                now we're happily married!"
              </p>
              <p className="font-semibold">- Amina & Joseph</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
              <p className="mb-4 italic">
                "Thanks to Elysian, I found someone who truly understands me.
                Our journey started with a simple message."
              </p>
              <p className="font-semibold">- Thabo & Naledi</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
              <p className="mb-4 italic">
                "Elysian brought us together across continents. Love knows no
                boundaries!"
              </p>
              <p className="font-semibold">- Fatima & David</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success stories moved to Landing page to consolidate content */}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of Africans who have found love on Elysian. Your
            beautiful love story could be next.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="px-8 py-3 text-lg"
            data-testid="cta-get-started"
          >
            Start Your Love Story
            <Heart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
