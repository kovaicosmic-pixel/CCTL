import { useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import ThemedSelect from "@/site/components/ThemedSelect";
import { submitApplication } from "@/site/lib/careerForm";
import { listActiveJobs } from "@/site/lib/careersAdmin";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_TYPES,
  COVER_LETTER_MAX,
  EASE,
  EXPERIENCE_OPTIONS,
  MAX_FILE_SIZE,
  formatSize,
  friendlyError,
} from "./ApplyModal";

/** Common roles at an EMC lab — merged with whatever is currently posted. */
const PRESET_ROLES = [
  "EMI/EMC Test Engineer",
  "Senior EMC Test Engineer",
  "EMC Design & Troubleshooting Engineer",
  "RF / Wireless Test Engineer",
  "Lab Technician",
  "Quality & Calibration Engineer",
  "Sales & Business Development",
  "Graduate Trainee / Intern",
];
const OTHER_ROLE = "__other__";

const LOCATION_CHOICES = [
  { value: "coimbatore", title: "Coimbatore", sub: "Kalapatti, Tamil Nadu" },
  { value: "bangalore", title: "Bangalore", sub: "Bommasandra, Karnataka" },
  { value: "either", title: "Either location", sub: "Open to both labs" },
] as const;

type PreferredLocation = (typeof LOCATION_CHOICES)[number]["value"];

type ErrorKey =
  | "fullName"
  | "email"
  | "phone"
  | "role"
  | "preferredLocation"
  | "yearsExperience"
  | "currentLocation"
  | "resume";

// ─── Light-theme building blocks ─────────────────────────────────────────────

const baseInput =
  "w-full rounded-xl border bg-white text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4";
const okBorder = "border-slate-300 hover:border-slate-400 focus:border-cyan-glow focus:ring-cyan-glow/10";
const badBorder = "border-red-300 focus:border-red-400 focus:ring-red-500/10";

function inputCls(invalid: boolean, withIcon = true) {
  return `${baseInput} ${invalid ? badBorder : okBorder} ${withIcon ? "py-3 pl-11 pr-4" : "px-4 py-3"}`;
}

function choiceCls(selected: boolean, invalid: boolean) {
  if (selected)
    return "border-cyan-glow bg-blue-50 text-slate-900 ring-1 ring-cyan-glow shadow-[0_6px_20px_-10px_rgba(26,108,245,0.6)]";
  if (invalid) return "border-red-300 bg-white text-slate-600 hover:border-red-400";
  return "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";
}

