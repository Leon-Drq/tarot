import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Bell, CalendarPlus, NotebookPen } from "lucide-react"
import { ShareCopyActions } from "@/components/share/share-copy-actions"
import { getSeoPage } from "@/lib/seo-pages"
import { getSpreadConfig, isKnownSpreadType, type SpreadConfig } from "@/lib/spread-config"
import { createAnonSupabase } from "@/lib/server/supabase"
import {
  editorialTeamJsonLd,
  highIntentQuestionLinks,
  organizationJsonLd,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import type { ReadingShare, ReadingShareCard } from "@/lib/api"
import { cleanReadingMarkdownForUser, createReadingShareExcerpt, extractReadingSections } from "@/lib/reading-presentation"

export const dynamic = "force-dynamic"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
const freeReadingHref = "/input?utm_source=share&utm_medium=public_share&utm_campaign=shared_reading"
const shareDailyReturnFeatures = [
  {
    title: "Daily card",
    body: "Come back for a fresh one-card AI reading without starting from search.",
    icon: CalendarPlus,
  },
  {
    title: "Journal streak",
    body: "Track repeat themes with a private note instead of treating the share as a one-time page.",
    icon: NotebookPen,
  },
  {
    title: "Reminder",
    body: "Use Daily Tarot reminder options so the next visit is direct, not accidental.",
    icon: Bell,
  },
]

type ShareSpreadContext = Pick<SpreadConfig, "name" | "nameEn" | "cardCount" | "descriptionEn" | "positions">

type Params = {
  params: Promise<{ slug: string }>
}

async function getShare(slug: string): Promise<ReadingShare | null> {
  if (!/^[a-z0-9-]{8,64}$/.test(slug)) return null

  try {
    const supabase = createAnonSupabase()
    const { data, error } = await supabase
      .from("reading_shares")
      .select("slug,question,cards,spread_type,interpretation_excerpt,created_at")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error || !data) return null
    return data as ReadingShare
  } catch {
    return null
  }
}

function cardLabel(card: ReadingShareCard) {
  return card.nameEn || card.name || "Tarot Card"
}

function getShareSpreadContext(spreadType: string | null | undefined): ShareSpreadContext {
  if (isKnownSpreadType(spreadType)) return getSpreadConfig(spreadType)

  if (spreadType === "one_card") {
    return {
      name: "每日一牌",
      nameEn: "One-Card Daily Tarot",
      cardCount: 1,
      descriptionEn: "A single daily card for reflection, journaling, and return visits.",
      positions: [{ name: "今日指引", nameEn: "Daily Card", description: "The central guidance for today." }],
    }
  }

  return getSpreadConfig("three_card")
}

function getSharePositionLabel(card: ReadingShareCard, spread: ShareSpreadContext, index: number) {
  if (card.position) return card.position
  return spread.positions[index]?.nameEn || `Position ${index + 1}`
}

function sharedReadingHref(share: ReadingShare) {
  const params = new URLSearchParams({
    q: share.question,
    auto: "1",
    source: "shared-reading",
    utm_source: "share",
    utm_medium: "public_share",
    utm_campaign: "shared_reading",
  })

  if (share.spread_type) params.set("spread", share.spread_type)

  return `/input?${params.toString()}`
}

function publicShareDailyReturnHref(question: string) {
  const params = new URLSearchParams({
    return_focus: question,
    return_action: "reminder",
    utm_source: "share",
    utm_medium: "public_share_daily_return",
    utm_campaign: "shared_reading",
  })

  return `/daily-tarot?${params.toString()}`
}

