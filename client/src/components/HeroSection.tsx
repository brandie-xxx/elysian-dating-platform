import HeroBackground from "./hero/HeroBackground";
import HeroContent from "./hero/HeroContent";
import HeroStats from "./hero/HeroStats";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function HeroSection({
  onGetStarted,
  onLearnMore,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <HeroBackground />
      <HeroContent onGetStarted={onGetStarted} onLearnMore={onLearnMore} />
      <HeroStats />
    </section>
  );
}
