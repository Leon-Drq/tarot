import Link from "next/link"
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react"

const startHref =
  "/input?source=public_share_missing&utm_source=public_share&utm_medium=missing_share&utm_campaign=start_free"

const dailyReturnHref =
  "/daily-tarot?return_focus=Review%20a%20question%20from%20a%20shared%20reading&return_action=return-cue&utm_source=public_share&utm_medium=missing_share&utm_campaign=daily_return"

const freePaths = [
  {
    title: "Start a fresh free reading",
    body: "Ask one real question, draw cards, and get the first AI interpretation free.",
    href: startHref,
    label: "Start free reading",
  },
  {
    title: "Use Daily Tarot tomorrow",
    body: "Turn the missing share into a repeat check-in instead of a one-time dead link.",
    href: dailyReturnHref,
    label: "Open Daily Tarot",
  },
  {
    title: "Browse free tarot tools",
    body: "Find daily cards, question paths, card meanings, and free starter spreads.",
    href: "/free-tarot-tools?utm_source=public_share&utm_medium=missing_share&utm_campaign=free_tools",
    label: "See free tools",
  },
]

const trustPaths = [
  { href: "/reviews", label: "Reader reviews" },
  { href: "/tarot-reading-examples", label: "Reading examples" },
  { href: "/ai-tarot-disclaimer", label: "AI disclaimer" },
  { href: "/privacy", label: "Privacy" },
]

export default function MissingSharePage() {
  return (
    <main
      data-public-share-not-found
      className="min-h-screen bg-[#08030f] text-white"
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(143,126,239,0.32),transparent_34%),linear-gradient(180deg,#130820_0%,#08030f_52%,#050208_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9c0ff]/40 to-transparent" />

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/72">
              POP TAROT
            </Link>
            <Link
              href={startHref}
              data-public-share-not-found-start
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-4 py-2 text-xs font-medium text-[#eeeaff] transition hover:border-[#c9c0ff]/55 hover:bg-[#c9c0ff]/[0.14]"
            >
              Start free
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </nav>

          <div className="flex flex-1 flex-col justify-center py-12 sm:py-16">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/72">
                Shared reading unavailable
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                This shared tarot reading is no longer available.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
                The link may have expired, been made private, or used an old share format. You can still start with a free AI tarot reading and decide later whether saved history or deeper follow-ups are worth upgrading for.
              </p>
            </div>

            <div
              data-public-share-not-found-path
              className="mt-10 grid gap-4 lg:grid-cols-3"
            >
              {freePaths.map((path, index) => (
                <article
                  key={path.href}
                  className="flex min-w-0 flex-col rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/68">
                      Path 0{index + 1}
                    </p>
                    {index === 1 ? (
                      <CalendarDays className="h-4 w-4 text-[#c9c0ff]/72" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-[#c9c0ff]/72" aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-medium leading-snug text-white">{path.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/56">{path.body}</p>
                  <Link
                    href={path.href}
                    data-public-share-not-found-daily={index === 1 ? true : undefined}
                    className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/28 bg-[#c9c0ff]/[0.08] px-4 py-2.5 text-sm font-medium text-[#eeeaff] transition hover:border-[#c9c0ff]/55 hover:bg-[#c9c0ff]/[0.14]"
                  >
                    {path.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>

            <section
              data-public-share-not-found-trust
              className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-[#eeeaff]">
                    <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <h2 className="text-base font-medium">Free first, trust visible</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    POPTarot keeps the first reading path open. Membership is for deeper follow-up questions, saved history, advanced spreads, and monthly reports, not for basic access.
                  </p>
                </div>
                <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:w-[22rem]">
                  {trustPaths.map((path) => (
                    <Link
                      key={path.href}
                      href={path.href}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-white/64 transition hover:border-[#c9c0ff]/42 hover:bg-white/[0.045] hover:text-white"
                    >
                      {path.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
