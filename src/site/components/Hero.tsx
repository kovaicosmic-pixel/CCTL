import {
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useSceneProgress } from "../hooks/useSceneProgress";
import ChamberFrames from "./lab/ChamberFrames";
import { useEffect, useState } from "react";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { ref, progress: rawProgress } = useSceneProgress<HTMLDivElement>();
  /* Raw scroll progress updates in discrete per-frame jumps. Spring-smooth it
     (same technique as the "What we deliver" scene) before ChamberFrames
     seeks the video against it — the seek itself still costs ~30-47ms, but a
     smoothed target reads as fluid motion catching up rather than a series
     of steppy jumps landing on video frames. useSpring only tracks a
     *MotionValue* source reactively, not a plain number that changes across
     renders, so the raw number is bridged into one first. */
  const rawProgressMV = useMotionValue(0);
  useEffect(() => {
    rawProgressMV.set(rawProgress);
  }, [rawProgress, rawProgressMV]);
  const smoothProgress = useSpring(rawProgressMV, { stiffness: 170, damping: 26, mass: 0.4 });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (latest) => setProgress(latest));

  // Emit a global event with the current progress so listeners (Navbar) can
  // decide whether the hero scene is active. Navbar will make itself
  // transparent while progress < 1 and reset after the scene completes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("home-hero-complete", { detail: { progress } }));
    }
  }, [progress]);

  if (reducedMotion) {
    return (
      <section ref={ref} className="relative min-h-screen overflow-hidden bg-space-950">
        <h1 className="sr-only">EMI/EMC Testing Laboratory in Coimbatore &amp; Bangalore, India</h1>
        <img
          src="/images/chamber.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
          fetchPriority="high"
          decoding="async"
        />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-space-950"
      style={{ height: isDesktop ? "160vh" : "220vh" }}
      aria-label="Enter the lab"
    >
      <h1 className="sr-only">EMI/EMC Testing Laboratory in Coimbatore &amp; Bangalore, India</h1>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-space-950">
        <img
          src="/images/chamber.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
          fetchPriority="high"
          decoding="async"
        />
        <ChamberFrames progress={progress} className="relative z-10 block h-full w-full" />
      </div>
    </section>
  );
}
