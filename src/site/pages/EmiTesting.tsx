import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Power,
  Zap,
  Clock,
  Cog,
  Cpu,
  Cable,
  CircuitBoard,
  ShieldAlert,
  Filter,
  Link2,
  RefreshCw,
  SearchCheck,
  Waypoints,
  RotateCcw,
  FileSearch,
  Settings2,
  Radio,
  Activity,
  FileCheck2,
  CheckSquare,
  ArrowDown,
  ArrowRight,
  Car,
  Plane,
  TrainFront,
  Phone,
  Factory,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks — same primitives used on the EMC Testing page,
   defined locally to match that page's convention.
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

/** Points at a page that doesn't exist on the site yet — muted, non-clickable,
 *  ready to become a real <Link> once that page is built. */
function PendingLink({ label }: { label: string }) {
  return (
    <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink-500">
      {label}
      <span className="rounded-full bg-line-strong/10 px-2 py-0.5 text-[0.56rem] font-bold uppercase tracking-[0.06em] text-ink-500/80">
        Coming soon
      </span>
    </span>
  );
}

function DiagramBox({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
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
   Section data
   ──────────────────────────────────────────────────────────────────────── */

const emiSources = [
  {
    icon: Power,
    title: "Switching Power Supplies",
    body: "High-frequency switching activity can produce unwanted electrical disturbances.",
  },
  {
    icon: Zap,
    title: "DC/DC Converters",
    body: "Fast switching transitions and current loops can contribute to conducted and radiated emissions.",
  },
  {
    icon: Clock,
    title: "Digital Clock Signals",
    body: "High-speed clock and data transitions can generate electromagnetic energy over a broad frequency range.",
  },
  {
    icon: Cog,
    title: "Motors and Switching Devices",
    body: "Motors, relays, contactors and switching components can create transient and electromagnetic disturbances.",
  },
  {
    icon: Cpu,
    title: "High-Speed Electronics",
    body: "Rapid signal transitions can create unwanted electromagnetic radiation and coupling.",
  },
  {
    icon: Cable,
    title: "Cables and Interconnections",
    body: "Cables can carry conducted disturbances and can also act as unintended antennas.",
  },
  {
    icon: CircuitBoard,
    title: "PCB Layout",
    body: "Poor return paths, large current loops and unsuitable routing can contribute to unwanted emissions.",
  },
  {
    icon: ShieldAlert,
    title: "Shielding and Grounding",
    body: "Inadequate shielding, grounding or bonding can allow unwanted electromagnetic energy to escape or enter sensitive circuits.",
  },
];

const measurementFlow = [
  { icon: Cpu, title: "Equipment Under Test" },
  { icon: Settings2, title: "Test Configuration" },
  { icon: Radio, title: "EMI Measurement" },
  { icon: Activity, title: "Frequency / Level Analysis" },
  { icon: FileCheck2, title: "Result Evaluation" },
];

const investigationSteps = [
  {
    icon: FileSearch,
    title: "Identify the Frequency",
    body: "Determine where the excessive emission occurs.",
  },
  {
    icon: RefreshCw,
    title: "Reproduce the Condition",
    body: "Identify the operating mode or configuration in which the emission appears.",
  },
  {
    icon: SearchCheck,
    title: "Investigate the Source",
    body: "Examine potential sources such as switching circuits, clocks, power electronics and other high-frequency activity.",
  },
  {
    icon: Waypoints,
    title: "Identify the Coupling Path",
    body: "Determine whether the disturbance is primarily conducted, radiated or associated with a combination of paths.",
  },
  {
    icon: Settings2,
    title: "Evaluate the Configuration",
    body: "Investigate cables, grounding, shielding, PCB layout and connected equipment.",
  },
  {
    icon: RotateCcw,
    title: "Re-Test",
    body: "Repeat the measurement after an appropriate design or configuration change.",
  },
];

const failReasons = [
  { icon: Zap, title: "Switching Noise", body: "Fast switching transitions can create high-frequency disturbances." },
  {
    icon: CircuitBoard,
    title: "Poor PCB Return Paths",
    body: "Uncontrolled current paths can increase unwanted electromagnetic radiation.",
  },
  {
    icon: RotateCcw,
    title: "Large Current Loops",
    body: "Large loop areas can increase magnetic-field coupling.",
  },
  { icon: Cable, title: "Cable Radiation", body: "Cables can unintentionally behave as antennas." },
  {
    icon: Filter,
    title: "Inadequate Filtering",
    body: "Insufficient filtering can allow unwanted high-frequency energy to propagate.",
  },
  {
    icon: ShieldAlert,
    title: "Shielding Problems",
    body: "Gaps, seams, cable entry points or unsuitable enclosure arrangements can contribute to radiation.",
  },
  {
    icon: Link2,
    title: "Grounding / Bonding Issues",
    body: "Poor grounding or bonding can create unwanted current paths.",
  },
  {
    icon: Power,
    title: "Power Supply Noise",
    body: "Power conversion circuits can contribute to conducted and radiated emissions.",
  },
  {
    icon: Settings2,
    title: "Product Configuration",
    body: "Cables, peripherals and operating modes can change emission behavior.",
  },
];

const troubleshootingAreas = [
  "PCB layout",
  "Power supply",
  "Switching circuits",
  "Clock circuits",
  "Cables",
  "Connectors",
  "Grounding",
  "Shielding",
  "Filtering",
  "Enclosure",
  "Operating mode",
  "Product configuration",
];

const preComplianceUseCases = [
  "Developing a new product",
  "Evaluating a prototype",
  "Making PCB revisions",
  "Changing a power supply",
  "Changing enclosure or shielding",
  "Modifying cables",
  "Investigating a previous failure",
  "Preparing for formal testing",
];

const industries: {
  icon: typeof Car;
  title: string;
  body: string;
  link: string;
  href?:
    | "/automotive/cispr-25-testing"
    | "/military/mil-std-461-testing"
    | "/civilian/cispr-testing"
    | "/railway/en-50121-testing"
    | "/telecom/telecom-emc-testing";
}[] = [
  {
    icon: Car,
    title: "Automotive Electronics",
    body: "Automotive electronic components and systems may require evaluation against applicable emission requirements.",
    link: "CISPR 25 Testing",
    href: "/automotive/cispr-25-testing",
  },
  {
    icon: Plane,
    title: "Defence & Aerospace",
    body: "Defence and aerospace equipment may require evaluation against applicable military or aerospace emission requirements.",
    link: "MIL-STD-461 Testing",
    href: "/military/mil-std-461-testing",
  },
  {
    icon: Factory,
    title: "Civilian & Commercial Electronics",
    body: "Electronic products may require applicable conducted and radiated emission evaluation.",
    link: "CISPR Testing",
    href: "/civilian/cispr-testing",
  },
  {
    icon: TrainFront,
    title: "Railway Electronics",
    body: "Railway equipment may be subject to applicable railway EMC emission requirements.",
    link: "EN 50121 Testing",
    href: "/railway/en-50121-testing",
  },
  {
    icon: Phone,
    title: "Telecom & Wireless",
    body: "Telecommunication and wireless equipment may have applicable emission and RF requirements.",
    link: "Telecom EMC Testing",
    href: "/telecom/telecom-emc-testing",
  },
];

const standards = ["CISPR 25", "MIL-STD-461", "CISPR", "IEC 61000", "EN 55032", "EN 50121"];

const labPhotos = [
  {
    src: "/images/explore/RE102 setup.webp",
    title: "Radiated Emissions Measurement",
    caption: "Antenna mast and equipment-under-test table used for a radiated emissions measurement inside the chamber.",
  },
  {
    src: "/images/explore/control_room.webp",
    title: "EMI Measurement & Control Room",
    caption: "Control desk with EMI receiver and measurement software used to acquire and record emission scans.",
  },
  {
    src: "/images/explore/re_main_setup.webp",
    title: "Equipment Under Test in Chamber",
    caption: "Test setup and antenna positioned inside the chamber for an emissions measurement.",
  },
  {
    src: "/images/automotive/RE main pic .webp",
    title: "Automotive Emission Test Setup",
    caption: "Automotive equipment configured for an emissions measurement inside the chamber.",
  },
  {
    src: "/images/mil-aero/AZ7_7709 2023-09-11 06_28_36.webp",
    title: "EMI Measurement Instrumentation",
    caption: "Bench-mounted receiver and RF instrumentation used for an EMI measurement.",
  },
  {
    src: "/images/telecom-wireless/DSC08033.webp",
    title: "Antenna Test Setup",
    caption: "Antenna positioned on an automated mount inside the chamber for an RF/EMI measurement.",
  },
  {
    src: "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
    title: "Railway Emission Test Setup",
    caption: "Railway equipment test arrangement inside the chamber for an emissions measurement.",
  },
];

const providedChecklist = [
  "Product/equipment under test",
  "Product model information",
  "Technical documentation",
  "Operating modes",
  "Power requirements",
  "Cable configuration",
  "Accessories required for normal operation",
  "Applicable standard, if known",
  "Previous test results, if investigating a failure",
  "Details of any known EMI issue",
];

const faqs = [
  {
    q: "What is EMI testing?",
    a: "EMI testing evaluates unwanted electromagnetic emissions generated by electrical and electronic equipment through conducted and radiated paths.",
  },
  {
    q: "What is the difference between conducted and radiated EMI?",
    a: "Conducted EMI travels through conductive connections such as applicable power or signal lines, while radiated EMI propagates through electromagnetic fields.",
  },
  {
    q: "What can cause excessive EMI?",
    a: "Potential sources include switching circuits, power supplies, digital clocks, PCB layouts, cables, connectors, grounding, shielding and other high-frequency circuits.",
  },
  {
    q: "How can an EMI problem be investigated?",
    a: "An investigation can involve identifying the problematic frequency, reproducing the operating condition, examining potential sources and coupling paths, modifying the configuration where appropriate and repeating measurements.",
  },
  {
    q: "Why do cables contribute to EMI?",
    a: "Cables can carry conducted disturbances and can also behave as unintended antennas, allowing electromagnetic energy to couple into or out of equipment.",
  },
  {
    q: "What is EMI pre-compliance testing?",
    a: "EMI pre-compliance testing is an early evaluation intended to identify potential emission problems before formal compliance testing.",
  },
  {
    q: "Can EMI testing help identify why my product failed?",
    a: "Testing and investigation can help identify emission characteristics and potential sources or coupling paths. The exact cause depends on the product and test configuration.",
  },
  {
    q: "Which standards apply to EMI testing?",
    a: "The applicable requirements depend on the product, industry, intended market and relevant standard. CCTL supports applicable standards based on its current testing capabilities and scope.",
  },
  {
    q: "What information should I provide before EMI testing?",
    a: "Product details, technical documentation, operating modes, power requirements, cable configuration, applicable standards and previous test results where relevant can help the laboratory understand the requirement.",
  },
  {
    q: "Where does CCTL provide EMI testing?",
    a: "CCTL operates laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
];

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */

export default function EmiTesting() {
  return (
    <div className="bg-space-950">
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative isolate overflow-hidden rounded-b-[2rem] bg-ink-100"
        style={{ minHeight: "calc(100svh - 4.5rem)" }}
      >
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/explore/RE102 setup.webp"
            alt="CCTL radiated emissions measurement setup used for EMI testing"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.85)] via-[rgba(7,13,24,0.66)] to-[rgba(7,13,24,0.9)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "EMI Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMI Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Identify, Measure and Investigate Electromagnetic Interference
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Electromagnetic Interference (EMI) can originate from electronic circuits, power
            systems, switching devices, cables and other components within a product. If
            uncontrolled, these unwanted electromagnetic disturbances can affect nearby equipment
            or contribute to product compliance failures.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Cosmic Compliance Test Lab (CCTL) provides EMI testing and emission measurement
            services to help manufacturers evaluate unwanted electromagnetic emissions and
            investigate potential interference problems.
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
                Request EMI Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. WHAT IS EMI
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>The concept</Eyebrow>
              <h2 className="t-h2 mt-5">What is Electromagnetic Interference?</h2>
              <p className="t-lead mt-6">
                Electromagnetic Interference is unwanted electromagnetic energy that can disturb
                the normal operation of electrical or electronic equipment.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-6">EMI can be:</p>
              <ul className="mt-4 space-y-2">
                {[
                  "Generated by the equipment itself",
                  "Introduced through power connections",
                  "Coupled through signal cables",
                  "Transmitted through interconnections",
                  "Radiated through electromagnetic fields",
                  "Generated by switching circuits or other electronic activity",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-100">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="t-body mt-6 max-w-xl">
                The objective of EMI testing is to measure and evaluate unwanted emissions under
                controlled conditions and identify potential sources of excessive interference.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="t-small mt-6 max-w-xl">
                Looking for the broader picture — emissions and immunity together? See our{" "}
                <Link to="/services/emc-testing" className="font-bold text-cyan-glow hover:underline">
                  EMC Testing
                </Link>{" "}
                overview.
              </p>
            </Reveal>
          </div>

          {/* Concept diagram: source → conducted/radiated → affected equipment */}
          <Reveal delay={0.1} className="surface flex flex-col items-center gap-4 p-8 sm:p-10">
            <DiagramBox accent>EMI Source</DiagramBox>
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <DiagramBox>Electromagnetic Energy</DiagramBox>
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <div className="grid w-full grid-cols-2 gap-4">
              <DiagramBox>Conducted Path</DiagramBox>
              <DiagramBox>Radiated Path</DiagramBox>
            </div>
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <DiagramBox accent>Affected Equipment</DiagramBox>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. WHERE DOES EMI COME FROM
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Sources</Eyebrow>
            <h2 className="t-h2 mt-5">Common Sources of EMI</h2>
            <p className="t-lead mt-6 max-w-2xl">
              EMI can originate from many parts of an electrical or electronic product.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {emiSources.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.07} className="surface p-6">
                <s.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{s.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. HOW DOES EMI TRAVEL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Interference paths</Eyebrow>
            <h2 className="t-h2 mt-5">Conducted and Radiated Interference Paths</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Understanding the path of interference is essential when investigating an EMI
              problem.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal className="surface p-8">
              <h3 className="t-h3 text-xl">Conducted Interference</h3>
              <p className="t-body mt-3">Conducted interference travels through conductive paths.</p>
              <p className="t-body mt-4 text-ink-300">Typical paths may include:</p>
              <ul className="mt-3 space-y-2">
                {["Power lines", "Signal cables", "Ground connections", "Interconnections", "Other conductive paths"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-100">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="surface p-8">
              <h3 className="t-h3 text-xl">Radiated Interference</h3>
              <p className="t-body mt-3">
                Radiated interference travels through electromagnetic fields from the source to
                surrounding equipment or structures.
              </p>
              <p className="t-body mt-4 text-ink-300">Possible coupling mechanisms can involve:</p>
              <ul className="mt-3 space-y-2">
                {["Product enclosures", "Cables", "PCB structures", "Connectors", "Other unintended antenna structures"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-100">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-glow" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          </div>

          {/* Path diagram */}
          <Reveal delay={0.15} className="surface mt-10 p-8 sm:p-10">
            <div className="flex flex-col items-center gap-4">
              <DiagramBox accent>EMI Source</DiagramBox>
              <ArrowDown className="h-5 w-5 text-ink-500" />
              <div className="grid w-full max-w-2xl grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <DiagramBox>Conducted Path</DiagramBox>
                  <span className="t-small">Power / Signal Cables</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <DiagramBox>Radiated Path</DiagramBox>
                  <span className="t-small">EM Field</span>
                </div>
              </div>
              <ArrowDown className="h-5 w-5 text-ink-500" />
              <DiagramBox>Receiving System</DiagramBox>
              <ArrowDown className="h-5 w-5 text-ink-500" />
              <DiagramBox accent>Interference</DiagramBox>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. CONDUCTED EMI
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>Conducted path</Eyebrow>
              <h2 className="t-h2 mt-5">Conducted EMI Testing</h2>
              <p className="t-lead mt-6">
                Conducted EMI testing evaluates unwanted electromagnetic disturbances present on
                applicable conductive connections of the equipment under test.
              </p>
              <p className="t-body mt-4">
                Conducted emissions can propagate through connected electrical systems and may
                affect other equipment sharing those connections.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-6 text-ink-300">
                During an EMI investigation, engineers may consider:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Frequency of the disturbance",
                  "Operating condition",
                  "Product configuration",
                  "Power configuration",
                  "Cable arrangement",
                  "Switching activity",
                  "Grounding",
                  "Filtering",
                  "Coupling path",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-3.5 py-1.5 text-[0.75rem] font-medium text-ink-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* No verified conducted-emissions photograph exists — technical diagram instead */}
          <Reveal delay={0.1} className="surface flex flex-col items-center gap-4 p-8 sm:p-10">
            <DiagramBox>Equipment Under Test</DiagramBox>
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <div className="grid w-full grid-cols-2 gap-4">
              <DiagramBox>Power Line</DiagramBox>
              <DiagramBox>Signal Line</DiagramBox>
            </div>
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <DiagramBox accent>Conducted Emission Receiver</DiagramBox>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. RADIATED EMI
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal className="order-2 overflow-hidden rounded-[1.5rem] lg:order-1">
            <img
              src="/images/explore/re_main_setup.webp"
              alt="CCTL radiated EMI test setup with equipment under test inside the chamber"
              className="w-full object-cover"
              loading="lazy"
            />
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>Radiated path</Eyebrow>
              <h2 className="t-h2 mt-5">Radiated EMI Testing</h2>
              <p className="t-lead mt-6">
                Radiated EMI testing evaluates electromagnetic energy emitted from equipment into
                the surrounding environment.
              </p>
              <p className="t-body mt-4">
                The measurement environment and test configuration are controlled according to
                the applicable test method.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-6 text-ink-300">
                Radiated emission problems may be associated with:
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  "High-frequency circuits",
                  "Cables",
                  "PCB traces",
                  "Enclosures",
                  "Connectors",
                  "Switching devices",
                  "Inadequate shielding",
                  "Unintended antenna structures",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-100">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. HOW EMI IS MEASURED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Measurement</Eyebrow>
            <h2 className="t-h2 mt-5">How is EMI Measured?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Measurements can be evaluated across the applicable frequency range and against
              limits defined by the relevant test requirement.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {measurementFlow.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} className="relative">
                <div className="surface flex h-full flex-col items-start p-6">
                  <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                  <step.icon className="mt-4 h-7 w-7 text-cyan-glow" strokeWidth={1.6} />
                  <h3 className="t-h3 mt-4 text-base">{step.title}</h3>
                </div>
                {i < measurementFlow.length - 1 && (
                  <span className="pointer-events-none absolute right-[-1.3rem] top-1/2 z-10 hidden -translate-y-1/2 text-ink-500/40 lg:block">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. INVESTIGATION PROCESS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Investigation</Eyebrow>
            <h2 className="t-h2 mt-5">From Emission Peak to Possible Source</h2>
            <p className="t-lead mt-6 max-w-2xl">
              An excessive emission is a symptom that may require investigation. A simplified
              investigation process can be:
            </p>
          </Reveal>

          <ul className="mt-12">
            {investigationSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="group flex items-center gap-6 border-t border-line-strong/10 py-6 last:border-b">
                  <span className="num-chip w-12">{String(i + 1).padStart(2, "0")}</span>
                  <step.icon className="h-6 w-6 shrink-0 text-cyan-glow" strokeWidth={1.6} />
                  <div className="flex-1">
                    <p className="t-h3 text-lg">{step.title}</p>
                    <p className="t-body mt-1 text-[0.85rem]">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. WHY PRODUCTS FAIL EMI TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Root causes</Eyebrow>
            <h2 className="t-h2 mt-5">Common Reasons for Excessive EMI</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {failReasons.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 0.08} className="surface p-6">
                <r.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{r.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{r.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-10 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The actual cause of an EMI problem depends on the product design, operating
              condition and test configuration. Investigation should be based on measured
              behavior rather than assumptions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. EMI TROUBLESHOOTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Getting to the root cause</Eyebrow>
            <h2 className="t-h2 mt-5">EMI Troubleshooting and Investigation</h2>
            <p className="t-lead mt-6 max-w-2xl">
              EMI troubleshooting is the process of narrowing down the source and coupling
              mechanism responsible for excessive electromagnetic emissions.
            </p>
            <p className="t-body mt-4 max-w-2xl text-ink-300">Possible investigation areas include:</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {troubleshootingAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-medium text-ink-100"
              >
                {area}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.2} className="surface glow-border mt-10 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-h3 max-w-lg text-xl">Have an unexplained EMI issue?</p>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Your EMI Problem
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11. PRE-COMPLIANCE EMI TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x rounded-[2rem] bg-ink-100 py-16 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Early-stage engineering
            </span>
            <h2 className="font-display mt-5 text-[clamp(1.95rem,3.6vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0f172a]">
              EMI Pre-Compliance Testing
            </h2>
            <p className="mt-6 max-w-2xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Pre-compliance EMI testing can help manufacturers identify potential emission
              problems before formal compliance testing.
            </p>
            <p className="mt-4 max-w-2xl text-[0.9125rem] font-semibold text-[#0f172a]">
              It can be useful when:
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <Link
              to="/services/emc-pre-compliance-testing"
              className="group mt-3 inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
            >
              See EMC Pre-Compliance Testing
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {preComplianceUseCases.map((item) => (
              <div key={item} className="flex items-start gap-3 border-t border-[#0f172a]/10 py-3 text-sm text-[#0f172a]">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15}>
            <blockquote className="mt-10 max-w-2xl border-l-2 border-cyan-glow/60 pl-5 text-[1.05rem] font-medium italic leading-relaxed text-[#0f172a]">
              Finding an EMI issue early can provide an opportunity to investigate the cause while
              product design changes are still practical.
            </blockquote>
          </Reveal>

          <Reveal delay={0.2} className="mt-9">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Pre-Compliance Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          12. EMI TESTING FOR INDUSTRIES (kept short — see /services/emc-testing
          for the full industry breakdown)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Where it applies</Eyebrow>
            <h2 className="t-h2 mt-5">EMI Testing Across Product Applications</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.title} delay={(i % 3) * 0.08} className="surface p-6">
                <ind.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{ind.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{ind.body}</p>
                <div className="mt-5">
                  {ind.href ? (
                    <Link
                      to={ind.href}
                      className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                    >
                      {ind.link}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <PendingLink label={ind.link} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          13. EMI STANDARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Applicable requirements</Eyebrow>
            <h2 className="t-h2 mt-5">Applicable EMI Requirements</h2>
            <p className="t-lead mt-6">
              EMI limits and test methods depend on the product, industry, intended market and
              applicable standard.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {standards.map((s) => (
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
              CCTL states accreditation and standards coverage only as confirmed by its current
              accreditation scope and laboratory capability. See{" "}
              <Link to="/services/emc-testing" className="font-bold text-cyan-glow hover:underline">
                EMC Testing
              </Link>{" "}
              for a broader standards overview.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          14. EMI LABORATORY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">EMI Testing at CCTL</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-2 lg:grid-cols-4">
            {labPhotos.map((photo, i) => (
              <motion.figure
                key={photo.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.1, ease }}
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
          15. WHAT CUSTOMERS SHOULD PROVIDE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Getting started</Eyebrow>
            <h2 className="t-h2 mt-5">Before Starting EMI Testing</h2>
            <p className="t-lead mt-6">
              Where applicable, customers should be prepared to provide:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {providedChecklist.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8">
              Requirements may vary depending on the product and applicable test method.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          16. FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="t-h2 mt-5">Frequently Asked Questions About EMI Testing</h2>
          </Reveal>

          <Reveal delay={0.1} className="surface mt-10 px-6 sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`} className="border-line-strong/10">
                  <AccordionTrigger className="t-h3 py-6 text-base hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="t-body text-[0.9rem]">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          17. FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Get started
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Finding an EMI Problem?
            </h2>
            <p className="mt-6 max-w-xl text-[1rem] font-semibold leading-relaxed text-[#0f172a]">
              Let&rsquo;s measure it, understand it and investigate the possible cause.
            </p>
            <p className="mt-4 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your product information and EMI testing requirement with the CCTL team.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request EMI Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[#0f172a] underline decoration-[#0f172a]/30 underline-offset-4 hover:decoration-[#0f172a]"
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
