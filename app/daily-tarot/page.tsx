import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DailyTarotTool } from "@/components/daily/daily-tarot-tool"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export const metadata: Metadata = {
  title: "Daily AI Tarot Reading | Free One Card Tarot",
  description:
    "Draw one free AI tarot card every day, save a private tarot journal, keep your daily streak, and set a reminder to return.",
  alternates: {
    canonical: `${appUrl}/daily-tarot`,
  },
  openGraph: {
    title: "Daily AI Tarot Reading",
    description: "A free daily one-card tarot ritual with AI guidance, streaks, journal, and reminders.",
    url: `${appUrl}/daily-tarot`,
    siteName: "POPTarot",
    type: "website",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${appUrl}/daily-tarot#webpage`,
      url: `${appUrl}/daily-tarot`,
      name: "Daily AI Tarot Reading",
      description: metadata.description,
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/daily-tarot#tool`,
      name: "Daily AI Tarot",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
}

export default function DailyTarotPage() {
  return (
    <main className="min-h-screen bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="border-b border-white/10 bg-[#0d0618]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            POP TAROT
          </Link>
          <Link href="/free-ai-tarot-reading" className="text-sm text-[#dcb360] transition hover:text-[#f3d58b]">
            Free AI Tarot
          </Link>
        </div>
      </header>
      <DailyTarotTool />
    </main>
  )
}
