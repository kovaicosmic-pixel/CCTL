import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { DESKTOP_BREAKPOINT, useIsDesktop } from "../../hooks/useIsDesktop";

/**
 * Real chamber footage as a scroll-scrubbed video — the same technique behind
 * Apple/Stripe's product-page hero reels. `video.currentTime` is driven
 * directly from scroll progress; the browser decodes and displays whichever
 * frame that time lands on, so there's no per-frame image fetching or
 * canvas compositing to manage.
 *
 * Source: public/images/chamber-scrub.mp4, encoded with `-g 1` (every frame
 * a keyframe) so an arbitrary seek lands on the exact frame instead of
 * snapping back to the nearest GOP boundary — that precision is what makes
 * scroll-scrubbing feel smooth instead of steppy.
 *
 * A seek itself isn't free — profiling measured ~30-47ms per seek to
 * resolve, climbing past 400ms under sustained fast scroll if a new one is
 * issued before the last resolves. `requestSeek`/`performSeek` below only
 * ever let one seek be in flight at a time, coalescing every scroll tick
 * that arrives in the meantime into a single catch-up seek once it resolves.
 */

const VIDEO_SRC = "/images/chamber-scrub.mp4";
// ~1 source frame at the original 192-frames-over-8s (24fps) cut — seeks
// smaller than this are visually indistinguishable, so skip them to avoid
// thrashing the decoder on fast/high-frequency scroll updates.
const SEEK_EPSILON = 1 / 48;

/**
 * iOS Safari (and any iOS browser — all WebKit under Apple's policy) refuses
 * programmatic `currentTime` seeks on a video that has never played, even
 * with `preload="auto"`. No other engine has this restriction, so the
 * play-then-pause workaround below must stay scoped to iOS: calling
 * `.play()` on a `preload="auto"` video that's still downloading makes the
 * browser renegotiate its fetch as a playback-driven range request,
 * canceling the in-flight sequential preload — running it unconditionally
 * on every browser was producing a canceled request + extra 206 range
 * requests on page load for the ~95% of visitors that never needed it.
 * iPadOS reports as "MacIntel" with touch support, hence the second check.
 */
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function unlockIOSScrubbing(video: HTMLVideoElement, onDone: () => void) {
  const playPromise = video.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        video.pause();
        onDone();
      })
      .catch(() => onDone());
  } else {
    video.pause();
    onDone();
  }
}

export default function ChamberFrames({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readyRef = useRef(false);
  // Always the most recently requested progress, even while a seek is still
  // resolving — this is what a queued-up scroll gets coalesced down to.
  const pendingProgressRef = useRef(progress);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(DESKTOP_BREAKPOINT);

  // Unconditionally sets currentTime — callers must confirm no seek is
  // already in flight (or be the 'seeked' handler resolving the previous
  // one) before calling this directly.
  const performSeek = (p: number) => {
    const video = videoRef.current;
    if (!video || !readyRef.current) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const target = Math.max(0, Math.min(duration - 0.001, p * duration));
    if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return;
    video.currentTime = target;
  };

  // Measured: a seek takes ~30-47ms to resolve, 2-3x a 60fps frame budget —
  // issuing a new one before the last resolves makes them queue up, and
  // under sustained fast scroll that backlog compounds (seen up to 461ms
  // latency in profiling). `video.seeking` is the source of truth for
  // whether one is currently in flight: if so, just remember the latest
  // requested value and let the 'seeked' handler below pick it up once the
  // in-flight seek resolves — coalescing every intermediate scroll tick
  // into a single catch-up seek instead of one seek per tick.
  const requestSeek = (p: number) => {
    pendingProgressRef.current = p;
    const video = videoRef.current;
    if (!video || video.seeking) return;
    performSeek(p);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      readyRef.current = true;
      if (isIOS()) {
        unlockIOSScrubbing(video, () => requestSeek(pendingProgressRef.current));
      } else {
        requestSeek(pendingProgressRef.current);
      }
    };

    // Once the in-flight seek resolves, jump straight to whatever the
    // latest requested progress is *now* — not whatever it was when this
    // seek started — so rapid scrolling collapses to the minimum number of
    // seeks instead of draining a queue one stale value at a time.
    const onSeeked = () => {
      performSeek(pendingProgressRef.current);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);
    // Metadata may already be available (e.g. fast cache hit before this
    // effect ran) — readyState 1 (HAVE_METADATA) or higher means duration
    // is already known and the event above won't fire again.
    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestSeek(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const depthTransform =
    !isDesktop && !reducedMotion ? `scale(${1.03 + 0.01 * progress})` : undefined;

  return (
    <div className="h-full w-full">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className={[className, "object-cover object-top"].filter(Boolean).join(" ")}
        style={{ transform: depthTransform, transformOrigin: "center top" }}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
    </div>
  );
}
