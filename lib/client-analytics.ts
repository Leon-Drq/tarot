"use client"

export function getAnalyticsSessionId() {
  const key = "poptarot_session_id"
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const value = crypto.randomUUID()
  localStorage.setItem(key, value)
  return value
}

export function getCurrentAttribution() {
  const params = new URLSearchParams(window.location.search)
  const referrer = document.referrer || ""
  let source = params.get("utm_source") || "direct"

  if (!params.get("utm_source") && referrer) {
    try {
      source = new URL(referrer).hostname.replace(/^www\./, "")
    } catch {
      source = "referral"
    }
  }

  return {
    session_id: getAnalyticsSessionId(),
    path: `${window.location.pathname}${window.location.search}`,
    referrer,
    source,
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
    keyword: params.get("utm_term") || params.get("q"),
  }
}
