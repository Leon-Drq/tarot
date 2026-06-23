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

function reminderEmail(value: unknown) {
  const email = text(value, 320)
  if (!email) return null
  const normalized = email.toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null
}

function reminderTime(value: unknown) {
  const time = text(value, 16)
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time || "") ? time : "08:30"
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function previousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

async function getCurrentStreak(supabase: SupabaseClient, userId: string, dateKey: string) {
  const { data } = await supabase
    .from("daily_tarot_entries")
    .select("entry_date,streak_count")
    .eq("user_id", userId)
    .lte("entry_date", dateKey)
    .order("entry_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data?.entry_date) return 0
  if (data.entry_date === dateKey || data.entry_date === previousDateKey(dateKey)) {
    return Number(data.streak_count || 0)
  }
  return 0
}

async function getRecentEntries(supabase: SupabaseClient, userId: string, dateKey: string) {
  const { data, error } = await supabase
    .from("daily_tarot_entries")
    .select("*")
    .eq("user_id", userId)
    .lte("entry_date", dateKey)
    .order("entry_date", { ascending: false })
    .limit(7)

  if (error) return []
  return data || []
}

async function getEntryStreakForSave(supabase: SupabaseClient, userId: string, entryDate: string) {
  const { data: existing } = await supabase
    .from("daily_tarot_entries")
    .select("streak_count")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .maybeSingle()

  if (existing?.streak_count) return Number(existing.streak_count)

  const { data: previous } = await supabase
    .from("daily_tarot_entries")
    .select("streak_count")
    .eq("user_id", userId)
    .eq("entry_date", previousDateKey(entryDate))
    .maybeSingle()

  return Number(previous?.streak_count || 0) + 1
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
    streak_count: data?.streak_count || (await getCurrentStreak(auth.supabase, auth.user.id, date)),
    recent_entries: await getRecentEntries(auth.supabase, auth.user.id, date),
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

  const streakCount = await getEntryStreakForSave(auth.supabase, auth.user.id, entryDate)
  const reminderEnabled = bool(record.reminder_enabled)
  const normalizedReminderEmail = reminderEmail(record.reminder_email)
  if (reminderEnabled && !normalizedReminderEmail) return jsonError("A valid reminder email is required")

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
    reminder_enabled: reminderEnabled,
    reminder_email: reminderEnabled ? normalizedReminderEmail : null,
    reminder_time: reminderTime(record.reminder_time),
    reminder_timezone: text(record.reminder_timezone, 80) || "UTC",
    source: "daily-tarot",
  }

  const { data, error } = await auth.supabase
    .from("daily_tarot_entries")
    .upsert(payload, { onConflict: "user_id,entry_date" })
    .select("*")
    .single()

  if (error) return jsonError(error.message)
  return jsonResponse({
    entry: data,
    recent_entries: await getRecentEntries(auth.supabase, auth.user.id, entryDate),
  })
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
  if ("reminder_enabled" in record || "reminder_email" in record) {
    const enabled = "reminder_enabled" in record ? bool(record.reminder_enabled) : undefined
    const normalizedEmail = reminderEmail(record.reminder_email)
    if (enabled === true && !normalizedEmail) return jsonError("A valid reminder email is required")
    if (enabled !== undefined) patch.reminder_enabled = enabled
    if (enabled === false) patch.reminder_email = null
    if (normalizedEmail) patch.reminder_email = normalizedEmail
  }
  if ("reminder_time" in record) patch.reminder_time = reminderTime(record.reminder_time)
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
