import { createServiceSupabase, hasSupabaseServiceKey, jsonError, jsonResponse } from "@/lib/server/supabase"
import { dailyTarotReminderHtml, hasEmailProvider, sendEmail } from "@/lib/server/email"

type ReminderRow = {
  id: string
  user_id: string
  entry_date: string
  card_name: string
  is_reversed: boolean
  streak_count: number
  reminder_email: string | null
  reminder_time: string
  reminder_timezone: string
  reminder_last_sent_on: string | null
  reminder_send_count: number | null
}

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

function localParts(timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]))
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour || 0) * 60 + Number(parts.minute || 0),
  }
}

function reminderMinutes(value: string | null | undefined) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value || "")
  if (!match) return 8 * 60 + 30
  return Math.min(23, Number(match[1])) * 60 + Math.min(59, Number(match[2]))
}

function isDue(row: ReminderRow) {
  const { date, minutes } = localParts(row.reminder_timezone || "UTC")
  if (row.reminder_last_sent_on === date) return false
  return minutes >= reminderMinutes(row.reminder_time)
}

function newestPerUser(rows: ReminderRow[]) {
  const seen = new Set<string>()
  const result: ReminderRow[] = []
  for (const row of rows) {
    if (seen.has(row.user_id)) continue
    seen.add(row.user_id)
    result.push(row)
  }
  return result
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return jsonError("Unauthorized", 401)
  if (!hasSupabaseServiceKey()) return jsonError("Missing SUPABASE_SERVICE_ROLE_KEY", 503)
  if (!hasEmailProvider()) return jsonError("Missing RESEND_API_KEY", 503)

  const supabase = createServiceSupabase()
  const { data, error } = await supabase
    .from("daily_tarot_entries")
    .select(
      "id,user_id,entry_date,card_name,is_reversed,streak_count,reminder_email,reminder_time,reminder_timezone,reminder_last_sent_on,reminder_send_count",
    )
    .eq("reminder_enabled", true)
    .not("reminder_email", "is", null)
    .order("entry_date", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(2000)

  if (error) return jsonError(error.message)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
  const candidates = newestPerUser(((data || []) as ReminderRow[]).filter((row) => row.reminder_email && isDue(row))).slice(0, 200)
  const results = {
    scanned: data?.length || 0,
    due: candidates.length,
    sent: 0,
    failed: 0,
  }

  for (const row of candidates) {
    const { date } = localParts(row.reminder_timezone || "UTC")
    try {
      await sendEmail({
        to: row.reminder_email || "",
        subject: "Your daily tarot card is waiting",
        html: dailyTarotReminderHtml({
          appUrl,
          cardName: row.card_name,
          isReversed: row.is_reversed,
          streakCount: row.streak_count,
        }),
        idempotencyKey: `daily-tarot-reminder-${row.user_id}-${date}`,
      })

      const { error: updateError } = await supabase
        .from("daily_tarot_entries")
        .update({
          reminder_last_sent_on: date,
          reminder_last_sent_at: new Date().toISOString(),
          reminder_last_error: null,
          reminder_send_count: Number(row.reminder_send_count || 0) + 1,
        })
        .eq("id", row.id)

      if (updateError) throw new Error(updateError.message)
      results.sent += 1
    } catch (err) {
      results.failed += 1
      await supabase
        .from("daily_tarot_entries")
        .update({
          reminder_last_error: err instanceof Error ? err.message.slice(0, 500) : "Unknown email error",
        })
        .eq("id", row.id)
    }
  }

  return jsonResponse({ ok: true, ...results })
}
