import { useReducedMotion } from "framer-motion";

/**
 * WaveformLines — Animated SVG signal waveform traces in the background.
 *
 * Multiple sine-wave paths at different frequencies and amplitudes drift
 * slowly across the viewport. Looks like oscilloscope traces or EMC signal
 * measurements — reinforces the lab identity.
 */
export default function WaveformLines({
  className = "",
  count = 4,
  color = "rgba(26, 108, 245, 0.12)",
}: {
  className?: string;
  count?: number;
  color?: string;
}) {
  const reducedMotion = useReducedMotion();

  // Generate different waveform paths
  const waves = Array.from({ length: count }, (_, i) => {
    const amplitude = 20 + i * 12;
    const frequency = 2 + i * 0.7;
    const yOffset = 20 + (i * 60) / count;
    const speed = 15 + i * 5;
    const phase = i * 40;

    // Generate SVG path for a sine wave
    const points: string[] = [];
    for (let x = 0; x <= 200; x += 2) {
      const y =
        yOffset +
        Math.sin(((x + phase) / 100) * Math.PI * frequency) * amplitude * 0.3 +
        Math.sin(((x + phase * 2) / 60) * Math.PI) * amplitude * 0.15;
      points.push(`${x === 0 ? "M" : "L"} ${x * 10} ${y}`);
    }

    return { path: points.join(" "), speed, opacity: 0.3 + i * 0.15, strokeWidth: 0.8 + i * 0.2 };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 2000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {waves.map((wave, i) => (
          <path
            key={i}
            d={wave.path}
            fill="none"
            stroke={color}
            strokeWidth={wave.strokeWidth}
            opacity={wave.opacity}
            strokeLinecap="round"
            style={
              reducedMotion
                ? undefined
                : {
                    animation: `waveform-drift-${i % 2 === 0 ? "left" : "right"} ${wave.speed}s linear infinite`,
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}
