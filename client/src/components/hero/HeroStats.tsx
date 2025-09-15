import { useState, useEffect } from "react";
import StatsCounter from "../StatsCounter";

export default function HeroStats() {
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    // Simulate matches incrementing over time
    const interval = setInterval(() => {
      setMatches((prev) => prev + 1);
    }, 3000); // increment every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-[hsl(var(--foreground))] font-sans">
      <div className="space-y-2">
        <StatsCounter
          id="matches"
          start={matches}
          step={1}
          label="Matches"
          delta={1}
        />
      </div>
      <div className="space-y-2">
        <StatsCounter
          id="free-forever"
          start={100}
          step={0}
          label="Free Forever (%)"
        />
      </div>
      <div className="space-y-2">
        <StatsCounter id="support" start={24} step={0} label="Hours Support" />
      </div>
    </div>
  );
}
