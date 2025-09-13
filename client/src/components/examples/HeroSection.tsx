import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      onGetStarted={() => console.log('Get started clicked')}
      onLearnMore={() => console.log('Learn more clicked')}
    />
  );
}