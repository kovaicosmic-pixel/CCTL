import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  SearchCode,
  Cpu,
  Cable,
  ShieldAlert,
  Zap,
  Radio,
  Layers,
  FlaskConical,
  ArrowRight,
  CircleAlert,
  Settings2,
  Wrench,
} from "lucide-react";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

function Eyebrow({ children, dark = true }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={`meta inline-flex items-center gap-2 ${dark ? "" : "text-ink-500"}`}>
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

// ─── Section data ────────────────────────────────────────────────────────────

const commonCauses = [
  {
    icon: Cpu,
    title: "PCB Layout",
    body: "High-frequency signal traces routed over split ground planes, inadequate decoupling capacitor placement, or return current paths that create unintended loop antennas are common emission sources.",
  },
  {
    icon: Cable,
    title: "Cable and Connector Issues",
    body: "Unfiltered or unshielded cables act as efficient antennas. Long cable runs, missing ferrite clamps, and poorly terminated shield connections are frequent contributors to both emissions and immunity failures.",
  },
  {
    icon: Layers,
    title: "Grounding and Bonding",
    body: "Poor chassis bonding, isolated ground planes, or ground loops increase emission levels and reduce immunity. Every discontinuity in the ground structure is a potential EMC problem.",
  },
  {
    icon: Zap,
    title: "Power Supply Switching Noise",
    body: "Switched-mode power supplies generate harmonic-rich noise across a wide frequency range. Inadequate input/output filtering allows this noise to couple onto power and signal lines.",
  },
  {
    icon: ShieldAlert,
    title: "Shielding Gaps and Apertures",
    body: "Enclosure openings, connector cutouts, and seam gaps allow electromagnetic energy to escape or enter. The effectiveness of a shield depends on closing every aperture that is large relative to the wavelength of concern.",
  },
  {
    icon: Radio,
    title: "Unintended Radiating Structures",
    body: "Traces, cables, and mechanical parts can act as antennas when driven by common-mode noise currents. Identifying and damping these structures is a key part of emission troubleshooting.",
  },
];

const investigationSteps = [
  {
    icon: SearchCode,
    title: "Review Test Data",
    body: "Examine the test report to identify which frequencies, test methods, and product configurations produced the issue. Understanding the margin above or below the limit helps prioritise the investigation.",
  },
  {
    icon: CircleAlert,
    title: "Identify the Source",
    body: "Correlate failure frequencies with known switching frequencies, clock rates, or interface speeds inside the product. The source is often a switching converter, oscillator, or high-speed digital interface.",
  },
  {
    icon: Settings2,
    title: "Trace the Coupling Path",
    body: "Determine whether the energy is coupling through radiated or conducted paths, and whether the dominant mechanism is differential-mode or common-mode. This determines which mitigation approach to apply first.",
  },
  {
    icon: Wrench,
    title: "Apply Engineering Changes",
    body: "Targeted changes may include adding ferrite beads, improving filtering, closing shield apertures, improving cable bonding, adding decoupling capacitors, or modifying PCB layout. Changes should address the identified mechanism.",
  },
  {
    icon: FlaskConical,
    title: "Re-test to Verify",
    body: "After changes are made, verify the result with testing. Pre-compliance testing allows rapid iteration before committing to formal compliance re-testing.",
  },
];

const mitigationApproaches = [
  {
    title: "Filtering",
    body: "Add or improve line filters, EMI filters, ferrite components, or decoupling capacitors at noise sources and on power/signal lines.",
    tag: "Emissions / Immunity",
  },
  {
    title: "Shielding",
    body: "Improve enclosure continuity, close apertures with conductive gaskets, add shielded cable assemblies, or use board-level shields over noisy components.",
    tag: "Emissions / Immunity",
  },
  {
    title: "Grounding",
    body: "Improve chassis bonding continuity, reduce ground path impedance, correct ground loops, and ensure correct shield termination at each end.",
    tag: "Emissions / Immunity",
  },
  {
    title: "PCB Layout Changes",
    body: "Shorten high-frequency traces, add ground fills, improve return current path continuity, and reposition decoupling components closer to ICs.",
    tag: "Emissions",
  },
  {
    title: "Cable Management",
    body: "Add ferrite clamps to cables, improve shield bonding, reduce cable loop areas, or use twisted-pair configurations to cancel differential-mode currents.",
    tag: "Emissions / Immunity",
  },
  {
    title: "Component Substitution",
    body: "Spread-spectrum clocking, lower slew-rate drivers, or alternative power supply topologies may reduce broadband emission levels.",
    tag: "Emissions",
  },
];

const relatedServices = [
  { label: "EMC Pre-Compliance Testing", href: "/services/emc-pre-compliance-testing" as const },
  { label: "EMC Testing", href: "/services/emc-testing" as const },
  { label: "EMI Testing", href: "/services/emi-testing" as const },
  { label: "EMC Compliance Testing", href: "/services/emc-compliance-testing" as const },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EmcTroubleshooting() {
  return (
    <div className="bg-space-950">
      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative isolate overflow-hidden rounded-b-[2rem] bg-space-950"
        style={{ minHeight: "calc(100svh - 4.5rem)" }}
      >
        {/* Subtle gradient backdrop — no misleading chamber photo for a
            troubleshooting page which is a consultative/investigation service */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(26,108,245,0.14),transparent_55%),radial-gradient(ellipse_at_70%_30%,rgba(109,78,240,0.10),transparent_50%)]"
        />

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "EMC Troubleshooting" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMC Troubleshooting
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Investigating and Resolving EMC Test Failures
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            When a product does not meet an EMC requirement, the next step is to understand
            why — identifying the emission source, the coupling path, and the most effective
            engineering fix.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            CCTL supports manufacturers through pre-compliance testing and emission investigation,
            helping to identify problem areas so that targeted engineering changes can be made
            before formal compliance re-testing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Your EMC Issue
                <ArrowIcon />
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link
                to="/services/emc-pre-compliance-testing"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Pre-Compliance Testing
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT HAPPENS WHEN A PRODUCT FAILS EMC
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Understanding the result</Eyebrow>
            <h2 className="t-h2 mt-5">What Does It Mean When a Product Fails EMC Testing?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-lead mt-6 max-w-2xl">
              An EMC test failure means one or more measured results fell outside the applicable
              limit for the standard being evaluated. This does not necessarily mean the product
              is fundamentally non-compliant — it means an engineering investigation is required.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                heading: "Emissions failure",
                body: "The product radiates or conducts more electromagnetic energy than the applicable limit permits. The source of this energy must be identified and reduced.",
              },
              {
                heading: "Immunity failure",
                body: "The product's operation was affected when subjected to an electromagnetic disturbance. The susceptibility mechanism and affected function must be identified.",
              },
              {
                heading: "Marginal result",
                body: "The product passed but with very little margin to the limit. A marginal result on a pre-compliance test is a useful warning — the same product at a different configuration or temperature may fail.",
              },
            ].map((item, i) => (
              <Reveal key={item.heading} delay={i * 0.08} className="surface p-7">
                <h3 className="t-h3 text-base">{item.heading}</h3>
                <p className="t-body mt-3 text-[0.875rem]">{item.body}</p>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMMON CAUSES OF EMC FAILURES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Root causes</Eyebrow>
            <h2 className="t-h2 mt-5">Common Causes of EMC Test Failures</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Most EMC failures trace back to a small number of root causes. Understanding these
              helps focus the investigation efficiently.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {commonCauses.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08} className="surface p-7">
                <item.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-5 text-base">{item.title}</h3>
                <p className="t-body mt-3 text-[0.875rem]">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INVESTIGATION PROCESS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The investigation process</Eyebrow>
            <h2 className="t-h2 mt-5">How to Approach an EMC Failure</h2>
          </Reveal>

          <ul className="mt-12">
            {investigationSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07}>
                <li className="flex items-start gap-6 border-t border-line-strong/10 py-7 last:border-b">
                  <span className="num-chip mt-0.5 w-12 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <step.icon
                    className="mt-1 h-6 w-6 shrink-0 text-cyan-glow"
                    strokeWidth={1.6}
                  />
                  <div className="flex-1">
                    <p className="t-h3 text-lg">{step.title}</p>
                    <p className="t-body mt-2 text-[0.9rem]">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MITIGATION APPROACHES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Engineering responses</Eyebrow>
            <h2 className="t-h2 mt-5">Common EMC Mitigation Approaches</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The appropriate mitigation depends on the identified source and coupling path.
              Multiple approaches are often required.
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mitigationApproaches.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.07} className="surface p-7">
                <span className="meta rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-3 py-1 text-[0.65rem] text-cyan-glow">
                  {item.tag}
                </span>
                <h3 className="t-h3 mt-5 text-base">{item.title}</h3>
                <p className="t-body mt-3 text-[0.875rem]">{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-10 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              Mitigation effectiveness depends on the specific failure mechanism. Changes should
              be verified by testing — not assumed to have fixed the problem.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRE-COMPLIANCE TESTING FOR TROUBLESHOOTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>CCTL's role</Eyebrow>
              <h2 className="t-h2 mt-5">
                Using Pre-Compliance Testing to Support EMC Troubleshooting
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6">
                Pre-compliance testing allows manufacturers to investigate EMC behaviour at the
                laboratory before committing to formal compliance re-testing.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-8 space-y-5">
              {[
                "Quickly measure the effect of a design change without the cost of a full compliance test run",
                "Compare emission levels before and after a modification",
                "Identify which operating mode, cable configuration, or software state produces the worst-case emission",
                "Determine whether a proposed fix has sufficient margin before formal re-testing",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-[0.9rem] text-ink-100"
                >
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-cyan-glow" />
                  {item}
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.24} className="mt-10">
              <Magnetic strength={0.35}>
                <Link
                  to="/services/emc-pre-compliance-testing"
                  className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
                >
                  Learn About Pre-Compliance Testing
                  <ArrowIcon />
                </Link>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="surface p-8 sm:p-10">
            <Eyebrow>Important distinction</Eyebrow>
            <h3 className="t-h3 mt-5 text-xl">
              Troubleshooting vs. Compliance Testing
            </h3>
            <div className="mt-6 space-y-6">
              <div className="border-t border-line-strong/10 pt-6">
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-cyan-glow">
                  Pre-compliance / troubleshooting testing
                </p>
                <p className="t-body mt-2 text-[0.875rem]">
                  An engineering investigation tool. Used to understand EMC behaviour, compare
                  design variants, and verify fixes. Results are not used for regulatory
                  approval or customer certification submissions.
                </p>
              </div>
              <div className="border-t border-line-strong/10 pt-6">
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-violet-glow">
                  Formal compliance testing
                </p>
                <p className="t-body mt-2 text-[0.875rem]">
                  A documented evaluation against the applicable standard limits. Used for
                  regulatory submissions, CE/FCC declarations, or customer evidence. CCTL's
                  NABL accredited laboratory performs formal compliance testing.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT INFORMATION CCTL NEEDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Before you contact us</Eyebrow>
            <h2 className="t-h2 mt-5">What to Provide When Reporting an EMC Issue</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The more context you can provide, the faster CCTL can review the situation and
              suggest the right approach.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
          >
            {[
              "Product description and intended application",
              "Applicable EMC standard and test method",
              "Copy of the test report or failure data if available",
              "Frequencies or test methods where the failure occurred",
              "Product configuration during testing (cables, power, modes)",
              "Any changes already made since the failure",
              "PCB or enclosure information where relevant",
              "Target date for compliance resolution",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RELATED SERVICES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Related services</Eyebrow>
            <h2 className="t-h2 mt-5">Other CCTL Testing Services</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {relatedServices.map((svc) => (
              <Link
                key={svc.label}
                to={svc.href}
                className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
              >
                {svc.label}
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow dark={false}>Get started</Eyebrow>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Need Help with an EMC Failure?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share the test report and product details with CCTL. Our engineers can review
              the failure data and discuss the appropriate investigation and re-testing approach.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Contact CCTL
                <ArrowIcon />
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link
                to="/services/emc-pre-compliance-testing"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[#0f172a] underline decoration-[#0f172a]/30 underline-offset-4 hover:decoration-[#0f172a]"
              >
                Pre-Compliance Testing
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
