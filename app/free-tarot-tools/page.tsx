import type { Metadata } from "next"
import Link from "next/link"
import {
  appUrl,
  freeSpreadFormatLinks,
  highIntentQuestionLinks,
  siteName,
  trustLinks,
} from "@/lib/site"
import { getSeoPage } from "@/lib/seo-pages"
import { getTrustPage } from "@/lib/trust-pages"
import { representativeTestimonials, trustLastReviewed } from "@/lib/trust-signals"
import { freeToolsHubAlternates } from "@/components/seo/free-tools-localized-page"

const toolPaths = [
  {
    title: "Free AI Tarot Reading",
    body: "Ask one real question, draw cards, and get a free AI interpretation before any membership decision.",
    href: "/free-ai-tarot-reading",
    label: "Start free",
  },
  {
    title: "Daily Tarot",
    body: "Draw one free card each day, keep a streak, save a private journal note, and set a return reminder.",
    href: "/daily-tarot",
    label: "Return daily",
  },
  {
    title: "Tarot Questions",
    body: "Choose a love, ex, yes-or-no, career, or job decision question and open the matching spread.",
    href: "/tarot-questions",
    label: "Pick a question",
  },
  {
    title: "Tarot Spreads",
    body: "Use free spreads for yes/no choices, relationships, breakup recovery, career paths, and decisions.",
    href: "/tarot-spreads",
    label: "Choose a spread",
  },
  {
    title: "Tarot Card Meanings",
    body: "Browse 78 card pages with upright, reversed, love, career, money, yes-or-no, advice, combinations, and FAQ.",
    href: "/tarot-card-meanings",
    label: "Read meanings",
  },
  {
    title: "Tarot Card Combinations",
    body: "Compare common card pairs, learn how combinations change by question context, and open a free spread when you need the pair read together.",
    href: "/tarot-card-combinations",
    label: "Read pairs",
  },
  {
    title: "Reading Examples",
    body: "See realistic examples for love, reconciliation, career, daily guidance, and yes-or-no questions.",
    href: "/tarot-reading-examples",
    label: "View examples",
  },
]

const conversionSteps = [
  {
    title: "First visit",
    body: "Start with the free AI reading flow, not a membership pitch. The user gets value before deciding whether deeper features are useful.",
  },
  {
    title: "Second visit",
    body: "Daily Tarot gives a lightweight reason to return: one card, one journal note, one streak, and a reminder option.",
  },
  {
    title: "Search visit",
    body: "Question pages match real search intent like ex reconciliation, love yes/no, career uncertainty, and job decisions.",
  },
  {
    title: "Trust visit",
    body: "About, editorial policy, AI disclaimer, privacy, reviews, examples, and brand assets make the free tool easier to trust.",
  },
]

const freeUpgradeBoundary = [
  {
    area: "First reading",
    free: "Ask one real question, draw cards, and receive a clear AI tarot interpretation.",
    upgrade: "Use deeper follow-up questions when the first answer opens a more specific thread.",
    href: "/free-ai-tarot-reading",
  },
  {
    area: "Daily return",
    free: "Draw one daily card, keep a streak, save a journal note, and set a return reminder path.",
    upgrade: "Review longer patterns once saved readings and Daily Tarot entries build enough history.",
    href: "/daily-tarot",
  },
  {
    area: "Search questions",
    free: "Open love, ex, yes-or-no, career, and job-decision pages that start matching spreads.",
    upgrade: "Save the answer history when a question becomes an ongoing decision instead of a one-time check.",
    href: "/tarot-questions",
  },
  {
    area: "Card meanings",
    free: "Read upright, reversed, love, career, money, yes-or-no, advice, combinations, pair guides, and FAQ.",
    upgrade: "Use saved history and monthly reports when repeated cards need a broader pattern review.",
    href: "/tarot-card-meanings",
  },
  {
    area: "Advanced work",
    free: "Start with simple spreads and realistic examples before committing to a larger reading.",
    upgrade: "Use advanced spreads, saved history, and monthly reports only after the free flow proves useful.",
    href: "/tarot-spreads",
  },
] as const

const visibleTestimonials = representativeTestimonials.slice(0, 3)
const sampleReadingExamples = getTrustPage("tarot-reading-examples")?.readingExamples?.slice(0, 3) || []
const quickStartIntentSources = [
  {
    label: "Love",
    title: "Does he love me?",
    body: "For mixed signals, unclear feelings, and whether actions match words.",
    href: "/does-he-love-me-tarot",
  },
  {
    label: "Ex",
    title: "Will my ex come back?",
    body: "For reconciliation, contact, timing, closure, and healthy waiting.",
    href: "/will-my-ex-come-back-tarot",
  },
  {
    label: "Career",
    title: "Career tarot reading",
    body: "For work direction, pressure, interviews, choices, and the next practical move.",
    href: "/career-tarot-reading",
  },
  {
    label: "Yes / No",
    title: "Yes or no love tarot",
    body: "For one simple love question when you still want the reason behind the answer.",
    href: "/yes-or-no-tarot-love",
  },
] as const

