import { useRef, type ReactNode, Children } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * SpatialAssembly — children start scattered in 3D space and assemble into final layout.
 *
 * Each child floats at a random Z-depth with rotation and offset, like papers floating
 * in zero gravity. On scroll trigger, they all settle into their grid positions with
 * spring physics. The parent container has perspective for true 3D depth.
 */

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function SpatialAssembly({
  children,
  className = "",
  stagger = 0.08,
  intensity = 1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** Delay between each child settling */
  stagger?: number;
  /** How scattered the initial state is (0.5 = subtle, 1 = normal, 2 = extreme) */
  intensity?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const childArray = Children.toArray(children);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
    >
      {childArray.map((child, i) => {
        const seed = i + 1;
        const rx = (seededRandom(seed * 1) - 0.5) * 30 * intensity;
        const ry = (seededRandom(seed * 2) - 0.5) * 25 * intensity;
        const rz = (seededRandom(seed * 3) - 0.5) * 15 * intensity;
        const tx = (seededRandom(seed * 4) - 0.5) * 100 * intensity;
        const ty = (seededRandom(seed * 5) - 0.5) * 80 * intensity;
        const tz = (seededRandom(seed * 6) - 0.5) * 300 * intensity;

        return (
          <motion.div
            key={i}
            style={{ transformStyle: "preserve-3d" }}
            initial={{
              rotateX: rx,
              rotateY: ry,
              rotateZ: rz,
              x: tx,
              y: ty,
              z: tz,
              opacity: 0,
              scale: 0.75,
            }}
            animate={
              isInView
                ? { rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 0, z: 0, opacity: 1, scale: 1 }
                : { rotateX: rx, rotateY: ry, rotateZ: rz, x: tx, y: ty, z: tz, opacity: 0, scale: 0.75 }
            }
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 14,
              mass: 1,
              delay: i * stagger,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
