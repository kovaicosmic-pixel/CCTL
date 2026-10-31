import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronRight,
  Inbox,
  Users,
  Star,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Archive,
  SlidersHorizontal,
  ArrowLeft,
  Briefcase,
  FileText,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import {
  listApplications,
  listAllJobs,
  scoreUnscoredApplications,
} from "@/site/lib/careersAdmin";
import ApplicationDetail from "./ApplicationDetail";
import { departmentStyle } from "../JobListings";
import { Avatar, Badge, EmptyState, SkeletonRows, StatusBadge, formatDate, inputCls } from "./ui";

// ─── ATS score mini-ring (table cell) ────────────────────────────────────────

/** Reads the saved aiMatch JSON and returns the score, or null if unscored. */
function readScore(aiMatch: string | null | undefined): number | null {
  if (!aiMatch) return null;
  try {
    const parsed = JSON.parse(aiMatch) as { score?: number };
    return typeof parsed.score === "number" ? parsed.score : null;
  } catch {
    return null;
  }
}

function scoreRingColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function ScoreCell({ aiMatch }: { aiMatch: string | null | undefined }) {
  const score = readScore(aiMatch);
  if (score === null) {
    return <span className="text-xs text-slate-300">—</span>;
  }
  const r = 13;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative h-9 w-9" title={`ATS match: ${score}/100`}>
      <svg className="h-9 w-9 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200" />
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={scoreRingColor(score)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-900">
        {score}
      </span>
    </div>
  );
}

// ─── "Score remaining" bulk action ───────────────────────────────────────────

function ScoreRemainingButton({ group }: { group: JobGroup }) {
  const qc = useQueryClient();
  const unscored = group.apps.filter((a) => !readScore((a as any).aiMatch)).length;

  const mutation = useMutation({
    mutationFn: () => scoreUnscoredApplications({}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
    },
  });

  if (unscored === 0 && !mutation.isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
        <Sparkles className="h-3.5 w-3.5" />
        All scored
      </span>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      title="Run the AI ATS match on candidates that aren't scored yet"
      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-60"
    >
      <Sparkles className={`h-3.5 w-3.5 ${mutation.isPending ? "animate-spin" : ""}`} />
      {mutation.isPending ? "Scoring…" : `Score ${unscored} remaining`}
    </button>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AppRow = Awaited<ReturnType<typeof listApplications>>["applications"][number];
type JobRow = Awaited<ReturnType<typeof listAllJobs>>["jobs"][number];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = [
  {
    value: "shortlisted",
    label: "Shortlist",
    icon: Star,
    color: "text-amber-600",
    cardCls: "bg-gradient-to-br from-amber-400 to-amber-500",
  },
  {
    value: "interview_scheduled",
    label: "Interview",
    icon: CalendarCheck,
    color: "text-violet-600",
    cardCls: "bg-gradient-to-br from-violet-500 to-violet-600",
  },
  {
    value: "selected",
    label: "Selected",
    icon: CheckCircle2,
    color: "text-emerald-600",
    cardCls: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    cardCls: "bg-gradient-to-br from-red-500 to-red-600",
  },
  {
    value: "old",
    label: "Archived",
    icon: Archive,
    color: "text-slate-500",
    cardCls: "bg-gradient-to-br from-slate-400 to-slate-500",
  },
] as const;

type StatusValue = (typeof STATUS_CONFIG)[number]["value"] | "all";

// ─── Grouping ─────────────────────────────────────────────────────────────────

const GENERAL_KEY = "__general__";

interface JobGroup {
  key: string; // jobId, or GENERAL_KEY for speculative CVs
  title: string;
  department: string; // drives the role icon (shared with the public careers page)
  isGeneral: boolean;
  active: boolean; // false for inactive/hidden postings (ignored for general)
  createdAt: number; // job creation time — tiebreaker when no applications yet
  apps: AppRow[];
}

/** Timestamp of the most recent application in a group (0 if none). */
function latestApplicationTime(group: JobGroup): number {
  if (group.apps.length === 0) return 0;
  return Math.max(...group.apps.map((a) => new Date(a.appliedAt).getTime()));
}

/**
 * Build one group per job posting — INCLUDING jobs with zero applications —
 * then attach their applications. A trailing "General / Speculative CVs" group
 * collects any applications not tied to a posting.
 */
function buildGroups(jobs: JobRow[], apps: AppRow[]): JobGroup[] {
  const map = new Map<string, JobGroup>();

  // 1. Seed a group for every job posting (so 0-application jobs still show).
  for (const job of jobs) {
    map.set(job.id, {
      key: job.id,
      title: job.title,
      department: job.department,
      isGeneral: false,
      active: job.active,
      createdAt: new Date(job.createdAt).getTime(),
      apps: [],
    });
  }

  // 2. Attach applications to their job; collect orphans under General.
  for (const app of apps) {
    const key = app.jobId && map.has(app.jobId) ? app.jobId : app.jobId ? app.jobId : GENERAL_KEY;

    if (!map.has(key)) {
      // Application references a job we didn't get (deleted posting) OR is general.
      map.set(key, {
        key,
        title: key === GENERAL_KEY ? "General / Speculative CVs" : app.jobTitle,
        department: key === GENERAL_KEY ? "" : app.jobTitle,
        isGeneral: key === GENERAL_KEY,
        active: true,
        createdAt: 0,
        apps: [],
      });
    }
    map.get(key)!.apps.push(app);
  }

  const groups = Array.from(map.values());
  // General always last. Otherwise the job with the most recent application
  // comes first; jobs with no applications yet fall back to newest posting.
  groups.sort((a, b) => {
    if (a.isGeneral) return 1;
    if (b.isGeneral) return -1;

    const aLatest = latestApplicationTime(a);
    const bLatest = latestApplicationTime(b);

    // Both have applications (or both have none) → compare latest application.
    if (aLatest !== bLatest) return bLatest - aLatest;

    // Tie (e.g. both at 0 applications) → newest posting first.
    return b.createdAt - a.createdAt;
  });
  return groups;
}

// ─── Main component — routes between overview and drill-in ───────────────────

export default function ApplicationsTable() {
  const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => listApplications(),
    staleTime: 15_000,
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["admin-all-jobs"],
    queryFn: () => listAllJobs(),
    staleTime: 30_000,
  });

  const apps = data?.applications ?? [];
  const jobs = jobsData?.jobs ?? [];
  const groups = useMemo(() => buildGroups(jobs, apps), [jobs, apps]);

  const selectedGroup = selectedJobKey
    ? groups.find((g) => g.key === selectedJobKey) ?? null
    : null;

  // Drill-in view
  if (selectedGroup) {
    return (
      <JobApplications
        group={selectedGroup}
        onBack={() => setSelectedJobKey(null)}
      />
    );
  }

  // Overview — list of jobs
  return (
    <JobsOverview
      groups={groups}
      totalApps={apps.length}
      isLoading={isLoading || jobsLoading}
      onOpenJob={(key) => setSelectedJobKey(key)}
    />
  );
}