function questionSlugFromHref(href: string) {
  return href.replace(/^\//, "")
}

function publicShareQuestionReadingHref(item: (typeof highIntentQuestionLinks)[number]) {
  const slug = questionSlugFromHref(item.href)
  const page = getSeoPage(slug, "en")
  const params = new URLSearchParams({
    q: page?.ctaQuestion || item.title,
    auto: "1",
    source: "public-share-related-question",
    lang: "en",
    utm_source: "share",
    utm_medium: "public_share_related_question",
    utm_campaign: slug,
  })

  if (page?.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

function relatedQuestionSlugs(share: ReadingShare) {
  const text = `${share.question} ${share.spread_type || ""}`.toLowerCase()

  if (/(career|job|work|quit|money|salary|interview|success|business|promotion)/.test(text)) {
    return [
      "career-tarot-reading",
      "should-i-quit-my-job-tarot",
      "will-i-get-the-job-tarot",
      "money-tarot-reading",
    ]
  }

  if (/(ex|come back|get back|miss|contact|reconcile|breakup|no contact)/.test(text)) {
    return [
      "will-my-ex-come-back-tarot",
      "will-he-contact-me-tarot",
      "does-my-ex-miss-me-tarot",
      "will-we-get-back-together-tarot",
    ]
  }

  if (/(love|relationship|\bhe\b|\bhim\b|\bhis\b|soulmate|feel|intention|text)/.test(text)) {
    return [
      "does-he-love-me-tarot",
      "how-does-he-feel-about-me-tarot",
      "yes-or-no-tarot-love",
      "what-are-his-intentions-tarot",
    ]
  }

  return [
    "daily-love-tarot",
    "daily-career-tarot",
    "yes-or-no-tarot-love",
    "will-i-be-successful-tarot",
  ]
}

function publicShareRelatedQuestions(share: ReadingShare) {
  const bySlug = new Map(highIntentQuestionLinks.map((item) => [questionSlugFromHref(item.href), item]))
  return relatedQuestionSlugs(share)
    .map((slug) => bySlug.get(slug))
    .filter((item): item is (typeof highIntentQuestionLinks)[number] => Boolean(item))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const share = await getShare(slug)
  if (!share) {
    return {
      title: "Tarot Reading Not Found",
      robots: { index: false, follow: false },
      alternates: {
        canonical: `/share/${slug}`,
      },
    }
  }

  const title = `${share.question.slice(0, 72)} | POPTarot`
  const description =
    createReadingShareExcerpt(share.interpretation_excerpt || "", 220) || "A shared AI tarot reading from POPTarot."

  return {
    title,
    description,
    alternates: {
      canonical: `/share/${share.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/share/${share.slug}`,
      type: "article",
      images: [
        {
          url: `/share/${share.slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Shared POPTarot reading",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/share/${share.slug}/opengraph-image`],
    },
  }
}

export default async function SharePage({ params }: Params) {
  const { slug } = await params
  const share = await getShare(slug)
  if (!share) notFound()
  const visibleInterpretation = cleanReadingMarkdownForUser(share.interpretation_excerpt || "")
  const shareSummarySections = extractReadingSections(visibleInterpretation, 3)
  const description = createReadingShareExcerpt(visibleInterpretation, 260) || "A shared AI tarot reading from POPTarot."
  const sameQuestionHref = sharedReadingHref(share)
  const dailyReturnHref = publicShareDailyReturnHref(share.question)
  const spread = getShareSpreadContext(share.spread_type)
  const spreadName = spread.nameEn || spread.name
  const relatedQuestions = publicShareRelatedQuestions(share)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${appUrl}/share/${share.slug}#webpage`,
        url: `${appUrl}/share/${share.slug}`,
        name: share.question,
        description,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        primaryImageOfPage: `${appUrl}/share/${share.slug}/opengraph-image`,
        breadcrumb: {
          "@id": `${appUrl}/share/${share.slug}#breadcrumb`,
        },
        mainEntity: {
          "@id": `${appUrl}/share/${share.slug}#reading`,
        },
        hasPart: [
          {
            "@id": `${appUrl}/share/${share.slug}#daily-return-action`,
          },
          {
            "@id": `${appUrl}/share/${share.slug}#related-question-paths`,
          },
        ],
        potentialAction: [
          {
            "@type": "Action",
            name: "Ask this tarot question free",
            target: `${appUrl}${sameQuestionHref}`,
          },
          {
            "@type": "Action",
            name: "Open Daily Tarot for this shared reading",
            target: `${appUrl}${dailyReturnHref}`,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": `${appUrl}/share/${share.slug}#reading`,
        name: share.question,
        url: `${appUrl}/share/${share.slug}`,
        image: `${appUrl}/share/${share.slug}/opengraph-image`,
        datePublished: share.created_at,
        text: visibleInterpretation,
        isAccessibleForFree: true,
        about: ["AI tarot reading", "free tarot reading", "reflective tarot guidance"],
        author: {
          "@id": `${appUrl}/#organization`,
        },
        creator: {
          "@id": `${appUrl}/#app`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        mainEntityOfPage: {
          "@id": `${appUrl}/share/${share.slug}#webpage`,
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${appUrl}/share/${share.slug}#daily-return-action`,
        name: "Daily Tarot return path for this shared reading",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        url: `${appUrl}${dailyReturnHref}`,
        isAccessibleForFree: true,
        about: {
          "@id": `${appUrl}/share/${share.slug}#reading`,
        },
        isPartOf: {
          "@id": `${appUrl}/#app`,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        potentialAction: {
          "@type": "Action",
          name: "Return tomorrow with Daily Tarot",
          target: `${appUrl}${dailyReturnHref}`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}/share/${share.slug}#related-question-paths`,
        name: "Related free tarot question paths",
        description: "Long-tail tarot question pages connected from a public shared reading.",
        numberOfItems: relatedQuestions.length,
        itemListElement: relatedQuestions.map((item, index) => ({
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
              name: "Start related free tarot spread",
              target: `${appUrl}${publicShareQuestionReadingHref(item)}`,
            },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}/share/${share.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "POPTarot",
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shared Tarot Reading",
            item: `${appUrl}/share/${share.slug}`,
          },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#08030f] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(127,112,220,0.35),transparent_36%),linear-gradient(180deg,#12091e_0%,#08030f_100%)]" />
        <div className="relative mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-5 py-8 sm:px-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/75">
              POP TAROT
            </Link>
            <Link
              href={sameQuestionHref}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#c9c0ff]/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#eeeaff] transition hover:border-[#c9c0ff]/65 hover:bg-[#c9c0ff]/10"
            >
              Draw Cards
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
            <div className="mb-5 inline-flex w-fit items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
              Shared AI tarot reading
            </div>

            <h1 className="max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
              {share.question}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              A public POPTarot reading for reflection. Start with the same free flow, then return for a daily card or save deeper follow-ups later.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex min-h-9 items-center rounded-lg border border-[#c9c0ff]/22 bg-[#c9c0ff]/[0.07] px-3 text-xs text-[#eeeaff]">
                {spreadName}
              </span>
              <span className="inline-flex min-h-9 items-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs text-white/55">
                {share.cards.length || spread.cardCount} card{(share.cards.length || spread.cardCount) === 1 ? "" : "s"}
              </span>
              {spread.descriptionEn && (
                <span className="inline-flex min-h-9 items-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs text-white/55">
                  Position-aware reading
                </span>
              )}
            </div>

            <div className="mt-9 flex flex-wrap justify-center gap-4 sm:mt-10 sm:gap-6">
              {share.cards.slice(0, 5).map((card, index) => (
                <div key={`${card.id || card.name}-${index}`} className="flex w-[88px] flex-col items-center sm:w-[132px]">
                  <div className="relative aspect-[7/12] w-full overflow-hidden rounded-lg border border-[#c9c0ff]/35 bg-[#171022] shadow-2xl shadow-black/35">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={cardLabel(card)}
                        fill
                        className="object-cover"
                        sizes="140px"
                        style={{ transform: card.isReversed ? "rotate(180deg)" : "none" }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-3 text-center text-xs text-white/55">
                        {cardLabel(card)}
                      </div>
                    )}
                    <div className="absolute inset-2 rounded border border-[#eeeaff]/18" />
                  </div>
                  <p className="mt-3 line-clamp-1 text-center text-[11px] uppercase tracking-[0.14em] text-[#c9c0ff]/70">
                    {getSharePositionLabel(card, spread, index)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-center text-xs text-white/75">{cardLabel(card)}</p>
                  <p className="mt-1 text-[11px] text-white/42">{card.isReversed ? "Reversed" : "Upright"}</p>
                </div>
              ))}
            </div>

            {shareSummarySections.length > 0 && (
              <section className="mx-auto mt-10 max-w-3xl rounded-lg border border-[#c9c0ff]/18 bg-[#c9c0ff]/[0.055] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/72">Reading highlights</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">Start with the clearest signals</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {shareSummarySections.map((section) => (
                    <article key={`${section.title}-${section.body}`} className="rounded-lg border border-white/10 bg-black/18 p-3">
                      <h3 className="break-words text-sm font-medium leading-snug text-white">{section.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-white/52">{section.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {visibleInterpretation && (
              <article className="mx-auto mt-5 max-w-3xl rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <h2 className="font-serif text-2xl text-[#eeeaff]">Full reading</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-white/72 sm:text-base">
                  {visibleInterpretation}
                </p>
              </article>
            )}

            <div
              data-public-share-free-loop
              className="mx-auto mt-10 max-w-3xl rounded-lg border border-[#c9c0ff]/18 bg-[#c9c0ff]/[0.06] p-5 text-center sm:p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/72">Free reading loop</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">
                Ask the same question with your own cards
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Shared readings are for reflection. Start the same question free, keep the matching spread, and only upgrade later if you need deeper follow-up questions or saved history.
              </p>
            </div>

            <section
              data-public-share-daily-return
              className="mx-auto mt-4 max-w-3xl rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 lg:max-w-[22rem]">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/72">Daily return path</p>
                  <h2 className="mt-3 font-serif text-2xl leading-tight text-white">Make this reading a daily check-in</h2>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    If this shared reading resonates, use Daily Tarot tomorrow to see whether the same theme returns.
                  </p>
                </div>
                <ul className="grid min-w-0 gap-3 sm:grid-cols-3 lg:flex-1">
                  {shareDailyReturnFeatures.map((item) => {
                    const Icon = item.icon
                    return (
                      <li
                        key={item.title}
                        className="min-w-0 border-l border-white/12 pl-3"
                      >
                        <div className="flex items-center gap-2 text-[#eeeaff]">
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <p className="text-sm font-medium leading-tight">{item.title}</p>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-white/48">{item.body}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <Link
                href={dailyReturnHref}
                data-public-share-daily-return-cta
                data-public-share-daily-return-focus
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/32 bg-[#c9c0ff]/[0.09] px-5 py-2.5 text-sm font-medium text-[#eeeaff] transition hover:border-[#c9c0ff]/55 hover:bg-[#c9c0ff]/[0.14] sm:w-auto"
              >
                Open Daily Tarot
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            <section
              data-public-share-related-questions
              className="mx-auto mt-4 max-w-3xl rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/72">Related free questions</p>
                  <h2 className="mt-3 font-serif text-2xl leading-tight text-white">Keep exploring from a precise question</h2>
                </div>
                <Link
                  href="/tarot-questions?utm_source=share&utm_medium=public_share_related_question&utm_campaign=question_hub"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/28 px-4 py-2 text-xs text-[#eeeaff] transition hover:border-[#c9c0ff]/48 hover:bg-[#c9c0ff]/10"
                >
                  Browse all questions
                </Link>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/58">
                If this shared reading is close but not exact, open a related long-tail page or go straight into its free spread.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {relatedQuestions.map((item) => (
                  <article
                    key={item.href}
                    data-public-share-related-question-card
                    className="flex min-w-0 flex-col rounded-lg border border-white/10 bg-black/18 p-4"
                  >
                    <h3 className="break-words text-sm font-medium leading-snug text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/52">{item.description}</p>
                    <div className="mt-auto grid gap-2 pt-4">
                      <Link
                        data-public-share-related-question-start
                        href={publicShareQuestionReadingHref(item)}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-3 py-2 text-xs font-medium text-[#eeeaff] transition hover:bg-[#c9c0ff]/14"
                      >
                        Start free spread
                      </Link>
                      <Link
                        data-public-share-related-question-guide
                        href={item.href}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/62 transition hover:border-[#c9c0ff]/35 hover:text-white"
                      >
                        Read guide
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={sameQuestionHref}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f5f2ff_0%,#b7adff_44%,#6d63d8_100%)] px-7 py-3 text-sm font-medium text-[#0c0920] shadow-[0_18px_45px_rgba(109,99,216,0.28)] transition hover:brightness-110 sm:w-auto"
              >
                Ask This Question Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={freeReadingHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/14 px-7 py-3 text-sm text-white/72 transition hover:border-[#c9c0ff]/40 hover:bg-white/[0.05] sm:w-auto"
              >
                Start a New Question
              </Link>
              <Link
                href={dailyReturnHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/14 px-7 py-3 text-sm text-white/72 transition hover:border-[#c9c0ff]/40 hover:bg-white/[0.05] sm:w-auto"
              >
                Try Daily Tarot
              </Link>
            </div>

            <ShareCopyActions
              question={share.question}
              cards={share.cards}
              interpretation={description}
              url={`${appUrl}/share/${share.slug}`}
              dailyReturnUrl={`${appUrl}${dailyReturnHref}`}
            />

            <div className="mx-auto mt-9 grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3">
              {trustLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-center text-xs text-white/58 transition hover:border-[#c9c0ff]/40 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-6 text-white/42">
              AI tarot is symbolic guidance for reflection, not medical, legal, financial, psychological, or safety advice.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
