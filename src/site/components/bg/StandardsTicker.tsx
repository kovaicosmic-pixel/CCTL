/**
 * Standards/certification marquee ticker — a continuous scrolling ribbon of
 * EMC standards and accreditations. Gives immediate technical credibility
 * (like cosmictrf.in's top ticker).
 *
 * Pure CSS animation, duplicated content for seamless loop.
 */
export default function StandardsTicker({
  className = "",
  speed = "slow",
}: {
  className?: string;
  /** "slow" = 50s, "normal" = 35s, "fast" = 22s */
  speed?: "slow" | "normal" | "fast";
}) {
  const standards = [
    { label: "CISPR 25", icon: "⚡" },
    { label: "MIL-STD 461", icon: "🎖️" },
    { label: "ISO 11452", icon: "📡" },
    { label: "IEC 61000", icon: "🛡️" },
    { label: "RTCA DO-160", icon: "✈️" },
    { label: "NABL ✓", icon: null },
    { label: "ISO 17025", icon: "✓" },
    { label: "EN 55032", icon: "⚡" },
    { label: "MIL-STD 704", icon: "🎖️" },
    { label: "CISPR 35", icon: "📡" },
    { label: "AIS 004", icon: "🔬" },
    { label: "ETSI STD", icon: "📡" },
    { label: "RDSO", icon: "🚂" },
    { label: "EN 50121", icon: "🛡️" },
    { label: "DO-160G", icon: "✈️" },
    { label: "EMC", icon: "⚡" },
    { label: "RF Test", icon: "📡" },
    { label: "Pre-Comp", icon: "🔬" },
  ];

  const durations = { slow: "50s", normal: "35s", fast: "22s" };

  const renderItems = () =>
    standards.map((s, i) => (
      <span
        key={i}
        className="mx-4 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40 sm:mx-6 sm:text-[0.7rem]"
      >
        {s.icon && <span className="text-[0.75rem]">{s.icon}</span>}
        {s.label}
      </span>
    ));

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border-b border-white/[0.04] bg-space-950/80 py-2.5 backdrop-blur-sm ${className}`}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-space-950 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-space-950 to-transparent sm:w-24" />

      <div
        className="standards-ticker-track flex w-max"
        style={{ animationDuration: durations[speed] }}
      >
        {/* Duplicate content for seamless loop */}
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
}
