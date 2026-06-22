import { editorialTeam, representativeTestimonials, trustLastReviewed } from "@/lib/trust-signals"

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
export const siteName = "POPTarot"
export const siteTitle = "POPTarot - Free AI Tarot Reading"
export const siteDescription =
  "Get free AI tarot readings for love, career, daily guidance, and personal decisions. Draw tarot cards online and receive clear, personalized interpretations."

export const socialLinks = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL },
  { label: "YouTube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL },
].filter((link): link is { label: string; href: string } => Boolean(link.href))

export const trustLinks = [
  { label: "About", href: "/about" },
  { label: "Official Channels", href: "/official-channels" },
  { label: "Brand Assets", href: "/brand-assets" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "AI Disclaimer", href: "/ai-tarot-disclaimer" },
  { label: "Privacy", href: "/privacy" },
  { label: "Reviews", href: "/reviews" },
  { label: "Reading Examples", href: "/tarot-reading-examples" },
]

const coreToolLinks = [
  { label: "Free AI Tarot Reading", href: "/free-ai-tarot-reading", type: "WebPage" },
  { label: "Daily Tarot", href: "/daily-tarot", type: "WebApplication" },
  { label: "Free Tarot Spreads", href: "/tarot-spreads", type: "CollectionPage" },
  { label: "Tarot Card Meanings", href: "/tarot-card-meanings", type: "CollectionPage" },
  { label: "Yes or No Tarot", href: "/yes-or-no-tarot", type: "WebPage" },
  { label: "Love Tarot Reading", href: "/love-tarot-reading", type: "WebPage" },
  { label: "Career Tarot Reading", href: "/career-tarot-reading", type: "WebPage" },
]

function coreToolJsonLdItems() {
  return coreToolLinks.map((link) => ({
    "@type": link.type,
    "@id": `${appUrl}${link.href}#webpage`,
    name: link.label,
    url: `${appUrl}${link.href}`,
    isAccessibleForFree: true,
    isPartOf: {
      "@id": `${appUrl}/#website`,
    },
  }))
}

function trustPageJsonLdItems() {
  return trustLinks.map((link) => ({
    "@type": "WebPage",
    "@id": `${appUrl}${link.href}#webpage`,
    name: link.label,
    url: `${appUrl}${link.href}`,
    isPartOf: {
      "@id": `${appUrl}/#website`,
    },
  }))
}

export function editorialTeamJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${appUrl}/#editorial-team`,
    name: editorialTeam.name,
    url: `${appUrl}${editorialTeam.url}`,
    description: editorialTeam.description,
    parentOrganization: {
      "@id": `${appUrl}/#organization`,
    },
    publishingPrinciples: `${appUrl}/editorial-policy`,
    knowsAbout: [
      "tarot symbolism",
      "AI tarot reading",
      "tarot card meanings",
      "love tarot questions",
      "career tarot questions",
      "responsible AI guidance",
    ],
  }
}

export function organizationJsonLd() {
  const data: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${appUrl}/#organization`,
    name: siteName,
    legalName: siteName,
    alternateName: ["POPTarot AI Tarot", "Pop Tarot AI"],
    url: appUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${appUrl}/#logo`,
      url: `${appUrl}/icon-512x512.png`,
      contentUrl: `${appUrl}/icon-512x512.png`,
      width: 512,
      height: 512,
      caption: "POPTarot logo",
    },
    image: [
      {
        "@type": "ImageObject",
        "@id": `${appUrl}/#brand-image`,
        url: `${appUrl}/og-image.jpg`,
        contentUrl: `${appUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        caption: "POPTarot free AI tarot reading",
      },
      {
        "@id": `${appUrl}/#logo`,
      },
    ],
    description: siteDescription,
    department: {
      "@id": `${appUrl}/#editorial-team`,
    },
    publishingPrinciples: `${appUrl}/editorial-policy`,
    foundingLocation: {
      "@type": "Place",
      name: "Online",
    },
    mainEntityOfPage: {
      "@id": `${appUrl}/about#webpage`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "brand verification and product support",
      url: `${appUrl}/official-channels`,
      availableLanguage: ["en", "zh", "ja", "ko", "es", "pt-BR"],
    },
    knowsAbout: [
      "AI tarot reading",
      "tarot card meanings",
      "free tarot spreads",
      "daily tarot",
      "love tarot",
      "career tarot",
      "yes or no tarot",
      "official tarot reading channels",
    ],
    subjectOf: [
      {
        "@id": `${appUrl}/editorial-policy#webpage`,
      },
      {
        "@id": `${appUrl}/ai-tarot-disclaimer#webpage`,
      },
      {
        "@id": `${appUrl}/reviews#webpage`,
      },
      {
        "@id": `${appUrl}/tarot-reading-examples#webpage`,
      },
    ],
  }

  if (socialLinks.length > 0) {
    data.sameAs = socialLinks.map((link) => link.href)
  }

  return data
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${appUrl}/#website`,
    name: siteName,
    alternateName: ["POPTarot AI Tarot", "Pop Tarot AI"],
    url: appUrl,
    description:
      "Free AI tarot readings for love, career, daily guidance, and personal decisions.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${appUrl}/input?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
    copyrightHolder: {
      "@id": `${appUrl}/#organization`,
    },
    inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR", "es", "pt-BR"],
    hasPart: [...coreToolJsonLdItems(), ...trustPageJsonLdItems()],
  }
}

export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${appUrl}/#app`,
    name: siteName,
    applicationCategory: "LifestyleApplication",
    applicationSubCategory: "AI tarot reading",
    operatingSystem: "Web",
    url: appUrl,
    image: `${appUrl}/og-image.jpg`,
    description:
      "Draw tarot cards online and receive personalized AI interpretations for daily guidance, love, career, and life decisions.",
    brand: {
      "@id": `${appUrl}/#organization`,
    },
    maintainer: {
      "@id": `${appUrl}/#editorial-team`,
    },
    reviewedBy: {
      "@id": `${appUrl}/#editorial-team`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
    },
    isAccessibleForFree: true,
    dateModified: trustLastReviewed,
    featureList: [
      "Free AI tarot reading",
      "Daily tarot card",
      "Free tarot spreads",
      "Tarot card meanings",
      "Love tarot reading",
      "Career tarot reading",
      "Yes or no tarot",
      "Saved history for members",
      "Advanced spreads for members",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "People seeking reflective tarot guidance for love, career, daily decisions, and personal clarity",
    },
    subjectOf: [
      {
        "@id": `${appUrl}/reviews#webpage`,
      },
      {
        "@id": `${appUrl}/tarot-reading-examples#webpage`,
      },
      {
        "@id": `${appUrl}/ai-tarot-disclaimer#webpage`,
      },
    ],
    review: representativeTestimonials.map((item) => ({
      "@type": "Review",
      name: item.title,
      reviewBody: item.quote,
      reviewAspect: item.title,
      author: {
        "@type": "Person",
        name: "POPTarot reader",
      },
      itemReviewed: {
        "@id": `${appUrl}/#app`,
      },
    })),
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
  }
}
