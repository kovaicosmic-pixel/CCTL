import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Char({
  ch,
  progress,
  start,
  end,
}: {
  ch: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return <motion.span style={{ opacity }}>{ch === " " ? " " : ch}</motion.span>;
}

/** Scoped to one short sentence only — real DOM weight and a screen-reader hazard at paragraph scale. */
export default function CharacterReveal({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const chars = text.split("");
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {chars.map((ch, i) =>
          // Real whitespace text nodes (not spans) so the browser still has a place to
          // break the line — packing every character into an element with none leaves
          // the sentence with zero break opportunities and it overflows the page.
          ch === " " ? (
            " "
          ) : (
            <Char
              key={i}
              ch={ch}
              progress={scrollYProgress}
              start={i / chars.length}
              end={(i + 1) / chars.length}
            />
          ),
        )}
      </span>
    </p>
  );
}
