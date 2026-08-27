import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/site/pages/Contact";
import { company } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  localBusinessSchema,
} from "@/site/data/seo";

const title =
  "Contact CCTL | EMI/EMC Testing Labs in Coimbatore & Bangalore, India";
const description =
  "Contact Cosmic Compliance Test Lab for EMI/EMC testing services in Coimbatore and Bangalore, India. Get quotes for automotive, defence, railway & telecom EMC compliance testing. Call +91 94442 72009.";

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const locationsLd = company.locations.map((loc) => localBusinessSchema(loc));

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "contact EMC testing lab, EMC lab Coimbatore contact, EMC lab Bangalore contact, EMI testing quote India, CCTL address, EMC testing appointment, EMC lab phone number India",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/contact") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Coimbatore" },
      { name: "geo.position", content: "11.0168;76.9558" },
      { "script:ld+json": locationsLd[0] },
      { "script:ld+json": locationsLd[1] },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/contact") }],
  }),
  component: Contact,
});
