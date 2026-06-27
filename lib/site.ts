import { editorialTeam, representativeTestimonials, trustLastReviewed } from "@/lib/trust-signals"

export const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
export const siteName = "POPTarot"
export const siteTitle = "POPTarot - Free AI Tarot Reading"
export const siteDescription =
  "Get free AI tarot readings for love, career, daily guidance, and personal decisions. Draw tarot cards online and receive clear, personalized interpretations."
export const brandIconVersion = "20260627"
export const brandLogoPath = "/logo.png"
export const brandFaviconPath = "/favicon-48x48.png"
export const brandSvgIconPath = "/icon.svg"
export const brandOpenGraphPath = "/og-image.jpg"

function verifiedExternalUrl(value: string | undefined) {
  if (!value) return ""
  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return ""
    return url.toString()
  } catch {
    return ""
  }
}

export const socialLinks = [
  { label: "Instagram", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
  { label: "TikTok", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_TIKTOK_URL) },
  { label: "X", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_X_URL) },
  { label: "YouTube", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL) },
  { label: "Pinterest", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_PINTEREST_URL) },
  { label: "Facebook", href: verifiedExternalUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
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

export const officialVerificationLinks = [
  {
    label: "Canonical website",
    title: "poptarot.com",
    body: "Primary source for POPTarot free readings, Daily Tarot, card meanings, privacy guidance, and membership information.",
    href: "/",
  },
  {
    label: "Free product hub",
    title: "Free AI Tarot Tools",
    body: "A crawlable map of the free reading flow, Daily Tarot, question pages, spreads, card meanings, examples, and trust pages.",
    href: "/free-tarot-tools",
  },
  {
    label: "Logo source",
    title: "POPTarot Brand Assets",
    body: "Canonical logo, search favicon, SVG icon, app icon, and social preview assets referenced by metadata, manifest, and structured data.",
    href: "/brand-assets",
  },
  {
    label: "Editorial source",
    title: "Editorial Policy",
    body: "How card meanings, AI readings, localization, limitations, and updates are reviewed for user-facing clarity.",
    href: "/editorial-policy",
  },
  {
    label: "Responsible use",
    title: "AI Tarot Disclaimer",
    body: "Clear boundaries that readings are symbolic reflection, not medical, legal, financial, psychological, or safety advice.",
    href: "/ai-tarot-disclaimer",
  },
  {
    label: "Data handling",
    title: "Privacy Policy",
    body: "How questions, readings, journal entries, reminders, account data, analytics, and payments are handled.",
    href: "/privacy",
  },
] as const

export const brandVerificationFacts = [
  {
    label: "Official brand name",
    value: "POPTarot",
    body: "Use POPTarot as the canonical product and brand name in search, app metadata, structured data, and public references.",
    href: "/about",
  },
  {
    label: "Canonical domain",
    value: "poptarot.com",
    body: "The only canonical website for the POPTarot free AI tarot tool is https://poptarot.com.",
    href: "/official-channels",
  },
  {
    label: "Primary logo asset",
    value: brandLogoPath,
    body: "The 512 x 512 PT monogram logo is the canonical Organization logo used for search identity, structured data, and brand verification.",
    href: "/brand-assets",
  },
  {
    label: "Favicon source",
    value: brandFaviconPath,
    body: "The 48 x 48 favicon is the stable search crawler source referenced by root metadata and browser icon links.",
    href: brandFaviconPath,
  },
  {
    label: "Social preview image",
    value: brandOpenGraphPath,
    body: "The Open Graph image is the canonical large preview used for shared links and rich search context.",
    href: brandOpenGraphPath,
  },
  {
    label: "Sitemap",
    value: "/sitemap.xml",
    body: "The sitemap lists free reading paths, Daily Tarot, question pages, card meanings, localized pages, and trust assets.",
    href: "/sitemap.xml",
  },
  {
    label: "Free product stance",
    value: "Free AI tarot tool first",
    body: "The first reading, Daily Tarot, tarot questions, spreads, card meanings, examples, and trust pages are available before payment.",
    href: "/free-tarot-tools",
  },
  {
    label: "Membership boundary",
    value: "Upgrade only for depth",
    body: "Membership is reserved for deeper follow-ups, saved history, advanced spreads, and long-form monthly reports.",
    href: "/membership",
  },
] as const

const coreToolLinks = [
  { label: "Free Tarot Tools", href: "/free-tarot-tools", type: "CollectionPage" },
  { label: "Free AI Tarot Reading", href: "/free-ai-tarot-reading", type: "WebPage" },
  { label: "Daily Tarot", href: "/daily-tarot", type: "WebApplication" },
  { label: "Free Tarot Spreads", href: "/tarot-spreads", type: "CollectionPage" },
  { label: "Tarot Questions", href: "/tarot-questions", type: "CollectionPage" },
  { label: "Tarot Card Meanings", href: "/tarot-card-meanings", type: "CollectionPage" },
  { label: "Yes or No Tarot", href: "/yes-or-no-tarot", type: "WebPage" },
  { label: "Love Tarot Reading", href: "/love-tarot-reading", type: "WebPage" },
  { label: "Career Tarot Reading", href: "/career-tarot-reading", type: "WebPage" },
  { label: "Monthly Tarot Report", href: "/monthly-tarot-report", type: "WebPage" },
]

export const highIntentQuestionLinks = [
  {
    title: "Will my ex come back tarot",
    description: "A reconciliation-focused tarot entry that opens the right spread for contact, timing, closure, and next steps.",
    href: "/will-my-ex-come-back-tarot",
  },
  {
    title: "Does he love me tarot",
    description: "A love-intent tarot entry for comparing feelings, behavior, consistency, and emotional safety.",
    href: "/does-he-love-me-tarot",
  },
  {
    title: "How does he feel about me tarot",
    description: "A feelings-focused love tarot path for attraction, hidden emotion, availability, and whether feelings may become action.",
    href: "/how-does-he-feel-about-me-tarot",
  },
  {
    title: "Does my ex miss me tarot",
    description: "A breakup-silence tarot path for nostalgia, no-contact energy, unfinished feelings, and whether missing you is enough to reconnect.",
    href: "/does-my-ex-miss-me-tarot",
  },
  {
    title: "Will he come back tarot",
    description: "A return-focused tarot path for no-contact periods, reunion hopes, motives, delays, and healthy waiting boundaries.",
    href: "/will-he-come-back-tarot",
  },
  {
    title: "Future spouse tarot reading",
    description: "A future-partner tarot path for spouse energy, partnership traits, timing themes, readiness, and lasting love.",
    href: "/future-spouse-tarot-reading",
  },
  {
    title: "Daily love tarot",
    description: "A daily relationship check-in for today's love energy, feelings, timing, and one grounded next step.",
    href: "/daily-love-tarot",
  },
  {
    title: "Daily career tarot",
    description: "A daily work-focused tarot path for opportunities, pressure, preparation, and one practical career move.",
    href: "/daily-career-tarot",
  },
  {
    title: "Daily yes or no tarot",
    description: "A quick daily yes-or-no tarot path for one simple choice today, with the reason behind yes, no, or not yet.",
    href: "/daily-yes-or-no-tarot",
  },
  {
    title: "Daily mood tarot",
    description: "A daily emotional check-in for mood patterns, triggers, grounding, and what would help today.",
    href: "/daily-mood-tarot",
  },
  {
    title: "Daily action tarot",
    description: "A daily action-focused tarot path that turns today's card into one grounded next step.",
    href: "/daily-action-tarot",
  },
  {
    title: "Yes or no tarot love",
    description: "A quick love decision page that explains the reason behind yes, no, or not yet.",
    href: "/yes-or-no-tarot-love",
  },
  {
    title: "Career tarot reading",
    description: "A career tarot path for direction, work pressure, risk, resources, and the next practical move.",
    href: "/career-tarot-reading",
  },
  {
    title: "Should I quit my job tarot",
    description: "A job decision tarot page that separates temporary burnout from a real transition signal.",
    href: "/should-i-quit-my-job-tarot",
  },
  {
    title: "Is he thinking about me tarot",
    description: "A thoughts-and-silence tarot path for mixed signals, no-contact periods, and whether attention may become action.",
    href: "/is-he-thinking-about-me-tarot",
  },
  {
    title: "Should I text him tarot",
    description: "A contact-decision tarot path for timing, intention, emotional safety, and one grounded next action.",
    href: "/should-i-text-him-tarot",
  },
  {
    title: "When will I find love tarot",
    description: "A love timing tarot entry for readiness, dating energy, soulmate themes, and the pattern that needs to shift first.",
    href: "/when-will-i-find-love-tarot",
  },
  {
    title: "What are his intentions tarot",
    description: "A relationship-intent tarot entry for mixed signals, emotional availability, and whether actions match words.",
    href: "/what-are-his-intentions-tarot",
  },
  {
    title: "Will we get back together tarot",
    description: "A reconciliation tarot entry for second chances, timing, what changed, and whether repair would be healthy.",
    href: "/will-we-get-back-together-tarot",
  },
  {
    title: "Is he my soulmate tarot",
    description: "A soulmate tarot entry for intense connections, compatibility, lessons, timing, and healthy reciprocity.",
    href: "/is-he-my-soulmate-tarot",
  },
  {
    title: "Money tarot reading",
    description: "A reflective money tarot entry for income direction, spending patterns, resources, and one grounded next step.",
    href: "/money-tarot-reading",
  },
  {
    title: "What does he think of me tarot",
    description: "A perception-focused love tarot entry for mixed signals, silence, private thoughts, and possible next actions.",
    href: "/what-does-he-think-of-me-tarot",
  },
  {
    title: "Will he contact me tarot",
    description: "A contact-focused tarot path for no-contact periods, delayed replies, breakup silence, and healthy boundaries.",
    href: "/will-he-contact-me-tarot",
  },
  {
    title: "Is this relationship over tarot",
    description: "A relationship clarity page for distance, repeated conflict, breakup signals, and whether repair is realistic.",
    href: "/is-this-relationship-over-tarot",
  },
  {
    title: "Should I move on tarot",
    description: "A breakup clarity tarot page for closure, waiting, attachment, and the healthiest next step after uncertainty.",
    href: "/should-i-move-on-tarot",
  },
  {
    title: "Twin flame tarot reading",
    description: "A twin-flame tarot entry for intense connection, lessons, separation, reunion hopes, and grounded emotional safety.",
    href: "/twin-flame-tarot-reading",
  },
  {
    title: "Will I get married tarot",
    description: "A marriage tarot entry for long-term love, commitment readiness, partnership timing, and practical relationship growth.",
    href: "/will-i-get-married-tarot",
  },
  {
    title: "Will I get the job tarot",
    description: "A job outcome tarot entry for interviews, pending offers, applications, promotion chances, and practical follow-up.",
    href: "/will-i-get-the-job-tarot",
  },
  {
    title: "Should I take this job tarot",
    description: "A career decision tarot page for comparing salary, culture fit, stability, risk, growth, and negotiation.",
    href: "/should-i-take-this-job-tarot",
  },
  {
    title: "Will I be successful tarot",
    description: "A goal-focused tarot entry for projects, exams, launches, creative work, and the next controllable action.",
    href: "/will-i-be-successful-tarot",
  },
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

function highIntentQuestionJsonLdItems() {
  return highIntentQuestionLinks.map((link) => ({
    "@type": "WebPage",
    "@id": `${appUrl}${link.href}#webpage`,
    name: link.title,
    description: link.description,
    url: `${appUrl}${link.href}`,
    isAccessibleForFree: true,
    about: ["AI tarot reading", "free tarot question", "tarot spread"],
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

function uniqueBySchemaId(items: Array<Record<string, unknown>>) {
  return Array.from(new Map(items.map((item) => [String(item["@id"] || JSON.stringify(item)), item])).values())
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
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "domain",
        value: "poptarot.com",
        url: appUrl,
      },
      {
        "@type": "PropertyValue",
        propertyID: "canonical-logo",
        value: `${appUrl}${brandLogoPath}`,
        url: `${appUrl}/brand-assets`,
      },
    ],
    brand: {
      "@type": "Brand",
      "@id": `${appUrl}/#brand`,
      name: siteName,
      alternateName: ["POPTarot AI Tarot", "Pop Tarot AI"],
      url: appUrl,
      logo: {
        "@id": `${appUrl}/#logo`,
      },
      slogan: "Free AI tarot readings for clearer questions and daily guidance",
    },
    logo: {
      "@type": "ImageObject",
      "@id": `${appUrl}/#logo`,
      url: `${appUrl}${brandLogoPath}`,
      contentUrl: `${appUrl}${brandLogoPath}`,
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
      areaServed: "Worldwide",
      availableLanguage: ["en", "zh", "ja", "ko", "es", "pt-BR"],
    },
    knowsLanguage: ["en", "zh-CN", "ja-JP", "ko-KR", "es", "pt-BR"],
    knowsAbout: [
      "AI tarot reading",
      "tarot card meanings",
      "free tarot spreads",
      "tarot question pages",
      "daily tarot",
      "love tarot",
      "career tarot",
      "yes or no tarot",
      "official tarot reading channels",
    ],
    additionalProperty: brandVerificationFacts.map((item) => ({
      "@type": "PropertyValue",
      name: item.label,
      value: item.value,
      description: item.body,
      url: `${appUrl}${item.href}`,
    })),
    subjectOf: [
      {
        "@id": `${appUrl}/official-channels#webpage`,
      },
      {
        "@id": `${appUrl}/brand-assets#webpage`,
      },
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
    makesOffer: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@id": `${appUrl}/#app`,
      },
    },
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
    image: {
      "@id": `${appUrl}/#brand-image`,
    },
    thumbnailUrl: `${appUrl}${brandLogoPath}`,
    about: {
      "@id": `${appUrl}/#brand`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${appUrl}/tarot-questions?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
    copyrightHolder: {
      "@id": `${appUrl}/#organization`,
    },
    inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR", "es", "pt-BR"],
    hasPart: uniqueBySchemaId([...coreToolJsonLdItems(), ...highIntentQuestionJsonLdItems(), ...trustPageJsonLdItems()]),
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
      "Tarot question pages",
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
    citation: representativeTestimonials.map((item) => ({
      "@type": "Quotation",
      name: item.title,
      text: item.quote,
      about: item.context,
      creator: {
        "@id": `${appUrl}/#editorial-team`,
      },
      isPartOf: {
        "@id": `${appUrl}/reviews#webpage`,
      },
    })),
    publisher: {
      "@id": `${appUrl}/#organization`,
    },
  }
}
