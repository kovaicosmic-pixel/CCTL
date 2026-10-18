import { createFileRoute, notFound } from "@tanstack/react-router";
import JobDetail from "@/site/pages/JobDetail";
import { getPublicJob } from "@/site/lib/careersAdmin";
import { jobPostingSchema } from "@/site/data/jobPostingSchema";
import { canonical, ogImage, breadcrumbSchema, organizationSchema } from "@/site/data/seo";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * /careers/jobs/$jobId — one open position, with its schema.org JobPosting.
 * Hidden or deleted jobs 404, which is how Google for Jobs learns they closed.
 */
export const Route = createFileRoute("/careers_/jobs/$jobId")({
  loader: async ({ params }) => {
    if (!UUID.test(params.jobId)) throw notFound();
    const { job } = await getPublicJob({ data: { id: params.jobId } });
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData, params }) => {
    const job = loaderData?.job;
    if (!job) {
      return { meta: [{ title: "Position not found | Cosmic Compliance Test Lab" }, { name: "robots", content: "noindex" }] };
    }
    const path = `/careers/jobs/${params.jobId}`;
    const title = `${job.title} — Careers | Cosmic Compliance Test Lab`;
    const summary = job.responsibilities[0] ?? "";
    const description = `Join CCTL as a ${job.title} (${job.experienceBand}). ${summary}`.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical(path) },
        { property: "og:image", content: ogImage() },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { "script:ld+json": jobPostingSchema(job) },
        { "script:ld+json": organizationSchema },
        {
          "script:ld+json": breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: job.title, path },
          ]),
        },
      ],
      links: [{ rel: "canonical", href: canonical(path) }],
    };
  },
  component: JobDetail,
});
