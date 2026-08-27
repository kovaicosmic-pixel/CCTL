import { useReducedMotion } from "framer-motion";

/**
 * RadialPulse — Expanding rings of light that fade outward, like EMI field emissions.
 *
 * Multiple concentric circles expand from fixed points and fade out —
 * like radar pings or electromagnetic wave propagation.
 * Positioned at configurable points across the section.
 */
export default function RadialPulse({
  className = "",
  sources = 3,
  color = "rgba(26, 108, 245, 0.15)",
}: {
  className?: string;
  /** Number of emission sources */
  sources?: number;
  color?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  // Deterministic positions for pulse sources
  const positions = [
    { x: "15%", y: "25%" },
    { x: "75%", y: "60%" },
    { x: "45%", y: "80%" },
    { x: "85%", y: "20%" },
    { x: "25%", y: "65%" },
  ].slice(0, sources);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
        >
          {/* 3 rings per source, staggered timing */}
          {[0, 1, 2].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 rounded-full"
              style={{
                width: "300px",
                height: "300px",
                marginLeft: "-150px",
                marginTop: "-150px",
                border: `1px solid ${color}`,
                animation: `radial-emit ${4 + i * 0.5}s ease-out infinite`,
                animationDelay: `${ring * 1.3 + i * 0.8}s`,
                opacity: 0,
              }}
            />
          ))}
          {/* Core dot that stays */}
          <div
            className="absolute rounded-full"
            style={{
              width: "4px",
              height: "4px",
              marginLeft: "-2px",
              marginTop: "-2px",
              background: color.replace(/[\d.]+\)$/, "0.6)"),
              boxShadow: `0 0 8px ${color}, 0 0 20px ${color.replace(/[\d.]+\)$/, "0.3)")}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
