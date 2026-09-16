import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { TriangleAlert, FileSearch } from "lucide-react";
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

const applicabilityAreas = [
  "Railway environment",
  "Rolling stock and on-board equipment",
  "Railway signalling and telecommunications",
  "Emissions from railway equipment",
  "Immunity of railway equipment",
  "Fixed railway installations",
];

const testInvolves = [
  {
    title: "Emission measurements",
    body: "Measurement of electromagnetic disturbances produced by the equipment.",
  },
  {
    title: "Immunity testing",
    body: "Exposure of the equipment to defined electromagnetic disturbances while monitoring its functional performance.",
  },
  {
    title: "Result evaluation",
    body: "Comparison of measured results and observed equipment behaviour against the applicable limits and performance requirements.",
  },
];

const infoNeeded = [
  "Equipment name and description",
  "Intended railway application",
  "On-board, trackside, or fixed installation information",
  "Applicable EN 50121 part, if already specified",
  "Power supply details",
  "External cables and interfaces",
  "Operating modes",
  "Functional performance requirements",
  "Customer or system-level test specification",
  "Existing test plan, if available",
];

export default function En50121Testing() {
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
            alt="CCTL semi-anechoic chamber used for EN 50121 railway EMC testing"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.86)] via-[rgba(7,13,24,0.68)] to-[rgba(7,13,24,0.92)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Railway Domain", path: "/services/railway" },
              { name: "Railway EMC Testing", path: "/railway/railway-emc-testing" },
              { name: "EN 50121 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EN 50121 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Railway EMC Testing According to EN 50121 Requirements
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            EN 50121 is a railway electromagnetic compatibility standard series covering EMC
            requirements for railway applications. The applicable requirements depend on the type
            of railway equipment, its location, and its intended application.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL supports customers in reviewing their applicable EN 50121 requirements and
            identifying the relevant EMC testing for their equipment.
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
                Request EN 50121 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHICH EN 50121 REQUIREMENT APPLIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">Which EN 50121 Requirement Applies?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The EN 50121 series addresses different railway EMC environments and equipment
              categories. Depending on the application, requirements may relate to areas such as:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {applicabilityAreas.map((a) => (
              <span
                key={a}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-medium text-ink-100"
              >
                {a}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The applicable part should be selected based on the equipment and its intended
              railway application rather than simply specifying &ldquo;EN 50121 testing.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES EN 50121 TESTING INVOLVE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does EN 50121 Testing Involve?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The laboratory testing depends on the applicable part and the equipment under
              evaluation. The equipment is configured and operated according to the agreed test
              conditions. Applicable EMC measurements and immunity tests are then performed, and
              the equipment&rsquo;s functional response is monitored during testing.
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid gap-6 md:grid-cols-3">
            {testInvolves.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.1} className="surface p-7">
                <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-4 text-lg">{t.title}</h3>
                <p className="t-body mt-3">{t.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="t-small mt-8 max-w-2xl">
              The exact test methods and acceptance criteria are determined by the applicable EN
              50121 part, product requirement, and test plan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES CCTL NEED BEFORE TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="t-h2 mt-5">What Does CCTL Need Before Testing?</h2>
            <p className="t-lead mt-6">To determine the appropriate EN 50121 testing, please provide:</p>
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
          EN 50121 REQUIREMENT REVIEW — callout
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal className="surface flex flex-col gap-4 border-l-4 border-l-amber-400/70 p-8">
            <div className="flex items-center gap-3">
              <TriangleAlert className="h-6 w-6 shrink-0 text-amber-400" strokeWidth={1.8} />
              <h2 className="t-h3 text-lg">EN 50121 Requirement Review</h2>
            </div>
            <p className="t-body">
              If your customer specification or project requirement simply states{" "}
              <strong className="text-ink-100">&ldquo;EN 50121,&rdquo;</strong> the specific
              applicable part and test requirements should be identified before the test is
              started.
            </p>
            <p className="t-body">
              CCTL can review the requirement and discuss the applicable testing for your
              equipment before scheduling the laboratory work.
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
              Is EN 50121 Testing Required for Your Product?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              If you are developing or supplying equipment for a railway application and your
              requirement references EN 50121, send CCTL your product details and applicable
              specification. We can review the requirement with you and determine the appropriate
              testing and laboratory configuration.
            </p>
            <p className="mt-5 max-w-xl text-[0.9375rem] font-bold text-[#0f172a]">
              CCTL — EN 50121 Railway EMC Testing
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request EN 50121 Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
