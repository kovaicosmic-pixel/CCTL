/** A solid headline line paired with a hollow-outline continuation directly beneath it — the
 *  recurring device from the reference this page follows (e.g. "WHERE COSMIC MEETS QUALITY,"
 *  solid / "PIONEERING EMC TESTING" outline). Home only. */
export default function SplitHeading({
  solid,
  outline,
  eyebrow,
  className = "",
  size = "lg",
}: {
  solid: string;
  outline: string;
  eyebrow?: string;
  className?: string;
  size?: "lg" | "xl";
}) {
  const sizeClass =
    size === "xl" ? "text-[clamp(2.6rem,7vw,5.5rem)]" : "text-[clamp(2.2rem,5.5vw,4rem)]";
  const lineClass = `${sizeClass} font-black uppercase leading-[0.92] tracking-tight`;

  return (
    <div className={className}>
      {eyebrow && (
        <span className="font-mono mb-4 block text-xs font-bold uppercase tracking-[0.25em] text-cyan-glow">
          {eyebrow}
        </span>
      )}
      <h2 className={`${lineClass} text-ink-100`}>{solid}</h2>
      <h2 className={`text-outline-heading ${lineClass}`}>{outline}</h2>
    </div>
  );
}
