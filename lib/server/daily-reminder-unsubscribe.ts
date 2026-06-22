import { createHmac, timingSafeEqual } from "crypto"

const TOKEN_VERSION = "v1"

function getUnsubscribeSecret() {
  return (
    process.env.DAILY_TAROT_UNSUBSCRIBE_SECRET ||
    process.env.CRON_SECRET ||
    process.env.POPTAROT_FULFILLMENT_SECRET ||
    ""
  )
}

function signUserId(userId: string) {
  const secret = getUnsubscribeSecret()
  if (!secret) throw new Error("Missing DAILY_TAROT_UNSUBSCRIBE_SECRET")
  return createHmac("sha256", secret).update(`${TOKEN_VERSION}:${userId}`).digest("base64url")
}

export function createDailyReminderUnsubscribeToken(userId: string) {
  return `${TOKEN_VERSION}.${signUserId(userId)}`
}

export function verifyDailyReminderUnsubscribeToken(userId: string, token: string) {
  const [version, signature] = token.split(".")
  if (version !== TOKEN_VERSION || !signature) return false

  const expected = signUserId(userId)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(signatureBuffer, expectedBuffer)
}

export function dailyReminderUnsubscribeUrl(appUrl: string, userId: string) {
  const root = appUrl.replace(/\/$/, "")
  const token = createDailyReminderUnsubscribeToken(userId)
  return `${root}/api/daily-tarot/unsubscribe?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(token)}`
}
