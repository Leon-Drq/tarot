import type { MetadataRoute } from "next"
import { seoLocales, localePath } from "@/lib/locales"
import { getAllLocalizedSeoPages, getSeoAlternates, getSeoPage } from "@/lib/seo-pages"
import { getCardSlug } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"
import { trustPages } from "@/lib/trust-pages"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

type SitemapRoute = {
  path: string
  priority: number
  alternates?: Record<string, string>
}

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${appUrl}${pathOrUrl}`
}

function absoluteAlternates(alternates: Record<string, string>) {
  return Object.fromEntries(Object.entries(alternates).map(([language, path]) => [language, absoluteUrl(path)]))
}

const spreadHubAlternates = {
  en: "/tarot-spreads",
  es: "/es/tiradas-tarot",
  "pt-br": "/pt-br/tiragens-tarot",
  "x-default": "/tarot-spreads",
}

const questionHubAlternates = {
  en: "/tarot-questions",
  es: "/es/preguntas-tarot",
  "pt-br": "/pt-br/perguntas-tarot",
  "x-default": "/tarot-questions",
}

function seoPageAlternates(sourceSlug: string) {
  return {
    ...getSeoAlternates(sourceSlug),
    "x-default": getSeoPage(sourceSlug)?.path || `/${sourceSlug}`,
  }
}

function cardAlternates(cardSlug: string) {
  return {
    ...Object.fromEntries(seoLocales.map((locale) => [locale, localePath(locale, `/tarot-card-meanings/${cardSlug}`)])),
    "x-default": `/tarot-card-meanings/${cardSlug}`,
  }
}

const baseRoutes = [
  { path: "/", priority: 1 },
  { path: "/free-tarot-tools", priority: 0.91 },
  { path: "/daily-tarot", priority: 0.92 },
  { path: "/tarot-card-combinations", priority: 0.84 },
  { path: "/membership", priority: 0.4 },
] satisfies SitemapRoute[]

const spreadHubRoutes = [
  { path: "/tarot-spreads", priority: 0.88, alternates: spreadHubAlternates },
  { path: "/es/tiradas-tarot", priority: 0.82, alternates: spreadHubAlternates },
  { path: "/pt-br/tiragens-tarot", priority: 0.82, alternates: spreadHubAlternates },
] satisfies SitemapRoute[]

const questionHubRoutes = [
  { path: "/tarot-questions", priority: 0.87, alternates: questionHubAlternates },
  { path: "/es/preguntas-tarot", priority: 0.84, alternates: questionHubAlternates },
  { path: "/pt-br/perguntas-tarot", priority: 0.84, alternates: questionHubAlternates },
] satisfies SitemapRoute[]

const seoRoutes = getAllLocalizedSeoPages().map((page) => ({
  path: page.path,
  priority: 0.86,
  alternates: seoPageAlternates(page.slug),
})) satisfies SitemapRoute[]
const trustRoutes = trustPages.map((page) => ({ path: `/${page.slug}`, priority: 0.58 })) satisfies SitemapRoute[]

const cardRoutes = TAROT_CARDS.flatMap((card) =>
  seoLocales.map((locale) => {
    const slug = getCardSlug(card)
    return {
      path: localePath(locale, `/tarot-card-meanings/${slug}`),
      priority: 0.72,
      alternates: cardAlternates(slug),
    }
  }),
) satisfies SitemapRoute[]

const routes: SitemapRoute[] = Array.from(
  new Map(
    [...baseRoutes, ...spreadHubRoutes, ...questionHubRoutes, ...seoRoutes, ...trustRoutes, ...cardRoutes].map((route) => [
      route.path,
      route,
    ]),
  ).values(),
)

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "daily" : "weekly",
    priority: route.priority,
    ...(route.alternates
      ? {
          alternates: {
            languages: absoluteAlternates(route.alternates),
          },
        }
      : {}),
  }))
}
