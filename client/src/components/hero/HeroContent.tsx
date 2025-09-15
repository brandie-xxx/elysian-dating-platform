import { Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroContentProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function HeroContent({
  onGetStarted,
  onLearnMore,
}: HeroContentProps) {
  const handleGetStarted = () => {
    if (onGetStarted) return onGetStarted();
    window.dispatchEvent(new CustomEvent("open-signup-modal"));
  };

  return (
    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-[hsl(var(--foreground))] font-sans">
      <div className="flex justify-center items-center mb-6">
        <Sparkles className="h-8 w-8 text-[hsl(var(--primary))] mr-3 animate-pulse" />
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
          Elysian
        </h1>
        <Star className="h-6 w-6 text-[hsl(var(--primary-foreground))] ml-3" />
      </div>

      <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-light mb-6 text-white/90">
        Where African Hearts Connect
      </h2>

      <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto leading-relaxed">
        Discover meaningful connections across Africa — from Lagos to Nairobi
        and beyond. Meet people who share your values and dreams.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="glass-strong text-[hsl(var(--sidebar-primary-foreground))] border-0 font-semibold px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          style={{ textShadow: "0 0 3px rgba(0,0,0,0.5)" }}
          data-testid="get-started-button"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
