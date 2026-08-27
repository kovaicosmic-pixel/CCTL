import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function SignalPing({
  children,
  className = "",
  rounded = "rounded-full",
}: {
  children: ReactNode;
  className?: string;
  rounded?: string;
}) {
  const [pingKey, setPingKey] = useState(0);
  const reduced = useReducedMotion();

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => !reduced && setPingKey((k) => k + 1)}
    >
      {children}
      {!reduced && pingKey > 0 && (
        <motion.span
          key={pingKey}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 border border-cyan-glow ${rounded}`}
          initial={{ opacity: 0.7, scale: 0.85 }}
          animate={{ opacity: 0, scale: 1.35 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
