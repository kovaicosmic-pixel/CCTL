import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  Users,
  FlaskConical,
  Rocket,
  Signal,
  Radio,
  ClipboardList,
  ListChecks,
  PackageCheck,
  Settings2,
  BarChart3,
  FileCheck2,
  Box,
  Power,
  Cable,
  Puzzle,
  FileText,
  FileSearch,
  CheckSquare,
  ArrowDown,
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
import { company } from "../data/content";

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks — same primitives used on the EMC/EMI pages,
   defined locally to match that page-local convention.
   ──────────────────────────────────────────────────────────────────────── */

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
   Section data
   ──────────────────────────────────────────────────────────────────────── */

const whyMatters = [
  {
    icon: ShieldCheck,
    title: "Product Reliability",
    body: "Helps evaluate whether equipment can operate without causing unacceptable electromagnetic disturbances.",
  },
  {
    icon: Scale,
    title: "Regulatory Requirements",
    body: "Applicable markets and product categories may have electromagnetic compatibility requirements that must be addressed before placing products on the market.",
  },
  {
    icon: Users,
    title: "Customer Requirements",
    body: "OEMs, system integrators and customers may require EMC test evidence as part of product qualification.",
  },
  {
    icon: FlaskConical,
    title: "Product Development",
    body: "Testing can identify electromagnetic compatibility issues before a product reaches final production.",
  },
  {
    icon: Rocket,
    title: "Market Readiness",
    body: "Compliance evaluation can form part of the preparation required before introducing a product into its intended market.",
  },
];

const standardFactors = [
  "Product type",
  "Intended application",
  "Operating environment",
  "Industry",
  "Product category",
  "Target market",
  "Customer requirements",
  "Regulatory framework",
];

const standardsExamples = ["CISPR 25", "MIL-STD-461", "IEC 61000 series", "EN 55032", "EN 50121"];

const complianceProcess = [
  {
    icon: ClipboardList,
    title: "Requirement Review",
    body: "Understand the product, application and requested standard or test requirement.",
  },
  {
    icon: ListChecks,
    title: "Test Plan",
    body: "Identify the applicable tests and required configurations.",
  },
  {
    icon: PackageCheck,
    title: "Product Preparation",
    body: "Prepare the equipment, accessories, cables and operating modes required for testing.",
  },
  {
    icon: Settings2,
    title: "Laboratory Setup",
    body: "Configure the equipment under test according to the applicable test method.",
  },
  {
    icon: FlaskConical,
    title: "EMC Testing",
    body: "Perform the required emission and/or immunity evaluations.",
  },
  {
    icon: BarChart3,
    title: "Result Evaluation",
    body: "Evaluate measured results against the applicable requirements.",
  },
  {
    icon: FileCheck2,
    title: "Test Documentation",
    body: "Document the test results and observations according to the applicable testing process.",
  },
];

const preparationItems = [
  {
    icon: Box,
    title: "Product",
    body: "Provide the correct production-intent or representative configuration of the equipment.",
  },
  {
    icon: Power,
    title: "Power",
    body: "Provide the required power supply and power configuration.",
  },
  {
    icon: Cable,
    title: "Cables",
    body: "Bring the cables and cable lengths/configurations required for normal operation or the applicable test method.",
  },
  {
    icon: Puzzle,
    title: "Accessories",
    body: "Provide peripherals, loads and accessories required for the intended operating condition.",
  },
  {
    icon: Settings2,
    title: "Operating Modes",
    body: "Identify the operating modes that need to be evaluated.",
  },
  {
    icon: FileText,
    title: "Documentation",
    body: "Provide relevant technical information and the applicable test requirement if already known.",
  },
  {
    icon: FileSearch,
    title: "Previous Test Results",
    body: "If the product has previously failed or been tested elsewhere, provide previous results where available.",
  },
];

const configFactors = [
  "Cable arrangement",
  "Power configuration",
  "Connected peripherals",
  "Operating mode",
  "Product orientation",
  "Grounding/bonding arrangements",
  "Accessories",
  "Software or firmware operating state",
  "Load conditions",
];

