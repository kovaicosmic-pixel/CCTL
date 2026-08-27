import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function Typewriter({
  text,
  highlightFrom,
  className = "",
  highlightClassName = "text-cyan",
  speedMs = 32,
}: {
  text: string;
  highlightFrom: number;
  className?: string;
  highlightClassName?: string;
  speedMs?: number;
}) {
  const reduced = useReducedMotion();
  const [len, setLen] = useState(reduced ? text.length : 0);
  const [done, setDone] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLen(i);
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speedMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const shown = text.slice(0, len);
  const plain = shown.slice(0, Math.min(len, highlightFrom));
  const highlighted = shown.slice(Math.min(len, highlightFrom));

  return (
    <span className={className}>
      {plain}
      <span className={highlightClassName}>{highlighted}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] translate-y-[0.08em] bg-cyan-glow"
        style={{
          height: "0.85em",
          marginLeft: 2,
          opacity: done ? 0.85 : 1,
          animation: reduced ? undefined : "caret-blink 0.9s step-end infinite",
        }}
      />
    </span>
  );
}
