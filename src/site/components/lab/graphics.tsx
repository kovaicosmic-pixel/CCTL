/** Embedded technical graphics — ported from the reference build, shared between Hero and the
 *  Home page scenes (Why Choose Us, About blurb, closing CTA all reuse one or both). */

export function FrequencyRings({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 800 800"
      style={style}
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
    >
      {[120, 200, 280, 360, 440].map((r, i) => (
        <circle
          key={r}
          cx="400"
          cy="400"
          r={r}
          strokeWidth={i === 2 ? 1.4 : 0.6}
          strokeDasharray={i % 2 ? "2 10" : undefined}
          opacity={0.9 - i * 0.14}
        />
      ))}
      <line x1="0" y1="400" x2="800" y2="400" strokeWidth="0.5" opacity="0.35" />
      <line x1="400" y1="0" x2="400" y2="800" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

/** Wavy signal lines + a radar-ring cluster + antenna glyphs — the same
 *  background chrome family as FrequencyRings/SignalTrace, for sections that
 *  don't yet carry any of that texture. currentColor + low opacity, same as
 *  its siblings, so callers tint it via a text-color utility on the wrapper. */
export function SignalBackdrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
    >
      <path d="M -5 22 Q 15 10, 30 22 T 60 22 T 90 22 T 120 22" strokeWidth="0.15" opacity="0.8" />
      <path d="M -5 78 Q 20 88, 38 78 T 75 78 T 110 78" strokeWidth="0.15" opacity="0.8" />
      <circle cx="88" cy="60" r="6" strokeWidth="0.2" opacity="0.8" />
      <circle cx="88" cy="60" r="11" strokeWidth="0.15" opacity="0.6" />
      <circle cx="88" cy="60" r="16" strokeWidth="0.1" opacity="0.4" />
      <g strokeWidth="0.2">
        <line x1="10" y1="58" x2="10" y2="48" />
        <circle cx="10" cy="46" r="1.4" fill="currentColor" stroke="none" />
        <line x1="22" y1="86" x2="22" y2="76" />
        <circle cx="22" cy="74" r="1.4" fill="currentColor" stroke="none" />
      </g>
      {[
        [8, 20],
        [95, 15],
        [4, 90],
        [50, 8],
        [93, 92],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.5" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export function SignalTrace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 60 H180 l14 -34 l16 62 l14 -46 l18 34 l12 -18 H520 l10 -44 l14 74 l12 -52 l16 26 H900 l12 -22 l14 40 l12 -26 H1200" />
    </svg>
  );
}
