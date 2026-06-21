import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sparkles, ArrowRight, BookOpen, HelpCircle } from "lucide-react"
import { getSeoPage, seoPages } from "@/lib/seo-pages"
import { TAROT_CARDS } from "@/lib/tarot-cards"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

type Params = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoPage(slug)
  if (!page) return {}

  const path = `/${page.slug}`

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${page.title} | POPTarot`,
      description: page.description,
      url: path,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | POPTarot`,
      description: page.description,
      images: ["/og-image.jpg"],
    },
  }
}

export default async function SeoLandingPage({ params }: Params) {
  const { slug } = await params
  const page = getSeoPage(slug)
  if (!page) notFound()

  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${appUrl}/${page.slug}#webpage`,
        url: `${appUrl}/${page.slug}`,
        name: page.title,
        description: page.description,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}/${page.slug}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.42),transparent_36%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
          <nav className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:left-10 lg:right-10">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href="/input"
              className="inline-flex items-center gap-2 rounded-full border border-[#dcb360]/40 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#f3d58b] transition hover:border-[#f3d58b] hover:bg-[#dcb360]/10"
            >
              Start
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#f3d58b]">
                <Sparkles className="h-3.5 w-3.5" />
                {page.eyebrow}
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{page.intro}</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/56">{page.intent}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/input?q=${encodeURIComponent(page.ctaQuestion)}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dcb360] px-6 py-3 text-sm font-medium text-[#14091f] transition hover:bg-[#f3d58b]"
                >
                  Free Reading
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/membership"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  Unlimited Readings
                </Link>
              </div>
            </div>

            <div className="flex min-h-[360px] items-center justify-center gap-4 sm:gap-6">
              {cards.map((card, index) =>
                card ? (
                  <div
                    key={card.id}
                    className="relative aspect-[7/12] w-[28%] max-w-[160px] overflow-hidden rounded-lg border border-[#dcb360]/50 bg-[#211330] shadow-2xl shadow-black/40"
                    style={{
                      transform: `translateY(${index === 1 ? "-28px" : "18px"}) rotate(${index === 0 ? "-9deg" : index === 2 ? "9deg" : "0deg"})`,
                    }}
                  >
                    <Image src={card.image} alt={card.nameEn} fill className="object-cover" sizes="180px" />
                    <div className="absolute inset-2 rounded border border-[#f3d58b]/25" />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0618]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-10">
          {page.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <BookOpen className="mb-4 h-5 w-5 text-[#dcb360]" />
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#080310]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[#dcb360]" />
            <h2 className="font-serif text-2xl text-white">Questions</h2>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-base font-medium text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-white/62">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/input?q=${encodeURIComponent(page.ctaQuestion)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dcb360] px-7 py-3 text-sm font-medium text-[#14091f] transition hover:bg-[#f3d58b]"
            >
              Draw Your Cards
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
