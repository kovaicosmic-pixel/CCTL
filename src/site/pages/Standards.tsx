import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Shield, Car, TrainFront, Wifi, Cpu } from "lucide-react";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

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
      initial={reduced ? undefined : { opacity: 0, y: 28 }}
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

// ─── Standards data — only standards with a dedicated page at CCTL ────────────

const standardGroups = [
  {
    sector: "Automotive",
    icon: Car,
    color: "text-cyan-glow",
    description:
      "EMC standards for automotive electronic components and vehicle sub-assemblies. Applies to ECUs, wiring harnesses, sensors, and modules intended for use in road vehicles.",
    standards: [
      {
        code: "CISPR 25",
        title: "Radio Disturbance Characteristics — Automotive Components",
        summary:
          "Measures conducted and radiated radio disturbance emissions from automotive electrical and electronic components. Commonly specified by OEMs for component approval.",
        href: "/automotive/cispr-25-testing" as const,
      },
      {
        code: "ISO 11452",
        title: "Component Immunity Testing — Road Vehicles",
        summary:
          "Series of immunity test methods for automotive electronic components. Covers bulk current injection (BCI), stripline, TEM cell, and other RF immunity methods.",
        href: "/automotive/iso-11452-testing" as const,
      },
    ],
    domainHref: "/services/automotive" as const,
  },
  {
    sector: "Military & Aerospace",
    icon: Shield,
    color: "text-violet-glow",
    description:
      "US Department of Defense standards for EMI control in military and aerospace equipment. Applied to electronic subsystems in ground, shipboard, airborne, and space platforms.",
    standards: [
      {
        code: "MIL-STD-461",
        title: "Electromagnetic Interference Characteristics — Military Equipment",
        summary:
          "Specifies EMI emission and susceptibility requirements for military electronic equipment. Covers conducted emissions (CE101, CE102), radiated emissions (RE101, RE102, RE103), and susceptibility methods.",
        href: "/military/mil-std-461-testing" as const,
      },
      {
        code: "MIL-STD-704",
        title: "Aircraft Electric Power Characteristics",
        summary:
          "Defines the electrical power characteristics of aircraft systems and specifies the requirements that aircraft-powered equipment must meet for power compatibility.",
        href: "/military/mil-std-704-testing" as const,
      },
    ],
    domainHref: "/services/mil-aero" as const,
  },
  {
    sector: "Civilian & Industrial",
    icon: Cpu,
    color: "text-cyan-glow",
    description:
      "CISPR and IEC standards for commercial, industrial, and consumer electronic equipment. Cover both emissions (what the product radiates) and immunity (how it withstands disturbances).",
    standards: [
      {
        code: "CISPR",
        title: "Radio Disturbance — Civilian Equipment",
        summary:
          "CISPR publishes a series of standards specifying emission limits for various equipment categories including CISPR 11 (industrial/scientific/medical), CISPR 22/32 (IT and multimedia), and others.",
        href: "/civilian/cispr-testing" as const,
      },
      {
        code: "IEC 61000",
        title: "Electromagnetic Compatibility — General Standards",
        summary:
          "Comprehensive series covering EMC definitions, environment, limits, testing, and measurement techniques. The IEC 61000-4 immunity sub-series (ESD, EFT/burst, surge, radiated RF, conducted RF) is widely referenced in product standards.",
        href: "/civilian/iec-61000-testing" as const,
      },
      {
        code: "EN 55032",
        title: "Electromagnetic Disturbances — Multimedia Equipment",
        summary:
          "Specifies conducted and radiated emission requirements for multimedia equipment (based on CISPR 32). Replaced EN 55022 and EN 55013 for information technology and audio/video equipment.",
        href: "/civilian/en-55032-testing" as const,
      },
    ],
    domainHref: "/services/civilian" as const,
  },
  {
    sector: "Railway",
    icon: TrainFront,
    color: "text-cyan-glow",
    description:
      "European railway EMC standards covering rolling stock, signalling, fixed installations, and the overall railway electromagnetic environment.",
    standards: [
      {
        code: "EN 50121",
        title: "Railway EMC — Series",
        summary:
          "Multi-part European standard covering EMC requirements for railway applications. Parts cover the whole railway system, rolling stock, fixed installations, and signalling and telecommunications equipment.",
        href: "/railway/en-50121-testing" as const,
      },
    ],
    domainHref: "/services/railway" as const,
    also: "Also supports: Railway EMC Testing overview",
    alsoHref: "/railway/railway-emc-testing" as const,
  },
  {
    sector: "Telecom & Wireless",
    icon: Wifi,
    color: "text-cyan-glow",
    description:
      "Standards for telecom equipment EMC and RF requirements. Applies to communication terminals, networking equipment, and wireless devices.",
    standards: [
      {
        code: "Telecom EMC",
        title: "EMC Testing for Telecom Equipment",
        summary:
          "EMC requirements for telecom equipment vary by product type, target market, and regulatory framework. Applicable standards may include ETSI EN series, CISPR 22/32, and IEC 61000 immunity tests.",
        href: "/telecom/telecom-emc-testing" as const,
      },
      {
        code: "Wireless / RF",
        title: "Wireless and RF Testing",
        summary:
          "RF testing evaluates transmitter characteristics, spurious emissions, and regulatory requirements for wireless devices (Wi-Fi, Bluetooth, and other technologies). Distinct from EMC testing.",
        href: "/telecom/wireless-testing" as const,
      },
    ],
    domainHref: "/services/telecom-wireless" as const,
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Standards() {
  return (
    <div className="bg-space-950 pt-[4.5rem]">
      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="container-x pb-10 pt-16 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Standards" },
            ]}
            className="text-ink-500"
          />

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease }}
            className="font-display mt-8 max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-ink-100"
          >
            EMC Standards Supported by CCTL
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease }}
            className="t-lead mt-6 max-w-2xl"
          >
            This page lists the EMC and related standards for which CCTL has dedicated testing
            pages. Each standard entry links to detailed information about how CCTL performs
            that testing.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease }}
            className="t-small mt-4 max-w-2xl border-l-2 border-cyan-glow/40 pl-4"
          >
            CCTL only lists standards within its confirmed accreditation scope and laboratory
            capability. If your required standard is not listed, contact CCTL to discuss.
          </motion.p>
        </div>
      </section>

      {/* ── STANDARD GROUPS ──────────────────────────────────────────── */}
      {standardGroups.map((group, gi) => (
        <section
          key={group.sector}
          className={`container-x section-y ${gi % 2 === 0 ? "bg-space-950" : "bg-space-900"}`}
        >
          <div className="mx-auto max-w-5xl">
            {/* Sector header */}
            <Reveal className="flex items-start gap-5 border-b border-line-strong/10 pb-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-strong/10 bg-line-strong/[0.04]">
                <group.icon className={`h-6 w-6 ${group.color}`} strokeWidth={1.6} />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="t-h2 text-2xl">{group.sector}</h2>
                  <Link
                    to={group.domainHref}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-500 transition-colors hover:border-cyan-glow/40 hover:text-cyan-glow"
                  >
                    Domain overview
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <p className="t-body mt-3 max-w-2xl">{group.description}</p>
              </div>
            </Reveal>

            {/* Individual standards */}
            <div className="mt-8 space-y-5">
              {group.standards.map((std, si) => (
                <Reveal key={std.code} delay={si * 0.08}>
                  <Link
                    to={std.href}
                    className="group surface surface-hover block rounded-[1.25rem] p-7 transition-all duration-300"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[0.8rem] font-bold text-cyan-glow">
                            {std.code}
                          </span>
                          <span className="h-px w-6 bg-line-strong/20" />
                          <h3 className="text-[0.95rem] font-bold text-ink-100">
                            {std.title}
                          </h3>
                        </div>
                        <p className="t-body mt-3 max-w-2xl text-[0.875rem]">
                          {std.summary}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors group-hover:bg-cyan-glow/20">
                        View testing details
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}

              {/* "Also" link if present */}
              {group.also && group.alsoHref && (
                <Reveal delay={group.standards.length * 0.08}>
                  <Link
                    to={group.alsoHref}
                    className="group inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-500 transition-colors hover:text-cyan-glow"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {group.also}
                  </Link>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ── SERVICE CROSS-LINKS ───────────────────────────────────────── */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Related services
            </span>
            <h2 className="t-h2 mt-5">Broader EMC Testing Services</h2>
            <p className="t-lead mt-6 max-w-2xl">
              In addition to standard-specific testing, CCTL provides the following
              cross-sector services.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "EMC Testing",
                body: "Comprehensive electromagnetic compatibility evaluation covering emissions and immunity across all sectors.",
                href: "/services/emc-testing",
              },
              {
                title: "EMI Testing",
                body: "Focused electromagnetic interference emission measurement and investigation.",
                href: "/services/emi-testing",
              },
              {
                title: "EMC Compliance Testing",
                body: "Formal product evaluation against applicable EMC requirements for regulatory and customer submissions.",
                href: "/services/emc-compliance-testing",
              },
              {
                title: "EMC Pre-Compliance Testing",
                body: "Engineering-stage testing to identify and resolve EMC issues before formal compliance testing.",
                href: "/services/emc-pre-compliance-testing",
              },
              {
                title: "EMC Troubleshooting",
                body: "Investigation and resolution support for products that have failed EMC testing.",
                href: "/services/emc-troubleshooting",
              },
            ].map((svc, i) => (
              <Reveal key={svc.title} delay={i * 0.07}>
                <Link
                  to={svc.href}
                  className="group surface surface-hover block h-full rounded-[1.25rem] p-7"
                >
                  <h3 className="t-h3 text-base">{svc.title}</h3>
                  <p className="t-body mt-3 text-[0.875rem]">{svc.body}</p>
                  <span className="mt-5 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-widest text-ink-500 transition-colors group-hover:text-cyan-glow">
                    Learn more
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Not sure which standard applies?
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Tell CCTL About Your Product
            </h2>
            <p className="mt-5 max-w-xl text-[0.9125rem] leading-[1.75] text-[#475569]">
              If you are unsure which standard applies to your product, share the product
              type, intended application, and target market with our team. We can help
              identify the applicable testing requirement.
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
                to="/services"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[#0f172a] underline decoration-[#0f172a]/30 underline-offset-4 hover:decoration-[#0f172a]"
              >
                All Services
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
