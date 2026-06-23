import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { ShareCopyActions } from "@/components/share/share-copy-actions"
import { createAnonSupabase } from "@/lib/server/supabase"
import {
  editorialTeamJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import type { ReadingShare, ReadingShareCard } from "@/lib/api"

export const dynamic = "force-dynamic"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
const freeReadingHref = "/input?utm_source=share&utm_medium=public_share&utm_campaign=shared_reading"
const dailyTarotHref = "/daily-tarot?utm_source=share&utm_medium=public_share&utm_campaign=shared_reading"

type Params = {
  params: Promise<{ slug: string }>
}

async function getShare(slug: string): Promise<ReadingShare | null> {
  if (!/^[a-z0-9-]{8,64}$/.test(slug)) return null

  const supabase = createAnonSupabase()
  const { data, error } = await supabase
    .from("reading_shares")
    .select("slug,question,cards,spread_type,interpretation_excerpt,created_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !data) return null
  return data as ReadingShare
}

function cardLabel(card: ReadingShareCard) {
  return card.nameEn || card.name || "Tarot Card"
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
    share.interpretation_excerpt || "A shared AI tarot reading from POPTarot."

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
  const description = share.interpretation_excerpt || "A shared AI tarot reading from POPTarot."
  const sameQuestionHref = sharedReadingHref(share)

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
        potentialAction: {
          "@type": "Action",
          name: "Ask this tarot question free",
          target: `${appUrl}${sameQuestionHref}`,
        },
      },
      {
        "@type": "CreativeWork",
        "@id": `${appUrl}/share/${share.slug}#reading`,
        name: share.question,
        url: `${appUrl}/share/${share.slug}`,
        image: `${appUrl}/share/${share.slug}/opengraph-image`,
        datePublished: share.created_at,
        text: share.interpretation_excerpt,
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
                  <p className="mt-3 line-clamp-2 text-center text-xs text-white/70">{cardLabel(card)}</p>
                  <p className="mt-1 text-[11px] text-[#c9c0ff]/70">{card.isReversed ? "Reversed" : "Upright"}</p>
                </div>
              ))}
            </div>

            {share.interpretation_excerpt && (
              <article className="mx-auto mt-12 max-w-3xl rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <h2 className="font-serif text-2xl text-[#eeeaff]">AI Interpretation</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-white/72 sm:text-base">
                  {share.interpretation_excerpt}
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
                href={dailyTarotHref}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/14 px-7 py-3 text-sm text-white/72 transition hover:border-[#c9c0ff]/40 hover:bg-white/[0.05] sm:w-auto"
              >
                Try Daily Tarot
              </Link>
            </div>

            <ShareCopyActions
              question={share.question}
              cards={share.cards}
              interpretation={share.interpretation_excerpt}
              url={`${appUrl}/share/${share.slug}`}
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
