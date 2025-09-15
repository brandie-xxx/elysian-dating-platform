import { useEffect, useRef } from "react";

export default function ParallaxImage({
  src,
  alt = "",
  speed = 0.3,
}: {
  src: string;
  alt?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId != null) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = el.getBoundingClientRect();
        const offset = window.scrollY || window.pageYOffset;
        const pos = rect.top + offset;
        const y = (offset - pos) * speed;
        // Use transform for GPU acceleration
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };

    // initial position
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 -z-10 transform-gpu will-change-transform"
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
