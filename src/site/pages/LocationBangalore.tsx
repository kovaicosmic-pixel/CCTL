import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Building2, ArrowRight } from "lucide-react";
import Magnetic from "../components/motion/Magnetic";
import Breadcrumb from "../components/Breadcrumb";
import { company } from "../data/content";

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

const loc = company.locations.find((l) => l.id === "bangalore")!;

const capabilities = [
  "Component Semi-Anechoic Chamber (CSAC) up to 48 GHz",
  "Vehicle Semi-Anechoic Chamber (VSAC) with 2 m turntable",
  "Shielded control room with advanced instrumentation",
  "Conducted and radiated emissions testing",
  "Conducted and radiated immunity testing",
  "ESD, EFT/burst, surge, and conducted RF immunity",
  "Automotive EMC testing (CISPR 25, ISO 11452)",
  "Defence & aerospace testing (MIL-STD-461, MIL-STD-704)",
  "Civilian and industrial testing (IEC 61000 series, CISPR)",
  "Railway EMC testing (EN 50121)",
  "Telecom and wireless testing",
  "EMC pre-compliance testing",
];

const services = [
  { label: "EMC Testing", href: "/services/emc-testing" as const },
  { label: "EMI Testing", href: "/services/emi-testing" as const },
  { label: "Automotive EMC Testing", isSlug: true },
  { label: "MIL-STD-461 Testing", href: "/military/mil-std-461-testing" as const },
  { label: "CISPR 25 Testing", href: "/automotive/cispr-25-testing" as const },
  { label: "IEC 61000 Testing", href: "/civilian/iec-61000-testing" as const },
  { label: "Railway EMC Testing", href: "/railway/railway-emc-testing" as const },
  { label: "EMC Pre-Compliance Testing", href: "/services/emc-pre-compliance-testing" as const },
];

