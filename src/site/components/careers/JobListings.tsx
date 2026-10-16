import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  Clock,
  Cpu,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/site/components/SectionHeading";
import ApplyModal from "./ApplyModal";
import type { JobPosting } from "@/site/lib/db";

export interface ParsedJob
  extends Omit<JobPosting, "locations" | "responsibilities" | "requirements"> {
  locations: string[];
  responsibilities: string[];
  requirements: string[];
}

interface Props {
  jobs: ParsedJob[];
  isLoading?: boolean;
}

const LOCATION_LABELS: Record<string, string> = {
  coimbatore: "Coimbatore",
  bangalore: "Bangalore",
};

/** Icon + gradient per department so each card is recognisable at a glance. */
const DEPARTMENT_STYLES: { match: RegExp; icon: LucideIcon; tile: string }[] = [
  { match: /engineer|test|lab|technical|rf|emc/i, icon: Cpu, tile: "from-[#1a6cf5] to-[#3b5bdb]" },
  { match: /quality|calibration|compliance/i, icon: ShieldCheck, tile: "from-emerald-500 to-teal-600" },
  { match: /sales|business|marketing/i, icon: TrendingUp, tile: "from-orange-500 to-rose-500" },
  { match: /hr|human|people|admin/i, icon: Users, tile: "from-fuchsia-600 to-purple-700" },
];
const FALLBACK_TILES = ["from-sky-500 to-blue-700", "from-violet-500 to-indigo-700", "from-cyan-500 to-blue-600"];

function departmentStyle(department: string, idx: number) {
  const hit = DEPARTMENT_STYLES.find((d) => d.match.test(department));
  return hit ?? { icon: Briefcase, tile: FALLBACK_TILES[idx % FALLBACK_TILES.length] };
}

function postedDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const applyBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b3a82] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1a6cf5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1a6cf5]/30";

