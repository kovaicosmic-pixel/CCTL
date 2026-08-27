import { createFileRoute } from "@tanstack/react-router";
import Services from "@/site/pages/Services";
import { services } from "@/site/data/content";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
} from "@/site/data/seo";

const title =
  "EMI/EMC Testing Services in Coimbatore & Bangalore, India | CCTL";
const description =
  "Comprehensive EMI/EMC testing services for automotive, military/aerospace, railway, telecom & civilian equipment. NABL accredited labs in Coimbatore and Bangalore, India. MIL-STD-461, CISPR 25, EN 50121, IEC 61000 compliant testing.";

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
]);

// ItemList schema for services — helps Google show service links in SERPs
const serviceListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "EMI/EMC Testing Services",
  description:
    "Complete range of EMI and EMC testing services offered by Cosmic Compliance Test Lab in India",
  url: canonical("/services"),
  numberOfItems: services.length,
  itemListElement: services.map((svc, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: svc.name,
    url: canonical(`/services/${svc.slug}`),
    description: svc.body,
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services#service`,
  name: "EMI/EMC Compliance Testing",
  provider: { "@id": `${SITE_URL}/#organization` },
  serviceType: "EMI/EMC Testing",
  description:
    "NABL accredited EMI/EMC testing services covering automotive, defence, aerospace, railway and telecom sectors at labs in Coimbatore and Bangalore, India.",
  areaServed: [
    { "@type": "City", name: "Coimbatore" },
    { "@type": "City", name: "Bangalore" },
    { "@type": "Country", name: "India" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "EMC Testing Services",
    itemListElement: services.map((svc) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: svc.name,
        url: canonical(`/services/${svc.slug}`),
      },
    })),
  },
};

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing services India, EMI testing services Coimbatore, EMC compliance Bangalore, automotive EMC testing, military EMC testing MIL-STD-461, railway EMC EN 50121, telecom EMC testing, civilian EMC testing IEC 61000, NABL EMC lab services",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/services") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { "script:ld+json": serviceSchema },
      { "script:ld+json": serviceListSchema },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/services") }],
  }),
  component: Services,
});
