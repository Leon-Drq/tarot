import Link from "next/link"
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"
import type { TrustPage } from "@/lib/trust-pages"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export function TrustPageView({ page }: { page: TrustPage }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": page.type,
    name: page.title,
    description: page.description,
    url: `${appUrl}/${page.slug}`,
    publisher: {
      "@type": "Organization",
      name: "POPTarot",
      url: appUrl,
      logo: `${appUrl}/icon-512x512.png`,
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
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.34),transparent_36%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/62 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              POP TAROT
            </Link>
            <Link href="/input" className="text-sm text-[#dcb360] transition hover:text-[#f3d58b]">
              Free Reading
            </Link>
          </nav>

          <div className="py-14 sm:py-20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#f3d58b]">
              <ShieldCheck className="h-3.5 w-3.5" />
              {page.eyebrow}
            </div>
            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">{page.intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/daily-tarot"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dcb360] px-6 py-3 text-sm font-medium text-[#14091f] transition hover:bg-[#f3d58b]"
          >
            Try Daily Tarot
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/free-ai-tarot-reading"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:bg-white/[0.05]"
          >
            Free AI Tarot Reading
          </Link>
        </div>
      </section>
    </main>
  )
}
