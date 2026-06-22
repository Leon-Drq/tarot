import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, siteName, websiteJsonLd } from "@/lib/site"
import { getSeoPage } from "@/lib/seo-pages"
import { SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { trustLastReviewed } from "@/lib/trust-signals"

type QuestionEntry = {
  slug?: string
  title: string
  query: string
  intent: string
  spread: SpreadType
  group: "Love" | "Career" | "Fast clarity"
}

const title = "Tarot Questions"
const description =
  "Choose a tarot question for love, ex reconciliation, yes-or-no answers, career, and job decisions, then start a free AI tarot spread."

const questionEntries: QuestionEntry[] = [
  {
    slug: "will-my-ex-come-back-tarot",
    title: "Will my ex come back?",
    query: "Will my ex come back, and what should I understand before I act?",
    intent: "For breakup clarity, remaining emotional energy, timing, and whether reaching out is wise.",
    spread: "breakup_recovery",
    group: "Love",
  },
  {
    slug: "does-he-love-me-tarot",
    title: "Does he love me?",
    query: "Does he love me, and what is the real emotional energy between us?",
    intent: "For mixed signals, emotional consistency, and whether the connection is mutual.",
    spread: "their_thoughts",
    group: "Love",
  },
  {
    slug: "yes-or-no-tarot-love",
    title: "Yes or no love tarot",
    query: "Give me a yes or no love tarot answer with the reason behind it.",
    intent: "For a simple love question when you still want the reason behind the answer.",
    spread: "yes_no",
    group: "Fast clarity",
  },
  {
    slug: "career-tarot-reading",
    title: "Career tarot reading",
    query: "What should I understand about my career path right now?",
    intent: "For job changes, interviews, workplace conflict, money choices, and professional direction.",
    spread: "job_opportunity",
    group: "Career",
  },
  {
    slug: "should-i-quit-my-job-tarot",
    title: "Should I quit my job?",
    query: "Should I quit my job, and what is the wisest next step?",
    intent: "For burnout, toxic workplaces, financial timing, and deciding whether to stay, plan, or leave.",
    spread: "job_opportunity",
    group: "Career",
  },
  {
    title: "Should I text them today?",
    query: "Should I text them today, and what should I consider first?",
    intent: "For quick contact decisions where the answer needs one clear next action.",
    spread: "yes_no",
    group: "Fast clarity",
  },
  {
    title: "What should I focus on this month?",
    query: "What should I focus on this month, and what pattern should I notice?",
    intent: "For a broader check-in that turns reflection into one practical priority.",
    spread: "three_card",
    group: "Fast clarity",
  },
  {
    title: "Is this connection worth pursuing?",
    query: "Is this connection worth pursuing, and what energy should I pay attention to?",
    intent: "For new love, uncertain dating energy, and whether the bond has real potential.",
    spread: "love_connection",
    group: "Love",
  },
]

const groupedEntries = [
  {
    label: "Love",
    title: "Love and relationship questions",
    body: "Use these when the real need is emotional clarity: feelings, reconnection, timing, mixed signals, or whether a bond is worth your energy.",
    entries: questionEntries.filter((entry) => entry.group === "Love"),
  },
  {
    label: "Career",
    title: "Career and work questions",
    body: "Use these when a job decision needs both intuition and practical next steps: stay, leave, prepare, negotiate, or change direction.",
    entries: questionEntries.filter((entry) => entry.group === "Career"),
  },
  {
    label: "Fast clarity",
    title: "Quick yes-or-no and direction questions",
    body: "Use these when you need a compact first answer, then let the spread explain the reason and the next action.",
    entries: questionEntries.filter((entry) => entry.group === "Fast clarity"),
  },
]

const faqs = [
  {
    question: "Can I start these tarot questions for free?",
    answer:
      "Yes. Each question can open a free AI tarot flow with the spread already selected. Membership is reserved for deeper follow-ups, saved history, advanced spreads, and longer reports.",
  },
  {
    question: "Should I ask a yes-or-no tarot question or an open question?",
    answer:
      "Use yes-or-no when the choice is simple. Use an open question when you need context, emotional pattern, timing, or a practical next step.",
  },
  {
    question: "Why does each question use a different tarot spread?",
    answer:
      "A breakup question needs more positions than a simple yes-or-no question. Matching the spread to the intent makes the reading more useful than a generic card draw.",
  },
]

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${appUrl}/tarot-questions`,
  },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: `${appUrl}/tarot-questions`,
    siteName,
    type: "website",
  },
}

function guideHref(entry: QuestionEntry) {
  if (!entry.slug) return "/tarot-spreads"
  return getSeoPage(entry.slug)?.path || `/${entry.slug}`
}

function readingHref(entry: QuestionEntry) {
  const params = new URLSearchParams({
    q: entry.query,
    auto: "1",
    spread: entry.spread,
    source: "tarot-questions",
  })
  return `/input?${params.toString()}`
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organizationJsonLd(),
    editorialTeamJsonLd(),
    websiteJsonLd(),
    {
      "@type": "CollectionPage",
      "@id": `${appUrl}/tarot-questions#webpage`,
      name: title,
      description,
      url: `${appUrl}/tarot-questions`,
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
      "@id": `${appUrl}/tarot-questions#question-list`,
      name: "Tarot questions on POPTarot",
      itemListElement: questionEntries.map((entry, index) => {
        const spread = SPREAD_CONFIGS[entry.spread]
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebPage",
            name: entry.title,
            description: entry.intent,
            url: `${appUrl}${guideHref(entry)}`,
            potentialAction: {
              "@type": "Action",
              name: "Start free tarot reading",
              target: `${appUrl}${readingHref(entry)}`,
              result: {
                "@type": "CreativeWork",
                name: `${spread.nameEn} AI tarot reading`,
              },
            },
          },
        }
      }),
    },
    {
      "@type": "FAQPage",
      "@id": `${appUrl}/tarot-questions#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${appUrl}/tarot-questions#breadcrumb`,
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
          item: `${appUrl}/tarot-questions`,
        },
      ],
    },
  ],
}

