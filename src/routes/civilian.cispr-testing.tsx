import { createFileRoute } from "@tanstack/react-router";
import CisprTesting from "@/site/pages/CisprTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "CISPR Testing | Civilian EMC Testing | CCTL";
const description =
  "CISPR radio disturbance emission testing for civilian and commercial products at CCTL's laboratories in Coimbatore and Bangalore, India.";
const url = canonical("/civilian/cispr-testing");
const image = ogImage("/images/civilianDomain.webp");

const faqs: FAQItem[] = [
  {
    question: "What is CISPR testing?",
    answer:
      "CISPR testing refers to electromagnetic emission testing conducted according to standards published by the International Special Committee on Radio Interference (CISPR). These standards specify limits and measurement methods for radio disturbance characteristics of electrical and electronic equipment.",
  },
  {
    question: "Which CISPR standards does CCTL support?",
    answer:
      "CCTL supports applicable CISPR standards within its accreditation scope including CISPR 11 (industrial, scientific and medical equipment), CISPR 22/32 (information technology and multimedia equipment), and CISPR 25 (automotive components).",
  },
  {
    question: "What types of products require CISPR testing?",
    answer:
      "Consumer electronics, information technology equipment, multimedia equipment, industrial equipment, household appliances, and other electrical and electronic products may require CISPR testing depending on the applicable market and regulatory requirements.",
  },
  {
    question: "Where is CISPR testing available in India?",
    answer:
      "CCTL provides CISPR emission testing at its NABL accredited laboratories in Coimbatore, Tamil Nadu and Bangalore, Karnataka.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Civilian Domain", path: "/services/civilian" },
  { name: "CISPR Testing", path: "/civilian/cispr-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "CISPR Testing",
  description,
  path: "/civilian/cispr-testing",
  image: "/images/civilianDomain.webp",
});

export const Route = createFileRoute("/civilian/cispr-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "CISPR testing India, CISPR 11 testing, CISPR 22 testing, CISPR 32 testing, civilian EMC testing India, radio disturbance testing, conducted emissions testing India, CISPR lab Coimbatore Bangalore",
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
      { rel: "preload", as: "image", href: "/images/civilianDomain.webp" },
    ],
  }),
  component: CisprTesting,
});
