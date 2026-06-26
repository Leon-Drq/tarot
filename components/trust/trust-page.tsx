import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { getRelatedTrustLinks, type TrustPage } from "@/lib/trust-pages"
import {
  appUrl,
  brandVerificationFacts,
  editorialTeamJsonLd,
  organizationJsonLd,
  officialVerificationLinks,
  siteName,
  socialLinks,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/site"
import { editorialProcess, trustHighlights, trustLastReviewed } from "@/lib/trust-signals"

const defaultTrustActionLinks: NonNullable<TrustPage["actionLinks"]> = [
  {
    label: "Start free",
    title: "Free AI Tarot Reading",
    body: "Ask one real question and get a free AI tarot interpretation before any membership decision.",
    href: "/free-ai-tarot-reading",
  },
  {
    label: "Daily return",
    title: "Daily Tarot",
    body: "Use one free card each day, keep a streak, save a journal note, and set a reminder path.",
    href: "/daily-tarot",
  },
  {
    label: "Question paths",
    title: "Tarot Questions",
    body: "Open long-tail love, ex, yes-or-no, career, and job-decision pages that start matching spreads.",
    href: "/tarot-questions",
  },
  {
    label: "Card meanings",
    title: "Tarot Card Meanings",
    body: "Browse upright, reversed, love, career, money, yes-or-no, advice, combinations, and FAQ.",
    href: "/tarot-card-meanings",
  },
]

function readingExampleStartHref(item: NonNullable<TrustPage["readingExamples"]>[number]) {
  if (item.startHref) return item.startHref

  const params = new URLSearchParams({
    q: item.startQuestion || item.question,
    auto: "1",
    source: "trust_example",
    spread: item.spreadType || "three_card",
    utm_source: "trust",
    utm_medium: "reading_example",
    utm_campaign: item.href.replace(/^\//, ""),
  })

  return `/input?${params.toString()}`
}

export function TrustPageView({ page }: { page: TrustPage }) {
  const relatedLinks = getRelatedTrustLinks(page.slug)
  const isOfficialChannelsPage = page.slug === "official-channels"
  const effectiveActionLinks = page.actionLinks?.length ? page.actionLinks : defaultTrustActionLinks
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
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
          "@id": `${appUrl}/#editorial-team`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        potentialAction: effectiveActionLinks.map((item) => ({
          "@type": "ReadAction",
          name: item.title,
          target: `${appUrl}${item.href}`,
        })),
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
                  "@type": "Quotation",
                  name: item.title,
                  text: item.quote,
                  about: item.context,
                  datePublished: trustLastReviewed,
                  creator: {
                    "@id": `${appUrl}/#editorial-team`,
                  },
                  isPartOf: {
                    "@id": `${appUrl}/${page.slug}#webpage`,
                  },
                  potentialAction: item.actionHref
                    ? {
                        "@type": "InteractAction",
                        name: item.actionLabel || "Start free tarot reading",
                        target: `${appUrl}${item.actionHref}`,
                      }
                    : undefined,
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
                  isAccessibleForFree: true,
                  potentialAction: {
                    "@type": "InteractAction",
                    name: "Try this example free",
                    target: `${appUrl}${readingExampleStartHref(item)}`,
                  },
                },
              })),
            },
          ]
        : []),
      {
        "@type": "ItemList",
        "@id": `${appUrl}/${page.slug}#next-actions`,
        name: "Next free tarot actions",
        itemListElement: effectiveActionLinks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
      ...(isOfficialChannelsPage
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#official-verification-links`,
              name: "Official POPTarot verification links",
              itemListElement: officialVerificationLinks.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": item.href === "/" ? "WebSite" : "WebPage",
                  name: item.title,
                  description: item.body,
                  url: `${appUrl}${item.href === "/" ? "" : item.href}`,
                  isPartOf: {
                    "@id": `${appUrl}/#website`,
                  },
                },
              })),
            },
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#brand-verification-facts`,
              name: "POPTarot brand verification facts",
              itemListElement: brandVerificationFacts.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "PropertyValue",
                  name: item.label,
                  value: item.value,
                  description: item.body,
                  url: `${appUrl}${item.href}`,
                },
              })),
            },
          ]
        : []),
      ...(page.brandAssets
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}/${page.slug}#brand-assets`,
              name: "Official POPTarot brand assets",
              itemListElement: page.brandAssets.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "ImageObject",
                  name: item.title,
                  description: item.description,
                  url: `${appUrl}${item.href}`,
                  contentUrl: `${appUrl}${item.href}`,
                  width: item.width,
                  height: item.height,
                },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <main data-trust-page className="min-h-screen bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.34),transparent_36%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex min-h-10 items-center text-sm tracking-[0.22em] text-white/62 transition hover:text-white">
              POP TAROT
            </Link>
            <Link href="/free-ai-tarot-reading" className="inline-flex min-h-10 items-center text-sm text-[#c9c0ff] transition hover:text-white">
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
            <EditorialByline className="mt-8 max-w-3xl" showStandards />
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
                <article
                  key={item.title}
                  data-trust-testimonial-card
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">{item.context}</p>
                  <blockquote className="mt-4 text-base leading-7 text-white/76">"{item.quote}"</blockquote>
                  {item.actionHref && (
                    <Link
                      href={item.actionHref}
                      data-trust-testimonial-start
                      className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#bfb6ff]/25 px-4 py-2 text-center text-sm text-[#d8d0ff] transition hover:border-[#bfb6ff]/55 hover:bg-[#bfb6ff]/[0.06] hover:text-white"
                    >
                      {item.actionLabel || "Start free tarot reading"}
                    </Link>
                  )}
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
                <article
                  key={item.title}
                  data-trust-reading-example-card
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
                >
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
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link
                      href={readingExampleStartHref(item)}
                      data-trust-reading-example-start
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c9c0ff] px-4 py-2 text-center text-sm font-medium text-[#120c22] transition hover:bg-[#eeeaff]"
                    >
                      Try this example free
                    </Link>
                    <Link
                      href={item.href}
                      data-trust-reading-example-guide
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#bfb6ff]/25 px-4 py-2 text-center text-sm text-[#d8d0ff] transition hover:border-[#bfb6ff]/55 hover:bg-[#bfb6ff]/[0.06] hover:text-white"
                    >
                      Open this reading
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section data-trust-default-free-actions className="mt-12 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Try the same paths</p>
            <h2 className="mt-3 font-serif text-2xl text-white">Turn Trust Signals Into a Free Reading</h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              These links connect trust and transparency pages back to the free product flows people actually use first.
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {effectiveActionLinks.map((item) => (
              <Link
                key={item.href}
                data-trust-default-free-action
                href={item.href}
                className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{item.label}</p>
                <h3 className="mt-3 break-words text-base font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        {page.brandAssets && (
          <section className="mt-12">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Official assets</p>
              <h2 className="mt-3 font-serif text-2xl text-white">Logo, Icons, and Sharing Image</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                These files are the public visual sources referenced by POPTarot metadata, manifest, and structured data.
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {page.brandAssets.map((item) => (
                <article key={item.href} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#12091f]">
                      <Image
                        src={item.src}
                        alt={item.title}
                        width={item.width}
                        height={item.height}
                        className="h-full w-full object-contain"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/75">{item.label}</p>
                      <h3 className="mt-2 text-base font-medium text-white">{item.title}</h3>
                      <p className="mt-1 text-xs text-white/42">
                        {item.width} x {item.height}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white/62">{item.description}</p>
                  <a
                    href={item.href}
                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#bfb6ff]/25 px-4 py-2 text-sm text-[#d8d0ff] transition hover:border-[#bfb6ff]/55 hover:bg-[#bfb6ff]/[0.06] hover:text-white"
                  >
                    Open asset
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {isOfficialChannelsPage && (
          <section className="mt-12">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Verified public profiles</p>
              <h2 className="mt-3 font-serif text-2xl text-white">Official Social Accounts</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                POPTarot only publishes social profiles after the account is active, owned by the project, and points back to poptarot.com.
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/75">Canonical website</p>
                <h3 className="mt-3 text-lg font-medium text-white">poptarot.com</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  The website is the primary source for free AI tarot readings, Daily Tarot, card meanings, privacy notes, membership information, and brand verification.
                </p>
                <a
                  href={appUrl}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#bfb6ff]/25 px-4 py-2 text-sm text-[#d8d0ff] transition hover:border-[#bfb6ff]/55 hover:bg-[#bfb6ff]/[0.06] hover:text-white"
                >
                  Open website
                </a>
              </article>

              <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/75">Social verification</p>
                {socialLinks.length > 0 ? (
                  <>
                    <h3 className="mt-3 text-lg font-medium text-white">Active profiles</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {socialLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/66 transition hover:border-[#bfb6ff]/45 hover:text-white"
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      These links are also emitted in Organization structured data as verified sameAs signals.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-3 text-lg font-medium text-white">No public social profile is active yet</h3>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      POPTarot intentionally does not publish placeholder handles. Once a channel is live and verified, it will appear here and in structured data.
                    </p>
                  </>
                )}
              </article>
            </div>

            <section className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Official verification links</p>
                <h2 className="mt-3 font-serif text-2xl text-white">Where POPTarot Confirms Its Identity</h2>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  These are the public pages POPTarot uses to connect the brand, logo, free product stance, editorial standards, AI boundaries, and privacy expectations.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {officialVerificationLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{item.label}</p>
                    <h3 className="mt-3 break-words text-base font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section data-official-brand-verification-facts className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Brand verification pack</p>
                <h2 className="mt-3 font-serif text-2xl text-white">Consistent Signals for Search and Users</h2>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  These facts keep the brand name, canonical domain, logo, free product stance, sitemap, and membership boundary aligned across metadata, schema, and public pages.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {brandVerificationFacts.map((item) => (
                  <Link
                    key={item.label}
                    data-official-brand-verification-fact
                    href={item.href}
                    className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{item.label}</p>
                    <h3 className="mt-3 break-words text-base font-medium text-white group-hover:text-[#eeeaff]">{item.value}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                  </Link>
                ))}
              </div>
            </section>
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
