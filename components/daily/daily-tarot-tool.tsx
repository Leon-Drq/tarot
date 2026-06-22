"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, authApi, dailyTarotApi, readingApi, setAccessToken, type DailyTarotEntry } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"
import {
  createFallbackDailyInterpretation,
  dailyTarotQuestion,
  getDailyCard,
  getDailyTarotCopy,
  getLocalDateKey,
} from "@/lib/daily-tarot"
import type { DrawnCard } from "@/lib/tarot-cards"

const storageKey = "poptarot_daily_seed"

function getSeed() {
  if (typeof window === "undefined") return "guest"
  const existing = localStorage.getItem(storageKey)
  if (existing) return existing
  const next = crypto.randomUUID()
  localStorage.setItem(storageKey, next)
  return next
}

function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  } catch {
    return "UTC"
  }
}

async function readStream(response: Response, onDelta: (value: string) => void) {
  const reader = response.body?.getReader()
  if (!reader) return ""

  const decoder = new TextDecoder()
  let fullText = ""
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue
      const data = line.slice(6).trim()
      if (data === "[DONE]") continue
      try {
        const parsed = JSON.parse(data)
        if (typeof parsed.content === "string") {
          fullText += parsed.content
          onDelta(fullText)
        }
      } catch {
        // Ignore malformed stream chunks.
      }
    }
  }

  return fullText
}

