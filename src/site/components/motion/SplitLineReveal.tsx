import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * SplitLineReveal — heading lines slide in from alternating directions.
 *
 * Splits a heading into lines and animates each from opposite sides:
 * line 1 from left, line 2 from right, line 3 from left, etc.
 * Combined with a slight vertical offset for a cascading feel.
 *
 * Use for: section headings, hero text, impactful statements.
 */
export default function SplitLineReveal({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.12,
  duration = 0.8,
  as: Tag = "h2",
  once = true,
}: {
  /** Array of text lines to reveal */
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Delay between each line */
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {lines.map((line, i) => {
        const fromLeft = i % 2 === 0;
        return (
          <span key={i} className={`block overflow-hidden ${lineClassName}`}>
            <motion.span
              className="block"
              initial={{
                x: fromLeft ? "-110%" : "110%",
                opacity: 0,
                rotateZ: fromLeft ? -2 : 2,
              }}
              animate={
                isInView
                  ? { x: "0%", opacity: 1, rotateZ: 0 }
                  : { x: fromLeft ? "-110%" : "110%", opacity: 0, rotateZ: fromLeft ? -2 : 2 }
              }
              transition={{
                duration,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
