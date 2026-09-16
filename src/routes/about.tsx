import { createFileRoute } from "@tanstack/react-router";
import About from "@/site/pages/About";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
  organizationSchema,
  faqSchema,
  expertsSchema,
  type FAQItem,
} from "@/site/data/seo";

const title =
  "About CCTL | NABL Accredited EMI/EMC Testing Lab in Coimbatore & Bangalore, India";
const description =
  "Cosmic Compliance Test Lab (CCTL) is India's leading NABL & ISO/IEC 17025 accredited EMI/EMC testing facility with labs in Coimbatore and Bangalore. 25+ expert engineers, 120+ projects, serving automotive, defence, aerospace, railway & telecom sectors.";

const aboutFaqs: FAQItem[] = [
  {
    question: "What is Cosmic Compliance Test Lab (CCTL)?",
    answer:
      "Cosmic Compliance Test Lab (CCTL) is a NABL accredited and ISO/IEC 17025:2017 certified EMI/EMC testing laboratory with facilities in Coimbatore, Tamil Nadu and Bangalore, Karnataka, India. CCTL provides electromagnetic interference and compatibility testing services for automotive, defence, aerospace, railway, telecom and civilian electronic products.",
  },
  {
    question: "Is CCTL NABL accredited?",
    answer:
      "Yes. CCTL is fully NABL accredited and ISO/IEC 17025:2017 certified. It is also recognized as a Designated Test Facility. These accreditations confirm that CCTL operates to internationally recognized standards for testing laboratory competence.",
  },
  {
    question: "Where are CCTL's laboratories located?",
    answer:
      "CCTL operates two laboratories — one in Coimbatore (Annamalai Industrial Park, Kalapatti, Tamil Nadu) and one in Bangalore (Bommasandra Village, Anekal Taluk, Karnataka). Both labs are fully equipped for EMI/EMC testing.",
  },
  {
    question: "What industries does CCTL serve?",
    answer:
      "CCTL serves the automotive, defence and aerospace, civilian and industrial, railway, and telecom and wireless sectors. Testing capabilities include CISPR 25, MIL-STD-461, IEC 61000, EN 50121, and wireless/RF evaluation.",
  },
  {
    question: "What equipment does CCTL have for EMC testing?",
    answer:
      "CCTL operates a Component Semi-Anechoic Chamber (CSAC) capable of testing up to 48 GHz, a Vehicle Semi-Anechoic Chamber (VSAC) with a 2-meter turntable, shielded control rooms, and advanced EMI measurement instrumentation.",
  },
];

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
      { "script:ld+json": faqSchema(aboutFaqs) },
      // Person schema for named CCTL experts — emits nothing until EMC_EXPERTS
      // is populated with genuine personnel in seo.ts (no fabricated authors).
      ...expertsSchema().map((p) => ({ "script:ld+json": p })),
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/about") }],
  }),
  component: About,
});
