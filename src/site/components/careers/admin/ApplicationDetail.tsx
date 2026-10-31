import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Check,
  Building2,
  Send,
  RefreshCw,
  MessageSquare,
  Clock,
  Sparkles,
  X,
  Trash2,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRightCircle,
  Archive,
  XCircle,
  Lock,
  FileSignature,
} from "lucide-react";
import {
  getApplication,
  updateApplicationStatus,
  listNotes,
  addNote,
  summariseNotes,
  deleteNote,
  matchResumeToJob,
} from "@/site/lib/careersAdmin";
import { getSession } from "@/site/lib/careersAuth";
import {
  APPLICATION_STATUSES,
  Avatar,
  StatusBadge,
  formatDate,
  Button,
} from "./ui";

interface Props {
  applicationId: string;
  onClose: () => void;
}

// ─── Status colours for the button strip ─────────────────────────────────────

const STATUS_BTN: Record<
  string,
  { border: string; bg: string; text: string; activeBg: string; activeText: string }
> = {
  new: {
    border: "border-blue-200",
    bg: "hover:bg-blue-50",
    text: "text-blue-700",
    activeBg: "bg-blue-500 border-blue-500",
    activeText: "text-white",
  },
  shortlisted: {
    border: "border-amber-200",
    bg: "hover:bg-amber-50",
    text: "text-amber-700",
    activeBg: "bg-amber-500 border-amber-500",
    activeText: "text-white",
  },
  interview_scheduled: {
    border: "border-violet-200",
    bg: "hover:bg-violet-50",
    text: "text-violet-700",
    activeBg: "bg-violet-500 border-violet-500",
    activeText: "text-white",
  },
  selected: {
    border: "border-emerald-200",
    bg: "hover:bg-emerald-50",
    text: "text-emerald-700",
    activeBg: "bg-emerald-500 border-emerald-500",
    activeText: "text-white",
  },
  rejected: {
    border: "border-red-200",
    bg: "hover:bg-red-50",
    text: "text-red-700",
    activeBg: "bg-red-500 border-red-500",
    activeText: "text-white",
  },
  old: {
    border: "border-slate-200",
    bg: "hover:bg-slate-50",
    text: "text-slate-600",
    activeBg: "bg-slate-500 border-slate-500",
    activeText: "text-white",
  },
};

// ─── Hiring pipeline ─────────────────────────────────────────────────────────
// The main forward flow shown as a pipeline. "rejected" and "old" are
// off-pipeline outcomes handled with separate action buttons.

const PIPELINE = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "selected", label: "Selected" },
] as const;

/** Stages at or after "shortlisted" unlock the interview + offer sections. */
const POST_SHORTLIST = new Set(["shortlisted", "interview_scheduled", "selected"]);

