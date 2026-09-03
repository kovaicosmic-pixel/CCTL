export const company = {
  name: "Cosmic Compliance Test Lab",
  short: "CCTL",
  tagline: "Where Cosmic meets Quality, Pioneering EMC Testing Solutions",
  heroTitle: "Innovative Technology in EMC Testing",
  heroSubtitle: "EMC Testing Experts Reducing Emissions Globally",
  heroBody:
    "With our pioneering EMC testing technology and extensive expertise, we effectively minimize emissions, leading the way toward a sustainable future.",
  email: "emc@cosmictestlab.com",
  phone: "+91 94442 72009",
  emails: ["emc@cosmictestlab.com", "kovaiemc@cosmictestlab.com"],
  phones: ["+91 94442 72009", "+91 97909 01184", "+91 98867 25325", "+91 92437 97945"],
  hours: "Monday to Saturday (24 Hours)",
  address:
    "Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu 641048",
  locations: [
    {
      id: "coimbatore",
      name: "CCTL Coimbatore",
      label: "Coimbatore Lab",
      address:
        "Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu - 641048",
      map: { x: 28, y: 52 },
      coords: { lat: 11.0168, lng: 76.9558 },
      phone: "+91 97909 01184",
      email: "kovaiemc@cosmictestlab.com",
    },
    {
      id: "bangalore",
      name: "CCTL Bangalore",
      label: "Bangalore Lab",
      address:
        "Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk, Bangalore - 560099",
      map: { x: 74, y: 64 },
      coords: { lat: 12.9716, lng: 77.5946 },
      phone: "+91 94442 72009",
      email: "emc@cosmictestlab.com",
    },
  ],
};

export const pillars = [
  {
    title: "Thorough EMC Testing Solutions",
    body: "Ensure compliance for diverse electronic products with comprehensive testing across various industries.",
  },
  {
    title: "Customized EMC Reduction Services",
    body: "Tailored EMC testing solutions to minimize emission levels, ensuring adherence to industry regulations and standards.",
  },
  {
    title: "Professional EMC Training Programs",
    body: "Empower your team with essential skills through expert-led EMC training for effective EMC management.",
  },
];

export const aboutPillars = [
  {
    title: "Precision in EMC Assurance",
    body: "Rigorous, repeatable test methodology that leaves no margin for ambiguity.",
  },
  {
    title: "Innovation for EMC Testing Solutions",
    body: "Investing continuously in the latest chambers, sensors, and analysis tooling.",
  },
  {
    title: "Excellence through EMC Testing Expert",
    body: "A team of specialist engineers with deep domain knowledge across sectors.",
  },
  {
    title: "Securing EMC Compliance Effortlessly",
    body: "Helping you clear regulatory hurdles with confidence, on schedule.",
  },
];

export const about = {
  intro:
    "Cosmic Compliance Test Lab (CCTL) houses a premier Electromagnetic Interference (EMI) and Electromagnetic Compatibility (EMC) Testing facility, specializing in compliance tests for automotive electronic sub-assemblies (ESAs). Our laboratory extends its expertise to a diverse array of electrical and electronic equipment, spanning military, industrial, scientific, and medical sectors. As leaders in Inspection, Certification, and Testing, we offer cutting-edge EMI EMC Testing solutions that fortify product quality, security, and regulatory adherence. Leveraging advanced infrastructure and skilled personnel, we provide precise safety and compliance assessments, supporting your journey toward market prominence.",
  mission:
    "Delivering reliable, high-quality, and cost-effective EMC testing services, ensuring customer satisfaction and product excellence.",
  vision:
    "Becoming a global leader in EMC certification and EMC testing services, ensuring safety and reliability through innovative solutions.",
  values: [
    {
      title: "Collaborative",
      body: "Experience seamless cooperation as we work together towards your goals, ensuring your needs are met every step of the way.",
    },
    {
      title: "Efficient",
      body: "Benefit from streamlined processes and swift turnaround times, optimizing your time and resources for maximum efficiency.",
    },
  ],
};

export const whyChooseUs = [
  {
    title: "Component Semi-Anechoic Chamber (CSAC)",
    body: "Our updated facility includes a Component Semi-Anechoic Chamber (CSAC) up to 40 GHz, with a shielded control room and advanced instrumentation.",
  },
  {
    title: "Vehicle Semi-Anechoic Chamber (VSAC)",
    body: "A Vehicle Semi-Anechoic Chamber (VSAC) with a 2m turntable, shielded control room, and advanced instrumentation for full-vehicle testing.",
  },
  {
    title: "Upcoming EMC Scanner",
    body: "An upcoming EMC scanner for troubleshooting and product development support.",
  },
  {
    title: "Team of Expertise",
    body: "Experienced EMC engineers guiding every test from planning through certification.",
  },
];

