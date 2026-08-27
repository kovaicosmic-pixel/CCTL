import { createFileRoute } from "@tanstack/react-router";
import Home from "@/site/pages/Home";
import { company } from "@/site/data/content";
import {
  SITE_URL,
  canonical,
  ogImage,
  organizationSchema,
  webSiteSchema,
  localBusinessSchema,
  faqSchema,
  breadcrumbSchema,
  type FAQItem,
} from "@/site/data/seo";

const title =
  "EMI/EMC Testing Lab in Coimbatore & Bangalore, India | NABL Accredited | CCTL";
const description =
  "Cosmic Compliance Test Lab (CCTL) is a NABL & ISO/IEC 17025 accredited EMI/EMC testing laboratory in Coimbatore and Bangalore, India. Expert EMC compliance testing for automotive, defence, aerospace, railway & telecom industries.";

// FAQ targeting "EMC testing" related searches
const homeFaqs: FAQItem[] = [
  {
    question: "What is EMC testing and why is it important?",
    answer:
      "EMC (Electromagnetic Compatibility) testing ensures electronic devices operate without causing or being affected by electromagnetic interference. It is mandatory for regulatory compliance (CE, FCC, BIS) before products can be sold commercially. CCTL provides comprehensive EMI/EMC testing services in Coimbatore and Bangalore, India.",
  },
  {
    question: "Where can I get EMC testing done in India?",
    answer:
      "Cosmic Compliance Test Lab (CCTL) offers NABL accredited EMC testing at two locations in India — Coimbatore (Tamil Nadu) and Bangalore (Karnataka). Our labs operate 24x6 with Component Semi-Anechoic Chamber (CSAC) up to 48 GHz and Vehicle Semi-Anechoic Chamber (VSAC).",
  },
  {
    question: "What industries does CCTL serve for EMI/EMC testing?",
    answer:
      "CCTL provides EMI/EMC testing services for automotive (CISPR 25, ISO 11452), defence & aerospace (MIL-STD-461), railway (EN 50121), telecom & wireless (CE/FCC, WPC), and civilian/industrial equipment (IEC 61000 series). We serve clients across India from our Coimbatore and Bangalore labs.",
  },
  {
    question: "Is CCTL's EMC testing lab NABL accredited?",
    answer:
      "Yes, Cosmic Compliance Test Lab is fully NABL accredited and ISO/IEC 17025:2017 certified. We are a designated test facility recognized by national and international regulatory bodies for EMI/EMC compliance testing.",
  },
  {
    question: "How much does EMC testing cost in India?",
    answer:
      "EMC testing costs vary based on the product type, applicable standards, and number of tests required. CCTL offers competitive pricing with fast turnaround times. Contact our team at emc@cosmictestlab.com or call +91 94442 72009 for a customized quote.",
  },
  {
    question: "What EMC testing standards does CCTL support?",
    answer:
      "CCTL supports a comprehensive range of EMC standards including MIL-STD-461 (defence), CISPR 25/12 (automotive), EN 50121 (railway), IEC 61000 series (civilian), CISPR 11/22/32 (industrial), and CE/FCC/BIS marks for wireless & telecom products.",
  },
];

const locationsLd = company.locations.map((loc) => localBusinessSchema(loc));

const breadcrumbs = breadcrumbSchema([{ name: "Home", path: "/" }]);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing India, EMI testing Coimbatore, EMC testing Bangalore, EMI EMC lab India, NABL accredited EMC lab, ISO 17025 EMC testing, electromagnetic compatibility testing, MIL-STD-461 testing India, automotive EMC testing, CISPR 25 testing, EMC compliance lab Coimbatore, EMC certification Bangalore",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: "Cosmic Compliance Test Lab" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Coimbatore" },
      { name: "geo.position", content: "11.0168;76.9558" },
      { name: "ICBM", content: "11.0168, 76.9558" },
      { "script:ld+json": organizationSchema },
      { "script:ld+json": webSiteSchema },
      { "script:ld+json": locationsLd[0] },
      { "script:ld+json": locationsLd[1] },
      { "script:ld+json": faqSchema(homeFaqs) },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Home,
});
