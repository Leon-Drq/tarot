import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: projectRoot,
  async headers() {
    const brandAssetHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
      {
        key: "X-Robots-Tag",
        value: "index, follow",
      },
    ]

    return [
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
      "/manifest.webmanifest",
      "/site.webmanifest",
    ].map((source) => ({
      source,
      headers: brandAssetHeaders,
    }))
  },
  async redirects() {
    return [
      {
        source: "/daily",
        destination: "/daily-tarot",
        permanent: true,
      },
      {
        source: "/daily/reading",
        destination: "/daily-tarot",
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "blob.v0.app",
      },
      {
        protocol: "https",
        hostname: "klinelife.oss-cn-beijing.aliyuncs.com",
      },
    ],
  },
}

export default nextConfig
