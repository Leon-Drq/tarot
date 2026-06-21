"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, type AnalyticsSummary } from "@/lib/api"

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/42">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  )
}

function BarList({ items }: { items: Array<{ label: string; count: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.count))
  if (items.length === 0) return <p className="text-sm text-white/45">No data yet</p>

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="min-w-0 truncate text-white/70">{item.label}</span>
            <span className="text-white/42">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-[#dcb360]" style={{ width: `${Math.max(7, (item.count / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsDashboard() {
  const { isLoggedIn, isLoading } = useAuth()
  const { language } = useLanguage()
  const [days, setDays] = useState(30)
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const copy = useMemo(
    () =>
      ({
        zh: {
          title: "数据看板",
          subtitle: "访问来源、抽牌完成率、支付转化和关键词",
          login: "登录后查看数据看板",
          pageViews: "访问量",
          sessions: "会话",
          questions: "提问",
          readings: "完成解读",
          shares: "分享",
          payments: "支付完成",
          cardRate: "选牌率",
          readingRate: "完成率",
          payStartRate: "支付启动率",
          payRate: "支付转化率",
          sources: "访问来源",
          keywords: "关键词",
          daily: "日趋势",
          refresh: "刷新",
        },
        en: {
          title: "Analytics",
          subtitle: "Traffic sources, draw completion, payment conversion, and keywords",
          login: "Log in to view analytics",
          pageViews: "Page views",
          sessions: "Sessions",
          questions: "Questions",
          readings: "Completed",
          shares: "Shares",
          payments: "Paid",
          cardRate: "Card rate",
          readingRate: "Completion",
          payStartRate: "Pay start",
          payRate: "Pay conversion",
          sources: "Traffic sources",
          keywords: "Keywords",
          daily: "Daily trend",
          refresh: "Refresh",
        },
        ja: {
          title: "分析ダッシュボード",
          subtitle: "流入元、完了率、決済転換、キーワード",
          login: "ログインして分析を見る",
          pageViews: "表示数",
          sessions: "セッション",
          questions: "質問",
          readings: "完了",
          shares: "共有",
          payments: "決済完了",
          cardRate: "カード選択率",
          readingRate: "完了率",
          payStartRate: "決済開始率",
          payRate: "決済転換率",
          sources: "流入元",
          keywords: "キーワード",
          daily: "日別推移",
          refresh: "更新",
        },
        ko: {
          title: "분석 대시보드",
          subtitle: "유입, 완료율, 결제 전환, 키워드",
          login: "로그인 후 분석 보기",
          pageViews: "조회수",
          sessions: "세션",
          questions: "질문",
          readings: "완료",
          shares: "공유",
          payments: "결제 완료",
          cardRate: "카드 선택률",
          readingRate: "완료율",
          payStartRate: "결제 시작률",
          payRate: "결제 전환율",
          sources: "유입 경로",
          keywords: "키워드",
          daily: "일별 추이",
          refresh: "새로고침",
        },
      })[language],
    [language],
  )

  const loadSummary = useCallback(async () => {
    if (!isLoggedIn) return
    setLoading(true)
    setError("")
    try {
      setSummary(await analyticsApi.getSummary(days))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [days, isLoggedIn])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  if (isLoading) {
    return <main className="min-h-screen bg-[#080310] text-white" />
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080310] px-5 text-white">
        <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.035] p-6 text-center">
          <p className="text-lg text-white">{copy.login}</p>
          <Link href="/auth/login" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#dcb360] px-5 text-sm font-medium text-[#14091f]">
            Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080310] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-white/52 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              POP TAROT
            </Link>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-[#dcb360]" />
              <div>
                <h1 className="font-serif text-3xl text-white">{copy.title}</h1>
                <p className="mt-1 text-sm text-white/52">{copy.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[7, 30, 90].map((value) => (
              <button
                key={value}
                onClick={() => setDays(value)}
                className={`min-h-10 rounded-full px-4 text-sm transition ${
                  days === value ? "bg-[#dcb360] text-[#14091f]" : "border border-white/10 text-white/62 hover:bg-white/[0.05]"
                }`}
              >
                {value}d
              </button>
            ))}
            <button
              onClick={loadSummary}
              disabled={loading}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/62 transition hover:bg-white/[0.05] disabled:opacity-45"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {copy.refresh}
            </button>
          </div>
        </header>

        {error && <div className="mt-5 rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        {summary && (
          <div className="space-y-5 py-6">
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <Metric label={copy.pageViews} value={summary.totals.page_views} />
              <Metric label={copy.sessions} value={summary.totals.sessions} />
              <Metric label={copy.questions} value={summary.totals.questions} />
              <Metric label={copy.readings} value={summary.totals.readings_completed} />
              <Metric label={copy.shares} value={summary.totals.shares_created + summary.totals.share_templates_copied} />
              <Metric label={copy.payments} value={summary.totals.payment_completed} />
            </section>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label={copy.cardRate} value={summary.rates.card_selection_rate} suffix="%" />
              <Metric label={copy.readingRate} value={summary.rates.reading_completion_rate} suffix="%" />
              <Metric label={copy.payStartRate} value={summary.rates.payment_start_rate} suffix="%" />
              <Metric label={copy.payRate} value={summary.rates.payment_conversion_rate} suffix="%" />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-4 font-serif text-xl text-white">{copy.sources}</h2>
                <BarList items={summary.top_sources} />
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-4 font-serif text-xl text-white">{copy.keywords}</h2>
                <BarList items={summary.top_keywords} />
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-serif text-xl text-white">{copy.daily}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.14em] text-white/40">
                    <tr>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">{copy.pageViews}</th>
                      <th className="py-3 pr-4">{copy.questions}</th>
                      <th className="py-3 pr-4">{copy.readings}</th>
                      <th className="py-3 pr-4">{copy.payments}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8 text-white/66">
                    {summary.daily.map((day) => (
                      <tr key={day.date}>
                        <td className="py-3 pr-4 text-white/82">{day.date}</td>
                        <td className="py-3 pr-4">{day.page_view}</td>
                        <td className="py-3 pr-4">{day.question_submitted}</td>
                        <td className="py-3 pr-4">{day.reading_completed}</td>
                        <td className="py-3 pr-4">{day.payment_completed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
