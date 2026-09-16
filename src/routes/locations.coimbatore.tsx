import { createFileRoute } from "@tanstack/react-router";
import LocationCoimbatore from "@/site/pages/LocationCoimbatore";
import { company } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
  type FAQItem,
} from "@/site/data/seo";

const loc = company.locations.find((l) => l.id === "coimbatore")!;

const title = "EMC Testing Laboratory in Coimbatore | CCTL";
const description =
  "CCTL Coimbatore — NABL accredited, ISO/IEC 17025 certified EMI/EMC testing laboratory in Coimbatore, Tamil Nadu. Automotive, defence, railway, telecom and civilian EMC testing. Call +91 97909 01184.";
const url = canonical("/locations/coimbatore");
const image = ogImage("/images/chamber.webp");

const faqs: FAQItem[] = [
  {
    question: "Where is CCTL's Coimbatore laboratory?",
    answer:
      "CCTL Coimbatore is located at Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu – 641048. Contact: +91 97909 01184 / kovaiemc@cosmictestlab.com.",
  },
  {
    question: "What EMC testing is available in Coimbatore?",
    answer:
      "The Coimbatore laboratory provides full EMI/EMC testing including conducted and radiated emissions, conducted and radiated immunity, ESD, EFT/burst, surge, automotive testing (CISPR 25, ISO 11452), military testing (MIL-STD-461), civilian testing (IEC 61000), railway (EN 50121), and EMC pre-compliance testing.",
  },
  {
    question: "Is the Coimbatore lab NABL accredited?",
    answer:
      "Yes. CCTL Coimbatore is fully NABL accredited and ISO/IEC 17025:2017 certified. It is also recognised as a Designated Test Facility.",
  },
  {
    question: "What are the Coimbatore lab's operating hours?",
    answer:
      "CCTL Coimbatore operates Monday to Saturday, 24 hours a day. Contact +91 97909 01184 or kovaiemc@cosmictestlab.com for scheduling.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Locations", path: "/contact" },
  { name: "Coimbatore", path: "/locations/coimbatore" },
]);

const locationSchema = localBusinessSchema(loc);

export const Route = createFileRoute("/locations/coimbatore")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing lab Coimbatore, EMI testing Coimbatore, NABL accredited lab Coimbatore, EMC lab Tamil Nadu, electromagnetic compatibility testing Coimbatore, CCTL Coimbatore address",
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
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Coimbatore" },
      { name: "geo.position", content: `${loc.coords.lat};${loc.coords.lng}` },
      { name: "ICBM", content: `${loc.coords.lat}, ${loc.coords.lng}` },
      { "script:ld+json": locationSchema },
      { "script:ld+json": faqSchema(faqs) },
      { "script:ld+json": breadcrumbs },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "preload", as: "image", href: "/images/chamber.webp" },
    ],
  }),
  component: LocationCoimbatore,
});
