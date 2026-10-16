import { createFileRoute } from "@tanstack/react-router";
import CareersAdmin from "@/site/pages/CareersAdmin";

/**
 * /careers/admin — password-protected admin panel.
 *
 * This route intentionally has NO SEO meta (no title in head, no description,
 * noindex) so it never appears in search engine results.
 * Auth is handled client-side via JWT cookie checked on mount.
 */
export const Route = createFileRoute("/careers_/admin")({
  head: () => ({
    meta: [
      { title: "Admin — CCTL Careers Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CareersAdmin,
});
