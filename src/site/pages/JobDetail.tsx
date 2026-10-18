import { useState } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Mail } from "lucide-react";
import ApplyModal from "@/site/components/careers/ApplyModal";
import FloatingStandards from "@/site/components/bg/FloatingStandards";
import {
  DetailList,
  JobMeta,
  LOCATION_LABELS,
  applyBtn,
  departmentStyle,
} from "@/site/components/careers/JobListings";
import { company } from "@/site/data/content";

const route = getRouteApi("/careers_/jobs/$jobId");

export default function JobDetail() {
  const { job } = route.useLoaderData();
  const [applying, setApplying] = useState(false);
  const { icon: Icon, tile } = departmentStyle(job.department, 0);
  const labs = company.locations.filter((l) => job.locations.includes(l.id));

  return (
    <div className="overflow-x-hidden">
      {/* Header */}
      <section className="section-light relative border-b border-slate-200 pb-12 pt-10 lg:pb-14">
        <FloatingStandards count={5} opacity={0.5} theme="light" className="hidden lg:block" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/careers" className="inline-flex items-center gap-1.5 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Careers
            </Link>
            <span className="text-slate-300">/</span>
            <span className="truncate text-slate-700">{job.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex items-start gap-5">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tile}`}
              >
                <Icon className="h-8 w-8" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-cyan-glow">
                  {job.department}
                </p>
                <h1 className="font-display mt-1.5 text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold leading-tight tracking-tight text-slate-900">
                  {job.title}
                </h1>
                <div className="mt-4 max-w-xl">
                  <JobMeta job={job} />
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setApplying(true)} className={`${applyBtn} shrink-0 px-7`}>
              Apply now
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="section-white py-14 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_20rem] lg:px-8">
          <div className="space-y-10">
            <p className="text-base leading-relaxed text-slate-600">
              Cosmic Compliance Test Lab (CCTL) is a NABL-accredited EMI/EMC testing laboratory
              with facilities in Coimbatore and Bangalore. We're hiring for the role of{" "}
              <strong className="font-semibold text-slate-900">{job.title}</strong> in our{" "}
              {job.department.toLowerCase()} team.
            </p>
            <DetailList title="What you'll do" items={job.responsibilities} />
            <DetailList title="What we're looking for" items={job.requirements} />
          </div>

          {/* Side card */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-24px_rgba(15,23,42,0.2)]">
              <h2 className="font-display text-lg font-bold text-slate-900">Interested?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                Applying takes about 2 minutes — just your details and resume.
              </p>
              <button type="button" onClick={() => setApplying(true)} className={`${applyBtn} mt-5 w-full`}>
                Apply for this role
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                {labs.length > 1 ? "Locations" : "Location"}
              </h2>
              <ul className="mt-4 space-y-4">
                {labs.map((l) => (
                  <li key={l.id} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold text-slate-900">{LOCATION_LABELS[l.id] ?? l.label}</p>
                      <p className="mt-0.5 leading-relaxed text-slate-500">{l.address}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="flex items-start gap-2 px-1 text-sm leading-relaxed text-slate-500">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Not quite the right fit?{" "}
                <Link to="/careers/apply" className="font-semibold text-[#1a6cf5] hover:underline">
                  Send us your CV
                </Link>{" "}
                instead.
              </span>
            </p>
          </aside>
        </div>
      </section>

      {applying && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          employmentType={job.employmentType}
          department={job.department}
          experienceBand={job.experienceBand}
          locations={job.locations.map((l) => LOCATION_LABELS[l] ?? l)}
          onClose={() => setApplying(false)}
        />
      )}
    </div>
  );
}
