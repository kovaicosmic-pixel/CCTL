const DEFAULT_D =
  "M0,20 L36,20 L50,6 L64,34 L78,20 L112,20 L126,7 L140,33 L154,20 L190,20 L204,10 L218,30 L232,20 L268,20 L282,8 L296,32 L310,20 L360,20";

export default function SignalTrace({
  className = "",
  color = "#1a6cf5",
  d = DEFAULT_D,
}: {
  className?: string;
  color?: string;
  d?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 5"
        style={{
          animation: "signal-dash 1.8s linear infinite",
          filter: `drop-shadow(0 0 4px ${color}99)`,
        }}
      />
    </svg>
  );
}
