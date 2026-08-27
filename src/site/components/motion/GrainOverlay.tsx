import { useId } from "react";

export default function GrainOverlay({
  opacity = 0.05,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  const filterId = `grain-${useId()}`;
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity={opacity} />
    </svg>
  );
}
