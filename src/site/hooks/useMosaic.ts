import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Photographic Mosaic technique (Signal Playbook §01/§08): one shared photo is stretched
 * across a grid of cards; each card is a background-position "window" computed from its
 * own offset inside the section, so the grid reads as one continuous photographed scene.
 *
 * The image is scaled with `cover` semantics against the cards' actual combined extent —
 * whichever of width/height is the binding constraint (a single wide row vs. a multi-row
 * grid) — so every card's slice always falls inside the rendered image, regardless of
 * column/row count. `focalY` (0-1) picks which vertical band of any leftover overflow each
 * card windows into.
 */
export function useMosaic(imageSrc: string, count: number, focalY = 0.35) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [styles, setStyles] = useState<CSSProperties[]>(() => Array(count).fill({}));
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !natural) return;

    function recompute() {
      const sectionRect = el!.getBoundingClientRect();
      const sw = sectionRect.width;
      if (!sw) return;

      // The container's own box height can be taller than the cards actually occupy (e.g. a
      // grid using `content-center` to vertically center a single row inside a full-height
      // stage) — sizing off that inflated box height would zoom the image far more than
      // needed. Measuring the cards' own real extent instead makes this correct for both a
      // single row (width-bound) and a multi-row grid (height-bound), since whichever ratio
      // is larger becomes the "cover" scale that guarantees every card's slice is populated.
      let contentHeight = 0;
      for (const cardEl of cardRefs.current) {
        if (!cardEl) continue;
        contentHeight = Math.max(
          contentHeight,
          cardEl.getBoundingClientRect().bottom - sectionRect.top,
        );
      }
      if (!contentHeight) contentHeight = sectionRect.height;

      const scale = Math.max(sw / natural!.w, contentHeight / natural!.h);
      const renderWidth = natural!.w * scale;
      const renderHeight = natural!.h * scale;

      const next = cardRefs.current.map((cardEl): CSSProperties => {
        if (!cardEl) return {};
        const r = cardEl.getBoundingClientRect();
        const x = r.left - sectionRect.left;
        const y = r.top - sectionRect.top;
        const overflowX = renderWidth > sw ? renderWidth - sw : 0;
        const overflowY = renderHeight > contentHeight ? renderHeight - contentHeight : 0;
        const focalOffsetX = overflowX * 0.5;
        const focalOffsetY = overflowY * focalY;
        return {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${renderWidth}px ${renderHeight}px`,
          backgroundPosition: `${-(x + focalOffsetX)}px ${-(y + focalOffsetY)}px`,
          backgroundRepeat: "no-repeat",
        };
      });
      setStyles(next);
    }

    recompute();
    // Cards may sit inside a 3D entrance animation (rotateX/z) that transiently skews their
    // measured rect — a couple of delayed passes let the crop self-correct once it settles.
    const t1 = window.setTimeout(recompute, 250);
    const t2 = window.setTimeout(recompute, 750);
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    window.addEventListener("resize", recompute);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [natural, imageSrc, focalY]);

  function setCardRef(i: number) {
    return (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    };
  }

  return { containerRef, setCardRef, styles };
}
