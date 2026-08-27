import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Photography reveal that wipes open behind a clip-path mask while the image itself
 * counter-scales — the frame opens, the photo settles. Not a fade.
 *
 * Implemented with a plain IntersectionObserver + CSS transitions: clip-path keyframing
 * through the animation library proved unreliable here and could leave photographs
 * permanently clipped to zero height.
 */
export default function MaskedImage({
  src,
  className = "",
  imgClassName = "h-full w-full object-cover",
  direction = "up",
  delay = 0,
  alt = "",
}: {
  src: string;
  className?: string;
  imgClassName?: string;
  direction?: "up" | "left" | "right" | "center";
  delay?: number;
  alt?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fail-open: if anything prevents observation, show the photograph.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const from =
    direction === "left"
      ? "inset(0% 100% 0% 0%)"
      : direction === "right"
        ? "inset(0% 0% 0% 100%)"
        : direction === "center"
          ? "inset(18% 18% 18% 18%)"
          : "inset(100% 0% 0% 0%)";

  const open = reduced || shown;

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={
        reduced
          ? undefined
          : {
              clipPath: open ? "inset(0% 0% 0% 0%)" : from,
              transition: `clip-path 1.05s cubic-bezier(0.76,0,0.24,1) ${delay}s`,
              willChange: "clip-path",
            }
      }
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={imgClassName}
        style={
          reduced
            ? undefined
            : {
                transform: open ? "scale(1)" : "scale(1.22)",
                transition: `transform 1.4s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
              }
        }
      />
    </div>
  );
}
