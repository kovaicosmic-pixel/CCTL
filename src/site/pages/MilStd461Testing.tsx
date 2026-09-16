import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Settings2, FlaskConical, Activity, FileCheck2 } from "lucide-react";
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

const emissionTypes = [
  { code: "CE", label: "Conducted Emissions" },
  { code: "RE", label: "Radiated Emissions" },
];

const susceptibilityTypes = [
  { code: "CS", label: "Conducted Susceptibility" },
  { code: "RS", label: "Radiated Susceptibility" },
];

const testMethodGroups = [
  { title: "Conducted Emissions", methods: ["CE101", "CE102", "CE106"] },
  { title: "Radiated Emissions", methods: ["RE101", "RE102", "RE103"] },
  { title: "Conducted Susceptibility", methods: ["CS101", "CS114", "CS115", "CS116", "CS118"] },
  { title: "Radiated Susceptibility", methods: ["RS101"] },
];

const labSteps = [
  { icon: ClipboardList, title: "Configure equipment under test" },
  { icon: Settings2, title: "Apply the required electrical or electromagnetic condition" },
  { icon: FlaskConical, title: "Measure the relevant response" },
  { icon: Activity, title: "Monitor equipment operation where applicable" },
  { icon: FileCheck2, title: "Record the resulting data for evaluation" },
];

const galleryPhotos = [
  {
    src: "/images/mil-aero/AZ7_7709 2023-09-11 06_28_36.webp",
    title: "Conducted Emissions Setup",
    caption: "Bench test setup used for applicable MIL-STD-461 conducted measurements.",
  },
  {
    src: "/images/mil-aero/Radiated immunity test .webp",
    title: "Radiated Susceptibility Setup",
    caption: "Antenna and test table configured inside the chamber for a radiated susceptibility (RS) test.",
  },
  {
    src: "/images/mil-aero/AZ7_7722 2023-09-11 06_29_56.webp",
    title: "Control & Measurement Area",
    caption: "Receiver and control desk used to run and record MIL-STD-461 measurements.",
  },
];

const beforeTesting = [
  "Equipment identification",
  "Applicable MIL-STD-461 revision",
  "Required test methods",
  "Equipment power requirements",
  "Interface information",
  "Operating conditions",
  "Customer/platform specification",
];

export default function MilStd461Testing() {
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
            src="/images/mil-aero/WhatsApp Image 2024-04-23 at 5.30.59 PM (1).webp"
            alt="CCTL shielded chamber used for MIL-STD-461 testing"
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
              { name: "MIL / AERO Domain", path: "/services/mil-aero" },
              { name: "MIL-STD-461 Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            MIL-STD-461 Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Electromagnetic Interference Testing for Military Equipment
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            MIL-STD-461 specifies requirements and verification methods for controlling the
            electromagnetic interference (EMI) emission and susceptibility characteristics of
            applicable electronic, electrical and electromechanical equipment and subsystems.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL provides applicable MIL-STD-461 testing for military and aerospace equipment,
            with the required test methods selected according to the equipment, platform and
            applicable procurement or program requirement.
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
                Request Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EMISSION / SUSCEPTIBILITY TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <div className="grid-gutter grid gap-8 lg:grid-cols-2">
            <Reveal className="surface p-8">
              <Eyebrow>Emissions</Eyebrow>
              <h2 className="t-h3 mt-5 text-xl">Emission Testing</h2>
              <p className="t-body mt-3">
                The laboratory measures electromagnetic energy generated by the equipment under
                test. Applicable emission evaluations can include:
              </p>
              <ul className="mt-5 space-y-3">
                {emissionTypes.map((e) => (
                  <li key={e.code} className="flex items-start gap-3 text-sm text-ink-100">
                    <span className="num-chip shrink-0">{e.code}</span>
                    {e.label}
                  </li>
                ))}
              </ul>
              <p className="t-small mt-5">
                The selected methods depend on the applicable MIL-STD-461 requirements.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="surface p-8">
              <Eyebrow>Susceptibility</Eyebrow>
              <h2 className="t-h3 mt-5 text-xl">Susceptibility Testing</h2>
              <p className="t-body mt-3">
                The laboratory exposes the equipment to controlled electromagnetic disturbances
                and monitors its response. Applicable susceptibility evaluations can include:
              </p>
              <ul className="mt-5 space-y-3">
                {susceptibilityTypes.map((s) => (
                  <li key={s.code} className="flex items-start gap-3 text-sm text-ink-100">
                    <span className="num-chip shrink-0">{s.code}</span>
                    {s.label}
                  </li>
                ))}
              </ul>
              <p className="t-small mt-5">
                The required methods and test levels depend on the equipment and applicable
                requirement.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TEST METHODS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Test methods</Eyebrow>
            <h2 className="t-h2 mt-5">MIL-STD-461 Test Methods</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL&rsquo;s existing MIL-AERO service information identifies methods including:
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testMethodGroups.map((g, i) => (
              <Reveal key={g.title} delay={(i % 2) * 0.1} className="surface p-7">
                <h3 className="t-h3 text-lg">{g.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.methods.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-3.5 py-1.5 font-mono text-[0.75rem] font-bold text-cyan-glow"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The applicable test matrix should be established from the applicable revision of
              MIL-STD-461 and the customer&rsquo;s equipment/platform requirement. MIL-STD-461G
              contains additional methods and applicability varies by equipment category, so the
              complete list should not be treated as applicable to every product.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT HAPPENS IN THE LABORATORY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Happens in the Laboratory?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL configures the equipment under test according to the selected test method,
              applies the required electrical or electromagnetic condition, measures the relevant
              response, monitors equipment operation where applicable, and records the resulting
              data for evaluation against the specified requirement.
            </p>
          </Reveal>

          <ul className="mt-12">
            {labSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="flex items-center gap-6 border-t border-line-strong/10 py-6 last:border-b">
                  <span className="num-chip w-12">{String(i + 1).padStart(2, "0")}</span>
                  <step.icon className="h-6 w-6 shrink-0 text-cyan-glow" strokeWidth={1.6} />
                  <p className="t-h3 flex-1 text-base sm:text-lg">{step.title}</p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.4}>
            <p className="t-body mt-8 max-w-2xl">
              MIL-STD-461 can apply to electronic, electrical and electromechanical equipment and
              subsystems intended for applicable DoD programs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CCTL MIL-AERO TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">CCTL MIL-AERO Testing</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-3">
            {galleryPhotos.map((photo, i) => (
              <motion.figure
                key={photo.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
                className="plate group relative aspect-[4/3] overflow-hidden rounded-[1.25rem]"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4">
                  <p className="text-[0.85rem] font-bold text-white">{photo.title}</p>
                  <p className="mt-1 text-[0.7rem] leading-snug text-white/75">{photo.caption}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BEFORE TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
            <h2 className="t-h2 mt-5">Before Testing</h2>
            <p className="t-lead mt-6">Please provide, where applicable:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {beforeTesting.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              If the required test matrix is not yet established, CCTL can review the available
              requirement and equipment information before testing is planned.
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
              Request MIL-STD-461 Testing
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Submit your equipment details and applicable requirement to CCTL to discuss the
              required test program.
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
