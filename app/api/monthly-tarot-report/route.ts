import { requireMemberAccess } from "@/lib/server/member-gate"
import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

type TarotReadingRow = {
  id: string
  question: string | null
  cards: unknown
  interpretation: string | null
  spread_type: string | null
  created_at: string
}

type DailyTarotEntryRow = {
  entry_date: string
  card_name: string | null
  is_reversed: boolean | null
  question: string | null
  interpretation: string | null
  journal: string | null
  mood: string | null
  streak_count: number | null
}

type ReportCard = {
  name: string
  is_reversed: boolean
}

type CountRow = {
  label: string
  count: number
}

const THEME_DEFINITIONS = [
  {
    key: "relationships",
    title: "Relationship patterns",
    keywords: ["love", "ex", "relationship", "partner", "crush", "contact", "text", "miss", "he ", "she ", "him", "her"],
    summary:
      "Relationship questions appeared repeatedly. Review whether the cards point toward mutual action, clearer boundaries, or a need to stop waiting for someone else's signal.",
  },
  {
    key: "career",
    title: "Work and direction",
    keywords: ["job", "career", "work", "offer", "interview", "boss", "quit", "business", "project", "success"],
    summary:
      "Work and direction were a visible thread. Separate temporary pressure from a real transition signal, then choose one practical move you can control this week.",
  },
  {
    key: "money",
    title: "Money and stability",
    keywords: ["money", "finance", "salary", "pay", "income", "client", "deal", "spend", "invest"],
    summary:
      "Money and stability showed up as a theme. Look for cards that repeat around timing, patience, and risk before treating one reading as a final answer.",
  },
  {
    key: "decision",
    title: "Decisions and timing",
    keywords: ["should", "choose", "decision", "option", "yes", "no", "when", "timing", "move", "stay"],
    summary:
      "Decision questions appeared this month. The useful pattern is not only yes or no, but what conditions need to change before the answer becomes clearer.",
  },
  {
    key: "self",
    title: "Self-trust and recovery",
    keywords: ["feel", "healing", "confidence", "anxious", "fear", "ready", "blocked", "stuck", "energy", "mood"],
    summary:
      "Self-trust and recovery were part of the month. Use the repeated cards to notice where you regain agency instead of outsourcing the whole answer to a reading.",
  },
]

function text(value: unknown, maxLength = 260) {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength)
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function monthWindow(monthParam: string | null) {
  const today = new Date()
  const match = monthParam?.match(/^(\d{4})-(\d{2})$/)
  const year = match ? Number(match[1]) : today.getUTCFullYear()
  const monthIndex = match ? Number(match[2]) - 1 : today.getUTCMonth()
  const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0))
  const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0))
  const endInclusive = new Date(end)
  endInclusive.setUTCDate(endInclusive.getUTCDate() - 1)
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(start)
  const nextMonthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(end)

  return {
    start,
    end,
    startDate: dateKey(start),
    endDate: dateKey(endInclusive),
    monthLabel,
    nextMonthLabel,
  }
}

function cardName(card: unknown) {
  if (typeof card === "string") return text(card, 80)
  if (!card || typeof card !== "object") return ""
  const record = card as Record<string, unknown>
  return (
    text(record.nameEn, 80) ||
    text(record.name, 80) ||
    text(record.card_name, 80) ||
    text(record.title, 80)
  )
}

function cardIsReversed(card: unknown) {
  if (!card || typeof card !== "object") return false
  const record = card as Record<string, unknown>
  return Boolean(record.isReversed || record.is_reversed || record.reversed)
}

function normalizeReadingCards(cards: unknown): ReportCard[] {
  if (!Array.isArray(cards)) return []
  return cards
    .map((card) => ({ name: cardName(card), is_reversed: cardIsReversed(card) }))
    .filter((card) => Boolean(card.name))
    .slice(0, 12)
}

