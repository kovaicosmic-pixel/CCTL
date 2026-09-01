import type { ServiceDomain } from "./content";

type ServiceDetailFields = Pick<
  ServiceDomain,
  "detailedDescription" | "valueProps" | "serviceOfferings" | "labTesting" | "additionalServices"
>;

/** Heavy per-domain detail text — imported only by ServiceDetail.tsx so it
 *  doesn't ship to the Home/Services-index bundles, which only need the
 *  light fields in ./services-light. */
export const serviceDetails: Record<string, ServiceDetailFields> = {
  "mil-aero": {
    "detailedDescription": "Cosmic Compliance Test Lab (CCTL) is proud to be recognized as the nation's leader in MIL-STD-461 EMC testing, offering comprehensive EMC Testing services to meet the stringent requirements of this standard. Our capabilities extend across all revisions of MIL-STD-461, from C to G, ensuring that our clients receive accurate and reliable EMC testing results. At CCTL, we are fully equipped and capable of testing a wide range of components, including bench-top mounted or free-standing equipment, independent modules located inside electronic enclosures, and entire platforms such as aircraft or submarines with a power input current draw of up to 100 amps capacity. Moreover, our in-house laboratory is equipped to handle equipment weighing up to 3 tons, demonstrating our commitment to providing comprehensive testing solutions for various applications.",
    "valueProps": [
      {
        "title": "Reliable",
        "body": "Ensure consistent operation of military and aerospace equipment even in high-EMI environments, reducing the risk of malfunction."
      },
      {
        "title": "Compliant",
        "body": "Meet mandatory defense and aerospace standards, ensuring eligibility for military contracts and certifications."
      },
      {
        "title": "Interoperable",
        "body": "Guarantee seamless performance with other electronic systems and communication networks in multi-device operations."
      },
      {
        "title": "Safe",
        "body": "Protect mission-critical systems from electromagnetic disruptions that could lead to communication failure or system breakdown."
      }
    ],
    "serviceOfferings": [
      {
        "title": "Pre-Compliance Testing",
        "body": "Our pre-compliance testing services are designed to help you identify and resolve electromagnetic interference (EMI) issues early in the development cycle. This proactive approach reduces the risk of costly rework, project delays, and failed compliance in later stages."
      },
      {
        "title": "Full Compliance Testing",
        "body": "We provide full MIL-STD-461 compliance testing to ensure your products meet stringent military and aerospace electromagnetic compatibility requirements. Our comprehensive process includes both conducted and radiated emissions and susceptibility testing."
      },
      {
        "title": "Custom EMC Testing Solutions",
        "body": "We offer custom EMC testing services tailored to your product's specific operational environment and performance requirements. From engineering consultations to modification support and retesting, we help optimize your product design for seamless compliance."
      }
    ],
    "labTesting": {
      "col1Header": "Emissions",
      "col2Header": "Immunity",
      "col1": [
        "CE101",
        "CE102",
        "CE106",
        "RE101",
        "RE102",
        "RE103"
      ],
      "col2": [
        "CS101",
        "CS114",
        "CS115",
        "CS116",
        "CS118",
        "RS101",
        "RS103"
      ]
    },
    "additionalServices": [
      "Expert Training Courses",
      "Product Testing & Review",
      "EMC Test Procedure Development",
      "EMI Troubleshooting Review"
    ]
  },
  "civilian": {
    "detailedDescription": "At CCTL, we specialize in offering comprehensive EMI Test & Measurement Services that adhere to a wide range of National, International, and Vendor-Specific Standards. Our facilities are ISO/IEC 17025 accredited, ensuring the highest level of quality and reliability. With state-of-the-art laboratories equipped with cutting-edge facilities, we provide thorough evaluation services for EMI EMC. Our radiated test facility features a shielded semi-anechoic chamber designed to support 3-meter measurements. Equipped with an automated turntable and an antenna mast capable of supporting a 1 to 4-meter height scan, this facility ensures precise testing conditions. CCTV monitoring facilities enable accurate monitoring of equipment performance during tests. Our chamber can accommodate equipment weighing up to 3 tons within a 2-meter diameter and 2-meter height. Since its commissioning in 2022, we are capable of conducting both immunity and emission measurements up to 48 GHz.",
    "valueProps": [
      {
        "title": "Electrical Fast Transient Test",
        "body": "Comprehensive EFT testing to evaluate your product's immunity to fast transient electrical disturbances."
      },
      {
        "title": "Harmonics & Flicker Emission Test",
        "body": "Testing harmonic current emissions and voltage fluctuations to ensure grid compatibility."
      },
      {
        "title": "Conducted RF Emission Test",
        "body": "Measuring conducted RF emissions on power and signal lines per civilian standards."
      },
      {
        "title": "Surge Test",
        "body": "Evaluating product immunity to high-energy transient surges on power and signal lines."
      }
    ],
    "serviceOfferings": [
      {
        "title": "We provide you innovation",
        "body": "Our conducted immunity laboratory is equipped with generators capable of conducting various tests including conducted RF, Surge, EFT, Voltage Dips, and ESD."
      },
      {
        "title": "Conducted Emission Laboratory",
        "body": "We provide facilities for Conducted RF Emission, Harmonics, and Flicker Emission tests based on commonly followed civilian standards under IEC, EN, CISPR, FCC, ISO, BIS, and many others. Additionally, we provide Power Frequency Magnetic Field Immunity Tests and Radiated Power Disturbance Test Facilities."
      },
      {
        "title": "Comprehensive Compliance Testing",
        "body": "CCTL's conducted immunity laboratory is equipped with state-of-the-art generators capable of conducting a wide array of tests, including conducted RF, Surge, EFT, Voltage Dips, and ESD. Our facility offers comprehensive testing for Electrical Fast Transient Testing (EFT), Voltage Dips, Short Interruptions & Voltage Variations, and Surge Testing, ensuring thorough evaluation of your devices' immunity to electrical disturbances."
      }
    ],
    "labTesting": {
      "col1Header": "Emissions",
      "col2Header": "Immunity",
      "col1": [
        "EN55014",
        "EN55022",
        "CISPR 11",
        "CISPR 14",
        "CISPR 22",
        "CISPR 15",
        "CISPR 32",
        "IEC 61000-3-2",
        "IEC 61000-3-3"
      ],
      "col2": [
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
        "IEC 61000-4-17 (DC Ripple Immunity)"
      ]
    }
  },
  "automotive": {
    "detailedDescription": "At Cosmic Compliance Test Lab (CCTL), we specialize in providing comprehensive testing solutions and consultancy services tailored specifically for the automotive industry. With our state-of-the-art facilities and experienced team of engineers, we ensure that automotive systems and electronic components meet the highest standards of quality, reliability, and regulatory compliance. At the heart of our automotive domain services lies our extensive electromagnetic compatibility (EMC) testing capabilities. With RF emission and immunity measurement systems covering a broad frequency range, radiated emission and immunity testing facilities, bulk current injection (BCI) testing, conducted emission testing, and electrostatic discharge (ESD) testing, we offer comprehensive solutions to assess and validate the EMC performance of automotive systems and components.",
    "valueProps": [
      {
        "title": "RF Emission Measurement Systems",
        "body": "Comprehensive RF emission measurement covering broad frequency ranges for automotive electronics."
      },
      {
        "title": "RF Immunity Measurement Systems",
        "body": "Testing immunity of automotive components against radio frequency interference."
      },
      {
        "title": "Radiated Emission & Immunity Testing",
        "body": "Full radiated emission and immunity testing in our Vehicle Semi-Anechoic Chamber (VSAC)."
      },
      {
        "title": "Electrostatic Discharge (ESD) Test",
        "body": "ESD testing as per ISO 10605 to validate your automotive electronics against static discharge."
      }
    ],
    "labTesting": {
      "col1Header": "Emissions",
      "col2Header": "Immunity",
      "col1": [
        "CISPR 25",
        "CISPR 12",
        "AIS 004",
        "ECE R10"
      ],
      "col2": [
        "ISO 11451-2",
        "ISO 11451-4",
        "ISO 11452-2",
        "ISO 11452-4",
        "ESD as per ISO 10605"
      ]
    }
  },
  "railway": {
    "detailedDescription": "CCTL is the preeminent choice for EMC testing in the railway sector, boasting unparalleled expertise and cutting-edge facilities. We meticulously measure and monitor electromagnetic emissions, adhering to stringent international standards such as IEC 60571, IEC 62236 3-1,2, IEC 62236-4 & 5, and the EN 50121 series. Our state-of-the-art laboratories feature expansive EMC test chambers designed to accommodate all locomotive subsystems, ensuring comprehensive evaluation regardless of product size or complexity. Backed by a team of seasoned railway compliance specialists, we provide comprehensive guidance on all aspects of EMC compliance, offering flexible testing options at manufacturers' sites or on-site for large-scale products and infrastructure.",
    "valueProps": [
      {
        "title": "Customized Testing Solutions",
        "body": "Tailored testing solutions specific to your railway product requirements and standards."
      },
      {
        "title": "Comprehensive Reporting",
        "body": "Detailed EMC test reports with precise measurement data to support your certification process."
      },
      {
        "title": "Global Compliance Expertise",
        "body": "Expert navigation of international railway EMC standards across multiple jurisdictions."
      },
      {
        "title": "Regulatory Updates and Training",
        "body": "Specialized training and updates on evolving railway compliance requirements."
      }
    ],
    "labTesting": {
      "col1Header": "RDSO Standard",
      "col2Header": "Application",
      "col1": [
        "BS EN 50121-3-1",
        "BS EN 50121-3-2",
        "BS EN 50121-4",
        "BS EN 50121-5",
        "BS EN 50155",
        "IEC 60571",
        "IEC 62236-3-1",
        "IEC 62236-3-2",
        "IEC 62236-4",
        "IEC 62236-5"
      ],
      "col2": [
        "Rolling Stock – Apparatus",
        "Signalling & Telecommunications Apparatus",
        "Fixed power supply installations & Apparatus",
        "Electronic equipment used on Rolling stock",
        "",
        "",
        "",
        "",
        "",
        ""
      ]
    }
  },
  "telecom-wireless": {
    "detailedDescription": "At CCTL, we are dedicated to helping our clients navigate the complexities of wireless device testing and certification, ensuring compliance with regulatory requirements and industry standards. With our state-of-the-art facilities and experienced team, we are your trusted partner for ensuring the safety and performance of wireless devices. The EMC/EMI test lab facility would also cover tests on various low-power wireless devices that are widely used in IT and Electronic where EMC is essential to comply with WPC requirements for satisfactory remote operations as per IS/IEC/EN/WPC/TEC requirements. Our test facility is equipped to examine the operations, performance, and safety of wireless devices, ensuring compliance with regulatory standards and guidelines. By conducting comprehensive testing, we assess the electromagnetic radiation levels emitted by wireless devices and verify their compliance with safety regulations. Our goal is to provide manufacturers and developers of wireless devices with the assurance that their products meet the necessary safety standards and regulations. By partnering with CCTL for wireless device testing, companies can demonstrate their commitment to safety and ensure the reliability and performance of their products on the market.",
    "valueProps": [
      {
        "title": "Wi-Fi routers/modems",
        "body": "Testing and certification of Wi-Fi routers and modems for WPC compliance and electromagnetic safety."
      },
      {
        "title": "Wireless headphones",
        "body": "Comprehensive testing of wireless headphones for RF emissions and regulatory compliance."
      },
      {
        "title": "Wireless smartwatches",
        "body": "Evaluating wireless smartwatch devices for EMC performance and safety standards."
      },
      {
        "title": "Wi-Fi USB pen drives",
        "body": "Testing Wi-Fi USB devices for compliance with WPC standards and regulations."
      }
    ],
    "serviceOfferings": [
      {
        "title": "CCTL Offers top testing facilities",
        "body": "The current test facility at Cosmic Compliance Test Lab (CCTL) primarily focuses on testing wireless and Bluetooth devices in accordance with the requirements of Wireless Planning and Coordination (WPC) under the Ministry of Communication and Information Technology."
      },
      {
        "title": "Comprehensive Testing & Certification",
        "body": "Our lab is equipped with state-of-the-art testing equipment and facilities to ensure that wireless devices comply with WPC standards and regulations. We offer testing services that assess the performance, functionality, and safety of wireless devices, helping manufacturers meet the necessary compliance requirements."
      },
      {
        "title": "Trusted Partner for WPC Approval",
        "body": "At CCTL, we are committed to providing comprehensive testing and certification services to help manufacturers navigate regulatory requirements and ensure the quality and compliance of their wireless devices. Our experienced team and advanced testing facilities make us a trusted partner for manufacturers seeking WPC approval for their wireless products."
      }
    ],
    "labTesting": {
      "col1Header": "Standards",
      "col2Header": "Applicable Products",
      "col1": [
        "TEC_SD_DD_EMC_221_05",
        "ETSI EN 300 220",
        "ETSI EN 300 330",
        "ETSI EN 300 328",
        "ETSI EN 301 908",
        "ETSI EN 301 893",
        "ETSI EN 301 511",
        "ETSI EN 302 502"
      ],
      "col2": [
        "Telecommunication",
        "Radio Short Range Devices",
        "Wideband transmission",
        "IMT cellular networks",
        "5 GHz RLAN",
        "GSM & Mobile Station",
        "Wireless Access Systems",
        ""
      ]
    }
  }
};
