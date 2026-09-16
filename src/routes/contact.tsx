import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/site/pages/Contact";
import { company } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
  type FAQItem,
} from "@/site/data/seo";

const title =
  "Contact CCTL | EMI/EMC Testing Labs in Coimbatore & Bangalore, India";
const description =
  "Contact Cosmic Compliance Test Lab for EMI/EMC testing services in Coimbatore and Bangalore, India. Get quotes for automotive, defence, railway & telecom EMC compliance testing. Call +91 94442 72009.";

const contactFaqs: FAQItem[] = [
  {
    question: "How do I request EMC testing from CCTL?",
    answer:
      "Contact CCTL by email at emc@cosmictestlab.com or call +91 94442 72009 (Bangalore) / +91 97909 01184 (Coimbatore). Share your product details, applicable standard, and testing requirements and our team will review and guide you on the next steps.",
  },
  {
    question: "Where is CCTL's Coimbatore laboratory?",
    answer:
      "CCTL Coimbatore is located at Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu – 641048. Contact: +91 97909 01184 / kovaiemc@cosmictestlab.com.",
  },
  {
    question: "Where is CCTL's Bangalore laboratory?",
    answer:
      "CCTL Bangalore is located at Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk, Bangalore – 560099. Contact: +91 94442 72009 / emc@cosmictestlab.com.",
  },
  {
    question: "What are CCTL's laboratory operating hours?",
    answer:
      "CCTL laboratories operate Monday to Saturday, 24 hours a day (24×6). For urgent or time-critical projects, contact us to discuss scheduling options.",
  },
  {
    question: "How long does it take to get a quote for EMC testing?",
    answer:
      "Typically CCTL responds to testing enquiries within one business day. Send your product details, applicable standard, and required test scope to emc@cosmictestlab.com for the fastest response.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const locationsLd = company.locations.map((loc) => localBusinessSchema(loc));

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "contact EMC testing lab, EMC lab Coimbatore contact, EMC lab Bangalore contact, EMI testing quote India, CCTL address, EMC testing appointment, EMC lab phone number India",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/contact") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Coimbatore" },
      { name: "geo.position", content: "11.0168;76.9558" },
      { "script:ld+json": locationsLd[0] },
      { "script:ld+json": locationsLd[1] },
      { "script:ld+json": faqSchema(contactFaqs) },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/contact") }],
  }),
  component: Contact,
});
