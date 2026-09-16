import { createFileRoute } from "@tanstack/react-router";
import Iec61000Testing from "@/site/pages/Iec61000Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "IEC 61000 Testing | Civilian EMC Testing | CCTL";
const description =
  "IEC 61000 immunity and power-quality testing at CCTL, covering ESD, radiated RF, EFT/burst, surge, conducted RF and voltage dip evaluation.";
const url = canonical("/civilian/iec-61000-testing");
const image = ogImage("/images/civilian/IMG_20240418_173040.webp");

const faqs: FAQItem[] = [
  {
    question: "What is IEC 61000 testing?",
    answer:
      "IEC 61000 is a series of international standards covering electromagnetic compatibility. The immunity part (IEC 61000-4 series) specifies test methods for evaluating equipment resistance to electromagnetic disturbances including ESD, EFT/burst, surge, radiated RF, and conducted RF.",
  },
  {
    question: "What IEC 61000 tests does CCTL provide?",
    answer:
      "CCTL provides IEC 61000-4 series immunity tests including ESD (IEC 61000-4-2), radiated RF immunity (IEC 61000-4-3), electrical fast transient/burst (IEC 61000-4-4), surge (IEC 61000-4-5), conducted RF immunity (IEC 61000-4-6), and voltage dips and interruptions (IEC 61000-4-11).",
  },
  {
    question: "Which products require IEC 61000 immunity testing?",
    answer:
      "Electrical and electronic equipment intended for industrial, commercial, residential, and institutional environments typically requires IEC 61000 immunity testing. This includes industrial equipment, consumer electronics, medical devices, and commercial appliances depending on the applicable product standard.",
  },
  {
    question: "Is IEC 61000 testing the same as CE marking testing?",
    answer:
      "IEC 61000 standards form part of the test suite required for CE marking in the European market, but CE marking also requires other assessments. IEC 61000-4 immunity tests are referenced by product-specific standards that define the applicable immunity requirements for CE compliance.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Civilian Domain", path: "/services/civilian" },
  { name: "IEC 61000 Testing", path: "/civilian/iec-61000-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "IEC 61000 Testing",
  description,
  path: "/civilian/iec-61000-testing",
  image: "/images/civilian/IMG_20240418_173040.webp",
});

export const Route = createFileRoute("/civilian/iec-61000-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "IEC 61000 testing India, IEC 61000-4 immunity testing, ESD testing India, EFT testing, surge testing India, radiated immunity testing, conducted immunity testing, IEC 61000 lab Coimbatore Bangalore",
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
  component: Iec61000Testing,
});
