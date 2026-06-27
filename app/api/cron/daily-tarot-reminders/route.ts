import { jsonError, jsonResponse } from "@/lib/server/supabase"
import { dailyReminderUnsubscribeUrl } from "@/lib/server/daily-reminder-unsubscribe"
import { isDailyReminderDue, localReminderParts, newestReminderPerUser } from "@/lib/server/daily-reminder-schedule"
import { dailyTarotReminderHtml, dailyTarotReminderText, emailProviderStatus, hasEmailProvider, sendEmail } from "@/lib/server/email"
import {
  checkDailyReminderDatabaseAccess,
  listDailyReminderCandidates,
  markDailyReminderFailed,
  markDailyReminderSent,
} from "@/lib/server/daily-reminder-rpc"

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return req.headers.get("authorization") === `Bearer ${secret}`
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const dryRun = url.searchParams.get("dry_run") === "1" || url.searchParams.get("dryRun") === "1"

  if (!isAuthorized(req)) return jsonError("Unauthorized", 401)
  if (!(await checkDailyReminderDatabaseAccess())) return jsonError("Daily reminder database access is not configured", 503)

  const data = await listDailyReminderCandidates(2000)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"
  const candidates = newestReminderPerUser(data.filter((row) => row.reminder_email && isDailyReminderDue(row))).slice(0, 200)
  const results = {
    scanned: data.length,
    due: candidates.length,
    sent: 0,
    failed: 0,
  }

  if (dryRun) {
    return jsonResponse({
      ok: true,
      dry_run: true,
      email_provider_configured: hasEmailProvider(),
      email_provider: emailProviderStatus(),
      ...results,
    })
  }

  if (!hasEmailProvider()) return jsonError("Missing RESEND_API_KEY", 503)

  for (const row of candidates) {
    const { date } = localReminderParts(row.reminder_timezone || "UTC")
    const unsubscribeUrl = dailyReminderUnsubscribeUrl(appUrl, row.user_id)
    try {
      await sendEmail({
        to: row.reminder_email || "",
        subject: "Your daily tarot card is waiting",
        html: dailyTarotReminderHtml({
          appUrl,
          cardName: row.card_name,
          isReversed: row.is_reversed,
          streakCount: row.streak_count,
          unsubscribeUrl,
        }),
        text: dailyTarotReminderText({
          appUrl,
          cardName: row.card_name,
          isReversed: row.is_reversed,
          streakCount: row.streak_count,
          unsubscribeUrl,
        }),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        tags: [
          { name: "surface", value: "daily_tarot" },
          { name: "type", value: "reminder" },
        ],
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

  return jsonResponse({ ok: true, dry_run: false, ...results })
}
