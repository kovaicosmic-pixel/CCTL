import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WORDS = ["MEASURING", "TESTING", "CERTIFYING"];
const STORAGE_KEY = "cctl-calibrated";
const DURATION = 800;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function alreadyCalibrated() {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

/**
 * MSM-1 — a brief, once-per-session intro on Home only. Reads as a signal-calibration sequence
 * (rotating words + a filling meter), not a generic percentage loader. Gated on raw
 * `matchMedia`/`sessionStorage` reads at mount rather than framer's `useReducedMotion` hook, so
 * there is no race where the hook hasn't resolved yet and the overlay flashes anyway.
 */
export default function CalibrationLoader() {
  const [visible, setVisible] = useState(() => !prefersReducedMotion() && !alreadyCalibrated());
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round(t * 100));
      setWordIndex(Math.min(WORDS.length - 1, Math.floor(t * WORDS.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setVisible(false), 100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  useEffect(() => {
    if (visible) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* sessionStorage unavailable — the loader just runs again next visit, harmless */
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-space-950 pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-cyan-glow">
            {WORDS[wordIndex]}
          </span>
          <div className="mt-6 h-px w-40 overflow-hidden bg-line-strong/10 sm:w-56">
            <div
              className="h-full bg-gradient-to-r from-cyan-glow to-violet-glow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
