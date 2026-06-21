type SendEmailInput = {
  to: string
  subject: string
  html: string
  idempotencyKey?: string
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY || ""
}

export function hasEmailProvider() {
  return Boolean(getResendApiKey())
}

export async function sendEmail({ to, subject, html, idempotencyKey }: SendEmailInput) {
  const apiKey = getResendApiKey()
  if (!apiKey) throw new Error("Missing RESEND_API_KEY")

  const from = process.env.RESEND_FROM_EMAIL || "POPTarot <daily@poptarot.com>"
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : "Failed to send email"
    throw new Error(message)
  }

  return data as { id?: string }
}

export function dailyTarotReminderHtml(input: {
  appUrl: string
  cardName: string
  isReversed: boolean
  streakCount: number
}) {
  const orientation = input.isReversed ? "reversed" : "upright"
  const dailyUrl = `${input.appUrl.replace(/\/$/, "")}/daily-tarot`

  return `<!doctype html>
<html>
  <body style="margin:0;background:#080310;color:#f8f4ff;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <p style="color:#dcb360;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">POPTarot Daily</p>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.15;margin:12px 0 16px;">Your daily tarot card is waiting</h1>
      <p style="color:#cfc4dc;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Yesterday's thread continues: your latest card was <strong style="color:#ffffff;">${input.cardName}</strong> (${orientation}).
        Come back for today's free AI tarot reading and keep your ${input.streakCount}-day streak alive.
      </p>
      <a href="${dailyUrl}" style="display:inline-block;background:#dcb360;color:#14091f;text-decoration:none;border-radius:999px;padding:14px 22px;font-weight:700;font-size:14px;">
        Draw today's card
      </a>
      <p style="color:#81738f;font-size:12px;line-height:1.6;margin-top:28px;">
        You are receiving this because you enabled Daily Tarot reminders in POPTarot. Open Daily Tarot to update reminder preferences.
      </p>
    </div>
  </body>
</html>`
}