/** The suggested next step in the pipeline for the current status. */
function nextStep(status: string): { value: string; label: string } | null {
  const idx = PIPELINE.findIndex((p) => p.value === status);
  if (idx === -1 || idx >= PIPELINE.length - 1) return null;
  return PIPELINE[idx + 1];
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ApplicationDetail({ applicationId, onClose }: Props) {
  const qc = useQueryClient();
  const [statusSaved, setStatusSaved] = useState(false);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const { data, isLoading } = useQuery({
    queryKey: ["application-detail", applicationId],
    queryFn: () => getApplication({ data: { id: applicationId } }),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      updateApplicationStatus({ data: { id: applicationId, status: status as any } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      qc.invalidateQueries({ queryKey: ["application-detail", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    },
  });

  const app = data?.application;

  function downloadResume() {
    if (!app) return;
    const ext = app.resumeFilename.split(".").pop()?.toLowerCase() ?? "pdf";
    const mimeType =
      ext === "pdf"
        ? "application/pdf"
        : ext === "doc"
          ? "application/msword"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const blob = b64toBlob(app.resumeData, mimeType);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = app.resumeFilename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    // Full-screen overlay
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-100"
      role="dialog"
      aria-modal="true"
      aria-label="Application details"
    >
      {/* ── Top bar ── */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-5 shadow-sm">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>

        {app && (
          <>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <Avatar name={app.fullName} size="sm" />
              <span className="font-semibold text-slate-900">{app.fullName}</span>
              <StatusBadge status={app.status} />
            </div>

            {/* Status saved indicator */}
            {statusSaved && (
              <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Check className="h-3.5 w-3.5" />
                Status saved
              </span>
            )}
          </>
        )}
      </header>

      {/* ── Body — two-column layout ── */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1a6cf5]" />
        </div>
      ) : app ? (
        <div className="flex flex-1 gap-0 overflow-hidden lg:gap-0">
          {/* ── LEFT — candidate profile ── */}
          <div className="flex w-full flex-col overflow-y-auto lg:w-[48%] xl:w-[50%]">
            <div className="space-y-5 p-6">
              {/* Profile card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-5">
                  <Avatar name={app.fullName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-2xl font-bold text-slate-900">
                      {app.fullName}
                    </h1>
                    <p className="mt-0.5 font-medium text-[#1a6cf5]">{app.jobTitle}</p>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem icon={<Mail />} label="Email">
                    <a href={`mailto:${app.email}`} className="text-[#1a6cf5] hover:underline break-all">
                      {app.email}
                    </a>
                  </InfoItem>
                  <InfoItem icon={<Phone />} label="Phone">
                    <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                  </InfoItem>
                  <InfoItem icon={<MapPin />} label="Current location">
                    {app.currentLocation}
                  </InfoItem>
                  {app.preferredLocation && (
                    <InfoItem icon={<Building2 />} label="Preferred lab">
                      {{ coimbatore: "Coimbatore", bangalore: "Bangalore", either: "Either location" }[app.preferredLocation] ?? app.preferredLocation}
                    </InfoItem>
                  )}
                  <InfoItem icon={<Briefcase />} label="Experience">
                    {app.yearsExperience}
                  </InfoItem>
                  <InfoItem icon={<Calendar />} label="Applied on">
                    {formatDate(app.appliedAt, true)}
                  </InfoItem>
                </dl>
              </div>

              {/* Status pipeline */}
              <StatusPipeline
                status={app.status}
                pending={statusMutation.isPending}
                onChange={(s) => statusMutation.mutate(s)}
              />

              {/* Resume */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Resume</h3>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                    {app.resumeFilename}
                  </p>
                  <button
                    onClick={downloadResume}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#1a6cf5] px-3.5 text-sm font-semibold text-white hover:bg-[#155ad0] transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                {/* AI job-match check */}
                <ResumeMatch
                  applicationId={app.id}
                  isGeneral={!app.jobId}
                  cached={app.aiMatch ?? null}
                />
              </div>

              {/* Cover letter */}
              {app.coverLetter ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Cover Letter</h3>
                  <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {app.coverLetter}
                  </div>
                </div>
              ) : null}

              {/* Offer letter — only when Selected (point 3) */}
              {app.status === "selected" && <OfferLetterCard application={app} />}
            </div>
          </div>

          {/* ── RIGHT — collaborative notes (gated to shortlisted+) ── */}
          <div className="hidden flex-col border-l border-slate-200 bg-white lg:flex lg:w-[52%] xl:w-[50%]">
            {POST_SHORTLIST.has(app.status) ? (
              <NotesPanel applicationId={app.id} cachedSummary={app.aiSummary ?? null} />
            ) : (
              <NotesLocked status={app.status} />
            )}
          </div>

          {/* Mobile notes — below profile */}
          <div className="block lg:hidden w-full border-t border-slate-200 bg-white">
            {POST_SHORTLIST.has(app.status) ? (
              <NotesPanel applicationId={app.id} cachedSummary={app.aiSummary ?? null} />
            ) : (
              <NotesLocked status={app.status} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Notes locked state (before shortlisted) ─────────────────────────────────

function NotesLocked({ status }: { status: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Lock className="h-6 w-6 text-slate-400" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Interview notes unlock after shortlisting
        </p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-400">
          {status === "rejected" || status === "old"
            ? "This candidate isn't in the active pipeline. Move them back to Shortlisted to record interview feedback."
            : "Shortlist this candidate to start recording interview feedback and comments from the team."}
        </p>
      </div>
    </div>
  );
}

// ─── Offer letter (appears only when Selected) ───────────────────────────────
// Generates a clean built-in offer letter filled with the candidate's details.
// A custom HR template can replace this generator later.

function OfferLetterCard({ application }: { application: any }) {
  function buildLetter(): string {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return [
      "COSMIC COMPLIANCE TEST LAB (CCTL)",
      "Coimbatore & Bangalore, India",
      "",
      `Date: ${today}`,
      "",
      `Dear ${application.fullName},`,
      "",
      `Subject: Offer of Employment — ${application.jobTitle}`,
      "",
      `We are pleased to offer you the position of ${application.jobTitle} at Cosmic Compliance Test Lab. Following your application and interview, the team was impressed with your profile and we believe you will be a valuable addition to our EMC/EMI testing team.`,
      "",
      "The details of your role, compensation, joining date, and terms of employment will be shared separately by the HR department. Please treat this letter as a confirmation of our intent to extend you a formal offer.",
      "",
      "We look forward to welcoming you to the team.",
      "",
      "Warm regards,",
      "HR Department",
      "Cosmic Compliance Test Lab",
      "emc@cosmictestlab.com",
      "",
      "─────────────────────────────────────",
      `Candidate: ${application.fullName}`,
      `Email: ${application.email}`,
      `Phone: ${application.phone}`,
      `Position: ${application.jobTitle}`,
    ].join("\n");
  }

  function download() {
    const blob = new Blob([buildLetter()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = application.fullName.replace(/[^a-z0-9]+/gi, "_");
    a.download = `Offer_Letter_${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <FileSignature className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-emerald-900">Offer Letter</h3>
          <p className="mt-0.5 text-xs text-emerald-700">
            This candidate is selected. Download a draft offer letter pre-filled with their details.
          </p>
          <button
            onClick={download}
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Download Offer Letter
          </button>
          <p className="mt-2 text-[11px] text-emerald-600/70">
            Draft format · a custom HR template can be plugged in later
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Status pipeline — guided but flexible (point 4b) ────────────────────────

function StatusPipeline({
  status,
  pending,
  onChange,
}: {
  status: string;
  pending: boolean;
  onChange: (status: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const currentIdx = PIPELINE.findIndex((p) => p.value === status);
  const isRejected = status === "rejected";
  const isOld = status === "old";
  const suggestion = nextStep(status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Hiring Stage</h3>
        <StatusBadge status={status} />
      </div>

      {/* Visual pipeline */}
      <div className="flex items-center">
        {PIPELINE.map((step, i) => {
          const done = currentIdx >= 0 && i <= currentIdx;
          const isCurrent = step.value === status;
          return (
            <div key={step.value} className="flex flex-1 items-center last:flex-none">
              <button
                onClick={() => !isCurrent && onChange(step.value)}
                disabled={pending}
                title={`Set status to ${step.label}`}
                className={`flex flex-col items-center gap-1.5 transition-opacity disabled:opacity-60 ${
                  isCurrent ? "" : "opacity-80 hover:opacity-100"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                    isCurrent
                      ? "border-[#1a6cf5] bg-[#1a6cf5] text-white"
                      : done && !isRejected && !isOld
                        ? "border-emerald-400 bg-emerald-400 text-white"
                        : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {done && !isCurrent && !isRejected && !isOld ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`whitespace-nowrap text-[11px] font-medium ${
                    isCurrent ? "text-[#1a6cf5]" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {/* Connector */}
              {i < PIPELINE.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded ${
                    currentIdx > i && !isRejected && !isOld ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Off-pipeline state note */}
      {(isRejected || isOld) && (
        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          This candidate is currently marked{" "}
          <strong>{isRejected ? "Rejected" : "Archived"}</strong>. Use the actions below to
          move them back into the pipeline if needed.
        </div>
      )}

      {/* Primary action: advance to next step */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {suggestion && !isRejected && !isOld && (
          <button
            onClick={() => onChange(suggestion.value)}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1a6cf5] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#155ad0] disabled:opacity-60"
          >
            {pending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRightCircle className="h-4 w-4" />}
            Move to {suggestion.label}
          </button>
        )}

        {/* Reject — always available (4b flexible) */}
        {status !== "rejected" && (
          <button
            onClick={() => onChange("rejected")}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        )}

        {/* Archive / hold — manual (point 2a) */}
        {status !== "old" && (
          <button
            onClick={() => onChange("old")}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
        )}

        {/* More / jump to any status (4b) */}
        <button
          onClick={() => setShowAll((v) => !v)}
          className="ml-auto text-xs font-medium text-slate-400 hover:text-slate-700"
        >
          {showAll ? "Hide" : "Set any status"}
        </button>
      </div>

      {/* Full status list — flexible override */}
      {showAll && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {APPLICATION_STATUSES.map((opt) => {
            const on = status === opt.value;
            const s = STATUS_BTN[opt.value] ?? STATUS_BTN["new"];
            return (
              <button
                key={opt.value}
                onClick={() => !on && onChange(opt.value)}
                disabled={pending}
                aria-pressed={on}
                className={`h-8 rounded-full border px-3.5 text-xs font-semibold transition-all disabled:opacity-60 ${
                  on
                    ? `${s.activeBg} ${s.activeText} shadow-sm`
                    : `border-slate-200 bg-white text-slate-600 ${s.bg} hover:border-slate-300`
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Resume ↔ Job AI match ───────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 75) return { ring: "text-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" };
  if (score >= 50) return { ring: "text-amber-500", text: "text-amber-600", bg: "bg-amber-50" };
  return { ring: "text-red-500", text: "text-red-600", bg: "bg-red-50" };
}

interface MatchResult {
  jobTitle: string;
  score: number;
  verdict: string;
  matched: string[];
  missing: string[];
  summary: string;
  generatedAt: string;
}

function ResumeMatch({
  applicationId,
  isGeneral,
  cached,
}: {
  applicationId: string;
  isGeneral: boolean;
  cached: string | null;
}) {
  // Parse the cached (DB-stored) result once, if present.
  const cachedResult: MatchResult | null = useMemo(() => {
    if (!cached) return null;
    try {
      return JSON.parse(cached) as MatchResult;
    } catch {
      return null;
    }
  }, [cached]);

  const [dismissed, setDismissed] = useState(false);

  const mutation = useMutation({
    mutationFn: () => matchResumeToJob({ data: { applicationId } }),
  });

  // Live result from a fresh run takes priority; otherwise fall back to cache.
  const freshOk = mutation.data?.ok === true ? mutation.data : null;
  const res = freshOk ?? (cachedResult && !dismissed ? { ok: true as const, ...cachedResult } : mutation.data);
  const ok = res?.ok === true;

  // Don't offer the check on general CVs (nothing to match against).
  if (isGeneral) return null;

  return (
    <div className="mt-3">
      {!ok && (
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-all hover:from-violet-100 hover:to-fuchsia-100 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Target className="h-4 w-4" />
          )}
          {mutation.isPending ? "Analyzing resume…" : "AI Match Check"}
        </button>
      )}

      {/* Error / info message */}
      {res && !res.ok && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{res.message}</span>
        </div>
      )}

      {/* Result */}
      {ok && (
        <div className="overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/70 to-fuchsia-50/40">
          <div className="flex items-center justify-between border-b border-violet-100 bg-white/50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Target className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-violet-700">
                Job Match
              </span>
            </div>
            <button
              onClick={() => {
                mutation.reset();
                setDismissed(true);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-violet-400 hover:bg-violet-100 hover:text-violet-700"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-4">
            {/* Score + verdict */}
            <div className="flex items-center gap-4">
              <ScoreRing score={res.score} />
              <div>
                <p className={`text-lg font-bold ${scoreColor(res.score).text}`}>{res.verdict}</p>
                <p className="text-xs text-slate-500">vs. {res.jobTitle}</p>
              </div>
            </div>

            {/* Summary */}
            {res.summary && (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{res.summary}</p>
            )}

            {/* Matched / missing */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Matched
                </p>
                {res.matched.length ? (
                  <ul className="space-y-1">
                    {res.matched.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">None clearly evidenced</p>
                )}
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> Missing / Gaps
                </p>
                {res.missing.length ? (
                  <ul className="space-y-1">
                    {res.missing.map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">No major gaps</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-violet-100 pt-3">
              <p className="text-[11px] text-violet-400">
                {res.generatedAt
                  ? `Analyzed ${formatDate(res.generatedAt, false)} · review before deciding`
                  : "AI-assessed from resume text · review before deciding"}
              </p>
              <button
                onClick={() => {
                  setDismissed(false);
                  mutation.mutate();
                }}
                disabled={mutation.isPending}
                className="text-xs font-medium text-violet-600 hover:underline disabled:opacity-50"
              >
                Re-run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const { ring } = scoreColor(score);
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-200" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={ring}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-slate-900">
        {score}
      </span>
    </div>
  );
}

// ─── Notes panel — full-height, feels like a chat thread ─────────────────────

function NotesPanel({
  applicationId,
  cachedSummary,
}: {
  applicationId: string;
  cachedSummary: string | null;
}) {
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = useQuery({
    queryKey: ["application-notes", applicationId],
    queryFn: () => listNotes({ data: { applicationId } }),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  const addMutation = useMutation({
    mutationFn: (note: string) => addNote({ data: { applicationId, note } }),
    onSuccess: () => {
      setNoteText("");
      qc.invalidateQueries({ queryKey: ["application-notes", applicationId] }).then(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
    },
  });

  // Current admin — to decide which notes can be deleted
  const { data: sessionData } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => getSession(),
    staleTime: 5 * 60_000,
  });
  const currentAdminId = sessionData?.session?.id ?? null;
  const isSuperAdmin = sessionData?.session?.role === "superadmin";

  // Delete-note state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote({ data: { id } }),
    onSuccess: () => {
      setConfirmDeleteId(null);
      qc.invalidateQueries({ queryKey: ["application-notes", applicationId] });
    },
  });

  // AI summary state — seeded from the DB-cached summary so it persists.
  const [summary, setSummary] = useState<string | null>(cachedSummary);
  const [summaryInfo, setSummaryInfo] = useState<{ noteCount: number } | null>(null);
  const summaryMutation = useMutation({
    mutationFn: () => summariseNotes({ data: { applicationId } }),
    onSuccess: (res) => {
      if (res.ok) {
        setSummary(res.summary);
        setSummaryInfo({ noteCount: res.noteCount });
      } else {
        setSummary(null);
        setSummaryInfo(null);
      }
    },
  });
  const summaryError =
    summaryMutation.data && !summaryMutation.data.ok ? summaryMutation.data.message : null;

  const notes = data?.notes ?? [];

  // Scroll to bottom when notes first load
  useEffect(() => {
    if (notes.length > 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "instant" }), 50);
    }
  }, [isLoading]);

  function handleSubmit() {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  }

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Panel header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a6cf5]/10">
            <MessageSquare className="h-4 w-4 text-[#1a6cf5]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Team Notes</p>
            <p className="text-[11px] text-slate-400">
              {notes.length} note{notes.length !== 1 ? "s" : ""} · visible to all admins
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {/* AI summary trigger — only when there are 2+ notes */}
          {notes.length >= 2 && (
            <button
              onClick={() => summaryMutation.mutate()}
              disabled={summaryMutation.isPending}
              title="Summarize all notes with AI"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-60"
            >
              {summaryMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {summaryMutation.isPending ? "Summarizing…" : "AI Summary"}
            </button>
          )}
          <button
            onClick={() => refetch()}
            title={lastUpdated ? `Updated ${lastUpdated} — click to refresh` : "Refresh notes"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ${
              isFetching ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notes feed */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* AI summary result */}
        {summary && (
          <div className="mb-4 overflow-hidden rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-fuchsia-50/40 shadow-sm">
            <div className="flex items-center justify-between border-b border-violet-100 bg-white/50 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-violet-700">
                  AI Summary
                </span>
                {summaryInfo && (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                    {summaryInfo.noteCount} notes
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSummary(null);
                  setSummaryInfo(null);
                  summaryMutation.reset();
                }}
                className="flex h-6 w-6 items-center justify-center rounded-md text-violet-400 hover:bg-violet-100 hover:text-violet-700"
                aria-label="Dismiss summary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Parsed sections */}
            <div className="space-y-3 px-4 py-4">
              <SummaryContent text={summary} />
            </div>

            <p className="border-t border-violet-100 px-4 py-2 text-[11px] text-violet-400">
              AI-generated from team notes · review before deciding
            </p>
          </div>
        )}

        {/* AI error (not configured / too few / failed) */}
        {summaryError && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{summaryError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-700">No notes yet</p>
              <p className="mt-1 text-xs text-slate-400">
                Add the first note below. Team members can see and add notes simultaneously.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-white"
              >
                {/* Author + timestamp */}
                <div className="flex items-center gap-2.5">
                  <Avatar name={note.adminName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{note.adminName}</p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(note.createdAt, false)} ·{" "}
                      {new Date(note.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {/* Delete — author or super admin only */}
                  {(note.adminId === currentAdminId || isSuperAdmin) && (
                    <button
                      onClick={() => setConfirmDeleteId(note.id)}
                      title={
                        note.adminId === currentAdminId
                          ? "Delete your note"
                          : "Delete note (super admin)"
                      }
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Note body */}
                <p className="mt-2.5 whitespace-pre-wrap pl-[2.125rem] text-sm leading-relaxed text-slate-700">
                  {note.note}
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Compose area — pinned to bottom */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#1a6cf5] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1a6cf5]/10 transition-all">
          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note, interview feedback, or comment…"
            rows={3}
            className="w-full resize-none rounded-t-xl bg-transparent px-3.5 pt-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between px-3.5 pb-3 pt-1">
            <p className="text-[11px] text-slate-400">
              {addMutation.isError ? (
                <span className="text-red-500">Failed — please try again</span>
              ) : (
                "Ctrl+Enter to send · All admins can see this"
              )}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!noteText.trim() || addMutation.isPending}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1a6cf5] px-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#155ad0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Add Note
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Notes auto-refresh every 15s · Multiple team members can write simultaneously
        </p>
      </div>

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleteMutation.isPending) setConfirmDeleteId(null);
          }}
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Delete this note?</h4>
                <p className="mt-1.5 text-sm text-slate-600">
                  This permanently removes the note for everyone. This can't be undone.
                </p>
              </div>
            </div>
            {deleteMutation.isError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {(deleteMutation.error as Error)?.message ?? "Couldn't delete the note."}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDeleteId)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Info row helper ──────────────────────────────────────────────────────────

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="mt-0.5 break-words text-sm text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

// ─── Base64 → Blob ────────────────────────────────────────────────────────────

// ─── AI summary renderer — parses the 3 sections into styled blocks ──────────

const SUMMARY_SECTIONS = [
  { key: "strengths", label: "Strengths", dot: "bg-emerald-500", text: "text-emerald-700" },
  { key: "concerns", label: "Concerns", dot: "bg-amber-500", text: "text-amber-700" },
  { key: "recommendation", label: "Recommendation", dot: "bg-violet-500", text: "text-violet-700" },
] as const;

/** Strip any stray markdown the model might still emit. */
function cleanLine(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function SummaryContent({ text }: { text: string }) {
  // Split into sections by heading keyword. Falls back to plain text if the
  // model didn't follow the format.
  const lines = text.split("\n").map((l) => l.trim());
  const sections: Record<string, string[]> = {};
  let current: string | null = null;

  for (const raw of lines) {
    const line = cleanLine(raw);
    if (!line) continue;
    const matched = SUMMARY_SECTIONS.find(
      (s) => line.toLowerCase().replace(/[:\s]/g, "") === s.key,
    );
    if (matched) {
      current = matched.key;
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }

  const hasStructure = SUMMARY_SECTIONS.some((s) => sections[s.key]?.length);

  // Fallback — model ignored the format, show cleaned plain text
  if (!hasStructure) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {lines.map(cleanLine).filter(Boolean).join("\n")}
      </p>
    );
  }

  return (
    <>
      {SUMMARY_SECTIONS.map((s) => {
        const body = sections[s.key]?.join(" ").trim();
        if (!body) return null;
        return (
          <div key={s.key}>
            <div className="mb-1 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              <span className={`text-xs font-bold uppercase tracking-wide ${s.text}`}>
                {s.label}
              </span>
            </div>
            <p className="pl-3 text-sm leading-relaxed text-slate-700">{body}</p>
          </div>
        );
      })}
    </>
  );
}

function b64toBlob(b64Data: string, contentType: string): Blob {
  const binary = atob(b64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
}
