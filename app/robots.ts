import type { MetadataRoute } from "next"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export default function robots(): MetadataRoute.Robots {
  const brandAssets = [
    "/favicon.ico",
    "/favicon.png",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon-48x48.png",
    "/favicon-96x96.png",
    "/apple-touch-icon.png",
    "/icon.png",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/icon.svg",
    "/logo.png",
    "/logo.svg",
    "/og-image.jpg",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/profile",
          "/input",
          "/reading",
          "/reading/",
          "/reveal",
          "/loading-reading",
          "/analytics",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: brandAssets,
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  }
}
