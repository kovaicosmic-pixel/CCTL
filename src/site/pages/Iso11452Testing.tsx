import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks — same primitives used on the sibling standard
   pages (e.g. Cispr25Testing.tsx), defined locally to match that convention.
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

function DiagramBox({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-5 py-3 text-center text-[0.75rem] font-bold uppercase tracking-[0.08em] ${
        accent
          ? "border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow"
          : "border-line-strong/10 bg-line-strong/[0.04] text-ink-100"
      }`}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Content
   ──────────────────────────────────────────────────────────────────────── */

const testMethods = [
  {
    title: "ISO 11452-2",
    body: "A component-level immunity method using a radiated electromagnetic field.",
  },
  {
    title: "ISO 11452-4",
    body: "A component-level immunity method in which the applicable disturbance is coupled to the component's wiring harness.",
  },
];

const infoRequired = [
  "Component identification",
  "Applicable ISO 11452 method",
  "Operating conditions",
  "Power requirements",
  "Harness configuration",
  "Functional monitoring requirements",
  "Customer specification, where applicable",
];

export default function Iso11452Testing() {
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
            alt="CCTL Vehicle Semi-Anechoic Chamber used for automotive component immunity testing"
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
              { name: "ISO 11452 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            ISO 11452 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Automotive Component Electromagnetic Immunity
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            ISO 11452 covers methods for evaluating the immunity of electrical and electronic
            components intended for use in road vehicles when subjected to specified
            electromagnetic disturbances.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Unlike an emissions measurement, the purpose of this evaluation is to determine how
            the component behaves <strong className="text-white">while electromagnetic energy
            is applied to it</strong>.
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
                Request ISO 11452 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          IMMUNITY TEST METHODS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Test methods</Eyebrow>
            <h2 className="t-h2 mt-5">Immunity Test Methods</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL&rsquo;s current automotive service information identifies:
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid gap-6 sm:grid-cols-2">
            {testMethods.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.1} className="surface p-7">
                <h3 className="t-h3 text-lg">{m.title}</h3>
                <p className="t-body mt-3">{m.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The exact setup, frequency range, severity and acceptance criteria depend on the
              applicable edition and customer requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT HAPPENS DURING THE TEST
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>The test itself</Eyebrow>
              <h2 className="t-h2 mt-5">What Happens During the Test?</h2>
              <p className="t-lead mt-6">
                The component is operated in a defined condition while the specified
                electromagnetic disturbance is applied.
              </p>
              <p className="t-body mt-4">
                The laboratory monitors the required product functions and records the response
                against the applicable performance criteria.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="surface flex flex-col items-center gap-3 p-8 sm:p-10">
            {["Component", "Defined Operating Condition", "Electromagnetic Exposure", "Function Monitoring"].map(
              (step) => (
                <div key={step} className="flex w-full flex-col items-center gap-3">
                  <DiagramBox>{step}</DiagramBox>
                  <ArrowDown className="h-4 w-4 text-ink-500" />
                </div>
              ),
            )}
            <DiagramBox accent>Result Evaluation</DiagramBox>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY COMPONENT IMMUNITY MATTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Why it matters</Eyebrow>
            <h2 className="t-h2 mt-5">Why Component Immunity Matters</h2>
            <p className="t-lead mt-6">
              An automotive component can be exposed to electromagnetic fields generated by other
              electrical and electronic systems within the vehicle environment.
            </p>
            <p className="t-body mt-4">
              Immunity testing provides a controlled way to evaluate the component&rsquo;s
              response to the specified disturbance.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CCTL CAPABILITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">CCTL Capability</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL&rsquo;s current automotive testing information includes RF immunity
              measurement, radiated immunity and Bulk Current Injection (BCI) among its
              automotive EMC capabilities.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="plate mt-8 overflow-hidden rounded-[1.5rem]">
            <img
              src="/images/explore/BCI_setup.webp"
              alt="Automotive component immunity test setup at CCTL"
              className="w-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.14}>
            <p className="t-small mt-3 italic">Automotive component immunity test setup</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TEST INFORMATION REQUIRED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
            <h2 className="t-h2 mt-5">Test Information Required</h2>
            <p className="t-lead mt-6">For an ISO 11452 evaluation, provide:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {infoRequired.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              If the required method has not yet been established, provide the component and
              customer requirement for review.
            </p>
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
              Request ISO 11452 Testing
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Your Requirement
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
