import type { MetadataRoute } from "next"
import { locales, localePath } from "@/lib/locales"
import { getAllLocalizedSeoPages } from "@/lib/seo-pages"
import { getCardSlug } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

const baseRoutes = [
  { path: "/", priority: 1 },
  { path: "/daily", priority: 0.8 },
  { path: "/daily/reading", priority: 0.7 },
  { path: "/input", priority: 0.8 },
  { path: "/reading", priority: 0.7 },
  { path: "/membership", priority: 0.4 },
]

const seoRoutes = getAllLocalizedSeoPages().map((page) => ({ path: page.path, priority: 0.86 }))

const cardRoutes = TAROT_CARDS.flatMap((card) =>
  locales.map((locale) => ({
    path: localePath(locale, `/tarot-card-meanings/${getCardSlug(card)}`),
    priority: 0.72,
  })),
)

const routes = Array.from(
  new Map([...baseRoutes, ...seoRoutes, ...cardRoutes].map((route) => [route.path, route])).values(),
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
