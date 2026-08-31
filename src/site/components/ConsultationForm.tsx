import { useState, type FormEvent } from "react";
import { services, company } from "../data/content";
import { submitContactForm } from "../lib/contactForm";

const inputClass =
  "w-full rounded-lg border border-line-strong/10 bg-line-strong/[0.04] px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-colors focus:border-cyan-glow/60 focus:bg-line-strong/[0.06]";

const selectClass = `${inputClass} [&>option]:text-[#0f172a] [&>option]:bg-white`;

export default function ConsultationForm({ signature = false }: { signature?: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const selectedService = services.find((s) => s.slug === formData.get("service"));

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
          locationId: String(formData.get("locationId") ?? ""),
          service: selectedService?.name ?? String(formData.get("service") ?? ""),
          message: String(formData.get("message") ?? ""),
          companyWebsite: String(formData.get("companyWebsite") ?? ""),
        },
      });
      setStatus("sent");
      form.reset();
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
        <input required name="firstName" placeholder="First name" className={inputClass} />
        <input required name="lastName" placeholder="Last name" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="companyName" placeholder="Company" className={inputClass} />
        <input required name="phone" type="tel" placeholder="Phone" className={inputClass} />
      </div>
      <input
        required
        name="email"
        type="email"
        placeholder="Company email"
        className={inputClass}
      />
      <select required name="locationId" defaultValue="" className={selectClass}>
        <option value="" disabled>
          Nearest lab
        </option>
        {company.locations.map((l) => (
          <option key={l.id} value={l.id} className="text-[#0f172a] bg-white">
            {l.label}
          </option>
        ))}
      </select>
      <select required name="service" defaultValue="" className={selectClass}>
        <option value="" disabled>
          Select a service
        </option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug} className="text-[#0f172a] bg-white">
            {s.name}
          </option>
        ))}
      </select>
      <textarea required name="message" placeholder="Message" rows={4} className={inputClass} />

      {status === "error" && errorMessage && (
        <p className="text-sm font-medium text-red-400">{errorMessage}</p>
      )}

      {signature ? (
        <div className="btn-signature mt-2 p-[2px]">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-space-800-solid px-6 py-3 text-sm font-bold text-ink-100 transition-colors hover:bg-space-700 disabled:cursor-not-allowed disabled:opacity-60"
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
