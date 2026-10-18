import { createFileRoute } from "@tanstack/react-router";
import Careers from "@/site/pages/Careers";
import { listActiveJobs } from "@/site/lib/careersAdmin";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
  organizationSchema,
} from "@/site/data/seo";

const title =
  "Careers | Cosmic Compliance Test Lab — EMC Testing Jobs in Coimbatore & Bangalore";
const description =
  "Join Cosmic Compliance Test Lab (CCTL), India's NABL accredited EMI/EMC testing facility. We're hiring EMC test engineers in Coimbatore and Bangalore. Apply now and build the future of electromagnetic testing.";

// The @id must match careersPageSchema.breadcrumb below — without it Google
// sees that reference as an empty BreadcrumbList ("Missing itemListElement").
const breadcrumbs = breadcrumbSchema(
  [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ],
  `${SITE_URL}/careers#breadcrumb`,
);

// No JobPosting here: Google only accepts it on each job's own page
// (/careers/jobs/$jobId), built from the database — see data/jobPostingSchema.ts.

const careersPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/careers#webpage`,
  name: title,
  description,
  url: canonical("/careers"),
  breadcrumb: { "@id": `${SITE_URL}/careers#breadcrumb` },
};

export const Route = createFileRoute("/careers")({
  // Server-render the open positions so job links are in the initial HTML.
  // A database hiccup must never take the page down: fall back to the
  // browser fetching the list itself (react-query retries automatically).
  loader: async () => {
    try {
      return await listActiveJobs();
    } catch (err) {
      console.error("careers loader: could not load jobs, client will retry", err);
      return null;
    }
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing jobs India, EMI engineer jobs Coimbatore, EMC engineer jobs Bangalore, EMC test engineer hiring, CCTL careers, electromagnetic testing jobs India, NABL lab jobs",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/careers") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { "script:ld+json": careersPageSchema },
      { "script:ld+json": organizationSchema },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/careers") }],
  }),
  component: Careers,
});
