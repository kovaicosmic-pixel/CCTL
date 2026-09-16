import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Cable,
  Signal,
  PlugZap,
  Radio,
  Zap,
  Activity,
  TrendingUp,
  Waves,
  ClipboardCheck,
  ClipboardList,
  ListChecks,
  Settings2,
  FlaskConical,
  FileCheck2,
  ShieldCheck,
  Factory,
  Cpu,
  Users,
  CircleCheckBig,
  MapPin,
  Car,
  Plane,
  TrainFront,
  Phone,
  Wifi,
  Gauge,
  ArrowRight,
  ChevronDown,
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

/* Spring-like easing — shared with ServiceDetail.tsx for a consistent feel. */
const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────
   Local building blocks
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

/** A CTA that points to a page that does not exist on the site yet.
 *  Rendered as a muted, non-clickable pill instead of a broken link — the
 *  `href` is kept on the data so it can be wired up to a real <Link> the
 *  moment that page is built. */
function PendingLink({ label }: { label: string }) {
  return (
    <span className="inline-flex cursor-default items-center gap-2 rounded-full border border-line-strong/10 bg-line-strong/[0.04] px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-500">
      {label}
      <span className="rounded-full bg-line-strong/10 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-ink-500/80">
        Coming soon
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Flow-diagram building blocks — used by the "What is EMC Testing?" diagram.
   A DiagramNode is a fixed-width, centred pill with an icon; nodes are joined
   by a FlowConnector (a vertical rule terminated by a chevron) so the diagram
   reads as a clean top-to-bottom sequence rather than floating boxes.
   ──────────────────────────────────────────────────────────────────────── */

type NodeTone = "neutral" | "cyan" | "violet";

const nodeToneStyles: Record<NodeTone, { wrap: string; icon: string }> = {
  neutral: {
    wrap: "border-line-strong/12 bg-line-strong/[0.05] text-ink-100",
    icon: "text-ink-300",
  },
  cyan: {
    wrap: "border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_24px_-8px_rgba(26,108,245,0.5)]",
    icon: "text-cyan-glow",
  },
  violet: {
    wrap: "border-violet-glow/40 bg-violet-glow/10 text-violet-glow shadow-[0_0_24px_-8px_rgba(109,78,240,0.5)]",
    icon: "text-violet-glow",
  },
};

function DiagramNode({
  icon: Icon,
  label,
  tone = "neutral",
  glow = false,
  className = "",
}: {
  icon: typeof Cable;
  label: string;
  tone?: NodeTone;
  glow?: boolean;
  className?: string;
}) {
  const styles = nodeToneStyles[tone];
  return (
    <div
      className={`flex w-full max-w-[19rem] items-center gap-3 rounded-2xl border px-5 py-3.5 text-left ${styles.wrap} ${
        glow ? "" : ""
      } ${className}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] ${styles.icon}`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <span className="text-[0.85rem] font-bold leading-snug">{label}</span>
    </div>
  );
}

function FlowConnector() {
  return (
    <span aria-hidden className="flex flex-col items-center py-1.5">
      <span className="h-6 w-px bg-gradient-to-b from-line-strong/10 to-cyan-glow/40" />
      <ChevronDown className="-mt-1 h-4 w-4 text-cyan-glow" strokeWidth={2} />
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Section data
   ──────────────────────────────────────────────────────────────────────── */

const emcServices: {
  icon: typeof Cable;
  title: string;
  body: string;
  href?: "/services/emc-pre-compliance-testing";
}[] = [
  {
    icon: Cable,
    title: "Conducted Emissions Testing",
    body: "Evaluates unwanted electromagnetic disturbances conducted from equipment through applicable power or signal connections.",
  },
  {
    icon: Signal,
    title: "Radiated Emissions Testing",
    body: "Measures electromagnetic energy radiated from the equipment under test and evaluates the measured emissions against applicable limits.",
  },
  {
    icon: PlugZap,
    title: "Conducted Immunity Testing",
    body: "Evaluates the ability of equipment to continue operating correctly when subjected to specified conducted electromagnetic disturbances.",
  },
  {
    icon: Radio,
    title: "Radiated Immunity Testing",
    body: "Evaluates equipment performance when exposed to controlled electromagnetic fields.",
  },
  {
    icon: Zap,
    title: "Electrostatic Discharge (ESD) Testing",
    body: "Evaluates product immunity to electrostatic discharge events that may occur during handling or normal operation.",
  },
  {
    icon: Activity,
    title: "Electrical Fast Transient / Burst Testing",
    body: "Evaluates equipment immunity to fast transient disturbances that may occur on electrical power and signal lines.",
  },
  {
    icon: TrendingUp,
    title: "Surge Testing",
    body: "Evaluates equipment response to higher-energy transient disturbances according to the applicable testing requirements.",
  },
  {
    icon: Waves,
    title: "Harmonics and Flicker Testing",
    body: "Evaluates applicable power-related disturbances generated by electrical and electronic equipment.",
  },
  {
    icon: ClipboardCheck,
    title: "EMC Pre-Compliance Testing",
    body: "Helps manufacturers identify potential EMC issues before formal compliance testing and allows design problems to be investigated earlier.",
    href: "/services/emc-pre-compliance-testing",
  },
];

const industries: {
  name: string;
  body: string;
  image: string;
  cta: string;
  href?:
    | "/military/mil-std-461-testing"
    | "/civilian/cispr-testing"
    | "/railway/railway-emc-testing"
    | "/telecom/telecom-emc-testing";
  /** No dedicated overview page exists for this industry yet — link to its
   *  domain page instead, which already covers it and links to its standard
   *  pages (e.g. CISPR 25 / ISO 11452 for automotive). */
  domainSlug?: "automotive";
}[] = [
  {
    name: "Automotive EMC Testing",
    body: "EMC testing for automotive components and electronic systems against applicable automotive requirements.",
    image: "/images/automotive/RE main pic .webp",
    cta: "Explore Automotive EMC Testing",
    domainSlug: "automotive",
  },
  {
    name: "Defence & Aerospace EMC Testing",
    body: "Testing support for defence and aerospace equipment against applicable military and aerospace EMC requirements.",
    image: "/images/mil-aero/AZ7_7709 2023-09-11 06_28_36.webp",
    cta: "Explore Defence & Aerospace Testing",
    href: "/military/mil-std-461-testing",
  },
  {
    name: "Civilian & Commercial EMC Testing",
    body: "EMC testing for electrical and electronic products according to applicable civilian and commercial requirements.",
    image: "/images/civilian/Civil.webp",
    cta: "Explore Civilian EMC Testing",
    href: "/civilian/cispr-testing",
  },
  {
    name: "Railway EMC Testing",
    body: "EMC testing for railway equipment and systems according to applicable railway requirements.",
    image: "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
    cta: "Explore Railway EMC Testing",
    href: "/railway/railway-emc-testing",
  },
  {
    name: "Telecom & Wireless Testing",
    body: "Testing support for telecommunications and wireless equipment requiring applicable EMC and RF-related evaluation.",
    image: "/images/telecom-wireless/DSC08033.webp",
    cta: "Explore Telecom & Wireless Testing",
    href: "/telecom/telecom-emc-testing",
  },
];

const standardsGroups: {
  title: string;
  items: string[];
  links: {
    label: string;
    href?:
      | "/automotive/cispr-25-testing"
      | "/automotive/iso-11452-testing"
      | "/military/mil-std-461-testing"
      | "/military/mil-std-704-testing"
      | "/civilian/cispr-testing"
      | "/civilian/iec-61000-testing"
      | "/civilian/en-55032-testing"
      | "/railway/en-50121-testing";
  }[];
}[] = [
  {
    title: "Automotive",
    items: ["CISPR 25", "ISO 11452", "Other applicable automotive requirements supported by CCTL"],
    links: [
      { label: "CISPR 25 Testing", href: "/automotive/cispr-25-testing" },
      { label: "ISO 11452 Testing", href: "/automotive/iso-11452-testing" },
    ],
  },
  {
    title: "Military / Defence",
    items: ["MIL-STD-461", "MIL-STD-704", "Other applicable military requirements supported by CCTL"],
    links: [
      { label: "MIL-STD-461 Testing", href: "/military/mil-std-461-testing" },
      { label: "MIL-STD-704 Testing", href: "/military/mil-std-704-testing" },
    ],
  },
  {
    title: "Civilian",
    items: ["CISPR", "IEC 61000", "EN 55032", "Other applicable requirements supported by CCTL"],
    links: [
      { label: "CISPR Testing", href: "/civilian/cispr-testing" },
      { label: "IEC 61000 Testing", href: "/civilian/iec-61000-testing" },
      { label: "EN 55032 Testing", href: "/civilian/en-55032-testing" },
    ],
  },
  {
    title: "Railway",
    items: ["EN 50121", "Other applicable railway requirements supported by CCTL"],
    links: [{ label: "EN 50121 Testing", href: "/railway/en-50121-testing" }],
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "Requirement Review",
    body: "We understand the product, application, operating configuration and customer's testing requirements.",
  },
  {
    icon: ListChecks,
    title: "Test Planning",
    body: "The applicable requirements, standards and test methods are reviewed to determine the appropriate testing plan.",
  },
  {
    icon: Settings2,
    title: "Product Setup",
    body: "The equipment under test is configured according to the applicable requirements, including operating modes, cables and supporting equipment.",
  },
  {
    icon: FlaskConical,
    title: "EMC Testing",
    body: "The applicable emissions and immunity tests are performed using the appropriate test setup and instrumentation.",
  },
  {
    icon: FileCheck2,
    title: "Results & Reporting",
    body: "Test results are recorded and applicable test documentation/reporting is prepared.",
  },
];

const facilityPhotos = [
  {
    src: "/images/chamber.webp",
    title: "EMC Test Chamber",
    caption:
      "Semi-anechoic chamber fitted with pyramidal RF absorbers, used for radiated emissions and immunity testing.",
  },
  {
    src: "/images/explore/control_room.webp",
    title: "Test Control Room",
    caption: "EMI receiver and control desk used to run and record EMC test measurements.",
  },
  {
    src: "/images/explore/RE102 setup.webp",
    title: "Radiated Emissions Test Setup",
    caption: "Antenna mast and equipment-under-test table configured for a radiated emissions measurement.",
  },
  {
    src: "/images/explore/radiated_immunity_test.webp",
    title: "Radiated Immunity Test Setup",
    caption: "Antenna and test table configured inside the chamber for a radiated immunity test.",
  },
  {
    src: "/images/explore/BCI_setup.webp",
    title: "Bulk Current Injection (BCI) Setup",
    caption: "Bench setup with signal generator and current injection clamp used for conducted RF immunity testing.",
  },
  {
    src: "/images/explore/eft_test.webp",
    title: "EFT / Burst Test Setup",
    caption: "Test generator and coupling clamp used for electrical fast transient/burst immunity testing.",
  },
  {
    src: "/images/explore/civilLab.webp",
    title: "ESD Test Setup",
    caption: "Test bench arranged for electrostatic discharge immunity testing on a vehicle electrical system.",
  },
  {
    src: "/images/automotive/RE main pic .webp",
    title: "Automotive EMC Test Setup",
    caption: "Automotive equipment evaluated under applicable EMC test requirements.",
  },
  {
    src: "/images/mil-aero/AZ7_7709 2023-09-11 06_28_36.webp",
    title: "Defence & Aerospace Test Bench",
    caption: "Bench and measurement instruments configured for a military EMC test.",
  },
  {
    src: "/images/civilian/Civil.webp",
    title: "Civilian EMC Test Bench",
    caption: "Laboratory bench equipped for civilian and industrial EMC testing.",
  },
];

const whyCctl = [
  {
    icon: ShieldCheck,
    title: "Accredited Laboratory",
    body: "NABL accredited and ISO/IEC 17025:2017 certified testing laboratory.",
  },
  {
    icon: Factory,
    title: "Multi-Industry Testing",
    body: "Support across automotive, defence/aerospace, civilian, railway and telecom/wireless applications.",
  },
  {
    icon: Cpu,
    title: "EMC Testing Infrastructure",
    body: "Component Semi-Anechoic Chamber (CSAC) and Vehicle Semi-Anechoic Chamber (VSAC), each with a shielded control room and dedicated instrumentation.",
  },
  {
    icon: Users,
    title: "Engineering Support",
    body: "Our technical team works with you to understand product requirements and guide you through the testing process.",
  },
  {
    icon: CircleCheckBig,
    title: "Testing Capability",
    body: "Radiated and conducted emissions and immunity testing across applicable CISPR, IEC and military standards.",
  },
  {
    icon: MapPin,
    title: "Two Laboratory Locations",
    body: "Operating laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
];

const productCategories = [
  { icon: Car, label: "Automotive electronic components" },
  { icon: Cpu, label: "Electronic control systems" },
  { icon: Factory, label: "Industrial electronic equipment" },
  { icon: Plane, label: "Defence and aerospace electronics" },
  { icon: TrainFront, label: "Railway electronics" },
  { icon: Phone, label: "Telecom equipment" },
  { icon: Wifi, label: "Wireless products" },
  { icon: Zap, label: "Electrical/electronic equipment" },
  { icon: Gauge, label: "Control and monitoring equipment" },
];

const faqs = [
  {
    q: "What is EMC testing?",
    a: "EMC testing evaluates electromagnetic emissions from equipment and its ability to operate correctly when exposed to electromagnetic disturbances.",
  },
  {
    q: "Why is EMC testing required?",
    a: "EMC testing helps identify electromagnetic interference issues and evaluate whether a product meets applicable requirements for its intended application or market.",
  },
  {
    q: "What is the difference between EMI and EMC?",
    a: "EMI generally refers to electromagnetic interference, while EMC refers to the broader ability of equipment to operate satisfactorily within its electromagnetic environment without causing unacceptable interference.",
  },
  {
    q: "What types of EMC tests are performed?",
    a: "Depending on the applicable requirements, EMC testing may include emissions and immunity tests such as conducted emissions, radiated emissions, radiated immunity, conducted immunity, ESD, EFT/burst, surge and other applicable tests.",
  },
  {
    q: "Which EMC standard applies to my product?",
    a: "The applicable standard depends on the product, industry, intended market, operating environment and specific requirements. CCTL's technical team can review the product requirements and help determine the appropriate testing requirements.",
  },
  {
    q: "How long does EMC testing take?",
    a: "Testing duration depends on the product configuration, applicable standards, number of test methods and required test configurations. The CCTL team can review the requirements and provide an appropriate testing plan.",
  },
  {
    q: "Can CCTL perform EMC pre-compliance testing?",
    a: "Yes. CCTL offers EMC pre-compliance testing to help identify potential issues early in the design cycle, before formal compliance testing.",
  },
  {
    q: "Where are CCTL's laboratories located?",
    a: "CCTL has laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
  {
    q: "How do I request EMC testing?",
    a: "Customers can contact CCTL with their product information, applicable standards if known and testing requirements so that the technical team can review the requirement and guide them on the next steps.",
  },
];

const relatedServices: {
  label: string;
  href?:
    | "/services/emi-testing"
    | "/services/emc-compliance-testing"
    | "/automotive/cispr-25-testing"
    | "/automotive/iso-11452-testing"
    | "/military/mil-std-461-testing"
    | "/military/mil-std-704-testing"
    | "/railway/railway-emc-testing"
    | "/telecom/telecom-emc-testing"
    | "/telecom/wireless-testing"
    | "/services/emc-pre-compliance-testing";
  /** No dedicated overview page exists for this yet — link to its domain
   *  page instead. */
  domainSlug?: "automotive";
}[] = [
  { label: "EMI Testing", href: "/services/emi-testing" },
  { label: "EMC Compliance Testing", href: "/services/emc-compliance-testing" },
  { label: "EMC Pre-Compliance Testing", href: "/services/emc-pre-compliance-testing" },
  { label: "Automotive EMC Testing", domainSlug: "automotive" },
  { label: "CISPR 25 Testing", href: "/automotive/cispr-25-testing" },
  { label: "ISO 11452 Testing", href: "/automotive/iso-11452-testing" },
  { label: "MIL-STD-461 Testing", href: "/military/mil-std-461-testing" },
  { label: "MIL-STD-704 Testing", href: "/military/mil-std-704-testing" },
  { label: "Railway EMC Testing", href: "/railway/railway-emc-testing" },
  { label: "Telecom EMC Testing", href: "/telecom/telecom-emc-testing" },
  { label: "Wireless Testing", href: "/telecom/wireless-testing" },
];

const coimbatore = company.locations.find((l) => l.id === "coimbatore")!;
const bangalore = company.locations.find((l) => l.id === "bangalore")!;

/* ────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────── */

export default function EmcTesting() {
  const reduced = useReducedMotion();

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
            src="/images/chamber.webp"
            alt="CCTL semi-anechoic EMC test chamber"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.82)] via-[rgba(7,13,24,0.62)] to-[rgba(7,13,24,0.88)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "EMC Testing" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMC Testing Laboratory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-7 max-w-2xl text-lg font-semibold leading-snug text-white/90"
          >
            Comprehensive Electromagnetic Compatibility Testing for Electrical and Electronic
            Products
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Cosmic Compliance Test Lab (CCTL) provides EMC testing services for electrical and
            electronic products across automotive, defence and aerospace, civilian, railway,
            telecom and wireless applications.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            Our EMC testing evaluates both electromagnetic emissions and immunity to help
            manufacturers identify potential interference issues and assess product performance
            against applicable testing requirements.
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
                Request a Quote
                <ArrowIcon />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHAT IS EMC TESTING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>Introduction</Eyebrow>
              <h2 className="t-h2 mt-5">What is EMC Testing?</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-lead mt-6">
                Electromagnetic Compatibility (EMC) testing evaluates how electrical and
                electronic equipment interacts with its electromagnetic environment.
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-8 space-y-5">
              <div className="border-t border-line-strong/10 pt-5">
                <p className="t-h3 text-lg">Emissions</p>
                <p className="t-body mt-2">
                  The electromagnetic disturbances generated by a product and released through
                  conducted or radiated paths.
                </p>
              </div>
              <div className="border-t border-line-strong/10 pt-5">
                <p className="t-h3 text-lg">Immunity</p>
                <p className="t-body mt-2">
                  The ability of a product to continue operating as intended when exposed to
                  electromagnetic disturbances.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="t-body mt-8 max-w-xl">
                EMC testing helps manufacturers identify potential electromagnetic interference
                problems, improve product reliability and address applicable regulatory, product
                or industry-specific requirements.
              </p>
            </Reveal>
          </div>

          {/* Refined technical flow diagram — the two EMC disciplines shown as
              a numbered, connector-linked sequence. No stock imagery needed. */}
          <Reveal delay={0.1} className="surface relative overflow-hidden p-8 sm:p-10">
            {/* soft gradient accent bar at the top of the panel */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent" />

            {/* ── Flow 1: Emissions ─────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center">
              <span className="meta inline-flex items-center gap-2 self-start rounded-full border border-cyan-glow/20 bg-cyan-glow/5 px-3 py-1 text-[0.62rem] text-cyan-glow">
                01 — Emissions
              </span>

              {/* Node: source */}
              <DiagramNode
                icon={Cpu}
                label="Electronic Product"
                tone="neutral"
                className="mt-5"
              />
              <FlowConnector />
              {/* Node: emitted energy */}
              <DiagramNode
                icon={Signal}
                label="Radiated & Conducted Emissions"
                tone="cyan"
                glow
              />
              <p className="mt-4 max-w-xs text-[0.8rem] leading-relaxed text-ink-300">
                Electromagnetic energy the product releases into its environment.
              </p>
            </div>

            {/* section divider */}
            <div className="my-9 h-px w-full bg-gradient-to-r from-transparent via-line-strong/15 to-transparent" />

            {/* ── Flow 2: Immunity ──────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center">
              <span className="meta inline-flex items-center gap-2 self-start rounded-full border border-violet-glow/25 bg-violet-glow/5 px-3 py-1 text-[0.62rem] text-violet-glow">
                02 — Immunity
              </span>

              {/* Node: external disturbance */}
              <DiagramNode
                icon={Zap}
                label="Electromagnetic Disturbances"
                tone="violet"
                glow
                className="mt-5"
              />
              <FlowConnector />
              {/* Node: product under test */}
              <DiagramNode
                icon={Cpu}
                label="Electronic Product"
                tone="neutral"
              />
              <FlowConnector />
              {/* Node: immunity result */}
              <DiagramNode
                icon={Radio}
                label="Continues Operating Correctly"
                tone="cyan"
                glow
              />
              <p className="mt-4 max-w-xs text-[0.8rem] leading-relaxed text-ink-300">
                The product's ability to withstand disturbances without malfunction.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHY EMC TESTING IS IMPORTANT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Why it matters</Eyebrow>
            <h2 className="t-h2 mt-5">Why is EMC Testing Important?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Modern electrical and electronic products operate in environments containing many
              sources of electromagnetic energy. Poor electromagnetic compatibility can result in
              interference, malfunction or unreliable operation. EMC testing helps manufacturers:
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Identify electromagnetic interference issues",
              "Evaluate product emissions",
              "Evaluate immunity to electromagnetic disturbances",
              "Identify design weaknesses before product release",
              "Support applicable regulatory and industry requirements",
              "Improve product reliability",
              "Reduce the risk of unexpected EMC failures",
              "Prepare products for formal compliance evaluation",
            ].map((item, i) => (
              <Reveal key={item} delay={i * 0.06} className="surface p-6">
                <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                <p className="t-body mt-4 !text-ink-100">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EMISSIONS & IMMUNITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Two disciplines, one goal</Eyebrow>
            <h2 className="t-h2 mt-5">Emissions and Immunity Testing</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal className="surface group relative overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/explore/control_room.webp"
                  alt="CCTL test control room used to monitor EMC emissions measurements"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="t-h3 text-2xl">Emissions Testing</h3>
                <p className="mt-3 text-sm font-semibold text-cyan-glow">
                  Does the product generate unwanted electromagnetic disturbances?
                </p>
                <p className="t-body mt-4">
                  Emissions testing evaluates electromagnetic energy generated by the equipment.
                </p>
                <ul className="mt-6 space-y-2">
                  {["Conducted Emissions Testing", "Radiated Emissions Testing"].map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-ink-100">
                      <span className="h-1 w-1 rounded-full bg-cyan-glow" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="surface group relative overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <img
                  src="/images/explore/radiated_immunity_test.webp"
                  alt="CCTL radiated immunity test setup inside the anechoic chamber"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="t-h3 text-2xl">Immunity Testing</h3>
                <p className="mt-3 text-sm font-semibold text-violet-glow">
                  Can the product continue to operate correctly when exposed to electromagnetic
                  disturbances?
                </p>
                <p className="t-body mt-4">
                  Immunity testing evaluates the response of equipment to controlled
                  electromagnetic disturbances.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Radiated Immunity",
                    "Conducted Immunity",
                    "Electrostatic Discharge (ESD)",
                    "Electrical Fast Transient / Burst",
                    "Surge",
                    "RF Immunity",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-ink-100">
                      <span className="h-1 w-1 rounded-full bg-violet-glow" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EMC TESTING SERVICES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>What we test</Eyebrow>
            <h2 className="t-h2 mt-5">Our EMC Testing Services</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {emcServices.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.08} className="surface surface-hover p-7">
                <s.icon className="h-7 w-7 text-cyan-glow" strokeWidth={1.6} />
                <h3 className="t-h3 mt-5 text-lg">{s.title}</h3>
                <p className="t-body mt-3">{s.body}</p>
                {s.href && (
                  <Link
                    to={s.href}
                    className="group mt-4 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow"
                  >
                    Learn more
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </Link>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INDUSTRIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Where we work</Eyebrow>
            <h2 className="t-h2 mt-5">EMC Testing Across Industries</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL supports EMC testing requirements across multiple product and industry
              domains.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal
                key={ind.name}
                delay={(i % 3) * 0.08}
                className="surface group relative overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ind.image}
                    alt={`${ind.name} at CCTL`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="t-h3 text-lg">{ind.name}</h3>
                  <p className="t-body mt-3">{ind.body}</p>
                  <div className="mt-6">
                    {ind.domainSlug ? (
                      <Link
                        to="/services/$slug"
                        params={{ slug: ind.domainSlug }}
                        className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                      >
                        {ind.cta}
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : ind.href ? (
                      <Link
                        to={ind.href}
                        className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                      >
                        {ind.cta}
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <PendingLink label={ind.cta} />
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STANDARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Applicable requirements</Eyebrow>
            <h2 className="t-h2 mt-5">EMC Standards and Requirements</h2>
            <p className="t-lead mt-6 max-w-2xl">
              EMC testing requirements depend on the product, industry, intended application,
              operating environment and applicable regulatory requirements.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {standardsGroups.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.08} className="surface p-7">
                <h3 className="t-h3 text-lg">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-100">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {group.links.map((l) =>
                    l.href ? (
                      <Link
                        key={l.label}
                        to={l.href}
                        className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                      >
                        {l.label}
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <PendingLink key={l.label} label={l.label} />
                    ),
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="t-small mt-10 max-w-2xl">
              CCTL states accreditation and standards coverage only as confirmed by its current
              accreditation scope and laboratory capability.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="t-h2 mt-5">Our EMC Testing Process</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1} className="relative">
                <div className="surface flex h-full flex-col p-6">
                  <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                  <step.icon className="mt-4 h-7 w-7 text-cyan-glow" strokeWidth={1.6} />
                  <h3 className="t-h3 mt-4 text-base">{step.title}</h3>
                  <p className="t-body mt-2 text-[0.85rem]">{step.body}</p>
                </div>
                {i < processSteps.length - 1 && (
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
          FACILITIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Inside CCTL</Eyebrow>
            <h2 className="t-h2 mt-5">Our EMC Testing Facilities</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-2 lg:grid-cols-4">
            {facilityPhotos.map((photo, i) => (
              <motion.figure
                key={photo.src}
                initial={reduced ? undefined : { opacity: 0, y: 40 }}
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
          WHY CCTL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x rounded-[2rem] bg-ink-100 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow dark={false}>Why CCTL</Eyebrow>
            <h2 className="font-display mt-5 text-[clamp(1.95rem,3.6vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#0f172a]">
              Why Choose Cosmic Compliance Test Lab?
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {whyCctl.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08} className="border-t border-[#0f172a]/10 pt-6">
                <item.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <p className="font-display mt-4 text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-[#0f172a]">
                  {item.title}
                </p>
                <p className="mt-3 text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRODUCTS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Product scope</Eyebrow>
            <h2 className="t-h2 mt-5">What Products Can Require EMC Testing?</h2>
            <p className="t-lead mt-6 max-w-2xl">
              EMC requirements vary according to the product, application and applicable
              standards. Not every product category is tested under every standard.
            </p>
          </Reveal>

          <div className="grid-gutter mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {productCategories.map((p, i) => (
              <Reveal key={p.label} delay={(i % 5) * 0.06} className="surface flex flex-col items-start p-5">
                <p.icon className="h-6 w-6 text-cyan-glow" strokeWidth={1.6} />
                <p className="mt-4 text-[0.85rem] font-semibold leading-snug text-ink-100">
                  {p.label}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="surface glow-border mt-14 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-h3 max-w-lg text-xl">
              Not sure which EMC tests apply to your product? Talk to our EMC engineers.
            </p>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Discuss Your Product
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LOCATIONS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Where to find us</Eyebrow>
            <h2 className="t-h2 mt-5">EMC Testing Laboratories in Coimbatore and Bangalore</h2>
          </Reveal>

          <div className="grid-gutter mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                label: "Coimbatore Laboratory",
                loc: coimbatore,
                mapQuery: "https://maps.google.com/?q=Cosmic+Compliance+Test+Lab+Coimbatore",
                embed:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.569600608087!2d77.0325545!3d11.0708602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f90018e334e5%3A0xb45fb98558d47a7d!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400856665!5m2!1sen!2sin",
              },
              {
                label: "Bangalore Laboratory",
                loc: bangalore,
                mapQuery: "https://maps.google.com/?q=Cosmic+Compliance+Test+Lab+Bangalore",
                embed:
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5225365777483!2d77.7017882!3d12.809474499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d1297622b09%3A0xce2dcc254274ad3c!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400916999!5m2!1sen!2sin",
              },
            ].map((card, i) => (
              <Reveal key={card.label} delay={i * 0.1} className="surface overflow-hidden">
                <iframe
                  title={`CCTL ${card.label} map`}
                  src={card.embed}
                  className="block h-[240px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <div className="p-7">
                  <h3 className="t-h3 text-lg">{card.label}</h3>
                  <p className="t-body mt-3">{card.loc.address}</p>
                  <p className="t-body mt-2">{card.loc.phone}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={card.mapQuery}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line-strong/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-100 transition-colors hover:border-cyan-glow/50"
                    >
                      View Location
                    </a>
                    <Link
                      to="/contact"
                      className="rounded-full bg-cyan-glow px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-violet-glow"
                    >
                      Contact Laboratory
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="t-h2 mt-5">Frequently Asked Questions</h2>
          </Reveal>

          <Reveal delay={0.1} className="surface mt-10 px-6 sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="border-line-strong/10"
                >
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
          RELATED SERVICES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Keep exploring</Eyebrow>
            <h2 className="t-h2 mt-5">Explore More Testing Services</h2>
            <p className="t-lead mt-6 max-w-2xl">
              Dedicated pages for individual services, industries and standards are in
              development. Contact CCTL now if you need help sooner.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap gap-3">
            {relatedServices.map((svc) =>
              svc.domainSlug ? (
                <Link
                  key={svc.label}
                  to="/services/$slug"
                  params={{ slug: svc.domainSlug }}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                >
                  {svc.label}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              ) : svc.href ? (
                <Link
                  key={svc.label}
                  to={svc.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                >
                  {svc.label}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <PendingLink key={svc.label} label={svc.label} />
              ),
            )}
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
              Need EMC Testing for Your Product?
            </h2>
            <p className="mt-6 max-w-xl text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
              Whether you are developing a new electronic product, preparing for compliance
              testing or investigating an EMC issue, our team can help you understand the
              applicable testing requirements.
            </p>
            <p className="mt-4 max-w-xl text-[1rem] font-semibold leading-relaxed text-[#0f172a]">
              Share your product details with our team and discuss your EMC testing requirements.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request a Quote
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
