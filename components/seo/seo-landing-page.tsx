import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { getAllLocalizedSeoPages, type SeoPage } from "@/lib/seo-pages"
import { SPREAD_CONFIGS } from "@/lib/spread-config"
import { getAllCardSeoPages } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"
import {
  appUrl,
  editorialTeamJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import { trustLastReviewed } from "@/lib/trust-signals"

const relatedCopy = {
  zh: { title: "相关塔罗入口", body: "继续从一个具体问题开始，直接进入更匹配的牌阵。" },
  en: { title: "Related Tarot Tools", body: "Keep the next step specific and enter a spread matched to your question." },
  ja: { title: "関連タロット", body: "次の質問を具体的にし、合うスプレッドへ進みましょう。" },
  ko: { title: "관련 타로 도구", body: "다음 질문을 구체적으로 정하고 맞는 스프레드로 이동하세요." },
  es: { title: "Herramientas relacionadas", body: "Continúa con una pregunta concreta y entra en una tirada más adecuada." },
  "pt-br": { title: "Ferramentas relacionadas", body: "Continue com uma pergunta concreta e entre em uma tiragem mais adequada." },
}

function relatedPages(page: SeoPage) {
  const priority = [
    "free-ai-tarot-reading",
    "daily-tarot",
    "love-tarot-reading",
    "will-my-ex-come-back-tarot",
    "does-he-love-me-tarot",
    "yes-or-no-tarot-love",
    "career-tarot-reading",
    "should-i-quit-my-job-tarot",
    "monthly-tarot-report",
    "tarot-card-meanings",
  ]
  const candidates = getAllLocalizedSeoPages().filter((candidate) => candidate.locale === page.locale && candidate.slug !== page.slug)

  return candidates
    .sort((a, b) => {
      const aIndex = priority.indexOf(a.slug)
      const bIndex = priority.indexOf(b.slug)
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    })
    .slice(0, 6)
}

function readingHref(page: SeoPage) {
  const params = new URLSearchParams({
    q: page.ctaQuestion,
    auto: "1",
    utm_source: "seo",
    utm_medium: "landing",
    utm_campaign: page.slug,
  })

  if (page.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

type QuestionToolkit = {
  label: string
  title: string
  body: string
  promptTitle: string
  prompts: string[]
  frameTitle: string
  frames: Array<{
    title: string
    body: string
  }>
}

const questionToolkits: Record<string, QuestionToolkit> = {
  "will-my-ex-come-back-tarot": {
    label: "Reconciliation spread",
    title: "Read the return question with more than hope",
    body: "A useful ex reading should separate remaining attachment from changed behavior. The spread below keeps the first answer grounded in cause, readiness, advice, and likely direction.",
    promptTitle: "Try a sharper ex question",
    prompts: [
      "Will my ex come back, and what has actually changed?",
      "Is reaching out to my ex healthy right now?",
      "What would help me move on with self-respect?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Return energy",
        body: "Look for cards that show accountability, communication, and mutual willingness, not only nostalgia or longing.",
      },
      {
        title: "Pause energy",
        body: "Heavy delay, avoidance, or repeated conflict cards usually ask you to protect peace before chasing contact.",
      },
      {
        title: "Your next step",
        body: "The advice card should become one real action: wait, set a boundary, send one clear message, or stop checking.",
      },
    ],
  },
  "does-he-love-me-tarot": {
    label: "Feelings spread",
    title: "Separate attraction, emotion, and consistent action",
    body: "This question works best when the reading compares what he may feel with how he behaves. Real love has to show up in safety, respect, and communication.",
    promptTitle: "Try a sharper feelings question",
    prompts: [
      "Does he love me, or is this only attraction?",
      "What are his true feelings and fears about me?",
      "What would make this connection emotionally safe for me?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Mutual feeling",
        body: "Cups, Lovers, Sun, or steady Pentacles can support affection when the surrounding cards show action too.",
      },
      {
        title: "Mixed signal",
        body: "Moon, Seven of Cups, or reversed court cards often point to uncertainty, projection, or inconsistent expression.",
      },
      {
        title: "Your clarity",
        body: "Read the advice card as a boundary check. The answer is not only what he feels, but what you need next.",
      },
    ],
  },
  "yes-or-no-tarot-love": {
    label: "Yes or no spread",
    title: "Get a quick answer without losing the reason",
    body: "A love yes-or-no reading should explain why the energy leans yes, no, or not yet. The reason matters more than forcing a one-word answer.",
    promptTitle: "Try a cleaner yes-or-no question",
    prompts: [
      "Is this connection worth pursuing right now?",
      "Should I text them today?",
      "Is reconciliation likely in the near future?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Yes",
        body: "Treat yes as permission for a thoughtful step, not a guarantee that the other person will do all the work.",
      },
      {
        title: "No",
        body: "A no can be protective. Read whether the block is timing, intention, readiness, or a pattern you already know.",
      },
      {
        title: "Not yet",
        body: "Not yet usually points to missing information, emotional readiness, or a condition that needs to change first.",
      },
    ],
  },
  "career-tarot-reading": {
    label: "Career spread",
    title: "Turn career uncertainty into one practical move",
    body: "Career tarot is strongest when it names momentum, resistance, timing, and the next action. Use the spread as a reflection tool, then test it against real options.",
    promptTitle: "Try a sharper career question",
    prompts: [
      "What should I focus on in my career this month?",
      "Is this job opportunity aligned with my growth?",
      "What practical action would move my career forward now?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Momentum",
        body: "Magician, World, Wands, and Pentacles can show opportunity when they are paired with realistic resources.",
      },
      {
        title: "Risk",
        body: "Tower, Devil, Five of Pentacles, or Seven of Swords ask you to examine pressure, contracts, money, or trust.",
      },
      {
        title: "Action",
        body: "Translate the advice card into a concrete step: apply, prepare, negotiate, rest, wait, or change direction.",
      },
    ],
  },
  "should-i-quit-my-job-tarot": {
    label: "Job decision spread",
    title: "Read quitting as a decision, not a dramatic impulse",
    body: "This page is for the moment when staying feels heavy but leaving has real consequences. The spread should separate burnout, completed cycles, risk, and preparation.",
    promptTitle: "Try a safer job-decision question",
    prompts: [
      "Should I quit my job or prepare first?",
      "Is this burnout temporary or a sign to leave?",
      "What do I need before making my next career move?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Leave signal",
        body: "Death, Tower, Eight of Cups, World, or Ten of Wands can support transition when the advice card also shows readiness.",
      },
      {
        title: "Prepare signal",
        body: "Four of Pentacles, Two of Wands, or Temperance usually ask for savings, timing, boundaries, or a bridge plan.",
      },
      {
        title: "Reality check",
        body: "Before acting, pair the reading with money, contracts, health, references, and concrete alternatives.",
      },
    ],
  },
}

