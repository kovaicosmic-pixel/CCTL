import { useReducedMotion } from "framer-motion";

/**
 * Animated gradient orbs — large blurred blobs of color that drift slowly
 * behind content, giving depth and atmosphere to dark sections.
 *
 * Pure CSS animation (no JS runtime cost). Each orb is a radial-gradient
 * div with a large blur, positioned absolutely and animated with keyframes.
 *
 * The orbs use the brand palette: cyan, violet, magenta at very low opacity
 * so they tint the background without overwhelming content.
 */
export default function GradientOrbs({
  className = "",
  variant = "default",
}: {
  className?: string;
  /** "default" = 3 orbs (cyan/violet/magenta), "subtle" = 2 orbs (cyan/violet only, lower opacity) */
  variant?: "default" | "subtle" | "intense";
}) {
  const reducedMotion = useReducedMotion();

  const configs = {
    default: [
      {
        color: "rgba(26, 108, 245, 0.18)",
        size: "40rem",
        position: "top-[-10%] left-[-8%]",
        animation: "orb-drift-1",
        delay: "0s",
      },
      {
        color: "rgba(109, 78, 240, 0.14)",
        size: "35rem",
        position: "bottom-[-5%] right-[-10%]",
        animation: "orb-drift-2",
        delay: "-5s",
      },
      {
        color: "rgba(214, 56, 156, 0.08)",
        size: "28rem",
        position: "top-[40%] right-[20%]",
        animation: "orb-drift-3",
        delay: "-10s",
      },
    ],
    subtle: [
      {
        color: "rgba(26, 108, 245, 0.12)",
        size: "34rem",
        position: "top-[-15%] left-[10%]",
        animation: "orb-drift-1",
        delay: "0s",
      },
      {
        color: "rgba(109, 78, 240, 0.1)",
        size: "30rem",
        position: "bottom-[0%] right-[-5%]",
        animation: "orb-drift-2",
        delay: "-7s",
      },
    ],
    intense: [
      {
        color: "rgba(26, 108, 245, 0.25)",
        size: "45rem",
        position: "top-[-12%] left-[-10%]",
        animation: "orb-drift-1",
        delay: "0s",
      },
      {
        color: "rgba(109, 78, 240, 0.2)",
        size: "38rem",
        position: "bottom-[-8%] right-[-12%]",
        animation: "orb-drift-2",
        delay: "-4s",
      },
      {
        color: "rgba(214, 56, 156, 0.12)",
        size: "32rem",
        position: "top-[30%] left-[50%]",
        animation: "orb-drift-3",
        delay: "-9s",
      },
      {
        color: "rgba(26, 108, 245, 0.1)",
        size: "26rem",
        position: "bottom-[20%] left-[-5%]",
        animation: "orb-drift-1",
        delay: "-14s",
      },
    ],
  };

  const orbs = configs[variant];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute ${orb.position} rounded-full`}
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: reducedMotion ? "none" : `${orb.animation} 20s ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
