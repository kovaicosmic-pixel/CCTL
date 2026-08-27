/**
 * Four corner brackets framing a container, like a viewfinder or an
 * oscilloscope screen bezel — the same device already used once on the
 * Services hero (see Services.tsx). Componentized here so Home's cards and
 * panels can carry the same signature instrument-panel framing instead of
 * a generic rounded card border. Purely decorative: absolutely positioned,
 * zero layout impact. Parent must be `relative` (or `.glass-card`, which
 * already is).
 */
export default function Reticle({
  inset = "0.9rem",
  size = "1.1rem",
}: {
  inset?: string;
  size?: string;
}) {
  const s = { width: size, height: size };
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute border-l border-t border-cyan-glow/50"
        style={{ ...s, top: inset, left: inset }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute border-r border-t border-cyan-glow/50"
        style={{ ...s, top: inset, right: inset }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute border-b border-l border-cyan-glow/50"
        style={{ ...s, bottom: inset, left: inset }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute border-b border-r border-cyan-glow/50"
        style={{ ...s, bottom: inset, right: inset }}
      />
    </>
  );
}
