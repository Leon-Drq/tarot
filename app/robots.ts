import type { MetadataRoute } from "next"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/profile", "/input", "/reading", "/reading/", "/reveal", "/loading-reading", "/analytics"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
