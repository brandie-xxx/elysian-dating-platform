import StatsCounter from "../StatsCounter";

export default function HeroStats() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="space-y-2">
        <StatsCounter
          id="success-stories"
          start={10000}
          step={5}
          label="Success Stories"
          delta={32}
        />
      </div>
      <div className="space-y-2">
        <StatsCounter
          id="free-forever"
          start={100}
          step={1}
          label="Free Forever (%)"
        />
      </div>
      <div className="space-y-2">
        <StatsCounter id="safety" start={24} step={0} label="Hours Support" />
      </div>
    </div>
  );
}
