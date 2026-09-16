import { createFileRoute } from "@tanstack/react-router";
import EmcPreComplianceTesting from "@/site/pages/EmcPreComplianceTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EMC Pre-Compliance Testing Laboratory in India | CCTL";
const description =
  "EMC pre-compliance testing from CCTL to identify potential issues early in the design cycle, reducing rework and supporting smoother formal compliance testing.";
const url = canonical("/services/emc-pre-compliance-testing");
const image = ogImage("/images/explore/BCI_setup.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EMC pre-compliance testing?",
    answer:
      "EMC pre-compliance testing is a non-formal evaluation performed during product development to identify potential electromagnetic compatibility issues before formal compliance testing. It helps manufacturers find and fix problems early, reducing rework costs and time-to-market.",
  },
  {
    question: "How is pre-compliance testing different from formal compliance testing?",
    answer:
      "Formal compliance testing is performed against defined standards to generate documented test results for regulatory or customer submission. Pre-compliance testing is used during development to investigate EMC behaviour and identify issues — it is not used for market approval or certification.",
  },
  {
    question: "When should I do pre-compliance testing?",
    answer:
      "Pre-compliance testing is most valuable during product development, before finalizing PCB layout or enclosure design, and after any significant engineering change. Identifying issues early is significantly less costly than discovering them during formal compliance testing.",
  },
  {
    question: "What does CCTL check during pre-compliance testing?",
    answer:
      "CCTL can perform applicable emission measurements, immunity checks, and investigation of specific EMC concerns based on the product and the customer's requirements. The scope is agreed based on the product's development stage and applicable standards.",
  },
  {
    question: "Can pre-compliance test results be used for product approval?",
    answer:
      "No. Pre-compliance testing is an engineering investigation tool, not a formal certification activity. Products requiring regulatory approval or customer compliance evidence must go through formal compliance testing.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "EMC Pre-Compliance Testing", path: "/services/emc-pre-compliance-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EMC Pre-Compliance Testing",
  description,
  path: "/services/emc-pre-compliance-testing",
  image: "/images/explore/BCI_setup.webp",
});

export const Route = createFileRoute("/services/emc-pre-compliance-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC pre-compliance testing India, pre-compliance EMC lab India, EMC pre-scan testing, early stage EMC testing, EMC design verification testing Coimbatore Bangalore, reduce EMC failures India",
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
  component: EmcPreComplianceTesting,
});