export default function JobListings({ jobs, isLoading = false }: Props) {
  const [detailJob, setDetailJob] = useState<ParsedJob | null>(null);
  const [applyJob, setApplyJob] = useState<ParsedJob | null>(null);

  function startApply(job: ParsedJob) {
    setDetailJob(null);
    setApplyJob(job);
  }

  return (
    <section id="open-positions" className="section-white relative scroll-mt-20 py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Open Positions"
          title="We're Hiring"
          body="Find a role that matches your expertise and ambition."
        />

        {!isLoading && jobs.length > 0 && (
          <p className="mt-10 text-center text-sm font-medium text-slate-500">
            {jobs.length} open {jobs.length === 1 ? "position" : "positions"}
          </p>
        )}

        {isLoading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-[22rem] animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            className="mx-auto mt-14 max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-8 py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              No open positions right now
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
              We don't have any active openings at the moment, but we're always interested in
              hearing from talented engineers.
            </p>
            <a href="/careers/apply" className={`${applyBtn} mt-6`}>
              Send us your CV
            </a>
          </motion.div>
        ) : (
          <div
            className={
              jobs.length === 1
                ? "mx-auto mt-6 grid max-w-2xl gap-6"
                : "mt-6 grid gap-6 md:grid-cols-2"
            }
          >
            {jobs.map((job, idx) => (
              <JobCard
                key={job.id}
                job={job}
                idx={idx}
                onDetails={() => setDetailJob(job)}
                onApply={() => startApply(job)}
              />
            ))}
          </div>
        )}
      </div>

      {detailJob && (
        <JobDetailsDialog
          job={detailJob}
          idx={jobs.indexOf(detailJob)}
          onClose={() => setDetailJob(null)}
          onApply={() => startApply(detailJob)}
        />
      )}

      {applyJob && (
        <ApplyModal
          jobId={applyJob.id}
          jobTitle={applyJob.title}
          employmentType={applyJob.employmentType}
          department={applyJob.department}
          experienceBand={applyJob.experienceBand}
          locations={applyJob.locations.map((l) => LOCATION_LABELS[l] ?? l)}
          onClose={() => setApplyJob(null)}
        />
      )}
    </section>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

function JobMeta({ job }: { job: ParsedJob }) {
  const locs = job.locations.map((l) => LOCATION_LABELS[l] ?? l).join(" & ");
  const items: { icon: LucideIcon; text: string; label: string; tint: string }[] = [
    { icon: Briefcase, text: "Full-time", label: "Type", tint: "bg-blue-50 text-blue-600" },
    { icon: Clock, text: job.experienceBand, label: "Experience", tint: "bg-amber-50 text-amber-600" },
    {
      icon: MapPin,
      text: `${job.employmentType} · ${locs}`,
      label: "Location",
      tint: "bg-rose-50 text-rose-600",
    },
    {
      icon: CalendarDays,
      text: `Posted ${postedDate(job.createdAt)}`,
      label: "Posted",
      tint: "bg-emerald-50 text-emerald-600",
    },
  ];
  // Fixed 2-column grid: items stay aligned and wrap within their own cell
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      {items.map(({ icon: Icon, text, label, tint }) => (
        <div key={label} className="flex items-center gap-2.5">
          <dt className="sr-only">{label}</dt>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tint}`}
            aria-hidden
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          <dd className="min-w-0 font-medium text-slate-700">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

function JobCard({
  job,
  idx,
  onDetails,
  onApply,
}: {
  job: ParsedJob;
  idx: number;
  onDetails: () => void;
  onApply: () => void;
}) {
  const { icon: Icon, tile } = departmentStyle(job.department, idx);
  const summary = job.responsibilities.slice(0, 2).join(" ");
  const chips = job.requirements.slice(0, 3);
  const moreChips = job.requirements.length - chips.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (idx % 2) * 0.08, duration: 0.45 }}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.25)] sm:p-7"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ${tile}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug text-slate-900">
            <button
              type="button"
              onClick={onDetails}
              className="text-left transition-colors hover:text-[#1a6cf5] focus-visible:underline focus-visible:outline-none"
            >
              {job.title}
            </button>
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">{job.department}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5">
        <JobMeta job={job} />
      </div>

      {/* Summary */}
      {summary && (
        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-slate-600">{summary}</p>
      )}

      {/* Requirement chips */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((r) => (
            <span
              key={r}
              title={r}
              className="max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#0b3a82]"
            >
              {r}
            </span>
          ))}
          {moreChips > 0 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              +{moreChips} more
            </span>
          )}
        </div>
      )}

      {/* Actions — pinned to the bottom so buttons line up across cards */}
      <div className="mt-auto flex flex-col-reverse gap-3 pt-6 min-[420px]:flex-row">
        <button
          type="button"
          onClick={onDetails}
          className="whitespace-nowrap rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          View details
        </button>
        <button type="button" onClick={onApply} className={`${applyBtn} flex-1 whitespace-nowrap`}>
          Apply Now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

// ─── Details dialog ──────────────────────────────────────────────────────────

function JobDetailsDialog({
  job,
  idx,
  onClose,
  onApply,
}: {
  job: ParsedJob;
  idx: number;
  onClose: () => void;
  onApply: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { icon: Icon, tile } = departmentStyle(job.department, Math.max(idx, 0));

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-details-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-slate-200 p-6 sm:p-8">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${tile}`}
          >
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="job-details-title" className="font-display text-2xl font-bold text-slate-900">
              {job.title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{job.department}</p>
            <div className="mt-4">
              <JobMeta job={job} />
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grid flex-1 gap-8 overflow-y-auto p-6 sm:p-8 md:grid-cols-2">
          <DetailList title="What you'll do" items={job.responsibilities} />
          <DetailList title="What we're looking for" items={job.requirements} />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-[#1a6cf5]" />
            {job.locations.map((l) => LOCATION_LABELS[l] ?? l).join(" & ")}, India
          </p>
          <button type="button" onClick={onApply} className={`${applyBtn} flex-1 whitespace-nowrap`}>
            Apply for this role
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1a6cf5]">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