// ─── Overview: list of jobs with per-job counts ─────────────────────────────

function JobsOverview({
  groups,
  totalApps,
  isLoading,
  onOpenJob,
}: {
  groups: JobGroup[];
  totalApps: number;
  isLoading: boolean;
  onOpenJob: (key: string) => void;
}) {
  const jobGroups = groups.filter((g) => !g.isGeneral);
  const generalGroup = groups.find((g) => g.isGeneral);

  function statusCount(group: JobGroup, status: string) {
    return group.apps.filter((a) => a.status === status).length;
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Applications
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {totalApps} total across {jobGroups.length} job{jobGroups.length !== 1 ? "s" : ""}
          {" · "}select a job to review its candidates
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : jobGroups.length === 0 && !generalGroup ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={<Inbox />}
            title="No applications yet"
            description="When candidates apply on the careers page, their applications will appear grouped by job here."
          />
        </div>
      ) : (
        <>
          {/* Job cards */}
          <div className="space-y-3">
            {jobGroups.map((group, idx) => {
              const newCount = statusCount(group, "new");
              const { icon: RoleIcon, tile } = departmentStyle(group.department, idx);
              return (
                <button
                  key={group.key}
                  onClick={() => onOpenJob(group.key)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border bg-white p-5 text-left shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all hover:border-[#1a6cf5]/40 hover:shadow-md ${
                    group.active ? "border-slate-200" : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  {/* Role icon — same mapping as the public careers page */}
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${tile} ${
                      group.active ? "" : "opacity-50 grayscale"
                    }`}
                  >
                    <RoleIcon className="h-6 w-6" strokeWidth={1.75} />
                  </span>

                  {/* Title + counts */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-lg font-bold text-slate-900 group-hover:text-[#1a6cf5] transition-colors">
                        {group.title}
                      </h3>
                      {!group.active && (
                        <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                      {newCount > 0 && (
                        <span className="shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                          {newCount} new
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        {group.apps.length} application{group.apps.length !== 1 ? "s" : ""}
                      </span>
                      {group.apps.length === 0 ? (
                        <span className="text-slate-400">No applications yet</span>
                      ) : (
                        STATUS_CONFIG.map((s) => {
                          const c = statusCount(group, s.value);
                          if (c === 0) return null;
                          return (
                            <span key={s.value} className="flex items-center gap-1">
                              <span className={`h-1.5 w-1.5 rounded-full ${s.cardCls}`} />
                              {c} {s.label.toLowerCase()}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300 transition-all group-hover:border-[#1a6cf5]/30 group-hover:bg-[#1a6cf5]/5 group-hover:text-[#1a6cf5]">
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* General / speculative — low emphasis, compact */}
          {generalGroup && (
            <button
              onClick={() => onOpenJob(generalGroup.key)}
              className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-left transition-colors hover:bg-slate-100/60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-500">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-600">
                  General / Speculative CVs
                </p>
                <p className="text-xs text-slate-400">
                  {generalGroup.apps.length} not tied to a specific job
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Drill-in: one job's applications with status filters ────────────────────

function JobApplications({ group, onBack }: { group: JobGroup; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusValue>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const apps = group.apps;
  const q = search.trim().toLowerCase();

  const countFor = (s: string) =>
    s === "all" ? apps.length : apps.filter((a) => a.status === s).length;

  const filtered = apps.filter((a) => {
    const matchSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.currentLocation.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Breadcrumb back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All jobs
      </button>

      {/* Job heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          {group.isGeneral ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-500">
              <FileText className="h-5 w-5" />
            </span>
          ) : (
            (() => {
              const { icon: RoleIcon, tile } = departmentStyle(group.department, 0);
              return (
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${tile}`}
                >
                  <RoleIcon className="h-5 w-5" />
                </span>
              );
            })()
          )}
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {group.title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {apps.length} application{apps.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Score remaining — job applications only */}
          {!group.isGeneral && <ScoreRemainingButton group={group} />}
          {/* Search */}
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email…"
              className={`${inputCls} pl-9`}
              aria-label="Search applications"
            />
          </div>
        </div>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <StatCard
          icon={Users}
          label="All"
          count={apps.length}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
          iconCls="text-[#1a6cf5]"
          cardCls="bg-gradient-to-br from-[#1a6cf5] to-[#4f90f7]"
        />
        {STATUS_CONFIG.map((s) => (
          <StatCard
            key={s.value}
            icon={s.icon}
            label={s.label}
            count={countFor(s.value)}
            active={statusFilter === s.value}
            onClick={() => setStatusFilter((prev) => (prev === s.value ? "all" : s.value))}
            iconCls={s.color}
            cardCls={s.cardCls}
          />
        ))}
      </div>

      {/* Active filter indicator */}
      {statusFilter !== "all" && (
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-sm text-slate-500">
            Showing{" "}
            <strong className="text-slate-800">
              {STATUS_CONFIG.find((s) => s.value === statusFilter)?.label}
            </strong>{" "}
            · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className="ml-1 text-xs font-medium text-[#1a6cf5] hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox />}
            title={
              statusFilter === "all"
                ? "No matching applications"
                : `No ${STATUS_CONFIG.find((s) => s.value === statusFilter)?.label.toLowerCase()} applications`
            }
            description="Try a different filter or clear your search."
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Applicant
                  </th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    ATS
                  </th>
                  <th className="hidden px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:table-cell">
                    Location
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Experience
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Applied
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="w-10 px-3 py-3.5" aria-label="Open" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.fullName} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900 group-hover:text-[#1a6cf5] transition-colors">
                            {app.fullName}
                          </p>
                          <p className="truncate text-xs text-slate-500">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <ScoreCell aiMatch={(app as any).aiMatch} />
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 text-slate-600 lg:table-cell">
                      {app.currentLocation}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{app.yearsExperience}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300 transition-all group-hover:border-[#1a6cf5]/30 group-hover:bg-[#1a6cf5]/5 group-hover:text-[#1a6cf5]">
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {filtered.map((app) => (
                <li key={app.id}>
                  <button
                    onClick={() => setSelectedId(app.id)}
                    className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50/70 transition-colors"
                  >
                    <Avatar name={app.fullName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-slate-900">{app.fullName}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {app.currentLocation} · {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <p className="text-xs text-slate-400">
                Showing <strong className="text-slate-600">{filtered.length}</strong> of{" "}
                <strong className="text-slate-600">{apps.length}</strong> in this job
              </p>
            </div>
          </>
        )}
      </div>

      {/* Detail */}
      {selectedId && (
        <ApplicationDetail applicationId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  iconCls,
  cardCls,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  iconCls: string;
  cardCls: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:shadow-sm ${
        active ? `${cardCls} border-transparent shadow-sm` : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-white/25" : "bg-slate-100 group-hover:bg-slate-200"
        } transition-colors`}
      >
        <Icon className={`h-4 w-4 ${active ? "text-white" : iconCls}`} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p
          className={`font-display text-xl font-black tabular-nums leading-none ${
            active ? "text-white" : "text-slate-900"
          }`}
        >
          {count}
        </p>
        <p className={`mt-0.5 truncate text-xs font-medium ${active ? "text-white/80" : "text-slate-500"}`}>
          {label}
        </p>
      </div>
    </button>
  );
}
