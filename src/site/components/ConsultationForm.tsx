import { useState, type FormEvent, type ReactNode } from "react";
import { services, company } from "../data/content";
import { submitContactForm } from "../lib/contactForm";
import ThemedSelect from "./ThemedSelect";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition-all hover:border-white/25 focus:border-cyan-glow focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-glow/15";

const selectClass = `${inputClass} cursor-pointer`;

export default function ConsultationForm({ signature = false }: { signature?: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Themed dropdowns are controlled so they can be validated and reset with the form
  const [locationId, setLocationId] = useState("");
  const [service, setService] = useState("");
  const [selectError, setSelectError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (!locationId || !service) {
      setSelectError("Please choose your nearest lab and a service.");
      return;
    }
    setSelectError(null);
    const selectedService = services.find((s) => s.slug === service);

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitContactForm({
        data: {
          firstName: String(formData.get("firstName") ?? ""),
          lastName: String(formData.get("lastName") ?? ""),
          companyName: String(formData.get("companyName") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          locationId,
          service: selectedService?.name ?? service,
          message: String(formData.get("message") ?? ""),
          companyWebsite: String(formData.get("companyWebsite") ?? ""),
        },
      });
      setStatus("sent");
      form.reset();
      setLocationId("");
      setService("");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Something went wrong sending your enquiry. Please try again, or call us directly.",
      );
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="surface glow-border rounded-2xl p-8 text-center">
        <p className="font-heading text-xl font-bold text-ink-100">Thank you!</p>
        <p className="mt-2 text-sm text-ink-300">
          Your enquiry has been received. Our team will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-line-strong/10 px-5 py-2 text-sm font-medium text-ink-100 hover:border-cyan-glow/60"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface glow-border grid gap-4 rounded-2xl p-6 sm:p-8">
      {/* Honeypot — visually hidden, never filled by a real visitor. Bots that
          auto-fill every field trip this; the server accepts silently and drops it. */}
      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="cf-first">
          <input id="cf-first" required name="firstName" autoComplete="given-name" placeholder="e.g. Priya" className={inputClass} />
        </Field>
        <Field label="Last name" htmlFor="cf-last">
          <input id="cf-last" required name="lastName" autoComplete="family-name" placeholder="e.g. Raman" className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" htmlFor="cf-company">
          <input id="cf-company" required name="companyName" autoComplete="organization" placeholder="Company name" className={inputClass} />
        </Field>
        <Field label="Phone" htmlFor="cf-phone">
          <input id="cf-phone" required name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={inputClass} />
        </Field>
      </div>
      <Field label="Company email" htmlFor="cf-email">
        <input
          id="cf-email"
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nearest lab" htmlFor="cf-lab">
          <ThemedSelect
            id="cf-lab"
            tone="dark"
            placeholder="Choose a lab"
            value={locationId}
            onValueChange={(v) => {
              setLocationId(v);
              setSelectError(null);
            }}
            invalid={!!selectError && !locationId}
            options={company.locations.map((l) => ({ value: l.id, label: l.label }))}
            triggerClassName={`${selectClass} ${selectError && !locationId ? "border-red-400/60" : ""}`}
          />
        </Field>
        <Field label="Service" htmlFor="cf-service">
          <ThemedSelect
            id="cf-service"
            tone="dark"
            placeholder="Select a service"
            value={service}
            onValueChange={(v) => {
              setService(v);
              setSelectError(null);
            }}
            invalid={!!selectError && !service}
            options={services.map((s) => ({ value: s.slug, label: s.name }))}
            triggerClassName={`${selectClass} ${selectError && !service ? "border-red-400/60" : ""}`}
          />
        </Field>
      </div>
      {selectError && <p className="-mt-1 text-sm font-medium text-red-400">{selectError}</p>}
      <Field label="Message" htmlFor="cf-message">
        <textarea
          id="cf-message"
          required
          name="message"
          placeholder="Tell us about your product and the testing you need…"
          rows={4}
          className={inputClass}
        />
      </Field>

      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-400">{errorMessage}</p>
      )}

      {signature ? (
        <div className="btn-signature mt-2 p-[2px]">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-[#0b1830] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#13284f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send Enquiry"}
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_-8px_rgba(26,108,245,0.7)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>
      )}
    </form>
  );
}

/** Label + required star above a contact-form control (every field here is required). */
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
        <span className="ml-0.5 text-cyan-glow" aria-hidden>
          *
        </span>
      </label>
      {children}
    </div>
  );
}