function quickStartIntentItems() {
  return quickStartIntentSources.map((source) => {
    const item = highIntentQuestionLinks.find((link) => link.href === source.href)
    if (!item) throw new Error(`Missing free tools quick-start intent: ${source.href}`)

    return {
      ...source,
      readingHref: quickStartReadingHref(item),
      guideHref: item.href,
    }
  })
}

function questionSlugFromHref(href: string) {
  return href.replace(/^\//, "")
}

function highIntentReadingHref(item: (typeof highIntentQuestionLinks)[number]) {
  const slug = questionSlugFromHref(item.href)
  const page = getSeoPage(slug, "en")
  const params = new URLSearchParams({
    q: page?.ctaQuestion || item.title,
    auto: "1",
    source: "free_tools",
    lang: "en",
    utm_source: "free_tools",
    utm_medium: "question_grid",
    utm_campaign: slug,
  })

  if (page?.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

function quickStartReadingHref(item: (typeof highIntentQuestionLinks)[number]) {
  const slug = questionSlugFromHref(item.href)
  const page = getSeoPage(slug, "en")
  const params = new URLSearchParams({
    q: page?.ctaQuestion || item.title,
    auto: "1",
    source: "free_tools",
    lang: "en",
    utm_source: "free_tools",
    utm_medium: "quick_start",
    utm_campaign: slug,
  })

  if (page?.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

function spreadFormatReadingHref(item: (typeof freeSpreadFormatLinks)[number]) {
  const slug = questionSlugFromHref(item.href)
  const page = getSeoPage(slug, "en")
  if (!page) throw new Error(`Missing free spread format SEO page: ${slug}`)

  const params = new URLSearchParams({
    q: page.ctaQuestion,
    auto: "1",
    source: "free_tools",
    lang: "en",
    utm_source: "free_tools",
    utm_medium: "spread_format",
    utm_campaign: slug,
  })

  if (page.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

const quickStartIntents = quickStartIntentItems()
const dailyQuickStart = {
  label: "Daily",
  title: "Daily Tarot",
  body: "For one free card today, a streak, a journal note, and a reason to return tomorrow.",
  readingHref: "/daily-tarot?utm_source=free_tools&utm_medium=quick_start&utm_campaign=daily_tarot",
  guideHref: "/daily-tarot",
}
const quickStartTools = [...quickStartIntents, dailyQuickStart]
const spreadFormatTools = freeSpreadFormatLinks.map((item) => ({
  ...item,
  readingHref: spreadFormatReadingHref(item),
  guideHref: item.href,
}))

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${appUrl}/free-tarot-tools#webpage`,
      name: "Free AI Tarot Tools",
      description:
        "A free hub for POPTarot AI tarot readings, Daily Tarot, tarot questions, tarot spreads, card meanings, examples, and trust pages.",
      url: `${appUrl}/free-tarot-tools`,
      isAccessibleForFree: true,
      dateModified: trustLastReviewed,
      inLanguage: "en",
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
      mainEntity: {
        "@id": `${appUrl}/free-tarot-tools#tool-list`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#tool-list`,
      name: "Free tarot tools on POPTarot",
      itemListElement: toolPaths.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.body,
        url: `${appUrl}${item.href}`,
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#quick-start-free-readings`,
      name: "Quick-start free AI tarot readings",
      itemListElement: quickStartTools.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": item.guideHref === "/daily-tarot" ? "WebApplication" : "WebPage",
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.guideHref}`,
          isAccessibleForFree: true,
          potentialAction: {
            "@type": "InteractAction",
            name: "Start free tarot reading",
            target: `${appUrl}${item.readingHref}`,
          },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#free-spread-formats`,
      name: "Free tarot spread formats",
      itemListElement: spreadFormatTools.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: item.title,
          description: item.description,
          url: `${appUrl}${item.guideHref}`,
          isAccessibleForFree: true,
          potentialAction: {
            "@type": "InteractAction",
            name: "Start free tarot spread",
            target: `${appUrl}${item.readingHref}`,
          },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#free-vs-upgrade-boundary`,
      name: "POPTarot free versus membership boundary",
      itemListElement: freeUpgradeBoundary.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "OfferCatalog",
          name: item.area,
          url: `${appUrl}${item.href}`,
          itemListElement: [
            {
              "@type": "Offer",
              name: "Free first",
              price: "0",
              priceCurrency: "USD",
              description: item.free,
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Upgrade later",
              description: item.upgrade,
              availability: "https://schema.org/InStock",
            },
          ],
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#question-list`,
      name: "Free tarot question paths",
      itemListElement: highIntentQuestionLinks.map((item, index) => {
        const readingPath = highIntentReadingHref(item)

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebPage",
            name: item.title,
            description: item.description,
            url: `${appUrl}${item.href}`,
            isAccessibleForFree: true,
            potentialAction: {
              "@type": "Action",
              name: "Start matching free tarot spread",
              target: `${appUrl}${readingPath}`,
            },
          },
        }
      }),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#reader-feedback`,
      name: "Representative reader feedback for POPTarot free tools",
      itemListElement: visibleTestimonials.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Quotation",
          name: item.title,
          text: item.quote,
          about: item.context,
          datePublished: trustLastReviewed,
          isPartOf: {
            "@id": `${appUrl}/reviews#webpage`,
          },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/free-tarot-tools#example-readings`,
      name: "Realistic free tarot reading examples",
      itemListElement: sampleReadingExamples.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: item.title,
          url: `${appUrl}${item.href}`,
          text: item.interpretation,
          about: [item.label, item.spread, item.question],
          isAccessibleForFree: true,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${appUrl}/free-tarot-tools#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: appUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Tarot Tools",
          item: `${appUrl}/free-tarot-tools`,
        },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: "Free AI Tarot Tools",
  description:
    "Start with free AI tarot readings, Daily Tarot, tarot questions, tarot spreads, 78 card meanings, reading examples, and trust pages on POPTarot.",
  alternates: {
    canonical: "/free-tarot-tools",
    languages: freeToolsHubAlternates,
  },
  openGraph: {
    title: "Free AI Tarot Tools | POPTarot",
    description:
      "A free hub for AI tarot readings, Daily Tarot, tarot questions, tarot spreads, card meanings, examples, and trust pages.",
    url: "/free-tarot-tools",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "POPTarot free AI tarot tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Tarot Tools | POPTarot",
    description:
      "Start with free AI tarot readings, Daily Tarot, tarot questions, tarot spreads, card meanings, examples, and trust pages.",
    images: ["/og-image.jpg"],
  },
}

export default function FreeTarotToolsPage() {
  return (
    <main className="min-h-screen bg-[#0d0618] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto w-[min(92vw,1120px)] pb-16 pt-10 sm:pt-16 md:pb-24">
        <nav className="mb-8 text-xs text-white/42">
          <Link href="/" className="transition hover:text-white">
            POPTarot
          </Link>
          <span className="mx-2 text-white/24">/</span>
          <span>Free Tarot Tools</span>
        </nav>

        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#c9c0ff]/76">Free AI tarot hub</p>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl">
              Start free, return daily, go deeper only when needed.
            </h1>
          </div>
          <div>
            <p className="text-sm leading-7 text-white/62 sm:text-base">
              POPTarot is designed as a free AI tarot tool first. Use the free reading flow, Daily Tarot,
              question pages, tarot spreads, and card meanings before any membership decision. Paid features
              belong to deeper follow-ups, saved history, advanced spreads, and longer reports.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/input?source=free_tools"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f5f2ff_0%,#b7adff_42%,#6d63d8_100%)] px-5 text-sm font-medium text-[#0c0920] shadow-[0_18px_45px_rgba(109,99,216,0.24)] transition hover:brightness-110"
              >
                Start a free reading
              </Link>
              <Link
                href="/daily-tarot"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-5 text-sm text-white/72 transition hover:border-[#bfb6ff]/45 hover:text-white"
              >
                Open Daily Tarot
              </Link>
            </div>
          </div>
        </div>

        <section data-free-tools-quick-start className="border-b border-white/10 py-8 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Quick start</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
                Start from the question you already have
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Pick the closest intent and go straight into a free reading flow. The guide page stays available
                when you want more context before drawing cards.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {quickStartTools.map((item) => (
                <article
                  key={item.title}
                  data-free-tools-quick-start-card
                  className="flex min-h-[13rem] min-w-0 flex-col rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/42 hover:bg-white/[0.06]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">{item.label}</p>
                  <h3 className="mt-3 break-words text-base font-medium leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/52">{item.body}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Link
                      data-free-tools-quick-start-start
                      href={item.readingHref}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.18)] transition hover:brightness-110"
                    >
                      Start free
                    </Link>
                    <Link
                      href={item.guideHref}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/62 transition hover:border-[#bfb6ff]/40 hover:text-white"
                    >
                      View guide
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-free-tools-spread-formats className="border-b border-white/10 py-8 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Free spread formats</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
                Match the card count to the moment
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Some visitors search for the spread format before they know the exact question. These pages explain
                the format and open a free AI reading with the right spread already selected.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {spreadFormatTools.map((item) => (
                <article
                  key={item.href}
                  data-free-tools-spread-format-card
                  className="flex min-h-[14rem] min-w-0 flex-col rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-[#bfb6ff]/[0.07]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">Free format</p>
                  <h3 className="mt-3 break-words text-base font-medium leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/52">{item.description}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Link
                      data-free-tools-spread-format-start
                      href={item.readingHref}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.18)] transition hover:brightness-110"
                    >
                      Start free
                    </Link>
                    <Link
                      data-free-tools-spread-format-guide
                      href={item.guideHref}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/62 transition hover:border-[#bfb6ff]/40 hover:text-white"
                    >
                      View guide
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Main free paths</p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">Use the tool from the page that matches intent</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {toolPaths.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.06]"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{item.label}</p>
                <h3 className="mt-3 text-base font-medium text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Growth loop</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
              Free value should create search, sharing, and return visits
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              This hub keeps the free product paths visible from one crawlable page, so users and search engines can
              understand how the experience fits together.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {conversionSteps.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/34">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-medium text-[#f1edff]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/56">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          data-free-tools-membership-boundary
          className="mt-12 border-t border-white/10 pt-8"
        >
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Free vs upgrade</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
                Keep the first useful answer free
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                POPTarot should not ask for a membership before the reader understands the value. The free path covers
                the first reading, daily return, search questions, spreads, and card meanings. Upgrade only when depth,
                memory, or long-term pattern review becomes useful.
              </p>
              <Link
                href="/membership"
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#eeeaff] hover:bg-white/[0.06]"
              >
                See membership boundary
              </Link>
            </div>
            <div className="grid gap-3">
              {freeUpgradeBoundary.map((item) => (
                <article
                  key={item.area}
                  data-free-tools-membership-boundary-row
                  className="grid min-w-0 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[0.72fr_1fr_1fr]"
                >
                  <Link href={item.href} className="group min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">Area</p>
                    <h3 className="mt-2 break-words text-base font-medium leading-snug text-white group-hover:text-[#eeeaff]">
                      {item.area}
                    </h3>
                  </Link>
                  <div className="min-w-0 rounded-md border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/74">Free first</p>
                    <p className="mt-2 text-sm leading-6 text-white/64">{item.free}</p>
                  </div>
                  <div className="min-w-0 rounded-md border border-white/10 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">Upgrade later</p>
                    <p className="mt-2 text-sm leading-6 text-white/56">{item.upgrade}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Question pages</p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
              Start from the questions people actually search
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              These pages are not generic blog posts. Each one sends the user into a matching free tarot spread.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {highIntentQuestionLinks.map((item) => (
              <article
                key={item.href}
                data-free-tools-question-card
                className="flex min-h-[14rem] flex-col rounded-lg border border-white/10 bg-black/22 p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
              >
                <h3 className="break-words text-sm font-medium leading-snug text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52">{item.description}</p>
                <div className="mt-auto grid gap-2 pt-4">
                  <Link
                    data-free-tools-question-start
                    href={highIntentReadingHref(item)}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.18)] transition hover:brightness-110"
                  >
                    Start matching spread
                  </Link>
                  <Link
                    data-free-tools-question-guide
                    href={item.href}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/64 transition hover:border-[#bfb6ff]/40 hover:text-white"
                  >
                    Read guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          data-free-tools-social-proof
          className="mt-12 grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[0.86fr_1.14fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Reader proof</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
              Show trust before asking for an account
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              New visitors need to see how POPTarot is used before they commit. Feedback and examples keep the
              first step focused on free readings, daily return, and practical next actions.
            </p>
            <Link
              href="/reviews"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#eeeaff] hover:bg-white/[0.06]"
            >
              Read feedback
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {visibleTestimonials.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">&quot;{item.quote}&quot;</p>
                <p className="mt-3 text-xs leading-5 text-white/38">{item.context}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-free-tools-example-readings className="mt-12 border-t border-white/10 pt-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Realistic examples</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
              Let visitors preview the quality of a free answer
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              Examples make the product less abstract: a question, a spread, cards in context, and one next step.
            </p>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {sampleReadingExamples.map((item) => (
              <article
                key={item.title}
                className="flex min-h-[18rem] flex-col rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{item.label}</p>
                <h3 className="mt-3 text-base font-medium leading-snug text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.question}</p>
                <p className="mt-3 text-xs leading-5 text-white/40">{item.cards}</p>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/58">{item.interpretation}</p>
                <div className="mt-auto pt-4">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/68 transition hover:border-[#bfb6ff]/40 hover:text-white"
                  >
                    Start this path
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Trust assets</p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h2 className="font-serif text-2xl text-white sm:text-3xl">
                Free tools rank better when the brand is clear
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                These pages explain who maintains POPTarot, how AI tarot guidance is framed, what the privacy
                boundaries are, and where official brand signals live.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {trustLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/62 transition hover:border-[#bfb6ff]/45 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
