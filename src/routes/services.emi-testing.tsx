import { createFileRoute } from "@tanstack/react-router";
import EmiTesting from "@/site/pages/EmiTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EMI Testing Laboratory in Coimbatore & Bangalore | CCTL";
const description =
  "EMI testing and emission measurement services from CCTL, helping manufacturers evaluate electromagnetic interference and investigate potential issues at our Coimbatore and Bangalore laboratories.";
const url = canonical("/services/emi-testing");
const image = ogImage("/images/explore/RE102 setup.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EMI testing?",
    answer:
      "EMI (Electromagnetic Interference) testing measures unwanted electromagnetic emissions from a device — both radiated emissions (energy transmitted through the air) and conducted emissions (disturbances transmitted along power or signal cables).",
  },
  {
    question: "What is the difference between EMI and EMC testing?",
    answer:
      "EMI testing focuses specifically on measuring electromagnetic emissions from a device. EMC testing is broader — it includes both emission testing and immunity testing (how well the device withstands external electromagnetic disturbances).",
  },
  {
    question: "What EMI tests does CCTL perform?",
    answer:
      "CCTL performs radiated emissions and conducted emissions measurements against applicable standards including CISPR 25 (automotive), MIL-STD-461 RE102/CE102 (military), EN 55032/CISPR 32 (multimedia), IEC 61000 series (civilian), and EN 50121 (railway).",
  },
  {
    question: "Why would a product fail EMI testing?",
    answer:
      "Common causes of EMI test failures include PCB design issues, poor grounding and shielding, inadequate filtering on power and signal lines, switching power supply noise, and unintended radiating structures (cables, connectors, enclosure apertures).",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "EMI Testing", path: "/services/emi-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EMI Testing",
  description,
  path: "/services/emi-testing",
  image: "/images/explore/RE102 setup.webp",
});

export const Route = createFileRoute("/services/emi-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMI testing India, electromagnetic interference testing, radiated emissions testing India, conducted emissions testing, EMI testing lab Coimbatore, EMI testing lab Bangalore, EMI measurement India",
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
  component: EmiTesting,
});
