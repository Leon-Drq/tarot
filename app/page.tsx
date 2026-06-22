import MysticBackground from "@/components/mystic-background"
import {
  appUrl,
  editorialTeamJsonLd,
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
      inLanguage: ["en", "zh-CN", "ja-JP", "ko-KR"],
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
          "@type": "Review",
          name: item.title,
          reviewBody: item.quote,
          reviewAspect: item.title,
          datePublished: trustLastReviewed,
          author: {
            "@type": "Person",
            name: "POPTarot reader",
          },
          itemReviewed: {
            "@id": `${appUrl}/#app`,
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
