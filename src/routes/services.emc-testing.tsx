import { createFileRoute } from "@tanstack/react-router";
import EmcTesting from "@/site/pages/EmcTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EMC Testing Laboratory in Coimbatore & Bangalore | CCTL";
const description =
  "EMC testing services from CCTL covering electromagnetic emissions and immunity evaluation for automotive, defence, railway, telecom and civilian products in Coimbatore and Bangalore, India.";
const url = canonical("/services/emc-testing");
const image = ogImage("/images/chamber.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EMC testing?",
    answer:
      "EMC (Electromagnetic Compatibility) testing evaluates how electrical and electronic equipment interacts with its electromagnetic environment. It covers both emissions (what the device radiates) and immunity (how well it resists external interference).",
  },
  {
    question: "Why is EMC testing required?",
    answer:
      "EMC testing helps identify electromagnetic interference issues, evaluate product emissions, assess immunity to disturbances, and support applicable regulatory and industry requirements. It is required before products can be placed on many markets.",
  },
  {
    question: "What types of EMC tests are performed at CCTL?",
    answer:
      "CCTL performs conducted and radiated emissions testing, radiated and conducted immunity, ESD, EFT/burst, surge, and EMC pre-compliance testing across automotive, defence, railway, telecom and civilian applications.",
  },
  {
    question: "How long does EMC testing take?",
    answer:
      "Duration depends on the product, applicable standard, and number of required tests. Simple products may take 2–3 days; complex military or automotive systems may require 1–2 weeks. CCTL operates 24×6 for urgent projects.",
  },
  {
    question: "Where are CCTL's EMC testing laboratories?",
    answer:
      "CCTL has laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka. Both are NABL accredited and ISO/IEC 17025:2017 certified.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "EMC Testing", path: "/services/emc-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EMC Testing",
  description,
  path: "/services/emc-testing",
  image: "/images/chamber.webp",
});

export const Route = createFileRoute("/services/emc-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing India, EMC testing lab Coimbatore, EMC testing lab Bangalore, electromagnetic compatibility testing, EMC lab India, NABL EMC testing, EMC compliance testing India, EMC test services India",
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
      { rel: "preload", as: "image", href: "/images/chamber.webp" },
    ],
  }),
  component: EmcTesting,
});
