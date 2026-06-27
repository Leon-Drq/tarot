import { isSeoLocale } from "@/lib/locales"
import { createAnonSupabase, createUserSupabase, getBearerToken, jsonError, jsonResponse } from "@/lib/server/supabase"

const feedbackTypes = new Set([
  "daily_tarot",
  "free_reading",
  "love_reading",
  "career_reading",
  "card_meanings",
  "trust_page",
  "other",
])

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return ""
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength)
}

function cleanOptionalEmail(value: unknown) {
  const email = cleanString(value, 254)
  if (!email) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ""
  return email
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== "object") return jsonError("Invalid feedback payload")

  const honeypot = cleanString((payload as { website?: unknown }).website, 120)
  if (honeypot) return jsonResponse({ ok: true })

  const rating = Number((payload as { rating?: unknown }).rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return jsonError("Choose a rating from 1 to 5")

  const quote = cleanString((payload as { quote?: unknown }).quote, 800)
  if (quote.length < 12) return jsonError("Feedback must be at least 12 characters")

  const rawType = cleanString((payload as { feedback_type?: unknown }).feedback_type, 40)
  const feedbackType = feedbackTypes.has(rawType) ? rawType : "other"

  const rawLocale = cleanString((payload as { locale?: unknown }).locale, 12)
  const locale = isSeoLocale(rawLocale) ? rawLocale : "en"

  const rawSurface = cleanString((payload as { surface?: unknown }).surface, 80).toLowerCase()
  const surface = /^[a-z0-9_/-]+$/.test(rawSurface) ? rawSurface : "reviews"

  const email = cleanOptionalEmail((payload as { email?: unknown }).email)
  if (email === "") return jsonError("Enter a valid email or leave it blank")

  const permissionToFeature = (payload as { permission_to_feature?: unknown }).permission_to_feature === true
  const token = getBearerToken(req)
  let supabase = createAnonSupabase()
  let userId: string | null = null

  if (token) {
    const scoped = createUserSupabase(token)
    const { data, error } = await scoped.auth.getUser(token)
    if (!error && data.user) {
      supabase = scoped
      userId = data.user.id
    }
  }

  const path = cleanString((payload as { path?: unknown }).path, 180) || "/reviews"
  const metadata = {
    path,
    referrer: cleanString(req.headers.get("referer"), 240) || null,
    user_agent: cleanString(req.headers.get("user-agent"), 240) || null,
  }

  const { error } = await supabase.from("reader_feedback").insert({
    user_id: userId,
    locale,
    surface,
    feedback_type: feedbackType,
    rating,
    quote,
    permission_to_feature: permissionToFeature,
    email,
    metadata,
  })

  if (error) {
    console.error("[Feedback] insert failed", error)
    return jsonError("Feedback could not be saved", 500)
  }

  return jsonResponse({ ok: true })
}
