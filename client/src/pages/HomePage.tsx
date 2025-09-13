import HeroSection from "@/components/HeroSection";
import { Heart, Shield, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HomePageProps {
  onGetStarted?: () => void;
}

export default function HomePage({ onGetStarted }: HomePageProps) {
  
  const handleGetStarted = () => {
    console.log('Getting started...');
    onGetStarted?.();
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        onGetStarted={handleGetStarted}
        onLearnMore={() => console.log('Learn more clicked')}
      />

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Elysian?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We celebrate the beauty of African culture while connecting hearts across our magnificent continent. 
              Find someone who truly understands your heritage, values, and dreams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Authentic Matching</h3>
              <p className="text-muted-foreground text-sm">
                Our algorithm focuses on compatibility based on shared interests and values.
              </p>
            </Card>

            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground text-sm">
                Your privacy and safety are our top priorities with verified profiles.
              </p>
            </Card>

            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
            <h3 className="font-semibold text-lg mb-2">Continental Reach</h3>
              <p className="text-muted-foreground text-sm">
                Connect with amazing people from Lagos to Cairo, Nairobi to Casablanca, and everywhere across Africa.
              </p>
            </Card>

            <Card className="p-6 text-center hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Forever Free</h3>
              <p className="text-muted-foreground text-sm">
                All features are completely free. Love shouldn't cost a thing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Love Stories That Inspire
            </h2>
            <p className="text-xl text-muted-foreground">
              Real couples who found their forever on LoveConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 hover-elevate">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full border-2 border-background" />
                  <div className="w-10 h-10 bg-secondary/20 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah & Michael</h4>
                  <p className="text-sm text-muted-foreground">Married 2 years</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "We connected over our shared passion for African cinema and storytelling. 
                Elysian brought us together across the continent - I'm from Kigali, she's from Accra!"
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full border-2 border-background" />
                  <div className="w-10 h-10 bg-secondary/20 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h4 className="font-semibold">Emma & James</h4>
                  <p className="text-sm text-muted-foreground">Engaged</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Finding someone who appreciates both my Yoruba roots and modern aspirations was beautiful. 
                Our conversations flow like poetry. Planning our fusion ceremony with traditions from both our cultures!"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of Africans who have found love on Elysian. 
            Your beautiful love story could be next.
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