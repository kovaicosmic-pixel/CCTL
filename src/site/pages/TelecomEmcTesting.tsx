import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  Phone,
  Router,
  Wifi,
  RadioTower,
  Cable,
  Cpu,
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

const equipmentTypes = [
  { icon: Phone, label: "Telecom communication equipment" },
  { icon: Router, label: "Network equipment" },
  { icon: Wifi, label: "Wireless-enabled electronic equipment" },
  { icon: RadioTower, label: "Routers and communication devices" },
  { icon: Cable, label: "Data and connectivity equipment" },
  { icon: Cpu, label: "Electronic equipment with communication interfaces" },
];

const infoNeeded = [
  "Equipment description",
  "Intended application",
  "Power supply details",
  "Communication interfaces",
  "External cables and peripherals",
  "Operating modes",
  "Applicable EMC standard",
  "Customer or regulatory test requirement",
];

export default function TelecomEmcTesting() {
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
            src="/images/telecom-wireless/DSC08114.webp"
            alt="CCTL semi-anechoic chamber used for telecom EMC testing"
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
              { name: "Telecom & Wireless Domain", path: "/services/telecom-wireless" },
              { name: "Telecom EMC Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            Telecom EMC Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            EMC Testing for Telecom and Communication Equipment
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Telecom equipment often combines high-speed electronics, switching circuits, power
            supplies and communication interfaces in a single product. These systems can both
            generate electromagnetic disturbances and be affected by disturbances from their
            operating environment.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL provides EMC testing for telecom and communication equipment according to the
            applicable product, customer or regulatory requirements.
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
          WHAT DOES TELECOM EMC TESTING CHECK
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The concept</Eyebrow>
            <h2 className="t-h2 mt-5">What Does Telecom EMC Testing Check?</h2>
            <p className="t-lead mt-6 max-w-2xl">The testing generally addresses two areas:</p>
          </Reveal>

          <div className="grid-gutter mt-8 grid gap-6 sm:grid-cols-2">
            <Reveal className="surface p-7">
              <h3 className="t-h3 text-lg">Electromagnetic Emissions</h3>
              <p className="t-body mt-3">
                The equipment is evaluated for electromagnetic disturbances generated during
                operation.
              </p>
              <p className="t-body mt-3">
                Depending on the applicable requirement, testing may include conducted and
                radiated emission measurements.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="surface p-7">
              <h3 className="t-h3 text-lg">Electromagnetic Immunity</h3>
              <p className="t-body mt-3">
                The equipment is exposed to specified electromagnetic disturbances while its
                functional performance is monitored.
              </p>
              <p className="t-body mt-3">
                The required immunity tests and acceptance criteria depend on the applicable
                product standard or customer specification.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT HAPPENS DURING THE TEST
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Happens During the Test?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The laboratory first establishes the required equipment configuration and operating
              condition. The test may then involve:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="surface mt-8 flex flex-col items-center gap-3 p-8">
            {["Product Setup", "Defined Operating Mode", "EMC Measurement or Disturbance Application", "Functional Monitoring"].map(
              (step) => (
                <div key={step} className="flex w-full flex-col items-center gap-3">
                  <DiagramBox>{step}</DiagramBox>
                  <ArrowDown className="h-4 w-4 text-ink-500" />
                </div>
              ),
            )}
            <DiagramBox accent>Result Evaluation</DiagramBox>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The exact setup, test methods, limits and performance criteria are determined by
              the applicable requirement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT EQUIPMENT CAN REQUIRE TELECOM EMC TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">What Equipment Can Require Telecom EMC Testing?</h2>
            <p className="t-lead mt-6 max-w-2xl">Examples include:</p>
          </Reveal>

          <div className="grid-gutter mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {equipmentTypes.map((e, i) => (
              <Reveal key={e.label} delay={(i % 3) * 0.08} className="surface p-6">
                <e.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <p className="t-body mt-4 text-[0.85rem] !text-ink-100">{e.label}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-8 max-w-2xl">
              The applicable standard should be confirmed based on the product and intended
              application.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DO WE NEED FROM YOU
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="t-h2 mt-5">What Do We Need From You?</h2>
            <p className="t-lead mt-6">Please provide:</p>
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
              A test plan or specification is particularly useful where customer-specific
              requirements apply.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CCTL TESTING CAPABILITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Capability</Eyebrow>
            <h2 className="t-h2 mt-5">CCTL Testing Capability</h2>
            <p className="t-lead mt-6">
              CCTL&rsquo;s Telecom &amp; Wireless domain currently covers EMC-related testing
              alongside telecom and wireless regulatory requirements, with testing references
              including TEC and applicable international requirements.
            </p>
            <p className="t-body mt-4">
              The exact test methods and laboratory configuration should be confirmed against
              your product requirement before scheduling.
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
              Need Telecom EMC Testing?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your product specification and applicable requirement with CCTL. We can
              review the required EMC tests and discuss the appropriate laboratory setup.
            </p>
            <p className="mt-5 max-w-xl text-[0.9375rem] font-bold text-[#0f172a]">
              CCTL — Telecom EMC Testing
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
