import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, siteName, websiteJsonLd } from "@/lib/site"
import { SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { trustLastReviewed } from "@/lib/trust-signals"

const spreadOrder: SpreadType[] = [
  "yes_no",
  "three_card",
  "relationship",
  "their_thoughts",
  "breakup_recovery",
  "job_opportunity",
  "binary_choice",
  "love_connection",
  "exam_fortune",
  "shopping_decision",
  "interpersonal",
]

const spreadQuestions: Record<SpreadType, string> = {
  yes_no: "Should I text first?",
  daily_fashion: "What energy should guide my style today?",
  breakup_recovery: "Will my ex come back, and what should I understand before I act?",
  exam_fortune: "What should I focus on before this exam?",
  shopping_decision: "Is this purchase actually worth it for me?",
  love_connection: "What should I know about new love entering my life?",
  relationship: "What is the real energy between us right now?",
  their_thoughts: "What are their real feelings and likely next action?",
  job_opportunity: "What should I understand about my career path right now?",
  binary_choice: "Should I choose option A or option B?",
  interpersonal: "What should I understand about this relationship tension?",
  triple_choice: "Which direction is most aligned for me now?",
  three_card: "What do I need to understand about the next chapter?",
}

const spreadGroups = [
  {
    label: "Fast clarity",
    title: "Quick free tarot spreads",
    body: "Start with one to three cards when the question is clear and you want a practical first answer.",
    spreads: ["yes_no", "three_card", "binary_choice"] satisfies SpreadType[],
  },
  {
    label: "Love and feelings",
    title: "Relationship tarot spreads",
    body: "Use these when you need emotional context, not just a forced yes or no.",
    spreads: ["relationship", "their_thoughts", "breakup_recovery", "love_connection"] satisfies SpreadType[],
  },
  {
    label: "Work and life",
    title: "Decision tarot spreads",
    body: "For career, exams, purchases, and social situations, turn the reading into one next action.",
    spreads: ["job_opportunity", "exam_fortune", "shopping_decision", "interpersonal"] satisfies SpreadType[],
  },
]

const title = "Free Tarot Spreads"
const description =
  "Choose a free tarot spread for yes or no questions, love, ex reconciliation, career decisions, daily guidance, and practical next steps."

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${appUrl}/tarot-spreads`,
  },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: `${appUrl}/tarot-spreads`,
    siteName,
    type: "website",
  },
}

function spreadHref(type: SpreadType) {
  const question = spreadQuestions[type]
  return `/input?q=${encodeURIComponent(question)}&auto=1&spread=${encodeURIComponent(type)}&source=tarot-spreads`
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organizationJsonLd(),
    editorialTeamJsonLd(),
    websiteJsonLd(),
    {
      "@type": "CollectionPage",
      "@id": `${appUrl}/tarot-spreads#webpage`,
      name: title,
      description,
      url: `${appUrl}/tarot-spreads`,
      dateModified: trustLastReviewed,
      isAccessibleForFree: true,
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
      author: {
        "@id": `${appUrl}/#editorial-team`,
      },
      reviewedBy: {
        "@id": `${appUrl}/#editorial-team`,
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}/tarot-spreads#spread-list`,
      name: "Free tarot spreads on POPTarot",
      itemListElement: spreadOrder.map((type, index) => {
        const spread = SPREAD_CONFIGS[type]
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "HowTo",
            name: spread.nameEn,
            description: spread.descriptionEn,
            totalTime: "PT3M",
            supply: `${spread.cardCount} tarot card${spread.cardCount === 1 ? "" : "s"}`,
            url: `${appUrl}${spreadHref(type)}`,
            step: spread.positions.map((position, positionIndex) => ({
              "@type": "HowToStep",
              position: positionIndex + 1,
              name: position.nameEn,
              text: position.description,
            })),
          },
        }
      }),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${appUrl}/tarot-spreads#breadcrumb`,
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
          name: title,
          item: `${appUrl}/tarot-spreads`,
        },
      ],
    },
  ],
}

export default function TarotSpreadsPage() {
  return (
    <main className="min-h-screen bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="border-b border-white/10 bg-[#0d0618]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            POP TAROT
          </Link>
          <Link href="/daily-tarot" className="text-sm text-[#c9c0ff]/85 transition hover:text-white">
            Daily Tarot
          </Link>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.36),transparent_38%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/78">Free spread chooser</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Free Tarot Spreads
            </h1>
            <p className="mt-6 text-base leading-8 text-white/66 sm:text-lg">
              Pick the spread that matches your question, then enter the free AI tarot flow with the card count already set.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Free first", body: "Start with a spread before paying. Membership is for deep follow-ups and saved history." },
              { title: "Question matched", body: "Each spread is built around the kind of answer people actually need." },
              { title: "Mobile ready", body: "The chooser leads straight into the existing mobile card selection flow." },
            ].map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h2 className="text-sm font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {spreadOrder.map((type) => {
            const spread = SPREAD_CONFIGS[type]
            return (
              <article key={type} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">
                      {spread.cardCount} card{spread.cardCount === 1 ? "" : "s"}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-white">{spread.nameEn}</h2>
                  </div>
                  <span className="rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.07] px-3 py-1.5 text-xs text-[#eeeaff]">
                    {spread.icon}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/62">{spread.descriptionEn}</p>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/36">Positions</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {spread.positions.map((position) => (
                      <span
                        key={position.nameEn}
                        className="rounded-full border border-white/10 bg-black/18 px-3 py-1.5 text-xs text-white/58"
                      >
                        {position.nameEn}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={spreadHref(type)}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 py-2 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.2)] transition hover:brightness-110 sm:w-auto"
                >
                  Start this spread
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0618]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Choose by situation</p>
            <h2 className="mt-3 font-serif text-3xl text-white">Which spread should I use?</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              If the question is emotional, choose a relationship spread. If it is practical, choose a decision or career spread. If it is simple, start with one card.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {spreadGroups.map((group) => (
              <article key={group.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/75">{group.label}</p>
                <h3 className="mt-3 font-serif text-2xl text-white">{group.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{group.body}</p>
                <div className="mt-4 space-y-2">
                  {group.spreads.map((type) => (
                    <Link
                      key={type}
                      href={spreadHref(type)}
                      className="flex min-h-10 items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/66 transition hover:border-[#bfb6ff]/35 hover:bg-white/[0.04] hover:text-white"
                    >
                      {SPREAD_CONFIGS[type].nameEn}
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
