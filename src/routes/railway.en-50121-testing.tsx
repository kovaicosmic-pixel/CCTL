import { createFileRoute } from "@tanstack/react-router";
import En50121Testing from "@/site/pages/En50121Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EN 50121 Testing | Railway EMC Testing | CCTL";
const description =
  "EN 50121 railway EMC testing at CCTL, covering the applicable railway environment, rolling stock, signalling and fixed installation requirements.";
const url = canonical("/railway/en-50121-testing");
const image = ogImage("/images/railway/Radiated-Emission-test-1-4-scaled-1.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EN 50121 testing?",
    answer:
      "EN 50121 is a European standard series for railway electromagnetic compatibility. It specifies emission limits and immunity requirements for railway systems, subsystems, and equipment. The series covers the overall railway system, rolling stock, fixed installations, and signalling and telecommunications equipment.",
  },
  {
    question: "What parts of EN 50121 are relevant to my equipment?",
    answer:
      "EN 50121 is divided into multiple parts: EN 50121-1 covers the general overview, EN 50121-2 covers emissions from the whole railway system, EN 50121-3-1 and -3-2 cover rolling stock, EN 50121-4 covers signalling and telecommunications, and EN 50121-5 covers fixed power supply installations. The applicable part depends on your equipment type.",
  },
  {
    question: "Does EN 50121 cover both emissions and immunity?",
    answer:
      "Yes. EN 50121 specifies both emission limits (what the equipment radiates or conducts onto the supply) and immunity requirements (how the equipment must withstand the electromagnetic environment characteristic of the railway application).",
  },
  {
    question: "Where is EN 50121 testing available in India?",
    answer:
      "CCTL provides EN 50121 railway EMC testing at its laboratories in Coimbatore and Bangalore, India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Railway Domain", path: "/services/railway" },
  { name: "Railway EMC Testing", path: "/railway/railway-emc-testing" },
  { name: "EN 50121 Testing", path: "/railway/en-50121-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EN 50121 Testing",
  description,
  path: "/railway/en-50121-testing",
  image: "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
});

export const Route = createFileRoute("/railway/en-50121-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EN 50121 testing India, EN 50121 railway EMC, railway signalling EMC testing, rolling stock EMC India, EN 50121-3 testing, railway fixed installation EMC, EN 50121 lab Coimbatore Bangalore",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { "script:ld+json": breadcrumbs },
      { "script:ld+json": serviceSchema },
      { "script:ld+json": faqSchema(faqs) },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: En50121Testing,
});