export type DomainStat = { label: string; value: string };

export type ServiceDomain = {
  slug: string;
  name: string;
  tagline: string;
  body: string;
  icon: "shield" | "cpu" | "car" | "train" | "radio";
  image: string;
  gallery: string[];
  /** Ghost watermark word for the Service Detail hero. */
  spec: string;
  /** Masked-window stat strip beneath the Service Detail hero. */
  stats: DomainStat[];
  /** Extended description shown on the detail page. */
  detailedDescription: string;
  /** Value propositions / key benefits shown as cards. */
  valueProps?: { title: string; body: string }[];
  /** Service offerings (sub-services). */
  serviceOfferings?: { title: string; body: string }[];
  /** Lab testing table — two columns. */
  labTesting?: { col1Header: string; col2Header: string; col1: string[]; col2: string[] };
  /** Additional services list. */
  additionalServices?: string[];
};

export { servicesLight as services } from "./services-light";

export const certifications = [
  {
    title: "Certificate of Incorporation",
    code: "MCA / INC-2019",
    issuer: "Ministry of Corporate Affairs",
    image: "/images/certificate1.webp",
  },
  {
    title: "ISO 17025 Certification",
    code: "ISO/IEC 17025:2017",
    issuer: "International Organization for Standardization",
    image: "/images/certificate2.png",
  },
  {
    title: "NABL Accreditation Certificate",
    code: "NABL / TC-EMC",
    issuer: "National Accreditation Board for Testing and Calibration Laboratories",
    image: "/images/certificate3.png",
  },
  {
    title: "Udyam Registration Certificate",
    code: "UDYAM-TN-COIMBATORE",
    issuer: "Ministry of MSME, Government of India",
    image: "/images/certificate4.png",
  },
  {
    title: "Certificate of Designation",
    code: "CCTL / DESIG",
    issuer: "Designated Test Facility",
    image: "/images/certificate5.webp",
  },
];

export const certifiedTagline =
  "Cosmic is the certified leader in EMC testing, providing unparalleled trust and expertise in the field.";

export const stats = [
  { label: "Projects Done", value: 500 },
  { label: "Expert Peoples", value: 25 },
  { label: "Years", value: 5 },
];

// "Inside the Lab" parallax gallery (About) — equipment/engineer shots not used elsewhere.
export const labPhotosA = ["/images/gallery7.jpg", "/images/explore/control_room.webp", "/images/gallery3.jpg"];
export const labPhotosB = ["/images/gallery8.jpg", "/images/chamber.webp", "/images/about_us.jpg"];

export const gallery = [
  "/images/gallery1.webp",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpeg",
  "/images/gallery6.jpg",
  "/images/gallery7.jpg",
  "/images/gallery8.jpg",
  "/images/gallery9.jpg",
];

export const testimonials = [
  {
    quote:
      "We had got excellent support for EMC testing of our various products, and the test reports were received on time.",
    author: "Scientist",
    org: "LRDE",
  },
  {
    quote:
      "We take this opportunity in expressing our sincere thanks for your consistent support for EMI & MIL 704 Testing of our products which are deployed across the Indian Defence Forces. Your willingness and consistence support made significant difference in our Product testing. Please accept our sincere Congratulations from all of us at Team Trident Infosol, and wishing you and your team the very best in years ahead!",
    author: "Team",
    org: "Trident Infosol Pvt Ltd, Bangalore",
  },
];

export const valueProps = [
  "Client-oriented",
  "Results-driven",
  "Independent",
  "Problem-solving",
  "Competent",
  "Transparent",
];

export const partnerCta = {
  heading: "Partner with Us for Comprehensive EMC Testing",
  body: "We're happy to answer any questions you may have and help you determine which of our EMI and EMC Testing services best fit your needs.",
  scheduleNote:
    "Schedule your appointment at your convenience by selecting the appropriate lab from the options below.",
};

export const servicesSection = {
  eyebrow: "Our Services",
  heading: "Cosmic Compliance Test Lab's Advanced EMC Testing Solutions",
  subtitle: "Driving Innovation Through Comprehensive Electromagnetic Testing Services",
};

export const aboutSection = {
  eyebrow: "About Us",
  heading: "Leading EMC Testing Solutions Provider",
};

