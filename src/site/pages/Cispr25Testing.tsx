import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks — same primitives used on the EMC/EMI/Compliance
   pages, defined locally to match that page-local convention.
   ──────────────────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="meta inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`transition-transform duration-300 group-hover:translate-x-1 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Content
   ──────────────────────────────────────────────────────────────────────── */

const emissionPaths = [
  {
    title: "Conducted disturbances",
    body: "Unwanted electrical disturbances associated with applicable component connections.",
  },
  {
    title: "Radiated disturbances",
    body: "Electromagnetic energy emitted by the component and its associated configuration.",
  },
];

const configItems = [
  "Equipment under test",
  "Power connections",
  "Associated harnesses",
  "Loads and accessories",
  "Measurement arrangement",
];

const relevantItems = [
  "Electronic control modules",
  "Automotive electronic assemblies",
  "Vehicle electronic components",
  "Other electrical/electronic modules specified by an OEM or applicable requirement",
];

export default function Cispr25Testing() {
  return (
    <div className="bg-space-950">
      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative isolate overflow-hidden rounded-b-[2rem] bg-ink-100"
        style={{ minHeight: "calc(100svh - 4.5rem)" }}
      >
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/automotive.webp"
            alt="CCTL Vehicle Semi-Anechoic Chamber used for automotive component emission testing"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.84)] via-[rgba(7,13,24,0.64)] to-[rgba(7,13,24,0.9)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Automotive EMC Testing", path: "/services/automotive" },
              { name: "CISPR 25 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            CISPR 25 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Automotive Component Radio Disturbance Testing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CISPR 25 addresses the measurement of radio disturbance characteristics of electrical
            and electronic components and modules intended for use in vehicles.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            At CCTL, CISPR 25 testing is used to evaluate applicable conducted and radiated
            disturbance levels from automotive components under the specified test configuration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease }}
            className="mt-9"
          >
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request CISPR 25 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT IS MEASURED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>What is measured?</Eyebrow>
            <h2 className="t-h2 mt-5">Two Principal Emission Paths</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CISPR 25 testing can involve two principal emission paths.
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid gap-6 sm:grid-cols-2">
            {emissionPaths.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="surface p-7">
                <h3 className="t-h3 text-lg">{p.title}</h3>
                <p className="t-body mt-3">{p.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The applicable frequency range, limits and measurement configuration depend on the
              specified CISPR 25 edition and test requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TEST CONFIGURATION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
            <h2 className="t-h2 mt-5">Test Configuration</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Automotive component emission measurements are performed using the configuration
              specified for the applicable test method. The configuration can involve:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {configItems.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The product should be tested in a configuration representative of the requirement
              being evaluated.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHEN IS CISPR 25 RELEVANT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">When is CISPR 25 Relevant?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CISPR 25 is commonly specified when the electromagnetic emissions of an automotive
              electrical or electronic component need to be evaluated. Examples include:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {relevantItems.map((item) => (
              <div key={item} className="surface flex items-start gap-3 p-5 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-glow" />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AT CCTL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">At CCTL</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL&rsquo;s automotive testing services include CISPR 25 emission testing.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="plate mt-8 overflow-hidden rounded-[1.5rem]">
            <img
              src="/images/automotive/receiver with software setup.webp"
              alt="Automotive component emission test setup at CCTL"
              className="w-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.14}>
            <p className="t-small mt-3 italic">Automotive component emission test setup</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Get started
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Need CISPR 25 Testing?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Send CCTL the component details and applicable requirement. Our team can review the
              requested test configuration before scheduling.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
