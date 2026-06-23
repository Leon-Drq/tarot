"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CalendarPlus, Loader2, Share2, Smartphone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, authApi, dailyTarotApi, readingApi, setAccessToken, type DailyTarotEntry } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { createShareTemplate, type ShareTemplatePlatform } from "@/lib/share-templates"
import {
  createFallbackDailyInterpretation,
  dailyTarotQuestion,
  getDailyCard,
  getDailyTarotCopy,
  getLocalDateKey,
} from "@/lib/daily-tarot"
import { getCardById, type DrawnCard } from "@/lib/tarot-cards"

const storageKey = "poptarot_daily_seed"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

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

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true
}

function normalizeReminderEmail(value: string) {
  return value.trim().toLowerCase()
}

function isValidReminderEmail(value: string) {
  const email = normalizeReminderEmail(value)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function padCalendarNumber(value: number) {
  return String(value).padStart(2, "0")
}

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function formatCalendarDateTime(date: Date, utc = false) {
  const source = utc
    ? {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
      }
    : {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      }

  return `${source.year}${padCalendarNumber(source.month)}${padCalendarNumber(source.day)}T${padCalendarNumber(source.hour)}${padCalendarNumber(source.minute)}${padCalendarNumber(source.second)}${utc ? "Z" : ""}`
}

function getReminderStartDate(time: string) {
  const [rawHour, rawMinute] = time.split(":")
  const hour = Number(rawHour)
  const minute = Number(rawMinute)
  const next = new Date()
  next.setHours(Number.isFinite(hour) ? hour : 8, Number.isFinite(minute) ? minute : 30, 0, 0)
  if (next.getTime() < Date.now() - 60_000) next.setDate(next.getDate() + 1)
  return next
}

function createDailyReminderCalendar(input: { time: string; summary: string; description: string }) {
  const timezone = getTimezone()
  const safeTimezone = timezone.replace(/[^A-Za-z0-9_-]/g, "-")
  const start = getReminderStartDate(input.time)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//POPTarot//Daily Tarot//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:POPTarot Daily Tarot",
    "BEGIN:VEVENT",
    `UID:poptarot-daily-tarot-${input.time.replace(/[^0-9]/g, "")}-${safeTimezone}@poptarot.com`,
    `DTSTAMP:${formatCalendarDateTime(new Date(), true)}`,
    `DTSTART:${formatCalendarDateTime(start)}`,
    "DURATION:PT10M",
    "RRULE:FREQ=DAILY",
    `SUMMARY:${escapeCalendarText(input.summary)}`,
    `DESCRIPTION:${escapeCalendarText(input.description)}`,
    "URL:https://poptarot.com/daily-tarot",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.join("\r\n")}\r\n`
}

function localDailyKey(dateKey: string) {
  return `poptarot_daily_${dateKey}`
}

function getPreviousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return getLocalDateKey(date)
}

function getRecentDateKeys(dateKey: string, count = 7) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return Array.from({ length: count }, (_, index) => {
    const item = new Date(date)
    item.setDate(date.getDate() - index)
    return getLocalDateKey(item)
  })
}

function readLocalEntry(dateKey: string): DailyTarotEntry | null {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(localDailyKey(dateKey))
  if (!value) return null
  try {
    return JSON.parse(value) as DailyTarotEntry
  } catch {
    return null
  }
}

function readRecentLocalEntries(dateKey: string) {
  return getRecentDateKeys(dateKey)
    .map(readLocalEntry)
    .filter((item): item is DailyTarotEntry => Boolean(item))
}

function cardFromEntry(entry: DailyTarotEntry): DrawnCard | null {
  const savedCard = getCardById(entry.card_id)
  if (!savedCard) return null
  return {
    ...savedCard,
    isReversed: Boolean(entry.is_reversed),
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
  const [recentEntries, setRecentEntries] = useState<DailyTarotEntry[]>([])
  const [interpretation, setInterpretation] = useState("")
  const [journal, setJournal] = useState("")
  const [mood, setMood] = useState("")
  const [reminderEmail, setReminderEmail] = useState("")
  const [reminderTime, setReminderTime] = useState("08:30")
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [emailDeliveryEnabled, setEmailDeliveryEnabled] = useState(false)
  const [streak, setStreak] = useState(0)
  const [shareUrl, setShareUrl] = useState("")
  const [shareStatus, setShareStatus] = useState("")
  const [calendarStatus, setCalendarStatus] = useState("")
  const [reminderStatus, setReminderStatus] = useState("")
  const [installStatus, setInstallStatus] = useState("")
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState("")

  const shareCopy =
    {
      zh: {
        title: "分享今日牌",
        description: "把今日牌和 AI 摘录生成公开链接，或复制成社媒文案。",
        button: "分享",
        loading: "生成中",
        copied: "链接已复制",
        generated: "分享链接已生成",
        failed: "分享失败，请稍后再试",
        xhs: "复制小红书文案",
        instagram: "复制 Instagram 文案",
        templateCopied: "分享文案已复制",
      },
      en: {
        title: "Share Today's Card",
        description: "Turn your daily card and AI insight into a public link or a social caption.",
        button: "Share",
        loading: "Creating",
        copied: "Share link copied",
        generated: "Share link ready",
        failed: "Share failed. Please try again.",
        xhs: "Copy Xiaohongshu",
        instagram: "Copy Instagram",
        templateCopied: "Share caption copied",
      },
      ja: {
        title: "今日のカードを共有",
        description: "今日のカードと AI 解釈から共有リンクや投稿文を作れます。",
        button: "共有",
        loading: "作成中",
        copied: "リンクをコピーしました",
        generated: "共有リンクを作成しました",
        failed: "共有に失敗しました。もう一度お試しください。",
        xhs: "小紅書テキストをコピー",
        instagram: "Instagramをコピー",
        templateCopied: "投稿文をコピーしました",
      },
      ko: {
        title: "오늘의 카드 공유",
        description: "오늘의 카드와 AI 해석으로 공유 링크나 소셜 문구를 만들 수 있습니다.",
        button: "공유",
        loading: "생성 중",
        copied: "공유 링크 복사됨",
        generated: "공유 링크 생성됨",
        failed: "공유에 실패했습니다. 다시 시도해주세요.",
        xhs: "샤오홍슈 문구 복사",
        instagram: "Instagram 복사",
        templateCopied: "공유 문구 복사됨",
      },
    }[language]

  useEffect(() => {
    const today = getLocalDateKey()
    setDateKey(today)
    const seededCard = getDailyCard(today, getSeed())
    setCard(seededCard)
    setRecentEntries(readRecentLocalEntries(today))

    const localEntry = localStorage.getItem(localDailyKey(today))
    if (localEntry) {
      try {
        const parsed = JSON.parse(localEntry) as DailyTarotEntry
        const savedCard = cardFromEntry(parsed)
        if (savedCard) setCard(savedCard)
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
  }, [])

  useEffect(() => {
    dailyTarotApi
      .getReminderCapability()
      .then((data) => setEmailDeliveryEnabled(Boolean(data.can_send_email_reminders ?? data.scheduled_delivery_enabled ?? data.email_delivery_enabled)))
      .catch(() => setEmailDeliveryEnabled(false))
  }, [])

  useEffect(() => {
    setShowInstallPrompt(!isStandaloneDisplay())

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    const handleAppInstalled = () => {
      setShowInstallPrompt(false)
      setInstallStatus(copy.installInstalled)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [copy.installInstalled])

  useEffect(() => {
    if (!isLoggedIn || !dateKey) return
    dailyTarotApi
      .getToday(dateKey)
      .then((data) => {
        setStreak(data.streak_count || 0)
        if (!data.entry) return
        const savedCard = cardFromEntry(data.entry)
        if (savedCard) setCard(savedCard)
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
    if (isLoggedIn) return true
    try {
      const response = await authApi.registerAnonymous()
      setAccessToken(response.access_token)
      await refreshUser()
      return true
    } catch {
      return false
    }
  }

  const saveLocalEntry = (nextEntry: DailyTarotEntry) => {
    localStorage.setItem(localDailyKey(nextEntry.entry_date), JSON.stringify(nextEntry))
    setEntry(nextEntry)
    setStreak(nextEntry.streak_count)
    setRecentEntries(readRecentLocalEntries(nextEntry.entry_date))
  }

  const createLocalEntry = (input: {
    interpretation?: string
    journal?: string | null
    mood?: string | null
    reminderEnabled?: boolean
    reminderEmail?: string | null
    reminderTime?: string
  }): DailyTarotEntry | null => {
    if (!card || !dateKey) return null
    const existing = entry || readLocalEntry(dateKey)
    const previous = readLocalEntry(getPreviousDateKey(dateKey))
    const nextStreak = existing?.streak_count || Number(previous?.streak_count || 0) + 1

    return {
      ...existing,
      entry_date: dateKey,
      card_id: card.id,
      card_name: card.nameEn,
      is_reversed: card.isReversed,
      question: dailyTarotQuestion,
      interpretation: input.interpretation ?? existing?.interpretation ?? interpretation,
      journal: input.journal ?? existing?.journal ?? journal,
      mood: input.mood ?? existing?.mood ?? mood,
      streak_count: nextStreak,
      reminder_enabled: input.reminderEnabled ?? existing?.reminder_enabled ?? reminderEnabled,
      reminder_email: input.reminderEmail ?? existing?.reminder_email ?? reminderEmail,
      reminder_time: input.reminderTime ?? existing?.reminder_time ?? reminderTime,
      reminder_timezone: getTimezone(),
    }
  }

  const syncEntry = async (nextEntry: DailyTarotEntry) => {
    const ready = await ensureUser()
    if (!ready) return null

    try {
      const result = await dailyTarotApi.saveEntry({
        entry_date: nextEntry.entry_date,
        card_id: nextEntry.card_id,
        card_name: nextEntry.card_name,
        is_reversed: nextEntry.is_reversed,
        question: nextEntry.question,
        interpretation: nextEntry.interpretation,
        journal: nextEntry.journal,
        mood: nextEntry.mood,
        reminder_enabled: nextEntry.reminder_enabled,
        reminder_email: nextEntry.reminder_email,
        reminder_time: nextEntry.reminder_time,
        reminder_timezone: nextEntry.reminder_timezone,
      })
      return result.entry
    } catch {
      return null
    }
  }

  const handleDraw = async () => {
    if (!card || !dateKey) return
    setIsDrawing(true)
    setStatus("")
    setInterpretation("")

    try {
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

      const localEntry = createLocalEntry({
        interpretation: fullText,
        reminderEnabled,
        reminderEmail,
        reminderTime,
      })
      if (!localEntry) return

      saveLocalEntry(localEntry)
      setStatus(copy.savedLocal)
      const syncedEntry = await syncEntry(localEntry)
      if (syncedEntry) {
        saveLocalEntry(syncedEntry)
        setStatus(copy.saved)
      }
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
      const localEntry = createLocalEntry({
        journal,
        mood,
      })
      if (!localEntry) return

      saveLocalEntry(localEntry)
      setStatus(copy.savedLocal)
      const syncedEntry = await syncEntry(localEntry)
      if (syncedEntry) {
        saveLocalEntry(syncedEntry)
        setStatus(copy.saved)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveReminder = async () => {
    if (!dateKey) return
    const normalizedEmail = normalizeReminderEmail(reminderEmail)
    if (reminderEnabled && !isValidReminderEmail(normalizedEmail)) {
      setStatus(copy.reminderEmailInvalid)
      setReminderStatus(copy.reminderEmailInvalid)
      return
    }

    setIsSaving(true)
    setReminderStatus("")
    try {
      setReminderEmail(reminderEnabled ? normalizedEmail : "")
      const localEntry = createLocalEntry({
        reminderEnabled,
        reminderEmail: reminderEnabled ? normalizedEmail : null,
        reminderTime,
      })
      if (!localEntry) return

      saveLocalEntry(localEntry)
      const localStatus = reminderEnabled
        ? emailDeliveryEnabled
          ? copy.reminderSavedLocal
          : copy.reminderSavedPending
        : copy.savedLocal
      setStatus(localStatus)
      setReminderStatus(localStatus)
      const syncedEntry = await syncEntry(localEntry)
      if (syncedEntry) {
        saveLocalEntry(syncedEntry)
        const syncedStatus = reminderEnabled
          ? emailDeliveryEnabled
            ? copy.reminderSaved
            : copy.reminderSavedPending
          : copy.saved
        setStatus(syncedStatus)
        setReminderStatus(syncedStatus)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadCalendarReminder = () => {
    const calendar = createDailyReminderCalendar({
      time: reminderTime,
      summary: copy.calendarReminderSummary,
      description: copy.calendarReminderDescription,
    })
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "poptarot-daily-tarot.ics"
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setCalendarStatus(copy.calendarReminderSaved)
  }

  const handleInstallPrompt = async () => {
    if (!installPrompt) {
      setInstallStatus(copy.installFallback)
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    if (choice.outcome === "accepted") {
      setShowInstallPrompt(false)
      setInstallStatus(copy.installInstalled)
      return
    }
    setInstallStatus(copy.installFallback)
  }

  const ensureShareUrl = async () => {
    if (shareUrl) return shareUrl
    if (!card || !interpretation) throw new Error("No daily reading to share")

    const ready = await ensureUser()
    if (!ready) throw new Error("Unable to prepare sharing")

    const result = await readingApi.createShare({
      question: dailyTarotQuestion,
      cards: [card],
      interpretation,
      spread_type: "one_card",
    })

    const absoluteUrl = `${window.location.origin}${result.url}`
    setShareUrl(absoluteUrl)
    analyticsApi.track("share_created", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      share_slug: result.slug,
      metadata: {
        surface: "daily-tarot",
        spread_type: "one_card",
      },
    })
    return absoluteUrl
  }

  const handleShare = async () => {
    if (isCreatingShare || !card || !interpretation) return
    setIsCreatingShare(true)
    setShareStatus("")

    try {
      const absoluteUrl = await ensureShareUrl()
      if (navigator.share) {
        await navigator.share({
          title: "POPTarot Daily Tarot",
          text: dailyTarotQuestion,
          url: absoluteUrl,
        })
        setShareStatus(shareCopy.generated)
      } else {
        await navigator.clipboard.writeText(absoluteUrl)
        setShareStatus(shareCopy.copied)
      }
    } catch {
      setShareStatus(shareCopy.failed)
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareTemplate = async (platform: ShareTemplatePlatform) => {
    if (isCreatingShare || !card || !interpretation) return
    setIsCreatingShare(true)
    setShareStatus("")

    try {
      const absoluteUrl = await ensureShareUrl()
      const text = createShareTemplate({
        platform,
        locale: language,
        question: dailyTarotQuestion,
        cards: [
          {
            name: localizedCardName(card),
            isReversed: card.isReversed,
          },
        ],
        interpretation,
        url: absoluteUrl,
      })
      await navigator.clipboard.writeText(text)
      analyticsApi.track("share_template_copied", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: {
          platform,
          surface: "daily-tarot",
        },
      })
      setShareStatus(shareCopy.templateCopied)
    } catch {
      setShareStatus(shareCopy.failed)
    } finally {
      setIsCreatingShare(false)
    }
  }

  const localizedCardName = (item: DrawnCard) =>
    language === "zh" ? item.name : language === "ja" ? item.nameJa || item.nameEn : language === "ko" ? item.nameKo || item.nameEn : item.nameEn

  const displayName = card ? localizedCardName(card) : ""
  const reminderModeTitle = emailDeliveryEnabled ? copy.emailReminderReadyTitle : copy.calendarFallbackTitle
  const reminderModeBody = emailDeliveryEnabled ? copy.reminderHelp : copy.calendarFallbackBody

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
        {showInstallPrompt && (
          <article
            data-daily-install-prompt
            className="rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.045] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] sm:hidden"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#bfb6ff]/24 bg-[#bfb6ff]/[0.1] text-[#dcd5ff]">
                <Smartphone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72">{copy.installEyebrow}</p>
                <h2 className="mt-2 text-base font-medium leading-snug text-white">{copy.installTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-white/56">{copy.installBody}</p>
              </div>
            </div>
            <button
              onClick={handleInstallPrompt}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#c9c0ff]/36 bg-[#c9c0ff]/12 px-5 text-sm font-medium text-[#f4f0ff] transition hover:bg-[#c9c0ff]/18"
            >
              {copy.installAction}
            </button>
            {installStatus && <p className="mt-3 text-xs leading-5 text-white/45">{installStatus}</p>}
          </article>
        )}

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
          {interpretation && card && (
            <div className="mt-5 rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.035] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">{shareCopy.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/56">{shareCopy.description}</p>
                </div>
                <button
                  onClick={handleShare}
                  disabled={isCreatingShare || isDrawing}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#bfb6ff]/30 px-4 py-2 text-sm text-[#eee9ff] transition hover:bg-[#bfb6ff]/10 disabled:opacity-45"
                >
                  {isCreatingShare ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                  {isCreatingShare ? shareCopy.loading : shareCopy.button}
                </button>
              </div>
              {shareUrl && (
                <div className="mt-4 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                  <p className="truncate text-xs text-white/52">{shareUrl}</p>
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => handleCopyShareTemplate("xhs")}
                  disabled={isCreatingShare || isDrawing}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/66 transition hover:border-[#bfb6ff]/35 hover:bg-white/[0.045] disabled:opacity-45"
                >
                  {shareCopy.xhs}
                </button>
                <button
                  onClick={() => handleCopyShareTemplate("instagram")}
                  disabled={isCreatingShare || isDrawing}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/66 transition hover:border-[#bfb6ff]/35 hover:bg-white/[0.045] disabled:opacity-45"
                >
                  {shareCopy.instagram}
                </button>
              </div>
              {shareStatus && <p className="mt-3 text-xs text-white/45">{shareStatus}</p>}
            </div>
          )}
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
          <div className="mb-4 rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.045] p-4">
            <p className="text-sm font-medium text-[#f2edff]">{reminderModeTitle}</p>
            <p className="mt-2 text-xs leading-5 text-white/52">{reminderModeBody}</p>
          </div>
          <div data-daily-reminder-form>
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
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                onClick={handleSaveReminder}
                disabled={isSaving || (!reminderEmail && reminderEnabled)}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/14 px-5 text-sm text-white/72 transition hover:bg-white/[0.05] disabled:opacity-45"
              >
                {copy.saveReminder}
              </button>
              <button
                onClick={handleDownloadCalendarReminder}
                className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm transition ${
                  emailDeliveryEnabled
                    ? "border border-[#bfb6ff]/28 bg-[#bfb6ff]/[0.06] text-[#eee9ff] hover:bg-[#bfb6ff]/12"
                    : "border border-[#c9c0ff]/40 bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] font-medium text-[#130d24] shadow-[0_16px_42px_rgba(146,132,239,0.22)] hover:brightness-110"
                }`}
              >
                <CalendarPlus className="h-4 w-4" />
                {copy.calendarReminder}
              </button>
            </div>
          </div>
          {reminderStatus && (
            <p data-daily-reminder-status className="mt-3 text-xs leading-5 text-[#c9c0ff]">
              {reminderStatus}
            </p>
          )}
          {calendarStatus && <p className="mt-3 text-xs text-white/45">{calendarStatus}</p>}
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-white">{copy.recentTitle}</h2>
            {recentEntries.length > 0 && (
              <span className="rounded-full border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.07] px-3 py-1 text-xs text-[#d8d0ff]">
                {recentEntries.length}/7
              </span>
            )}
          </div>
          {recentEntries.length > 0 ? (
            <div className="space-y-3">
              {recentEntries.map((recent) => {
                const recentCard = cardFromEntry(recent)
                const recentName = recentCard ? localizedCardName(recentCard) : recent.card_name
                const recentNote = recent.journal || recent.interpretation || copy.recentNoNote
                return (
                  <article key={recent.entry_date} className="rounded-lg border border-white/10 bg-black/18 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.14em] text-white/38">{recent.entry_date}</p>
                        <h3 className="mt-1 truncate text-sm font-medium text-white">
                          {recentName} · {recent.is_reversed ? "Reversed" : "Upright"}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/52">
                        {recent.streak_count} {copy.days}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/56">{recentNote}</p>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="text-sm leading-7 text-white/42">{copy.recentEmpty}</p>
          )}
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
