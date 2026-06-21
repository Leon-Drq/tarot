import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, HelpCircle, Sparkles } from "lucide-react"
import type { SeoPage } from "@/lib/seo-pages"
import { getAllCardSeoPages } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export function SeoLandingPageView({ page }: { page: SeoPage }) {
  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)
  const cardPages = page.slug === "tarot-card-meanings" ? getAllCardSeoPages(page.locale) : []

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${appUrl}${page.path}#webpage`,
        url: `${appUrl}${page.path}`,
        name: page.title,
        description: page.description,
        inLanguage: page.locale,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}${page.path}#faq`,
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

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
          <nav className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:left-10 lg:right-10">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href="/input"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dcb360]/40 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#f3d58b] transition hover:border-[#f3d58b] hover:bg-[#dcb360]/10"
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
                  {page.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/daily-tarot"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  {page.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="flex min-h-[320px] items-center justify-center gap-4 sm:min-h-[360px] sm:gap-6">
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
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          {page.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <BookOpen className="mb-4 h-5 w-5 text-[#dcb360]" />
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      {cardPages.length > 0 && (
        <section className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-white">78 Tarot Cards</h2>
              <Link href="/input" className="text-sm text-[#f3d58b] hover:text-white">
                {page.primaryCta}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cardPages.map((cardPage) => (
                <Link
                  key={cardPage.path}
                  href={cardPage.path}
                  className="group rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#dcb360]/55 hover:bg-white/[0.06]"
                >
                  <div className="relative mx-auto aspect-[7/12] w-full max-w-[92px] overflow-hidden rounded-md border border-[#dcb360]/30 bg-[#211330]">
                    <Image src={cardPage.card.image} alt={cardPage.title} fill className="object-cover" sizes="110px" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-center text-xs leading-5 text-white/74 group-hover:text-white">
                    {cardPage.h1}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#080310]">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[#dcb360]" />
            <h2 className="font-serif text-2xl text-white">{page.questionsTitle}</h2>
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
              {page.bottomCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
