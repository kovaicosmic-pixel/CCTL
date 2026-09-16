import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wifi,
  Bluetooth,
  Radio,
  Cpu,
  Boxes,
  Headphones,
  Phone,
  Antenna,
  FileSearch,
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

const productTypes = [
  { icon: Wifi, label: "Wi-Fi devices" },
  { icon: Bluetooth, label: "Bluetooth products" },
  { icon: Radio, label: "Short-range wireless devices" },
  { icon: Cpu, label: "Wireless modules" },
  { icon: Boxes, label: "IoT devices" },
  { icon: Headphones, label: "Wireless accessories" },
  { icon: Phone, label: "Communication and connectivity equipment" },
  { icon: Antenna, label: "Other products containing RF transmitters" },
];

const evaluationAreas = [
  "Radio-frequency emissions",
  "Transmitted power and operating characteristics",
  "Occupied or permitted operating characteristics",
  "Frequency-related performance",
  "Spurious or unwanted emissions",
  "Receiver-related requirements where applicable",
  "EMC characteristics associated with the product",
];

const standardsWorkedWith = ["TEC", "ETSI", "WPC-related requirements", "CE/FCC-oriented compliance"];
const specificStandards = ["ETSI EN 300 220", "ETSI EN 300 330", "ETSI EN 300 328"];

const infoNeeded = [
  "Product model and description",
  "Wireless technology",
  "Operating frequency/bands",
  "Maximum transmit power",
  "Antenna details",
  "Antenna type and gain",
  "Wireless modes and configurations",
  "Hardware and firmware version",
  "Target country or regulatory market",
  "Applicable regulatory requirement, if already available",
];

export default function WirelessTesting() {
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
            src="/images/domain-telecom.webp"
            alt="Wireless devices under RF test inside CCTL's semi-anechoic chamber"
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
              { name: "Telecom EMC Testing", path: "/telecom/telecom-emc-testing" },
              { name: "Wireless Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            Wireless Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Wireless &amp; RF Testing for Connected Devices
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Wireless products must meet the radio and regulatory requirements applicable to their
            operating technology, frequency range and target market.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL provides testing support for wireless and Bluetooth-enabled products, helping
            manufacturers evaluate applicable RF and compliance requirements before regulatory
            submission or market entry.
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
          WHICH PRODUCTS MAY NEED WIRELESS TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Applicability</Eyebrow>
            <h2 className="t-h2 mt-5">Which Products May Need Wireless Testing?</h2>
            <p className="t-lead mt-6 max-w-2xl">Wireless testing can apply to products such as:</p>
          </Reveal>

          <div className="grid-gutter mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {productTypes.map((p, i) => (
              <Reveal key={p.label} delay={(i % 4) * 0.07} className="surface flex flex-col items-start p-5">
                <p.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <p className="mt-4 text-[0.85rem] font-semibold leading-snug !text-ink-100">
                  {p.label}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-8 max-w-2xl">
              The required tests depend on the wireless technology, operating band, transmitter
              characteristics and destination market.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT DOES WIRELESS TESTING EVALUATE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>The test itself</Eyebrow>
            <h2 className="t-h2 mt-5">What Does Wireless Testing Evaluate?</h2>
            <p className="t-lead mt-6">
              Depending on the applicable requirement, testing may examine characteristics such
              as:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {evaluationAreas.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl">
              The exact measurements are determined by the applicable regulatory or product
              standard.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STANDARDS WE WORK WITH
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Standards</Eyebrow>
            <h2 className="t-h2 mt-5">Standards We Work With</h2>
            <p className="t-lead mt-6">
              CCTL&rsquo;s current Telecom &amp; Wireless service references requirements and
              standards including <strong className="text-ink-100">TEC</strong>,{" "}
              <strong className="text-ink-100">ETSI</strong>,{" "}
              <strong className="text-ink-100">WPC-related requirements</strong>, and CE/FCC-oriented
              compliance testing.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {standardsWorkedWith.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-bold text-ink-100"
              >
                {s}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-body mt-6 max-w-2xl">
              The current published service also lists standards such as:
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-3 flex flex-wrap gap-2">
            {specificStandards.map((s) => (
              <span
                key={s}
                className="rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-4 py-2 font-mono text-[0.75rem] font-bold text-cyan-glow"
              >
                {s}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.24}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The applicable standard must be selected according to the actual wireless
              technology and target market.
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
            <p className="t-lead mt-6">Before testing, provide:</p>
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
              For products with multiple wireless technologies, provide the details for each
              transmitter.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WIRELESS PRODUCT REQUIREMENT REVIEW
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal className="surface p-8">
            <Eyebrow>Before scheduling</Eyebrow>
            <h2 className="t-h3 mt-5 text-xl">Wireless Product Requirement Review</h2>
            <p className="t-body mt-4">
              A product may contain more than one radio technology or may combine wireless
              functionality with other digital electronics.
            </p>
            <p className="t-body mt-4">
              For this reason, the complete product configuration should be reviewed before
              testing so that the relevant RF and EMC requirements can be identified.
            </p>
            <p className="t-body mt-4">
              Send CCTL your product specifications and wireless details. Our team can review the
              requirement and identify the appropriate testing before the laboratory work begins.
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
              Need Wireless or RF Testing?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your product specification and applicable requirement with CCTL to determine
              the appropriate testing.
            </p>
            <p className="mt-5 max-w-xl text-[0.9375rem] font-bold text-[#0f172a]">
              CCTL — Wireless &amp; RF Testing
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
