"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { monthlyReportApi, type MonthlyTarotReport } from "@/lib/api"

const previewItems = [
  {
    title: "Repeated cards",
    body: "See which cards showed up across saved readings and Daily Tarot.",
  },
  {
    title: "Journal themes",
    body: "Turn short daily notes into one monthly reflection pattern.",
  },
  {
    title: "Next questions",
    body: "Choose the follow-up questions worth asking instead of starting over.",
  },
]

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0 6-6m-6 6 6 6" />
    </svg>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  )
}

function UpgradeBoundary({ copy }: { copy: ReturnType<typeof getCopy> }) {
  return (
    <section data-monthly-report-locked className="border-y border-white/10 py-8">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.lockedEyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.lockedTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-white/58">{copy.lockedBody}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/membership"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f3f0ff_0%,#c9c0ff_52%,#8f80ee_100%)] px-4 text-sm font-medium text-[#100b22] shadow-[0_16px_42px_rgba(143,128,238,0.22)] transition hover:brightness-110"
            >
              {copy.upgrade}
            </Link>
            <Link
              href="/daily-tarot"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
            >
              {copy.daily}
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {previewItems.map((item) => (
            <article key={item.title} className="rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4">
              <h3 className="text-sm font-medium text-[#f2edff]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/54">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function EmptyReport({ copy }: { copy: ReturnType<typeof getCopy> }) {
  return (
    <section data-monthly-report-empty className="border-y border-white/10 py-8">
      <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.emptyEyebrow}</p>
      <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.emptyTitle}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">{copy.emptyBody}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/daily-tarot"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#bfb6ff]/24 bg-[#bfb6ff]/[0.05] px-4 text-sm text-[#eee9ff] transition hover:bg-[#bfb6ff]/10"
        >
          {copy.daily}
        </Link>
        <Link
          href="/free-ai-tarot-reading"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
        >
          {copy.freeReading}
        </Link>
        <Link
          href="/profile"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
        >
          {copy.history}
        </Link>
      </div>
    </section>
  )
}

function ReportBody({ report, copy }: { report: MonthlyTarotReport; copy: ReturnType<typeof getCopy> }) {
  return (
    <div data-monthly-report-ready className="space-y-10">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label={copy.readings} value={report.totals.readings} />
        <Metric label={copy.dailyEntries} value={report.totals.daily_entries} />
        <Metric label={copy.journals} value={report.totals.journal_notes} />
        <Metric label={copy.uniqueCards} value={report.totals.unique_cards} />
        <Metric label={copy.streak} value={report.totals.current_streak} />
      </section>

      <section>
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.themeEyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.themeTitle}</h2>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {report.themes.map((theme) => (
            <article key={theme.key} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-base font-medium text-white">{theme.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/58">{theme.summary}</p>
              {theme.evidence.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {theme.evidence.map((item) => (
                    <li key={item} className="text-xs leading-5 text-white/42">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.cardsEyebrow}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {report.top_cards.length > 0 ? (
              report.top_cards.map((card) => (
                <article key={card.label} className="rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words text-sm font-medium leading-snug text-[#f2edff]">{card.label}</h3>
                    <span className="shrink-0 rounded-full border border-[#bfb6ff]/20 px-2 py-1 text-xs text-[#d8d0ff]">
                      {card.count}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/48">
                    {copy.upright}: {card.upright} · {copy.reversed}: {card.reversed}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-7 text-white/52">{copy.noCards}</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.spreadEyebrow}</p>
          <div className="mt-4 space-y-2">
            {report.spread_mix.length > 0 ? (
              report.spread_mix.map((spread) => (
                <div key={spread.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/18 px-4 py-3">
                  <span className="text-sm text-white/70">{spread.label.replaceAll("_", " ")}</span>
                  <span className="text-sm font-medium text-white">{spread.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-white/52">{copy.noSpreads}</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.notesEyebrow}</p>
          <div className="mt-4 space-y-3">
            {report.daily_notes.length > 0 ? (
              report.daily_notes.map((note) => (
                <article key={`${note.date}-${note.card}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/34">{note.date}</p>
                  <h3 className="mt-2 text-sm font-medium text-white">{note.card}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/56">{note.note}</p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-7 text-white/52">{copy.noNotes}</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.promptsEyebrow}</p>
          <div className="mt-4 grid gap-3">
            {report.next_month_prompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/input?q=${encodeURIComponent(prompt)}&auto=1&source=monthly_report`}
                className="rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-4 text-sm leading-6 text-[#f2edff] transition hover:border-[#bfb6ff]/42 hover:bg-[#bfb6ff]/[0.075]"
              >
                {prompt}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function getCopy(language: string) {
  if (language === "zh") {
    return {
      back: "返回首页",
      eyebrow: "会员月度报告",
      title: "Monthly Tarot Report",
      body: "把本月保存的解读、每日塔罗和日记整理成一个模式报告。免费解读仍然优先；月报只属于需要长期复盘的会员场景。",
      loginTitle: "登录后查看月度报告",
      loginBody: "月报需要读取你的保存历史和每日塔罗记录。先登录，再决定是否升级。",
      login: "登录",
      lockedEyebrow: "会员功能",
      lockedTitle: "月度模式报告适合放在会员里",
      lockedBody: "它会读取保存历史、重复牌、日记和每日塔罗记录，帮助你看一个月的关系、事业和行动模式。",
      upgrade: "升级会员",
      daily: "打开每日塔罗",
      freeReading: "免费解读",
      history: "查看历史",
      profile: "个人中心",
      emptyEyebrow: "本月数据还不够",
      emptyTitle: "先积累几次记录，再生成真正的月报",
      emptyBody: "月报需要材料。保存几次解读、抽每日塔罗、写短日记后，这里会出现重复牌和主题。",
      loading: "正在生成本月报告...",
      error: "报告暂时无法生成",
      retry: "重试",
      readings: "解读",
      dailyEntries: "每日",
      journals: "日记",
      uniqueCards: "牌数",
      streak: "连续",
      themeEyebrow: "主题",
      themeTitle: "本月最明显的模式",
      cardsEyebrow: "重复牌",
      spreadEyebrow: "牌阵",
      notesEyebrow: "日记摘录",
      promptsEyebrow: "下月可以追问",
      upright: "正位",
      reversed: "逆位",
      noCards: "本月还没有可统计的牌。",
      noSpreads: "本月还没有保存的牌阵。",
      noNotes: "本月还没有保存日记。",
    }
  }

  return {
    back: "Back Home",
    eyebrow: "Member Monthly Report",
    title: "Monthly Tarot Report",
    body: "Turn saved readings, Daily Tarot, and journal notes into one monthly pattern report. The free tool still comes first; this report is for longer reflection.",
    loginTitle: "Log in to view your monthly report",
    loginBody: "Monthly reports need saved readings and Daily Tarot entries. Log in first, then upgrade only when you want the longer pattern review.",
    login: "Log In",
    lockedEyebrow: "Membership feature",
    lockedTitle: "A monthly pattern report belongs after the free experience",
    lockedBody: "It reviews saved history, repeated cards, journal notes, and Daily Tarot activity so members can see relationship, career, and action patterns over time.",
    upgrade: "Upgrade Membership",
    daily: "Open Daily Tarot",
    freeReading: "Free Reading",
    history: "View History",
    profile: "Profile",
    emptyEyebrow: "Not enough saved activity yet",
    emptyTitle: "Build a real monthly archive first",
    emptyBody: "Save a few readings, draw Daily Tarot, and write short journal notes. Repeated cards and themes will appear here as the month develops.",
    loading: "Generating this month's report...",
    error: "The report could not be generated",
    retry: "Retry",
    readings: "Readings",
    dailyEntries: "Daily",
    journals: "Journals",
    uniqueCards: "Cards",
    streak: "Streak",
    themeEyebrow: "Themes",
    themeTitle: "The clearest patterns this month",
    cardsEyebrow: "Repeated cards",
    spreadEyebrow: "Spread mix",
    notesEyebrow: "Journal notes",
    promptsEyebrow: "Questions for next month",
    upright: "Upright",
    reversed: "Reversed",
    noCards: "No cards are available for this month yet.",
    noSpreads: "No saved spreads are available for this month yet.",
    noNotes: "No journal notes are saved for this month yet.",
  }
}

export function MonthlyTarotReportView() {
  const { user, isLoggedIn, isLoading } = useAuth()
  const { language } = useLanguage()
  const copy = useMemo(() => getCopy(language), [language])
  const [report, setReport] = useState<MonthlyTarotReport | null>(null)
  const [error, setError] = useState("")
  const [isReportLoading, setIsReportLoading] = useState(false)

  const isMember = Boolean(user?.is_member || user?.is_partner)

  useEffect(() => {
    if (isLoading || !isLoggedIn || !isMember) return

    let cancelled = false
    async function loadReport() {
      setIsReportLoading(true)
      setError("")
      try {
        const data = await monthlyReportApi.get(language)
        if (!cancelled) setReport(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : copy.error)
      } finally {
        if (!cancelled) setIsReportLoading(false)
      }
    }

    loadReport()
    return () => {
      cancelled = true
    }
  }, [copy.error, isLoading, isLoggedIn, isMember, language])

  return (
    <main className="allow-scroll min-h-screen overflow-x-hidden bg-[#080310] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(168,144,255,0.26),transparent_32%),linear-gradient(180deg,#12071f_0%,#080310_58%,#050208_100%)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080310]/82 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <BackIcon className="h-4 w-4" />
            <span>{copy.back}</span>
          </Link>
          <Link href={isMember ? "/profile" : "/membership"} className="inline-flex min-h-10 items-center rounded-lg border border-white/12 px-3 text-sm text-white/62 transition hover:border-[#bfb6ff]/38 hover:text-white">
            {isMember ? copy.profile : copy.upgrade}
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <section className="pb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#c9c0ff]/75">{copy.eyebrow}</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="font-serif text-3xl leading-tight text-white sm:text-5xl">{copy.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">{copy.body}</p>
            </div>
            {report && (
              <div className="rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/36">{report.period.start_date} to {report.period.end_date}</p>
                <p className="mt-2 text-xl font-medium text-white">{report.month_label}</p>
              </div>
            )}
          </div>
        </section>

        {isLoading ? (
          <section className="border-y border-white/10 py-10">
            <p className="text-sm text-white/58">{copy.loading}</p>
          </section>
        ) : !isLoggedIn ? (
          <section className="border-y border-white/10 py-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.lockedEyebrow}</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.loginTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">{copy.loginBody}</p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c9c0ff] px-5 text-sm font-medium text-[#100b22] transition hover:brightness-110"
            >
              {copy.login}
            </Link>
          </section>
        ) : !isMember ? (
          <UpgradeBoundary copy={copy} />
        ) : isReportLoading ? (
          <section className="border-y border-white/10 py-10">
            <p className="text-sm text-white/58">{copy.loading}</p>
          </section>
        ) : error ? (
          <section className="border-y border-white/10 py-10">
            <p className="text-sm text-white/64">{copy.error}: {error}</p>
            <button
              type="button"
              onClick={() => {
                setReport(null)
                setError("")
                setIsReportLoading(true)
                monthlyReportApi
                  .get(language)
                  .then(setReport)
                  .catch((err) => setError(err instanceof Error ? err.message : copy.error))
                  .finally(() => setIsReportLoading(false))
              }}
              className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
            >
              {copy.retry}
            </button>
          </section>
        ) : report?.is_empty ? (
          <EmptyReport copy={copy} />
        ) : report ? (
          <ReportBody report={report} copy={copy} />
        ) : null}
      </div>
    </main>
  )
}
