import { useScroll } from "framer-motion";
import type { RefObject } from "react";

/** Standard 0→1 progress across a section's own scroll range — never touches scroll speed. */
export function useSectionProgress(ref: RefObject<HTMLElement | null>) {
  return useScroll({ target: ref, offset: ["start start", "end start"] });
}

/** Three-plane depth model rates, per the Signal Playbook. */
export const PLANE = {
  background: 0.4,
  midground: 0.7,
  foreground: 1.2,
} as const;
