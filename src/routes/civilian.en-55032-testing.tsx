import { createFileRoute } from "@tanstack/react-router";
import En55032Testing from "@/site/pages/En55032Testing";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "EN 55032 Testing | Multimedia Equipment EMC | CCTL";
const description =
  "EN 55032 emission testing for multimedia equipment at CCTL, evaluating conducted and radiated emissions against applicable CISPR 32/EN 55032 requirements.";
const url = canonical("/civilian/en-55032-testing");
const image = ogImage("/images/civilian/IMG_20240418_175038.webp");

const faqs: FAQItem[] = [
  {
    question: "What is EN 55032 testing?",
    answer:
      "EN 55032 is the European standard for electromagnetic disturbance characteristics of multimedia equipment. It is based on CISPR 32 and specifies emission limits and measurement methods for conducted and radiated emissions from multimedia equipment.",
  },
  {
    question: "What types of equipment does EN 55032 cover?",
    answer:
      "EN 55032 covers multimedia equipment including information technology equipment, audio/video equipment, entertainment equipment, and related systems. It replaced the earlier EN 55022 and EN 55013 standards.",
  },
  {
    question: "What is the difference between Class A and Class B in EN 55032?",
    answer:
      "Class B limits are stricter and apply to equipment intended for residential environments. Class A limits apply to equipment intended for commercial and industrial environments where more relaxed limits are acceptable.",
  },
  {
    question: "Where is EN 55032 testing available in India?",
    answer:
      "CCTL provides EN 55032 / CISPR 32 emission testing at its laboratories in Coimbatore and Bangalore, India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Civilian Domain", path: "/services/civilian" },
  { name: "EN 55032 Testing", path: "/civilian/en-55032-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EN 55032 Testing",
  description,
  path: "/civilian/en-55032-testing",
  image: "/images/civilian/IMG_20240418_175038.webp",
});

export const Route = createFileRoute("/civilian/en-55032-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EN 55032 testing India, CISPR 32 testing, multimedia equipment EMC testing, information technology EMC testing India, EN 55032 Class B testing, radiated emissions multimedia, EN 55032 lab India",
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
  component: En55032Testing,
});