function countLabels(labels: string[]) {
  const counts = new Map<string, number>()
  for (const label of labels) {
    const clean = text(label, 80)
    if (!clean) continue
    counts.set(clean, (counts.get(clean) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function countCards(cards: ReportCard[]) {
  const counts = new Map<string, { label: string; count: number; upright: number; reversed: number }>()
  for (const card of cards) {
    const key = card.name.toLowerCase()
    const current = counts.get(key) || { label: card.name, count: 0, upright: 0, reversed: 0 }
    current.count += 1
    if (card.is_reversed) current.reversed += 1
    else current.upright += 1
    counts.set(key, current)
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function evidenceFrom(texts: string[]) {
  const seen = new Set<string>()
  return texts
    .map((item) => text(item, 140))
    .filter((item) => {
      if (!item || seen.has(item.toLowerCase())) return false
      seen.add(item.toLowerCase())
      return true
    })
    .slice(0, 3)
}

function buildThemeText(readings: TarotReadingRow[], entries: DailyTarotEntryRow[]) {
  return [
    ...readings.map((row) => [row.question, row.interpretation].map((item) => text(item, 400)).join(" ")),
    ...entries.map((row) => [row.question, row.journal, row.mood, row.interpretation].map((item) => text(item, 400)).join(" ")),
  ]
}

function buildThemes(readings: TarotReadingRow[], entries: DailyTarotEntryRow[], topCards: ReturnType<typeof countCards>) {
  const sourceTexts = buildThemeText(readings, entries)
  const lowerTexts = sourceTexts.map((item) => item.toLowerCase())
  const scored = THEME_DEFINITIONS.map((theme) => {
    const matches = lowerTexts
      .map((item, index) => ({
        index,
        score: theme.keywords.reduce((total, keyword) => total + (item.includes(keyword) ? 1 : 0), 0),
      }))
      .filter((item) => item.score > 0)

    return {
      key: theme.key,
      title: theme.title,
      summary: theme.summary,
      score: matches.reduce((total, item) => total + item.score, 0),
      evidence: evidenceFrom(matches.map((item) => sourceTexts[item.index])),
    }
  })
    .filter((theme) => theme.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (scored.length > 0) return scored

  if (readings.length || entries.length) {
    const cardEvidence = topCards.slice(0, 3).map((card) => `${card.label} appeared ${card.count} time${card.count === 1 ? "" : "s"}`)
    return [
      {
        key: "pattern",
        title: "Emerging monthly pattern",
        summary:
          "This month has enough saved activity to begin a pattern review. The strongest signal is the cards that repeated or the daily notes you returned to.",
        score: readings.length + entries.length,
        evidence: cardEvidence,
      },
    ]
  }

  return [
    {
      key: "empty",
      title: "Build the month archive",
      summary:
        "There is not enough saved activity for a real pattern yet. Save a few readings, draw Daily Tarot, and write short journal notes before the next report.",
      score: 0,
      evidence: ["Start with Daily Tarot", "Save one member reading", "Return after a few days"],
    },
  ]
}

function buildPrompts(topCards: CountRow[], themes: Array<{ title: string }>, nextMonthLabel: string) {
  const firstCard = topCards[0]?.label || "my repeated card"
  const firstTheme = themes[0]?.title.toLowerCase() || "this month's pattern"
  return [
    `What did ${firstCard} ask me to notice this month?`,
    `What should I release before ${nextMonthLabel}?`,
    `How can I act on ${firstTheme} without forcing an outcome?`,
    "Which question deserves a deeper follow-up instead of another new reading?",
  ]
}

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const lang = text(url.searchParams.get("lang"), 12) || "en"
  const member = await requireMemberAccess(auth.supabase, auth.user, "monthly_report", lang)
  if (!member.ok) return member.response

  const window = monthWindow(url.searchParams.get("month"))

  const { data: readings, error: readingsError } = await auth.supabase
    .from("tarot_readings")
    .select("id,question,cards,interpretation,spread_type,created_at")
    .eq("user_id", auth.user.id)
    .gte("created_at", window.start.toISOString())
    .lt("created_at", window.end.toISOString())
    .order("created_at", { ascending: false })
    .limit(120)

  if (readingsError) return jsonError(readingsError.message)

  const { data: dailyEntries, error: dailyError } = await auth.supabase
    .from("daily_tarot_entries")
    .select("entry_date,card_name,is_reversed,question,interpretation,journal,mood,streak_count")
    .eq("user_id", auth.user.id)
    .gte("entry_date", window.startDate)
    .lte("entry_date", window.endDate)
    .order("entry_date", { ascending: false })
    .limit(40)

  if (dailyError) return jsonError(dailyError.message)

  const readingRows = (readings || []) as TarotReadingRow[]
  const dailyRows = (dailyEntries || []) as DailyTarotEntryRow[]
  const readingCards = readingRows.flatMap((row) => normalizeReadingCards(row.cards))
  const dailyCards = dailyRows
    .map((row) => ({ name: text(row.card_name, 80), is_reversed: Boolean(row.is_reversed) }))
    .filter((card) => Boolean(card.name))
  const topCards = countCards([...readingCards, ...dailyCards])
  const themes = buildThemes(readingRows, dailyRows, topCards)
  const journals = dailyRows
    .filter((row) => text(row.journal, 1))
    .slice(0, 5)
    .map((row) => ({
      date: row.entry_date,
      card: text(row.card_name, 80) || "Daily card",
      note: text(row.journal, 260),
    }))

  const spreadMix = countLabels(readingRows.map((row) => row.spread_type || "three_card")).slice(0, 6)
  const topCardRows = topCards.slice(0, 8)

  return jsonResponse({
    month_label: window.monthLabel,
    generated_at: new Date().toISOString(),
    period: {
      start_date: window.startDate,
      end_date: window.endDate,
    },
    is_empty: readingRows.length === 0 && dailyRows.length === 0,
    totals: {
      readings: readingRows.length,
      daily_entries: dailyRows.length,
      journal_notes: journals.length,
      unique_cards: topCards.length,
      current_streak: Math.max(0, ...dailyRows.map((row) => Number(row.streak_count || 0))),
    },
    top_cards: topCardRows,
    themes,
    spread_mix: spreadMix,
    daily_notes: journals,
    next_month_prompts: buildPrompts(topCardRows, themes, window.nextMonthLabel),
  })
}
