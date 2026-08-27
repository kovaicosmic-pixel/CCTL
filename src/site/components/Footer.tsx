import { Link } from "@tanstack/react-router";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { company } from "../data/content";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050a14] text-white/60">
      <div className="container-x py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.7fr_1.15fr_1.15fr] lg:gap-8">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
              Cosmic Compliance Test Lab
            </h3>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/55">
              Leading EMI/EMC testing and certification lab specializing in compliance testing for
              automotive, military, industrial, and medical sectors.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="https://www.linkedin.com/company/cosmicompliance/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 p-0 transition-colors hover:border-cyan-glow hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <img src="/images/linkedin.png" alt="LinkedIn" className="h-4 w-4 object-contain" />
              </a>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <img
                  src="/images/NABL.jpg"
                  alt="NABL accredited"
                  className="h-6 w-6 rounded object-contain bg-white"
                />
                <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/70">
                  NABL Accredited
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
              Quick links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[0.9375rem] text-white/55 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {[...company.locations].reverse().map((location) => (
            <div key={location.id} className="flex flex-col items-start">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
                {location.label}
              </h3>
              <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/55 footer-address">
                {location.address}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 footer-contacts">
                <a
                  href={`tel:${location.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-[0.9375rem] font-bold text-white transition-colors hover:text-cyan-glow"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {location.phone}
                </a>
                <a
                  href={`mailto:${location.email}`}
                  className="flex items-center gap-2 text-[0.9375rem] text-white/55 transition-colors hover:text-cyan-glow"
                >
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {location.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Cosmic Compliance Test Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-white/40 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 text-[0.7rem] font-mono uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-cyan-glow"
            >
              <span>Back to top</span>
              <ArrowUp
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
