import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Signal,
  ShieldCheck,
  TrainFront,
  Gauge,
  Radio,
  Phone,
  Settings2,
  Power,
  FlaskConical,
  Activity,
  FileCheck2,
  ClipboardList,
  FileText,
} from "lucide-react";
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

const equipmentTypes = [
  { icon: TrainFront, label: "On-board railway electronic equipment" },
  { icon: Gauge, label: "Railway control and monitoring equipment" },
  { icon: Signal, label: "Signalling equipment" },
  { icon: Phone, label: "Communication and telecommunications equipment" },
  { icon: Settings2, label: "Electronic control systems" },
  { icon: Power, label: "Power and auxiliary equipment" },
  { icon: Radio, label: "Trackside and fixed railway equipment" },
];

const labSteps = [
  { icon: Signal, title: "Measure electromagnetic emissions" },
  { icon: FlaskConical, title: "Apply defined electromagnetic disturbances" },
  { icon: Activity, title: "Monitor equipment operation and functional performance" },
  { icon: FileCheck2, title: "Record test results and observations" },
  { icon: ShieldCheck, title: "Evaluate results against the applicable requirements" },
  { icon: ClipboardList, title: "Prepare the test documentation" },
];

const infoNeeded = [
  "Product or equipment details",
  "Intended railway application",
  "Applicable standard or customer specification",
  "Power supply information",
  "Cable and interface configuration",
  "Operating modes",
  "Installation or system information",
  "Customer-specific test plan, where applicable",
];

export default function RailwayEmcTesting() {
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
            src="/images/railway/Radiated-Emission-test-1-4-scaled-1.webp"
            alt="CCTL semi-anechoic chamber used for railway EMC testing"
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
              { name: "Railway Domain", path: "/services/railway" },
              { name: "Railway EMC Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            Railway EMC Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            EMC Testing for Railway Equipment and Systems
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Railway equipment operates in electrically complex environments where electronic
            systems must continue to function correctly without creating unacceptable
            electromagnetic disturbances.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL provides EMC testing support for railway equipment and systems, helping
            manufacturers evaluate electromagnetic emissions and immunity according to the
            applicable railway requirements. Whether the equipment is intended for rolling stock,
            signalling, communication, control, or railway infrastructure, the applicable testing
            depends on the equipment, installation environment, and customer or regulatory
            requirement.
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
          WHAT RAILWAY EMC TESTING EVALUATES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The concept</Eyebrow>
            <h2 className="t-h2 mt-5">What Railway EMC Testing Evaluates</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Railway EMC testing generally addresses two important aspects:
            </p>
          </Reveal>

          <div className="grid-gutter mt-8 grid gap-6 sm:grid-cols-2">
            <Reveal className="surface p-7">
              <h3 className="t-h3 text-lg">Emissions</h3>
              <p className="t-body mt-3">
                Evaluation of electromagnetic disturbances generated by the equipment to determine
                whether they remain within the applicable limits.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="surface p-7">
              <h3 className="t-h3 text-lg">Immunity</h3>
              <p className="t-body mt-3">
                Evaluation of whether the equipment continues to perform its intended function
                when exposed to specified electromagnetic disturbances.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The exact tests, limits, test levels, operating conditions, and acceptance criteria
              depend on the applicable railway standard and product requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHICH RAILWAY EQUIPMENT MAY REQUIRE EMC TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">Which Railway Equipment May Require EMC Testing?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Railway EMC requirements can apply to a wide range of electrical and electronic
              equipment, including:
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentTypes.map((e, i) => (
              <Reveal key={e.label} delay={(i % 4) * 0.07} className="surface p-6">
                <e.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <p className="t-body mt-4 text-[0.85rem] !text-ink-100">{e.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-8 max-w-2xl">
              The applicable requirements should be determined from the equipment&rsquo;s
              intended railway application and installation environment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES THE LABORATORY DO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does the Laboratory Do?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              During testing, the equipment is operated in defined conditions representative of
              its intended use. Depending on the applicable requirement, the laboratory may:
            </p>
          </Reveal>

          <ul className="mt-10">
            {labSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="flex items-center gap-5 border-t border-line-strong/10 py-5 last:border-b">
                  <step.icon className="h-5 w-5 shrink-0 text-cyan-glow" strokeWidth={1.6} />
                  <p className="text-sm text-ink-100 sm:text-base">{step.title}</p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <p className="t-small mt-8 max-w-2xl">
              Testing is performed according to the applicable test plan, standard, and customer
              requirements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RAILWAY EMC STANDARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Standards</Eyebrow>
            <h2 className="t-h2 mt-5">Railway EMC Standards</h2>
            <p className="t-lead mt-6">
              Railway EMC requirements can involve different standards depending on the
              application and equipment.
            </p>
            <p className="t-body mt-4">
              One of the key standards used for railway EMC is the{" "}
              <strong className="text-ink-100">EN 50121 series</strong>, which addresses
              electromagnetic compatibility for railway applications. The applicable part of the
              standard depends on whether the requirement relates to the railway environment,
              rolling stock, signalling and telecommunications, or fixed installations.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6">
            <Link
              to="/railway/en-50121-testing"
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
            >
              Explore EN 50121 Testing
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT WE NEED FROM YOU
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="t-h2 mt-5">What We Need From You</h2>
            <p className="t-lead mt-6">Before testing, CCTL may need:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {infoNeeded.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              Providing the applicable requirement in advance allows the laboratory to identify
              the relevant test methods and configuration.
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
              Testing requirement review
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Not Sure Which Railway EMC Testing Applies?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your equipment details and applicable railway requirement with CCTL. Our team
              can review the requirement and discuss the relevant testing and laboratory
              capability before the test is scheduled.
            </p>
            <p className="mt-5 max-w-xl text-[0.9375rem] font-bold text-[#0f172a]">
              CCTL — Railway EMC Testing Support for Equipment and Systems
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
