import { createFileRoute } from "@tanstack/react-router";
import RailwayEmcTesting from "@/site/pages/RailwayEmcTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "Railway EMC Testing Laboratory in India | CCTL";
const description =
  "Railway EMC testing for rolling stock, signalling and fixed installations at CCTL's Coimbatore and Bangalore laboratories, covering emissions and immunity evaluation.";
const url = canonical("/railway/railway-emc-testing");
const image = ogImage("/images/railway/Radiated-Emission-test-1-4-scaled-1.webp");

const faqs: FAQItem[] = [
  {
    question: "What is railway EMC testing?",
    answer:
      "Railway EMC testing evaluates electromagnetic emissions and immunity for railway equipment and systems. It ensures rolling stock, signalling equipment, trackside installations, and associated electronics operate compatibly within the railway electromagnetic environment.",
  },
  {
    question: "Which standards apply to railway EMC testing?",
    answer:
      "EN 50121 is the primary European railway EMC standard series. It covers the railway environment and specifies emission and immunity requirements for rolling stock, fixed installations, signalling and telecommunications equipment. CCTL provides railway EMC testing against applicable EN 50121 requirements.",
  },
  {
    question: "What railway products require EMC testing?",
    answer:
      "Rolling stock (trains, trams, metro), trackside signalling equipment, railway control systems, power supply equipment, and other electrical and electronic systems used in railway environments may require EMC testing.",
  },
  {
    question: "Where is railway EMC testing available in India?",
    answer:
      "CCTL provides railway EMC testing at its NABL accredited laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka, India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Railway Domain", path: "/services/railway" },
  { name: "Railway EMC Testing", path: "/railway/railway-emc-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "Railway EMC Testing",
  description,
  path: "/railway/railway-emc-testing",
  image: "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
});

export const Route = createFileRoute("/railway/railway-emc-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "railway EMC testing India, EN 50121 testing India, railway EMI testing, rolling stock EMC testing, railway signalling EMC, railway EMC lab Coimbatore Bangalore, train EMC testing India",
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
  component: RailwayEmcTesting,
});
