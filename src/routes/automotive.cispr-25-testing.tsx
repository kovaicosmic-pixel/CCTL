import { createFileRoute } from "@tanstack/react-router";
import Cispr25Testing from "@/site/pages/Cispr25Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "CISPR 25 Testing | Automotive EMC Testing | CCTL";
const description =
  "CISPR 25 radio disturbance testing for automotive components at CCTL's Coimbatore and Bangalore laboratories, covering conducted and radiated emission evaluation.";
const url = canonical("/automotive/cispr-25-testing");
const image = ogImage("/images/automotive.webp");

const faqs: FAQItem[] = [
  {
    question: "What is CISPR 25 testing?",
    answer:
      "CISPR 25 testing measures radio disturbance characteristics of electrical and electronic components intended for use in vehicles. It evaluates both conducted and radiated emissions from automotive components to ensure they do not interfere with onboard receivers.",
  },
  {
    question: "Which automotive components require CISPR 25 testing?",
    answer:
      "CISPR 25 applies to electronic control modules, automotive electronic sub-assemblies, vehicle wiring harnesses, and other electrical components intended for use in vehicles. OEMs typically specify CISPR 25 as part of their component approval requirements.",
  },
  {
    question: "What does CCTL test under CISPR 25?",
    answer:
      "CCTL evaluates conducted emissions (disturbances on power and signal lines) and radiated emissions (electromagnetic energy radiated by the component and its test configuration) against the limits specified in CISPR 25.",
  },
  {
    question: "Where is CISPR 25 testing available in India?",
    answer:
      "Cosmic Compliance Test Lab (CCTL) provides CISPR 25 testing at its laboratories in Coimbatore (Tamil Nadu) and Bangalore (Karnataka), India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Automotive EMC Testing", path: "/services/automotive" },
  { name: "CISPR 25 Testing", path: "/automotive/cispr-25-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "CISPR 25 Testing",
  description,
  path: "/automotive/cispr-25-testing",
  image: "/images/automotive.webp",
});

export const Route = createFileRoute("/automotive/cispr-25-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "CISPR 25 testing India, CISPR 25 automotive EMC, automotive component radio disturbance testing, CISPR 25 lab Coimbatore, CISPR 25 lab Bangalore, conducted emissions automotive, radiated emissions automotive testing",
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
  component: Cispr25Testing,
});
