import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "./variants";

export default function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
