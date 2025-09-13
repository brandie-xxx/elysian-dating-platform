import { Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from '@assets/generated_images/romantic_couple_silhouette_sunset_ca707d63.png';

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  
  const handleGetStarted = () => {
    console.log('Get started clicked');
    onGetStarted?.();
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked');
    onLearnMore?.();
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Romantic couple silhouette at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="flex justify-center items-center mb-6">
          <Sparkles className="h-8 w-8 text-white mr-3 animate-pulse" />
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Elysian
          </h1>
          <Star className="h-6 w-6 text-white/80 ml-3" />
        </div>
        
        <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-light mb-6 text-white/90">
          Where African Hearts Connect
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto leading-relaxed">
          Discover meaningful connections across Africa's vibrant landscape - from Lagos to Nairobi, Cairo to Cape Town, and everywhere in between. 
          Find your perfect match who celebrates our rich heritage and shares your dreams for the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="glass-strong text-white border-0 font-semibold px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            data-testid="get-started-button"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleLearnMore}
            className="glass-overlay text-white border-white/30 px-8 py-3 hover:glass-subtle transition-all duration-300"
            data-testid="learn-more-button"
          >
            Learn More
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">10k+</div>
            <div className="text-white/70">Success Stories</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-white/70">Free Forever</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-white/70">Safe & Secure</div>
          </div>
        </div>
      </div>
    </section>
  );
}