import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Check,
  Building2,
} from "lucide-react";
import { getApplication, updateApplicationStatus } from "@/site/lib/careersAdmin";
import { APPLICATION_STATUSES, Avatar, StatusBadge, formatDate } from "./ui";

interface Props {
  applicationId: string;
  onClose: () => void;
}

const PREFERRED_LOCATION_LABELS: Record<string, string> = {
  coimbatore: "Coimbatore",
  bangalore: "Bangalore",
  either: "Either location",
};

const ACTIVE_STATUS_CLS: Record<string, string> = {
  new: "border-blue-500 bg-blue-50 text-blue-700",
  reviewed: "border-amber-500 bg-amber-50 text-amber-700",
  shortlisted: "border-emerald-500 bg-emerald-50 text-emerald-700",
  rejected: "border-red-500 bg-red-50 text-red-700",
};

export default function ApplicationDetail({ applicationId, onClose }: Props) {
  const qc = useQueryClient();
  const [statusSaved, setStatusSaved] = useState(false);

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
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Application details"
    >
      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <h3 className="text-base font-semibold text-slate-900">Application details</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          )}

          {app && (
            <div className="divide-y divide-slate-100">
              {/* Applicant */}
              <section className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar name={app.fullName} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-xl font-bold text-slate-900">
                        {app.fullName}
                      </p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#1a6cf5]">{app.jobTitle}</p>
                  </div>
                </div>

                <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  <InfoItem icon={<Mail />} label="Email">
                    <a href={`mailto:${app.email}`} className="text-[#1a6cf5] hover:underline">
                      {app.email}
                    </a>
                  </InfoItem>
                  <InfoItem icon={<Phone />} label="Phone">
                    <a href={`tel:${app.phone}`} className="hover:underline">
                      {app.phone}
                    </a>
                  </InfoItem>
                  <InfoItem icon={<MapPin />} label="Current location">
                    {app.currentLocation}
                  </InfoItem>
                  {app.preferredLocation && (
                    <InfoItem icon={<Building2 />} label="Preferred lab">
                      {PREFERRED_LOCATION_LABELS[app.preferredLocation] ?? app.preferredLocation}
                    </InfoItem>
                  )}
                  <InfoItem icon={<Briefcase />} label="Experience">
                    {app.yearsExperience}
                  </InfoItem>
                  <InfoItem icon={<Calendar />} label="Applied on">
                    {formatDate(app.appliedAt, true)}
                  </InfoItem>
                </dl>
              </section>

              {/* Status */}
              <section className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Status</h4>
                  {statusSaved && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {APPLICATION_STATUSES.map((opt) => {
                    const on = app.status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => !on && statusMutation.mutate(opt.value)}
                        disabled={statusMutation.isPending}
                        aria-pressed={on}
                        className={`h-10 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 ${
                          on
                            ? ACTIVE_STATUS_CLS[opt.value]
                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Resume */}
              <section className="p-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-900">Resume</h4>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <FileText className="h-5 w-5" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                    {app.resumeFilename}
                  </p>
                  <button
                    onClick={downloadResume}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#1a6cf5] px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#155ad0]"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </section>

              {/* Cover letter */}
              <section className="p-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-900">Cover letter</h4>
                {app.coverLetter ? (
                  <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {app.coverLetter}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No cover letter provided.</p>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

function b64toBlob(b64Data: string, contentType: string): Blob {
  const binary = atob(b64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: contentType });
}
