import { useState, useRef, useEffect, type FormEvent, type DragEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { submitApplication } from "@/site/lib/careerForm";

interface Props {
  jobId: string;
  jobTitle: string;
  employmentType: string;
  department?: string;
  experienceBand?: string;
  locations?: string[];
  onClose: () => void;
}

type FieldName = "fullName" | "email" | "phone" | "yearsExperience" | "currentLocation";
type FieldErrors = Partial<Record<FieldName | "resume", string>>;

export const EXPERIENCE_OPTIONS = ["<1 year", "1–3 years", "3–5 years", "5+ years"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const COVER_LETTER_MAX = 3000;
export const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
// Some browsers (notably on Windows) report an empty MIME type for .doc/.docx
export const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export const EASE = [0.16, 1, 0.3, 1] as const;

export function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Server validation errors arrive as raw Zod JSON — turn them into something readable. */
export function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : "";
  if (!msg) return "Something went wrong. Please try again.";
  if (msg.trim().startsWith("[") || msg.includes("invalid_")) {
    return "Some details look incorrect. Please check the form and try again.";
  }
  return msg;
}

export default function ApplyModal({
  jobId,
  jobTitle,
  employmentType,
  department,
  experienceBand,
  locations = [],
  onClose,
}: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [experience, setExperience] = useState("");
  const [coverLength, setCoverLength] = useState(0);
  const [submittedName, setSubmittedName] = useState("");
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const submitting = status === "submitting";

  // Portal target only exists on the client; also lock page scroll + Esc to close
  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 150);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  function clearError(name: keyof FieldErrors) {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validateFile(f: File): string | null {
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return "Only PDF, DOC or DOCX files are accepted.";
    }
    if (f.size > MAX_FILE_SIZE) return `File is ${formatSize(f.size)} — the maximum is 5 MB.`;
    return null;
  }

  function handleFileChange(f: File | null) {
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setErrors((prev) => ({ ...prev, resume: err }));
      setFile(null);
      return;
    }
    clearError("resume");
    setFile(f);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave() {
    setDragging(false);
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files[0] ?? null);
  }

  async function fileToBase64(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  function validate(fd: FormData): FieldErrors {
    const e: FieldErrors = {};
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    if (!get("fullName")) e.fullName = "Please enter your full name.";
    const email = get("email");
    if (!email) e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email doesn't look right.";
    const phone = get("phone");
    if (!phone) e.phone = "Please enter your phone number.";
    else if (phone.replace(/\D/g, "").length < 8) e.phone = "Please enter a valid phone number.";
    if (!experience) e.yearsExperience = "Please select your experience.";
    if (!get("currentLocation")) e.currentLocation = "Please enter your current city.";
    if (!file) e.resume = "Please upload your resume.";
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const found = validate(fd);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Bring the first problem into view
      const first = form.querySelector<HTMLElement>("[aria-invalid='true'], [data-invalid='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const resumeData = await fileToBase64(file!);
      const fullName = String(fd.get("fullName") ?? "").trim();

      await submitApplication({
        data: {
          jobId,
          fullName,
          email: String(fd.get("email") ?? "").trim(),
          phone: String(fd.get("phone") ?? "").trim(),
          yearsExperience: experience as (typeof EXPERIENCE_OPTIONS)[number] as any,
          currentLocation: String(fd.get("currentLocation") ?? "").trim(),
          coverLetter: String(fd.get("coverLetter") ?? ""),
          resumeFilename: file!.name,
          resumeData,
          websiteField: String(fd.get("websiteField") ?? ""),
        },
      });

      setSubmittedName(fullName.split(" ")[0] ?? "");
      setStatus("success");
    } catch (err) {
      setErrorMsg(friendlyError(err));
      setStatus("error");
    }
  }

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#030712]/80 backdrop-blur-md sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.08] bg-[#0b1424] shadow-[0_40px_120px_-30px_rgba(26,108,245,0.45),0_0_0_1px_rgba(255,255,255,0.02)] sm:rounded-3xl"
      >
        {/* Accent glow + top hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/70 to-transparent" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-glow/[0.12] blur-3xl" />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 pb-5 pt-6 sm:px-8 sm:pt-7">
          <div className="min-w-0">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-cyan-glow">
              {status === "success" ? "Application submitted" : "You're applying for"}
            </p>
            <h2
              id="apply-modal-title"
              className="font-display mt-1.5 text-xl font-bold leading-tight text-ink-100 sm:text-2xl"
            >
              {jobTitle}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {department && <MetaChip icon={<Briefcase className="h-3 w-3" />}>{department}</MetaChip>}
              <MetaChip icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}>
                {employmentType}
              </MetaChip>
              {experienceBand && <MetaChip icon={<Clock className="h-3 w-3" />}>{experienceBand}</MetaChip>}
              {locations.length > 0 && (
                <MetaChip icon={<MapPin className="h-3 w-3" />}>{locations.join(" · ")}</MetaChip>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ink-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-ink-100 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {status === "success" ? (
          <SuccessView name={submittedName} jobTitle={jobTitle} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="relative flex min-h-0 flex-1 flex-col">
            {/* Honeypot — hidden from humans, bots fill it */}
            <input
              type="text"
              name="websiteField"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
              {/* ── Personal details ───────────────────────── */}
              <FormSection step="01" title="Personal details">
                <Field label="Full name" required error={errors.fullName} htmlFor="apply-fullName">
                  <IconInput icon={<User />} invalid={!!errors.fullName}>
                    <input
                      ref={firstFieldRef}
                      id="apply-fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="e.g. Priya Raman"
                      aria-invalid={!!errors.fullName}
                      onChange={() => clearError("fullName")}
                      className={inputCls}
                    />
                  </IconInput>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email address" required error={errors.email} htmlFor="apply-email">
                    <IconInput icon={<Mail />} invalid={!!errors.email}>
                      <input
                        id="apply-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                        onChange={() => clearError("email")}
                        className={inputCls}
                      />
                    </IconInput>
                  </Field>
                  <Field label="Phone number" required error={errors.phone} htmlFor="apply-phone">
                    <IconInput icon={<Phone />} invalid={!!errors.phone}>
                      <input
                        id="apply-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        aria-invalid={!!errors.phone}
                        onChange={() => clearError("phone")}
                        className={inputCls}
                      />
                    </IconInput>
                  </Field>
                </div>
              </FormSection>

              {/* ── Experience ─────────────────────────────── */}
              <FormSection step="02" title="Experience">
                <Field label="Years of experience" required error={errors.yearsExperience}>
                  <div
                    role="radiogroup"
                    aria-label="Years of experience"
                    data-invalid={!!errors.yearsExperience}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {EXPERIENCE_OPTIONS.map((o) => {
                      const selected = experience === o;
                      return (
                        <label
                          key={o}
                          className={`relative flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                            selected
                              ? "border-cyan-glow/70 bg-cyan-glow/[0.12] text-ink-100 shadow-[0_0_24px_-8px_rgba(26,108,245,0.7)]"
                              : errors.yearsExperience
                                ? "border-red-400/40 bg-white/[0.02] text-ink-300 hover:border-red-400/60"
                                : "border-white/10 bg-white/[0.02] text-ink-300 hover:border-white/25 hover:text-ink-100"
                          } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-glow/50`}
                        >
                          <input
                            type="radio"
                            name="yearsExperience"
                            value={o}
                            checked={selected}
                            onChange={() => {
                              setExperience(o);
                              clearError("yearsExperience");
                            }}
                            className="sr-only"
                          />
                          {o}
                        </label>
                      );
                    })}
                  </div>
                </Field>

                <Field
                  label="Current location"
                  required
                  error={errors.currentLocation}
                  htmlFor="apply-location"
                >
                  <IconInput icon={<MapPin />} invalid={!!errors.currentLocation}>
                    <input
                      id="apply-location"
                      name="currentLocation"
                      autoComplete="address-level2"
                      placeholder="City, State"
                      aria-invalid={!!errors.currentLocation}
                      onChange={() => clearError("currentLocation")}
                      className={inputCls}
                    />
                  </IconInput>
                </Field>
              </FormSection>

              {/* ── Resume ─────────────────────────────────── */}
              <FormSection step="03" title="Resume / CV">
                <Field required label="Upload your resume" error={errors.resume}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                  {!file ? (
                    <button
                      type="button"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                      data-invalid={!!errors.resume}
                      className={`group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-all ${
                        dragging
                          ? "scale-[1.01] border-cyan-glow bg-cyan-glow/[0.08]"
                          : errors.resume
                            ? "border-red-400/40 bg-red-500/[0.03] hover:border-red-400/60"
                            : "border-white/[0.12] bg-white/[0.015] hover:border-cyan-glow/50 hover:bg-cyan-glow/[0.04]"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors ${
                          dragging
                            ? "border-cyan-glow/60 bg-cyan-glow/20 text-cyan-glow"
                            : "border-white/10 bg-white/[0.04] text-ink-300 group-hover:border-cyan-glow/40 group-hover:text-cyan-glow"
                        }`}
                      >
                        <UploadCloud className="h-5 w-5" />
                      </span>
                      <span className="text-sm text-ink-100">
                        {dragging ? (
                          "Drop your file here"
                        ) : (
                          <>
                            <span className="font-semibold text-cyan-glow">Click to upload</span> or drag
                            and drop
                          </>
                        )}
                      </span>
                      <span className="text-xs text-ink-500">PDF, DOC or DOCX · up to 5 MB</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] px-4 py-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-100">{file.name}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          {formatSize(file.size)} · Ready to submit
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-300 transition-colors hover:bg-white/[0.06] hover:text-ink-100 sm:block"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        aria-label="Remove file"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </Field>
              </FormSection>

              {/* ── Cover letter ───────────────────────────── */}
              <FormSection step="04" title="Cover letter" optional>
                <div>
                  <textarea
                    name="coverLetter"
                    rows={5}
                    maxLength={COVER_LETTER_MAX}
                    onChange={(e) => setCoverLength(e.target.value.length)}
                    placeholder="Briefly tell us about your EMC/EMI experience and why this role interests you…"
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-ink-100 outline-none transition-all placeholder:text-ink-500 hover:border-white/20 focus:border-cyan-glow/70 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-glow/10"
                  />
                  <p className="mt-1.5 text-right text-xs tabular-nums text-ink-500">
                    {coverLength.toLocaleString()} / {COVER_LETTER_MAX.toLocaleString()}
                  </p>
                </div>
              </FormSection>

              {/* Server error */}
              {status === "error" && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/[0.07] px-4 py-3.5"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <div className="text-sm">
                    <p className="font-semibold text-red-300">We couldn't submit your application</p>
                    <p className="mt-0.5 text-red-200/80">{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Footer ───────────────────────────────────── */}
            <footer className="flex flex-col-reverse items-stretch gap-3 border-t border-white/[0.06] bg-[#0a1220]/80 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="flex items-center justify-center gap-1.5 text-xs text-ink-500 sm:justify-start">
                <Lock className="h-3.5 w-3.5" />
                Your details are shared only with our hiring team.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-ink-300 transition-colors hover:border-white/25 hover:text-ink-100 disabled:opacity-40 sm:flex-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex flex-[2] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgba(26,108,245,0.7)] transition-all hover:shadow-[0_10px_40px_-6px_rgba(26,108,245,0.9)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : status === "error" ? (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Try again
                    </>
                  ) : (
                    <>
                      Submit application
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </footer>
          </form>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

// ─── Building blocks ─────────────────────────────────────────────────────────

export const inputCls =
  "w-full bg-transparent py-3 pr-4 pl-11 text-sm text-ink-100 outline-none placeholder:text-ink-500";

function MetaChip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-ink-300">
      <span className="flex items-center text-ink-500">{icon}</span>
      {children}
    </span>
  );
}

export function FormSection({
  step,
  title,
  optional,
  children,
}: {
  step: string;
  title: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[0.68rem] font-semibold text-cyan-glow">{step}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-100">{title}</h3>
        {optional && <span className="text-xs text-ink-500">Optional</span>}
        <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[0.8rem] font-medium text-ink-300">
        {label}
        {required && <span className="ml-0.5 text-cyan-glow">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function IconInput({
  icon,
  invalid,
  children,
}: {
  icon: ReactNode;
  invalid?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative rounded-xl border bg-white/[0.03] transition-all hover:border-white/20 focus-within:bg-white/[0.05] focus-within:ring-4 ${
        invalid
          ? "border-red-400/50 focus-within:border-red-400/70 focus-within:ring-red-500/10"
          : "border-white/10 focus-within:border-cyan-glow/70 focus-within:ring-cyan-glow/10"
      }`}
    >
      <span className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 text-ink-500 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      {children}
    </div>
  );
}

function SuccessView({
  name,
  jobTitle,
  onClose,
}: {
  name: string;
  jobTitle: string;
  onClose: () => void;
}) {
  const steps = [
    { title: "Confirmation email", body: "Check your inbox for a copy of your application." },
    { title: "Profile review", body: "Our engineering team reviews every application personally." },
    { title: "We'll reach out", body: "Shortlisted candidates are contacted for a technical discussion." },
  ];
  return (
    <div className="flex flex-col items-center overflow-y-auto px-6 py-10 text-center sm:px-10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex h-20 w-20 items-center justify-center"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 [animation-iteration-count:2]" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.75} />
        </span>
      </motion.div>

      <h3 className="font-display mt-6 text-2xl font-bold text-ink-100">
        Thank you{name ? `, ${name}` : ""}!
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-300">
        Your application for <span className="font-semibold text-ink-100">{jobTitle}</span> has
        been received.
      </p>

      <ol className="mt-8 w-full max-w-md space-y-3 text-left">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.4, ease: EASE }}
            className="flex gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5"
          >
            <span className="font-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-glow/30 bg-cyan-glow/10 text-xs font-semibold text-cyan-glow">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-100">{s.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-300">{s.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <button
        onClick={onClose}
        className="mt-8 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-10 py-3 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgba(26,108,245,0.7)] transition-all hover:brightness-110"
      >
        Done
      </button>
    </div>
  );
}
