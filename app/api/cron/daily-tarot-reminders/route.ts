import { jsonError, jsonResponse } from "@/lib/server/supabase"
import { dailyReminderUnsubscribeUrl } from "@/lib/server/daily-reminder-unsubscribe"
import { dailyTarotReminderHtml, hasEmailProvider, sendEmail } from "@/lib/server/email"
import {
  checkDailyReminderDatabaseAccess,
  listDailyReminderCandidates,
  markDailyReminderFailed,
  markDailyReminderSent,
  type ReminderCandidateRow,
} from "@/lib/server/daily-reminder-rpc"

type ReminderRow = ReminderCandidateRow

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
  if (!(await checkDailyReminderDatabaseAccess())) return jsonError("Daily reminder database access is not configured", 503)
  if (!hasEmailProvider()) return jsonError("Missing RESEND_API_KEY", 503)

  const data = await listDailyReminderCandidates(2000)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
  const candidates = newestPerUser(data.filter((row) => row.reminder_email && isDue(row))).slice(0, 200)
  const results = {
    scanned: data.length,
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
          unsubscribeUrl: dailyReminderUnsubscribeUrl(appUrl, row.user_id),
        }),
        idempotencyKey: `daily-tarot-reminder-${row.user_id}-${date}`,
      })

      await markDailyReminderSent(row.id, date)
      results.sent += 1
    } catch (err) {
      results.failed += 1
      const message = err instanceof Error ? err.message.slice(0, 500) : "Unknown email error"
      await markDailyReminderFailed(row.id, message).catch(() => undefined)
    }
  }

  return jsonResponse({ ok: true, ...results })
}
