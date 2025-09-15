import { useEffect, useState, useRef } from "react";

interface StatsCounterProps {
  id: string; // unique id for localStorage
  start?: number;
  step?: number;
  label?: string;
  delta?: number; // optional recent growth to show like +32
}

export default function StatsCounter({
  id,
  start = 0,
  step = 1,
  label,
  delta,
}: StatsCounterProps) {
  const [value, setValue] = useState<number>(start);
  const [display, setDisplay] = useState<number>(start);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAndIncrement() {
      // Try server first
      try {
        const resp = await fetch(`/api/stats/${encodeURIComponent(id)}`);
        if (resp.ok) {
          const json = await resp.json();
          if (!mounted) return;
          setValue(Number(json.value) || start);

          // increment on server to make it 'real' for subsequent visitors
          await fetch(`/api/stats/${encodeURIComponent(id)}/increment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ by: step }),
            credentials: "same-origin",
          });
          return;
        }
      } catch (e) {
        // server not available, fall back to local
      }

      // Fallback local behavior: similar to previous logic
      try {
        const stored = localStorage.getItem(`stats:${id}`);
        const startValue = stored ? parseInt(stored, 10) : start;
        const next = startValue + step;
        if (mounted) setValue(next);
        localStorage.setItem(`stats:${id}`, String(next));
      } catch (e) {
        if (mounted) setValue(start);
      }
    }

    fetchAndIncrement();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // animate display to value with requestAnimationFrame for a smooth count-up
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 900; // ms
    const initial = display;
    const delta = value - initial;

    function step(ts: number) {
      if (!startTimestamp) startTimestamp = ts;
      const progress = Math.min((ts - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(initial + delta * eased);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    }

    // only animate if value changed
    if (delta !== 0) {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(step);
    } else {
      setDisplay(value);
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="space-y-1">
      <div className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
        {display.toLocaleString()}
      </div>
      {label && <div className="text-muted-foreground">{label}</div>}

      {/* Optional small delta indicator (e.g. +32 today) */}
      {typeof delta !== "undefined" && (
        // keep backwards compatibility — render only if caller passes delta prop
        <div className="text-sm text-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary transform -rotate-45"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">+{delta.toLocaleString()} today</span>
        </div>
      )}
    </div>
  );
}
