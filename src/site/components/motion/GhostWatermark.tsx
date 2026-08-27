export default function GhostWatermark({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <span
        className="font-heading whitespace-nowrap font-black text-line-strong/[0.05]"
        style={{ fontSize: "clamp(6rem, 20vw, 14rem)", letterSpacing: "-0.02em" }}
      >
        {text}
      </span>
    </div>
  );
}
