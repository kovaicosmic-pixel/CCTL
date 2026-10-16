import { createFileRoute } from "@tanstack/react-router";
import CareersApply from "@/site/pages/CareersApply";
import { canonical, ogImage, breadcrumbSchema } from "@/site/data/seo";

const title = "Send Your CV | Careers at Cosmic Compliance Test Lab";
const description =
  "Don't see the right opening? Send your CV to Cosmic Compliance Test Lab (CCTL) — choose the EMC role that suits you and your preferred lab in Coimbatore or Bangalore.";

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
  { name: "Send Your CV", path: "/careers/apply" },
]);

/** /careers/apply — general application ("Send your CV"). Not nested under /careers. */
export const Route = createFileRoute("/careers_/apply")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/careers/apply") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/careers/apply") }],
  }),
  component: CareersApply,
});
