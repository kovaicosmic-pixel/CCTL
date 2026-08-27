import { useRef, type ReactNode, Children } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * DirectionalConverge — children arrive from different directions simultaneously.
 *
 * Each child starts offset in a unique direction (top-left, bottom-right, etc.)
 * and they all converge to their final positions at the same time. Not staggered —
 * simultaneous from scattered origins.
 */

const ORIGINS = [
  { x: -120, y: -80, rotate: -8 },   // top-left
  { x: 120, y: -60, rotate: 6 },     // top-right
  { x: -100, y: 80, rotate: 5 },     // bottom-left
  { x: 120, y: 100, rotate: -7 },    // bottom-right
  { x: 0, y: -120, rotate: -4 },     // top-center
  { x: 0, y: 120, rotate: 4 },       // bottom-center
  { x: -160, y: 0, rotate: -6 },     // far-left
  { x: 160, y: 0, rotate: 6 },       // far-right
];

export default function DirectionalConverge({
  children,
  className = "",
  duration = 1.0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const childArray = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => {
        const origin = ORIGINS[i % ORIGINS.length];
        return (
          <motion.div
            key={i}
            initial={{
              x: origin.x,
              y: origin.y,
              rotate: origin.rotate,
              opacity: 0,
              scale: 0.6,
              filter: "blur(8px)",
            }}
            animate={
              isInView
                ? { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, filter: "blur(0px)" }
                : { x: origin.x, y: origin.y, rotate: origin.rotate, opacity: 0, scale: 0.6, filter: "blur(8px)" }
            }
            transition={{
              duration,
              ease: [0.22, 1, 0.36, 1],
              filter: { duration: duration * 0.6 },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
