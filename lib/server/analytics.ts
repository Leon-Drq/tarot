import { createAnonSupabase, createServiceSupabase, hasSupabaseServiceKey } from "@/lib/server/supabase"

type ServerAnalyticsEvent = {
  event_name: string
  user_id?: string | null
  session_id?: string | null
  path?: string
  locale?: string
  referrer?: string | null
  source?: string | null
  medium?: string | null
  campaign?: string | null
  keyword?: string | null
  reading_id?: string | null
  share_slug?: string | null
  metadata?: Record<string, unknown>
}

export async function trackServerAnalyticsEvent(event: ServerAnalyticsEvent) {
  try {
    const useServiceClient = hasSupabaseServiceKey()
    const supabase = useServiceClient ? createServiceSupabase() : createAnonSupabase()
    await supabase.from("analytics_events").insert({
      event_name: event.event_name,
      user_id: useServiceClient ? event.user_id || null : null,
      session_id: event.session_id || null,
      path: event.path || "/",
      locale: event.locale || "en",
      referrer: event.referrer || null,
      source: event.source || null,
      medium: event.medium || null,
      campaign: event.campaign || null,
      keyword: event.keyword || null,
      reading_id: event.reading_id || null,
      share_slug: event.share_slug || null,
      metadata: event.metadata || {},
    })
  } catch (error) {
    console.warn("[Analytics] server event failed:", error)
  }
}
