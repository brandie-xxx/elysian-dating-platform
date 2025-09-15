import ParallaxImage from "../ParallaxImage";
import heroImage from "@assets/generated_images/romantic_couple_silhouette_sunset_ca707d63.png";

export default function HeroBackground() {
  return (
    <>
      <ParallaxImage
        src={heroImage}
        alt="Romantic couple silhouette at sunset"
        speed={0.25}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 -z-5" />
    </>
  );
}
