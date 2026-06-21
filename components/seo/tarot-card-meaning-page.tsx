import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { localePath } from "@/lib/locales"
import { getCardKeywords, type TarotCardSeoPage } from "@/lib/tarot-card-seo"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export function TarotCardMeaningPageView({ page }: { page: TarotCardSeoPage }) {
  const keywords = getCardKeywords(page.card)
  const meaningsHref = localePath(page.locale, "/tarot-card-meanings")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    image: page.card.image,
    url: `${appUrl}${page.path}`,
    inLanguage: page.locale,
    publisher: {
      "@type": "Organization",
      name: "POPTarot",
      url: appUrl,
    },
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_0%,rgba(123,83,178,0.38),transparent_34%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={meaningsHref}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs text-white/68 transition hover:border-[#dcb360]/45 hover:text-[#f3d58b]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {page.backLabel}
            </Link>
          </nav>

          <div className="grid min-h-[78vh] items-center gap-10 py-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
              <div className="relative aspect-[7/12] overflow-hidden rounded-xl border border-[#dcb360]/55 bg-[#211330] shadow-2xl shadow-black/45">
                <Image src={page.card.image} alt={page.title} fill className="object-cover" sizes="360px" priority />
                <div className="absolute inset-3 rounded-lg border border-[#f3d58b]/25" />
              </div>
            </div>

            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#f3d58b]">
                <Sparkles className="h-3.5 w-3.5" />
                {page.eyebrow}
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 text-base leading-8 text-white/72 sm:text-lg">{page.intro}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#dcb360]/20 bg-white/[0.04] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-[#f3d58b]">{page.uprightLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">{keywords.upright}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-white/55">{page.reversedLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{keywords.reversed}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.sections.map((section) => (
                  <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/input?q=${encodeURIComponent(page.tryQuestion)}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dcb360] px-6 py-3 text-sm font-medium text-[#14091f] transition hover:bg-[#f3d58b]"
                >
                  {page.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={meaningsHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  {page.backLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
