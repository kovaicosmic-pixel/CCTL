import { createFileRoute } from "@tanstack/react-router";
import WirelessTesting from "@/site/pages/WirelessTesting";
import { canonical, ogImage, breadcrumbSchema, professionalServiceSchema, faqSchema, type FAQItem } from "@/site/data/seo";

const title = "Wireless & RF Testing | Telecom EMC Testing | CCTL";
const description =
  "Wireless and RF testing for Wi-Fi, Bluetooth and connected devices at CCTL, evaluating applicable regulatory and compliance requirements.";
const url = canonical("/telecom/wireless-testing");
const image = ogImage("/images/domain-telecom.webp");

const faqs: FAQItem[] = [
  {
    question: "What is wireless testing?",
    answer:
      "Wireless testing evaluates the electromagnetic characteristics of wireless devices including transmitter performance, frequency accuracy, spurious emissions, and in some cases regulatory compliance requirements for the target market.",
  },
  {
    question: "What wireless technologies does CCTL test?",
    answer:
      "CCTL can discuss wireless testing requirements for Wi-Fi, Bluetooth, and other connected device technologies based on the applicable regulatory or customer requirement.",
  },
  {
    question: "Is wireless testing the same as WPC approval?",
    answer:
      "Wireless testing at a test laboratory and WPC (Wireless Planning & Coordination) approval are different. WPC type approval is the Indian regulatory approval for radio devices. Testing at CCTL can provide technical evidence required for WPC and other regulatory submissions, but the approval itself is granted by the regulatory authority.",
  },
  {
    question: "What information is needed to plan wireless testing?",
    answer:
      "To plan wireless testing, CCTL needs the product description, wireless technology, operating frequency/bands, maximum transmit power, antenna details, wireless operating modes, and the target regulatory market or applicable standard.",
  },
  {
    question: "Where is wireless testing available in India?",
    answer:
      "CCTL provides wireless and RF testing at its laboratories in Coimbatore and Bangalore, India.",
  },
];

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Telecom & Wireless Domain", path: "/services/telecom-wireless" },
  { name: "Telecom EMC Testing", path: "/telecom/telecom-emc-testing" },
  { name: "Wireless Testing", path: "/telecom/wireless-testing" },
]);

const serviceSchema = professionalServiceSchema({
  name: "Wireless Testing",
  description,
  path: "/telecom/wireless-testing",
  image: "/images/domain-telecom.webp",
});

export const Route = createFileRoute("/telecom/wireless-testing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "wireless testing India, RF testing India, Wi-Fi testing India, Bluetooth testing India, WPC testing India, wireless device EMC testing, wireless compliance testing Coimbatore Bangalore",
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
      { rel: "preload", as: "image", href: "/images/domain-telecom.webp" },
    ],
  }),
  component: WirelessTesting,
});
