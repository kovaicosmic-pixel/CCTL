import { useEffect, useRef, useState } from "react";
import { company } from "../data/content";

/**
 * Lockup mark. The bitmap logo is optional — until it exists in the asset
 * library we draw an engraved monogram plate so the header never shows a
 * broken-image stub next to the wordmark.
 */
export default function Wordmark({ className = "h-9 w-9" }: { className?: string }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);

  // The error event can fire before hydration, so re-check the decoded state on mount.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) {
    return (
      <span
        aria-label={company.name}
        role="img"
        className={`${className} grid shrink-0 place-items-center rounded-lg border border-cyan-glow/40 bg-space-900`}
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.16), 0 0 24px -10px rgba(26,108,245,.9)",
        }}
      >
        <span className="font-heading text-[0.6rem] font-black tracking-tight text-cyan-glow">
          CC
        </span>
      </span>
    );
  }

  return (
    <img
      ref={ref}
      src="/images/logo.png"
      alt={company.name}
      onError={() => setOk(false)}
      className={`${className} shrink-0 object-contain`}
      style={{ background: "none" }}
    />
  );
}
