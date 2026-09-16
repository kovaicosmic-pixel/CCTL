import { createFileRoute } from "@tanstack/react-router";
import Standards from "@/site/pages/Standards";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
  faqSchema,
  type FAQItem,
} from "@/site/data/seo";

const title = "EMC Testing Standards | CISPR 25, MIL-STD-461, IEC 61000 | CCTL";
const description =
  "CCTL supports CISPR 25, ISO 11452, MIL-STD-461, MIL-STD-704, IEC 61000, CISPR, EN 55032, EN 50121, and telecom/wireless EMC standards. Find detailed testing information for each standard.";
const url = canonical("/standards");

const faqs: FAQItem[] = [
  {
    question: "Which EMC standards does CCTL support?",
    answer:
      "CCTL supports CISPR 25 and ISO 11452 (automotive), MIL-STD-461 and MIL-STD-704 (military/aerospace), CISPR 11/22/32, IEC 61000 series and EN 55032 (civilian/industrial), EN 50121 (railway), and applicable telecom/wireless EMC requirements. Testing capability is confirmed by CCTL's current NABL accreditation scope.",
  },
  {
    question: "How do I know which EMC standard applies to my product?",
    answer:
      "The applicable standard depends on your product type, intended application, operating environment, industry sector, and target market. For example: automotive components typically require CISPR 25 or ISO 11452; defence equipment typically requires MIL-STD-461; civilian electronics may require IEC 61000 and CISPR standards. Contact CCTL to discuss your specific product.",
  },
  {
    question: "Does CCTL test to all revisions of a standard?",
    answer:
      "The applicable revision depends on the test requirement specified by your customer or regulatory body. CCTL can discuss which revision is required for your specific product and programme when you provide the test requirement details.",
  },
  {
    question: "Can CCTL test to customer-specific EMC requirements?",
    answer:
      "CCTL can discuss customer-specific EMC test requirements based on the test methods and equipment involved. Contact CCTL with the specific requirement document and product details to determine whether testing can be accommodated.",
  },
];

// ItemList schema linking all standard-specific pages
const standardsItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/standards#list`,
  name: "EMC Testing Standards at CCTL",
  description,
  url: canonical("/standards"),
  numberOfItems: 11,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CISPR 25 Testing", url: canonical("/automotive/cispr-25-testing") },
    { "@type": "ListItem", position: 2, name: "ISO 11452 Testing", url: canonical("/automotive/iso-11452-testing") },
    { "@type": "ListItem", position: 3, name: "MIL-STD-461 Testing", url: canonical("/military/mil-std-461-testing") },
    { "@type": "ListItem", position: 4, name: "MIL-STD-704 Testing", url: canonical("/military/mil-std-704-testing") },
    { "@type": "ListItem", position: 5, name: "CISPR Testing", url: canonical("/civilian/cispr-testing") },
    { "@type": "ListItem", position: 6, name: "IEC 61000 Testing", url: canonical("/civilian/iec-61000-testing") },
    { "@type": "ListItem", position: 7, name: "EN 55032 Testing", url: canonical("/civilian/en-55032-testing") },
    { "@type": "ListItem", position: 8, name: "Railway EMC Testing", url: canonical("/railway/railway-emc-testing") },
    { "@type": "ListItem", position: 9, name: "EN 50121 Testing", url: canonical("/railway/en-50121-testing") },
    { "@type": "ListItem", position: 10, name: "Telecom EMC Testing", url: canonical("/telecom/telecom-emc-testing") },
    { "@type": "ListItem", position: 11, name: "Wireless Testing", url: canonical("/telecom/wireless-testing") },
  ],
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Standards", path: "/standards" },
]);

export const Route = createFileRoute("/standards/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC standards India, CISPR 25 testing, MIL-STD-461 testing, IEC 61000 testing, EN 50121 testing, ISO 11452 testing, EN 55032 testing, EMC standard list India, EMC testing standards CCTL",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { "script:ld+json": standardsItemList },
      { "script:ld+json": faqSchema(faqs) },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: Standards,
});
