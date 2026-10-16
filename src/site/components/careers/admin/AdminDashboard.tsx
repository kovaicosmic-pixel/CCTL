import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  FileText,
  Bell,
  ArrowRight,
  Plus,
  Users,
  ListChecks,
  Info,
} from "lucide-react";
import { getDashboardStats } from "@/site/lib/careersAdmin";
import type { AdminSession } from "@/site/lib/careersAuth";
import { PageHeader, Button } from "./ui";

interface Props {
  session: AdminSession;
  onNavigate: (tab: string) => void;
}

export default function AdminDashboard({ session, onNavigate }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => getDashboardStats(),
    staleTime: 30_000,
  });

  const stats = [
    {
      icon: Briefcase,
      label: "Active job postings",
      value: data?.activeJobs ?? 0,
      iconCls: "bg-blue-50 text-blue-600",
      tab: "jobs",
    },
    {
      icon: FileText,
      label: "Total applications",
      value: data?.totalApplications ?? 0,
      iconCls: "bg-violet-50 text-violet-600",
      tab: "applications",
    },
    {
      icon: Bell,
      label: "New this month",
      value: data?.newThisMonth ?? 0,
      iconCls: "bg-emerald-50 text-emerald-600",
      tab: "applications",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Post a new job",
      description: "Add a new position to the careers page",
      tab: "new-job",
      show: true,
    },
    {
      icon: FileText,
      label: "Review applications",
      description: "Read, download and shortlist candidates",
      tab: "applications",
      show: true,
    },
    {
      icon: ListChecks,
      label: "Manage job postings",
      description: "Edit, publish or hide existing postings",
      tab: "jobs",
      show: true,
    },
    {
      icon: Users,
      label: "Team & admins",
      description: "Add or remove admin accounts",
      tab: "team",
      show: session.role === "superadmin",
    },
  ].filter((a) => a.show);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${session.name.split(" ")[0]}`}
        description="Here's what's happening with your careers portal."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => onNavigate("new-job")}>
            New job
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.tab)}
            className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.iconCls}`}>
                <s.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{s.label}</p>
            {isLoading ? (
              <div className="mt-1.5 h-8 w-12 animate-pulse rounded bg-slate-100" />
            ) : (
              <p className="font-display mt-0.5 text-3xl font-bold tabular-nums text-slate-900">
                {s.value}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Quick actions</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((a) => (
            <button
              key={a.tab}
              onClick={() => onNavigate(a.tab)}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-blue-200 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                <a.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{a.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{a.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold text-slate-900">Good to know:</strong> applications
          are saved to the database the moment a candidate applies — even if an email
          notification is missed, every application is always available in the Applications tab.
        </p>
      </div>
    </div>
  );
}
