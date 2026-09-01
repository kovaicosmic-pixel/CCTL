import { lazy, Suspense, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import ClientMarquee from "../components/ClientMarquee";
import CertificateGallery3D from "../components/CertificateGallery3D";
import GradientOrbs from "../components/bg/GradientOrbs";
import GridBackground from "../components/bg/GridBackground";
import CertificatePlate from "../components/CertificatePlate";
import Counter from "../components/Counter";
import Reveal from "../components/motion/Reveal";
import CharacterReveal from "../components/motion/CharacterReveal";
import KineticWords from "../components/motion/KineticWords";
import DirectionalConverge from "../components/motion/DirectionalConverge";
import StaggerWave from "../components/motion/StaggerWave";
import FloatingStandards from "../components/bg/FloatingStandards";
import { about, aboutPillars, certifications, stats, labPhotosA } from "../data/content";

// three.js (~365KB min) is only needed for this one below-the-fold gallery —
// splitting it out of the route chunk instead of bundling it upfront.
const InfiniteDrift = lazy(() => import("../components/InfiniteDrift"));

/* ------------------------------------------------------------------ */
/* 1 — Who we are: sticky editorial column beside drifting photo plates */
/* ------------------------------------------------------------------ */
function WhoWeAre() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -110]);
  const yB = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-40, 90]);
  const rot = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-4, 3]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-space-950 pb-24 pt-20 lg:pb-32 lg:pt-24"
    >
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
            Who We Are
          </span>
          <span aria-hidden className="accent-rule mt-3" />
          <KineticWords
            text="A premier EMI/EMC testing facility"
            as="h1"
            className="t-h2 mt-5"
            stagger={0.04}
          />
          <p className="t-body mt-6 max-w-lg">
            CCTL operates a premier EMI/EMC testing facility specializing in compliance tests for
            automotive electronic sub-assemblies, and extends its expertise across military,
            industrial, scientific, and medical sectors — offering cutting-edge EMI/EMC testing
            solutions that fortify product quality, security, and regulatory adherence.
          </p>
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-line-strong/10 pt-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                  mass: 0.9,
                  delay: i * 0.15,
                }}
              >
                <p className="figure-accent text-4xl">
                  <Counter to={s.value} />
                </p>
                <p className="font-mono mt-2 text-[0.625rem] font-bold uppercase tracking-[0.24em] text-ink-500">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Two plates at different depths — on phones they interleave rather than stack flat */}
        <div
          className="relative min-h-[52vh] lg:min-h-[70vh]"
          style={reduced ? undefined : { perspective: 1600 }}
        >
          <motion.div style={{ y: yA }} className="ml-auto w-[82%] lg:w-[76%]">
            <img
              src="/images/chamber.webp"
              alt="CCTL semi-anechoic chamber"
              loading="eager"
              className="nav-logo aspect-[4/5] w-full rounded-3xl object-cover plate"
            />
          </motion.div>
          <motion.div
            style={{ y: yB, rotate: rot }}
            className="absolute bottom-0 left-0 w-[58%] lg:w-[54%]"
          >
            <img
              src={labPhotosA[1] ?? "/images/explore/control_room.webp"}
              alt="CCTL engineers at work"
              loading="eager"
              className="nav-logo aspect-[4/3] w-full rounded-2xl object-cover plate"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Vision / Mission split reveal                                    */
