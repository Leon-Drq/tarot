import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CalendarDays, Search, Shuffle } from "lucide-react"
import {
  appUrl,
  editorialTeamJsonLd,
  organizationJsonLd,
  siteName,
  websiteJsonLd,
} from "@/lib/site"
import { TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"
import { getCardBySlug, getCardSlug, getTarotCardSeoPage, type TarotCardSeoPage } from "@/lib/tarot-card-seo"
import { trustLastReviewed } from "@/lib/trust-signals"

type CombinationEntry = {
  source: TarotCard
  sourcePage: TarotCardSeoPage
  heading: string
  body: string
  cardHref: string
  pairedCard?: TarotCard
  pairedHref?: string
}

const path = "/tarot-card-combinations"
const pageTitle = "Tarot Card Combinations"
const pageDescription =
  "Learn common tarot card combinations for love, career, money, yes-or-no questions, daily tarot, and free AI tarot readings."

const featuredCardNames = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
  "Ace of Cups",
  "Two of Cups",
  "Ace of Pentacles",
]

const methodSections = [
  {
    title: "Start with the question",
    body: "A pair means something different in love, career, money, and daily guidance. Name the question first, then decide which card is the main signal and which card modifies it.",
  },
  {
    title: "Compare tension and support",
    body: "Some pairs reinforce each other, while others create useful tension. The Lovers with The Tower is not the same message as The Lovers with The Sun.",
  },
  {
    title: "Check upright and reversed tone",
    body: "A reversed card can show delay, blocked expression, avoidance, or an internal version of the same theme. Read the direction before forcing a yes or no answer.",
  },
  {
    title: "Turn the pair into one next step",
    body: "A good combination reading should end with a small action: ask a better question, wait, clarify, apologize, prepare, choose, or stop feeding the pattern.",
  },
] as const

const contextGuides = [
  {
    label: "Love",
    title: "Love tarot combinations",
    body: "Look for attraction, values, emotional safety, timing, and whether the cards show mutual effort or a repeating pattern.",
    href: "/love-tarot-card-meanings",
  },
  {
    label: "Career",
    title: "Career tarot combinations",
    body: "Read the pair through momentum, risk, structure, pressure, skill, authority, and the next practical decision.",
    href: "/career-tarot-card-meanings",
  },
  {
    label: "Money",
    title: "Money tarot combinations",
    body: "Use combinations to separate impulse from stability, short-term opportunity from long-term responsibility, and scarcity from planning.",
    href: "/money-tarot-card-meanings",
  },
  {
    label: "Yes or no",
    title: "Yes-or-no tarot combinations",
    body: "Pairs rarely give a flat answer. They show whether the answer is yes, no, not yet, or yes only after one condition changes.",
    href: "/yes-or-no-tarot-card-meanings",
  },
] as const

const faqItems = [
  {
    question: "What is a tarot card combination?",
    answer:
      "A tarot card combination is the shared message that appears when two or more cards are read together. The first card often names the core theme, while the second card shows pressure, context, support, or consequence.",
  },
  {
    question: "Should I memorize every tarot combination?",
    answer:
      "No. Start with card keywords, question context, card positions, and the relationship between the cards. Memorized meanings can help, but the reading should still respond to the actual question.",
  },
  {
    question: "Can tarot combinations answer love and career questions?",
    answer:
      "Yes. The same pair can shift meaning by context. In love it may describe attraction or boundaries; in career it may describe timing, leadership, skill, risk, or a practical decision.",
  },
  {
    question: "Can I use POPTarot to read a combination for free?",
    answer:
      "Yes. Start a free AI tarot reading, ask one real question, draw cards, and use the card meaning pages to compare upright, reversed, love, career, money, yes-or-no, advice, and combinations.",
  },
] as const

function cardMeaningPath(card: TarotCard) {
  return `/tarot-card-meanings/${getCardSlug(card)}`
}

