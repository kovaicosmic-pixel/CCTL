import type { ServiceDomain } from "./content";

export type ServiceDomainLight = Omit<
  ServiceDomain,
  "detailedDescription" | "valueProps" | "serviceOfferings" | "labTesting" | "additionalServices"
>;

export const servicesLight: ServiceDomainLight[] = [
  {
    "slug": "mil-aero",
    "name": "MIL / AERO Domain",
    "tagline": "Reliable MIL-STD-461 EMC Testing for Military and Aerospace Equipment",
    "body": "Ensure your defense and aerospace systems meet the most rigorous global standards with Cosmic Compliance Test Lab's certified MIL-STD-461 testing services.",
    "icon": "shield",
    "image": "/images/chamber.webp",
    "gallery": [
      "/images/mil-aero/AZ7_7709%202023-09-11%2006_28_36.webp",
      "/images/mil-aero/AZ7_7722%202023-09-11%2006_29_56.webp",
      "/images/mil-aero/Radiated%20immunity%20test%20.webp",
      "/images/mil-aero/WhatsApp%20Image%202024-04-23%20at%205.30.59%20PM%20(1).webp"
    ],
    "spec": "MIL-461",
    "stats": [
      {
        "label": "Standard",
        "value": "MIL-STD-461"
      },
      {
        "label": "Frequency Range",
        "value": "10 kHz – 40 GHz"
      },
      {
        "label": "Chamber",
        "value": "CSAC"
      }
    ]
  },
  {
    "slug": "civilian",
    "name": "Civilian Domain",
    "tagline": "Confidently navigate civilian compliance.",
    "body": "Trust in our expertise to navigate the complexities of civilian domain regulations, ensuring your products meet all necessary compliance requirements.",
    "icon": "cpu",
    "image": "/images/civilianDomain.webp",
    "gallery": [
      "/images/civilian/Civil.webp",
      "/images/civilian/EST%20.webp",
      "/images/civilian/IMG_20240418_173040.webp",
      "/images/civilian/IMG_20240418_175038.webp"
    ],
    "spec": "COMPLIANT",
    "stats": [
      {
        "label": "Accreditation",
        "value": "ISO 17025"
      },
      {
        "label": "Lab Hours",
        "value": "24 × 6"
      },
      {
        "label": "Chamber",
        "value": "CSAC / VSAC"
      }
    ]
  },
  {
    "slug": "automotive",
    "name": "Automotive Domain",
    "tagline": "Validated technologies, industry-grade standards.",
    "body": "Drive innovation forward with confidence as we validate the compliance of your automotive technologies, adhering to rigorous industry standards with our Expert Automotive Electromagnetic Compatibility (EMC).",
    "icon": "car",
    "image": "/images/automotive.webp",
    "gallery": [
      "/images/automotive/Transient%20pulse%20on%20supply%20lines.webp",
      "/images/automotive/Transient%20on%20signal%20lines.webp",
      "/images/automotive/RE%20main%20pic%20.webp",
      "/images/automotive/receiver%20with%20software%20setup.webp"
    ],
    "spec": "48 GHz",
    "stats": [
      {
        "label": "Turntable",
        "value": "2m"
      },
      {
        "label": "Chamber",
        "value": "VSAC"
      },
      {
        "label": "Standard",
        "value": "CISPR 25"
      }
    ]
  },
  {
    "slug": "railway",
    "name": "Railway Domain",
    "tagline": "Safety and reliability on every track.",
    "body": "Stay on track with regulatory compliance for your railway technologies, guaranteeing safety and reliability through meticulous EMC testing protocols.",
    "icon": "train",
    "image": "/images/domain-railways.webp",
    "gallery": [
      "/images/railway/Radiated-Emission-test-1-4-scaled-1.webp",
      "/images/railway/Railway-service-1.jpg",
      "/images/railway/railway-service-2-1.jpg",
      "/images/railway/railway-service-4-2.webp"
    ],
    "spec": "EN 50121",
    "stats": [
      {
        "label": "Standard",
        "value": "EN 50121"
      },
      {
        "label": "Frequency Range",
        "value": "10 kHz – 40 GHz"
      },
      {
        "label": "Chamber",
        "value": "CSAC"
      }
    ]
  },
  {
    "slug": "telecom-wireless",
    "name": "Telecom and Wireless Domain",
    "tagline": "Seamless, certified connectivity.",
    "body": "Seamlessly connect with your audience as we certify the compliance of your telecom and wireless devices, enabling you to deliver cutting-edge solutions with peace of mind.",
    "icon": "radio",
    "image": "/images/domain-telecom.webp",
    "gallery": [
      "/images/telecom-wireless/DSC08033.webp",
      "/images/telecom-wireless/DSC08114.webp",
      "/images/telecom-wireless/DSC08115.webp",
      "/images/telecom-wireless/Picture1.jpg"
    ],
    "spec": "CE / FCC",
    "stats": [
      {
        "label": "Standard",
        "value": "CE / FCC"
      },
      {
        "label": "Frequency Range",
        "value": "Up to 48 GHz"
      },
      {
        "label": "Chamber",
        "value": "CSAC"
      }
    ]
  }
];
