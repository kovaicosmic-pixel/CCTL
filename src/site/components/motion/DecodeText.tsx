import { useEffect, useRef, useState, useCallback } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * DecodeText — character-by-character decode/decrypt reveal.
 *
 * Characters scramble rapidly through random glyphs before settling
 * on the correct letter. Each character resolves sequentially left-to-right
 * with multiple scramble cycles visible per character.
 */
export default function DecodeText({
  text,
  className = "",
  delay = 0,
  charSpeed = 50,
  scrambleCycles = 5,
  scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>[]{}|/\\",
  once = true,
}: {
  text: string;
  className?: string;
  /** Delay before starting (ms) */
  delay?: number;
  /** Time per scramble cycle per character (ms) */
  charSpeed?: number;
  /** Number of scramble iterations before each character resolves */
  scrambleCycles?: number;
  /** Pool of characters to scramble through */
  scrambleChars?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const [output, setOutput] = useState<string[]>(() => text.split("").map(() => "\u00A0"));
  const [started, setStarted] = useState(false);
  const animRef = useRef<number | null>(null);

  const randomChar = useCallback(() => {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }, [scrambleChars]);

  useEffect(() => {
    if (!isInView || reducedMotion || started) return;
    
    const timer = setTimeout(() => {
      setStarted(true);
      const chars = text.split("");
      const resolved = new Array(chars.length).fill(false);
      const cycles = new Array(chars.length).fill(0);
      let currentIdx = 0;

      const tick = () => {
        const display = chars.map((char, i) => {
          if (char === " ") return " ";
          if (resolved[i]) return char;
          if (i <= currentIdx) {
            return randomChar();
          }
          return "\u00A0";
        });

        setOutput(display);

        // Advance the current character's cycle count
        if (currentIdx < chars.length) {
          if (chars[currentIdx] === " ") {
            resolved[currentIdx] = true;
            currentIdx++;
          } else {
            cycles[currentIdx]++;
            if (cycles[currentIdx] >= scrambleCycles) {
              resolved[currentIdx] = true;
              currentIdx++;
            }
          }
        }

        // Also scramble a few characters ahead for the "wave" effect
        const lookahead = Math.min(currentIdx + 3, chars.length - 1);
        for (let i = currentIdx + 1; i <= lookahead; i++) {
          if (!resolved[i] && chars[i] !== " ") {
            display[i] = randomChar();
          }
        }
        setOutput([...display]);

        if (currentIdx < chars.length) {
          animRef.current = window.setTimeout(tick, charSpeed);
        } else {
          setOutput(chars);
        }
      };

      tick();
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [isInView, reducedMotion, started, text, delay, charSpeed, scrambleCycles, randomChar]);

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={`inline-block font-mono ${className}`}>
      {output.map((char, i) => (
        <span
          key={i}
          className={char === text[i] ? "text-current" : "text-cyan-glow/70"}
          style={{ transition: "color 0.15s" }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