function buildCombinationEntries() {
  return featuredCardNames
    .map((name) => TAROT_CARDS.find((card) => card.nameEn === name))
    .filter((card): card is TarotCard => Boolean(card))
    .flatMap((source) => {
      const sourcePage = getTarotCardSeoPage(source, "en")

      return sourcePage.combinations.map((item) => {
        const pairedCard = item.hrefSlug ? getCardBySlug(item.hrefSlug) : undefined
        return {
          source,
          sourcePage,
          heading: item.heading,
          body: item.body,
          cardHref: `${sourcePage.path}#combinations`,
          pairedCard,
          pairedHref: pairedCard ? `${cardMeaningPath(pairedCard)}#combinations` : undefined,
        }
      })
    })
}

const combinationEntries = buildCombinationEntries()
const previewEntries = combinationEntries.slice(0, 24)

function freeReadingHref(entry?: CombinationEntry) {
  const question = entry?.pairedCard
    ? `What does ${entry.source.nameEn} with ${entry.pairedCard.nameEn} mean for my situation?`
    : "What do these tarot cards mean together for my situation?"
  const campaign = entry ? `${getCardSlug(entry.source)}_combination` : "tarot_card_combinations"
  const params = new URLSearchParams({
    q: question,
    auto: "1",
    source: "card_combinations",
    lang: "en",
    spread: "three_card",
    utm_source: "seo",
    utm_medium: "card_combinations",
    utm_campaign: campaign,
  })

  return `/input?${params.toString()}`
}

