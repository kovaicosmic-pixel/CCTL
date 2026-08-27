import { useRef, type ReactNode, Children } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * SpringPop — each child pops in from scale 0 with a bouncy spring,
 * staggered across the container in a wave.
 *
 * Uses individual useInView tracking and index-based delays for
 * guaranteed staggered pop regardless of render timing.
 */
export function SpringPopContainer({
  children,
  className = "",
  stagger = 0.1,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -12, y: 30 }}
          animate={
            isInView
              ? { scale: 1, opacity: 1, rotate: 0, y: 0 }
              : { scale: 0, opacity: 0, rotate: -12, y: 30 }
          }
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            mass: 0.8,
            delay: i * stagger,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

export function SpringPopItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
