import { createFileRoute } from "@tanstack/react-router";
import About from "@/site/pages/About";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
  organizationSchema,
} from "@/site/data/seo";

const title =
  "About CCTL | NABL Accredited EMI/EMC Testing Lab in Coimbatore & Bangalore, India";
const description =
  "Cosmic Compliance Test Lab (CCTL) is India's leading NABL & ISO/IEC 17025 accredited EMI/EMC testing facility with labs in Coimbatore and Bangalore. 25+ expert engineers, 120+ projects, serving automotive, defence, aerospace, railway & telecom sectors.";

const breadcrumbs = breadcrumbSchema(
  [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ],
  `${SITE_URL}/about#breadcrumb`,
);

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#webpage`,
  name: "About Cosmic Compliance Test Lab",
  description,
  url: canonical("/about"),
  mainEntity: { "@id": `${SITE_URL}/#organization` },
  breadcrumb: { "@id": `${SITE_URL}/about#breadcrumb` },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "about CCTL, EMC testing lab India, NABL accredited lab Coimbatore, ISO 17025 EMC laboratory Bangalore, EMI testing facility India, electromagnetic compatibility lab, EMC engineers India",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/about") },
      { property: "og:image", content: ogImage("/images/about_us.jpg") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage("/images/about_us.jpg") },
      { "script:ld+json": aboutPageSchema },
      { "script:ld+json": organizationSchema },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/about") }],
  }),
  component: About,
});
