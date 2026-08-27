import { createFileRoute } from "@tanstack/react-router";
import BlogDetail from "@/site/pages/BlogDetail";
import { blogPlaceholders } from "@/site/data/content";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  articleSchema,
  metaDescription,
} from "@/site/data/seo";

/** Published dates for blog posts — ideally move these into content.ts later */
const blogDates: Record<string, { published: string; modified: string }> = {
  "driving-global-sustainability": {
    published: "2024-11-10",
    modified: "2025-01-15",
  },
  "emc-testing-early-in-design": {
    published: "2024-12-05",
    modified: "2025-02-20",
  },
  "emi-and-emc-testing": {
    published: "2025-01-12",
    modified: "2025-03-10",
  },
  "emi-vs-emc": {
    published: "2025-02-18",
    modified: "2025-04-05",
  },
  "how-to-pass-emc-test": {
    published: "2025-03-25",
    modified: "2025-05-12",
  },
};

/** Improved meta descriptions with keyword targeting */
const blogMetaDescriptions: Record<string, string> = {
  "driving-global-sustainability":
    "Learn how EMC testing contributes to global sustainability and emission reduction. Expert insights from Cosmic Compliance Test Lab engineers on energy-efficient electronics.",
  "emc-testing-early-in-design":
    "Why you should integrate EMC testing early in product design. Save costs, reduce time-to-market, and ensure compliance. Expert guide from CCTL, India's leading EMC lab.",
  "emi-and-emc-testing":
    "Complete guide to EMI and EMC testing: what it is, why it matters, and how to ensure your products pass compliance. Explained by CCTL engineers in Coimbatore & Bangalore.",
  "emi-vs-emc":
    "EMI vs EMC: understand the key differences between electromagnetic interference and electromagnetic compatibility. Expert comparison guide from Cosmic Compliance Test Lab, India.",
  "how-to-pass-emc-test":
    "Expert tips and strategies to pass your EMC test on the first attempt. PCB design, shielding, filtering and pre-compliance best practices from CCTL engineers.",
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = blogPlaceholders.find((p) => p.slug === params.slug);
    const title = post
      ? `${post.title} | EMC Testing Insights | CCTL`
      : "Article | EMC Testing Blog | CCTL";
    const description =
      blogMetaDescriptions[params.slug] ??
      metaDescription(
        post?.subtitle ??
          "An article on EMI/EMC testing from Cosmic Compliance Test Lab engineers in Coimbatore and Bangalore, India."
      );
    const url = canonical(`/blog/${params.slug}`);
    const dates = blogDates[params.slug];

    const breadcrumbs = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post?.title ?? "Article", path: `/blog/${params.slug}` },
    ]);

    const article = articleSchema({
      title: post?.title ?? "EMC Testing Article",
      description,
      slug: params.slug,
      image: post?.image,
      datePublished: dates?.published,
      dateModified: dates?.modified,
    });

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${post?.title ?? "EMC testing"}, EMC testing blog, EMI EMC compliance, electromagnetic compatibility, EMC lab India, CCTL`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage(post?.image) },
        { property: "og:type", content: "article" },
        {
          property: "article:published_time",
          content: dates?.published ?? "2025-01-15",
        },
        {
          property: "article:modified_time",
          content: dates?.modified ?? "2025-01-15",
        },
        { property: "article:author", content: "Cosmic Compliance Test Lab" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage(post?.image) },
        { "script:ld+json": article },
        { "script:ld+json": breadcrumbs },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogDetail,
});
