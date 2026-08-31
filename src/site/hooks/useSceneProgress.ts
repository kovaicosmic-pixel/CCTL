import { useEffect, useRef, useState } from "react";

/**
 * Returns 0..1 progress of a tall scroll container as the camera moves through it.
 */
export function useSceneProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let lastWidth = window.innerWidth;

    const viewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - viewportHeight();
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      const width = window.innerWidth;
      if (width === lastWidth) return; // ignore address-bar height jitter
      lastWidth = width;
      onScroll(); // trigger re-measure on width change only
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}