const investigationAreas = [
  "Emission source",
  "Coupling path",
  "PCB design",
  "Power supply",
  "Filtering",
  "Shielding",
  "Grounding",
  "Cable configuration",
  "Product configuration",
  "Immunity susceptibility",
  "Operating condition",
];

const retestChanges = [
  "PCB revisions",
  "Power supply changes",
  "Filtering changes",
  "Shielding changes",
  "Cable changes",
  "Component changes",
  "Enclosure changes",
  "Grounding/bonding changes",
];

const industries: {
  icon: typeof Car;
  title: string;
  body: string;
  link: string;
  href?:
    | "/military/mil-std-461-testing"
    | "/civilian/cispr-testing"
    | "/railway/railway-emc-testing"
    | "/telecom/telecom-emc-testing";
  /** No dedicated overview page exists for this yet — link to its domain
   *  page instead. */
  domainSlug?: "automotive";
}[] = [
  {
    icon: Car,
    title: "Automotive",
    body: "Automotive electronic components may be evaluated against applicable automotive EMC requirements.",
    link: "Automotive EMC Testing",
    domainSlug: "automotive",
  },
  {
    icon: Plane,
    title: "Defence & Aerospace",
    body: "Defence and aerospace equipment may have specific EMC requirements based on the applicable specification.",
    link: "MIL-STD-461 Testing",
    href: "/military/mil-std-461-testing",
  },
  {
    icon: Factory,
    title: "Civilian & Commercial Electronics",
    body: "Commercial and civilian products may be evaluated against applicable CISPR, IEC or EN requirements.",
    link: "CISPR Testing",
    href: "/civilian/cispr-testing",
  },
  {
    icon: TrainFront,
    title: "Railway",
    body: "Railway equipment may require evaluation against applicable railway EMC requirements.",
    link: "Railway EMC Testing",
    href: "/railway/railway-emc-testing",
  },
  {
    icon: Phone,
    title: "Telecom & Wireless",
    body: "Telecommunication and wireless equipment may have applicable EMC and RF requirements.",
    link: "Telecom EMC Testing",
    href: "/telecom/telecom-emc-testing",
  },
];

const labPhotos = [
  { src: "/images/chamber.webp", title: "CCTL EMC Chamber", caption: "Semi-anechoic chamber used for applicable EMC evaluations." },
  { src: "/images/explore/RE102 setup.webp", title: "Radiated Emissions Setup", caption: "Antenna and equipment-under-test table configured for a radiated emissions measurement." },
  { src: "/images/explore/BCI_setup.webp", title: "Conducted Test Setup", caption: "Bench setup used for a conducted EMC test." },
  { src: "/images/explore/control_room.webp", title: "Control Room", caption: "Control desk with measurement instrumentation and test software." },
  { src: "/images/automotive/RE main pic .webp", title: "Automotive Test Setup", caption: "Automotive equipment configured inside the chamber for an EMC evaluation." },
  { src: "/images/mil-aero/AZ7_7709 2023-09-11 06_28_36.webp", title: "Military Test Setup", caption: "Bench and measurement instruments configured for a military EMC test." },
  { src: "/images/telecom-wireless/DSC08033.webp", title: "RF Test Setup", caption: "Antenna positioned on an automated mount inside the chamber for an RF evaluation." },
];

const documentationItems = [
  "Equipment identification",
  "Test configuration",
  "Test conditions",
  "Applied test methods",
  "Measurement results",
  "Observations",
  "Applicable limits",
  "Test outcome",
];