function FormSection({
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
      <div className="mb-5 flex items-center gap-3">
        <span className="font-mono flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[0.68rem] font-bold text-cyan-glow ring-1 ring-blue-100">
          {step}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">{title}</h3>
        {optional && <span className="text-xs text-slate-400">Optional</span>}
        <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
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
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-cyan-glow">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

function WithIcon({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-slate-400 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      {children}
    </div>
  );
}

// ─── Form ────────────────────────────────────────────────────────────────────

export default function GeneralApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [role, setRole] = useState("");
  const [otherRole, setOtherRole] = useState("");
  const [preferredLocation, setPreferredLocation] = useState<PreferredLocation | "">("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [coverLength, setCoverLength] = useState(0);
  const [submittedName, setSubmittedName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Roles currently posted come first, then the preset list (deduplicated)
  const { data } = useQuery({
    queryKey: ["active-jobs"],
    queryFn: () => listActiveJobs(),
    staleTime: 60_000,
  });
  const roles = [...new Set([...(data?.jobs ?? []).map((j) => j.title), ...PRESET_ROLES])];

  const submitting = status === "submitting";
  const desiredRole = role === OTHER_ROLE ? otherRole.trim() : role;

  function clearError(k: ErrorKey) {
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  }

  function handleFile(f: File | null) {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    let err: string | null = null;
    if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      err = "Only PDF, DOC or DOCX files are accepted.";
    } else if (f.size > MAX_FILE_SIZE) {
      err = `File is ${formatSize(f.size)} — the maximum is 5 MB.`;
    }
    if (err) {
      setErrors((p) => ({ ...p, resume: err! }));
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

  function fileToBase64(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();

    const found: Partial<Record<ErrorKey, string>> = {};
    if (!get("fullName")) found.fullName = "Please enter your full name.";
    const email = get("email");
    if (!email) found.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = "That email doesn't look right.";
    const phone = get("phone");
    if (!phone) found.phone = "Please enter your phone number.";
    else if (phone.replace(/\D/g, "").length < 8) found.phone = "Please enter a valid phone number.";
    if (!desiredRole)
      found.role =
        role === OTHER_ROLE ? "Please describe the role you're interested in." : "Please choose a role.";
    if (!preferredLocation) found.preferredLocation = "Please choose where you'd like to work.";
    if (!experience) found.yearsExperience = "Please select your experience.";
    if (!get("currentLocation")) found.currentLocation = "Please enter your current city.";
    if (!file) found.resume = "Please upload your resume.";

    setErrors(found);
    if (Object.keys(found).length > 0) {
      form
        .querySelector<HTMLElement>("[aria-invalid='true'], [data-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);
    try {
      const fullName = get("fullName");
      await submitApplication({
        data: {
          desiredRole,
          preferredLocation: preferredLocation as PreferredLocation,
          fullName,
          email,
          phone,
          yearsExperience: experience as any,
          currentLocation: get("currentLocation"),
          coverLetter: String(fd.get("coverLetter") ?? ""),
          resumeFilename: file!.name,
          resumeData: await fileToBase64(file!),
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

  if (status === "success") {
    return (
      <div className="flex flex-col items-center px-2 py-12 text-center">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.75} />
        </motion.span>
        <h3 className="font-display mt-6 text-2xl font-bold text-slate-900">
          Thank you{submittedName ? `, ${submittedName}` : ""}!
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          We've received your CV for a{" "}
          <span className="font-semibold text-slate-900">{desiredRole}</span> role. A confirmation
          is on its way to your inbox, and our team will be in touch if your profile matches an
          opening.
        </p>
        <a
          href="/careers"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          Back to careers
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-9">
      {/* Honeypot */}
      <input
        type="text"
        name="websiteField"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <FormSection step="01" title="About you">
        <Field label="Full name" required error={errors.fullName} htmlFor="ga-name">
          <WithIcon icon={<User />}>
            <input
              id="ga-name"
              name="fullName"
              autoComplete="name"
              placeholder="e.g. Priya Raman"
              aria-invalid={!!errors.fullName}
              onChange={() => clearError("fullName")}
              className={inputCls(!!errors.fullName)}
            />
          </WithIcon>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email address" required error={errors.email} htmlFor="ga-email">
            <WithIcon icon={<Mail />}>
              <input
                id="ga-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                onChange={() => clearError("email")}
                className={inputCls(!!errors.email)}
              />
            </WithIcon>
          </Field>
          <Field label="Phone number" required error={errors.phone} htmlFor="ga-phone">
            <WithIcon icon={<Phone />}>
              <input
                id="ga-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
                onChange={() => clearError("phone")}
                className={inputCls(!!errors.phone)}
              />
            </WithIcon>
          </Field>
        </div>
      </FormSection>

      <FormSection step="02" title="Role & location">
        <Field label="Role that suits you" required error={errors.role} htmlFor="ga-role">
          <WithIcon icon={<Briefcase />}>
            <ThemedSelect
              id="ga-role"
              tone="light"
              placeholder="Select a role"
              value={role}
              invalid={!!errors.role}
              onValueChange={(v) => {
                setRole(v);
                clearError("role");
              }}
              options={[
                ...roles.map((r) => ({ value: r, label: r })),
                { value: OTHER_ROLE, label: "Other (tell us)" },
              ]}
              triggerClassName={`${inputCls(!!errors.role)} cursor-pointer`}
            />
          </WithIcon>
          {role === OTHER_ROLE && (
            <input
              autoFocus
              value={otherRole}
              onChange={(e) => {
                setOtherRole(e.target.value);
                clearError("role");
              }}
              placeholder="e.g. EMC Simulation Engineer"
              maxLength={120}
              aria-invalid={!!errors.role}
              className={`mt-2.5 ${inputCls(!!errors.role, false)}`}
            />
          )}
        </Field>

        <Field label="Preferred work location" required error={errors.preferredLocation}>
          <div
            role="radiogroup"
            aria-label="Preferred work location"
            data-invalid={!!errors.preferredLocation}
            className="grid gap-2.5 sm:grid-cols-3"
          >
            {LOCATION_CHOICES.map((loc) => {
              const on = preferredLocation === loc.value;
              return (
                <label
                  key={loc.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border px-4 py-3.5 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-glow/40 ${choiceCls(on, !!errors.preferredLocation)}`}
                >
                  <input
                    type="radio"
                    name="preferredLocation"
                    value={loc.value}
                    checked={on}
                    onChange={() => {
                      setPreferredLocation(loc.value);
                      clearError("preferredLocation");
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                      <MapPin className={`h-3.5 w-3.5 ${on ? "text-cyan-glow" : "text-slate-400"}`} />
                      {loc.title}
                    </span>
                    {on && <CheckCircle2 className="h-4 w-4 text-cyan-glow" />}
                  </span>
                  <span className="mt-1 pl-5 text-xs text-slate-500">{loc.sub}</span>
                </label>
              );
            })}
          </div>
        </Field>

        <Field label="Years of experience" required error={errors.yearsExperience}>
          <div
            role="radiogroup"
            aria-label="Years of experience"
            data-invalid={!!errors.yearsExperience}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {EXPERIENCE_OPTIONS.map((o) => {
              const on = experience === o;
              return (
                <label
                  key={o}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-glow/40 ${choiceCls(on, !!errors.yearsExperience)}`}
                >
                  <input
                    type="radio"
                    name="yearsExperience"
                    value={o}
                    checked={on}
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

        <Field label="Current city" required error={errors.currentLocation} htmlFor="ga-city">
          <WithIcon icon={<MapPin />}>
            <input
              id="ga-city"
              name="currentLocation"
              autoComplete="address-level2"
              placeholder="City, State"
              aria-invalid={!!errors.currentLocation}
              onChange={() => clearError("currentLocation")}
              className={inputCls(!!errors.currentLocation)}
            />
          </WithIcon>
        </Field>
      </FormSection>

      <FormSection step="03" title="Resume / CV">
        <Field label="Upload your resume" required error={errors.resume}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {!file ? (
            <button
              type="button"
              onDragOver={(e: DragEvent) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e: DragEvent) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0] ?? null);
              }}
              onClick={() => fileInputRef.current?.click()}
              data-invalid={!!errors.resume}
              className={`group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-9 text-center transition-all ${
                dragging
                  ? "scale-[1.01] border-cyan-glow bg-blue-50"
                  : errors.resume
                    ? "border-red-300 bg-red-50/40 hover:border-red-400"
                    : "border-slate-300 bg-slate-50 hover:border-cyan-glow hover:bg-blue-50/50"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:text-cyan-glow">
                <UploadCloud className="h-5 w-5" />
              </span>
              <span className="text-sm text-slate-700">
                {dragging ? (
                  "Drop your file here"
                ) : (
                  <>
                    <span className="font-semibold text-cyan-glow">Click to upload</span> or drag
                    and drop
                  </>
                )}
              </span>
              <span className="text-xs text-slate-500">PDF, DOC or DOCX · up to 5 MB</span>
            </button>
          ) : (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {formatSize(file.size)} · Ready to submit
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 sm:block"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={removeFile}
                aria-label="Remove file"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </Field>
      </FormSection>

      <FormSection step="04" title="Cover note" optional>
        <div>
          <textarea
            name="coverLetter"
            rows={5}
            maxLength={COVER_LETTER_MAX}
            onChange={(e) => setCoverLength(e.target.value.length)}
            placeholder="Tell us about your experience and how you'd like to contribute…"
            className={`${inputCls(false, false)} resize-y leading-relaxed`}
          />
          <p className="mt-1.5 text-right text-xs tabular-nums text-slate-400">
            {coverLength.toLocaleString()} / {COVER_LETTER_MAX.toLocaleString()}
          </p>
        </div>
      </FormSection>

      {status === "error" && errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE }}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div className="text-sm">
            <p className="font-semibold text-red-700">We couldn't send your CV</p>
            <p className="mt-0.5 text-red-600">{errorMsg}</p>
          </div>
        </motion.div>
      )}

      <div className="space-y-3 border-t border-slate-200 pt-7">
        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.7)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : status === "error" ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Try again
            </>
          ) : (
            <>
              Send my CV
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Your details are shared only with our hiring team.
        </p>
      </div>
    </form>
  );
}
