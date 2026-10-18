/**
 * jobPostingSchema.ts — schema.org JobPosting for Google for Jobs.
 *
 * Google's rules: one JobPosting per job, on that job's own page (never on a
 * list page), describing a real, currently open position. So this is built
 * from the database row on /careers/jobs/$jobId, and hidden/deleted jobs 404.
 * https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
import { SITE_URL, canonical } from "./seo";

export interface PublicJob {
  id: string;
  title: string;
  department: string;
  experienceBand: string;
  employmentType: string; // "Onsite" | "Hybrid" | "Remote"
  locations: string[]; // "coimbatore" | "bangalore"
  responsibilities: string[];
  requirements: string[];
  createdAt: Date | string;
}

/** Full postal addresses — Google requires street, city, region, postcode, country. */
const LAB_ADDRESSES: Record<string, Record<string, string>> = {
  coimbatore: {
    streetAddress: "Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641048",
    addressCountry: "IN",
  },
  bangalore: {
    streetAddress:
      "Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    postalCode: "560099",
    addressCountry: "IN",
  },
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Google shows `description` as the job body, so it gets structured HTML. */
export function jobDescriptionHtml(job: PublicJob) {
  const list = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  return [
    `<p>Cosmic Compliance Test Lab (CCTL), a NABL-accredited EMI/EMC testing laboratory, is hiring for the role of ${esc(job.title)} in its ${esc(job.department)} team.</p>`,
    `<p><strong>What you'll do</strong></p>`,
    list(job.responsibilities),
    `<p><strong>What we're looking for</strong></p>`,
    list(job.requirements),
  ].join("");
}

/** "1–3 years" → 12, "5+ years" → 60, "<1 year" → undefined (no minimum). */
function minMonthsOfExperience(band: string): number | undefined {
  if (/^\s*</.test(band)) return undefined;
  const n = band.match(/\d+/);
  return n ? Number(n[0]) * 12 : undefined;
}

export function jobPostingSchema(job: PublicJob) {
  const months = minMonthsOfExperience(job.experienceBand);
  const remote = job.employmentType === "Remote";
  const places = job.locations
    .filter((l) => LAB_ADDRESSES[l])
    .map((l) => ({ "@type": "Place", address: { "@type": "PostalAddress", ...LAB_ADDRESSES[l] } }));

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: jobDescriptionHtml(job),
    identifier: { "@type": "PropertyValue", name: "Cosmic Compliance Test Lab", value: job.id },
    datePosted: new Date(job.createdAt).toISOString().split("T")[0],
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Cosmic Compliance Test Lab",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/images/cctl-logo.png`,
    },
    jobLocation: places,
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: "India" },
        }
      : {}),
    ...(months
      ? {
          experienceRequirements: {
            "@type": "OccupationalExperienceRequirements",
            monthsOfExperience: months,
          },
        }
      : { experienceRequirements: "no requirements" }),
    occupationalCategory: job.department,
    directApply: true,
    url: canonical(`/careers/jobs/${job.id}`),
  };
}
