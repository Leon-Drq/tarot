import { createServiceSupabase, hasSupabaseServiceKey, jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

type AnalyticsEvent = {
  event_name: string
  session_id: string | null
  source: string | null
  keyword: string | null
  created_at: string
}

type RollupMetric = {
  day: string
  source: string
  keyword: string
  page_views: number
  sessions: number
  questions: number
  cards_selected: number
  readings_completed: number
  shares_created: number
  share_templates_copied: number
  payment_started: number
  payment_completed: number
}

function configuredList(name: string) {
  return (process.env[name] || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function isAllowedAdmin(user: { id: string; email?: string | null }) {
  const adminIds = configuredList("POPTAROT_ADMIN_USER_IDS")
  const adminEmails = configuredList("POPTAROT_ADMIN_EMAILS")
  if (adminIds.length === 0 && adminEmails.length === 0) return true
  return adminIds.includes(user.id.toLowerCase()) || Boolean(user.email && adminEmails.includes(user.email.toLowerCase()))
}

function percentage(numerator: number, denominator: number) {
  if (!denominator) return 0
  return Number(((numerator / denominator) * 100).toFixed(1))
}

function topValues(events: AnalyticsEvent[], key: "source" | "keyword", limit = 8) {
  const counts = new Map<string, number>()
  for (const event of events) {
    const value = event[key]?.trim()
    if (!value) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function dailySeries(events: AnalyticsEvent[]) {
  const days = new Map<string, Record<string, number>>()
  for (const event of events) {
    const day = event.created_at.slice(0, 10)
    const current = days.get(day) || {
      page_view: 0,
      question_submitted: 0,
      reading_completed: 0,
      payment_completed: 0,
    }
    if (event.event_name in current) current[event.event_name] += 1
    days.set(day, current)
  }

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }))
}

function totalRollup(rows: RollupMetric[], key: keyof Omit<RollupMetric, "day" | "source" | "keyword">) {
  return rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)
}

function topRollupValues(rows: RollupMetric[], key: "source" | "keyword", limit = 8) {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const label = row[key]?.trim()
    if (!label) continue
    const count = key === "keyword" ? row.questions + row.readings_completed + row.page_views : row.page_views + row.questions
    counts.set(label, (counts.get(label) || 0) + count)
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function dailyRollupSeries(rows: RollupMetric[]) {
  const days = new Map<
    string,
    { page_view: number; question_submitted: number; reading_completed: number; payment_completed: number }
  >()

  for (const row of rows) {
    const current = days.get(row.day) || {
      page_view: 0,
      question_submitted: 0,
      reading_completed: 0,
      payment_completed: 0,
    }
    current.page_view += row.page_views
    current.question_submitted += row.questions
    current.reading_completed += row.readings_completed
    current.payment_completed += row.payment_completed
    days.set(row.day, current)
  }

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }))
}

function makeRollupSummary(days: number, rows: RollupMetric[]) {
  const questions = totalRollup(rows, "questions")
  const cardsSelected = totalRollup(rows, "cards_selected")
  const readings = totalRollup(rows, "readings_completed")
  const sessions = totalRollup(rows, "sessions")
  const paymentStarted = totalRollup(rows, "payment_started")
  const paymentCompleted = totalRollup(rows, "payment_completed")

  return {
    range_days: days,
    totals: {
      page_views: totalRollup(rows, "page_views"),
      sessions,
      questions,
      cards_selected: cardsSelected,
      readings_completed: readings,
      shares_created: totalRollup(rows, "shares_created"),
      share_templates_copied: totalRollup(rows, "share_templates_copied"),
      payment_started: paymentStarted,
      payment_completed: paymentCompleted,
    },
    rates: {
      card_selection_rate: percentage(cardsSelected, questions),
      reading_completion_rate: percentage(readings, questions),
      payment_start_rate: percentage(paymentStarted, sessions),
      payment_conversion_rate: percentage(paymentCompleted, paymentStarted),
    },
    top_sources: topRollupValues(rows, "source"),
    top_keywords: topRollupValues(rows, "keyword"),
    daily: dailyRollupSeries(rows),
  }
}

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response
  if (!isAllowedAdmin(auth.user)) return jsonError("Forbidden", 403)

  const url = new URL(req.url)
  const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 30)))
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const sinceDay = since.slice(0, 10)

  if (!hasSupabaseServiceKey()) {
    const { data, error } = await auth.supabase
      .from("analytics_daily_metrics")
      .select(
        "day,source,keyword,page_views,sessions,questions,cards_selected,readings_completed,shares_created,share_templates_copied,payment_started,payment_completed",
      )
      .gte("day", sinceDay)
      .order("day", { ascending: true })

    if (error) return jsonError(error.message)
    return jsonResponse(makeRollupSummary(days, (data || []) as RollupMetric[]))
  }

  const supabase = createServiceSupabase()

  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_name,session_id,source,keyword,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: true })

  if (error) return jsonError(error.message)

  const events = (data || []) as AnalyticsEvent[]
  const count = (name: string) => events.filter((event) => event.event_name === name).length
  const sessions = new Set(events.map((event) => event.session_id).filter(Boolean)).size
  const questions = count("question_submitted")
  const cardsSelected = count("cards_selected")
  const readings = count("reading_completed")
  const paymentStarted = count("payment_started")
  const paymentCompleted = count("payment_completed")

  return jsonResponse({
    range_days: days,
    totals: {
      page_views: count("page_view"),
      sessions,
      questions,
      cards_selected: cardsSelected,
      readings_completed: readings,
      shares_created: count("share_created"),
      share_templates_copied: count("share_template_copied"),
      payment_started: paymentStarted,
      payment_completed: paymentCompleted,
    },
    rates: {
      card_selection_rate: percentage(cardsSelected, questions),
      reading_completion_rate: percentage(readings, questions),
      payment_start_rate: percentage(paymentStarted, sessions),
      payment_conversion_rate: percentage(paymentCompleted, paymentStarted),
    },
    top_sources: topValues(events, "source"),
    top_keywords: topValues(events, "keyword"),
    daily: dailySeries(events),
  })
}
