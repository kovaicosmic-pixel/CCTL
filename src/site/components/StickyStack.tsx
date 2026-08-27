import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SignalPing from "./motion/SignalPing";
import DomainIcon from "./DomainIcon";
import type { ServiceDomain } from "../data/content";

function StackCard({
  service,
  index,
  isLast,
}: {
  service: ServiceDomain;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The card sits flat and close while it's "current," then tilts back and recedes into
  // the deck — a real perspective card, not a flat rectangle that just scales down.
  const rotateX = useTransform(scrollYProgress, [0.5, 1], reduced ? [0, 0] : [0, -14]);
  const z = useTransform(scrollYProgress, [0.5, 1], reduced ? [0, 0] : [0, -180]);
  const scale = useTransform(scrollYProgress, [0.5, 1], reduced ? [1, 1] : [1, 0.9]);
  const dim = useTransform(scrollYProgress, [0.5, 1], reduced ? [0, 0] : [0, 0.45]);
  const photoY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "0%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.06, 1]);

  return (
    <div
      ref={ref}
      className={`sticky top-[10vh] ${isLast ? "" : "mb-[9vh]"}`}
      style={{ zIndex: index + 1, perspective: 1600 }}
    >
      <motion.div
        initial={reduced ? undefined : { opacity: 0, rotateX: 16, y: 60 }}
        whileInView={reduced ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, z, scale, transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
        className="group relative min-h-[70vh] overflow-hidden rounded-[1.75rem] border border-white/8 bg-space-900 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_44px_110px_-30px_rgba(0,0,0,0.6)]"
      >
        {/* The photograph itself drifts inside its frame — the sheet is thicker than the crop */}
        <motion.img
          src={service.image}
          alt=""
          style={{ y: photoY, scale: photoScale }}
          className="absolute inset-0 h-[118%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,13,24,0.95)] via-[rgba(7,13,24,0.6)] to-[rgba(7,13,24,0.35)]" />
        {/* Physical sheet edge: a lit top bevel and a shadowed base */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line-strong/25" />
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <motion.div
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        <div className="relative flex h-full flex-col justify-between p-7 pb-11 sm:p-12">
          <div className="flex items-start justify-between">
            <span className="font-display text-6xl font-extrabold tracking-[-0.04em] text-white/20 sm:text-8xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <SignalPing rounded="rounded-xl">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-glow/40 bg-space-950/70 text-cyan-glow sm:h-12 sm:w-12">
                <DomainIcon name={service.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
            </SignalPing>
          </div>

          <div className="max-w-xl">
            <span className="meta font-extrabold text-cyan-glow">{service.tagline}</span>
            <h3 className="font-display mt-4 text-[2rem] font-black leading-[1.02] tracking-[-0.032em] text-white sm:text-[2.6rem]">
              {service.name}
            </h3>
            <p className="mt-5 text-[1rem] font-semibold leading-[1.7] text-white/90">{service.body}</p>
            <Link
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="btn-base btn-ghost mt-8"
            >
              View Domain
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function StickyStack({ services }: { services: ServiceDomain[] }) {
  return (
    <div className="relative">
      {services.map((s, i) => (
        <StackCard key={s.slug} service={s} index={i} isLast={i === services.length - 1} />
      ))}
    </div>
  );
}
