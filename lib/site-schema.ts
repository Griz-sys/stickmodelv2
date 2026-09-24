export const SITE_URL = "https://stickmodel.com";

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StickModel",
  url: SITE_URL,
  logo: `${SITE_URL}/horizontal.svg`,
  description:
    "StickModel converts 2D structural drawings into 3D wireframe and stick models for construction estimation, BIM workflows, and Tekla PowerFab, delivered within 24 hours.",
  email: "info@stickmodel.com",
  telephone: "+91-9999503168",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fifth Floor, C 56A/27, Sector 62",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201301",
    addressCountry: "IN",
  },
  sameAs: ["https://www.linkedin.com/company/stick-model/"],
  parentOrganization: {
    "@type": "Organization",
    name: "Vecube",
  },
  areaServed: "Worldwide",
};

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "StickModel",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "StickModel",
  },
};

export function definedTermJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    description,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "StickModel Glossary",
      url: SITE_URL,
    },
  };
}

export function serviceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "StickModel",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
  };
}
