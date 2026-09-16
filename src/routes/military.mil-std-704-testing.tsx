import { createFileRoute } from "@tanstack/react-router";
import MilStd704Testing from "@/site/pages/MilStd704Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "MIL-STD-704 Testing | Aircraft Power Compatibility | CCTL";
const description =
  "MIL-STD-704 aircraft electrical power compatibility testing at CCTL, evaluating equipment response to specified aircraft power characteristics.";
const url = canonical("/military/mil-std-704-testing");
const image = ogImage();

const faqs: FAQItem[] = [
  {
    question: "What is MIL-STD-704 testing?",
    answer:
      "MIL-STD-704 is a US military standard that specifies the characteristics of aircraft electrical power and the requirements that aircraft electrical equipment must meet to be compatible with those power characteristics.",
  },
  {
    question: "What does MIL-STD-704 testing evaluate?",
    answer:
      "MIL-STD-704 testing evaluates equipment response to aircraft power conditions including steady-state voltage and frequency, transients, interruptions, and abnormal power conditions as specified in the standard.",
  },
  {
    question: "Which products need MIL-STD-704 testing?",
    answer:
      "Electrical and electronic equipment designed to operate from aircraft electrical power systems typically requires MIL-STD-704 testing. This includes avionics, aircraft subsystems, and other electrical equipment powered from aircraft buses.",
  },
  {
    question: "Does CCTL provide MIL-STD-704 testing in India?",
    answer:
      "Yes. CCTL provides MIL-STD-704 aircraft power compatibility testing at its laboratories in Coimbatore and Bangalore, India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "MIL / AERO Domain", path: "/services/mil-aero" },
  { name: "MIL-STD-704 Testing", path: "/military/mil-std-704-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "MIL-STD-704 Testing",
  description,
  path: "/military/mil-std-704-testing",
});

export const Route = createFileRoute("/military/mil-std-704-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "MIL-STD-704 testing India, aircraft power compatibility testing, MIL-STD-704 lab India, avionics power testing, aircraft electrical power testing Coimbatore Bangalore",
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
  component: MilStd704Testing,
});