const faqs = [
  {
    q: "What is EMC compliance testing?",
    a: "EMC compliance testing evaluates whether a product meets the applicable electromagnetic compatibility requirements defined by the relevant standard or specification.",
  },
  {
    q: "Is EMC compliance testing the same as EMC testing?",
    a: "They overlap, but the purpose is different. EMC testing is the broader testing concept, while compliance testing specifically evaluates a product against applicable requirements and limits.",
  },
  {
    q: "How do I know which EMC standard applies to my product?",
    a: "The applicable requirement depends on the product type, application, operating environment, target market and other factors. CCTL can discuss the requirement based on the product information provided.",
  },
  {
    q: "Does EMC compliance testing include both emissions and immunity?",
    a: "It can. The required tests depend on the applicable standard and product category.",
  },
  {
    q: "What should I bring for EMC compliance testing?",
    a: "The required product configuration, power supply, cables, accessories, operating information and relevant technical documentation should be prepared according to the applicable test requirement.",
  },
  {
    q: "What happens if my product does not meet an EMC limit?",
    a: "The result can be investigated to understand the emission or immunity issue. Depending on the problem, engineering changes may be required followed by appropriate re-testing.",
  },
  {
    q: "Can I test a prototype?",
    a: "Prototype or pre-production testing may be useful during product development. The suitability of the product configuration for formal compliance testing should be discussed based on the intended requirement.",
  },
  {
    q: "Can previous test results be considered?",
    a: "Previous test results can be useful when planning further testing or investigating an issue. Provide them to the laboratory when available.",
  },
  {
    q: "Do I need to know the standard before contacting CCTL?",
    a: "No. If you are unsure about the applicable requirement, provide the product type, application and intended market so the testing requirement can be discussed.",
  },
  {
    q: "Does passing EMC testing automatically mean regulatory approval?",
    a: "No. EMC test results are one part of the overall compliance process. Regulatory requirements and certification/market-access obligations depend on the product and target market.",
  },
];

const coimbatore = company.locations.find((l) => l.id === "coimbatore")!;
const bangalore = company.locations.find((l) => l.id === "bangalore")!;

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */

