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
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "AI Disclaimer", href: "/ai-tarot-disclaimer" },
  { label: "Privacy", href: "/privacy" },
  { label: "Reviews", href: "/reviews" },
  { label: "Reading Examples", href: "/tarot-reading-examples" },
]

export function organizationJsonLd() {
  const data: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${appUrl}/#organization`,
    name: siteName,
    url: appUrl,
    logo: `${appUrl}/icon-512x512.png`,
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
    inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR", "es", "pt-BR"],
  }
}

export function softwareApplicationJsonLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${appUrl}/#app`,
    name: siteName,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: appUrl,
    image: `${appUrl}/og-image.jpg`,
    description:
      "Draw tarot cards online and receive personalized AI interpretations for daily guidance, love, career, and life decisions.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      category: "Free",
    },
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
  }
}
