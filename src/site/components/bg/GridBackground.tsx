/**
 * Animated grid background with glowing intersection nodes.
 *
 * A technical-looking grid that feels like a circuit board or measurement
 * instrument display. Key intersections pulse with a soft cyan glow,
 * creating a "living" background that reinforces the high-tech lab identity.
 *
 * Pure CSS — no JS runtime. Uses CSS grid + pseudo-elements for the lines
 * and positioned dots with keyframe animations for the pulse.
 */
export default function GridBackground({
  className = "",
  variant = "default",
}: {
  className?: string;
  /** "default" = full grid + nodes, "sparse" = wider spacing + fewer nodes, "dense" = tighter grid */
  variant?: "default" | "sparse" | "dense";
}) {
  const configs = {
    default: { size: 64, nodes: 8, nodeSpread: 3 },
    sparse: { size: 96, nodes: 5, nodeSpread: 4 },
    dense: { size: 44, nodes: 12, nodeSpread: 2 },
  };

  const { size, nodes, nodeSpread } = configs[variant];

  // Generate deterministic "random" node positions based on index
  const glowNodes = Array.from({ length: nodes }, (_, i) => {
    const seed1 = ((i * 7 + 3) * 13) % 97;
    const seed2 = ((i * 11 + 7) * 17) % 89;
    return {
      x: `${(seed1 / 97) * 90 + 5}%`,
      y: `${(seed2 / 89) * 90 + 5}%`,
      delay: `${(i * 1.8) % (nodes * 1.5)}s`,
      duration: `${3 + (i % 3) * 1.2}s`,
      size: 3 + (i % 3),
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* The grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px`,
        }}
      />

      {/* Brighter accent lines at wider intervals */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,108,245,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,108,245,0.5) 1px, transparent 1px)
          `,
          backgroundSize: `${size * nodeSpread}px ${size * nodeSpread}px`,
        }}
      />

      {/* Pulsing glow nodes at intersections */}
      {glowNodes.map((node, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: node.x,
            top: node.y,
            width: `${node.size}px`,
            height: `${node.size}px`,
            background: "radial-gradient(circle, rgba(26,108,245,0.8) 0%, rgba(26,108,245,0) 70%)",
            boxShadow: "0 0 8px 2px rgba(26,108,245,0.3)",
            animation: `grid-node-pulse ${node.duration} ease-in-out infinite`,
            animationDelay: node.delay,
          }}
        />
      ))}

      {/* Horizontal scan line that sweeps across the grid */}
      <div
        className="absolute inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(26,108,245,0.2) 20%, rgba(26,108,245,0.4) 50%, rgba(26,108,245,0.2) 80%, transparent)",
          animation: "grid-scanline 8s linear infinite",
        }}
      />

      {/* Radial fade at edges so the grid doesn't end abruptly */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, var(--color-space-950) 80%)",
        }}
      />
    </div>
  );
}
