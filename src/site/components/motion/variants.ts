import type { Variants } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

/** Panels tilt up out of the "floor" into facing position — for perspective-container grids only. */
export const staggerItem3D: Variants = {
  hidden: { opacity: 0, rotateX: 24, y: 40, z: -90 },
  show: { opacity: 1, rotateX: 0, y: 0, z: 0, transition: { duration: 0.7, ease: easeOut } },
};

/** Grows in from near-zero rather than sliding up — pair with a Tailwind `origin-*` class on the
 *  same element so it reads as scaling out of a specific corner, not just fading larger in place. */
export const scaleInCorner: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easeOut } },
};
