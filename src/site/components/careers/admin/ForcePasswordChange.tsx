import { useState, type FormEvent } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { changePassword } from "@/site/lib/careersAuth";
import type { AdminSession } from "@/site/lib/careersAuth";
import { Alert, Button, Field, PasswordInput } from "./ui";

interface Props {
  session: AdminSession;
  onDone: (session: AdminSession) => void;
  onLogout: () => void;
}

/**
 * Shown instead of the admin panel to invited admins still on the temporary
 * password from their invitation email. The server blocks every other admin
 * action until this succeeds, so this is not just a UI gate.
 */
export default function ForcePasswordChange({ session, onDone, onLogout }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPw = String(fd.get("newPassword") ?? "");
    if (newPw !== String(fd.get("confirmPassword") ?? "")) {
      setError("New passwords do not match.");
      setStatus("error");
      return;
    }
    if (newPw.length < 8) {
      setError("New password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const res = await changePassword({
        data: { currentPassword: String(fd.get("currentPassword") ?? ""), newPassword: newPw },
      });
      onDone(res.session);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update password.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12 font-sans">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_50px_-24px_rgba(15,23,42,0.2)] sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#1a6cf5] ring-1 ring-blue-100">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {session.name.split(" ")[0]}!
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Before you start, replace the temporary password from your invitation email with one
            only you know.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <Field label="Temporary password" htmlFor="fp-current" hint="From your invitation email.">
              <PasswordInput
                id="fp-current"
                required
                name="currentPassword"
                autoComplete="current-password"
                placeholder="Temporary password"
              />
            </Field>
            <Field label="New password" htmlFor="fp-new" hint="At least 8 characters.">
              <PasswordInput
                id="fp-new"
                required
                name="newPassword"
                minLength={8}
                autoComplete="new-password"
                placeholder="Choose a new password"
              />
            </Field>
            <Field label="Confirm new password" htmlFor="fp-confirm">
              <PasswordInput
                id="fp-confirm"
                required
                name="confirmPassword"
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat new password"
              />
            </Field>

            {status === "error" && error && <Alert tone="error">{error}</Alert>}

            <Button type="submit" loading={status === "saving"} className="w-full">
              {status === "saving" ? "Saving…" : "Set password & continue"}
            </Button>
          </form>
        </div>

        <button
          onClick={onLogout}
          className="mx-auto mt-5 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
