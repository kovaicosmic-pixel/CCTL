import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * Pointer-tracked perspective plane. The surface leans toward the cursor and its
 * children can be pushed forward with translateZ so a photo reads as a physical sheet.
 */
export default function TiltPlane({
  children,
  className = "",
  max = 9,
  lift = 26,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 180, damping: 20, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const glareX = useTransform(sx, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(sy, [-0.5, 0.5], [20, 80]);
  const glareBg = useTransform(
    [glareX, glareY] as never,
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, rgba(255,255,255,0.14), transparent 60%)`,
  );

  function move(e: MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function leave() {
    px.set(0);
    py.set(0);
  }

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={leave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ z: lift }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}
