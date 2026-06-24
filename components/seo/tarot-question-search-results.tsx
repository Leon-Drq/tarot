"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, Search } from "lucide-react"

export type TarotQuestionSearchEntry = {
  key: string
  title: string
  query: string
  intent: string
  spreadLabel: string
  guideHref: string
  readingHref: string
}

type TarotQuestionSearchCopy = {
  eyebrow: string
  title: string
  body: string
  emptyTitle: string
  emptyBody: string
  startFree: string
  readGuide: string
}

type Props = {
  entries: TarotQuestionSearchEntry[]
  copy: TarotQuestionSearchCopy
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function TarotQuestionSearchResults({ entries, copy }: Props) {
  const searchParams = useSearchParams()
  const rawQuery = searchParams.get("query") || searchParams.get("q") || ""
  const query = normalizeSearch(rawQuery)

  if (!query) return null

  const terms = query.split(" ").filter(Boolean)
  const ranked = entries
    .map((entry) => {
      const haystack = normalizeSearch([entry.title, entry.query, entry.intent, entry.key].join(" "))
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0)
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entry)

  const results = ranked.length > 0 ? ranked.slice(0, 6) : entries.slice(0, 4)
  const isFallback = ranked.length === 0

  return (
    <section data-question-search-results className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 lg:px-10">
      <div className="rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.045] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/80">{copy.eyebrow}</p>
            <h2 className="mt-2 break-words font-serif text-2xl leading-tight text-white">
              {isFallback ? copy.emptyTitle : copy.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {isFallback ? copy.emptyBody : copy.body}
            </p>
          </div>
          <div className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/58">
            <Search className="h-4 w-4 text-[#c9c0ff]/70" />
            <span className="max-w-[14rem] truncate">{rawQuery}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {results.map((entry) => (
            <article key={entry.key} className="min-w-0 rounded-lg border border-white/10 bg-[#0d0618]/72 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{entry.spreadLabel}</p>
              <h3 className="mt-2 break-words text-base font-medium leading-6 text-white">{entry.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">{entry.intent}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={entry.readingHref}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-3 py-2 text-sm font-medium text-[#120c22] transition hover:brightness-110"
                >
                  {copy.startFree}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={entry.guideHref}
                  className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-sm text-white/68 transition hover:border-[#bfb6ff]/40 hover:text-white"
                >
                  {copy.readGuide}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
