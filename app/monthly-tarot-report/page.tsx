import type { Metadata } from "next"

import { MonthlyTarotReportView } from "@/components/monthly/monthly-tarot-report"
import { defaultLocale, localeOpenGraph } from "@/lib/locales"
import { appUrl } from "@/lib/site"
import { getSeoAlternates, getSeoPage } from "@/lib/seo-pages"

const seoPage = getSeoPage("monthly-tarot-report", defaultLocale)
const ogImage = "/api/og/seo?locale=en&slug=monthly-tarot-report"

export const metadata: Metadata = {
  title: seoPage?.title || "Monthly Tarot Report",
  description:
    seoPage?.description ||
    "Start a free monthly tarot check-in and unlock deeper member reports built from saved readings, recurring cards, and journal themes.",
  alternates: {
    canonical: "/monthly-tarot-report",
    languages: {
      ...getSeoAlternates("monthly-tarot-report"),
      "x-default": "/monthly-tarot-report",
    },
  },
  openGraph: {
    title: `${seoPage?.title || "Monthly Tarot Report"} | POPTarot`,
    description:
      seoPage?.description ||
      "Start a free monthly tarot check-in and unlock deeper member reports built from saved readings, recurring cards, and journal themes.",
    url: `${appUrl}/monthly-tarot-report`,
    type: "website",
    locale: localeOpenGraph[defaultLocale],
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: seoPage?.title || "Monthly Tarot Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${seoPage?.title || "Monthly Tarot Report"} | POPTarot`,
    description:
      seoPage?.description ||
      "Start a free monthly tarot check-in and unlock deeper member reports built from saved readings, recurring cards, and journal themes.",
    images: [ogImage],
  },
}

export default function MonthlyTarotReportPage() {
  return <MonthlyTarotReportView />
}
