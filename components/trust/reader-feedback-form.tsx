"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { getAccessToken } from "@/lib/api"

const feedbackTypes = [
  { value: "free_reading", label: "Free reading" },
  { value: "daily_tarot", label: "Daily Tarot" },
  { value: "love_reading", label: "Love reading" },
  { value: "career_reading", label: "Career reading" },
  { value: "card_meanings", label: "Card meanings" },
  { value: "other", label: "Other" },
] as const

const feedbackTypeValues = new Set(feedbackTypes.map((item) => item.value))
const feedbackLocales = new Set(["zh", "en", "ja", "ko", "es", "pt-br"])

type SubmitState = "idle" | "submitting" | "success" | "error"

function safeSurface(value: string | null) {
  const surface = (value || "").trim().toLowerCase().slice(0, 80)
  return /^[a-z0-9_/-]+$/.test(surface) ? surface : "reviews"
}

function safeContext(value: string | null) {
  return (value || "").trim().replace(/\s+/g, " ").slice(0, 80)
}

function safeLocale(value: string | null) {
  const locale = (value || "").trim().toLowerCase()
  return feedbackLocales.has(locale) ? locale : "en"
}

export function ReaderFeedbackForm() {
  const [rating, setRating] = useState(5)
  const [feedbackType, setFeedbackType] = useState<(typeof feedbackTypes)[number]["value"]>("free_reading")
  const [quote, setQuote] = useState("")
  const [email, setEmail] = useState("")
  const [permissionToFeature, setPermissionToFeature] = useState(false)
  const [surface, setSurface] = useState("reviews")
  const [locale, setLocale] = useState("en")
  const [sourceContext, setSourceContext] = useState("")
  const [website, setWebsite] = useState("")
  const [state, setState] = useState<SubmitState>("idle")
  const [error, setError] = useState("")

  const trimmedQuote = quote.trim()
  const remaining = 800 - quote.length
  const canSubmit = useMemo(() => trimmedQuote.length >= 12 && state !== "submitting", [state, trimmedQuote.length])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")
    if (type && feedbackTypeValues.has(type as (typeof feedbackTypes)[number]["value"])) {
      setFeedbackType(type as (typeof feedbackTypes)[number]["value"])
    }

    const nextRating = Number(params.get("rating"))
    if (Number.isInteger(nextRating) && nextRating >= 1 && nextRating <= 5) {
      setRating(nextRating)
    }

    setSurface(safeSurface(params.get("surface")))
    setLocale(safeLocale(params.get("locale") || params.get("lang")))
    setSourceContext(safeContext(params.get("context") || params.get("from")))
  }, [])

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setState("submitting")
    setError("")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    const token = getAccessToken()
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({
          rating,
          feedback_type: feedbackType,
          quote: trimmedQuote,
          email: email.trim() || null,
          permission_to_feature: permissionToFeature,
          locale,
          surface,
          path: window.location.pathname,
          website,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || "Feedback could not be saved")

      setState("success")
      setQuote("")
      setEmail("")
      setPermissionToFeature(false)
    } catch (submitError) {
      setState("error")
      setError(submitError instanceof Error ? submitError.message : "Feedback could not be saved")
    }
  }

  return (
    <section
      data-reader-feedback-form
      id="reader-feedback"
      className="mt-12 rounded-lg border border-[#bfb6ff]/18 bg-[linear-gradient(180deg,rgba(191,182,255,0.08),rgba(255,255,255,0.025))] p-5 sm:p-6"
    >
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">Reader feedback</p>
        <h2 className="mt-3 font-serif text-2xl text-white">Help Shape Public Reviews</h2>
        <p className="mt-3 text-sm leading-7 text-white/62">
          Share what felt useful or confusing. Submissions are private by default and only become public after editorial review and explicit permission.
        </p>
        {sourceContext && (
          <p data-reader-feedback-source className="mt-3 rounded-lg border border-white/10 bg-black/18 px-3 py-2 text-xs leading-5 text-white/52">
            Feedback source: {sourceContext}
          </p>
        )}
      </div>

      <form onSubmit={submitFeedback} className="mt-6 space-y-5">
        <label className="hidden">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-white">How useful was it?</legend>
          <div data-reader-feedback-rating className="mt-3 grid grid-cols-5 gap-2 sm:max-w-sm">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={rating === value}
                aria-label={`Rate ${value} out of 5`}
                onClick={() => setRating(value)}
                className={`min-h-11 rounded-lg border px-3 text-sm font-medium transition ${
                  rating === value
                    ? "border-[#c9c0ff] bg-[#c9c0ff] text-[#120c22]"
                    : "border-white/12 bg-black/15 text-white/62 hover:border-[#bfb6ff]/45 hover:text-white"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-white">Which experience?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {feedbackTypes.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={feedbackType === item.value}
                onClick={() => setFeedbackType(item.value)}
                className={`min-h-11 rounded-lg border px-3 py-2 text-sm transition ${
                  feedbackType === item.value
                    ? "border-[#c9c0ff] bg-[#c9c0ff]/16 text-white"
                    : "border-white/12 bg-black/15 text-white/62 hover:border-[#bfb6ff]/45 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium text-white">Your feedback</span>
          <textarea
            value={quote}
            onChange={(event) => setQuote(event.target.value.slice(0, 800))}
            minLength={12}
            maxLength={800}
            rows={5}
            required
            placeholder="What did POPTarot help you notice, decide, or improve?"
            className="mt-3 block min-h-32 w-full resize-y rounded-lg border border-white/12 bg-black/24 px-4 py-3 text-base leading-7 text-white outline-none transition placeholder:text-white/34 focus:border-[#c9c0ff]/70"
          />
          <span className="mt-2 block text-xs text-white/42">{remaining} characters left</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-white">Email for follow-up, optional</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 block min-h-11 w-full rounded-lg border border-white/12 bg-black/24 px-4 py-2 text-base text-white outline-none transition placeholder:text-white/34 focus:border-[#c9c0ff]/70"
          />
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/16 p-4 text-sm leading-6 text-white/66">
          <input
            type="checkbox"
            checked={permissionToFeature}
            onChange={(event) => setPermissionToFeature(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#c9c0ff]"
          />
          <span>POPTarot may quote this feedback after editorial review. We can shorten for clarity, but never publish contact details.</span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            data-reader-feedback-submit
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {state === "submitting" ? "Submitting..." : "Submit feedback"}
          </button>
          {state === "success" && <p className="text-sm leading-6 text-[#c9c0ff]">Thank you. Your feedback is saved for review.</p>}
          {state === "error" && <p className="text-sm leading-6 text-[#ffb4c1]">{error}</p>}
        </div>
      </form>
    </section>
  )
}
