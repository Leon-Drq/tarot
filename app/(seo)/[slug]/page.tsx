import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SeoLandingPageView } from "@/components/seo/seo-landing-page"
import { defaultLocale, localeOpenGraph } from "@/lib/locales"
import { getSeoAlternates, getSeoPage, seoPages } from "@/lib/seo-pages"

type Params = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoPage(slug, defaultLocale)
  if (!page) return {}
  const ogImage = `/api/og/seo?locale=${page.locale}&slug=${page.slug}`

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
      languages: {
        ...getSeoAlternates(page.slug),
        "x-default": page.path,
      },
    },
    openGraph: {
      title: `${page.title} | POPTarot`,
      description: page.description,
      url: page.path,
      type: "website",
      locale: localeOpenGraph[page.locale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | POPTarot`,
      description: page.description,
      images: [ogImage],
    },
  }
}

export default async function SeoLandingPage({ params }: Params) {
  const { slug } = await params
  const page = getSeoPage(slug, defaultLocale)
  if (!page) notFound()
  return <SeoLandingPageView page={page} />
}
