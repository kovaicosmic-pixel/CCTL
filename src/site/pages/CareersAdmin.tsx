import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import AdminLogin from "@/site/components/careers/admin/AdminLogin";
import ForcePasswordChange from "@/site/components/careers/admin/ForcePasswordChange";
import AdminDashboard from "@/site/components/careers/admin/AdminDashboard";
import JobsTable from "@/site/components/careers/admin/JobsTable";
import ApplicationsTable from "@/site/components/careers/admin/ApplicationsTable";
import TeamManager from "@/site/components/careers/admin/TeamManager";
import SettingsPanel from "@/site/components/careers/admin/SettingsPanel";
import { Avatar } from "@/site/components/careers/admin/ui";
import { getSession, logoutAdmin } from "@/site/lib/careersAuth";
import type { AdminSession } from "@/site/lib/careersAuth";

type Tab = "dashboard" | "jobs" | "new-job" | "applications" | "team" | "settings";

const NAV_ITEMS: {
  id: Tab;
  label: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Job Postings", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "team", label: "Team", icon: Users, superAdminOnly: true },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function CareersAdmin() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const qc = useQueryClient();

  // Check for existing session on mount
  const { data: sessionData } = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => getSession(),
    staleTime: 5 * 60_000,
    retry: false,
  });

  useEffect(() => {
    if (sessionData !== undefined) {
      setSession(sessionData.session);
      setSessionChecked(true);
    }
  }, [sessionData]);

  const logoutMutation = useMutation({
    mutationFn: () => logoutAdmin({}),
    onSuccess: () => {
      setSession(null);
      setActiveTab("dashboard");
      qc.clear();
    },
  });

  function handleNavigate(tab: string) {
    setActiveTab(tab as Tab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }

  // Loading state while checking session
  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#1a6cf5]" />
          <span className="text-sm font-medium">Loading admin panel…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={(s) => setSession(s)} />;
  }

  // Invited admins must replace their temporary password first (server-enforced too)
  if (session.mustChangePassword) {
    return (
      <ForcePasswordChange
        session={session}
        onDone={(s) => {
          setSession(s);
          qc.invalidateQueries();
        }}
        onLogout={() => logoutMutation.mutate()}
      />
    );
  }

  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || session.role === "superadmin",
  );
  const currentLabel =
    visibleNav.find((n) => n.id === activeTab || (n.id === "jobs" && activeTab === "new-job"))
      ?.label ?? "Careers Admin";

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard session={session!} onNavigate={handleNavigate} />;
      case "jobs":
        return <JobsTable session={session!} />;
      case "new-job":
        return <JobsTable session={session!} initialShowForm />;
      case "applications":
        return <ApplicationsTable />;
      case "team":
        return session?.role === "superadmin" ? (
          <TeamManager session={session} />
        ) : (
          <p className="text-sm text-slate-500">Access denied.</p>
        );
      case "settings":
        return <SettingsPanel session={session!} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#0b1424] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
          {/* Same logo as the site navbar — on a white tile so the navy wordmark stays legible */}
          <a
            href="/"
            className="flex h-11 shrink-0 items-center rounded-lg bg-white px-2 shadow-sm ring-1 ring-white/10 transition-opacity hover:opacity-90"
            title="Go to website"
          >
            <img
              src="/images/logo.webp"
              alt="Cosmic Compliance Test Lab"
              className="nav-logo h-8 w-auto object-contain"
              width={88}
              height={60}
              decoding="async"
            />
          </a>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white">Careers Admin</p>
            <p className="whitespace-nowrap text-xs leading-tight text-slate-400">Cosmic Compliance Test Lab</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>
          <ul className="space-y-1">
            {visibleNav.map((item) => {
              const isActive =
                activeTab === item.id || (item.id === "jobs" && activeTab === "new-job");
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#1a6cf5]/15 text-white"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-[#1a6cf5]" />
                    )}
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[#5b9bff]" : ""}`}
                      strokeWidth={1.9}
                    />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar name={session.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{session.name}</p>
              <p className="truncate text-xs text-slate-400">{session.email}</p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9} />
            {logoutMutation.isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Main column ─────────────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:inline">Careers</span>
            <span className="hidden text-slate-300 sm:inline">/</span>
            <span className="truncate font-semibold text-slate-900">{currentLabel}</span>
          </nav>
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View careers page</span>
          </a>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
