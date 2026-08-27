import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/site/pages/Blog";
import { blogPlaceholders } from "@/site/data/content";
import {
  SITE_URL,
  canonical,
  ogImage,
  breadcrumbSchema,
} from "@/site/data/seo";

const title =
  "EMC Testing Blog | EMI/EMC Compliance Insights & Engineering Notes | CCTL";
const description =
  "Expert articles on EMI/EMC testing, compliance standards, electromagnetic compatibility tips, and emission reduction strategies from Cosmic Compliance Test Lab engineers in Coimbatore and Bangalore, India.";

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
]);

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/blog#webpage`,
  name: "CCTL EMC Testing Blog",
  description,
  url: canonical("/blog"),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: blogPlaceholders.length,
    itemListElement: blogPlaceholders.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: canonical(`/blog/${post.slug}`),
      name: post.title,
    })),
  },
};

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC testing blog, EMI EMC articles, electromagnetic compatibility guide, EMC compliance tips, how to pass EMC test, EMI vs EMC, EMC testing India, EMC standards guide",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/blog") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { "script:ld+json": blogListSchema },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/blog") }],
  }),
  component: Blog,
});
