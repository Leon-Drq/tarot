import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { localePath } from "@/lib/locales"
import { getCardKeywords, type TarotCardSeoPage } from "@/lib/tarot-card-seo"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, trustLinks, websiteJsonLd } from "@/lib/site"
import type { SpreadType } from "@/lib/spread-config"
import { trustLastReviewed } from "@/lib/trust-signals"

function readingHref(page: TarotCardSeoPage) {
  const params = new URLSearchParams({
    q: page.tryQuestion,
    auto: "1",
    lang: page.locale,
    spread: "three_card",
    utm_source: "seo",
    utm_medium: "card_meaning",
    utm_campaign: page.slug,
  })

  return `/input?${params.toString()}`
}

type CardPrompt = {
  label: string
  question: string
  spread: SpreadType
}

function cardDisplayName(page: TarotCardSeoPage) {
  if (page.locale === "zh") return page.card.name
  if (page.locale === "ja") return page.card.nameJa || page.card.nameEn
  if (page.locale === "ko") return page.card.nameKo || page.card.nameEn
  return page.card.nameEn
}

function cardPromptHref(page: TarotCardSeoPage, prompt: CardPrompt) {
  const params = new URLSearchParams({
    q: prompt.question,
    auto: "1",
    lang: page.locale,
    spread: prompt.spread,
    utm_source: "seo",
    utm_medium: "card_prompt",
    utm_campaign: page.slug,
  })

  return `/input?${params.toString()}`
}

function cardPromptCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)

  if (page.locale === "es") {
    return {
      eyebrow: "Preguntas para probar",
      title: `Usa ${name} en una lectura gratis`,
      body: "Convierte el significado de la carta en una pregunta concreta. Cada enlace abre una lectura de IA gratuita con una tirada adecuada.",
      action: "Tirar esta pregunta",
      prompts: [
        { label: "Amor", question: `Que significa ${name} para mi vida amorosa ahora?`, spread: "relationship" },
        { label: "Carrera", question: `Como puedo usar la energia de ${name} en mi carrera esta semana?`, spread: "job_opportunity" },
        { label: "Si o no", question: `${name} sugiere si o no para mi decision actual?`, spread: "yes_no" },
      ] satisfies CardPrompt[],
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Perguntas para testar",
      title: `Use ${name} em uma leitura gratis`,
      body: "Transforme o significado da carta em uma pergunta concreta. Cada link abre uma leitura de IA gratuita com uma tiragem adequada.",
      action: "Tirar esta pergunta",
      prompts: [
        { label: "Amor", question: `O que ${name} significa para minha vida amorosa agora?`, spread: "relationship" },
        { label: "Carreira", question: `Como posso usar a energia de ${name} na minha carreira esta semana?`, spread: "job_opportunity" },
        { label: "Sim ou nao", question: `${name} sugere sim ou nao para minha decisao atual?`, spread: "yes_no" },
      ] satisfies CardPrompt[],
    }
  }

  return {
    eyebrow: "Try the meaning",
    title: `Use ${name} in a free AI reading`,
    body: "Turn the card meaning into a concrete question. Each prompt opens a free AI tarot reading with a matching spread.",
    action: "Draw this question",
    prompts: [
      { label: "Love", question: `What does ${name} mean for my love life right now?`, spread: "relationship" },
      { label: "Career", question: `How should I use ${name} energy in my career this week?`, spread: "job_opportunity" },
      { label: "Yes or no", question: `Is ${name} a yes or no for my current decision?`, spread: "yes_no" },
    ] satisfies CardPrompt[],
  }
}

export function TarotCardMeaningPageView({ page }: { page: TarotCardSeoPage }) {
  const keywords = getCardKeywords(page.card, page.locale)
  const meaningsHref = localePath(page.locale, "/tarot-card-meanings")
  const cardImage = page.card.image.startsWith("http") ? page.card.image : `${appUrl}${page.card.image}`
  const primaryHref = readingHref(page)
  const promptCopy = cardPromptCopy(page)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${appUrl}${page.path}#webpage`,
        name: page.title,
        description: page.description,
        url: `${appUrl}${page.path}`,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "Article",
        "@id": `${appUrl}${page.path}#article`,
        headline: page.title,
        description: page.description,
        image: cardImage,
        url: `${appUrl}${page.path}`,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        mainEntityOfPage: {
          "@id": `${appUrl}${page.path}#webpage`,
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
        "@type": "BreadcrumbList",
        "@id": `${appUrl}${page.path}#breadcrumb`,
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
            name: "Tarot Card Meanings",
            item: `${appUrl}${meaningsHref}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.h1,
            item: `${appUrl}${page.path}`,
          },
        ],
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
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#reading-prompts`,
        name: promptCopy.title,
        itemListElement: promptCopy.prompts.map((prompt, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: prompt.question,
          url: `${appUrl}${cardPromptHref(page, prompt)}`,
        })),
      },
    ],
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_0%,rgba(123,83,178,0.38),transparent_34%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex w-full max-w-full items-center justify-between gap-3 overflow-hidden">
            <Link href="/" className="shrink-0 font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={meaningsHref}
              className="hidden min-h-10 min-w-0 items-center rounded-lg border border-white/12 px-4 py-2 text-xs text-white/68 transition hover:border-[#bfb6ff]/45 hover:text-white sm:inline-flex"
            >
              <span>{page.backLabel}</span>
            </Link>
          </nav>

          <div className="grid min-h-[78vh] items-center gap-10 py-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
              <div className="relative aspect-[7/12] overflow-hidden rounded-xl border border-[#bfb6ff]/35 bg-[#211330] shadow-2xl shadow-black/45">
                <Image src={page.card.image} alt={page.title} fill className="object-cover" sizes="360px" priority />
                <div className="absolute inset-3 rounded-lg border border-[#e8e3ff]/20" />
              </div>
            </div>

            <div className="min-w-0 max-w-[21rem] sm:max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="break-words font-serif text-3xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 break-words text-sm leading-7 text-white/72 sm:text-lg sm:leading-8">{page.intro}</p>
              <EditorialByline locale={page.locale} className="mt-7" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#bfb6ff]/25 bg-white/[0.04] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-[#c9c0ff]">{page.uprightLabel}</h2>
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

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.deepSections.map((section) => (
                  <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
                <h2 className="font-serif text-xl text-white">{page.combinationsLabel}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {page.combinations.map((item) => (
                    <article key={item.heading}>
                      <h3 className="text-sm font-medium text-[#c9c0ff]">{item.heading}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.045] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{promptCopy.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{promptCopy.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{promptCopy.body}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {promptCopy.prompts.map((prompt) => (
                    <Link
                      key={prompt.question}
                      href={cardPromptHref(page, prompt)}
                      className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{prompt.label}</p>
                      <p className="mt-3 break-words text-sm leading-6 text-white/72 group-hover:text-white">{prompt.question}</p>
                      <p className="mt-3 text-xs text-[#c9c0ff]/65 group-hover:text-[#e8e3ff]">{promptCopy.action}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-serif text-xl text-white">{page.faqLabel}</h2>
                <div className="mt-4 space-y-4">
                  {page.faqs.map((faq) => (
                    <article key={faq.question}>
                      <h3 className="text-sm font-medium text-white">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/62">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
                >
                  {page.ctaLabel}
                </Link>
                <Link
                  href={meaningsHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  {page.backLabel}
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-8">
                {trustLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/56 transition hover:border-[#bfb6ff]/45 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
