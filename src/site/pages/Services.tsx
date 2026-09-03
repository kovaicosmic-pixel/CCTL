import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Reveal from "../components/motion/Reveal";
import Magnetic from "../components/motion/Magnetic";
import StickyStack from "../components/StickyStack";
import GrainOverlay from "../components/motion/GrainOverlay";
import ParticleField from "../components/bg/ParticleField";
import GradientOrbs from "../components/bg/GradientOrbs";
import FloatingStandards from "../components/bg/FloatingStandards";
import { services, company } from "../data/content";

/* Spatial opening: the five domains fan out as physical plates before the stack locks. */
function DomainFan() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fanZ = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -320]);
  const fanRot = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 12]);
  const fanOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <div ref={ref} className="relative h-[120vh] md:h-[200vh]">
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-visible px-4 pb-16 pt-[4.5rem] sm:px-5 lg:px-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(109,78,240,0.16),transparent_60%)]"
        />
        <GrainOverlay opacity={0.04} />

        <div className="relative mx-auto w-full max-w-6xl">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono block text-[0.6rem] font-bold uppercase tracking-[0.25em] text-cyan-glow sm:text-xs"
          >
            Services
          </motion.span>
          <h1 className="mt-5 flex w-max max-w-full flex-col overflow-visible text-[clamp(3.1rem,8.4vw,11rem)] font-display font-extrabold uppercase leading-[0.7] tracking-[-0.06em] text-ink-100">
            {["Five domains.", "One facility."].map((line, i) => (
              <span key={line} className="block w-max max-w-full overflow-visible">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                  className={`block whitespace-nowrap overflow-visible ${i % 2 ? "text-outline-heading" : "text-ink-100"}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Fanned photographic plates */}
          <motion.div
            style={{
              z: fanZ,
              rotateX: fanRot,
              opacity: fanOpacity,
              transformStyle: "preserve-3d",
              perspective: 1600,
            }}
            className="mt-8 flex justify-center pb-4 sm:mt-10 lg:mt-14"
          >
            {services.map((s, i) => {
              const offset = i - (services.length - 1) / 2;
              return (
                <motion.div
                  key={s.slug}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  initial={reduced ? undefined : { opacity: 0, y: 90, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: offset * 4.5 }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduced ? undefined : { y: -18, rotate: 0, scale: 1.04, zIndex: 20 }}
                  style={{ marginLeft: i === 0 ? 0 : "-2.5rem", zIndex: hover === i ? 20 : i }}
                  className="relative w-[28vw] max-w-[11rem] overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)] sm:w-[18vw] sm:max-w-[12.5rem] lg:max-w-[14rem]"
                >
                  <img
                    src={s.image}
                    alt=""
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,13,24,0.9)] via-[rgba(7,13,24,0.4)] to-transparent" />
                  <span className="font-mono absolute bottom-3 left-3 right-3 text-[0.5rem] font-bold uppercase leading-tight tracking-[0.18em] text-white sm:text-[0.55rem]">
                    {s.name.replace(" Domain", "")}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="relative mx-auto mt-8 w-full max-w-[74rem] px-2 pb-4 sm:mt-10 lg:mt-14"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-6 top-1/2 hidden h-px -translate-y-1/2 bg-cyan-glow/40 md:block" />
            <div aria-hidden className="pointer-events-none absolute left-6 top-10 hidden h-8 w-8 border-l border-t border-cyan-glow/50 md:block" />
            <div aria-hidden className="pointer-events-none absolute right-6 top-10 hidden h-8 w-8 border-r border-t border-cyan-glow/50 md:block" />
            <div aria-hidden className="pointer-events-none absolute left-6 bottom-10 hidden h-8 w-8 border-b border-l border-cyan-glow/50 md:block" />
            <div aria-hidden className="pointer-events-none absolute right-6 bottom-10 hidden h-8 w-8 border-b border-r border-cyan-glow/50 md:block" />

            <div className="mx-auto max-w-[62rem] text-center">
              <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.42em] text-cyan-glow sm:text-xs">
                EMC / EMI
              </p>

              <h2 className="mt-4 font-display text-[clamp(3.1rem,5vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.06em] text-ink-100">
                We test what
                <span className="block text-cyan-glow">disrupts your system.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-[58rem] font-display text-[clamp(1.3rem,2.1vw,2.4rem)] font-light leading-[1.2] tracking-[-0.03em] text-ink-300">
                Precision EMC and EMI testing for defence, automotive, railway, telecom and mission-critical electronics —
                validating emissions, immunity and compliance performance with confidence.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <>
      {/* Particle field behind the domain fan opening */}
      <div className="relative">
        <ParticleField className="z-0 opacity-50" particleCount={45} speed={0.2} />
        <GradientOrbs variant="subtle" />
        <FloatingStandards count={10} opacity={0.35} theme="dark" />
        <DomainFan />
      </div>

      <div className="container-x pb-24 lg:pb-32">
        <div className="mx-auto max-w-5xl">
          <StickyStack services={services} />
        </div>
      </div>

      <section className="relative z-10 bg-space-950 pb-24 pt-12 lg:pb-40 lg:pt-16">
        <Reveal className="container-x max-w-5xl">
          <div className="surface glow-border flex flex-col items-center gap-7 rounded-[1.75rem] p-10 text-center sm:p-14">
            <h2 className="t-h2 max-w-2xl">Not sure which testing domain you need?</h2>
            <p className="t-lead max-w-xl">
              Talk to our EMC engineers — call {company.phone} or send us your requirements and
              we&rsquo;ll guide you to the right test plan.
            </p>
            <Magnetic strength={0.35}>
              <Link to="/contact" className="btn-base btn-primary">
                Contact Our Team
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
