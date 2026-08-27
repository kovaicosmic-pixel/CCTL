import { useReducedMotion } from "framer-motion";

/**
 * FloatingIcons — Service icons in soft pastel circles, gently floating.
 *
 * Each icon sits in a colored circle that bobs and drifts continuously.
 * The positioning is done via a wrapper (no transform), so the CSS animation
 * has full control over the movement.
 */

const ICONS = [
  { src: "/images/automotive_icon.png", bg: "rgba(26, 108, 245, 0.12)" },
  { src: "/images/defense_icon.png", bg: "rgba(109, 78, 240, 0.12)" },
  { src: "/images/railway_icon.png", bg: "rgba(245, 158, 11, 0.12)" },
  { src: "/images/telecom_icon.png", bg: "rgba(16, 185, 129, 0.12)" },
  { src: "/images/mil_aero_icon.png", bg: "rgba(214, 56, 156, 0.1)" },
  { src: "/images/civilian_icon.png", bg: "rgba(26, 108, 245, 0.1)" },
];

const POSITIONS = [
  { x: 3, y: 10, size: 62 },
  { x: 86, y: 8, size: 56 },
  { x: 4, y: 52, size: 50 },
  { x: 91, y: 55, size: 58 },
  { x: 10, y: 83, size: 54 },
  { x: 82, y: 82, size: 60 },
  { x: 22, y: 5, size: 48 },
  { x: 72, y: 92, size: 50 },
  { x: 93, y: 28, size: 52 },
  { x: 6, y: 30, size: 46 },
];

export default function FloatingIcons({
  className = "",
  count = 8,
  theme = "light",
}: {
  className?: string;
  count?: number;
  theme?: "light" | "dark";
}) {
  const reducedMotion = useReducedMotion();
  const items = POSITIONS.slice(0, count);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[15] overflow-hidden ${className}`}
    >
      {items.map((pos, i) => {
        const icon = ICONS[i % ICONS.length];
        const circleSize = pos.size;
        const iconSize = circleSize * 0.48;
        const bgColor = theme === "light" ? icon.bg : icon.bg.replace(/[\d.]+\)$/, "0.07)");
        const containerOpacity = theme === "light" ? 0.75 : 0.45;

        return (
          /* Outer wrapper handles position only — no transform */
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {/* Inner element handles animation — CSS animation controls transform freely */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                background: bgColor,
                opacity: containerOpacity,
                animation: reducedMotion
                  ? undefined
                  : `floating-icon ${14 + (i % 5) * 4}s ease-in-out infinite`,
                animationDelay: `${-(i * 2.5)}s`,
              }}
            >
              <img
                src={icon.src}
                alt=""
                className="nav-logo"
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
