import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TarotCardMeaningPageView } from "@/components/seo/tarot-card-meaning-page"
import { localeOpenGraph, localePath, seoLocales } from "@/lib/locales"
import { getCardBySlug, getCardSlug, getTarotCardSeoPage } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"

type Params = {
  params: Promise<{ card: string }>
}

const locale = "es" as const

function cardAlternates(slug: string) {
  return Object.fromEntries(seoLocales.map((item) => [item, localePath(item, `/tarot-card-meanings/${slug}`)]))
}

export function generateStaticParams() {
  return TAROT_CARDS.map((card) => ({ card: getCardSlug(card) }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { card: slug } = await params
  const card = getCardBySlug(slug)
  if (!card) return {}

  const page = getTarotCardSeoPage(card, locale)
  const ogImage = `/api/og/tarot-card?locale=${page.locale}&card=${page.slug}`
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
      languages: {
        ...cardAlternates(page.slug),
        "x-default": localePath("en", `/tarot-card-meanings/${page.slug}`),
      },
    },
    openGraph: {
      title: `${page.title} | POPTarot`,
      description: page.description,
      url: page.path,
      type: "article",
      locale: localeOpenGraph[page.locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | POPTarot`,
      description: page.description,
      images: [ogImage],
    },
  }
}

export default async function SpanishTarotCardMeaningPage({ params }: Params) {
  const { card: slug } = await params
  const card = getCardBySlug(slug)
  if (!card) notFound()

  const page = getTarotCardSeoPage(card, locale)
  return <TarotCardMeaningPageView page={page} />
}
