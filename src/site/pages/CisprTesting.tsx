import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { FileSearch } from "lucide-react";
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

/* ────────────────────────────────────────────────────────────────────────
   Content
   ──────────────────────────────────────────────────────────────────────── */

const cisprStandards = ["CISPR 11", "CISPR 14", "CISPR 15", "CISPR 22", "CISPR 32"];

const infoNeeded = [
  "Product name and model",
  "Product function",
  "Power configuration",
  "Intended operating modes",
  "Connected cables/peripherals",
  "Applicable CISPR requirement, if known",
];

export default function CisprTesting() {
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
            src="/images/civilianDomain.webp"
            alt="CCTL semi-anechoic chamber used for CISPR radio disturbance testing"
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
              { name: "CISPR Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            CISPR Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Radio Disturbance Emission Testing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            If your product needs evaluation of unwanted radio-frequency emissions under a CISPR
            requirement, this is the relevant testing area.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CISPR standards are product- and application-specific. The correct CISPR standard
            depends on what the equipment is and the requirement against which it must be
            evaluated.
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
                Request CISPR Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          IS CISPR TESTING RELEVANT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">Is CISPR Testing Relevant to My Product?</h2>
            <p className="t-lead mt-6">
              It may be, if your electrical or electronic equipment is subject to requirements
              for conducted or radiated radio-frequency disturbances.
            </p>
            <p className="t-body mt-4">CCTL&rsquo;s current civilian testing information includes:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {cisprStandards.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-bold text-ink-100"
              >
                {s}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The applicable standard should be selected according to the product and
              requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES THE LABORATORY DO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does the Laboratory Do?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The equipment is operated in the required configuration and its applicable
              electromagnetic disturbances are measured. Depending on the selected CISPR
              standard, the laboratory may evaluate:
            </p>
          </Reveal>

          <div className="grid-gutter mt-8 grid gap-6 sm:grid-cols-2">
            <Reveal className="surface p-7">
              <h3 className="t-h3 text-lg">Conducted disturbances</h3>
              <p className="t-body mt-3">Disturbances appearing on applicable conductive connections.</p>
            </Reveal>
            <Reveal delay={0.1} className="surface p-7">
              <h3 className="t-h3 text-lg">Radiated disturbances</h3>
              <p className="t-body mt-3">Electromagnetic energy radiated from the equipment.</p>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The measurement configuration, frequency range and limits come from the applicable
              product standard.
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
            <p className="t-lead mt-6">For an initial review, provide:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {infoNeeded.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              If you don&rsquo;t know which CISPR standard applies, send the product information
              first rather than selecting a standard based only on the product name.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CAN CCTL PERFORM THE TEST
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Capability</Eyebrow>
            <h2 className="t-h2 mt-5">Can CCTL Perform the Test?</h2>
            <p className="t-lead mt-6">
              CCTL&rsquo;s current civilian service information identifies the CISPR standards
              above within its laboratory testing offering.
            </p>
            <p className="t-body mt-4">
              The exact test capability and applicable scope should be confirmed for the specific
              requirement before testing is scheduled.
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
              Request CISPR Testing
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Send the product details and the requirement you have received from your customer,
              OEM or regulatory program.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request CISPR Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
