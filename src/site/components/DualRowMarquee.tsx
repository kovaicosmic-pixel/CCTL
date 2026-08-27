import { useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useSectionProgress } from "../hooks/useSectionProgress";
import { clientLogos } from "../data/content";

/** A small per-tile Y offset (a smooth sine wave, not a random jitter) so the row reads as a
 *  drifting baseline rather than a perfectly ruled shelf of logos. */
function baselineOffset(i: number) {
  return Math.round(Math.sin(i * 0.7) * 7);
}

function Row({
  logos,
  x,
  reverse,
}: {
  logos: string[];
  x: MotionValue<number>;
  reverse?: boolean;
}) {
  const loop = reverse ? [...logos].reverse() : logos;
  return (
    <motion.div className="flex w-max items-center gap-4" style={{ x }}>
      {[...loop, ...loop, ...loop].map((name, i) => (
        <div
          key={i}
          style={{ transform: `translateY(${baselineOffset(i)}px)` }}
          className="flex h-14 shrink-0 items-center gap-3 rounded-xl border border-line-strong/10 bg-line-strong/[0.03] px-6 transition-colors hover:border-cyan-glow/40"
        >
          <span className="h-1 w-1 rounded-full bg-cyan-glow/70" />
          <span className="font-heading whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em] text-ink-300">
            {name}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function DualRowMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useSectionProgress(ref);
  const xRight = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, -520]);
  const xLeft = useTransform(scrollYProgress, [0, 1], reduced ? [-400, -400] : [-460, 20]);

  const half = Math.ceil(clientLogos.length / 2);
  const rowA = clientLogos.slice(0, half);
  const rowB = clientLogos.slice(half);

  return (
    <div ref={ref} className="relative space-y-4 overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-space-950 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-space-950 to-transparent sm:w-28" />
      <Row logos={rowA} x={xRight} />
      <Row logos={rowB} x={xLeft} reverse />
    </div>
  );
}