export default function LocationBangalore() {
  return (
    <div className="bg-space-950">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative isolate overflow-hidden rounded-b-[2rem]"
        style={{ minHeight: "calc(60svh - 4.5rem)" }}
      >
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/explore/Labcivil.webp"
            alt="CCTL Bangalore EMC test laboratory"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.88)] via-[rgba(7,13,24,0.70)] to-[rgba(7,13,24,0.95)]" />
        </div>

        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-14 pt-32 sm:px-10 lg:px-16">
          <Breadcrumb
            items={[
              { name: "Home", path: "/" },
              { name: "Locations", path: "/contact" },
              { name: "Bangalore" },
            ]}
            className="text-white/60"
          />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-white"
          >
            EMC Testing Laboratory — Bangalore
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="mt-5 max-w-xl text-base leading-[1.75] text-white/80"
          >
            NABL accredited, ISO/IEC 17025:2017 certified EMI/EMC testing facility serving
            automotive, defence, railway, telecom and civilian product manufacturers in
            Bangalore, Karnataka and across India.
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT DETAILS ──────────────────────────────────────────── */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="t-h2">Laboratory Contact &amp; Address</h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                label: "Address",
                value: loc.address,
              },
              {
                icon: Phone,
                label: "Phone",
                value: loc.phone,
                href: `tel:${loc.phone.replace(/\s/g, "")}`,
              },
              {
                icon: Mail,
                label: "Email",
                value: loc.email,
                href: `mailto:${loc.email}`,
              },
              {
                icon: Clock,
                label: "Operating Hours",
                value: company.hours,
              },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08} className="surface p-6">
                <item.icon className="h-5 w-5 text-cyan-glow" strokeWidth={1.6} />
                <p className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-ink-500">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-2 block text-[0.9rem] font-semibold text-ink-100 hover:text-cyan-glow"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-[0.9rem] font-semibold leading-snug text-ink-100">
                    {item.value}
                  </p>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────────────── */}
      <section className="container-x pb-0 pt-0">
        <div className="mx-auto max-w-5xl">
          <Reveal className="surface overflow-hidden rounded-[1.5rem]">
            <iframe
              title="CCTL Bangalore Laboratory Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5225365777483!2d77.7017882!3d12.809474499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d1297622b09%3A0xce2dcc254274ad3c!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400916999!5m2!1sen!2sin"
              className="block h-[340px] w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="flex items-center justify-between gap-4 p-6">
              <p className="text-[0.875rem] font-semibold text-ink-300">
                Bommasandra Village, Anekal Taluk, Bangalore
              </p>
              <a
                href="https://maps.google.com/?q=Cosmic+Compliance+Test+Lab+Bangalore"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
              >
                Open in Maps
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTING CAPABILITIES ─────────────────────────────────────── */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              What we test here
            </span>
            <h2 className="t-h2 mt-5">Testing Capabilities at Bangalore</h2>
            <p className="t-lead mt-6 max-w-2xl">
              The Bangalore laboratory provides comprehensive EMI/EMC testing services
              across multiple industry sectors from its accredited facility in Karnataka.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
          >
            {capabilities.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-ink-100">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-glow" />
                {item}
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.2}>
            <p className="t-small mt-8 max-w-2xl border-l-2 border-cyan-glow/40 pl-4">
              CCTL Bangalore is NABL accredited and ISO/IEC 17025:2017 certified, operating
              from Bommasandra Industrial Estate, Anekal Taluk.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── LAB PHOTOS ───────────────────────────────────────────────── */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Inside the lab
            </span>
            <h2 className="t-h2 mt-5">The Bangalore Laboratory</h2>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { src: "/images/explore/Labcivil.webp", alt: "CCTL Bangalore laboratory overview" },
              { src: "/images/explore/BCI_setup.webp", alt: "Bulk current injection test setup at CCTL Bangalore" },
              { src: "/images/explore/eft_test.webp", alt: "EFT burst immunity test bench setup" },
            ].map((photo, i) => (
              <Reveal
                key={photo.src}
                delay={i * 0.1}
                className="plate group aspect-[4/3] overflow-hidden rounded-[1.25rem]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section className="container-x section-y bg-space-900">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Available at this lab
            </span>
            <h2 className="t-h2 mt-5">Testing Services at Bangalore</h2>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-3">
            {services.map((svc) =>
              svc.isSlug ? (
                <Link
                  key={svc.label}
                  to="/services/$slug"
                  params={{ slug: "automotive" }}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                >
                  {svc.label}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link
                  key={svc.label}
                  to={svc.href as string}
                  className="group inline-flex items-center gap-2 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-cyan-glow transition-colors hover:bg-cyan-glow/20"
                >
                  {svc.label}
                  <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── OTHER LOCATION ───────────────────────────────────────────── */}
      <section className="container-x section-y bg-space-950">
        <div className="mx-auto max-w-5xl">
          <Reveal className="surface glow-border flex flex-col items-start gap-6 rounded-[1.5rem] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Building2 className="mt-1 h-6 w-6 shrink-0 text-violet-glow" strokeWidth={1.6} />
              <div>
                <p className="t-h3 text-lg">Also available in Coimbatore</p>
                <p className="t-body mt-2 max-w-sm">
                  CCTL's main facility in Coimbatore, Tamil Nadu — same accreditation,
                  same testing capability.
                </p>
              </div>
            </div>
            <Magnetic strength={0.35}>
              <Link
                to="/locations/coimbatore"
                className="btn-base group whitespace-nowrap bg-violet-glow px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white hover:-translate-y-px"
              >
                Coimbatore Lab
                <ArrowIcon />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Get started
            </span>
            <h2 className="font-display mt-5 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.036em] text-[#0f172a]">
              Book Testing at Bangalore
            </h2>
            <p className="mt-5 max-w-xl text-[0.9125rem] leading-[1.75] text-[#475569]">
              Contact the Bangalore laboratory directly to discuss your EMC testing
              requirements and schedule an appointment.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-4">
            <Magnetic strength={0.35}>
              <a
                href={`tel:${loc.phone.replace(/\s/g, "")}`}
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Call {loc.phone}
              </a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[#0f172a] underline decoration-[#0f172a]/30 underline-offset-4 hover:decoration-[#0f172a]"
              >
                Send an Enquiry
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
