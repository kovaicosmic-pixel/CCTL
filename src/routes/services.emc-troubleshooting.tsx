import { createFileRoute } from "@tanstack/react-router";
import EmcTroubleshooting from "@/site/pages/EmcTroubleshooting";
import {
  canonical,
  ogImage,
  breadcrumbSchema,
  professionalServiceSchema,
  faqSchema,
  howToSchema,
  type FAQItem,
} from "@/site/data/seo";

const title = "EMC Troubleshooting | Resolving EMC Test Failures | CCTL";
const description =
  "Expert EMC troubleshooting support from CCTL. Investigate emission sources, identify coupling paths, and resolve EMC test failures through pre-compliance testing and engineering guidance in Coimbatore and Bangalore.";
const url = canonical("/services/emc-troubleshooting");
const image = ogImage("/images/chamber.webp");

const faqs: FAQItem[] = [
  {
    question: "What should I do if my product fails EMC testing?",
    answer:
      "First, review the test report to identify which frequencies and test methods produced the failure. Then investigate the likely source — common causes include PCB layout issues, cable problems, inadequate filtering, poor shielding, or grounding deficiencies. CCTL can support the investigation through pre-compliance testing.",
  },
  {
    question: "Why do products fail EMC testing?",
    answer:
      "Common causes include poor PCB layout, unfiltered switching power supply noise, unshielded or improperly bonded cables, enclosure apertures, inadequate decoupling, and poor grounding or bonding. Most failures trace back to one or more of these root causes.",
  },
  {
    question: "Can CCTL help identify why my product failed EMC?",
    answer:
      "Yes. CCTL can support EMC troubleshooting through pre-compliance testing, allowing you to investigate emission behaviour, compare design variants, and verify engineering changes before formal compliance re-testing.",
  },
  {
    question: "What is the difference between EMC troubleshooting and compliance testing?",
    answer:
      "Troubleshooting and pre-compliance testing are engineering investigation activities — they help identify and fix EMC issues but do not produce results suitable for regulatory or certification submissions. Formal compliance testing is required for market approval and uses accredited laboratory procedures.",
  },
  {
    question: "How long does EMC troubleshooting take?",
    answer:
      "Duration depends on the product complexity, the nature of the failure, and how many design iterations are needed. CCTL's 24×6 laboratory operation means testing can be scheduled to fit your engineering timeline.",
  },
];

const howTo = howToSchema({
  name: "How to Resolve an EMC Test Failure",
  description:
    "A systematic approach to investigating and resolving EMC test failures for electronic products.",
  totalTime: "P14D",
  steps: [
    {
      name: "Review the test report",
      text: "Examine the test data to identify which frequencies, test methods, and product configurations produced the failure or marginal result.",
    },
    {
      name: "Identify the emission source",
      text: "Correlate failure frequencies with known internal sources such as switching converters, oscillators, or high-speed interfaces.",
    },
    {
      name: "Trace the coupling path",
      text: "Determine whether energy is coupling through radiated or conducted paths, and whether the mechanism is differential-mode or common-mode.",
    },
    {
      name: "Apply engineering changes",
      text: "Implement targeted fixes such as improved filtering, shielding, grounding, cable management, or PCB layout changes based on the identified mechanism.",
    },
    {
      name: "Verify by pre-compliance testing",
      text: "Test the modified product to confirm the engineering change has produced sufficient margin before committing to formal compliance re-testing.",
    },
  ],
});

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "EMC Troubleshooting", path: "/services/emc-troubleshooting" },
]);

const serviceSchema = professionalServiceSchema({
  name: "EMC Troubleshooting",
  description,
  path: "/services/emc-troubleshooting",
  image: "/images/chamber.webp",
});

export const Route = createFileRoute("/services/emc-troubleshooting")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "EMC troubleshooting India, product failed EMC test, EMC failure investigation, how to fix EMC failure, EMC pre-compliance testing India, reduce EMI emissions, EMC debug India, EMC problem solving Coimbatore Bangalore",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { "script:ld+json": breadcrumbs },
      { "script:ld+json": serviceSchema },
      { "script:ld+json": faqSchema(faqs) },
      { "script:ld+json": howTo },
    ],
    links: [{ rel: "canonical", href: url }],
  }),
  component: EmcTroubleshooting,
});
