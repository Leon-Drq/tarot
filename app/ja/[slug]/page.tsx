import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SeoLandingPageView } from "@/components/seo/seo-landing-page"
import { localeOpenGraph } from "@/lib/locales"
import { getSeoAlternates, getSeoPage, getSeoStaticParams } from "@/lib/seo-pages"

const locale = "ja" as const

type Params = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getSeoStaticParams(locale)
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoPage(slug, locale)
  if (!page) return {}

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
      languages: {
        ...getSeoAlternates(page.slug),
        "x-default": getSeoPage(page.slug, "en")?.path || page.path,
      },
    },
    openGraph: {
      title: `${page.title} | POPTarot`,
      description: page.description,
      url: page.path,
      type: "website",
      locale: localeOpenGraph[page.locale],
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | POPTarot`,
      description: page.description,
      images: ["/og-image.jpg"],
    },
  }
}

export default async function LocalizedSeoLandingPage({ params }: Params) {
  const { slug } = await params
  const page = getSeoPage(slug, locale)
  if (!page) notFound()
  return <SeoLandingPageView page={page} />
}
