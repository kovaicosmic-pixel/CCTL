import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useSectionProgress } from "../../hooks/useSectionProgress";

function Photo({ src, tilt, z }: { src: string; tilt: number; z: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      style={reduced ? undefined : { rotate: tilt, z, transformStyle: "preserve-3d" }}
      whileHover={reduced ? undefined : { rotate: 0, scale: 1.04, z: z + 30 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="overflow-hidden rounded-2xl border border-line-strong/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
    >
      <img src={src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
    </motion.div>
  );
}

export default function ParallaxGallery({ colA, colB }: { colA: string[]; colB: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useSectionProgress(ref);
  const yA = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [10, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -130]);
  // The giant word sits at a middle depth — nearer photos pass in front of it, farther
  // photos sit behind it, so it reads as embedded in the scene rather than a flat label.
  const typeZ = -30;

  return (
    <div ref={ref} className="relative" style={reduced ? undefined : { perspective: 1800 }}>
      <div className="relative" style={reduced ? undefined : { transformStyle: "preserve-3d" }}>
        {!reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span
              className="font-heading select-none whitespace-nowrap font-black text-line-strong/[0.05]"
              style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)", transform: `translateZ(${typeZ}px)` }}
            >
              INSIDE THE LAB
            </span>
          </div>
        )}

        <div
          className="relative grid grid-cols-2 gap-4 sm:gap-6"
          style={reduced ? undefined : { transformStyle: "preserve-3d" }}
        >
          <motion.div
            style={reduced ? undefined : { y: yA, transformStyle: "preserve-3d" }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            {colA.map((src, i) => (
              <Photo
                key={src}
                src={src}
                tilt={i % 2 === 0 ? -1.4 : 1.1}
                z={i % 2 === 0 ? 60 : -70}
              />
            ))}
          </motion.div>
          <motion.div
            style={reduced ? undefined : { y: yB, transformStyle: "preserve-3d" }}
            className="mt-10 flex flex-col gap-4 sm:gap-6 sm:mt-16"
          >
            {colB.map((src, i) => (
              <Photo
                key={src}
                src={src}
                tilt={i % 2 === 0 ? 1.6 : -1.2}
                z={i % 2 === 0 ? -70 : 60}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
