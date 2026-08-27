import { useState, type FormEvent } from "react";
import { services } from "../data/content";

const inputClass =
  "w-full rounded-lg border border-line-strong/10 bg-line-strong/[0.04] px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-colors focus:border-cyan-glow/60 focus:bg-line-strong/[0.06]";

export default function ConsultationForm({ signature = false }: { signature?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
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
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="First name" className={inputClass} />
        <input required placeholder="Last name" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Company" className={inputClass} />
        <input required type="tel" placeholder="Phone" className={inputClass} />
      </div>
      <input required type="email" placeholder="Company email" className={inputClass} />
      <select required defaultValue="" className={`${inputClass} [&>option]:text-[#0f172a] [&>option]:bg-white`}>
        <option value="" disabled>
          Select a service
        </option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug} className="text-[#0f172a] bg-white">
            {s.name}
          </option>
        ))}
      </select>
      <textarea required placeholder="Message" rows={4} className={inputClass} />

      {signature ? (
        <div className="btn-signature mt-2 p-[2px]">
          <button
            type="submit"
            className="w-full rounded-full bg-space-800-solid px-6 py-3 text-sm font-bold text-ink-100 transition-colors hover:bg-space-700"
          >
            Send Enquiry
          </button>
        </div>
      ) : (
        <button
          type="submit"
          className="mt-2 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_-8px_rgba(26,108,245,0.7)] transition-transform hover:scale-[1.02]"
        >
          Send Enquiry
        </button>
      )}
    </form>
  );
}
