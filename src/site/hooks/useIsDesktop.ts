import { useEffect, useState } from "react";

/** True above `minWidth` — used to gate the heavier pinned/scroll-driven scenes to larger
 *  viewports. 768 (not 1024) so an ordinary, non-maximized desktop browser window still gets
 *  the real 3D scenes — 1024 was excluding real desktop users, not just phones/small tablets. */
export function useIsDesktop(minWidth = 768) {
  const [isDesktop, setIsDesktop] = useState(() => false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [minWidth]);

  return isDesktop;
}