export default function EmcComplianceTesting() {
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
            src="/images/explore/control_room.webp"
            alt="CCTL control room and measurement instrumentation used for EMC compliance testing"
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
              { name: "EMC Compliance Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMC Compliance Testing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Evaluate Your Product Against Applicable EMC Requirements
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            EMC compliance testing evaluates whether electrical and electronic equipment meets
            the applicable electromagnetic compatibility requirements defined by relevant
            standards and regulations.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Cosmic Compliance Test Lab (CCTL) provides EMC testing services to help manufacturers
            evaluate their products against applicable requirements before market introduction,
            certification or customer submission. The exact tests depend on the product,
            application, intended market and applicable standard.
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
                Request Compliance Testing
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. WHAT DOES EMC COMPLIANCE TESTING MEAN
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>The concept</Eyebrow>
              <h2 className="t-h2 mt-5">From Product Requirement to Compliance Evaluation</h2>
              <p className="t-lead mt-6">
                EMC compliance is not simply one test. A product may need to be evaluated for
                different electromagnetic emission and immunity requirements depending on its
                application and applicable standard.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-small mt-6 max-w-xl border-l-2 border-cyan-glow/40 pl-4">
                The applicable test methods and limits depend on the product and the standard
                being applied. CCTL can help identify the relevant testing requirements based on
                the information provided for the product.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="surface flex flex-col items-center gap-3 p-8 sm:p-10">
            {[
              "Product",
              "Application",
              "Target Market",
              "Applicable Standard",
              "Test Requirements",
              "EMC Testing",
              "Result Evaluation",
            ].map((step, i, arr) => (
              <div key={step} className="flex w-full flex-col items-center gap-3">
                <DiagramBox accent={i === arr.length - 1}>{step}</DiagramBox>
                {i < arr.length - 1 && <ArrowDown className="h-4 w-4 text-ink-500" />}
              </div>
            ))}
            <ArrowDown className="h-4 w-4 text-ink-500" />
            <DiagramBox accent>Compliance Readiness</DiagramBox>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. WHY EMC COMPLIANCE MATTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Why it matters</Eyebrow>
            <h2 className="t-h2 mt-5">Why Test EMC Compliance?</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {whyMatters.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08} className="surface p-7">
                <item.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{item.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. WHAT EMC COMPLIANCE TESTING CAN INCLUDE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Emission and immunity evaluation</Eyebrow>
            <h2 className="t-h2 mt-5">What EMC Compliance Testing Can Include</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Depending on the applicable requirement, compliance evaluation may include:
            </p>
          </Reveal>

          <div className="grid-gutter mt-10 grid gap-8 sm:grid-cols-2">
            <Reveal className="surface p-7">
              <Signal className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
              <h3 className="t-h3 mt-4 text-lg">Emissions</h3>
              <p className="t-body mt-2">
                Evaluation of unwanted electromagnetic emissions from the equipment. Examples may
                include:
              </p>
              <ul className="mt-4 space-y-2">
                {["Conducted emissions", "Radiated emissions", "Other applicable emission measurements"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-100">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="surface p-7">
              <Radio className="h-6 w-6 text-violet-glow" strokeWidth={1.6} />
              <h3 className="t-h3 mt-4 text-lg">Immunity</h3>
              <p className="t-body mt-2">
                Evaluation of the equipment&rsquo;s response to specified electromagnetic
                disturbances. Depending on the applicable standard, this can include tests such
                as:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Electrostatic discharge",
                  "Radiated RF immunity",
                  "Electrical fast transients",
                  "Surge",
                  "Conducted RF immunity",
                  "Power-frequency magnetic field",
                  "Voltage dips/interruption",
                  "Other applicable immunity tests",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-100">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-glow" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-3">
            <p className="t-small">
              The actual test list is determined by the applicable product standard and test
              requirement.
            </p>
            <Link
              to="/services/emc-testing"
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
            >
              Learn about EMC Testing
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. CHOOSING THE APPLICABLE STANDARD
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>The most useful question</Eyebrow>
            <h2 className="t-h2 mt-5">Which EMC Standard Applies to My Product?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The applicable standard is determined by factors such as:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {standardFactors.map((f) => (
              <span
                key={f}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-medium text-ink-100"
              >
                {f}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16} className="surface mt-8 flex flex-col items-center gap-4 p-8">
            <ArrowDown className="h-5 w-5 text-ink-500" />
            <DiagramBox accent>Applicable Standard</DiagramBox>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {standardsExamples.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-3.5 py-1.5 text-[0.75rem] font-bold text-ink-100"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="t-small mt-1 max-w-lg text-center">
              Examples of standards supported within CCTL&rsquo;s existing service areas — not
              every listed standard applies to every product.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="surface glow-border mt-8 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-body max-w-lg">
              If you are unsure which requirement applies to your product, provide the product
              details and intended application so the testing requirement can be discussed before
              testing begins.
            </p>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Applicable Requirements
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. COMPLIANCE TESTING PROCESS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="t-h2 mt-5">How EMC Compliance Testing Works</h2>
          </Reveal>

          <ul className="mt-12">
            {complianceProcess.map((step, i) => (
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
          7. BEFORE COMING TO THE LAB
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Preparation</Eyebrow>
            <h2 className="t-h2 mt-5">How to Prepare Your Product for EMC Compliance Testing</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {preparationItems.map((item, i) => (
              <Reveal key={item.title} delay={(i % 4) * 0.07} className="surface p-6">
                <item.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{item.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-10 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The exact preparation requirements depend on the applicable test standard and
              product configuration.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. TEST CONFIGURATION MATTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>Configuration</Eyebrow>
              <h2 className="t-h2 mt-5">Why Product Configuration Matters During EMC Testing</h2>
              <p className="t-lead mt-6">
                EMC results can depend on how the product is configured. Factors can include:
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
              {configFactors.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-3.5 py-1.5 text-[0.75rem] font-medium text-ink-100"
                >
                  {f}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.16}>
              <p className="t-body mt-6 max-w-lg">
                The exact configuration should follow the applicable test method. This should
                emphasize that compliance testing must represent the intended product
                configuration appropriately.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="surface flex flex-col items-center gap-4 p-8 sm:p-10">
            <DiagramBox accent>Product</DiagramBox>
            <ArrowDown className="h-4 w-4 text-ink-500" />
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
              {["Power", "Cables", "Accessories", "Operating Mode", "Load"].map((f) => (
                <DiagramBox key={f}>{f}</DiagramBox>
              ))}
            </div>
            <ArrowDown className="h-4 w-4 text-ink-500" />
            <DiagramBox>Test Configuration</DiagramBox>
            <ArrowDown className="h-4 w-4 text-ink-500" />
            <DiagramBox accent>EMC Result</DiagramBox>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. WHAT HAPPENS IF THE PRODUCT DOES NOT MEET THE LIMIT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Outside the requirement</Eyebrow>
            <h2 className="t-h2 mt-5">When an EMC Test Result Is Outside the Requirement</h2>
            <p className="t-lead mt-6 max-w-2xl">
              If a measured result does not meet the applicable requirement, the next step is to
              understand the test result and determine the appropriate engineering response.
            </p>
            <p className="t-body mt-4 max-w-2xl text-ink-300">
              Depending on the issue, the manufacturer may need to investigate:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {investigationAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-medium text-ink-100"
              >
                {area}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-3">
            <p className="t-small max-w-lg">
              For EMI-related emission problems, our{" "}
              <Link to="/services/emi-testing" className="font-bold text-cyan-glow hover:underline">
                EMI Testing
              </Link>{" "}
              page covers source and coupling-path investigation in depth. Troubleshooting and
              design modification are separate engineering activities and are not automatically
              part of formal compliance testing unless specifically agreed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. COMPLIANCE RE-TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>After product modification</Eyebrow>
            <h2 className="t-h2 mt-5">Compliance Re-Testing</h2>
            <p className="t-lead mt-6 max-w-2xl">
              If changes are made following an EMC issue, the product may need additional
              evaluation. Possible changes can include:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-6 flex flex-wrap gap-2">
            {retestChanges.map((c) => (
              <span
                key={c}
                className="rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-4 py-2 text-[0.8rem] font-medium text-ink-100"
              >
                {c}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              The extent of re-testing depends on the nature of the product modification, the
              original test results and the applicable requirements.
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-8">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Re-Testing Requirements
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11. EMC COMPLIANCE FOR DIFFERENT INDUSTRIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Where it applies</Eyebrow>
            <h2 className="t-h2 mt-5">Compliance Requirements Depend on the Application</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.title} delay={(i % 3) * 0.08} className="surface p-6">
                <ind.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-4 text-base">{ind.title}</h3>
                <p className="t-body mt-2 text-[0.85rem]">{ind.body}</p>
                <div className="mt-5">
                  {ind.domainSlug ? (
                    <Link
                      to="/services/$slug"
                      params={{ slug: ind.domainSlug }}
                      className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                    >
                      {ind.link}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </Link>
                  ) : ind.href ? (
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
          12. CCTL COMPLIANCE TESTING CAPABILITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">EMC Testing at CCTL</h2>
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
          13. LOCATIONS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Where to find us</Eyebrow>
            <h2 className="t-h2 mt-5">Compliance Testing at Coimbatore &amp; Bangalore</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                label: "Coimbatore Laboratory",
                loc: coimbatore,
                embed:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.569600608087!2d77.0325545!3d11.0708602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f90018e334e5%3A0xb45fb98558d47a7d!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400856665!5m2!1sen!2sin",
              },
              {
                label: "Bangalore Laboratory",
                loc: bangalore,
                embed:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5225365777483!2d77.7017882!3d12.809474499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d1297622b09%3A0xce2dcc254274ad3c!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400916999!5m2!1sen!2sin",
              },
            ].map((card, i) => (
              <Reveal key={card.label} delay={i * 0.1} className="surface overflow-hidden">
                <iframe
                  title={`CCTL ${card.label} map`}
                  src={card.embed}
                  className="block h-[220px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="p-7">
                  <h3 className="t-h3 text-lg">{card.label}</h3>
                  <p className="t-body mt-3">{card.loc.address}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-8">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Contact CCTL
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          14. DOCUMENTATION AND TEST RESULTS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Test evidence</Eyebrow>
            <h2 className="t-h2 mt-5">Test Results and Documentation</h2>
            <p className="t-lead mt-6">
              EMC compliance testing produces documented test results for the evaluations
              performed. Depending on the agreed testing requirement, documentation can contain
              relevant information such as:
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {documentationItems.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" strokeWidth={1.8} />
                {item}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          15. FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="t-h2 mt-5">Frequently Asked Questions About EMC Compliance Testing</h2>
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
          16. FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Get started
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Preparing Your Product for EMC Compliance?
            </h2>
            <p className="mt-6 max-w-xl text-[1rem] font-semibold leading-relaxed text-[#0f172a]">
              Start with the right requirement and the right test plan.
            </p>
            <p className="mt-4 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Share your product details and applicable requirement with CCTL to discuss the
              appropriate EMC testing approach.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request EMC Compliance Testing
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
