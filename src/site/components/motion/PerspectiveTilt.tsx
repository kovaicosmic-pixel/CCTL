import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * PerspectiveTilt — dramatic 3D rotateX entry that unfolds toward the viewer.
 *
 * Content starts heavily tilted back in 3D space (like a billboard falling toward you)
 * and settles flat. The perspective is applied via inline style to guarantee it works.
 */
export default function PerspectiveTilt({
  children,
  className = "",
  delay = 0,
  duration = 1.2,
  tiltDegrees = 40,
  translateY = 80,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  tiltDegrees?: number;
  translateY?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ perspective: "1000px", perspectiveOrigin: "center bottom" }}>
      <motion.div
        className={className}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
        initial={{
          rotateX: tiltDegrees,
          y: translateY,
          opacity: 0,
          scale: 0.85,
        }}
        animate={
          isInView
            ? { rotateX: 0, y: 0, opacity: 1, scale: 1 }
            : { rotateX: tiltDegrees, y: translateY, opacity: 0, scale: 0.85 }
        }
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.4, delay },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
