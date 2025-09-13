import { Heart, ArrowRight } from "lucide-react";
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
          <Heart className="h-8 w-8 text-white fill-white mr-3" />
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
            LoveConnect
          </h1>
        </div>
        
        <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-light mb-6 text-white/90">
          Where Hearts Meet & Love Lives
        </h2>
        
        <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto leading-relaxed">
          Discover meaningful connections with people who share your passions, values, and dreams. 
          Our premium platform brings together authentic hearts looking for genuine love.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white/95 text-black hover:bg-white border-white font-semibold px-8 py-3"
            data-testid="get-started-button"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleLearnMore}
            className="border-white/80 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3"
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