const structuredData = {
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
      "@type": "CollectionPage",
      "@id": `${appUrl}${path}#webpage`,
      name: pageTitle,
      description: pageDescription,
      url: `${appUrl}${path}`,
      isAccessibleForFree: true,
      dateModified: trustLastReviewed,
      inLanguage: "en",
      about: ["tarot card combinations", "tarot card meanings", "free AI tarot reading"],
      reviewedBy: {
        "@id": `${appUrl}/#editorial-team`,
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
      mainEntity: {
        "@id": `${appUrl}${path}#popular-combinations`,
      },
    },
    {
      "@type": "ItemList",
      "@id": `${appUrl}${path}#popular-combinations`,
      name: "Popular Tarot Card Combinations",
      numberOfItems: previewEntries.length,
      itemListElement: previewEntries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.heading,
        description: entry.body,
        url: `${appUrl}${entry.cardHref}`,
      })),
    },
    {
      "@type": "HowTo",
      "@id": `${appUrl}${path}#how-to-read-card-combinations`,
      name: "How to read tarot card combinations",
      description: "A simple method for reading two tarot cards together before starting a free AI tarot spread.",
      step: methodSections.map((section, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: section.title,
        text: section.body,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${appUrl}${path}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: path,
  },
  openGraph: {
    title: `${pageTitle} | ${siteName}`,
    description: pageDescription,
    url: path,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "POPTarot tarot card combinations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${siteName}`,
    description: pageDescription,
    images: ["/og-image.jpg"],
  },
}

export default function TarotCardCombinationsPage() {
  const heroEntry = previewEntries[0]

  return (
    <main data-card-combinations-hub className="min-h-screen bg-[#0d0618] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto w-[min(92vw,1120px)] pb-14 pt-10 sm:pt-16 md:pb-20">
        <nav className="mb-8 text-xs text-white/42">
          <Link href="/tarot-card-meanings" className="inline-flex min-h-10 items-center gap-2 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Tarot Card Meanings
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c9c0ff]/72">Card meaning guide</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Tarot Card Combinations
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
              Learn how two tarot cards change each other, then open a free AI tarot spread when you want the
              combination read inside your real question.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                data-card-combination-start-free
                href={freeReadingHref(heroEntry)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f7f4ff_0%,#c9c0ff_48%,#8f80ee_100%)] px-5 text-sm font-semibold text-[#120c22] shadow-[0_18px_46px_rgba(143,128,238,0.28)] transition hover:brightness-110"
              >
                Start free combination reading
                <Shuffle className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/daily-tarot?utm_source=card_combinations&utm_medium=hero&utm_campaign=daily_return"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-5 text-sm font-medium text-white/72 transition hover:border-[#c9c0ff]/42 hover:text-white"
              >
                Use in Daily Tarot
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e7ddff]/58">Quick method</p>
            <div className="mt-4 grid gap-3">
              {methodSections.slice(0, 3).map((section, index) => (
                <div key={section.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c9c0ff]/12 text-xs text-[#f0ecff]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium text-white">{section.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/56">{section.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#150b25] py-12 sm:py-16">
        <div className="mx-auto w-[min(92vw,1120px)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.26em] text-[#9fd8d0]/76">Popular paths</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
                Common Tarot Card Combination Paths
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">
                These pairs link back to the deeper single-card pages where upright, reversed, love, career,
                money, yes-or-no, advice, and FAQ sections already live.
              </p>
            </div>
            <Link
              href="/tarot-card-meanings"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#c9c0ff]/40 hover:text-white"
            >
              Browse all 78 cards
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {previewEntries.map((entry) => (
              <article
                key={`${entry.source.id}-${entry.heading}`}
                className="min-w-0 rounded-lg border border-white/10 bg-[#0d0618]/78 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9fd8d0]/70">
                  {entry.pairedCard ? `${entry.source.nameEn} pair` : `${entry.source.nameEn} pattern`}
                </p>
                <h3 className="mt-3 break-words text-base font-semibold leading-6 text-white">{entry.heading}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{entry.body}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    data-card-combination-hub-link
                    href={entry.cardHref}
                    className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c9c0ff] transition hover:text-white"
                  >
                    Read meaning
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={freeReadingHref(entry)}
                    className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.12em] text-white/48 transition hover:text-white"
                  >
                    Try free spread
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(92vw,1120px)] gap-10 py-14 md:grid-cols-[0.92fr_1.08fr] md:py-20">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.26em] text-[#c9c0ff]/72">Reading contexts</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
            Read the same pair through the right context
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/58">
            A tarot combination is strongest when it answers the actual situation. Use these context hubs to
            avoid turning every pair into the same generic interpretation.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {contextGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#9fd8d0]/35 hover:bg-white/[0.055]"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9fd8d0]/70">{guide.label}</p>
              <h3 className="mt-3 break-words text-base font-semibold text-white">{guide.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{guide.body}</p>
              <span className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c9c0ff] transition group-hover:text-white">
                Open context guide
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#10091d] py-14 md:py-20">
        <div className="mx-auto grid w-[min(92vw,1120px)] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9fd8d0]/76">How to read pairs</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
              A practical combination method
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58">
              Use this before you draw more cards. It keeps a reading focused, especially on mobile when a user
              wants a clear answer without scanning a huge reference table.
            </p>
          </div>
          <div data-card-combination-method className="grid gap-4 sm:grid-cols-2">
            {methodSections.map((section, index) => (
              <article key={section.title} className="rounded-lg border border-white/10 bg-[#0d0618]/76 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/68">Step {index + 1}</p>
                <h3 className="mt-3 text-base font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(92vw,1120px)] py-14 md:py-20">
        <div
          data-card-combination-daily-return
          className="rounded-lg border border-[#9fd8d0]/22 bg-[#9fd8d0]/[0.055] p-6 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9fd8d0]/76">Daily return loop</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white">Use combinations after your daily card</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                Draw one daily card, write the note, and compare it with the cards that keep appearing in your
                readings. That gives users a natural reason to come back without forcing a membership pitch.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/daily-tarot?utm_source=card_combinations&utm_medium=daily_return_panel&utm_campaign=return_loop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#d8f3ee] px-5 text-sm font-semibold text-[#09211d] transition hover:brightness-110"
              >
                Open Daily Tarot
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/tarot-questions"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-5 text-sm font-medium text-white/72 transition hover:border-[#c9c0ff]/40 hover:text-white"
              >
                Find a question
                <Search className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(92vw,920px)] pb-16 md:pb-24">
        <div data-card-combination-faq className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.035]">
          {faqItems.map((item) => (
            <article key={item.question} className="p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
