import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A pinned scene whose content travels sideways as the page scrolls vertically.
 * Vertical distance is converted into lateral camera travel.
 */
export default function HorizontalRail({
  children,
  heightVh = 260,
  travel = "-62%",
}: {
  children: ReactNode;
  heightVh?: number;
  travel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["2%", travel]);
  const x = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.5 });

  if (reduced) {
    return <div className="flex gap-6 overflow-x-auto px-5 pb-4">{children}</div>;
  }

  return (
    <div ref={ref} style={{ height: `${heightVh}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 pl-6 pr-[30vw] lg:pl-16">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
