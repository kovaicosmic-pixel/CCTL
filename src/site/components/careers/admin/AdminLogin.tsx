import { useState, type FormEvent } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { loginAdmin } from "@/site/lib/careersAuth";
import type { AdminSession } from "@/site/lib/careersAuth";
import { Alert, Button, Field, PasswordInput, inputCls } from "./ui";

interface Props {
  onLogin: (session: AdminSession) => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    setErrorMsg(null);

    try {
      const result = await loginAdmin({
        data: {
          email: String(fd.get("email") ?? ""),
          password: String(fd.get("password") ?? ""),
        },
      });
      onLogin(result.session);
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Invalid email or password.");
      setStatus("error");
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-50 font-sans lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-[#0b1424] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-[#1a6cf5]/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#6d4ef0]/20 blur-[120px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <a
          href="/careers"
          className="relative inline-flex w-fit items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to careers page
        </a>

        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a6cf5] to-[#6d4ef0] shadow-lg shadow-blue-900/40">
            <ShieldCheck className="h-6 w-6 text-white" />
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold leading-tight text-white">
            Careers Portal
            <br />
            <span className="bg-gradient-to-r from-[#5b9bff] to-[#a78bfa] bg-clip-text text-transparent">
              Admin Console
            </span>
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-slate-400">
            Manage job postings, review applications and shortlist candidates for Cosmic
            Compliance Test Lab.
          </p>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} Cosmic Compliance Test Lab · Authorised personnel only
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a6cf5] to-[#6d4ef0]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Use your admin account to access the careers console.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Email address" htmlFor="login-email">
              <input
                id="login-email"
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@cosmictest.com"
                className={inputCls}
              />
            </Field>

            <Field label="Password" htmlFor="login-password">
              <PasswordInput
                id="login-password"
                required
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </Field>

            {status === "error" && errorMsg && <Alert tone="error">{errorMsg}</Alert>}

            <Button type="submit" loading={status === "loading"} className="w-full">
              {status === "loading" ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Forgot your password? Ask a Super Admin to reset your account.
          </p>
        </div>
      </div>
    </div>
  );
}
