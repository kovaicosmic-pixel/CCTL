import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem, staggerItem3D } from "./variants";

export function StaggerGroup({
  children,
  className,
  amount = 0.15,
  perspective = false,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  /** Gives the grid a 3D stage so 3D StaggerItems can tilt up into place. */
  perspective?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerContainer}
      style={perspective ? { perspective: 1400 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  hover = false,
  threeD = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  /** Enters tilted back (rotateX + z) instead of a flat y-fade — pair with StaggerGroup perspective. */
  threeD?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={threeD ? staggerItem3D : staggerItem}
      style={threeD ? { transformStyle: "preserve-3d" } : undefined}
      whileHover={
        hover ? { y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } } : undefined
      }
    >
      {children}
    </motion.div>
  );
}
