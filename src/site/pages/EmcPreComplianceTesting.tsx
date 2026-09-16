import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, FlaskConical, FileCheck2 } from "lucide-react";
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
   Content — synthesized only from facts already verified elsewhere on the
   site (FAQ answer in content.ts, the MIL-AERO "Pre-Compliance Testing"
   service offering, the EMI Testing page's pre-compliance section, and the
   "How to Pass EMC Test" blog post). Reworded where reused on another page,
   to avoid literal duplicate content between pages.
   ──────────────────────────────────────────────────────────────────────── */

const usefulWhen = [
  "Developing a new product",
  "Evaluating a prototype",
  "Making PCB revisions",
  "Changing a power supply",
  "Changing enclosure or shielding",
  "Modifying cables",
  "Investigating a previous failure",
  "Preparing for formal testing",
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "Pre-Compliance Consulting",
    body: "Early design evaluation to identify potential issues before they become more serious.",
  },
  {
    icon: FlaskConical,
    title: "In-Lab Testing",
    body: "Applying the appropriate test methods under the guidance of experienced engineers.",
  },
  {
    icon: FileCheck2,
    title: "Post-Test Analysis",
    body: "A report covering findings, observations and recommendations to guide further development.",
  },
];

export default function EmcPreComplianceTesting() {
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
            src="/images/explore/BCI_setup.webp"
            alt="CCTL laboratory bench used for early-stage EMC evaluation"
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
              { name: "EMC Testing", path: "/services/emc-testing" },
              { name: "Pre-Compliance Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMC Pre-Compliance Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Identify EMC Issues Before Formal Compliance Testing
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL offers pre-compliance EMC testing services to identify potential issues early in
            the design cycle. This helps reduce costly rework and supports a smoother path through
            formal compliance testing.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Our engineers review the results and provide detailed recommendations for design
            improvements, so problems can be investigated while changes are still practical.
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
                Request Pre-Compliance Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT IS IT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>The concept</Eyebrow>
            <h2 className="t-h2 mt-5">What Is EMC Pre-Compliance Testing?</h2>
            <p className="t-lead mt-6">
              Pre-compliance testing helps manufacturers identify potential EMC issues before
              formal compliance testing, allowing design problems to be investigated earlier.
            </p>
            <p className="t-body mt-4">
              This proactive approach reduces the risk of costly rework, project delays and
              failed compliance in later stages of development.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/services/emc-testing"
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
            >
              Learn about EMC Testing
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/services/emc-compliance-testing"
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
            >
              Learn about EMC Compliance Testing
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHEN IS IT USEFUL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">When Is Pre-Compliance Testing Useful?</h2>
            <p className="t-lead mt-6">It can be useful when:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {usefulWhen.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 border-t border-line-strong/10 py-3 text-sm text-ink-100"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="t-h2 mt-5">How Pre-Compliance Testing Works</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid gap-6 md:grid-cols-3">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} className="surface p-7">
                <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                <step.icon className="mt-4 h-7 w-7 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-lg">{step.title}</h3>
                <p className="t-body mt-3">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY EARLY TESTING MATTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x rounded-[2rem] bg-ink-100 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Why it matters
            </span>
            <blockquote className="mt-6 max-w-2xl border-l-2 border-cyan-glow/60 pl-5 text-[1.15rem] font-medium italic leading-relaxed text-[#0f172a]">
              Identifying a potential issue early gives you the opportunity to investigate the
              cause and adjust the design while changes are still practical to make.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-space-900 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Get started</Eyebrow>
            <h2 className="t-h2 mt-5 max-w-2xl">Need Pre-Compliance Testing?</h2>
            <p className="t-lead mt-6 max-w-xl">
              Share your product details with CCTL to discuss pre-compliance testing before you
              move to formal EMC evaluation.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request Pre-Compliance Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-ink-100 underline decoration-ink-500/30 underline-offset-4 hover:decoration-ink-100"
              >
                Contact CCTL
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
