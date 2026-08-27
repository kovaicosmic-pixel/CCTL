/**
 * SEO utilities for Cosmic Compliance Test Lab (CCTL).
 *
 * Single source of truth for canonical domain, structured data generators,
 * breadcrumbs, and geo-targeted meta helpers. Every route imports from here.
 */

// ─── Domain & Canonical ─────────────────────────────────────────────────────

/**
 * Production domain — update once finalized. All canonical URLs, sitemap
 * entries, and structured-data URLs derive from this constant.
 */
export const SITE_URL = "https://www.cosmictestlab.com";

export const canonical = (path: string) =>
  `${SITE_URL}${path === "/" ? "" : path}`;

// ─── Open Graph Images ──────────────────────────────────────────────────────

const DEFAULT_OG_IMAGE = "/images/og-image.jpg";

export const ogImage = (path: string = DEFAULT_OG_IMAGE) =>
  `${SITE_URL}${path}`;

// ─── Geo-Targeted Keywords ──────────────────────────────────────────────────

/** Primary keyword phrases we want to rank for. Used to seed titles/meta. */
export const GEO_KEYWORDS = {
  primary: "EMI/EMC testing",
  locations: ["Coimbatore", "Bangalore", "India"],
  longTail: [
    "EMC testing lab in Coimbatore",
    "EMI testing lab in Bangalore",
    "EMC testing India",
    "EMI EMC compliance testing",
    "electromagnetic compatibility testing India",
    "NABL accredited EMC lab",
    "ISO 17025 EMC testing laboratory",
  ],
} as const;

/** Brand suffix for title tags — consistent across all pages */
export const BRAND_SUFFIX = "Cosmic Compliance Test Lab (CCTL)";

// ─── Structured Data: Organization ──────────────────────────────────────────

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Cosmic Compliance Test Lab",
  alternateName: "CCTL",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/about_us.jpg`,
  email: "emc@cosmictestlab.com",
  telephone: "+91 94442 72009",
  description:
    "NABL & ISO/IEC 17025 accredited EMI/EMC testing laboratory in Coimbatore and Bangalore, India. Specializing in automotive, defence, aerospace, railway and telecom EMC compliance testing.",
  foundingDate: "2021",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 25 },
  sameAs: ["https://www.linkedin.com/company/cosmicompliance/"],
  areaServed: [
    { "@type": "City", name: "Coimbatore" },
    { "@type": "City", name: "Bangalore" },
    { "@type": "Country", name: "India" },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Accreditation",
      name: "NABL Accreditation",
      recognizedBy: {
        "@type": "Organization",
        name: "National Accreditation Board for Testing and Calibration Laboratories",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certification",
      name: "ISO/IEC 17025:2017",
      recognizedBy: {
        "@type": "Organization",
        name: "International Organization for Standardization",
      },
    },
  ],
  knowsAbout: [
    "EMI Testing",
    "EMC Testing",
    "Electromagnetic Compatibility",
    "Electromagnetic Interference",
    "MIL-STD-461",
    "CISPR 25",
    "EN 50121",
    "IEC 61000",
    "Automotive EMC",
    "Railway EMC",
    "Telecom EMC",
  ],
};

// ─── Structured Data: LocalBusiness (per lab) ───────────────────────────────

export interface LabLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coords: { lat: number; lng: number };
}

export function localBusinessSchema(loc: LabLocation) {
  const locality = loc.id === "coimbatore" ? "Coimbatore" : "Bangalore";
  const region = loc.id === "coimbatore" ? "Tamil Nadu" : "Karnataka";
  const postalCode = loc.id === "coimbatore" ? "641048" : "560099";

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#${loc.id}`,
    name: loc.name,
    image: `${SITE_URL}/images/about_us.jpg`,
    url: SITE_URL,
    telephone: loc.phone,
    email: loc.email,
    description: `EMI/EMC testing laboratory in ${locality}, ${region}. NABL accredited, ISO/IEC 17025 certified. Automotive, defence, aerospace, railway & telecom EMC compliance testing.`,
    priceRange: "$$",
    branchOf: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.coords.lat,
      longitude: loc.coords.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "45",
    },
  };
}

// ─── Structured Data: BreadcrumbList ────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

// ─── Structured Data: ProfessionalService (for service pages) ───────────────

export interface ServiceSchemaInput {
  name: string;
  description: string;
  slug: string;
  image?: string;
}

export function professionalServiceSchema(svc: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/services/${svc.slug}#service`,
    name: svc.name,
    description: svc.description,
    url: canonical(`/services/${svc.slug}`),
    image: svc.image ? `${SITE_URL}${svc.image}` : undefined,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: [
      { "@type": "City", name: "Coimbatore" },
      { "@type": "City", name: "Bangalore" },
      { "@type": "Country", name: "India" },
    ],
    serviceType: "EMI/EMC Testing",
    termsOfService: canonical("/privacy"),
  };
}

// ─── Structured Data: Article / BlogPosting ─────────────────────────────────

export interface BlogSchemaInput {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export function articleSchema(post: BlogSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: canonical(`/blog/${post.slug}`),
    image: post.image ? `${SITE_URL}${post.image}` : ogImage(),
    datePublished: post.datePublished ?? "2025-01-15",
    dateModified: post.dateModified ?? post.datePublished ?? "2025-01-15",
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical(`/blog/${post.slug}`),
    },
  };
}

// ─── Structured Data: FAQPage ───────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Structured Data: WebSite (for sitelinks search box) ────────────────────

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Cosmic Compliance Test Lab",
  alternateName: "CCTL",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// ─── Meta helpers ───────────────────────────────────────────────────────────

/** Truncate a description to ~155 chars (safe for Google SERP) */
export function metaDescription(text: string, maxLen = 155): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 100 ? lastSpace : maxLen)}...`;
}
