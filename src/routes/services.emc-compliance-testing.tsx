import { createFileRoute } from "@tanstack/react-router";
import EmcComplianceTesting from "@/site/pages/EmcComplianceTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EMC Compliance Testing Laboratory in India | CCTL";
const description =
  "EMC compliance testing services from CCTL to evaluate products against applicable EMC requirements, with laboratories in Coimbatore and Bangalore, India.";
const url = canonical("/services/emc-compliance-testing");
const image = ogImage("/images/explore/control_room.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EMC compliance testing?",
    answer:
      "EMC compliance testing evaluates whether a product meets the applicable electromagnetic compatibility requirements defined by the relevant standard or specification, for its intended application and market.",
  },
  {
    question: "How do I know which EMC standard applies to my product?",
    answer:
      "The applicable standard depends on the product type, application, operating environment, target market, and other factors. CCTL can discuss the requirement based on the product information provided.",
  },
  {
    question: "What happens if my product does not pass EMC testing?",
    answer:
      "If test results fall outside the applicable limit, the next step is to investigate the source and address the issue through engineering changes, then re-test. CCTL can help identify the issue from the test data.",
  },
  {
    question: "Does passing EMC testing mean I have regulatory approval?",
    answer:
      "No. EMC test results are one part of the overall compliance process. Regulatory requirements and certification/market-access obligations depend on the product and target market.",
  },
  {
    question: "Can I test a prototype for EMC compliance?",
    answer:
      "Yes. Pre-production or prototype testing can identify EMC issues before final production, helping reduce costly rework. The suitability of the prototype for formal compliance should be discussed with CCTL.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "EMC Compliance Testing", path: "/services/emc-compliance-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EMC Compliance Testing",
  description,
  path: "/services/emc-compliance-testing",
  image: "/images/explore/control_room.webp",
});

export const Route = createFileRoute("/services/emc-compliance-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC compliance testing India, EMC compliance lab Coimbatore, EMC compliance lab Bangalore, electromagnetic compatibility compliance, CE marking EMC testing India, product EMC certification India",
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
  component: EmcComplianceTesting,
});
