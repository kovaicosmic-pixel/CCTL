import { createFileRoute } from "@tanstack/react-router";
import TelecomEmcTesting from "@/site/pages/TelecomEmcTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "Telecom EMC Testing Laboratory in India | CCTL";
const description =
  "EMC testing for telecom and communication equipment at CCTL's Coimbatore and Bangalore laboratories, covering emissions and immunity evaluation.";
const url = canonical("/telecom/telecom-emc-testing");
const image = ogImage("/images/telecom-wireless/DSC08114.webp");

const faqs: FAQItem[] = [
  {
    question: "What is telecom EMC testing?",
    answer:
      "Telecom EMC testing evaluates electromagnetic emissions and immunity for telecommunication and communication equipment. It ensures that telecom devices operate without causing harmful interference and can withstand electromagnetic disturbances in their intended environment.",
  },
  {
    question: "Which standards apply to telecom EMC testing?",
    answer:
      "Applicable standards depend on the product type and target market. Common standards for telecom EMC include ETSI EN standards, CISPR 22/32 for information technology equipment, IEC 61000 series immunity standards, and country-specific requirements such as TEC (India) or CE/FCC (Europe/USA).",
  },
  {
    question: "What telecom products require EMC testing?",
    answer:
      "Telecommunication terminals, networking equipment, routers, switches, modems, VoIP equipment, base station equipment, and other communication devices may require EMC testing depending on the applicable regulations and market requirements.",
  },
  {
    question: "Does telecom EMC testing include RF testing?",
    answer:
      "EMC testing and RF regulatory testing are separate. EMC testing covers electromagnetic emissions and immunity. RF testing covers transmitter characteristics, spurious emissions, and regulatory approvals for radio devices. CCTL can discuss the applicable requirements for your specific equipment.",
  },
  {
    question: "Where is telecom EMC testing available in India?",
    answer:
      "CCTL provides telecom EMC testing at its NABL accredited laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Telecom & Wireless Domain", path: "/services/telecom-wireless" },
  { name: "Telecom EMC Testing", path: "/telecom/telecom-emc-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "Telecom EMC Testing",
  description,
  path: "/telecom/telecom-emc-testing",
  image: "/images/telecom-wireless/DSC08114.webp",
});

export const Route = createFileRoute("/telecom/telecom-emc-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "telecom EMC testing India, telecom EMI testing, communication equipment EMC testing, ETSI testing India, TEC certification testing India, networking equipment EMC, telecom EMC lab Coimbatore Bangalore",
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
  component: TelecomEmcTesting,
});
