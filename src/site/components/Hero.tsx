import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useSceneProgress } from "../hooks/useSceneProgress";
import ChamberFrames from "./lab/ChamberFrames";
import { useEffect } from "react";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();

  // Emit a global event with the current progress so listeners (Navbar) can
  // decide whether the hero scene is active. Navbar will make itself
  // transparent while progress < 1 and reset after the scene completes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("home-hero-complete", { detail: { progress } }));
    }
  }, [progress]);

  if (reduced) {
    return (
      <section ref={ref} className="relative min-h-screen overflow-hidden bg-space-950">
        <h1 className="sr-only">EMI/EMC Testing Laboratory in Coimbatore &amp; Bangalore, India</h1>
        <img
          src="/images/chamber.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative bg-space-950"
      style={{ height: "160vh" }}
      aria-label="Enter the lab"
    >
      <h1 className="sr-only">EMI/EMC Testing Laboratory in Coimbatore &amp; Bangalore, India</h1>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-space-950">
        <img
          src="/images/chamber.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <ChamberFrames progress={progress} className="relative z-10 block h-full w-full" />
      </div>
    </section>
  );
}
