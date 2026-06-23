import type { Metadata } from "next"
import Link from "next/link"
import {
  appUrl,
  highIntentQuestionLinks,
  siteName,
  trustLinks,
} from "@/lib/site"
import { trustLastReviewed } from "@/lib/trust-signals"

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
      "@id": `${appUrl}/free-tarot-tools#question-list`,
      name: "Free tarot question paths",
      itemListElement: highIntentQuestionLinks.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
        url: `${appUrl}${item.href}`,
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
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
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
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-white/10 bg-black/22 p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
              >
                <h3 className="break-words text-sm font-medium leading-snug text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52">{item.description}</p>
              </Link>
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
