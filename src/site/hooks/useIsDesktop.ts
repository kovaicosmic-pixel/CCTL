import { useEffect, useState } from "react";

export const DESKTOP_BREAKPOINT = 1024;

/** True at or above the shared breakpoint used by the site's cinematic scenes. */
export function useIsDesktop(minWidth = DESKTOP_BREAKPOINT) {
  // Keep the server snapshot and the first client render identical. The
  // browser value is applied immediately after hydration in the effect below.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);

  return isDesktop;
}
