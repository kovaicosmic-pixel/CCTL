import { createFileRoute } from "@tanstack/react-router";
import Careers from "@/site/pages/Careers";
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

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
]);

// JSON-LD JobPosting schema — helps jobs appear in Google for Jobs
const jobPostingSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "EMI/EMC Test Engineer",
  description:
    "Conduct EMI/EMC testing on electronic products and systems. Set up and operate test equipment including EMI receivers, antennas, and test chambers. Support pre-compliance and compliance testing against MIL, IEC, and automotive EMC standards.",
  datePosted: new Date().toISOString().split("T")[0],
  employmentType: "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: "Cosmic Compliance Test Lab",
    sameAs: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
  },
  jobLocation: [
    {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Coimbatore",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
    },
  ],
  experienceRequirements: "1–3 years of hands-on EMI/EMC testing experience",
  educationRequirements: "Degree or diploma in Electrical, Electronics, or related field",
  skills:
    "EMI/EMC testing, MIL-STD-461, CISPR 25, IEC 61000, EMI receivers, antennas, test chambers",
  directApply: true,
  applicationContact: {
    "@type": "ContactPoint",
    email: "emc@cosmictestlab.com",
  },
};

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
      { "script:ld+json": jobPostingSchema },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/careers") }],
  }),
  component: Careers,
});
