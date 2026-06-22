import type { MetadataRoute } from "next"
import { seoLocales, localePath } from "@/lib/locales"
import { getAllLocalizedSeoPages } from "@/lib/seo-pages"
import { getCardSlug } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"
import { trustPages } from "@/lib/trust-pages"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

const baseRoutes = [
  { path: "/", priority: 1 },
  { path: "/daily-tarot", priority: 0.92 },
  { path: "/tarot-spreads", priority: 0.88 },
  { path: "/tarot-questions", priority: 0.87 },
  { path: "/input", priority: 0.8 },
  { path: "/reading", priority: 0.7 },
  { path: "/membership", priority: 0.4 },
]

const seoRoutes = getAllLocalizedSeoPages().map((page) => ({ path: page.path, priority: 0.86 }))
const trustRoutes = trustPages.map((page) => ({ path: `/${page.slug}`, priority: 0.58 }))

const cardRoutes = TAROT_CARDS.flatMap((card) =>
  seoLocales.map((locale) => ({
    path: localePath(locale, `/tarot-card-meanings/${getCardSlug(card)}`),
    priority: 0.72,
  })),
)

const routes = Array.from(
  new Map([...baseRoutes, ...seoRoutes, ...trustRoutes, ...cardRoutes].map((route) => [route.path, route])).values(),
)

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "daily" : "weekly",
    priority: route.priority,
  }))
}
