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

// chamber.webp is the canonical fallback — a real image that exists in /public/images/.
// og-image.jpg is intentionally kept as the ideal target; replace it with a
// professionally designed 1200×630 branded graphic when available.
const DEFAULT_OG_IMAGE = "/images/chamber.webp";

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
  logo: `${SITE_URL}/images/logo.webp`,
  image: `${SITE_URL}/images/about_us.jpg`,
  email: "emc@cosmictestlab.com",
  telephone: "+91 94442 72009",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641048",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress:
        "Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560099",
      addressCountry: "IN",
    },
  ],
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
  };
}

// ─── Structured Data: BreadcrumbList ────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
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
  /** Full site path for this service, e.g. "/services/automotive" or
   *  "/automotive/cispr-25-testing" — not every service page lives under
   *  /services/, so the full path is required rather than assumed. */
  path: string;
  image?: string;
}

export function professionalServiceSchema(svc: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}${svc.path}#service`,
    name: svc.name,
    description: svc.description,
    url: canonical(svc.path),
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
    "@type": "TechArticle",
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".t-lead"],
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
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── Meta helpers ───────────────────────────────────────────────────────────

/** Truncate a description to ~155 chars (safe for Google SERP) */
export function metaDescription(text: string, maxLen = 155): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 100 ? lastSpace : maxLen)}...`;
}

// ─── Structured Data: VideoObject ───────────────────────────────────────────

export interface VideoSchemaInput {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl?: string;
  contentUrl?: string;
  duration?: string; // ISO 8601 e.g. "PT4M33S"
}

export function videoObjectSchema(video: VideoSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
    ...(video.contentUrl ? { contentUrl: video.contentUrl } : {}),
    ...(video.duration ? { duration: video.duration } : {}),
  };
}

// ─── Structured Data: AggregateRating / Review ──────────────────────────────

export interface ReviewInput {
  reviewBody: string;
  authorName: string;
  authorOrg?: string;
  ratingValue?: number;
  datePublished?: string;
}

export function aggregateRatingSchema(reviews: ReviewInput[]) {
  const ratedReviews = reviews.filter((r) => r.ratingValue !== undefined);
  const avg =
    ratedReviews.length > 0
      ? ratedReviews.reduce((s, r) => s + (r.ratingValue ?? 0), 0) / ratedReviews.length
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "Cosmic Compliance Test Lab",
    ...(avg !== undefined
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: ratedReviews.length,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    review: reviews.map((r) => ({
      "@type": "Review",
      reviewBody: r.reviewBody,
      author: {
        "@type": "Person",
        name: r.authorName,
        worksFor: r.authorOrg
          ? { "@type": "Organization", name: r.authorOrg }
          : undefined,
      },
      ...(r.ratingValue !== undefined
        ? {
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.ratingValue,
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
      ...(r.datePublished ? { datePublished: r.datePublished } : {}),
    })),
  };
}

// ─── Structured Data: HowTo ─────────────────────────────────────────────────

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export function howToSchema(input: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 e.g. "P3D"
  steps: HowToStep[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    supply: [{ "@type": "HowToSupply", name: "Electronic Device Under Test (EUT)" }],
    tool: [
      { "@type": "HowToTool", name: "Semi-Anechoic Chamber (CSAC/VSAC)" },
      { "@type": "HowToTool", name: "EMC Test Receiver" },
    ],
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: `${SITE_URL}${s.image}` } : {}),
      ...(s.url ? { url: canonical(s.url) } : {}),
    })),
  };
}

// ─── Structured Data: Person (E-E-A-T author/expert) ────────────────────────

/**
 * Person schema for a named CCTL expert or article author.
 *
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is
 * strengthened when technical content is attributed to a real, named expert
 * rather than only to the organisation.
 *
 * IMPORTANT — do not invent a person. Populate `EMC_EXPERTS` below ONLY with
 * genuine CCTL personnel whose details CCTL has confirmed. Until real names
 * are supplied, this data stays empty and no Person schema is emitted.
 */
export interface ExpertPerson {
  /** Full name — required and must be a real CCTL person */
  name: string;
  /** Job title, e.g. "Senior EMC Test Engineer" */
  jobTitle: string;
  /** Optional short professional description */
  description?: string;
  /** Optional LinkedIn or professional profile URL */
  sameAs?: string[];
  /** Optional areas of expertise */
  knowsAbout?: string[];
}

/**
 * Genuine CCTL experts — populate with real personnel details supplied by CCTL.
 * Left intentionally empty; do not add fabricated entries.
 */
export const EMC_EXPERTS: ExpertPerson[] = [];

export function personSchema(person: ExpertPerson) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    ...(person.description ? { description: person.description } : {}),
    ...(person.sameAs && person.sameAs.length > 0 ? { sameAs: person.sameAs } : {}),
    ...(person.knowsAbout && person.knowsAbout.length > 0
      ? { knowsAbout: person.knowsAbout }
      : {}),
  };
}

/**
 * Returns Person JSON-LD schema objects for all confirmed experts.
 * Safe to spread into a route's meta array — emits nothing while EMC_EXPERTS
 * is empty, so no fabricated author data is ever published.
 */
export function expertsSchema() {
  return EMC_EXPERTS.map((p) => personSchema(p));
}
