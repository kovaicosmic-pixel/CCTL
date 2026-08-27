import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * KineticWords — each word in a sentence enters independently with spring physics.
 *
 * Words arrive from different vertical offsets with rotation, settling into place
 * with a spring bounce. Creates a "words assembling themselves" effect.
 */
export default function KineticWords({
  text,
  className = "",
  as: Tag = "h2",
  stagger = 0.06,
  once = true,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref as any} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.3em] inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{
              y: 80 + (i % 3) * 20,
              rotateZ: (i % 2 === 0 ? -1 : 1) * (5 + (i % 4) * 3),
              opacity: 0,
              scale: 0.7,
            }}
            animate={
              isInView
                ? { y: 0, rotateZ: 0, opacity: 1, scale: 1 }
                : { y: 80 + (i % 3) * 20, rotateZ: (i % 2 === 0 ? -1 : 1) * (5 + (i % 4) * 3), opacity: 0, scale: 0.7 }
            }
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 14,
              mass: 0.6,
              delay: i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
