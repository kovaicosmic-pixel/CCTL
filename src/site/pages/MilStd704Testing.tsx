import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TriangleAlert, CheckSquare } from "lucide-react";
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
      className={`rounded-xl border px-5 py-4 text-center text-[0.75rem] font-bold uppercase tracking-[0.08em] ${
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

const powerGroups = [
  "Single-phase, 400 Hz, 115 V",
  "Single-phase, variable-frequency, 115 V",
  "Three-phase, variable-frequency, 115 V",
  "28 VDC",
  "Other power groups covered by the applicable handbook part",
];

const responseFactors = [
  "Equipment operation",
  "Functional performance",
  "Electrical response",
  "Response under specified power conditions",
  "Recovery or continued operation where required",
];

const infoRequired = [
  "Equipment identification",
  "Applicable MIL-STD-704 revision",
  "Aircraft/platform power requirement",
  "Equipment input requirements",
  "Applicable power group",
  "Operating conditions",
  "Required test procedure",
  "Customer acceptance criteria",
];

export default function MilStd704Testing() {
  return (
    <div className="bg-space-950">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — no chamber photo used here; MIL-STD-704 evaluates aircraft
          power compatibility, not EMI, and CCTL has no verified photograph
          of dedicated power-test equipment, so a ghost-watermark treatment
          is used instead of misrepresenting the test with a chamber image.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative isolate overflow-hidden rounded-b-[2rem] bg-space-950"
        style={{ minHeight: "calc(100svh - 4.5rem)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(109,78,240,0.16),transparent_60%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[16vw] font-black uppercase leading-none text-white/[0.04]"
        >
          704
        </span>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "MIL / AERO Domain", path: "/services/mil-aero" },
              { name: "MIL-STD-704 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            MIL-STD-704 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Aircraft Electrical Power Compatibility Testing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            MIL-STD-704 establishes the requirements and characteristics of aircraft electrical
            power provided at the input terminals of electrical utilization equipment. The
            associated MIL-HDBK-704 series provides guidance on test methods and procedures for
            demonstrating equipment compatibility with the applicable MIL-STD-704 power
            characteristics.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL provides applicable aircraft electrical-power testing based on the specified
            MIL-STD-704 requirement and associated test procedure.
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
                Discuss Your Requirement
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT IS BEING EVALUATED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>The concept</Eyebrow>
            <h2 className="t-h2 mt-5">What Is Being Evaluated?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The laboratory evaluates whether the equipment can operate as required when
              supplied with the specified aircraft electrical power characteristics.
            </p>
            <p className="t-body mt-4 max-w-2xl">
              The evaluation is therefore concerned with the relationship between:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="surface mt-8 flex flex-col items-center gap-4 p-8 sm:flex-row sm:justify-between sm:gap-3">
            <DiagramBox accent>Aircraft Electrical Power</DiagramBox>
            <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-ink-500 sm:rotate-0" />
            <DiagramBox>Equipment Input</DiagramBox>
            <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-ink-500 sm:rotate-0" />
            <DiagramBox accent>Equipment Response</DiagramBox>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-6 max-w-2xl">
              rather than measuring the equipment&rsquo;s electromagnetic emissions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES THE LABORATORY DO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does the Laboratory Do?</h2>
            <p className="t-lead mt-6">
              For the applicable test procedure, the laboratory establishes the specified
              electrical power condition at the equipment input and operates the equipment under
              the required conditions.
            </p>
            <p className="t-body mt-4">
              The equipment&rsquo;s electrical and functional response is then observed and
              recorded against the applicable acceptance requirements.
            </p>
            <p className="t-body mt-4">
              Depending on the applicable power group and test procedure, the evaluation can
              address specified aircraft power characteristics under defined operating
              conditions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MIL-HDBK-704 TEST PROCEDURES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Test procedures</Eyebrow>
            <h2 className="t-h2 mt-5">MIL-HDBK-704 Test Procedures</h2>
            <p className="t-lead mt-6 max-w-2xl">
              MIL-HDBK-704 is a series of guidance documents supporting demonstrations of
              equipment compatibility with MIL-STD-704. The series includes test-procedure
              guidance for different aircraft electrical-power groups, including examples such
              as:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {powerGroups.map((g) => (
              <div key={g} className="surface flex items-start gap-3 p-5 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {g}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The applicable power group must be selected from the customer&rsquo;s
              aircraft/platform requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EQUIPMENT RESPONSE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Monitoring</Eyebrow>
            <h2 className="t-h2 mt-5">Equipment Response</h2>
            <p className="t-lead mt-6">
              During the evaluation, the equipment is operated under the specified conditions
              while the applicable electrical and functional response is monitored. Depending on
              the test requirement, the assessment may consider:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {responseFactors.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The acceptance criteria must come from the applicable MIL-STD-704 requirement,
              customer specification or program requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          IMPORTANT: MIL-STD-704 vs EMI TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal className="surface flex flex-col gap-4 border-l-4 border-l-amber-400/70 p-8">
            <div className="flex items-center gap-3">
              <TriangleAlert className="h-6 w-6 shrink-0 text-amber-400" strokeWidth={1.8} />
              <h2 className="t-h3 text-lg">Important: MIL-STD-704 vs EMI Testing</h2>
            </div>
            <p className="t-body">
              MIL-STD-704 should not be described as an EMI testing standard. Its purpose is
              aircraft electrical-power compatibility. The current DLA standard specifically
              states that electromagnetic interference and voltage spikes are not covered by
              MIL-STD-704.
            </p>
            <p className="t-body">
              For military EMI emissions and susceptibility testing, see:{" "}
              <Link
                to="/military/mil-std-461-testing"
                className="font-bold text-cyan-glow hover:underline"
              >
                MIL-STD-461 Testing
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INFORMATION REQUIRED BEFORE TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
            <h2 className="t-h2 mt-5">Information Required Before Testing</h2>
            <p className="t-lead mt-6">Please provide, where applicable:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {infoRequired.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
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
              Request MIL-STD-704 Testing
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your equipment and aircraft power requirements with CCTL to determine the
              appropriate test configuration.
            </p>
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