function promptHref(page: SeoPage, prompt: string) {
  const params = new URLSearchParams({
    q: prompt,
    auto: "1",
    utm_source: "seo",
    utm_medium: "question_prompt",
    utm_campaign: page.slug,
  })

  if (page.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

export function SeoLandingPageView({ page }: { page: SeoPage }) {
  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)
  const cardPages = page.slug === "tarot-card-meanings" ? getAllCardSeoPages(page.locale) : []
  const primaryHref = readingHref(page)
  const related = relatedPages(page)
  const relatedText = relatedCopy[page.locale]
  const toolkit = page.locale === "en" ? questionToolkits[page.slug] : undefined
  const recommendedSpread = page.recommendedSpread ? SPREAD_CONFIGS[page.recommendedSpread] : undefined

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${appUrl}${page.path}#webpage`,
        url: `${appUrl}${page.path}`,
        name: page.title,
        description: page.description,
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
              href={primaryHref}
              className="inline-flex min-h-10 items-center rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#e8e3ff] transition hover:border-[#e8e3ff] hover:bg-white/[0.06]"
            >
              Start
            </Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{page.intro}</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/56">{page.intent}</p>
              <EditorialByline locale={page.locale} className="mt-7 max-w-xl" />

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
                >
                  {page.primaryCta}
                </Link>
                <Link
                  href="/daily-tarot"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
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
                    className="relative aspect-[7/12] w-[28%] max-w-[160px] overflow-hidden rounded-lg border border-[#bfb6ff]/35 bg-[#211330] shadow-2xl shadow-black/40"
                    style={{
                      transform: `translateY(${index === 1 ? "-28px" : "18px"}) rotate(${index === 0 ? "-9deg" : index === 2 ? "9deg" : "0deg"})`,
                    }}
                  >
                    <Image src={card.image} alt={card.nameEn} fill className="object-cover" sizes="180px" />
                    <div className="absolute inset-2 rounded border border-[#e8e3ff]/20" />
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
              <div className="mb-4 h-px w-10 bg-[#bfb6ff]/45" />
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      {toolkit && recommendedSpread && (
        <section className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{toolkit.label}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{toolkit.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{toolkit.body}</p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.045] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">Recommended spread</p>
                <h3 className="mt-3 font-serif text-2xl text-white">{recommendedSpread.nameEn}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{recommendedSpread.descriptionEn}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {recommendedSpread.positions.map((position, index) => (
                    <div key={position.nameEn} className="rounded-lg border border-white/10 bg-black/[0.18] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/38">Card {index + 1}</p>
                      <p className="mt-1 text-sm font-medium text-white">{position.nameEn}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{toolkit.promptTitle}</p>
                <div className="mt-5 grid gap-3">
                  {toolkit.prompts.map((prompt) => (
                    <Link
                      key={prompt}
                      href={promptHref(page, prompt)}
                      className="group rounded-lg border border-white/10 bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white/68 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055] hover:text-white"
                    >
                      <span className="block">{prompt}</span>
                      <span className="mt-1 block text-xs text-[#c9c0ff]/62 group-hover:text-[#e8e3ff]">Draw this question</span>
                    </Link>
                  ))}
                </div>
              </article>
            </div>

            <div className="mt-8">
              <h3 className="font-serif text-2xl text-white">{toolkit.frameTitle}</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {toolkit.frames.map((frame) => (
                  <article key={frame.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="text-base font-medium text-white">{frame.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-white/60">{frame.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {cardPages.length > 0 && (
        <section className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl text-white">78 Tarot Cards</h2>
              <Link href={primaryHref} className="text-sm text-[#c9c0ff] hover:text-white">
                {page.primaryCta}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cardPages.map((cardPage) => (
                <Link
                  key={cardPage.path}
                  href={cardPage.path}
                  className="group rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#bfb6ff]/55 hover:bg-white/[0.06]"
                >
                  <div className="relative mx-auto aspect-[7/12] w-full max-w-[92px] overflow-hidden rounded-md border border-[#bfb6ff]/30 bg-[#211330]">
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

      {related.length > 0 && (
        <section className="border-b border-white/10 bg-[#0d0618]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-7 max-w-2xl">
              <h2 className="font-serif text-2xl text-white">{relatedText.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{relatedText.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.06]"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/80">{item.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-xl leading-7 text-white group-hover:text-[#f4f0ff]">{item.h1}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">{item.intent}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#080310]">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-10 bg-[#bfb6ff]/45" />
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
              href={primaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-7 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
            >
              {page.bottomCta}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-8">
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
      </section>
    </main>
  )
}
