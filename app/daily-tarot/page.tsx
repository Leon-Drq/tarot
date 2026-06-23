import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CalendarPlus, Home, NotebookPen, Share2 } from "lucide-react"
import { DailyTarotTool } from "@/components/daily/daily-tarot-tool"
import {
  editorialTeamJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/site"
import { trustLastReviewed } from "@/lib/trust-signals"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
const dailyTitle = "Daily AI Tarot Reading"
const dailyDescription =
  "Draw one free AI tarot card every day, save a private tarot journal, keep your daily streak, and add a calendar reminder to return."

const dailyFaqs = [
  {
    question: "Is Daily Tarot free?",
    answer:
      "Yes. You can draw one daily tarot card and receive an AI interpretation for free. Membership is reserved for deeper follow-up questions, saved history, advanced spreads, and longer reports.",
  },
  {
    question: "Can I save a private journal note?",
    answer:
      "Yes. Daily Tarot includes a journal field for your mood, reflection, and what you want to remember. Local entries can be used immediately, and signed-in entries can sync to your account.",
  },
  {
    question: "How do Daily Tarot reminders work?",
    answer:
      "Calendar reminders are available now: choose a time, download the calendar file, and your phone calendar can remind you to return. Email reminders use a reminder email, preferred time, timezone, and unsubscribe link after delivery is connected.",
  },
  {
    question: "Should I treat the daily card as a prediction?",
    answer:
      "No. POPTarot frames the daily card as reflective guidance: one theme, one practical next step, and a reminder to notice what is within your control.",
  },
]

const dailySteps = [
  {
    name: "Draw one card",
    text: "Start with one free daily card so the ritual stays quick enough to repeat.",
  },
  {
    name: "Read the AI interpretation",
    text: "Use the interpretation to identify today's focus, emotional tone, and next step.",
  },
  {
    name: "Save a journal note",
    text: "Record what happened, how the card landed, and whether the guidance stayed useful.",
  },
  {
    name: "Return tomorrow",
    text: "Keep a streak, add a calendar reminder, and watch patterns across repeated cards.",
  },
]

const returnLoopItems = [
  {
    title: "Open from your home screen",
    text: "Save POPTarot to your phone home screen so Daily Tarot becomes a direct visit instead of a search.",
    icon: Home,
  },
  {
    title: "Add a calendar reminder",
    text: "Choose a return time in the tool and add the daily calendar reminder while email delivery is being connected.",
    icon: CalendarPlus,
  },
  {
    title: "Write one journal note",
    text: "A short note makes tomorrow's card more useful because you can compare the theme with what actually happened.",
    icon: NotebookPen,
  },
  {
    title: "Share one useful insight",
    text: "Share a daily card link or caption when the reading gives a practical next step worth saving.",
    icon: Share2,
  },
]

export const metadata: Metadata = {
  title: `${dailyTitle} | Free One Card Tarot`,
  description: dailyDescription,
  alternates: {
    canonical: `${appUrl}/daily-tarot`,
  },
  openGraph: {
    title: dailyTitle,
    description: "A free daily one-card tarot ritual with AI guidance, streaks, journal, and a calendar reminder.",
    url: `${appUrl}/daily-tarot`,
    siteName: "POPTarot",
    type: "website",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organizationJsonLd(),
    editorialTeamJsonLd(),
    websiteJsonLd(),
    softwareApplicationJsonLd(),
    {
      "@type": "WebPage",
      "@id": `${appUrl}/daily-tarot#webpage`,
      url: `${appUrl}/daily-tarot`,
      name: dailyTitle,
      description: dailyDescription,
      dateModified: trustLastReviewed,
      isAccessibleForFree: true,
      isPartOf: {
        "@id": `${appUrl}/#website`,
      },
      author: {
        "@id": `${appUrl}/#editorial-team`,
      },
      reviewedBy: {
        "@id": `${appUrl}/#editorial-team`,
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${appUrl}/daily-tarot#tool`,
      name: "Daily AI Tarot",
      applicationCategory: "LifestyleApplication",
      applicationSubCategory: "Daily tarot reading",
      operatingSystem: "Web",
      url: `${appUrl}/daily-tarot`,
      description: dailyDescription,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Free daily one-card tarot reading",
        "AI tarot interpretation",
        "Daily streak",
        "Private journal note",
        "Calendar reminder",
        "Email reminder preference after delivery is connected",
        "Shareable daily tarot result",
      ],
      maintainer: {
        "@id": `${appUrl}/#editorial-team`,
      },
      publisher: {
        "@id": `${appUrl}/#organization`,
      },
    },
    {
      "@type": "HowTo",
      "@id": `${appUrl}/daily-tarot#howto`,
      name: "How to use Daily Tarot",
      description: "A repeatable daily one-card tarot ritual for reflection and return visits.",
      step: dailySteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${appUrl}/daily-tarot#faq`,
      mainEntity: dailyFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${appUrl}/daily-tarot#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "POPTarot",
          item: appUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Daily Tarot",
          item: `${appUrl}/daily-tarot`,
        },
      ],
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
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            POP TAROT
          </Link>
          <Link href="/free-ai-tarot-reading" className="inline-flex min-h-10 items-center text-sm text-[#c9c0ff]/85 transition hover:text-white">
            Free AI Tarot
          </Link>
        </div>
      </header>
      <DailyTarotTool />
      <section className="border-t border-white/10 bg-[#0a0413]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">Return loop</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">
                Make Daily Tarot easy to revisit
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                Daily traffic grows when the ritual is simple: open the page directly, draw one card, write one note, and return tomorrow.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {returnLoopItems.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.08] text-[#d9d1ff]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium leading-snug text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-white/10 bg-[#0d0618]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">Daily return ritual</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">
              One card is enough when it becomes a habit
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Daily Tarot is built for repeat visits: a free card, a short AI interpretation, a private note, and an optional reminder. The goal is clarity you can return to, not a paid gate before the first reading.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {dailySteps.map((step, index) => (
              <article key={step.name} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/38">Step {index + 1}</p>
                <h3 className="mt-2 text-base font-medium text-white">{step.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#080310]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">Daily Tarot FAQ</p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">What to know before returning tomorrow</h2>
          </div>
          <div className="space-y-3">
            {dailyFaqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-base font-medium text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-white/62">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/daily-tarot"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
            >
              Draw today&apos;s card
            </Link>
            <Link
              href="/tarot-card-meanings"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
            >
              Learn card meanings
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