export const whyChooseUsSection = {
  eyebrow: "Why Choose Us",
  heading: "Enhanced Facility Update and Upcoming Additions",
  body: "Our updated facility includes a Component Semi-Anechoic Chamber (CSAC) up to 48 GHz, alongside a Vehicle Semi-Anechoic Chamber (VSAC) with a 2m turntable. Both feature shielded control rooms and advanced instrumentation. Upcoming: EMC scanner for troubleshooting and product development.",
};

export type BlogPost = {
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  ghostWord: string;
  /**
   * Rich body content. Each string is a block:
   * - Starting with "## " → rendered as h2 heading
   * - Starting with "### " → rendered as h3 heading
   * - Starting with "- " → bullet list item (consecutive items grouped)
   * - Starting with "| " → table row (first row = header, pipe-separated cells)
   * - Anything else → paragraph
   */
  body: string[];
};

export { blogPlaceholdersLight as blogPlaceholders } from "./blog-light";

export const clientLogos = Array.from(
  { length: 50 },
  (_, i) => `/images/clients/Picture${i + 1}.webp`,
);

// ─── FAQ Data for SEO ───────────────────────────────────────────────────────

export const faqs = [
  {
    question: "What is EMC testing and why is it important?",
    answer:
      "EMC (Electromagnetic Compatibility) testing ensures electronic devices operate without causing or being affected by electromagnetic interference. It is mandatory for regulatory compliance (CE, FCC, BIS) before products can be sold commercially. CCTL provides comprehensive EMI/EMC testing services in Coimbatore and Bangalore, India.",
  },
  {
    question: "Where can I get EMC testing done in India?",
    answer:
      "Cosmic Compliance Test Lab (CCTL) offers NABL accredited EMC testing at two locations in India — Coimbatore (Tamil Nadu) and Bangalore (Karnataka). Our labs operate 24x6 with Component Semi-Anechoic Chamber (CSAC) up to 48 GHz and Vehicle Semi-Anechoic Chamber (VSAC).",
  },
  {
    question: "What industries does CCTL serve for EMI/EMC testing?",
    answer:
      "CCTL provides EMI/EMC testing services for automotive (CISPR 25, ISO 11452), defence & aerospace (MIL-STD-461), railway (EN 50121), telecom & wireless (CE/FCC, WPC), and civilian/industrial equipment (IEC 61000 series). We serve clients across India from our Coimbatore and Bangalore labs.",
  },
  {
    question: "Is CCTL's EMC testing lab NABL accredited?",
    answer:
      "Yes, Cosmic Compliance Test Lab is fully NABL accredited and ISO/IEC 17025:2017 certified. We are a designated test facility recognized by national and international regulatory bodies for EMI/EMC compliance testing.",
  },
  {
    question: "How much does EMC testing cost in India?",
    answer:
      "EMC testing costs vary based on the product type, applicable standards, and number of tests required. CCTL offers competitive pricing with fast turnaround times. Contact our team at emc@cosmictestlab.com or call +91 94442 72009 for a customized quote.",
  },
  {
    question: "What EMC testing standards does CCTL support?",
    answer:
      "CCTL supports a comprehensive range of EMC standards including MIL-STD-461 (defence), CISPR 25/12 (automotive), EN 50121 (railway), IEC 61000 series (civilian), CISPR 11/22/32 (industrial), and CE/FCC/BIS marks for wireless & telecom products.",
  },
  {
    question: "What is the difference between EMI and EMC testing?",
    answer:
      "EMI (Electromagnetic Interference) testing measures unwanted electromagnetic emissions from a device. EMC (Electromagnetic Compatibility) testing is broader — it includes both emission testing (what the device radiates) and immunity testing (how well it resists external interference). CCTL provides both EMI and EMC testing at our labs in Coimbatore and Bangalore.",
  },
  {
    question: "How long does EMC testing take at CCTL?",
    answer:
      "Testing duration depends on the product complexity and number of standards applicable. Simple consumer products may take 2-3 days, while complex military or automotive systems may require 1-2 weeks. CCTL offers expedited testing services with 24x6 lab operations for urgent projects.",
  },
  {
    question: "Does CCTL offer pre-compliance EMC testing?",
    answer:
      "Yes, CCTL offers pre-compliance EMC testing services to identify potential issues early in the design cycle. This helps reduce costly rework and ensures smoother formal compliance testing. Our engineers provide detailed recommendations for design improvements.",
  },
  {
    question: "What chambers does CCTL have for EMC testing?",
    answer:
      "CCTL operates a Component Semi-Anechoic Chamber (CSAC) capable of testing up to 48 GHz, and a Vehicle Semi-Anechoic Chamber (VSAC) with a 2-meter turntable for full-vehicle testing. Both chambers feature shielded control rooms and advanced instrumentation for precise measurements.",
  },
];
