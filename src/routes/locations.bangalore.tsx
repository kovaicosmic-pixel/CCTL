import { createFileRoute } from "@tanstack/react-router";
import LocationBangalore from "@/site/pages/LocationBangalore";
import { company } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
  type FAQItem,
} from "@/site/data/seo";

const loc = company.locations.find((l) => l.id === "bangalore")!;

const title = "EMC Testing Laboratory in Bangalore | CCTL";
const description =
  "CCTL Bangalore — NABL accredited, ISO/IEC 17025 certified EMI/EMC testing laboratory in Bangalore, Karnataka. Automotive, defence, railway, telecom and civilian EMC testing. Call +91 94442 72009.";
const url = canonical("/locations/bangalore");
const image = ogImage("/images/explore/Labcivil.webp");

const faqs: FAQItem[] = [
  {
    question: "Where is CCTL's Bangalore laboratory?",
    answer:
      "CCTL Bangalore is located at Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk, Bangalore – 560099. Contact: +91 94442 72009 / emc@cosmictestlab.com.",
  },
  {
    question: "What EMC testing is available in Bangalore?",
    answer:
      "The Bangalore laboratory provides full EMI/EMC testing including conducted and radiated emissions, immunity testing, ESD, EFT/burst, surge, automotive testing (CISPR 25, ISO 11452), military testing (MIL-STD-461), civilian testing (IEC 61000), railway (EN 50121), and EMC pre-compliance testing.",
  },
  {
    question: "Is the Bangalore lab NABL accredited?",
    answer:
      "Yes. CCTL Bangalore is fully NABL accredited and ISO/IEC 17025:2017 certified. It is a recognised Designated Test Facility.",
  },
  {
    question: "What are the Bangalore lab's operating hours?",
    answer:
      "CCTL Bangalore operates Monday to Saturday, 24 hours a day. Contact +91 94442 72009 or emc@cosmictestlab.com for scheduling.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Locations", path: "/contact" },
  { name: "Bangalore", path: "/locations/bangalore" },
]);

const locationSchema = localBusinessSchema(loc);

export const Route = createFileRoute("/locations/bangalore")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing lab Bangalore, EMI testing Bangalore, NABL accredited lab Bangalore, EMC lab Karnataka, electromagnetic compatibility testing Bangalore, CCTL Bangalore address, EMC lab Bommasandra",
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
      { name: "geo.region", content: "IN-KA" },
      { name: "geo.placename", content: "Bangalore" },
      { name: "geo.position", content: `${loc.coords.lat};${loc.coords.lng}` },
      { name: "ICBM", content: `${loc.coords.lat}, ${loc.coords.lng}` },
      { "script:ld+json": locationSchema },
      { "script:ld+json": faqSchema(faqs) },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: LocationBangalore,
});
