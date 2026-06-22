import Link from "next/link"
import { getRelatedTrustLinks, type TrustPage } from "@/lib/trust-pages"
import { appUrl, organizationJsonLd, siteName, socialLinks, softwareApplicationJsonLd, websiteJsonLd } from "@/lib/site"
import { editorialProcess, trustHighlights, trustLastReviewed } from "@/lib/trust-signals"

export function TrustPageView({ page }: { page: TrustPage }) {
  const relatedLinks = getRelatedTrustLinks(page.slug)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      {
        "@type": page.type,
        "@id": `${appUrl}/${page.slug}#webpage`,
        name: page.title,
        description: page.description,
        url: `${appUrl}/${page.slug}`,
        dateModified: trustLastReviewed,
        author: {
          "@id": `${appUrl}/#organization`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#organization`,
        },
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}/${page.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteName,
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: `${appUrl}/${page.slug}`,
          },
        ],
      },
      ...(page.testimonials
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#testimonials`,
              name: "Representative POPTarot testimonials",
              itemListElement: page.testimonials.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Review",
                  name: item.title,
                  reviewBody: item.quote,
                  reviewAspect: item.title,
                  datePublished: trustLastReviewed,
                  author: {
                    "@type": "Person",
                    name: "POPTarot reader",
                  },
                  itemReviewed: {
                    "@id": `${appUrl}/#app`,
                  },
                },
              })),
            },
          ]
        : []),
      ...(page.examples
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#examples`,
              name: "Tarot reading examples",
              itemListElement: page.examples.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.betterQuestion,
                  },
                },
              })),
            },
          ]
        : []),
      ...(page.readingExamples
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#sample-readings`,
              name: "Sample tarot readings",
              itemListElement: page.readingExamples.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "CreativeWork",
                  name: item.title,
                  about: item.question,
                  abstract: item.interpretation,
                  url: `${appUrl}${item.href}`,
                },
              })),
            },
          ]
        : []),
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
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.34),transparent_36%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-sm tracking-[0.22em] text-white/62 transition hover:text-white">
              POP TAROT
            </Link>
            <Link href="/free-ai-tarot-reading" className="text-sm text-[#c9c0ff] transition hover:text-white">
              Free Reading
            </Link>
          </nav>

          <div className="py-14 sm:py-20">
            <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
              {page.eyebrow}
            </div>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">{page.intro}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/38">Last reviewed {trustLastReviewed}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-4 h-px w-10 bg-[#bfb6ff]/45" />
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Product stance</p>
            <h2 className="mt-3 font-serif text-2xl text-white">Trust Signals</h2>
            <div className="mt-5 space-y-4">
              {trustHighlights.map((item) => (
                <article key={item.title}>
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Editorial process</p>
            <h2 className="mt-3 font-serif text-2xl text-white">How POPTarot Keeps Readings Grounded</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {editorialProcess.map((item) => (
                <article key={item.title} className="min-w-0">
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {page.testimonials && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl text-white">Reader Feedback</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {page.testimonials.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">{item.context}</p>
                  <blockquote className="mt-4 text-base leading-7 text-white/76">"{item.quote}"</blockquote>
                </article>
              ))}
            </div>
          </section>
        )}

        {page.examples && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl text-white">Better Questions</h2>
            <div className="mt-5 space-y-4">
              {page.examples.map((item) => (
                <article key={item.question} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-sm text-white/45">Original: {item.question}</p>
                  <h3 className="mt-3 text-lg font-medium text-white">{item.betterQuestion}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.note}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {page.readingExamples && (
          <section className="mt-12">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Sample readings</p>
              <h2 className="mt-3 font-serif text-2xl text-white">How POPTarot Frames Real-World Tarot Questions</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                These examples are representative scenarios, not private user records. They show the level of context a useful AI tarot reading should provide.
              </p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {page.readingExamples.map((item) => (
                <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#bfb6ff]/25 bg-[#bfb6ff]/[0.07] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]">
                      {item.label}
                    </span>
                    <span className="text-xs text-white/42">{item.spread}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.question}</p>
                  <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/38">Cards</p>
                    <p className="mt-2 text-sm leading-6 text-[#eeeaff]">{item.cards}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/62">{item.interpretation}</p>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/38">Next step</p>
                    <p className="mt-2 text-sm leading-7 text-white/68">{item.nextStep}</p>
                  </div>
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#bfb6ff]/25 px-4 py-2 text-sm text-[#d8d0ff] transition hover:border-[#bfb6ff]/55 hover:bg-[#bfb6ff]/[0.06] hover:text-white"
                  >
                    Open this reading
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-lg border border-white/10 bg-white/[0.025] p-5">
          <h2 className="font-serif text-2xl text-white">Trust Links</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/62 transition hover:border-[#bfb6ff]/45 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/38">Official channels</p>
            {socialLinks.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/62 transition hover:border-[#bfb6ff]/45 hover:text-white"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-7 text-white/56">
                poptarot.com is the current source of truth. Official social profiles will be linked here once active.
              </p>
            )}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/daily-tarot"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
          >
            Try Daily Tarot
          </Link>
          <Link
            href="/free-ai-tarot-reading"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:bg-white/[0.05]"
          >
            Free AI Tarot Reading
          </Link>
        </div>
      </section>
    </main>
  )
}
