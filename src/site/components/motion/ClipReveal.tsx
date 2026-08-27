import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * ClipReveal — reveals children via a dramatic polygon clip-path wipe.
 *
 * Uses polygon-based clip path for a sharp, angular reveal that's visually
 * unmistakable (not a fade). The shape starts as a thin sliver and expands
 * to full coverage.
 */
export default function ClipReveal({
  children,
  className = "",
  direction = "left",
  delay = 0,
  duration = 1.0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "top" | "bottom" | "diagonal" | "diamond";
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Polygon-based clips for dramatic, non-rectangular reveals
  const clips = {
    left: {
      hidden: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    right: {
      hidden: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
      visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    top: {
      hidden: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    bottom: {
      hidden: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    diagonal: {
      hidden: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    diamond: {
      hidden: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
      visible: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    },
  };

  const clip = clips[direction];

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      <motion.div
        style={{ willChange: "clip-path" }}
        initial={{ clipPath: clip.hidden }}
        animate={isInView ? { clipPath: clip.visible } : { clipPath: clip.hidden }}
        transition={{
          duration,
          delay,
          ease: [0.65, 0, 0.35, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