export default function TarotQuestionsPage() {
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
          <Link href="/tarot-spreads" className="text-sm text-[#c9c0ff]/85 transition hover:text-white">
            Tarot Spreads
          </Link>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.34),transparent_40%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/78">Question chooser</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Tarot Questions
            </h1>
            <p className="mt-6 text-base leading-8 text-white/66 sm:text-lg">
              Start from the question people actually search for, then open the free AI tarot flow with the right spread already selected.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Free first", body: "Each entry opens a free reading path before any membership decision." },
              { title: "Intent matched", body: "Love, ex, career, and yes-or-no questions use different card layouts." },
              { title: "Search ready", body: "High-intent guide pages and direct spread links reinforce each other." },
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
        <div className="grid gap-5">
          {groupedEntries.map((group) => (
            <section key={group.label} className="rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.45fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{group.label}</p>
                  <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">{group.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/58">{group.body}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.entries.map((entry) => {
                    const spread = SPREAD_CONFIGS[entry.spread]
                    return (
                      <article key={entry.title} className="rounded-lg border border-white/10 bg-[#0d0618]/72 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">
                              {spread.cardCount} card{spread.cardCount === 1 ? "" : "s"} · {spread.nameEn}
                            </p>
                            <h3 className="mt-2 text-lg font-medium leading-snug text-white">{entry.title}</h3>
                          </div>
                          <Search className="mt-1 h-4 w-4 shrink-0 text-[#c9c0ff]/60" />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/58">{entry.intent}</p>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <Link
                            href={readingHref(entry)}
                            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-3 py-2 text-sm font-medium text-[#120c22] shadow-[0_16px_34px_rgba(143,128,238,0.18)] transition hover:brightness-110"
                          >
                            Start free
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                          <Link
                            href={guideHref(entry)}
                            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-sm text-white/68 transition hover:border-[#bfb6ff]/40 hover:text-white"
                          >
                            Read guide
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0618]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">Better questions</p>
            <h2 className="mt-3 font-serif text-3xl text-white">How to choose the right tarot question</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              A good question names the situation and leaves room for interpretation. The goal is clarity you can act on, not a fixed prediction that removes your choice.
            </p>
            <Link
              href="/tarot-spreads"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#bfb6ff]/26 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.04]"
            >
              Browse every spread
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-medium text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
