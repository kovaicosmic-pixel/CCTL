import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useIsDesktop } from "../../hooks/useIsDesktop";

/**
 * A pinned scene whose content travels sideways as the page scrolls vertically.
 * Vertical distance is converted into lateral camera travel.
 */
export default function HorizontalRail({
  children,
  heightVh = 260,
  mobileHeightVh,
  travel = "-62%",
}: {
  children: ReactNode;
  heightVh?: number;
  /** Below the desktop breakpoint, mobile only sees ~1 card at a time, so
   * the same scroll distance as desktop reads as disproportionately long
   * for the payoff — this lets it shrink without touching the desktop value. */
  mobileHeightVh?: number;
  travel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const effectiveHeightVh = isDesktop ? heightVh : (mobileHeightVh ?? heightVh);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["2%", travel]);
  const x = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.5 });

  if (reduced) {
    return <div className="flex gap-6 overflow-x-auto px-5 pb-4">{children}</div>;
  }

  return (
    <div ref={ref} style={{ height: `${effectiveHeightVh}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-6 pr-[30vw] lg:pl-16">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
