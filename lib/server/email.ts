type SendEmailInput = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  headers?: Record<string, string>
  tags?: Array<{ name: string; value: string }>
  idempotencyKey?: string
}

const defaultFromEmail = "POPTarot <daily@poptarot.com>"

function getResendApiKey() {
  return process.env.RESEND_API_KEY || ""
}

function configuredFromEmail() {
  return process.env.RESEND_FROM_EMAIL || defaultFromEmail
}

function configuredReplyTo() {
  return process.env.RESEND_REPLY_TO || ""
}

export function hasEmailProvider() {
  return Boolean(getResendApiKey())
}

export function emailProviderStatus() {
  return {
    provider: "resend",
    configured: hasEmailProvider(),
    from_configured: Boolean(process.env.RESEND_FROM_EMAIL),
    reply_to_configured: Boolean(configuredReplyTo()),
  }
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#96;")
}

export async function sendEmail({ to, subject, html, text, replyTo, headers: customHeaders, tags, idempotencyKey }: SendEmailInput) {
  const apiKey = getResendApiKey()
  if (!apiKey) throw new Error("Missing RESEND_API_KEY")

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey

  const resolvedReplyTo = replyTo || configuredReplyTo()
  const body: Record<string, unknown> = {
    from: configuredFromEmail(),
    to,
    subject,
    html,
  }
  if (text) body.text = text
  if (resolvedReplyTo) body.reply_to = resolvedReplyTo
  if (customHeaders && Object.keys(customHeaders).length > 0) body.headers = customHeaders
  if (tags && tags.length > 0) body.tags = tags

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
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
  unsubscribeUrl?: string
}) {
  const orientation = input.isReversed ? "reversed" : "upright"
  const dailyUrl = `${input.appUrl.replace(/\/$/, "")}/daily-tarot`
  const unsubscribeUrl = input.unsubscribeUrl || `${dailyUrl}?reminder=preferences`
  const safeCardName = escapeHtml(input.cardName)
  const safeDailyUrl = escapeAttribute(dailyUrl)
  const safeUnsubscribeUrl = escapeAttribute(unsubscribeUrl)
  const safeStreakCount = escapeHtml(input.streakCount)

  return `<!doctype html>
<html>
  <body style="margin:0;background:#080310;color:#f8f4ff;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <p style="color:#c9c0ff;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">POPTarot Daily</p>
      <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.15;margin:12px 0 16px;">Your daily tarot card is waiting</h1>
      <p style="color:#cfc4dc;font-size:16px;line-height:1.7;margin:0 0 20px;">
        Yesterday's thread continues: your latest card was <strong style="color:#ffffff;">${safeCardName}</strong> (${orientation}).
        Come back for today's free AI tarot reading and keep your ${safeStreakCount}-day streak alive.
      </p>
      <a href="${safeDailyUrl}" style="display:inline-block;background:#c9c0ff;color:#130d24;text-decoration:none;border-radius:10px;padding:14px 22px;font-weight:700;font-size:14px;">
        Draw today's card
      </a>
      <p style="color:#81738f;font-size:12px;line-height:1.6;margin-top:28px;">
        You are receiving this because you enabled Daily Tarot reminders in POPTarot.
        Open Daily Tarot to update reminder preferences, or
        <a href="${safeUnsubscribeUrl}" style="color:#c9c0ff;text-decoration:underline;">turn off these reminders</a>.
      </p>
    </div>
  </body>
</html>`
}

export function dailyTarotReminderText(input: {
  appUrl: string
  cardName: string
  isReversed: boolean
  streakCount: number
  unsubscribeUrl?: string
}) {
  const orientation = input.isReversed ? "reversed" : "upright"
  const dailyUrl = `${input.appUrl.replace(/\/$/, "")}/daily-tarot`
  const unsubscribeUrl = input.unsubscribeUrl || `${dailyUrl}?reminder=preferences`

  return [
    "POPTarot Daily",
    "",
    "Your daily tarot card is waiting.",
    "",
    `Yesterday's thread continues: your latest card was ${input.cardName} (${orientation}).`,
    `Come back for today's free AI tarot reading and keep your ${input.streakCount}-day streak alive.`,
    "",
    `Draw today's card: ${dailyUrl}`,
    "",
    "You are receiving this because you enabled Daily Tarot reminders in POPTarot.",
    `Turn off these reminders: ${unsubscribeUrl}`,
  ].join("\n")
}