export function DailyTarotTool() {
  const { user, isLoggedIn, refreshUser } = useAuth()
  const { language } = useLanguage()
  const copy = useMemo(() => getDailyTarotCopy(language), [language])
  const [dateKey, setDateKey] = useState("")
  const [card, setCard] = useState<DrawnCard | null>(null)
  const [entry, setEntry] = useState<DailyTarotEntry | null>(null)
  const [interpretation, setInterpretation] = useState("")
  const [journal, setJournal] = useState("")
  const [mood, setMood] = useState("")
  const [reminderEmail, setReminderEmail] = useState("")
  const [reminderTime, setReminderTime] = useState("08:30")
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [streak, setStreak] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const today = getLocalDateKey()
    setDateKey(today)
    const seededCard = getDailyCard(today, user?.id || getSeed())
    setCard(seededCard)

    const localEntry = localStorage.getItem(`poptarot_daily_${today}`)
    if (localEntry) {
      try {
        const parsed = JSON.parse(localEntry) as DailyTarotEntry
        setEntry(parsed)
        setInterpretation(parsed.interpretation || "")
        setJournal(parsed.journal || "")
        setMood(parsed.mood || "")
        setReminderEmail(parsed.reminder_email || "")
        setReminderTime(parsed.reminder_time || "08:30")
        setReminderEnabled(parsed.reminder_enabled)
        setStreak(parsed.streak_count || 1)
      } catch {
        // Ignore corrupt local cache.
      }
    }
  }, [user?.id])

  useEffect(() => {
    if (!isLoggedIn || !dateKey) return
    dailyTarotApi
      .getToday(dateKey)
      .then((data) => {
        setStreak(data.streak_count || 0)
        if (!data.entry) return
        setEntry(data.entry)
        setInterpretation(data.entry.interpretation || "")
        setJournal(data.entry.journal || "")
        setMood(data.entry.mood || "")
        setReminderEmail(data.entry.reminder_email || "")
        setReminderTime(data.entry.reminder_time || "08:30")
        setReminderEnabled(data.entry.reminder_enabled)
      })
      .catch(() => undefined)
  }, [dateKey, isLoggedIn])

  const ensureUser = async () => {
    if (isLoggedIn) return
    const response = await authApi.registerAnonymous()
    setAccessToken(response.access_token)
    await refreshUser()
  }

  const saveLocalEntry = (nextEntry: DailyTarotEntry) => {
    localStorage.setItem(`poptarot_daily_${nextEntry.entry_date}`, JSON.stringify(nextEntry))
    setEntry(nextEntry)
    setStreak(nextEntry.streak_count)
  }

  const handleDraw = async () => {
    if (!card || !dateKey) return
    setIsDrawing(true)
    setStatus("")
    setInterpretation("")

    try {
      await ensureUser()
      analyticsApi.track("question_submitted", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: { surface: "daily-tarot" },
      })

      let fullText = ""
      try {
        const response = await readingApi.interpret(dailyTarotQuestion, [card], false, undefined, undefined, language, "one_card")
        if (!response.ok) throw new Error("Daily reading failed")
        fullText = await readStream(response, setInterpretation)
      } catch {
        fullText = createFallbackDailyInterpretation(card, language)
        setInterpretation(fullText)
      }

      const result = await dailyTarotApi.saveEntry({
        entry_date: dateKey,
        card_id: card.id,
        card_name: card.nameEn,
        is_reversed: card.isReversed,
        question: dailyTarotQuestion,
        interpretation: fullText,
        reminder_enabled: reminderEnabled,
        reminder_email: reminderEmail,
        reminder_time: reminderTime,
        reminder_timezone: getTimezone(),
      })

      saveLocalEntry(result.entry)
      setStatus(copy.saved)
      analyticsApi.track("reading_completed", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: { surface: "daily-tarot", card_id: card.id },
      })
    } finally {
      setIsDrawing(false)
    }
  }

  const handleSaveJournal = async () => {
    if (!dateKey) return
    setIsSaving(true)
    try {
      await ensureUser()
      const result = await dailyTarotApi.updateEntry({
        entry_date: dateKey,
        journal,
        mood,
      })
      saveLocalEntry(result.entry)
      setStatus(copy.saved)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveReminder = async () => {
    if (!dateKey) return
    setIsSaving(true)
    try {
      await ensureUser()
      const result = entry
        ? await dailyTarotApi.updateEntry({
            entry_date: dateKey,
            reminder_enabled: reminderEnabled,
            reminder_email: reminderEmail,
            reminder_time: reminderTime,
            reminder_timezone: getTimezone(),
          })
        : await dailyTarotApi.saveEntry({
            entry_date: dateKey,
            card_id: card?.id || 0,
            card_name: card?.nameEn || "The Fool",
            is_reversed: card?.isReversed || false,
            question: dailyTarotQuestion,
            reminder_enabled: reminderEnabled,
            reminder_email: reminderEmail,
            reminder_time: reminderTime,
            reminder_timezone: getTimezone(),
          })
      saveLocalEntry(result.entry)
      setStatus(copy.saved)
    } finally {
      setIsSaving(false)
    }
  }

  const displayName = card ? (language === "zh" ? card.name : language === "ja" ? card.nameJa || card.nameEn : language === "ko" ? card.nameKo || card.nameEn : card.nameEn) : ""

  return (
    <div className="mx-auto grid max-w-6xl gap-5 px-4 pb-12 pt-6 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-12">
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/78">{copy.eyebrow}</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{copy.subtitle}</p>
            <div className="mt-4 inline-flex min-h-9 items-center rounded-full border border-[#bfb6ff]/25 bg-[#bfb6ff]/10 px-3 text-xs text-[#eee9ff] sm:hidden">
              <span>
                {streak} {copy.days} · {copy.streak}
              </span>
            </div>
          </div>
          <div className="hidden min-w-[112px] rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/10 p-4 text-center sm:block">
            <p className="text-2xl font-semibold text-white">{streak}</p>
            <p className="text-xs text-white/48">
              {copy.streak} · {copy.days}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div className="mx-auto w-full max-w-[220px]">
            <div className="relative aspect-[7/12] overflow-hidden rounded-xl border border-[#bfb6ff]/28 bg-[#211330] shadow-2xl shadow-black/45">
              {card && <Image src={card.image} alt={displayName} fill className="object-cover" sizes="240px" priority />}
              <div className="absolute inset-3 rounded-lg border border-white/18" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {card && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.16em] text-white/42">{card.isReversed ? "Reversed" : "Upright"}</p>
                <h2 className="mt-2 font-serif text-2xl text-white">{displayName}</h2>
              </div>
            )}

            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_48%,#9182ef_100%)] px-6 py-3 text-sm font-medium text-[#130d24] shadow-[0_18px_45px_rgba(144,130,239,0.24)] transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              {isDrawing && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDrawing ? copy.drawing : copy.draw}
            </button>

            <p className="mt-4 text-xs leading-6 text-white/45">{copy.upgrade}</p>
            {status && (
              <p className="mt-4 text-sm text-[#c9c0ff]">
                {status}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-white">AI Reading</h2>
          </div>
          <div className="min-h-[168px] text-sm leading-7 text-white/70 sm:text-base">
            {interpretation || (
              <p className="text-white/42">
                Draw your daily card to receive a free AI interpretation for today's focus, energy, and next step.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-white">Journal</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <input
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              placeholder="Mood"
              className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#bfb6ff]/55"
            />
            <textarea
              value={journal}
              onChange={(event) => setJournal(event.target.value)}
              placeholder={copy.journalPlaceholder}
              className="min-h-28 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-[#bfb6ff]/55"
            />
          </div>
          <button
            onClick={handleSaveJournal}
            disabled={isSaving || !entry}
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-[#bfb6ff]/30 px-5 text-sm text-[#eee9ff] transition hover:bg-[#bfb6ff]/10 disabled:opacity-45 sm:w-auto"
          >
            {copy.saveJournal}
          </button>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="font-serif text-xl text-white">{copy.reminderTitle}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_132px]">
            <input
              type="email"
              value={reminderEmail}
              onChange={(event) => setReminderEmail(event.target.value)}
              placeholder={copy.reminderEmail}
              className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#bfb6ff]/55"
            />
            <input
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
              aria-label={copy.reminderTime}
              className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition focus:border-[#bfb6ff]/55"
            />
          </div>
          <label className="mt-4 flex min-h-10 items-center gap-3 text-sm text-white/62">
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(event) => setReminderEnabled(event.target.checked)}
              className="h-4 w-4 accent-[#bfb6ff]"
            />
            {copy.reminderToggle}
          </label>
          <button
            onClick={handleSaveReminder}
            disabled={isSaving || (!reminderEmail && reminderEnabled)}
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/14 px-5 text-sm text-white/72 transition hover:bg-white/[0.05] disabled:opacity-45 sm:w-auto"
          >
            {copy.saveReminder}
          </button>
        </article>

        <Link
          href="/input?q=What%20do%20I%20most%20need%20to%20understand%20right%20now%3F"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-white/[0.06] px-6 text-sm text-white/82 transition hover:bg-white/[0.09]"
        >
          {copy.startReading}
        </Link>
      </section>
    </div>
  )
}