/* ------------------------------------------------------------------ */
function VisionMission() {
  return (
    <section className="relative overflow-hidden bg-space-900 pb-24 pt-12 lg:pb-32 lg:pt-16">
      <DirectionalConverge className="container-x grid gap-px overflow-hidden rounded-[1.5rem] border border-line-strong/10 bg-line-strong/10 !p-0 lg:grid-cols-2">
        {[
          { label: "Vision", text: about.vision, accent: "text-cyan-glow", char: true },
          { label: "Mission", text: about.mission, accent: "text-violet-glow", char: true },
        ].map((item, i) => (
          <div
            key={item.label}
            className="group relative overflow-hidden bg-space-950 p-10 lg:p-16"
          >
            <span
              aria-hidden
              className="font-heading pointer-events-none absolute -bottom-8 right-4 text-[7rem] font-black leading-none text-line-strong/[0.04] transition-transform duration-700 group-hover:-translate-y-3"
            >
              0{i + 1}
            </span>
            <span
              className={`font-mono text-xs font-bold uppercase tracking-[0.25em] ${item.accent}`}
            >
              {item.label}
            </span>
            {item.char ? (
              <CharacterReveal
                text={item.text}
                className="t-h3 mt-6 block text-[1.35rem] leading-snug lg:text-[1.6rem]"
              />
            ) : (
              <p className="t-h3 mt-6 text-[1.35rem] leading-snug lg:text-[1.6rem]">{item.text}</p>
            )}
          </div>
        ))}
      </DirectionalConverge>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Pillars as a depth ladder (index-driven hover push)             */
/* ------------------------------------------------------------------ */
function PillarLadder() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-space-900 pb-24 lg:pb-32">
      <div className="container-x relative z-10 max-w-5xl">
        <SectionHeading
          eyebrow="Principles"
          title="What our practice is built on"
          center={false}
        />
        <div className="mt-12 border-t border-line-strong/10">
          {aboutPillars.map((p, i) => (
            <motion.div
              key={p.title}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line-strong/10 py-7 lg:grid-cols-[auto_0.9fr_1.1fr]"
            >
              <motion.span
                animate={{ x: active === i ? 10 : 0, opacity: active === i ? 1 : 0.6 }}
                className="font-mono text-xs font-bold tracking-widest text-cyan-glow"
              >
                0{i + 1}
              </motion.span>
              <motion.h4
                animate={{ x: active === i ? 14 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="font-display text-lg font-bold tracking-[-0.02em] text-white lg:text-xl"
              >
                {p.title}
              </motion.h4>
              <motion.p
                animate={{ opacity: active === i ? 1 : 0.75 }}
                className="col-span-2 text-[0.9rem] font-medium leading-[1.7] text-white/70 lg:col-span-1"
              >
                {p.body}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5 — Capabilities: EMC testing standards and services                 */
/* ------------------------------------------------------------------ */

const capabilities = [
  "Radiated and Conducted emissions as per various CISPR and Military standards.",
  "Radiated Immunity 10 kHz to 40 GHz Field strength 150V/m.",
  "Conducted transient emissions on power leads, as per IEC standards.",
  "Immunity to conducted transients' disturbances, as per IEC standards.",
  "Immunity to Electrostatic Discharge (ESD) as per ISO 10605/IEC 61000-4-2.",
  "Immunity to Fast transients as per IEC 61000-4-4.",
  "Immunity to surges as per IEC 61000-4-5.",
  "Immunity to Conducted disturbance induced by radio frequency fields as per IEC 61000-4-6.",
  "Immunity to voltage dips & short interruptions as per IEC 61000-4-11/IEC 61000-4-29/IEC 61000-4-34.",
  "Harmonic Current Emissions as per IEC 61000-3-2/IEC 61000-3-12.",
  "Voltage Fluctuations and Flicker as per IEC 61000-3-3/IEC 61000-3-11.",
  "Harmonics and Inter harmonics, low frequency immunity as per IEC 61000-4-13.",
  "Voltage fluctuation immunity as per IEC 61000-4-14.",
  "Ripple on DC input power port immunity as per IEC 61000-4-17.",
  "Variation of power frequency immunity as per IEC 61000-4-28.",
  "Medical Devices as per IEC Standard.",
  "Defense Related devices as per MIL 461.",
];

function Capabilities() {
  const driftBands = [
    {
      offsetY: -160,
      speed: 1.0,
      rotation: 5,
      rotationType: "fromLeft" as const,
      curveAmount: 35.0,
      curveDirection: 1 as const,
      images: [
        "/images/explore/AZ7_7709%202023-09-11%2006_28_36.webp",
        "/images/explore/AZ7_7776.webp",
        "/images/explore/civilLab.webp",
        "/images/explore/Picture1.jpg",
      ],
    },
    {
      offsetY: -50,
      speed: 1.3,
      rotation: 5,
      rotationType: "fromCenter" as const,
      curveAmount: 30.0,
      curveDirection: 1 as const,
      images: [
        "/images/explore/AZ7_7722%202023-09-11%2006_29_56.webp",
        "/images/explore/AZ7_7777.webp",
        "/images/explore/domain-railways.webp",
        "/images/explore/Labcivil.webp",
      ],
    },
    {
      offsetY: 60,
      speed: 0.8,
      rotation: 5,
      curveAmount: 35.0,
      curveDirection: 1 as const,
      images: [
        "/images/explore/domain-telecom.webp",
        "/images/explore/media.webp",
        "/images/explore/AZ7_7776.webp",
        "/images/explore/civilLab.webp",
      ],
    },
    {
      offsetY: 170,
      speed: 1.1,
      rotation: 5,
      curveAmount: 30.0,
      curveDirection: 1 as const,
      images: [
        "/images/explore/Picture1.jpg",
        "/images/explore/AZ7_7709%202023-09-11%2006_28_36.webp",
        "/images/explore/domain-railways.webp",
        "/images/explore/AZ7_7722%202023-09-11%2006_29_56.webp",
      ],
    },
  ];

  return (
    <section className="relative bg-space-900 pb-24 pt-12 lg:pb-40 lg:pt-16">
      <div className="container-x max-w-6xl">
        <Reveal>
          <SectionHeading eyebrow="What We Test" title="Capabilities" center={false} />
        </Reveal>

        {/* Infinite Drift Gallery */}
        <div className="mt-14">
          <Suspense
            fallback={
              <div className="surface w-full rounded-[1.25rem] bg-space-950" style={{ height: 500 }} />
            }
          >
            <InfiniteDrift
              bands={driftBands}
              height={500}
              gap={16}
              imageHeight={110}
              bandHeight={130}
              maxImageWidth={280}
              inertia={0.93}
              className="surface rounded-[1.25rem] bg-space-950"
            />
          </Suspense>
        </div>

        {/* Capabilities list below */}
        <StaggerWave className="grid-gutter mt-16 grid sm:grid-cols-2 lg:grid-cols-3" origin="center" columns={3} waveSpeed={0.1}>
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="surface surface-hover group relative overflow-hidden rounded-[1rem] bg-space-950 p-6"
            >
              <span className="absolute -right-2 -top-2 font-mono text-[3.5rem] font-black leading-none text-line-strong/[0.04] transition-transform duration-500 group-hover:-translate-y-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-glow/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_8px_2px_rgba(26,108,245,0.5)]" />
                </span>
                <p className="t-body">{cap}</p>
              </div>
            </div>
          ))}
        </StaggerWave>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      {/* Who We Are (DARK) */}
      <div className="relative">
        <GradientOrbs variant="default" />
        <FloatingStandards count={8} opacity={0.35} theme="dark" />
        <WhoWeAre />
      </div>

      {/* Vision/Mission (DARK) */}
      <div className="relative">
        <FloatingStandards count={6} opacity={0.3} theme="dark" />
        <VisionMission />
      </div>

      {/* Principles/Pillars (DARK) */}
      <div className="relative overflow-visible">
        <GridBackground variant="sparse" />
        <FloatingStandards count={8} opacity={0.3} theme="dark" />
        <PillarLadder />
      </div>

      {/* Capabilities (DARK) */}
      <Capabilities />

      {/* Accreditations (DARK) */}
      <section className="relative bg-space-950 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="Accreditations" title="Certified credentials" />
          </Reveal>
          <div className="mt-16">
            <CertificateGallery3D items={certifications} itemHeight={400} />
          </div>
        </div>
      </section>

      {/* Trusted By (DARK) */}
      <section className="relative bg-space-900 pb-20 pt-10 lg:pt-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Trusted By"
              title="We're Grateful To Work With Incredible Clients"
            />
          </Reveal>
        </div>
        <div className="mt-10">
          <ClientMarquee />
        </div>
      </section>
    </>
  );
}
