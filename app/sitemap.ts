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
  images?: string[]
}

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${appUrl}${pathOrUrl}`
}

function absoluteAlternates(alternates: Record<string, string>) {
  return Object.fromEntries(Object.entries(alternates).map(([language, path]) => [language, absoluteUrl(path)]))
}

const brandIdentityImages = [
  "/logo.png",
  "/search-favicon.png",
  "/favicon.png",
  "/og-image.jpg",
]

const freeToolsHubAlternates = {
  en: "/free-tarot-tools",
  es: "/es/herramientas-tarot-gratis",
  "pt-br": "/pt-br/ferramentas-tarot-gratis",
  "x-default": "/free-tarot-tools",
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

const combinationHubAlternates = {
  en: "/tarot-card-combinations",
  es: "/es/combinaciones-cartas-tarot",
  "pt-br": "/pt-br/combinacoes-cartas-tarot",
  "x-default": "/tarot-card-combinations",
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
  { path: "/", priority: 1, images: brandIdentityImages },
  { path: "/daily-tarot", priority: 0.92, images: ["/logo.png", "/og-image.jpg"] },
  { path: "/membership", priority: 0.4 },
] satisfies SitemapRoute[]

const freeToolsHubRoutes = [
  { path: "/free-tarot-tools", priority: 0.91, alternates: freeToolsHubAlternates, images: ["/logo.png", "/og-image.jpg"] },
  { path: "/es/herramientas-tarot-gratis", priority: 0.86, alternates: freeToolsHubAlternates, images: ["/logo.png", "/og-image.jpg"] },
  { path: "/pt-br/ferramentas-tarot-gratis", priority: 0.86, alternates: freeToolsHubAlternates, images: ["/logo.png", "/og-image.jpg"] },
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

const combinationHubRoutes = [
  { path: "/tarot-card-combinations", priority: 0.84, alternates: combinationHubAlternates },
  { path: "/es/combinaciones-cartas-tarot", priority: 0.8, alternates: combinationHubAlternates },
  { path: "/pt-br/combinacoes-cartas-tarot", priority: 0.8, alternates: combinationHubAlternates },
] satisfies SitemapRoute[]

const seoRoutes = getAllLocalizedSeoPages().map((page) => ({
  path: page.path,
  priority: 0.86,
  alternates: seoPageAlternates(page.slug),
})) satisfies SitemapRoute[]
const trustRoutes = trustPages.map((page) => ({
  path: `/${page.slug}`,
  priority: 0.58,
  ...(page.slug === "brand-assets" || page.slug === "official-channels" ? { images: brandIdentityImages } : {}),
})) satisfies SitemapRoute[]

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
    [
      ...baseRoutes,
      ...freeToolsHubRoutes,
      ...spreadHubRoutes,
      ...questionHubRoutes,
      ...combinationHubRoutes,
      ...seoRoutes,
      ...trustRoutes,
      ...cardRoutes,
    ].map((route) => [route.path, route]),
  ).values(),
)

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "daily" : "weekly",
    priority: route.priority,
    ...(route.images ? { images: route.images.map(absoluteUrl) } : {}),
    ...(route.alternates
      ? {
          alternates: {
            languages: absoluteAlternates(route.alternates),
          },
        }
      : {}),
  }))
}
