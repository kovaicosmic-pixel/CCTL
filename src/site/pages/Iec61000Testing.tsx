import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileSearch } from "lucide-react";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks — same primitives used on the sibling standard
   pages, defined locally to match that convention.
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
      className={`rounded-xl border px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-[0.06em] ${
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

const iecMethods = [
  { code: "IEC 61000-4-2", label: "Electrostatic discharge immunity" },
  { code: "IEC 61000-4-3", label: "Radiated RF electromagnetic-field immunity" },
  { code: "IEC 61000-4-4", label: "Electrical fast transient/burst" },
  { code: "IEC 61000-4-5", label: "Surge" },
  { code: "IEC 61000-4-6", label: "Conducted RF immunity" },
  { code: "IEC 61000-4-8", label: "Power-frequency magnetic-field immunity" },
  { code: "IEC 61000-4-9", label: "Pulsed magnetic-field immunity" },
  { code: "IEC 61000-4-11", label: "Voltage dips, short interruptions and voltage variations" },
];

const infoNeeded = [
  "Product identification",
  "Applicable product standard",
  "Required IEC 61000 test methods",
  "Operating mode",
  "Power requirements",
  "Functional performance to be monitored",
  "Customer-specific test levels, where applicable",
];

export default function Iec61000Testing() {
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
            src="/images/civilian/IMG_20240418_173040.webp"
            alt="CCTL semi-anechoic chamber used for IEC 61000 immunity testing"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.85)] via-[rgba(7,13,24,0.64)] to-[rgba(7,13,24,0.9)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Civilian Domain", path: "/services/civilian" },
              { name: "IEC 61000 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            IEC 61000 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Immunity and Power-Quality Test Methods
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            IEC 61000 is a family of EMC standards rather than a single test. Different parts
            address different electromagnetic disturbances and measurement requirements.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL&rsquo;s civilian testing capability includes applicable IEC 61000 emission and
            immunity methods.
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
                Discuss IEC 61000 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          IS IEC 61000 TESTING WHAT I NEED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">Is IEC 61000 Testing What I Need?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              If your product specification calls for immunity testing such as ESD, radiated RF,
              EFT/burst, surge, conducted RF or voltage dips, the applicable IEC 61000-4 method
              may be the relevant requirement.
            </p>
            <p className="t-body mt-4 max-w-2xl">CCTL currently lists:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {iecMethods.map((m) => (
              <div key={m.code} className="surface flex items-start gap-3 p-5">
                <span className="num-chip shrink-0 whitespace-nowrap">{m.code}</span>
                <p className="text-sm text-ink-100">{m.label}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-body mt-6 max-w-2xl">
              CCTL also lists <strong className="text-ink-100">IEC 61000-3-2</strong> and{" "}
              <strong className="text-ink-100">IEC 61000-3-3</strong> for applicable
              harmonic-current and voltage-fluctuation/flicker requirements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES THE LABORATORY ACTUALLY DO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does the Laboratory Actually Do?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              This depends on the selected IEC 61000 method. For an immunity test, the basic
              laboratory activity is:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="surface mt-8 flex flex-col items-center gap-3 p-6 sm:flex-row sm:justify-between sm:gap-2">
            {["Equipment", "Defined Operating Condition", "Controlled Disturbance", "Functional Monitoring"].map(
              (step, i, arr) => (
                <div key={step} className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                  <DiagramBox>{step}</DiagramBox>
                  {i < arr.length && (
                    <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-ink-500 sm:rotate-0" />
                  )}
                </div>
              ),
            )}
            <DiagramBox accent>Result Evaluation</DiagramBox>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-body mt-8 max-w-2xl">
              For example, IEC 61000-4-3 evaluates immunity to radiated RF electromagnetic
              fields, while IEC 61000-4-2 addresses immunity to electrostatic discharge.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="t-small mt-4 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The test level and performance criteria are determined by the applicable product
              standard or test requirement; they should not be assumed simply from the IEC 61000
              part number.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES CCTL NEED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="t-h2 mt-5">What Does CCTL Need?</h2>
            <p className="t-lead mt-6">The most useful information is:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {infoNeeded.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CAN CCTL PERFORM IT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Capability</Eyebrow>
            <h2 className="t-h2 mt-5">Can CCTL Perform It?</h2>
            <p className="t-lead mt-6">
              CCTL&rsquo;s current Civilian page lists the IEC 61000 methods above as part of its
              laboratory testing offering.
            </p>
            <p className="t-body mt-4">
              The exact method, test level and configuration should be confirmed against the
              customer&rsquo;s applicable product requirement.
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
              What should I do next?
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Discuss IEC 61000 Testing
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              If you already have a test specification, send the required IEC 61000 parts. If you
              don&rsquo;t know which parts apply, send the product standard and product details
              so the required test program can be identified.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss IEC 61000 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
