import MysticBackground from "@/components/mystic-background"
import {
  appUrl,
  editorialTeamJsonLd,
  highIntentQuestionLinks,
  organizationJsonLd,
  siteDescription,
  siteName,
  siteTitle,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import { representativeTestimonials, trustLastReviewed } from "@/lib/trust-signals"

const homeFreePaths = [
  {
    title: "Free Tarot Tools",
    description: "Use one crawlable hub for free readings, Daily Tarot, tarot questions, spreads, meanings, examples, and trust pages.",
    href: "/free-tarot-tools",
  },
  {
    title: "Free AI Tarot Reading",
    description: "Ask one real question, draw cards, and receive a free AI tarot interpretation before any membership decision.",
    href: "/free-ai-tarot-reading",
  },
  {
    title: "Daily Tarot",
    description: "Return for one free card each day, keep a streak, save a journal note, and add a reminder.",
    href: "/daily-tarot",
  },
  {
    title: "Tarot Questions",
    description: "Start from high-intent questions about love, exes, yes-or-no choices, career, and job decisions.",
    href: "/tarot-questions",
  },
  {
    title: "Tarot Card Meanings",
    description: "Browse 78 tarot card meanings with upright, reversed, love, career, money, yes-or-no, advice, combinations, and FAQ.",
    href: "/tarot-card-meanings",
  },
]

const homeQuickStartPaths = [
  {
    title: "Will my ex come back?",
    description: "Open a breakup recovery spread for reconciliation, contact, timing, and closure.",
    question: "Will my ex come back, and what should I understand before I act?",
    spread: "breakup_recovery",
    campaign: "ex_return",
    href: "/will-my-ex-come-back-tarot",
  },
  {
    title: "Does he love me?",
    description: "Open a feelings spread for love, mixed signals, emotional consistency, and next steps.",
    question: "Does he love me, and what is the real emotional energy between us?",
    spread: "their_thoughts",
    campaign: "does_he_love_me",
    href: "/does-he-love-me-tarot",
  },
  {
    title: "Career tarot reading",
    description: "Open a career spread for work direction, pressure, resources, and one practical move.",
    question: "What should I understand about my career path right now?",
    spread: "job_opportunity",
    campaign: "career_tarot",
    href: "/career-tarot-reading",
  },
  {
    title: "Yes or no love tarot",
    description: "Open a yes-or-no love spread that explains the reason behind yes, no, or not yet.",
    question: "Give me a yes or no love tarot answer with the reason behind it.",
    spread: "yes_no",
    campaign: "yes_no_love",
    href: "/yes-or-no-tarot-love",
  },
  {
    title: "Daily Tarot",
    description: "Open the free daily one-card return loop for streaks, journal notes, and reminders.",
    href: "/daily-tarot",
    actionTarget: "/daily-tarot?utm_source=home&utm_medium=hero_quick_start&utm_campaign=daily_tarot",
  },
]

function homeQuickStartActionTarget(item: (typeof homeQuickStartPaths)[number]) {
  if ("actionTarget" in item) return item.actionTarget

  const params = new URLSearchParams({
    q: item.question,
    auto: "1",
    source: "home_example",
    spread: item.spread,
    lang: "en",
    utm_source: "home",
    utm_medium: "hero_quick_start",
    utm_campaign: item.campaign,
  })

  return `/input?${params.toString()}`
}

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...organizationJsonLd(),
    },
    {
      ...editorialTeamJsonLd(),
    },
    {
      ...websiteJsonLd(),
    },
    {
      ...softwareApplicationJsonLd(),
    },
    {
      "@type": "WebPage",
      "@id": `${appUrl}/#webpage`,
      name: siteTitle,
      description: siteDescription,
      url: appUrl,
      dateModified: trustLastReviewed,
      isAccessibleForFree: true,
      inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR", "es", "pt-BR"],
      about: {
        "@id": `${appUrl}/#app`,
      },
      mainEntity: {
        "@id": `${appUrl}/#app`,
      },
      reviewedBy: {
        "@id": `${appUrl}/#editorial-team`,
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
      potentialAction: {
        "@type": "ReadAction",
        name: "Start a free AI tarot reading",
        target: `${appUrl}/input?source=home_schema`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/#free-tarot-paths`,
      name: "Free tarot paths on POPTarot",
      itemListElement: homeFreePaths.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
        url: `${appUrl}${item.href}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/#high-intent-tarot-questions`,
      name: "High-intent free tarot question paths",
      itemListElement: highIntentQuestionLinks.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
        url: `${appUrl}${item.href}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/#homepage-quick-start-free-readings`,
      name: "Homepage quick-start free tarot readings",
      itemListElement: homeQuickStartPaths.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": item.href === "/daily-tarot" ? "WebApplication" : "WebPage",
          name: item.title,
          description: item.description,
          url: `${appUrl}${item.href}`,
          isAccessibleForFree: true,
          potentialAction: {
            "@type": "InteractAction",
            name: "Start free tarot reading",
            target: `${appUrl}${homeQuickStartActionTarget(item)}`,
          },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/#trust-paths`,
      name: "POPTarot trust and transparency pages",
      itemListElement: trustLinks.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: `${appUrl}${item.href}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/#representative-feedback`,
      name: "Representative POPTarot reader feedback",
      itemListElement: representativeTestimonials.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Quotation",
          name: item.title,
          text: item.quote,
          about: item.context,
          datePublished: trustLastReviewed,
          creator: {
            "@id": `${appUrl}/#editorial-team`,
          },
          isPartOf: {
            "@id": `${appUrl}/reviews#webpage`,
          },
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${appUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: appUrl,
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MysticBackground />
    </>
  )
}
