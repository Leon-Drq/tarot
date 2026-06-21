import type { MetadataRoute } from "next"
import { seoPages } from "@/lib/seo-pages"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

const routes = [
  { path: "/", priority: 1 },
  { path: "/daily", priority: 0.8 },
  { path: "/daily/reading", priority: 0.7 },
  { path: "/input", priority: 0.8 },
  { path: "/reading", priority: 0.7 },
  { path: "/membership", priority: 0.4 },
  ...seoPages.map((page) => ({ path: `/${page.slug}`, priority: 0.85 })),
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "daily" : "weekly",
    priority: route.priority,
  }))
}
