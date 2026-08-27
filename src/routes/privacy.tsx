import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical, ogImage, breadcrumbSchema } from "@/site/data/seo";

const title = "Privacy Policy | Cosmic Compliance Test Lab (CCTL)";
const description =
  "Privacy policy for Cosmic Compliance Test Lab (CCTL). Learn how we handle your personal information when you use our EMI/EMC testing services.";

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
]);

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical("/privacy") },
      { property: "og:image", content: ogImage() },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
      { name: "robots", content: "noindex, follow" },
      { "script:ld+json": breadcrumbs },
    ],
    links: [{ rel: "canonical", href: canonical("/privacy") }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <section className="container-x section-y">
      <p className="section-eyebrow text-cyan-glow">Privacy</p>
      <h1 className="t-h1 mt-5 max-w-3xl">Privacy Policy</h1>
      <p className="t-body mt-6 max-w-2xl">
        Cosmic Compliance Test Lab uses the information you share with us to respond to enquiries,
        prepare test plans, and provide our services. We do not sell your personal information.
      </p>
      <p className="t-body mt-4 max-w-2xl">
        To ask about this policy or request access to your information, please contact us through
        the{" "}
        <Link to="/contact" className="text-cyan-glow underline">
          Contact
        </Link>{" "}
        page.
      </p>
    </section>
  );
}
