export const company = {
  name: "Cosmic Compliance Test Lab",
  short: "CCTL",
  tagline: "Where Cosmic meets Quality, Pioneering EMC Testing Solutions",
  heroTitle: "Inovative Technology in EMC Testing",
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
    body: "Our updated facility includes a Component Semi-Anechoic Chamber (CSAC) up to 48 GHz, with a shielded control room and advanced instrumentation.",
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

export const services: ServiceDomain[] = [
  {
    slug: "mil-aero",
    name: "MIL / AERO Domain",
    tagline: "Reliable MIL-STD-461 EMC Testing for Military and Aerospace Equipment",
    body: "Ensure your defense and aerospace systems meet the most rigorous global standards with Cosmic Compliance Test Lab's certified MIL-STD-461 testing services.",
    icon: "shield",
    image: "/images/chamber.webp",
    gallery: [
      "/images/mil-aero/AZ7_7709%202023-09-11%2006_28_36.webp",
      "/images/mil-aero/AZ7_7722%202023-09-11%2006_29_56.webp",
      "/images/mil-aero/Radiated%20immunity%20test%20.webp",
      "/images/mil-aero/WhatsApp%20Image%202024-04-23%20at%205.30.59%20PM%20(1).webp",
    ],
    spec: "MIL-461",
    stats: [
      { label: "Standard", value: "MIL-STD-461" },
      { label: "Frequency Range", value: "10 kHz – 40 GHz" },
      { label: "Chamber", value: "CSAC" },
    ],
    detailedDescription:
      "Cosmic Compliance Test Lab (CCTL) is proud to be recognized as the nation's leader in MIL-STD-461 EMC testing, offering comprehensive EMC Testing services to meet the stringent requirements of this standard. Our capabilities extend across all revisions of MIL-STD-461, from C to G, ensuring that our clients receive accurate and reliable EMC testing results. At CCTL, we are fully equipped and capable of testing a wide range of components, including bench-top mounted or free-standing equipment, independent modules located inside electronic enclosures, and entire platforms such as aircraft or submarines with a power input current draw of up to 100 amps capacity. Moreover, our in-house laboratory is equipped to handle equipment weighing up to 3 tons, demonstrating our commitment to providing comprehensive testing solutions for various applications.",
    valueProps: [
      {
        title: "Reliable",
        body: "Ensure consistent operation of military and aerospace equipment even in high-EMI environments, reducing the risk of malfunction.",
      },
      {
        title: "Compliant",
        body: "Meet mandatory defense and aerospace standards, ensuring eligibility for military contracts and certifications.",
      },
      {
        title: "Interoperable",
        body: "Guarantee seamless performance with other electronic systems and communication networks in multi-device operations.",
      },
      {
        title: "Safe",
        body: "Protect mission-critical systems from electromagnetic disruptions that could lead to communication failure or system breakdown.",
      },
    ],
    serviceOfferings: [
      {
        title: "Pre-Compliance Testing",
        body: "Our pre-compliance testing services are designed to help you identify and resolve electromagnetic interference (EMI) issues early in the development cycle. This proactive approach reduces the risk of costly rework, project delays, and failed compliance in later stages.",
      },
      {
        title: "Full Compliance Testing",
        body: "We provide full MIL-STD-461 compliance testing to ensure your products meet stringent military and aerospace electromagnetic compatibility requirements. Our comprehensive process includes both conducted and radiated emissions and susceptibility testing.",
      },
      {
        title: "Custom EMC Testing Solutions",
        body: "We offer custom EMC testing services tailored to your product's specific operational environment and performance requirements. From engineering consultations to modification support and retesting, we help optimize your product design for seamless compliance.",
      },
    ],
    labTesting: {
      col1Header: "Emissions",
      col2Header: "Immunity",
      col1: ["CE101", "CE102", "CE106", "RE101", "RE102", "RE103"],
      col2: ["CS101", "CS114", "CS115", "CS116", "CS118", "RS101", "RS103"],
    },
    additionalServices: [
      "Expert Training Courses",
      "Product Testing & Review",
      "EMC Test Procedure Development",
      "EMI Troubleshooting Review",
    ],
  },
  {
    slug: "civilian",
    name: "Civilian Domain",
    tagline: "Confidently navigate civilian compliance.",
    body: "Trust in our expertise to navigate the complexities of civilian domain regulations, ensuring your products meet all necessary compliance requirements.",
    icon: "cpu",
    image: "/images/civilianDomain.webp",
    gallery: [
      "/images/civilian/Civil.webp",
      "/images/civilian/EST%20.webp",
      "/images/civilian/IMG_20240418_173040.webp",
      "/images/civilian/IMG_20240418_175038.webp",
    ],
    spec: "COMPLIANT",
    stats: [
      { label: "Accreditation", value: "ISO 17025" },
      { label: "Lab Hours", value: "24 \u00d7 6" },
      { label: "Chamber", value: "CSAC / VSAC" },
    ],
    detailedDescription:
      "At CCTL, we specialize in offering comprehensive EMI Test & Measurement Services that adhere to a wide range of National, International, and Vendor-Specific Standards. Our facilities are ISO/IEC 17025 accredited, ensuring the highest level of quality and reliability. With state-of-the-art laboratories equipped with cutting-edge facilities, we provide thorough evaluation services for EMI EMC. Our radiated test facility features a shielded semi-anechoic chamber designed to support 3-meter measurements. Equipped with an automated turntable and an antenna mast capable of supporting a 1 to 4-meter height scan, this facility ensures precise testing conditions. CCTV monitoring facilities enable accurate monitoring of equipment performance during tests. Our chamber can accommodate equipment weighing up to 3 tons within a 2-meter diameter and 2-meter height. Since its commissioning in 2022, we are capable of conducting both immunity and emission measurements up to 48 GHz.",
    valueProps: [
      {
        title: "Electrical Fast Transient Test",
        body: "Comprehensive EFT testing to evaluate your product's immunity to fast transient electrical disturbances.",
      },
      {
        title: "Harmonics & Flicker Emission Test",
        body: "Testing harmonic current emissions and voltage fluctuations to ensure grid compatibility.",
      },
      {
        title: "Conducted RF Emission Test",
        body: "Measuring conducted RF emissions on power and signal lines per civilian standards.",
      },
      {
        title: "Surge Test",
        body: "Evaluating product immunity to high-energy transient surges on power and signal lines.",
      },
    ],
    serviceOfferings: [
      {
        title: "We provide you innovation",
        body: "Our conducted immunity laboratory is equipped with generators capable of conducting various tests including conducted RF, Surge, EFT, Voltage Dips, and ESD.",
      },
      {
        title: "Conducted Emission Laboratory",
        body: "We provide facilities for Conducted RF Emission, Harmonics, and Flicker Emission tests based on commonly followed civilian standards under IEC, EN, CISPR, FCC, ISO, BIS, and many others. Additionally, we provide Power Frequency Magnetic Field Immunity Tests and Radiated Power Disturbance Test Facilities.",
      },
      {
        title: "Comprehensive Compliance Testing",
        body: "CCTL's conducted immunity laboratory is equipped with state-of-the-art generators capable of conducting a wide array of tests, including conducted RF, Surge, EFT, Voltage Dips, and ESD. Our facility offers comprehensive testing for Electrical Fast Transient Testing (EFT), Voltage Dips, Short Interruptions & Voltage Variations, and Surge Testing, ensuring thorough evaluation of your devices' immunity to electrical disturbances.",
      },
    ],
    labTesting: {
      col1Header: "Emissions",
      col2Header: "Immunity",
      col1: [
        "EN55014",
        "EN55022",
        "CISPR 11",
        "CISPR 14",
        "CISPR 22",
        "CISPR 15",
        "CISPR 32",
        "IEC 61000-3-2",
        "IEC 61000-3-3",
      ],
      col2: [
        "CISPR 35",
        "IEC 61000-4-2 (ESD)",
        "IEC 61000-4-3 (Radiated Field Immunity)",
        "IEC 61000-4-4 (Electrical Fast Transients)",
        "IEC 61000-4-5 (Surge)",
        "IEC 61000-4-6 (Conducted Immunity)",
        "IEC 61000-4-8 (Power Magnetic Field)",
        "IEC 61000-4-9 (Pulse Magnetic Field)",
        "IEC 61000-4-11 (Voltage Dips and Interruptions)",
        "IEC 61000-4-13 (Harmonic and Interharmonics)",
        "IEC 61000-4-14 (Voltage Fluctuation Immunity)",
        "IEC 61000-4-17 (DC Ripple Immunity)",
      ],
    },
  },
  {
    slug: "automotive",
    name: "Automotive Domain",
    tagline: "Validated technologies, industry-grade standards.",
    body: "Drive innovation forward with confidence as we validate the compliance of your automotive technologies, adhering to rigorous industry standards with our Expert Automotive Electromagnetic Compatibility (EMC).",
    icon: "car",
    image: "/images/automotive.webp",
    gallery: [
      encodeURI("/images/automotive/Transient pulse on supply lines.webp"),
      encodeURI("/images/automotive/Transient on signal lines.webp"),
      encodeURI("/images/automotive/RE main pic .webp"),
      encodeURI("/images/automotive/receiver with software setup.webp"),
    ],
    spec: "48 GHz",
    stats: [
      { label: "Turntable", value: "2m" },
      { label: "Chamber", value: "VSAC" },
      { label: "Standard", value: "CISPR 25" },
    ],
    detailedDescription:
      "At Cosmic Compliance Test Lab (CCTL), we specialize in providing comprehensive testing solutions and consultancy services tailored specifically for the automotive industry. With our state-of-the-art facilities and experienced team of engineers, we ensure that automotive systems and electronic components meet the highest standards of quality, reliability, and regulatory compliance. At the heart of our automotive domain services lies our extensive electromagnetic compatibility (EMC) testing capabilities. With RF emission and immunity measurement systems covering a broad frequency range, radiated emission and immunity testing facilities, bulk current injection (BCI) testing, conducted emission testing, and electrostatic discharge (ESD) testing, we offer comprehensive solutions to assess and validate the EMC performance of automotive systems and components.",
    valueProps: [
      {
        title: "RF Emission Measurement Systems",
        body: "Comprehensive RF emission measurement covering broad frequency ranges for automotive electronics.",
      },
      {
        title: "RF Immunity Measurement Systems",
        body: "Testing immunity of automotive components against radio frequency interference.",
      },
      {
        title: "Radiated Emission & Immunity Testing",
        body: "Full radiated emission and immunity testing in our Vehicle Semi-Anechoic Chamber (VSAC).",
      },
      {
        title: "Electrostatic Discharge (ESD) Test",
        body: "ESD testing as per ISO 10605 to validate your automotive electronics against static discharge.",
      },
    ],
    labTesting: {
      col1Header: "Emissions",
      col2Header: "Immunity",
      col1: ["CISPR 25", "CISPR 12", "AIS 004", "ECE R10"],
      col2: ["ISO 11451-2", "ISO 11451-4", "ISO 11452-2", "ISO 11452-4", "ESD as per ISO 10605"],
    },
  },
  {
    slug: "railway",
    name: "Railway Domain",
    tagline: "Safety and reliability on every track.",
    body: "Stay on track with regulatory compliance for your railway technologies, guaranteeing safety and reliability through meticulous EMC testing protocols.",
    icon: "train",
    image: "/images/domain-railways.webp",
    gallery: [
      "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
      "/images/railway/Railway-service-1.jpg",
      "/images/railway/railway-service-2-1.jpg",
      "/images/railway/railway-service-4-2.webp",
    ],
    spec: "EN 50121",
    stats: [
      { label: "Standard", value: "EN 50121" },
      { label: "Frequency Range", value: "10 kHz – 40 GHz" },
      { label: "Chamber", value: "CSAC" },
    ],
    detailedDescription:
      "CCTL is the preeminent choice for EMC testing in the railway sector, boasting unparalleled expertise and cutting-edge facilities. We meticulously measure and monitor electromagnetic emissions, adhering to stringent international standards such as IEC 60571, IEC 62236 3-1,2, IEC 62236-4 & 5, and the EN 50121 series. Our state-of-the-art laboratories feature expansive EMC test chambers designed to accommodate all locomotive subsystems, ensuring comprehensive evaluation regardless of product size or complexity. Backed by a team of seasoned railway compliance specialists, we provide comprehensive guidance on all aspects of EMC compliance, offering flexible testing options at manufacturers' sites or on-site for large-scale products and infrastructure.",
    valueProps: [
      {
        title: "Customized Testing Solutions",
        body: "Tailored testing solutions specific to your railway product requirements and standards.",
      },
      {
        title: "Comprehensive Reporting",
        body: "Detailed EMC test reports with precise measurement data to support your certification process.",
      },
      {
        title: "Global Compliance Expertise",
        body: "Expert navigation of international railway EMC standards across multiple jurisdictions.",
      },
      {
        title: "Regulatory Updates and Training",
        body: "Specialized training and updates on evolving railway compliance requirements.",
      },
    ],
    labTesting: {
      col1Header: "RDSO Standard",
      col2Header: "Application",
      col1: [
        "BS EN 50121-3-1",
        "BS EN 50121-3-2",
        "BS EN 50121-4",
        "BS EN 50121-5",
        "BS EN 50155",
        "IEC 60571",
        "IEC 62236-3-1",
        "IEC 62236-3-2",
        "IEC 62236-4",
        "IEC 62236-5",
      ],
      col2: [
        "Rolling Stock – Apparatus",
        "Signalling & Telecommunications Apparatus",
        "Fixed power supply installations & Apparatus",
        "Electronic equipment used on Rolling stock",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    },
  },
  {
    slug: "telecom-wireless",
    name: "Telecom and Wireless Domain",
    tagline: "Seamless, certified connectivity.",
    body: "Seamlessly connect with your audience as we certify the compliance of your telecom and wireless devices, enabling you to deliver cutting-edge solutions with peace of mind.",
    icon: "radio",
    image: "/images/domain-telecom.webp",
    gallery: [
      "/images/telecom-wireless/DSC08033.webp",
      "/images/telecom-wireless/DSC08114.webp",
      "/images/telecom-wireless/DSC08115.webp",
      "/images/telecom-wireless/Picture1.jpg",
    ],
    spec: "CE / FCC",
    stats: [
      { label: "Standard", value: "CE / FCC" },
      { label: "Frequency Range", value: "Up to 48 GHz" },
      { label: "Chamber", value: "CSAC" },
    ],
    detailedDescription:
      "At CCTL, we are dedicated to helping our clients navigate the complexities of wireless device testing and certification, ensuring compliance with regulatory requirements and industry standards. With our state-of-the-art facilities and experienced team, we are your trusted partner for ensuring the safety and performance of wireless devices. The EMC/EMI test lab facility would also cover tests on various low-power wireless devices that are widely used in IT and Electronic where EMC is essential to comply with WPC requirements for satisfactory remote operations as per IS/IEC/EN/WPC/TEC requirements. Our test facility is equipped to examine the operations, performance, and safety of wireless devices, ensuring compliance with regulatory standards and guidelines. By conducting comprehensive testing, we assess the electromagnetic radiation levels emitted by wireless devices and verify their compliance with safety regulations. Our goal is to provide manufacturers and developers of wireless devices with the assurance that their products meet the necessary safety standards and regulations. By partnering with CCTL for wireless device testing, companies can demonstrate their commitment to safety and ensure the reliability and performance of their products on the market.",
    valueProps: [
      {
        title: "Wi-Fi routers/modems",
        body: "Testing and certification of Wi-Fi routers and modems for WPC compliance and electromagnetic safety.",
      },
      {
        title: "Wireless headphones",
        body: "Comprehensive testing of wireless headphones for RF emissions and regulatory compliance.",
      },
      {
        title: "Wireless smartwatches",
        body: "Evaluating wireless smartwatch devices for EMC performance and safety standards.",
      },
      {
        title: "Wi-Fi USB pen drives",
        body: "Testing Wi-Fi USB devices for compliance with WPC standards and regulations.",
      },
    ],
    serviceOfferings: [
      {
        title: "CCTL Offers top testing facilities",
        body: "The current test facility at Cosmic Compliance Test Lab (CCTL) primarily focuses on testing wireless and Bluetooth devices in accordance with the requirements of Wireless Planning and Coordination (WPC) under the Ministry of Communication and Information Technology.",
      },
      {
        title: "Comprehensive Testing & Certification",
        body: "Our lab is equipped with state-of-the-art testing equipment and facilities to ensure that wireless devices comply with WPC standards and regulations. We offer testing services that assess the performance, functionality, and safety of wireless devices, helping manufacturers meet the necessary compliance requirements.",
      },
      {
        title: "Trusted Partner for WPC Approval",
        body: "At CCTL, we are committed to providing comprehensive testing and certification services to help manufacturers navigate regulatory requirements and ensure the quality and compliance of their wireless devices. Our experienced team and advanced testing facilities make us a trusted partner for manufacturers seeking WPC approval for their wireless products.",
      },
    ],
    labTesting: {
      col1Header: "Standards",
      col2Header: "Applicable Products",
      col1: [
        "TEC_SD_DD_EMC_221_05",
        "ETSI EN 300 220",
        "ETSI EN 300 330",
        "ETSI EN 300 328",
        "ETSI EN 301 908",
        "ETSI EN 301 893",
        "ETSI EN 301 511",
        "ETSI EN 302 502",
      ],
      col2: [
        "Telecommunication",
        "Radio Short Range Devices",
        "Wideband transmission",
        "IMT cellular networks",
        "5 GHz RLAN",
        "GSM & Mobile Station",
        "Wireless Access Systems",
        "",
      ],
    },
  },
];

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

export const blogPlaceholders: BlogPost[] = [
  {
    slug: "driving-global-sustainability",
    image: "/images/blog1.jpg",
    title: "EMC Testing and Global Sustainability",
    subtitle:
      "How EMC Testing Experts at Cosmic Compliance Test Lab Contribute to Emission Reduction",
    ghostWord: "SUSTAIN",
    body: [
      "While technology has enabled growth and advancement, it also leads to ecological problems. One of these problems is the electromagnetic interference caused by modern devices. This electromagnetic interference if not regulated well leads to energy inefficiency. This is where the Cosmic Compliance Test Lab comes into the picture.",
      "Cosmic Compliance Test Lab is an Electromagnetic Compatibility testing facility. With a strong commitment to achieving global sustainability, it aims to achieve it through advanced EMC testing and compliance services. With the advanced technologies that the EMC testing professionals use here, product developers can ensure compliance with regulatory requirements about emissions.",
      "![EMC Testing and Global Sustainability](/images/global_sustainability.jpg)",
      "## EMC Testing - Meaning and Importance",
      "EMC testing is the process of checking the functioning of electronic devices and ensuring that they are working within their electromagnetic environment without interfering with other devices in their range. The testing process generally has two main aspects:",
      "- Emission testing — Measure the electromagnetic energy that an electronic device is introducing in its environment.",
      "- Immunity testing — Check the resistance that an electronic device has towards interference from outside sources.",
      "Unregulated electromagnetic emissions interfere with other devices. Such interference can lead to malfunctioning in the main device. Non-EMC compliant devices are also energy inefficient. They consume more power while also causing increased emissions.",
      "## The Link between EMC Testing and Emission Reduction",
      "When a device has a poor EMC performance, it is not efficient when it comes to energy consumption and usage. Such a device causes energy leakage. This leakage translates to wasted power and increased emission of greenhouse gases. But, with proper EMC testing, it is possible to reduce such emissions.",
      "There is a direct link between EMC testing and emission reduction. The testing helps ensure that the devices are functioning within the prescribed emission limits and transmitting signals in an optimized manner thereby reducing unnecessary energy usage. It also helps promote sustainable manufacturing and better product lifecycle management.",
      "## How Cosmic Compliance Contributes to Global Sustainability",
      "The lab offers a full suite of EMC testing services, including:",
      "- Full EMC Testing Suite — Covering radiated and conducted emissions, immunity tests, ESD, surge, EFT, and more.",
      "- Accredited EMC Laboratory — Recognized under international standards for precision and reliability.",
      "- State-of-the-Art Equipment — Featuring anechoic chambers, spectrum analysers, and signal generators aligned with industry benchmarks.",
      "### Standards Adherence",
      "- CISPR 11/22/32 for IT and multimedia equipment",
      "- IEC 61000 series for immunity testing",
      "- MIL-STD-461 for defence electronics",
      "## Real Impact: Helping Clients Achieve Certification and Emission Goals",
      "Cosmic Compliance Test Lab has led to real impact within all kinds of industries including automotive, medical, electronics, telecommunications, and IoT industries. With the lab, you get expert guidance for all kinds of EMC testing leading to shorter time to market through faster compliance.",
      "## Why Choose Cosmic Compliance for EMC Testing?",
      "- In-House Experts: Engineers with deep knowledge of EMC compliance, product design, and sustainability.",
      "- Fast Turnaround Times: Optimized workflows to deliver results without compromising accuracy.",
      "- Support for Global Certifications: Help with CE, FCC, BIS, and other international marks.",
      "- Sustainability-Focused Consulting: Recommendations on how to reduce emissions through better EMC design and material choices.",
      "## Conclusion",
      "EMC testing is not a simple regulatory need. It is a tool that can promote long-term sustainability. It helps improve the efficiency of electronic devices along with energy waste reduction. EMC testing is an essential step toward environmental stewardship. If you are seeking to contribute to it, you can partner with Cosmic Compliance Test Lab.",
    ],
  },
  {
    slug: "emc-testing-early-in-design",
    image: "/images/blog2.jpg",
    title: "EMC Testing in Product Design",
    subtitle: "with Cosmic Compliance Test Lab",
    ghostWord: "DESIGN",
    body: [
      "EMC (Electromagnetic Compatibility) testing is essential for ensuring that electronic devices operate smoothly without causing interference to other devices—or being affected by it. It is the backbone of device reliability in today's interconnected world.",
      "![EMC Testing in Product Design](/images/EMC_product_design.jpg)",
      "## Importance in Product Design",
      "Conducting EMC testing for electronics early in the design process can save your business from costly delays, design overhauls, and compliance headaches. By addressing potential interference issues early, you can streamline your product's path to market and ensure smoother operations down the line.",
      "## What is EMC Testing?",
      "EMC testing involves assessing a product's ability to function without generating electromagnetic interference (EMI) and its resilience to electromagnetic susceptibility (EMS). This testing ensures that the product complies with industry regulatory standards for safety and reliability. At Cosmic Compliance Test Lab (CCTL), we specialize in providing thorough EMC testing to guarantee that your product meets all necessary requirements.",
      "### Why It Matters",
      "Neglecting EMC testing can lead to product failures, safety risks, and non-compliance with regulatory standards, potentially resulting in expensive fines and delays. CCTL helps you avoid these issues by ensuring your product is ready for the market.",
      "## Benefits of EMC Testing Early in the Design Stage",
      "- Identifying Issues Early — Performing EMC testing early helps uncover potential interference problems at the beginning of the design phase. This allows you to make quick adjustments, saving time and preventing costly revisions later.",
      "- Compliance with EMC Testing Standards — Conducting EMC testing ensures your product meets essential regulatory standards, such as FCC and CE. Early testing ensures compliance and helps avoid delays, fines, or product recalls.",
      "- Optimized Product Design — Early EMC testing helps pinpoint and fix design issues that may lead to interference. This ensures the product works efficiently, improving overall performance and reliability.",
      "- Faster Time to Market — Tackling potential EMC issues early allows you to simplify the certification process. This results in quicker approvals, allowing your product to enter the market faster.",
      "- Cost Savings — Detecting issues early in the design stage prevents the need for expensive changes during or after production. Early EMC testing reduces the risk of costly redesigns and helps you stay within budget.",
      "## EMC Testing Standards and Regulatory Requirements",
      "### Overview of EMC Testing Standards",
      "EMC testing standards, such as IEC 61000, EN 55022, and CISPR 32, are guidelines that ensure electronic products do not interfere with other devices and can operate without issues. These standards apply to various industries, including electronics, automotive, and healthcare.",
      "### Regulatory Compliance",
      "Meeting EMC testing standards is essential for obtaining regulatory approvals like CE marking or FCC certification. These approvals are required for legal sale and distribution. Failing to meet these standards can lead to fines, product recalls, or market delays.",
      "## Conclusion",
      "Conducting EMC testing early in the design phase helps identify potential issues, ensuring compliance, reducing costs, and speeding up certification. By addressing problems upfront, you can avoid costly delays and ensure your product works as intended.",
      "Don't let EMC issues hold up your product launch. Contact Cosmic Compliance Test Lab today for expert EMC testing services and ensure your product meets all regulatory standards.",
    ],
  },
  {
    slug: "emi-and-emc-testing",
    image: "/images/blog3.jpeg",
    title: "EMI and EMC Testing",
    subtitle: "Why Does EMC Compliance Matter for Your Products?",
    ghostWord: "EMI / EMC",
    body: [
      "Have you ever noticed why at times your phone or your laptop slows down or malfunctions? Well, that often happens due to electromagnetic interference (EMI). In simple terms, EMI occurs when electronic devices unintentionally disrupt each other's performance due to unwanted electromagnetic signals in the environment. This is why EMI and EMC testing play a critical role—they help identify, control, and eliminate such interference to ensure devices function reliably and meet regulatory standards.",
      "Now this is where electromagnetic compatibility (EMC) comes into the picture. EMC sees to it that electronic products work smoothly within their environment. It means that the devices should not interfere with the performance of other devices. It also means they don't get disturbed by external signals.",
      "EMC compliance is not just about meeting regulations. It has a great deal to do with costly product recalls, customer dissatisfaction and obviously, safety risks. Imagine, if a medical device malfunctions due to interference. It can lead to serious consequences.",
      "![EMI and EMC Testing](/images/EMI_and_EMC.jpeg)",
      "## What is EMI (Electromagnetic Interference)?",
      "Whenever you find a device malfunctioning or acting unusually, it is most likely because of EMI. Unwanted electromagnetic energy can create disturbances in the normal operation of the devices. This electromagnetic energy can come from any source—through lightning, or manmade sources like power grids, radio signals etc.",
      "### Common sources of Electromagnetic Interference",
      "- High voltage power lines and electric circuits generate electromagnetic fields that can interfere with nearby electronic devices causing malfunctions.",
      "- Devices like mobile phones, wifi routers and radio towers constantly release electromagnetic waves that can create disturbances in equipment on similar frequencies.",
      "- Appliances like refrigerators and microwaves, or industrial heavy machinery produce electromagnetic noise leading to potential EMI issues.",
      "- Electrical systems in vehicles and high-tech navigation systems can generate interference that affects other systems.",
      "## What is EMC (Electromagnetic Compatibility)?",
      "Electromagnetic compatibility is a device's ability to work properly. This means that the device should not get affected by any interference. An EMC compliant device:",
      "- Does not emit excessive electromagnetic waves that disturbs nearby devices.",
      "- Is strong enough to fight interference from other electronic sources.",
      "EMC is usually made of two main components: Emissions and Immunity. Every electronic device releases some amount of electromagnetic waves, but these emissions should not exceed a limit that is harmful for other devices. Immunity means how well a device can resist electromagnetic interference.",
      "## The Importance of EMC Testing for Your Products",
      "### Ensures Reliable Performance",
      "Electronic devices do not just operate in isolation. Every device is surrounded by many other devices that generate electromagnetic waves. While products may look fine in controlled labs, they might fail to actually work in real world conditions. EMI and EMC testing helps manufacturers identify the potential risks and eliminate them.",
      "### Helps Avoid Legal Issues",
      "Government agencies and regulatory bodies are quite strict about EMI and EMC compliance. Any products that fail to comply can face legal actions. Different regions have their own regulatory requirements.",
      "### Increases Product Reputation and Customer Trust",
      "Proper EMI and EMC testing can:",
      "- Reduce risk of product failures",
      "- Minimize returns and customer complaints",
      "- Build brand trust and performance",
      "## Why Choose Cosmic Compliance Test Lab for EMC Testing?",
      "Cosmic Compliance Test Lab specialises in EMC testing. We offer the best services and expertise to guarantee all your products meet the compliance standards. Our thorough EMI and EMC testing solutions are a perfect fit for various industries including industrial, automotive, scientific and medical sectors.",
      "We focus on customer satisfaction. Our aim is to make sure your devices work correctly within its environments. We have an expert team of seasoned professionals who are dedicated to delivering high quality testing services.",
      "## Conclusion",
      "We live in a world where we cannot imagine a second without electronic devices. We are so dependent on electronics that a minor disruption can result in serious effects. Hence, EMI and EMC testing is more important than ever now. Investment in a reliable EMC testing service is a smart business move. It protects you and your business for the future.",
    ],
  },
  {
    slug: "emi-vs-emc",
    image: "/images/blog4.webp",
    title: "EMI vs EMC Key Differences and Their Importance",
    subtitle: "EMI vs EMC: Understanding the Key Differences and Their Importance in Electronics",
    ghostWord: "COMPARE",
    body: [
      "Technology is upgrading with each passing day. Electronic devices are getting more convenient but complex. And, any evolution comes with its unique set of challenges. Hence, management of electromagnetic phenomena is essential so that it does not mess up the performance of devices. It is important for devices to work properly. So, you need to consider how they behave within their electromagnetic environment.",
      "The two main concepts to factor in are Electromagnetic Interference (EMI) and Electromagnetic Compatibility (EMC). EMI is any unwanted barrier that affects the performance of devices. And, EMC is like an antidote. It makes sure that a device operates properly within its electromagnetic environment without any obstacles.",
      "![EMI vs EMC Key Differences](/images/EMC_vs_EMC.jpeg)",
      "## What is Electromagnetic Interference (EMI)?",
      "Electromagnetic interference (EMI) is any interference caused by an outside or inside source within a circuit. This disturbance causes the electronics to function poorly or stop working.",
      "EMI can be caused by both outside and inside factors. Natural events like lightning or solar flares can generate high electromagnetic waves. This can result in disturbances in the devices. Man made sources like power grids, electronic devices and wireless communication systems can also affect the functioning of devices.",
      "Essentially there are two types of EMIs, radiated and conducted. When electromagnetic waves travel through air and disturbs the operation of nearby devices it is known as radiated EMI. Conducted EMI, as the name suggests, travels via electrical conductors like wires and cables. This causes disturbances in connected systems.",
      "## What is Electromagnetic Compatibility (EMC)?",
      "Electromagnetic Compatibility indicates the electronic devices functioning properly without any interference. It makes sure that devices work correctly in electromagnetic environments without affecting each other's performance.",
      "There are two main aspects of EMC. Emissions and Immunity. Emission relates to the electromagnetic energy released by a device into its surroundings. Immunity is a device's ability to tolerate this interference without affecting the device's performance.",
      "## The Key Differences between EMI and EMC",
      "| Factor | EMI | EMC",
      "| Focus | Centers around disturbances caused by high electromagnetic waves | Deals with the disturbances so that devices function properly",
      "| Objective | Aims to minimize the obstacles caused by electromagnetic waves | Enables devices to coexist in electromagnetic environments without causing disruptions",
      "| Impact on Devices | Can lead to devices malfunctioning, drop in performance or even stop working | Makes sure that devices can resist interference and operate correctly",
      "| Relevance | Attempts to control emissions and reduce interference issues | Keeps balance in emissions and immunity. Aims to meet testing standards",
      "## Why are EMI and EMC critical in electronics design?",
      "EMI and EMC both are critical in the design of electronic systems to maintain performance, functionality and safety. An uncontrolled EMI can greatly affect a device's performance. This can cause signal loss, malfunction or complete system failure.",
      "Safety is a big concern when using electronic devices. EMI can cause dangerous situations especially in the case of medical and automotive devices. For example, any malfunction with a pacemaker can cost a patient their life. Similarly in automotive, EMI can lead to accidents.",
      "## Why is it required for EMC and EMI to comply with Industry Standards?",
      "### EMI Standards",
      "EMI needs to comply with standards like CISPR, IEC, and FCC. These standards set a permissible limit to electromagnetic emission from devices. In case of failure to meet these standards, it can result in huge fines, exclusion from the market, and product recall.",
      "### EMC Standards",
      "EMC standards include CE marking and UL certification. This standard makes sure that devices work without causing electromagnetic disturbance. The products need to comply with legal and regulatory requirements.",
      "## Strategies for Minimizing EMI in Electronics",
      "| Strategy | Description",
      "| Shielding | Materials like metal enclosures, conductive coating and shields can block radiated EMI. It absorbs or reflects electromagnetic waves and protects the system.",
      "| Filtering | Low pass or High pass EMI filters can reduce EMI on power lines and cables. The filters stop unwanted frequencies from going in and out of the device.",
      "| Grounding | Proper grounding reduces noise. It cleans signal flow and reduces EMI in sensitive circuits.",
      "| Layout and Design | Optimizing Printed Circuit Board (PCB) can minimize internal sources of EMI. It includes separating high and low frequency circuits.",
      "## Ensuring EMC in Electronic Devices",
      "### Design for Immunity",
      "To make your device immune to interferences, efficient components, grounding methods and filters are necessary. Shielding and PCB is also important to prevent disturbances and maintain performance.",
      "### Testing for EMC",
      "EMC testing makes sure that devices are following standards. This helps systems perform well in real world conditions. Testing methods like radiated emissions testing, conducted testing and immunity testing is pivotal.",
      "## Common Challenges",
      "- Devices are getting smaller and compact, packed intricately with components, hence more prone to EMI issues.",
      "- Wireless technologies and IoT devices are making management of EMI more complicated. These devices function on multiple frequency bands.",
      "- EMC and EMI standards vary depending on geographical regions. Like FCC in the U.S. or CE marking in Europe.",
      "## Future Trends in EMI and EMC Management",
      "As technology is evolving and devices getting more complex, better EMI and EMC management is essential. AI and machine learning can be leveraged to identify the challenges with EMC and EMI. Smart technologies like 5G and IoT will require even more sophisticated handling of EMI and EMC.",
      "## Conclusion",
      "EMI and EMC are both related but different phenomena. While EMI strictly works to reduce interference, EMC makes sure that devices can co exist in the same environment and work efficiently. Take action now and prioritize EMI and EMC concerns early in your design process.",
    ],
  },
  {
    slug: "how-to-pass-emc-test",
    image: "/images/blog5.jpeg",
    title: "How to Pass EMC Test: Expert Tips & Strategies",
    subtitle: "How to Pass EMC Test: Expert Tips & Strategies | Cosmic Compliance Test Lab",
    ghostWord: "PASS",
    body: [
      "The usage of electronic devices has escalated. People also look for ways to sync their devices with one another. However, syncing different devices can lead to electromagnetic interference (EMI), which can disrupt their proper functioning. This is where EMC (Electromagnetic Compatibility) testing comes in—ensuring that devices can operate harmoniously without causing or being affected by such interference.",
      "EMC testing is the process that saves unwanted electromagnetic interference between different devices. These tests are important to ensure the global success of any electronic product. EMC testing ensures the reliability and safety of products across different industries. These include the automotive, telecommunications, and consumer electronics industries.",
      "Cosmic Test Labs is a well-acknowledged name in this domain. It provides a wide range of EMC testing services. Additionally, you can get expert help throughout the product development cycle.",
      "![How to Pass EMC Test](/images/pass_EMC_test.jpeg)",
      "## Understanding EMC Testing",
      "### What is EMC Testing?",
      "EMC testing helps check the compatibility of electronic products with each other. It ensures that an electronic product doesn't radiate any electromagnetic energy emission. It also helps ensure that the product is immune to external electromagnetic interference.",
      "### Why is EMC Testing Important?",
      "- Regulatory Compliance — Many nations have strict regulations regarding EMC. Products must pass EMC tests before they reach the market. If your product fails these tests, the regulatory authorities can withhold its sale.",
      "- Product Reliability — Products that pass EMC tests are less likely to have unanticipated issues. This assures better product performance and less chance of mistakes.",
      "- Market Acceptance — Consumers and companies alike want dependable products. Meeting EMC criteria builds confidence and opens doors for entrance into new markets.",
      "- Cost Savings — Early identification of EMC issues helps companies avoid costly redesigns and product recalls.",
      "## Common Challenges and Failure Points in EMC Testing",
      "### Design Flaws",
      "Many times, problems start on the drawing board. A bad circuit design or arrangement might generate unwanted interference. For example, placing traces very close to one another may pick up stray signals. This can cause testing failures.",
      "### Inadequate Shielding and Grounding",
      "Shielding protects your electrical equipment much like building a barrier does. Without enough shielding, electromagnetic fields from the outside can interfere with your equipment. Your goods might also generate undesired noises. Grounding issues can create loops that pick up interference, further escalating the problem.",
      "### Component Selection",
      "Quality varies across different electronic components. Your product might not pass EMC tests if you use parts that produce high degrees of EMI. Selected components should be those meant to produce low EMI emissions.",
      "### Environmental Factors",
      "Sometimes the testing surroundings could be the main cause of issues. The outcomes vary depending on nearby electronic devices or temperature and humidity changes.",
      "## Best Practices and Preparation Strategies for EMC Testing",
      "### 1. Optimize PCB Design and Layout",
      "- Position high-frequency components away from sensitive analog circuitry.",
      "- Avoid clustering noisy components together.",
      "- Keep trace lengths as short as possible.",
      "- Avoid sharp angles or unnecessary bends in traces that may act as antennas.",
      "- Use multi-layer PCBs to facilitate natural electromagnetic shielding.",
      "- Incorporate dedicated ground and power planes to reduce crosstalk.",
      "### 2. Install Effective Shielding and Grounding",
      "- Use conductive enclosures to block both internal and external electromagnetic interference.",
      "- Shield cables and connectors in high-noise environments.",
      "- Ensure a continuous ground plane is present throughout the PCB.",
      "- Maintain low-impedance return paths for signals.",
      "- Isolate high-speed digital grounds from analog ground planes where applicable.",
      "### 3. Use Filtering and Decoupling Techniques",
      "- Add filters to power and signal lines to suppress noise transmission.",
      "- Use ferrite beads or LC filters where needed.",
      "- Place decoupling capacitors as close as possible to IC power pins.",
      "- Use multiple capacitors with varying values to handle a range of frequencies.",
      "### 4. Conduct Pre-Compliance Testing and Simulations",
      "- Run EMC tests in a controlled lab environment to identify potential weaknesses early in the design process.",
      "- Utilize electromagnetic simulation software to visualize and predict EMI behavior.",
      "- Address high-risk areas before committing to physical prototypes.",
      "- Use pre-test results to improve the design in stages.",
      "### 5. Maintain Thorough Documentation",
      "- Document all changes made during the design and testing process.",
      "- Record the purpose and impact of each modification.",
      "- Archive all formal and pre-compliance test reports.",
      "- Include measurements, observations, and pass/fail results.",
      "- Keep detailed notes on issues encountered during testing.",
      "## How Cosmic Labs Can Help You Pass EMC Testing",
      "### Expert Guidance",
      "Cosmic Labs is your EMC partner. The team has the backing of experts for managing EMC testing. Their work involves helping you throughout the product development lifecycle. They help with the design process and offer recommendations to resolve identified issues. With their expertise, you can save both time and money.",
      "### State-of-the-Art Testing Facilities",
      "Cosmic Labs offers state-of-the-art testing facilities furnished with modern measuring tools. The innovative facilities provide a testing environment identical to the real world. The use of modern tools and the latest technology helps ensure accuracy in testing.",
      "### Comprehensive Support",
      "- Pre-Compliance Consulting — Early design evaluation to find and fix issues before they get more serious.",
      "- In-Lab Testing — Applying strict testing methods under the direction of experienced experts.",
      "- Post-Test Analysis — A thorough report containing findings, explanations, and suggestions for product development.",
      "## Conclusion",
      "EMC compliance is not a test that your product needs to pass. It is rather something that certifies your product as safe and reliable. Each step matters, from the early design stage to the end of the certification process. So, knowing the challenges and best practices is important to avoid test failures. It can also save expensive delays in receiving certification.",
      "Contact Cosmic Labs now to get a free consultation. Start along the path toward perfect EMC compliance.",
    ],
  },
];

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
