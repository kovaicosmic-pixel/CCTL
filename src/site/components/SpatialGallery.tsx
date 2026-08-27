import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import GrainOverlay from "./motion/GrainOverlay";

/**
 * Interactive gallery: one large stage plane plus a filmstrip of physical thumbnails.
 * Selecting a frame wipes the new photograph across the stage instead of cross-fading.
 */
export default function SpatialGallery({ images, label }: { images: string[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();
  const active = images[index] ?? images[0] ?? "";

  function go(next: number) {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_0.6fr]">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line-strong/10 bg-space-900"
        style={reduced ? undefined : { perspective: 1400 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={active}
            src={active}
            alt={`${label} — frame ${index + 1}`}
            initial={
              reduced
                ? undefined
                : {
                    clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
                    scale: 1.12,
                  }
            }
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-space-950/70 via-transparent to-transparent" />
        <GrainOverlay opacity={0.045} />
        <div className="pointer-events-none absolute bottom-5 left-6 flex items-baseline gap-3">
          <span className="font-heading text-3xl font-black text-ink-100">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ink-300">
            / {String(images.length).padStart(2, "0")} — {label}
          </span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show frame ${i + 1}`}
            aria-current={i === index}
            className="group relative w-28 shrink-0 overflow-hidden rounded-xl border border-line-strong/10 lg:w-full"
          >
            <motion.img
              src={src}
              alt=""
              loading="lazy"
              animate={{ opacity: i === index ? 1 : 0.42, scale: i === index ? 1.04 : 1 }}
              whileHover={{ opacity: 1, scale: 1.08 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/3] w-full object-cover"
            />
            <motion.span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cyan-glow"
              initial={false}
              animate={{ scaleX: i === index ? 1 : 0 }}
              transition={{ duration: 0.45 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
