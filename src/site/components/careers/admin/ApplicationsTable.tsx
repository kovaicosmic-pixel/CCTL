import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronRight, Inbox } from "lucide-react";
import { listApplications } from "@/site/lib/careersAdmin";
import ApplicationDetail from "./ApplicationDetail";
import {
  APPLICATION_STATUSES,
  Badge,
  Avatar,
  Card,
  EmptyState,
  PageHeader,
  SkeletonRows,
  StatusBadge,
  formatDate,
  inputCls,
} from "./ui";

const FILTERS = [{ value: "all", label: "All" }, ...APPLICATION_STATUSES];

export default function ApplicationsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => listApplications(),
    staleTime: 15_000,
  });

  const apps = data?.applications ?? [];
  const q = search.trim().toLowerCase();

  const filtered = apps.filter((a) => {
    const matchSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.jobTitle.toLowerCase().includes(q) ||
      a.currentLocation.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countFor = (s: string) =>
    s === "all" ? apps.length : apps.filter((a) => a.status === s).length;

  return (
    <div>
      <PageHeader
        title="Applications"
        description={`${countFor("new")} new · ${apps.length} total`}
      />

      <Card padded={false} className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
            {FILTERS.map((f) => {
              const on = statusFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    on ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-xs tabular-nums ${
                      on ? "bg-slate-100 text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {countFor(f.value)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role…"
              className={`${inputCls} pl-9`}
              aria-label="Search applications"
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonRows rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox />}
            title={apps.length === 0 ? "No applications yet" : "No matching applications"}
            description={
              apps.length === 0
                ? "When candidates apply on the careers page, they'll appear here."
                : "Try a different search term or status filter."
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Applicant</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="hidden px-5 py-3 lg:table-cell">Location</th>
                  <th className="px-5 py-3">Applied</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="w-10 px-3 py-3" aria-label="Open" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.fullName} />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(app.id);
                            }}
                            className="truncate font-semibold text-slate-900 hover:text-[#1a6cf5] focus-visible:underline focus-visible:outline-none"
                          >
                            {app.fullName}
                          </button>
                          <p className="truncate text-xs text-slate-500">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {app.jobId ? (
                        app.jobTitle
                      ) : (
                        <span className="flex flex-col items-start gap-1">
                          <Badge tone="violet">General CV</Badge>
                          {app.jobTitle.replace(/^General Application — /, "")}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-600 lg:table-cell">
                      {app.currentLocation}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-3.5">
                      <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
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
                    className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"
                  >
                    <Avatar name={app.fullName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-slate-900">{app.fullName}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {app.jobTitle} · {formatDate(app.appliedAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {selectedId && (
        <ApplicationDetail applicationId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
