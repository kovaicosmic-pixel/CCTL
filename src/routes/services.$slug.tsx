import { createFileRoute } from "@tanstack/react-router";
import ServiceDetail from "@/site/pages/ServiceDetail";
import { services } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  professionalServiceSchema,
  metaDescription,
} from "@/site/data/seo";

/** Geo-optimized titles per service slug for stronger local keyword targeting */
const serviceTitles: Record<string, string> = {
  "mil-aero":
    "MIL-STD-461 EMC Testing in Coimbatore & Bangalore | Defence & Aerospace | CCTL",
  civilian:
    "Civilian EMI/EMC Testing Lab in Coimbatore & Bangalore, India | IEC 61000 | CCTL",
  automotive:
    "Automotive EMC Testing in Coimbatore & Bangalore | CISPR 25, ISO 11452 | CCTL",
  railway:
    "Railway EMC Testing in Coimbatore & Bangalore, India | EN 50121 | CCTL",
  "telecom-wireless":
    "Telecom & Wireless EMC Testing in Coimbatore & Bangalore | CE/FCC/WPC | CCTL",
};

/** Geo-keyword-rich meta descriptions per slug */
const serviceDescriptions: Record<string, string> = {
  "mil-aero":
    "NABL accredited MIL-STD-461 EMC testing lab in Coimbatore & Bangalore, India. Complete defence & aerospace EMI/EMC compliance testing from 10 kHz to 48 GHz. CSAC facility with up to 100A capacity.",
  civilian:
    "ISO/IEC 17025 accredited civilian EMI/EMC testing in Coimbatore & Bangalore. IEC 61000, CISPR 11/22/32, EN 55014 compliance testing for industrial, scientific & medical equipment in India.",
  automotive:
    "Expert automotive EMC testing lab in Coimbatore & Bangalore, India. CISPR 25, ISO 11452, ISO 10605 testing with Vehicle Semi-Anechoic Chamber (VSAC). NABL accredited auto EMC compliance.",
  railway:
    "Railway EMC testing in Coimbatore & Bangalore, India. EN 50121, IEC 62236 compliance testing for rolling stock, signalling & fixed installations. NABL accredited lab with expert engineers.",
  "telecom-wireless":
    "Telecom & wireless device EMC testing in Coimbatore & Bangalore, India. CE, FCC, WPC certification testing. NABL accredited lab for Wi-Fi, Bluetooth, IoT device compliance.",
};

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    const title =
      serviceTitles[params.slug] ??
      `${service?.name ?? "Testing Services"} | EMI/EMC Testing in India | CCTL`;
    const description =
      serviceDescriptions[params.slug] ??
      metaDescription(
        service?.body ??
          "EMI/EMC testing services at Cosmic Compliance Test Lab in Coimbatore and Bangalore, India."
      );
    const url = canonical(`/services/${params.slug}`);

    const breadcrumbs = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      {
        name: service?.name ?? "Service",
        path: `/services/${params.slug}`,
      },
    ]);

    const serviceSchema = service
      ? professionalServiceSchema({
          name: `${service.name} EMI/EMC Testing`,
          description,
          slug: service.slug,
          image: service.image,
        })
      : undefined;

    const meta: Record<string, unknown>[] = [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content: `${service?.name ?? "EMC"} testing India, ${service?.name ?? "EMC"} testing Coimbatore, ${service?.name ?? "EMC"} testing Bangalore, EMI EMC compliance ${params.slug}, NABL EMC lab India`,
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage(service?.image) },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage(service?.image) },
      { "script:ld+json": breadcrumbs },
    ];

    if (serviceSchema) {
      meta.push({ "script:ld+json": serviceSchema });
    }

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ServiceDetail,
});
