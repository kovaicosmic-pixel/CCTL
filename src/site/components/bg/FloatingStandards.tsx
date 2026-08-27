import { useReducedMotion } from "framer-motion";

/**
 * FloatingStandards — EMC standard labels scattered inside a section as bg decoration.
 *
 * Matches cosmictrf.in: small rounded pill labels positioned at fixed spots
 * within the section. Very subtle drift (2-3px), barely noticeable.
 * They stay INSIDE their parent section and scroll with it.
 *
 * Usage: wrap the section content with position:relative and place this alongside.
 */

const ALL_STANDARDS = [
  "CISPR 25",
  "MIL-STD 461",
  "IEC 61000",
  "ISO 11452",
  "EN 55032",
  "DO-160G",
  "NABL ✓",
  "ISO 17025",
  "MIL-STD 704",
  "RDSO",
  "ETSI STD",
  "AIS 004",
  "IEC 61000-4-2",
  "CISPR 35",
  "✓ EMC",
  "RF Test",
  "Pre-Comp",
  "EN 50121",
];

// Fixed positions — all within the first viewport height (0-90% of viewport)
// so they're visible when the section first appears
const SPOTS = [
  { x: 3, y: 5 },
  { x: 85, y: 3 },
  { x: 4, y: 25 },
  { x: 90, y: 22 },
  { x: 2, y: 45 },
  { x: 88, y: 42 },
  { x: 8, y: 65 },
  { x: 82, y: 62 },
  { x: 20, y: 8 },
  { x: 92, y: 10 },
  { x: 12, y: 38 },
  { x: 86, y: 35 },
  { x: 5, y: 55 },
  { x: 80, y: 52 },
  { x: 18, y: 72 },
  { x: 75, y: 70 },
];

export default function FloatingStandards({
  className = "",
  count = 8,
  opacity = 0.4,
  theme = "dark",
}: {
  className?: string;
  count?: number;
  opacity?: number;
  /** "dark" = light text pills on dark bg, "light" = dark text pills on light bg */
  theme?: "dark" | "light";
}) {
  const reducedMotion = useReducedMotion();
  const items = SPOTS.slice(0, count);

  const pillStyle = theme === "dark"
    ? {
        color: "rgba(26, 108, 245, 0.9)",
        border: "1px solid rgba(26, 108, 245, 0.3)",
        background: "rgba(26, 108, 245, 0.1)",
        boxShadow: "0 0 12px -3px rgba(26, 108, 245, 0.2)",
      }
    : {
        color: "#1a6cf5",
        border: "1px solid rgba(26, 108, 245, 0.25)",
        background: "rgba(26, 108, 245, 0.08)",
        boxShadow: "0 2px 10px -3px rgba(26, 108, 245, 0.2)",
      };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-screen overflow-visible ${className}`}
      style={{ opacity }}
    >
      {items.map((spot, i) => (
        <span
          key={i}
          className="absolute inline-flex items-center rounded-full px-3 py-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em]"
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            ...pillStyle,
            animation: reducedMotion
              ? undefined
              : `floating-label ${18 + (i % 4) * 5}s ease-in-out infinite`,
            animationDelay: `${-(i * 2.8)}s`,
          }}
        >
          {ALL_STANDARDS[i % ALL_STANDARDS.length]}
        </span>
      ))}
    </div>
  );
}
