import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Cinzel, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { AudioProvider } from "@/contexts/audio-context"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { appUrl, siteDescription, siteName, siteTitle } from "@/lib/site"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "AI tarot reading",
    "free tarot reading",
    "online tarot cards",
    "daily tarot",
    "love tarot reading",
    "career tarot reading",
    "塔罗牌",
    "免费塔罗",
    "AI 塔罗",
    "每日塔罗",
  ],
  authors: [{ name: siteName, url: appUrl }],
  creator: siteName,
  publisher: siteName,
  category: "lifestyle",
  classification: "AI tarot reading web application",
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-48x48.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "POPTarot AI tarot reading",
      },
    ],
    locale: "en_US",
    alternateLocale: ["zh_CN", "ja_JP", "ko_KR", "es_ES", "pt_BR"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#160B2E",
    "msapplication-TileImage": "/icon-192x192.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
        <AudioProvider>
        <AuthProvider>
        {children}
        <AnalyticsTracker />
        </AuthProvider>
        </AudioProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
