import { isCronAuthorized } from "@/lib/server/cron-auth"
import { dailyTarotReminderHtml, dailyTarotReminderText, emailProviderStatus, hasEmailProvider, sendEmail } from "@/lib/server/email"
import { jsonError, jsonResponse } from "@/lib/server/supabase"

function cleanEmail(value: unknown) {
  if (typeof value !== "string") return null
  const email = value.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.slice(0, 320) : null
}

function maskedEmail(email: string) {
  const [name = "", domain = ""] = email.split("@")
  const visible = name.length <= 2 ? name.slice(0, 1) : `${name.slice(0, 2)}...${name.slice(-1)}`
  return `${visible}@${domain}`
}

export async function POST(req: Request) {
  if (!isCronAuthorized(req)) return jsonError("Unauthorized", 401)

  const body = await req.json().catch(() => null)
  const to = cleanEmail((body as { to?: unknown } | null)?.to)
  if (!to) return jsonError("A valid test email is required", 400)
  if (!hasEmailProvider()) return jsonError("Missing RESEND_API_KEY", 503)

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com").replace(/\/$/, "")
  const unsubscribeUrl = `${appUrl}/daily-tarot?reminder=preferences&utm_source=daily_reminder_test&utm_medium=email&utm_campaign=test_send`
  const provider = emailProviderStatus()
  const result = await sendEmail({
    to,
    subject: "[Test] Your daily tarot card is waiting",
    html: dailyTarotReminderHtml({
      appUrl,
      cardName: "The Star",
      isReversed: false,
      streakCount: 3,
      unsubscribeUrl,
    }),
    text: dailyTarotReminderText({
      appUrl,
      cardName: "The Star",
      isReversed: false,
      streakCount: 3,
      unsubscribeUrl,
    }),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    tags: [
      { name: "surface", value: "daily_tarot" },
      { name: "type", value: "reminder_test" },
    ],
    idempotencyKey: `daily-tarot-reminder-test-${Date.now()}`,
  })

  return jsonResponse({
    ok: true,
    mode: "daily_reminder_test",
    provider,
    to: maskedEmail(to),
    email_id: result.id || null,
  })
}

