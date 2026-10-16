import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import GeneralApplicationForm from "@/site/components/careers/GeneralApplicationForm";
import ParticleField from "@/site/components/bg/ParticleField";
import GradientOrbs from "@/site/components/bg/GradientOrbs";
import FloatingStandards from "@/site/components/bg/FloatingStandards";
import { company } from "@/site/data/content";

const details = [
  {
    label: "Email",
    icon: Mail,
    values: company.emails,
    hrefs: company.emails.map((e) => `mailto:${e}`),
  },
  {
    label: "Phone",
    icon: Phone,
    values: company.locations.map((l) => `${l.phone} · ${l.label}`),
    hrefs: company.locations.map((l) => `tel:${l.phone.replace(/\s/g, "")}`),
  },
  {
    label: "Our labs",
    icon: MapPin,
    values: company.locations.map((l) => l.address),
    hrefs: undefined as string[] | undefined,
  },
];

const steps = [
  "Our engineering leads review every CV personally.",
  "If there's a fit — now or soon — we'll reach out for a technical conversation.",
  "We keep your profile on file for future openings at either lab.",
];

export default function CareersApply() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero — compact dark band, matching the careers page */}
      <section className="relative overflow-hidden bg-space-950 px-6 pb-16 pt-14 sm:px-10 lg:px-16 lg:pb-20 lg:pt-16">
        <ParticleField className="z-0 opacity-40" particleCount={25} speed={0.15} />
        <GradientOrbs variant="subtle" />
        <div className="relative mx-auto max-w-[1400px]">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to careers
          </Link>
          <div className="pt-8 text-center">
            <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
              General Application
            </span>
            <h1 className="font-display mt-4 text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white">
              Send Us Your <span className="text-outline-heading">CV</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Don't see an opening that fits? Tell us the role that suits you and where you'd like
              to work — we'll be in touch when the right opportunity comes up.
            </p>
          </div>
        </div>
      </section>

      {/* Details + form — light section */}
      <section className="section-light relative py-16 lg:py-24">
        <FloatingStandards count={6} opacity={0.6} theme="light" className="hidden lg:block" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
            {/* Left: details */}
            <div className="lg:sticky lg:top-28">
              <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
                Get in touch
              </span>
              <h2 className="font-display mt-3 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-slate-900">
                Join the team
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-slate-600">
                Prefer to talk first? Reach our hiring team directly at either lab.
              </p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]">
                {details.map((d, i) => (
                  <div
                    key={d.label}
                    className={`flex gap-4 p-5 ${i > 0 ? "border-t border-slate-100" : ""}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-cyan-glow ring-1 ring-blue-100">
                      <d.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                        {d.label}
                      </p>
                      <div className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-slate-800">
                        {d.values.map((value, j) =>
                          d.hrefs?.[j] ? (
                            <a
                              key={value}
                              href={d.hrefs[j]}
                              className="block font-medium transition-colors hover:text-cyan-glow"
                            >
                              {value}
                            </a>
                          ) : (
                            <p key={value}>{value}</p>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.2em] text-cyan-glow">
                  What happens next
                </p>
                <ol className="mt-3 space-y-3">
                  {steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="font-mono flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-cyan-glow ring-1 ring-blue-200">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_30px_80px_-40px_rgba(26,108,245,0.35)] sm:p-10"
            >
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-slate-900">Your application</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Takes about 2 minutes. Fields marked <span className="text-cyan-glow">*</span>{" "}
                  are required.
                </p>
              </div>
              <GeneralApplicationForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
