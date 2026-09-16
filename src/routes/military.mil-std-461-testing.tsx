import { createFileRoute } from "@tanstack/react-router";
import MilStd461Testing from "@/site/pages/MilStd461Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "MIL-STD-461 Testing Laboratory in India | CCTL";
const description =
  "MIL-STD-461 EMI emission and susceptibility testing for military and aerospace equipment at CCTL's Coimbatore and Bangalore laboratories.";
const url = canonical("/military/mil-std-461-testing");
const image = ogImage("/images/mil-aero/WhatsApp Image 2024-04-23 at 5.30.59 PM (1).webp");

const faqs: FAQItem[] = [
  {
    question: "What is MIL-STD-461 testing?",
    answer:
      "MIL-STD-461 is a US Department of Defense standard that specifies requirements and verification methods for controlling electromagnetic interference (EMI) characteristics of electronic, electrical and electromechanical equipment. It covers conducted and radiated emissions and susceptibility testing.",
  },
  {
    question: "What test methods does MIL-STD-461 include?",
    answer:
      "MIL-STD-461 includes methods such as CE101, CE102, CE106 (conducted emissions), RE101, RE102, RE103 (radiated emissions), CS101, CS114, CS115, CS116, CS118 (conducted susceptibility), and RS101 (radiated susceptibility). The applicable test matrix is determined by the equipment and platform requirement.",
  },
  {
    question: "Which products require MIL-STD-461 testing?",
    answer:
      "Electronic, electrical and electromechanical equipment and subsystems intended for military and defence programmes typically require MIL-STD-461 testing. This includes equipment for ground, shipboard, aircraft, submarine and space applications.",
  },
  {
    question: "Does CCTL provide MIL-STD-461 testing in India?",
    answer:
      "Yes. CCTL provides applicable MIL-STD-461 testing at its laboratories in Coimbatore and Bangalore. CCTL is NABL accredited and ISO/IEC 17025:2017 certified.",
  },
  {
    question: "What is the difference between RE102 and CE102?",
    answer:
      "RE102 measures radiated electromagnetic emissions from the equipment between 2 MHz and 18 GHz (or higher). CE102 measures conducted emissions on power leads from 10 kHz to 10 MHz. Both are emission measurement methods under MIL-STD-461.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "MIL / AERO Domain", path: "/services/mil-aero" },
  { name: "MIL-STD-461 Testing", path: "/military/mil-std-461-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "MIL-STD-461 Testing",
  description,
  path: "/military/mil-std-461-testing",
  image: "/images/mil-aero/WhatsApp Image 2024-04-23 at 5.30.59 PM (1).webp",
});

export const Route = createFileRoute("/military/mil-std-461-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "MIL-STD-461 testing India, MIL-STD-461 laboratory, military EMC testing India, defence EMC testing, RE102 testing India, CE102 testing, CS114 testing, military EMI testing Coimbatore Bangalore, NABL MIL-STD-461",
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
  component: MilStd461Testing,
});
