import { motion, type Variants } from "framer-motion";
import { FlaskConical, TrendingUp, Users } from "lucide-react";
import SectionHeading from "@/site/components/SectionHeading";
import FloatingStandards from "@/site/components/bg/FloatingStandards";

const benefits = [
  {
    icon: FlaskConical,
    title: "Cutting-Edge Lab Infrastructure",
    body: "Work with a Component Semi-Anechoic Chamber up to 48 GHz, a full Vehicle Semi-Anechoic Chamber with 2m turntable, and advanced EMI instrumentation. NABL accredited, ISO/IEC 17025 certified.",
    iconCls: "bg-blue-50 text-cyan-glow ring-blue-100",
    bar: "from-cyan-glow",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Expertise",
    body: "Gain hands-on experience across automotive (CISPR 25, ISO 11452), defence (MIL-STD-461), railway (EN 50121), and civilian (IEC 61000) sectors. International standards, real projects, fast learning.",
    iconCls: "bg-violet-50 text-violet-glow ring-violet-100",
    bar: "from-violet-glow",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    body: "We're a close-knit team of specialists. High ownership, direct impact, open communication. Every engineer matters — your work directly shapes test outcomes for clients across India and beyond.",
    iconCls: "bg-sky-50 text-sky-600 ring-sky-100",
    bar: "from-sky-500",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhyJoinUs() {
  return (
    <section className="section-light relative overflow-hidden py-24 lg:py-28">
      <FloatingStandards count={6} opacity={0.7} theme="light" className="hidden lg:block" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Join Us"
          title="More Than a Job. A Mission."
          body="We're building India's most capable EMC testing team. Here's what that means for you."
        />

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              variants={item}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-20px_rgba(26,108,245,0.25)]"
            >
              {/* Accent bar */}
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${b.bar} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
              {/* Ghost number */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-3 select-none font-display text-6xl font-black text-slate-100"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div
                className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${b.iconCls}`}
              >
                <b.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <h3 className="relative font-display text-lg font-bold text-slate-900">{b.title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-slate-600">{b.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
