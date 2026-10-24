import { useState, type FormEvent, type ReactNode } from "react";
import { Info, Mail } from "lucide-react";
import { changePassword } from "@/site/lib/careersAuth";
import { CAREERS_HR_EMAIL } from "@/site/data/careers";
import type { AdminSession } from "@/site/lib/careersAuth";
import { Alert, Avatar, Badge, Button, Card, Field, PageHeader, PasswordInput } from "./ui";

interface Props {
  session: AdminSession;
}

const NOTIFICATION_RECIPIENTS = [{ label: "HR", value: CAREERS_HR_EMAIL }];

/** One settings row: title + description on the left, content card on the right. */
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      <Card>{children}</Card>
    </section>
  );
}

export default function SettingsPanel({ session }: Props) {
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [pwError, setPwError] = useState<string | null>(null);

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newPw = String(fd.get("newPassword") ?? "");
    const confirmPw = String(fd.get("confirmPassword") ?? "");

    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      setPwStatus("error");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      setPwStatus("error");
      return;
    }

    setPwStatus("saving");
    setPwError(null);

    try {
      await changePassword({
        data: {
          currentPassword: String(fd.get("currentPassword") ?? ""),
          newPassword: newPw,
        },
      });
      setPwStatus("success");
      form.reset();
      setTimeout(() => setPwStatus("idle"), 3000);
    } catch (err: any) {
      setPwError(err?.message ?? "Failed to change password.");
      setPwStatus("error");
    }
  }

  const isSuper = session.role === "superadmin";

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and notification preferences." />

      <div className="divide-y divide-slate-200">
        {/* Profile */}
        <SettingsSection title="Profile" description="Your admin account details.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={session.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">{session.name}</p>
              <p className="mt-0.5 break-all text-sm text-slate-500">{session.email}</p>
            </div>
            <Badge tone={isSuper ? "violet" : "blue"}>{isSuper ? "Super Admin" : "Admin"}</Badge>
          </div>
        </SettingsSection>

        {/* Password */}
        <SettingsSection
          title="Password"
          description="Use at least 8 characters. You'll stay signed in on this device."
        >
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <Field label="Current password" htmlFor="pw-current">
              <PasswordInput
                id="pw-current"
                required
                name="currentPassword"
                autoComplete="current-password"
                placeholder="Enter current password"
              />
            </Field>
            <Field label="New password" htmlFor="pw-new">
              <PasswordInput
                id="pw-new"
                required
                name="newPassword"
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
              />
            </Field>
            <Field label="Confirm new password" htmlFor="pw-confirm">
              <PasswordInput
                id="pw-confirm"
                required
                name="confirmPassword"
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat new password"
              />
            </Field>

            {pwStatus === "error" && pwError && <Alert tone="error">{pwError}</Alert>}
            {pwStatus === "success" && <Alert tone="success">Password changed successfully!</Alert>}

            <div className="flex justify-end">
              <Button type="submit" loading={pwStatus === "saving"} disabled={pwStatus === "success"}>
                {pwStatus === "saving" ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </SettingsSection>

        {/* Notifications (superadmin only) */}
        {isSuper && (
          <SettingsSection
            title="Notification emails"
            description="Every new application is emailed here, with the resume attached. Everyone else reviews applications in this portal."
          >
            <ul className="divide-y divide-slate-100">
              {NOTIFICATION_RECIPIENTS.map((r) => (
                <li key={r.label} className="flex items-center gap-3 py-3 first:pt-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{r.label}</p>
                    <p className="break-all text-sm text-slate-500">{r.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex gap-2 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Covers job applications and general CVs. Candidates' replies to their confirmation
                email also go to HR. The address is set in{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">
                  src/site/data/careers.ts
                </code>
                .
              </span>
            </p>
          </SettingsSection>
        )}
      </div>
    </div>
  );
}
