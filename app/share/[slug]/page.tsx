import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import { ShareCopyActions } from "@/components/share/share-copy-actions"
import { createAnonSupabase } from "@/lib/server/supabase"
import type { ReadingShare, ReadingShareCard } from "@/lib/api"

export const dynamic = "force-dynamic"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const share = await getShare(slug)
  if (!share) {
    return {
      title: "Tarot Reading",
      robots: { index: false, follow: false },
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: share.question,
    url: `${appUrl}/share/${share.slug}`,
    image: `${appUrl}/share/${share.slug}/opengraph-image`,
    datePublished: share.created_at,
    text: share.interpretation_excerpt,
    publisher: {
      "@type": "Organization",
      name: "POPTarot",
      url: appUrl,
    },
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(116,76,169,0.45),transparent_35%),linear-gradient(180deg,#14081f_0%,#08030f_100%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/75">
              POP TAROT
            </Link>
            <Link
              href="/input"
              className="inline-flex items-center gap-2 rounded-full border border-[#dcb360]/40 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#f3d58b] transition hover:border-[#f3d58b] hover:bg-[#dcb360]/10"
            >
              Draw Cards
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          <div className="flex flex-1 flex-col justify-center py-12">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#f3d58b]">
              <Sparkles className="h-3.5 w-3.5" />
              Shared Reading
            </div>

            <h1 className="max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
              {share.question}
            </h1>

            <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
              {share.cards.slice(0, 5).map((card, index) => (
                <div key={`${card.id || card.name}-${index}`} className="flex w-[92px] flex-col items-center sm:w-[132px]">
                  <div className="relative aspect-[7/12] w-full overflow-hidden rounded-lg border border-[#dcb360]/50 bg-[#211330] shadow-2xl shadow-black/35">
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
                    <div className="absolute inset-2 rounded border border-[#f3d58b]/25" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-center text-xs text-white/70">{cardLabel(card)}</p>
                  <p className="mt-1 text-[11px] text-[#dcb360]/70">{card.isReversed ? "Reversed" : "Upright"}</p>
                </div>
              ))}
            </div>

            {share.interpretation_excerpt && (
              <article className="mx-auto mt-12 max-w-3xl rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <h2 className="font-serif text-2xl text-[#f3d58b]">AI Interpretation</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-white/72 sm:text-base">
                  {share.interpretation_excerpt}
                </p>
              </article>
            )}

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/input"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dcb360] px-7 py-3 text-sm font-medium text-[#14091f] transition hover:bg-[#f3d58b]"
              >
                Start Your Free Reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/daily-tarot"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-7 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
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
          </div>
        </div>
      </section>
    </main>
  )
}
