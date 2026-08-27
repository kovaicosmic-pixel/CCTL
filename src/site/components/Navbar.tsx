import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Magnetic from "./motion/Magnetic";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [heroCompleted, setHeroCompleted] = useState(false);
  const [isHome, setIsHome] = useState(typeof window !== 'undefined' ? window.location.pathname === '/' : false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Listen for the hero-complete custom event from the Home hero scene.
    const onHeroEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail ?? {};
      // Prefer a numeric progress if provided; fallback to previous `completed` boolean if present.
      const progress = typeof detail.progress === "number" ? detail.progress : (detail.completed ? 1 : 0);
      if (window.location.pathname === "/") {
        // Make the header transparent while the hero scene is active (progress < 1).
        setHeroCompleted(progress < 0.999);
      }
    };
    window.addEventListener("home-hero-complete", onHeroEvent as EventListener);

    // Track location changes so the navbar can reset when navigating away.
    const dispatchLocationChange = () => window.dispatchEvent(new Event("locationchange"));
    const _push = history.pushState;
    const _replace = history.replaceState;
    // patch pushState/replaceState to emit locationchange
    history.pushState = function (...args) {
      const ret = _push.apply(this, args as any);
      dispatchLocationChange();
      return ret;
    } as any;
    history.replaceState = function (...args) {
      const ret = _replace.apply(this, args as any);
      dispatchLocationChange();
      return ret;
    } as any;

    const onLocationChange = () => {
      setIsHome(window.location.pathname === "/");
      setHeroCompleted(false);
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("popstate", dispatchLocationChange);
    window.addEventListener("locationchange", onLocationChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("home-hero-complete", onHeroEvent as EventListener);
      window.removeEventListener("popstate", dispatchLocationChange);
      window.removeEventListener("locationchange", onLocationChange);
      // restore history fns
      history.pushState = _push;
      history.replaceState = _replace;
    };
  }, []);

  const headerClassName = heroCompleted && isHome
    ? "fixed inset-x-0 top-0 z-50 transition-shadow duration-300 bg-transparent border-none backdrop-blur-none"
    : "fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md transition-shadow duration-300";

  const headerBoxShadow = heroCompleted && isHome ? "none" : scrolled ? "0 1px 3px rgba(0,0,0,0.06)" : "none";

  return (
    <header
      className={headerClassName}
      style={{
        boxShadow: headerBoxShadow,
      }}
    >
      {/* Lit hairline that only resolves once scrolled. */}
      <div
        aria-hidden
        className="rule-lit pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-500"
        style={{ opacity: heroCompleted && isHome ? 0 : scrolled ? 0.9 : 0 }}
      />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-2 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl py-1 pr-3 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo.png"
            alt="Cosmic Compliance Test Lab"
            className="nav-logo h-12 w-auto object-contain sm:h-14 lg:h-[3.6rem]"
          />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onMouseEnter={() => setHovered(l.to)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-full px-3.5 py-2 text-[0.8125rem] font-semibold tracking-[0.01em] transition-colors lg:px-4"
              activeProps={{ className: "text-cyan-glow" }}
              inactiveProps={{ className: "text-gray-600 hover:text-gray-900" }}
            >
              {hovered === l.to && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gray-100"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {l.label}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-[2px] scale-x-0 rounded-full bg-cyan-glow opacity-0 transition-all duration-300 group-data-[status=active]:scale-x-100 group-data-[status=active]:opacity-100"
              />
            </Link>
          ))}
          <div className="ml-4">
            <Link to="/contact" className="btn-base btn-primary btn-sm">
              Get In Touch
            </Link>
          </div>
        </div>

        <button
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-200 bg-white/95 px-5 pb-5 backdrop-blur md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium"
                activeProps={{ className: "bg-blue-50 text-cyan-glow" }}
                inactiveProps={{ className: "text-gray-600" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
