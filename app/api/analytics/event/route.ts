import { createAnonSupabase, createUserSupabase, getBearerToken, jsonError, jsonResponse } from "@/lib/server/supabase"
import { isSeoLocale } from "@/lib/locales"

const eventNames = new Set([
  "page_view",
  "question_submitted",
  "cards_selected",
  "reading_completed",
  "share_created",
  "share_template_copied",
  "share_fallback_created",
  "payment_started",
  "payment_completed",
])

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, maxLength) : null
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {}
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null)
  if (!payload || typeof payload !== "object") return jsonError("Invalid analytics payload")

  const eventName = text((payload as Record<string, unknown>).event_name, 64)
  if (!eventName || !eventNames.has(eventName)) return jsonError("Invalid analytics event")

  const token = getBearerToken(req)
  let userId: string | null = null
  let supabase = createAnonSupabase()

  if (token) {
    const scoped = createUserSupabase(token)
    const { data } = await scoped.auth.getUser(token)
    if (data.user) {
      userId = data.user.id
      supabase = scoped
    }
  }

  const rawLocale = text((payload as Record<string, unknown>).locale, 16) || "en"
  const locale = isSeoLocale(rawLocale) ? rawLocale : "en"

  const record = {
    event_name: eventName,
    user_id: userId,
    session_id: text((payload as Record<string, unknown>).session_id, 96),
    path: text((payload as Record<string, unknown>).path, 512) || "/",
    locale,
    referrer: text((payload as Record<string, unknown>).referrer, 512),
    source: text((payload as Record<string, unknown>).source, 128),
    medium: text((payload as Record<string, unknown>).medium, 128),
    campaign: text((payload as Record<string, unknown>).campaign, 128),
    keyword: text((payload as Record<string, unknown>).keyword, 256),
    reading_id: text((payload as Record<string, unknown>).reading_id, 80),
    share_slug: text((payload as Record<string, unknown>).share_slug, 80),
    metadata: objectValue((payload as Record<string, unknown>).metadata),
  }

  const { error } = await supabase.from("analytics_events").insert(record)
  if (error) return jsonError(error.message)

  return jsonResponse({ ok: true })
}
