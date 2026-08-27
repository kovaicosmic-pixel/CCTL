import { useEffect, useRef } from "react";

/**
 * Real chamber footage as a scroll-scrubbed image sequence — the same technique behind Apple's
 * product-page hero reels. A plain <video>'s currentTime seek has to walk back to the nearest
 * keyframe on every jump, which reads as stutter under fast scroll; drawing pre-decoded frames
 * straight to canvas has no decode latency, so the "camera" tracks the scrollbar exactly.
 * Frames are pre-extracted stills at public/images/chamber-frames/frame-000.webp..frame-191.webp —
 * the source video's full native 24fps/8s (192 frames), not a downsampled subset, so the scrub
 * plays back at the same motion resolution as the real footage instead of looking steppy.
 */

const FRAME_COUNT = 192;
const frameSrc = (i: number) => `/images/chamber-frames/frame-${String(i).padStart(3, "0")}.webp`;

export default function ChamberFrames({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const drawnIndexRef = useRef(-1);

  const draw = (index: number, force = false) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    if (!force && drawnIndexRef.current === index) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawnIndexRef.current = index;
    // Source stills are 1280x720 (the source video's native resolution —
    // there's no higher-res version to draw from). This only softens the
    // upscale blur on large displays, it can't add detail that isn't
    // there; a genuinely sharp full-bleed hero needs a higher-res source.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    /* Cover, anchored to the top — always full-bleed, no letterbox/pillarbox
       bars at any viewport ratio. The footage (~16:9) is narrower than a
       wide desktop viewport (~2:1), so filling edge-to-edge means cropping
       height, not width; anchoring that crop to the top instead of
       centering it means the ceiling stays in frame as long as possible
       and only the floor gets clipped, not both. */
    let dw = cw;
    let dh = ch;
    if (ir > cr) {
      dw = ch * ir;
    } else {
      dh = cw / ir;
    }
    const dx = (cw - dw) / 2;
    const dy = 0;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
  };

  const nearestLoaded = (target: number) => {
    if (loadedRef.current[target]) return target;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (target - d >= 0 && loadedRef.current[target - d]) return target - d;
      if (target + d < FRAME_COUNT && loadedRef.current[target + d]) return target + d;
    }
    return -1;
  };

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        loaded[i] = true;
        if (drawnIndexRef.current === -1) draw(i, true);
      };
      img.src = frameSrc(i);
      images.push(img);
    }
    imagesRef.current = images;
    loadedRef.current = loaded;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      draw(Math.max(0, drawnIndexRef.current), true);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const target = Math.round(progress * (FRAME_COUNT - 1));
    const idx = nearestLoaded(target);
    if (idx !== -1) draw(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
