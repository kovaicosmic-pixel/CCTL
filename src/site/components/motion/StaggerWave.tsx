import { useRef, type ReactNode, Children } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * StaggerWave — children enter with a wave/ripple pattern from a configurable origin.
 *
 * Unlike simple stagger (left-to-right), this calculates delay based on distance
 * from an origin point, creating a radial ripple or directional wave across a grid.
 */
export default function StaggerWave({
  children,
  className = "",
  origin = "center",
  baseDelay = 0,
  waveSpeed = 0.08,
  columns = 3,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** Origin of the wave: "center" = ripple from middle, "top-left", "bottom-right", etc. */
  origin?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  baseDelay?: number;
  /** Seconds between each wave ring */
  waveSpeed?: number;
  /** Grid column count (for calculating 2D position) */
  columns?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const childArray = Children.toArray(children);
  const rows = Math.ceil(childArray.length / columns);

  // Calculate origin coordinates
  const origins: Record<string, { col: number; row: number }> = {
    "center": { col: (columns - 1) / 2, row: (rows - 1) / 2 },
    "top-left": { col: 0, row: 0 },
    "top-right": { col: columns - 1, row: 0 },
    "bottom-left": { col: 0, row: rows - 1 },
    "bottom-right": { col: columns - 1, row: rows - 1 },
  };

  const o = origins[origin];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        // Distance from origin determines delay
        const distance = Math.sqrt((col - o.col) ** 2 + (row - o.row) ** 2);
        const delay = baseDelay + distance * waveSpeed;

        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0.5,
              y: 40,
              rotateX: 20,
            }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, y: 0, rotateX: 0 }
                : { opacity: 0, scale: 0.5, y: 40, rotateX: 20 }
            }
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              delay,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
