import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

export type OrbitNode = { src: string; alt: string };

export default function FrequencyRings({
  size = 260,
  nodes = [],
  children,
  className = "",
  depth = false,
}: {
  size?: number;
  nodes?: OrbitNode[];
  children?: ReactNode;
  className?: string;
  /** Gives each ring its own translateZ so the rings read as a real depth stack, not a flat SVG-like graphic. Requires a preserve-3d/perspective ancestor. */
  depth?: boolean;
}) {
  const reduced = useReducedMotion();
  const ringDefs = [
    {
      inset: size * 0.31,
      color: "rgba(26, 108, 245, 0.5)",
      dur: "16s",
      dir: "normal" as const,
      z: 46,
    },
    {
      inset: size * 0.15,
      color: "rgba(109, 78, 240, 0.4)",
      dur: "26s",
      dir: "reverse" as const,
      z: 0,
    },
    { inset: 0, color: "rgba(26, 108, 245, 0.18)", dur: "40s", dir: "normal" as const, z: -46 },
  ];

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, transformStyle: depth ? "preserve-3d" : undefined }}
      aria-hidden="true"
    >
      {ringDefs.map((r, i) => (
        // The rotation keyframe sets `transform` directly, which would clobber an inline
        // translateZ on the same element — so depth gets its own static wrapper, and the
        // spin + node badge live on an inner div where the animation can own `transform`.
        <div
          key={i}
          className="absolute"
          style={{
            inset: r.inset,
            transform: depth ? `translateZ(${r.z}px)` : undefined,
            transformStyle: depth ? "preserve-3d" : undefined,
          }}
        >
          <div
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: r.color,
              animation: reduced ? undefined : `freq-spin ${r.dur} linear infinite ${r.dir}`,
            }}
          >
            {nodes[i] && (
              <span
                className="absolute rounded-full bg-ink-100 p-1.5 shadow-[0_0_14px_rgba(26,108,245,0.5)]"
                style={{ top: -14, left: "50%", marginLeft: -14 }}
              >
                <img src={nodes[i].src} alt={nodes[i].alt} className="h-5 w-5 object-contain" />
              </span>
            )}
          </div>
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center rounded-full text-center"
          style={{
            width: size * 0.34,
            height: size * 0.34,
            background: "radial-gradient(circle, rgba(26,108,245,0.14), transparent 72%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
