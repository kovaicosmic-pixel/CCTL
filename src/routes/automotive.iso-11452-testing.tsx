import { createFileRoute } from "@tanstack/react-router";
import Iso11452Testing from "@/site/pages/Iso11452Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "ISO 11452 Testing | Automotive EMC Testing | CCTL";
const description =
  "ISO 11452 immunity testing for automotive components at CCTL, evaluating component response to radiated and conducted RF disturbances.";
const url = canonical("/automotive/iso-11452-testing");
const image = ogImage("/images/automotive.webp");

const faqs: FAQItem[] = [
  {
    question: "What is ISO 11452 testing?",
    answer:
      "ISO 11452 is a series of automotive EMC standards that specify immunity test methods for electrical and electronic components in road vehicles. It evaluates how automotive components perform when exposed to electromagnetic disturbances.",
  },
  {
    question: "What test methods are covered under ISO 11452?",
    answer:
      "ISO 11452 includes methods such as bulk current injection (BCI), RF immunity using a stripline, TEM cell, RF immunity in a shielded room, and others. The applicable method depends on the component and OEM requirement.",
  },
  {
    question: "Who needs ISO 11452 testing?",
    answer:
      "Manufacturers of automotive electronic components, sub-assemblies, and electronic control units (ECUs) that are specified by an OEM or system integrator to meet ISO 11452 requirements.",
  },
  {
    question: "Where can I get ISO 11452 testing done in India?",
    answer:
      "CCTL provides ISO 11452 automotive immunity testing at laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Automotive EMC Testing", path: "/services/automotive" },
  { name: "ISO 11452 Testing", path: "/automotive/iso-11452-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "ISO 11452 Testing",
  description,
  path: "/automotive/iso-11452-testing",
  image: "/images/automotive.webp",
});

export const Route = createFileRoute("/automotive/iso-11452-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "ISO 11452 testing India, ISO 11452 automotive immunity, automotive RF immunity testing, BCI testing automotive, bulk current injection testing, automotive component immunity India, ISO 11452 lab Coimbatore Bangalore",
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
    links: [
      { rel: "canonical", href: url },
      { rel: "preload", as: "image", href: "/images/automotive.webp" },
    ],
  }),
  component: Iso11452Testing,
});
