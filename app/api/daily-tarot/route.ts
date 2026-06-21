import { TAROT_CARDS } from "@/lib/tarot-cards"
import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, maxLength) : null
}

function bool(value: unknown) {
  return typeof value === "boolean" ? value : false
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

async function getCurrentStreak(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("daily_tarot_entries")
    .select("entry_date,streak_count")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  return Number(data?.streak_count || 0)
}

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const date = text(url.searchParams.get("date"), 10) || todayKey()

  const { data, error } = await auth.supabase
    .from("daily_tarot_entries")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("entry_date", date)
    .maybeSingle()

  if (error) return jsonError(error.message)

  return jsonResponse({
    entry: data || null,
    streak_count: data?.streak_count || (await getCurrentStreak(auth.supabase, auth.user.id)),
  })
}

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return jsonError("Invalid daily tarot payload")

  const record = body as Record<string, unknown>
  const entryDate = text(record.entry_date, 10) || todayKey()
  const cardId = Number(record.card_id)
  const card = TAROT_CARDS.find((item) => item.id === cardId)
  if (!card) return jsonError("Invalid tarot card")

  const previousDate = new Date(`${entryDate}T00:00:00.000Z`)
  previousDate.setUTCDate(previousDate.getUTCDate() - 1)
  const previousKey = previousDate.toISOString().slice(0, 10)

  const { data: previous } = await auth.supabase
    .from("daily_tarot_entries")
    .select("streak_count")
    .eq("user_id", auth.user.id)
    .eq("entry_date", previousKey)
    .maybeSingle()

  const streakCount = Number(previous?.streak_count || 0) + 1

  const payload = {
    user_id: auth.user.id,
    entry_date: entryDate,
    card_id: card.id,
    card_name: card.nameEn,
    is_reversed: bool(record.is_reversed),
    question: text(record.question, 240) || "What guidance do I need today?",
    interpretation: text(record.interpretation, 5000),
    journal: text(record.journal, 2000),
    mood: text(record.mood, 80),
    streak_count: streakCount,
    reminder_enabled: bool(record.reminder_enabled),
    reminder_email: text(record.reminder_email, 320),
    reminder_time: text(record.reminder_time, 16) || "08:30",
    reminder_timezone: text(record.reminder_timezone, 80) || "UTC",
    source: "daily-tarot",
  }

  const { data, error } = await auth.supabase
    .from("daily_tarot_entries")
    .upsert(payload, { onConflict: "user_id,entry_date" })
    .select("*")
    .single()

  if (error) return jsonError(error.message)
  return jsonResponse({ entry: data })
}

export async function PATCH(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return jsonError("Invalid daily tarot payload")

  const record = body as Record<string, unknown>
  const entryDate = text(record.entry_date, 10) || todayKey()
  const patch: Record<string, unknown> = {}

  if ("journal" in record) patch.journal = text(record.journal, 2000)
  if ("mood" in record) patch.mood = text(record.mood, 80)
  if ("reminder_enabled" in record) patch.reminder_enabled = bool(record.reminder_enabled)
  if ("reminder_email" in record) patch.reminder_email = text(record.reminder_email, 320)
  if ("reminder_time" in record) patch.reminder_time = text(record.reminder_time, 16) || "08:30"
  if ("reminder_timezone" in record) patch.reminder_timezone = text(record.reminder_timezone, 80) || "UTC"

  if (Object.keys(patch).length === 0) return jsonError("No content to update")

  const { data, error } = await auth.supabase
    .from("daily_tarot_entries")
    .update(patch)
    .eq("user_id", auth.user.id)
    .eq("entry_date", entryDate)
    .select("*")
    .single()

  if (error) return jsonError(error.message)
  return jsonResponse({ entry: data })
}
