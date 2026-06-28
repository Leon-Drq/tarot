"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Bell, CalendarPlus, Link2, Loader2, Mail, MessageSquare, NotebookPen, Share2, Smartphone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import {
  analyticsApi,
  authApi,
  dailyTarotApi,
  readingApi,
  setAccessToken,
  type DailyReminderCapability,
  type DailyTarotEntry,
} from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { createGoogleCalendarDailyReturnUrl, downloadDailyReturnCalendar } from "@/lib/client-calendar-reminder"
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
const quickActionTextClass = "min-w-0 text-center leading-tight"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

type DailyReturnCommitment = {
  target_date: string
  source_entry_date: string
  focus: string
  note: string
  created_at: string
}

type PendingDailyReminderPreference = {
  email: string
  time: string
  timezone: string
  saved_at: string
}

type DailyFocusId = "love" | "career" | "yes_no" | "mood" | "action"

type DailyFocusPreset = {
  id: DailyFocusId
  label: string
  title: string
  body: string
  question: string
  returnFocus: string
  analyticsKeyword: string
}

const dailyFocusAliases: Record<string, DailyFocusId> = {
  love: "love",
  relationship: "love",
  "daily-love-tarot": "love",
  career: "career",
  work: "career",
  job: "career",
  "daily-career-tarot": "career",
  yes: "yes_no",
  no: "yes_no",
  "yes-no": "yes_no",
  yes_no: "yes_no",
  "daily-yes-or-no-tarot": "yes_no",
  mood: "mood",
  emotion: "mood",
  "daily-mood-tarot": "mood",
  action: "action",
  next_step: "action",
  "daily-action-tarot": "action",
}

function normalizeDailyFocus(value: string | null) {
  const key = (value || "").trim().toLowerCase().replace(/\s+/g, "-")
  return dailyFocusAliases[key] || null
}

function getDailyFocusPresets(language: string): Record<DailyFocusId, DailyFocusPreset> {
  const localized =
    {
      zh: {
        love: {
          label: "爱情",
          title: "今天先看感情主题",
          body: "这张每日牌会先放进关系、暧昧、复合或沟通的语境里读，再留下一个明天可回看的线索。",
          question: "今天我在感情里最需要看见什么？",
          returnFocus: "今天的感情主题是否还在重复",
        },
        career: {
          label: "事业",
          title: "今天先看工作主题",
          body: "把每日牌当作一个工作信号：哪里需要准备，哪里该减压，今天最现实的一步是什么。",
          question: "今天我在事业和工作上应该关注什么？",
          returnFocus: "今天的事业信号是否延续到明天",
        },
        yes_no: {
          label: "是/否",
          title: "今天先看一个选择",
          body: "适合一个当天的小决定：不是绝对预测，而是看这一步现在更像 yes、no 还是 not yet。",
          question: "今天这一步对我来说合适吗？",
          returnFocus: "今天这个选择是否仍然成立",
        },
        mood: {
          label: "情绪",
          title: "今天先看情绪模式",
          body: "把每日牌用来识别今天最容易重复的情绪、触发点，以及让你稳定下来的做法。",
          question: "今天我的情绪模式是什么，我该如何照顾自己？",
          returnFocus: "今天的情绪模式是否重复出现",
        },
        action: {
          label: "行动",
          title: "今天先看一个行动",
          body: "把象征变成一个可执行的小动作，避免每日牌只停留在感觉上。",
          question: "今天我能采取的最踏实行动是什么？",
          returnFocus: "今天的行动是否已经发生",
        },
      },
      ja: {
        love: {
          label: "恋愛",
          title: "今日は恋愛テーマで読む",
          body: "今日のカードを関係、片思い、復縁、対話の文脈で読み、明日見返せる手がかりを残します。",
          question: "今日、恋愛で何に気づく必要がありますか？",
          returnFocus: "今日の恋愛テーマが明日も続いているか",
        },
        career: {
          label: "仕事",
          title: "今日は仕事テーマで読む",
          body: "今日のカードを仕事のサインとして読み、準備、負荷、現実的な一歩を見ます。",
          question: "今日、仕事で何に集中すべきですか？",
          returnFocus: "今日の仕事のサインが明日も続くか",
        },
        yes_no: {
          label: "Yes/No",
          title: "今日は一つの選択を見る",
          body: "小さな日々の判断に使えます。絶対の予言ではなく、今は yes、no、not yet のどれに近いかを見ます。",
          question: "今日、この一歩は私に合っていますか？",
          returnFocus: "今日の選択がまだ有効か",
        },
        mood: {
          label: "気分",
          title: "今日は感情パターンを見る",
          body: "今日繰り返しやすい感情、きっかけ、落ち着くための小さな方法を読みます。",
          question: "今日の感情パターンは何で、どう整えればいいですか？",
          returnFocus: "今日の感情パターンが繰り返すか",
        },
        action: {
          label: "行動",
          title: "今日は一つの行動を見る",
          body: "カードの象徴を、今日できる現実的な一歩に変えます。",
          question: "今日、私が取れる一番現実的な行動は何ですか？",
          returnFocus: "今日の行動を実行できたか",
        },
      },
      ko: {
        love: {
          label: "사랑",
          title: "오늘은 사랑 주제로 보기",
          body: "오늘의 카드를 관계, 썸, 재회, 대화의 맥락에서 읽고 내일 다시 볼 단서를 남깁니다.",
          question: "오늘 사랑에서 내가 알아차려야 할 것은 무엇인가요?",
          returnFocus: "오늘의 사랑 주제가 내일도 반복되는지",
        },
        career: {
          label: "커리어",
          title: "오늘은 일 주제로 보기",
          body: "오늘의 카드를 업무 신호로 읽어 준비할 것, 줄일 압박, 현실적인 한 걸음을 봅니다.",
          question: "오늘 일과 커리어에서 무엇에 집중해야 하나요?",
          returnFocus: "오늘의 커리어 신호가 내일도 이어지는지",
        },
        yes_no: {
          label: "예/아니오",
          title: "오늘은 하나의 선택 보기",
          body: "작은 하루 결정에 사용하세요. 절대 예측이 아니라 지금 yes, no, not yet 중 어디에 가까운지 봅니다.",
          question: "오늘 이 행동은 나에게 맞는 선택인가요?",
          returnFocus: "오늘의 선택이 아직 유효한지",
        },
        mood: {
          label: "기분",
          title: "오늘은 감정 패턴 보기",
          body: "오늘 반복되기 쉬운 감정, 트리거, 나를 안정시키는 방법을 읽습니다.",
          question: "오늘 나의 감정 패턴은 무엇이고 어떻게 돌봐야 하나요?",
          returnFocus: "오늘의 감정 패턴이 반복되는지",
        },
        action: {
          label: "행동",
          title: "오늘은 하나의 행동 보기",
          body: "카드의 상징을 오늘 할 수 있는 현실적인 한 걸음으로 바꿉니다.",
          question: "오늘 내가 할 수 있는 가장 현실적인 행동은 무엇인가요?",
          returnFocus: "오늘의 행동을 실제로 했는지",
        },
      },
      en: {
        love: {
          label: "Love",
          title: "Read today's card through love",
          body: "Use one daily card for relationship energy, attraction, reconciliation anxiety, communication, or the next gentle step.",
          question: "What should I understand about love today?",
          returnFocus: "Whether today's love theme is repeating",
        },
        career: {
          label: "Career",
          title: "Read today's card through career",
          body: "Turn one daily card into a work signal: what to prepare, where to reduce pressure, and what practical move helps today.",
          question: "What should I focus on in my career today?",
          returnFocus: "Whether today's career signal continues tomorrow",
        },
        yes_no: {
          label: "Yes or no",
          title: "Read today's card for one choice",
          body: "Use this for one small daily decision. The card points to yes, no, or not yet with a reason, not a fixed prediction.",
          question: "Is this the right move for me today?",
          returnFocus: "Whether today's choice still feels right",
        },
        mood: {
          label: "Mood",
          title: "Read today's card through mood",
          body: "Use the card to notice the emotional pattern, trigger, or support that would help you stay clear today.",
          question: "What is my emotional pattern today, and what would help?",
          returnFocus: "Whether today's mood pattern repeats",
        },
        action: {
          label: "Action",
          title: "Read today's card as an action cue",
          body: "Turn the symbol into one grounded move you can actually do today.",
          question: "What is the most grounded action I can take today?",
          returnFocus: "Whether today's action happened",
        },
      },
    }[language] || {}

  const english = {
    love: {
      label: "Love",
      title: "Read today's card through love",
      body: "Use one daily card for relationship energy, attraction, reconciliation anxiety, communication, or the next gentle step.",
      question: "What should I understand about love today?",
      returnFocus: "Whether today's love theme is repeating",
    },
    career: {
      label: "Career",
      title: "Read today's card through career",
      body: "Turn one daily card into a work signal: what to prepare, where to reduce pressure, and what practical move helps today.",
      question: "What should I focus on in my career today?",
      returnFocus: "Whether today's career signal continues tomorrow",
    },
    yes_no: {
      label: "Yes or no",
      title: "Read today's card for one choice",
      body: "Use this for one small daily decision. The card points to yes, no, or not yet with a reason, not a fixed prediction.",
      question: "Is this the right move for me today?",
      returnFocus: "Whether today's choice still feels right",
    },
    mood: {
      label: "Mood",
      title: "Read today's card through mood",
      body: "Use the card to notice the emotional pattern, trigger, or support that would help you stay clear today.",
      question: "What is my emotional pattern today, and what would help?",
      returnFocus: "Whether today's mood pattern repeats",
    },
    action: {
      label: "Action",
      title: "Read today's card as an action cue",
      body: "Turn the symbol into one grounded move you can actually do today.",
      question: "What is the most grounded action I can take today?",
      returnFocus: "Whether today's action happened",
    },
  } satisfies Record<DailyFocusId, Omit<DailyFocusPreset, "id" | "analyticsKeyword">>

  return (Object.keys(english) as DailyFocusId[]).reduce((result, id) => {
    const copy = localized[id] || english[id]
    result[id] = {
      id,
      ...copy,
      analyticsKeyword: `daily tarot ${id.replace("_", " ")}`,
    }
    return result
  }, {} as Record<DailyFocusId, DailyFocusPreset>)
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

function localDailyKey(dateKey: string) {
  return `poptarot_daily_${dateKey}`
}

function localReturnCommitmentKey(dateKey: string) {
  return `poptarot_daily_return_${dateKey}`
}

function pendingReminderPreferenceKey() {
  return "poptarot_daily_pending_reminder"
}

function normalizeReminderTime(value: string) {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(value) ? value : "08:30"
}

function readPendingReminderPreference(): PendingDailyReminderPreference | null {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(pendingReminderPreferenceKey())
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<PendingDailyReminderPreference>
    const email = normalizeReminderEmail(parsed.email || "")
    return {
      email: isValidReminderEmail(email) ? email : "",
      time: normalizeReminderTime(parsed.time || "08:30"),
      timezone: parsed.timezone || getTimezone(),
      saved_at: parsed.saved_at || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function savePendingReminderPreference(input: { email: string; time: string }) {
  if (typeof window === "undefined") return
  const preference: PendingDailyReminderPreference = {
    email: normalizeReminderEmail(input.email),
    time: normalizeReminderTime(input.time),
    timezone: getTimezone(),
    saved_at: new Date().toISOString(),
  }
  localStorage.setItem(pendingReminderPreferenceKey(), JSON.stringify(preference))
}

function getPreviousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return getLocalDateKey(date)
}

function getNextDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + 1)
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

function readReturnCommitment(dateKey: string): DailyReturnCommitment | null {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(localReturnCommitmentKey(dateKey))
  if (!value) return null
  try {
    return JSON.parse(value) as DailyReturnCommitment
  } catch {
    return null
  }
}

function cleanReturnFocus(value: string | null) {
  return (value || "").trim().slice(0, 80)
}

function cardFromEntry(entry: DailyTarotEntry): DrawnCard | null {
  const savedCard = getCardById(entry.card_id)
  if (!savedCard) return null
  return {
    ...savedCard,
    isReversed: Boolean(entry.is_reversed),
  }
}

function entryTheme(cardId: number, language: string) {
  const themes =
    {
      zh: {
        major: "人生主题",
        wands: "行动与事业",
        cups: "情感与关系",
        pentacles: "金钱与稳定",
        swords: "思考与沟通",
      },
      ja: {
        major: "人生テーマ",
        wands: "行動と仕事",
        cups: "感情と関係",
        pentacles: "お金と安定",
        swords: "思考と対話",
      },
      ko: {
        major: "삶의 주제",
        wands: "행동과 일",
        cups: "감정과 관계",
        pentacles: "돈과 안정",
        swords: "생각과 소통",
      },
      en: {
        major: "Life themes",
        wands: "Action and career",
        cups: "Emotion and relationships",
        pentacles: "Money and stability",
        swords: "Thought and communication",
      },
    }[language] || {
      major: "Life themes",
      wands: "Action and career",
      cups: "Emotion and relationships",
      pentacles: "Money and stability",
      swords: "Thought and communication",
    }

  if (cardId <= 21) return themes.major
  if (cardId <= 35) return themes.wands
  if (cardId <= 49) return themes.cups
  if (cardId <= 63) return themes.pentacles
  return themes.swords
}

function mostCommonTheme(entries: DailyTarotEntry[], language: string) {
  const counts = new Map<string, number>()
  for (const item of entries) {
    const theme = entryTheme(item.card_id, language)
    counts.set(theme, (counts.get(theme) || 0) + 1)
  }

  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || entryTheme(0, language)
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
  const dailyFocusPresets = useMemo(() => getDailyFocusPresets(language), [language])
  const quickActionCopy = useMemo(
    () => ({
      draw: copy.draw === "Draw Today's Card" ? "Draw Card" : copy.draw,
      calendar: copy.calendarReminder === "Add Calendar Reminder" ? "Add Calendar" : copy.calendarReminder,
    }),
    [copy.calendarReminder, copy.draw],
  )
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
  const [dailyFocusId, setDailyFocusId] = useState<DailyFocusId | null>(null)
  const [emailDeliveryEnabled, setEmailDeliveryEnabled] = useState(false)
  const [reminderCapability, setReminderCapability] = useState<DailyReminderCapability | null>(null)
  const [streak, setStreak] = useState(0)
  const [shareUrl, setShareUrl] = useState("")
  const [shareStatus, setShareStatus] = useState("")
  const [calendarStatus, setCalendarStatus] = useState("")
  const [reminderStatus, setReminderStatus] = useState("")
  const [returnFocus, setReturnFocus] = useState("")
  const [returnNote, setReturnNote] = useState("")
  const [todayReturnCommitment, setTodayReturnCommitment] = useState<DailyReturnCommitment | null>(null)
  const [tomorrowReturnCommitment, setTomorrowReturnCommitment] = useState<DailyReturnCommitment | null>(null)
  const [returnCommitmentStatus, setReturnCommitmentStatus] = useState("")
  const [returnLinkStatus, setReturnLinkStatus] = useState("")
  const [installStatus, setInstallStatus] = useState("")
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState("")
  const activeDailyFocus = dailyFocusId ? dailyFocusPresets[dailyFocusId] : null
  const activeDailyQuestion = activeDailyFocus?.question || dailyTarotQuestion
  const dailyAnalyticsKeyword = activeDailyFocus?.analyticsKeyword || "daily tarot"

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
        fallbackGenerated: "已生成可分享文案；登录后可创建公开结果页。",
        fallbackCopied: "分享文案已复制；登录后可创建公开结果页。",
        xhs: "复制小红书文案",
        instagram: "复制 Instagram 文案",
        feedback: "提交反馈",
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
        fallbackGenerated: "Share caption ready. Log in to create a public Daily Tarot page.",
        fallbackCopied: "Share caption copied. Log in to create a public Daily Tarot page.",
        xhs: "Copy Xiaohongshu",
        instagram: "Copy Instagram",
        feedback: "Leave feedback",
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
        fallbackGenerated: "共有テキストを用意しました。ログインすると公開 Daily Tarot ページを作成できます。",
        fallbackCopied: "共有テキストをコピーしました。ログインすると公開 Daily Tarot ページを作成できます。",
        xhs: "小紅書テキストをコピー",
        instagram: "Instagramをコピー",
        feedback: "感想を送る",
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
        fallbackGenerated: "공유 문구가 준비되었습니다. 로그인하면 공개 Daily Tarot 페이지를 만들 수 있습니다.",
        fallbackCopied: "공유 문구를 복사했습니다. 로그인하면 공개 Daily Tarot 페이지를 만들 수 있습니다.",
        xhs: "샤오홍슈 문구 복사",
        instagram: "Instagram 복사",
        feedback: "피드백 남기기",
        templateCopied: "공유 문구 복사됨",
      },
    }[language]

  const returnCopy =
    {
      zh: {
        eyebrow: "明日回访",
        title: "给明天留一个回来的理由",
        body: "保存一个轻量主题，明天打开 Daily Tarot 时先看它，再抽新的牌。",
        todayLabel: "今天从上次带来的主题",
        tomorrowLabel: "明天的主题",
        noteLabel: "给明天的自己",
        notePlaceholder: "例如：观察我是否还在同一个情绪里，或者我是否采取了一个小行动。",
        saved: "明日回访主题已保存",
        save: "保存明日主题",
        copyLink: "复制回访链接",
        mailLink: "发到邮箱草稿",
        linkCopied: "回访链接已复制",
        mailOpened: "已打开邮件草稿",
        linkLabel: "你的 Daily Tarot 回访链接",
        quickAction: "明日主题",
        savedPrefix: "已保存",
        defaultFocus: "今日牌的下一步",
        linkedEyebrow: "已带入的问题",
        linkedTitle: "今天先看这个主题是否还在重复",
        linkedBody: "这是从上一次问题或分享链接带来的回访线索。先抽今日牌，再决定是否把它保存成明天的主题。",
        linkedAction: "编辑明日主题",
        chips: ["爱情", "事业", "情绪", "行动", "边界"],
      },
      ja: {
        eyebrow: "明日の再訪",
        title: "明日戻る理由をひとつ残す",
        body: "軽いテーマを保存して、明日 Daily Tarot を開いたときに新しいカードの前に確認できます。",
        todayLabel: "前回から持ち越した今日のテーマ",
        tomorrowLabel: "明日のテーマ",
        noteLabel: "明日の自分へ",
        notePlaceholder: "例: 同じ感情が続いているか、小さな行動を取れたかを見る。",
        saved: "明日のテーマを保存しました",
        save: "明日のテーマを保存",
        copyLink: "再訪リンクをコピー",
        mailLink: "メール下書きへ",
        linkCopied: "再訪リンクをコピーしました",
        mailOpened: "メール下書きを開きました",
        linkLabel: "Daily Tarot 再訪リンク",
        quickAction: "明日のテーマ",
        savedPrefix: "保存済み",
        defaultFocus: "今日のカードの次の一歩",
        linkedEyebrow: "引き継いだ質問",
        linkedTitle: "今日はこのテーマがまだ続いているかを見る",
        linkedBody: "前回の質問や共有リンクから持ち越した再訪の手がかりです。今日のカードを引いてから、明日のテーマとして保存するか決められます。",
        linkedAction: "明日のテーマを編集",
        chips: ["恋愛", "仕事", "感情", "行動", "境界線"],
      },
      ko: {
        eyebrow: "내일 다시 보기",
        title: "내일 돌아올 이유를 하나 남기세요",
        body: "가벼운 주제를 저장해 두면 내일 Daily Tarot을 열 때 새 카드 전에 먼저 확인할 수 있습니다.",
        todayLabel: "지난번에 남긴 오늘의 주제",
        tomorrowLabel: "내일의 주제",
        noteLabel: "내일의 나에게",
        notePlaceholder: "예: 같은 감정이 반복되는지, 작은 행동을 했는지 확인하기.",
        saved: "내일 다시 볼 주제가 저장되었습니다",
        save: "내일 주제 저장",
        copyLink: "다시 보기 링크 복사",
        mailLink: "이메일 초안 열기",
        linkCopied: "다시 보기 링크가 복사되었습니다",
        mailOpened: "이메일 초안을 열었습니다",
        linkLabel: "Daily Tarot 다시 보기 링크",
        quickAction: "내일 주제",
        savedPrefix: "저장됨",
        defaultFocus: "오늘 카드의 다음 단계",
        linkedEyebrow: "가져온 질문",
        linkedTitle: "오늘은 이 주제가 아직 반복되는지 확인하세요",
        linkedBody: "지난 질문이나 공유 링크에서 이어진 재방문 단서입니다. 오늘의 카드를 뽑은 뒤 내일 주제로 저장할지 정할 수 있습니다.",
        linkedAction: "내일 주제 편집",
        chips: ["사랑", "커리어", "감정", "행동", "경계"],
      },
      en: {
        eyebrow: "Tomorrow return",
        title: "Leave one reason to come back tomorrow",
        body: "Save a light focus so tomorrow starts with continuity before you draw a new card.",
        todayLabel: "Focus carried into today",
        tomorrowLabel: "Tomorrow's focus",
        noteLabel: "Note to future you",
        notePlaceholder: "For example: notice whether the same feeling returns, or whether I took one small action.",
        saved: "Tomorrow's return cue is saved",
        save: "Save Tomorrow Cue",
        copyLink: "Copy return link",
        mailLink: "Email it to me",
        linkCopied: "Return link copied",
        mailOpened: "Email draft opened",
        linkLabel: "Your Daily Tarot return link",
        quickAction: "Tomorrow Cue",
        savedPrefix: "Saved",
        defaultFocus: "Next step from today's card",
        linkedEyebrow: "Carried-in question",
        linkedTitle: "Start by checking whether this theme is still repeating",
        linkedBody: "This return cue came from a previous question or shared link. Draw today's card first, then decide whether to save it as tomorrow's focus.",
        linkedAction: "Edit tomorrow cue",
        chips: ["Love", "Career", "Mood", "Action", "Boundaries"],
      },
    }[language]

  const directReturnCopy =
    {
      zh: {
        eyebrow: "Direct / Mail 回访",
        title: "邮件发送接通前，先把回访入口发给自己",
        body: "复制明日链接、打开邮箱草稿或添加日历提醒，明天不用重新搜索也能回到 Daily Tarot。",
      },
      ja: {
        eyebrow: "Direct / Mail 再訪",
        title: "メール送信の前に、自分用の再訪入口を残す",
        body: "明日のリンクをコピー、メール下書きを開く、またはカレンダー通知を追加すれば、検索し直さず Daily Tarot に戻れます。",
      },
      ko: {
        eyebrow: "Direct / Mail 재방문",
        title: "이메일 발송 전에도 나에게 돌아올 경로를 남기세요",
        body: "내일 링크를 복사하거나 이메일 초안을 열고, 캘린더 알림을 추가하면 다시 검색하지 않고 Daily Tarot으로 돌아올 수 있습니다.",
      },
      en: {
        eyebrow: "Direct / Mail return",
        title: "Send yourself a return path before scheduled email is live",
        body: "Copy tomorrow's link, open an email draft, or add a calendar reminder so the next Daily Tarot visit starts directly instead of from search.",
      },
    }[language]

  const patternCopy =
    {
      zh: {
        eyebrow: "7 日模式",
        title: "把每日一牌变成可回看的线索",
        emptyBody: "连续抽几天后，这里会显示最近主题、日记数量和连续打卡，让每日塔罗不只是一次性解读。",
        activeBody: "最近的每日牌更偏向「{theme}」。把它当作轻量复盘：看看相同主题是否也出现在情绪、行动或关系里。",
        days: "记录天数",
        journals: "日记数",
        theme: "主要主题",
        completion: "完成率",
        missed: "缺失天数",
        noteRate: "日记率",
        upright: "正位",
        reversed: "逆位",
        timeline: "最近 7 天轨迹",
        journalSignal: "日记完成",
        emptyDay: "未记录",
        nextActionLabel: "下一步复访动作",
        nextActionDraw: "先抽今天的牌，让 7 日轨迹有新的锚点。",
        nextActionJournal: "给最近一次记录补一句日记，明天回看时才有对照。",
        nextActionReturn: "保存明日主题，让下一次打开 Daily Tarot 有连续线索。",
        nextActionReview: "你的复访路径已经建立，可以免费解读最近 7 日模式。",
        drawAction: "抽今日牌",
        journalAction: "写一句日记",
        returnAction: "保存明日主题",
        reviewAction: "解读 7 日模式",
        askPattern: "免费解读这个模式",
        patternQuestion: "我最近的每日塔罗更偏向「{theme}」，这说明什么？我下一步该怎么做？",
        report: "查看月度报告",
      },
      ja: {
        eyebrow: "7日パターン",
        title: "毎日の一枚を振り返れる手がかりに",
        emptyBody: "数日続けると、最近のテーマ、日記数、連続記録がここに表示されます。",
        activeBody: "最近のカードは「{theme}」に寄っています。同じテーマが感情、行動、関係にも出ているか振り返れます。",
        days: "記録日数",
        journals: "日記数",
        theme: "主なテーマ",
        completion: "完了率",
        missed: "空いた日",
        noteRate: "日記率",
        upright: "正位置",
        reversed: "逆位置",
        timeline: "最近7日",
        journalSignal: "日記あり",
        emptyDay: "未記録",
        nextActionLabel: "次の再訪アクション",
        nextActionDraw: "まず今日のカードを引き、7日パターンに新しい軸を作りましょう。",
        nextActionJournal: "直近の記録に一文だけ日記を足すと、明日見返しやすくなります。",
        nextActionReturn: "明日のテーマを保存し、次回の Daily Tarot に連続性を残しましょう。",
        nextActionReview: "再訪の流れができています。最近7日のパターンを無料で読めます。",
        drawAction: "今日のカード",
        journalAction: "一文を書く",
        returnAction: "明日のテーマ",
        reviewAction: "7日パターンを読む",
        askPattern: "このパターンを無料で読む",
        patternQuestion: "最近の Daily Tarot は「{theme}」に寄っています。これは何を示し、次に何をすればいいですか？",
        report: "月間レポート",
      },
      ko: {
        eyebrow: "7일 패턴",
        title: "하루 한 장을 다시 볼 수 있는 단서로",
        emptyBody: "며칠간 기록하면 최근 주제, 저널 수, 연속 기록이 여기에 표시됩니다.",
        activeBody: "최근 카드는 「{theme}」 쪽으로 기울어 있습니다. 감정, 행동, 관계에서도 같은 주제가 반복되는지 살펴보세요.",
        days: "기록 일수",
        journals: "저널 수",
        theme: "주요 주제",
        completion: "완성률",
        missed: "빠진 날",
        noteRate: "저널률",
        upright: "정방향",
        reversed: "역방향",
        timeline: "최근 7일",
        journalSignal: "저널 기록",
        emptyDay: "미기록",
        nextActionLabel: "다음 재방문 행동",
        nextActionDraw: "먼저 오늘의 카드를 뽑아 7일 흐름에 새 기준점을 만드세요.",
        nextActionJournal: "최근 기록에 한 문장만 더하면 내일 다시 볼 때 비교가 쉬워집니다.",
        nextActionReturn: "내일 주제를 저장해 다음 Daily Tarot 방문이 이어지게 하세요.",
        nextActionReview: "재방문 흐름이 준비되었습니다. 최근 7일 패턴을 무료로 해석해 보세요.",
        drawAction: "오늘 카드 뽑기",
        journalAction: "한 문장 쓰기",
        returnAction: "내일 주제 저장",
        reviewAction: "7일 패턴 보기",
        askPattern: "이 패턴 무료로 보기",
        patternQuestion: "최근 Daily Tarot 카드가 「{theme}」 쪽으로 기울어 있습니다. 이것은 무엇을 뜻하고 다음 행동은 무엇인가요?",
        report: "월간 리포트",
      },
      en: {
        eyebrow: "7-day pattern",
        title: "Turn one daily card into a pattern you can revisit",
        emptyBody: "After a few daily cards, this review will show your recent theme, journal count, and streak so Daily Tarot becomes more than a one-time reading.",
        activeBody: "Your recent cards lean toward {theme}. Use this as a light review: check whether the same theme is showing up in your mood, actions, or relationships.",
        days: "Tracked days",
        journals: "Journal notes",
        theme: "Main theme",
        completion: "Completion",
        missed: "Missed days",
        noteRate: "Note rate",
        upright: "Upright",
        reversed: "Reversed",
        timeline: "Recent 7-day trail",
        journalSignal: "Journal signal",
        emptyDay: "Not drawn",
        nextActionLabel: "Next return action",
        nextActionDraw: "Draw today's card first so the 7-day trail has a fresh anchor.",
        nextActionJournal: "Add one sentence to your latest record so tomorrow has something real to compare.",
        nextActionReturn: "Save tomorrow's focus so the next Daily Tarot visit starts with continuity.",
        nextActionReview: "Your return path is ready. Ask a free reading about the recent 7-day pattern.",
        drawAction: "Draw today's card",
        journalAction: "Write one note",
        returnAction: "Save tomorrow cue",
        reviewAction: "Read 7-day pattern",
        askPattern: "Ask about this pattern",
        patternQuestion: "My recent Daily Tarot cards lean toward {theme}. What does this pattern mean, and what should I do next?",
        report: "View monthly report",
      },
    }[language] || {
      eyebrow: "7-day pattern",
      title: "Turn one daily card into a pattern you can revisit",
      emptyBody: "After a few daily cards, this review will show your recent theme, journal count, and streak so Daily Tarot becomes more than a one-time reading.",
      activeBody: "Your recent cards lean toward {theme}. Use this as a light review: check whether the same theme is showing up in your mood, actions, or relationships.",
      days: "Tracked days",
      journals: "Journal notes",
      theme: "Main theme",
      completion: "Completion",
      missed: "Missed days",
      noteRate: "Note rate",
      upright: "Upright",
      reversed: "Reversed",
      timeline: "Recent 7-day trail",
      journalSignal: "Journal signal",
      emptyDay: "Not drawn",
      nextActionLabel: "Next return action",
      nextActionDraw: "Draw today's card first so the 7-day trail has a fresh anchor.",
      nextActionJournal: "Add one sentence to your latest record so tomorrow has something real to compare.",
      nextActionReturn: "Save tomorrow's focus so the next Daily Tarot visit starts with continuity.",
      nextActionReview: "Your return path is ready. Ask a free reading about the recent 7-day pattern.",
      drawAction: "Draw today's card",
      journalAction: "Write one note",
      returnAction: "Save tomorrow cue",
      reviewAction: "Read 7-day pattern",
      askPattern: "Ask about this pattern",
      patternQuestion: "My recent Daily Tarot cards lean toward {theme}. What does this pattern mean, and what should I do next?",
      report: "View monthly report",
    }

  const habitSnapshotCopy =
    {
      zh: {
        eyebrow: "回访快照",
        title: "让今天留下明天能接上的线索",
        body: "先看连续天数、日记数量和主要主题，再决定是否需要更深入的功能。",
        pattern: "解读这个模式",
        returnCue: "设置明日主题",
      },
      ja: {
        eyebrow: "再訪スナップショット",
        title: "今日の記録を明日につなげる",
        body: "連続記録、日記数、主なテーマを見てから、必要なときだけ深い機能へ進めます。",
        pattern: "このパターンを読む",
        returnCue: "明日のテーマ",
      },
      ko: {
        eyebrow: "재방문 스냅샷",
        title: "오늘의 흔적이 내일의 시작이 되게",
        body: "연속 기록, 저널 수, 주요 주제를 먼저 보고 필요할 때만 더 깊은 기능으로 이동하세요.",
        pattern: "패턴 읽기",
        returnCue: "내일 주제",
      },
      en: {
        eyebrow: "Habit snapshot",
        title: "Let today's trace make tomorrow easier to continue",
        body: "Check streak, notes, and the main 7-day theme before deciding whether deeper features are useful.",
        pattern: "Ask about this pattern",
        returnCue: "Set tomorrow cue",
      },
    }[language] || {
      eyebrow: "Habit snapshot",
      title: "Let today's trace make tomorrow easier to continue",
      body: "Check streak, notes, and the main 7-day theme before deciding whether deeper features are useful.",
      pattern: "Ask about this pattern",
      returnCue: "Set tomorrow cue",
    }

  useEffect(() => {
    const today = getLocalDateKey()
    const searchParams = new URLSearchParams(window.location.search)
    const requestedFocus = normalizeDailyFocus(
      searchParams.get("daily_focus") || searchParams.get("daily_theme") || searchParams.get("focus"),
    )
    const requestedFocusPreset = requestedFocus ? getDailyFocusPresets(language)[requestedFocus] : null
    setDateKey(today)
    setDailyFocusId(requestedFocus)
    const seededCard = getDailyCard(today, getSeed())
    setCard(seededCard)
    setRecentEntries(readRecentLocalEntries(today))
    const carriedCommitment = readReturnCommitment(today)
    const linkedFocus = cleanReturnFocus(searchParams.get("return_focus"))
    const effectiveLinkedFocus = linkedFocus || requestedFocusPreset?.returnFocus || ""
    const linkedCommitment =
      !carriedCommitment && effectiveLinkedFocus
        ? {
            target_date: today,
            source_entry_date: today,
            focus: effectiveLinkedFocus,
            note: "",
            created_at: new Date().toISOString(),
          }
        : null
    if (linkedCommitment) {
      localStorage.setItem(localReturnCommitmentKey(today), JSON.stringify(linkedCommitment))
    }
    setTodayReturnCommitment(carriedCommitment || linkedCommitment)

    const tomorrowCommitment = readReturnCommitment(getNextDateKey(today))
    setTomorrowReturnCommitment(tomorrowCommitment)
    if (tomorrowCommitment) {
      setReturnFocus(tomorrowCommitment.focus)
      setReturnNote(tomorrowCommitment.note)
    } else if (effectiveLinkedFocus) {
      setReturnFocus(effectiveLinkedFocus)
    }

    const pendingReminderPreference = readPendingReminderPreference()
    let localReminderEmail = ""
    let localReminderTime = "08:30"
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
        localReminderEmail = parsed.reminder_email || ""
        localReminderTime = parsed.reminder_time || "08:30"
        setReminderEmail(localReminderEmail)
        setReminderTime(localReminderTime)
        setReminderEnabled(parsed.reminder_enabled)
        setStreak(parsed.streak_count || 1)
      } catch {
        // Ignore corrupt local cache.
      }
    }

    if (pendingReminderPreference && !localReminderEmail) {
      setReminderEmail(pendingReminderPreference.email)
      setReminderTime(pendingReminderPreference.time || localReminderTime)
    }
  }, [])

  useEffect(() => {
    dailyTarotApi
      .getReminderCapability()
      .then((data) => {
        setReminderCapability(data)
        setEmailDeliveryEnabled(Boolean(data.can_send_email_reminders ?? data.scheduled_delivery_enabled ?? data.email_delivery_enabled))
      })
      .catch(() => {
        setReminderCapability(null)
        setEmailDeliveryEnabled(false)
      })
  }, [])

  useEffect(() => {
    if (!emailDeliveryEnabled) setReminderEnabled(false)
  }, [emailDeliveryEnabled])

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
        if (Array.isArray(data.recent_entries)) {
          setRecentEntries(data.recent_entries.length > 0 ? data.recent_entries : readRecentLocalEntries(dateKey))
        }
        if (!data.entry) return
        const savedCard = cardFromEntry(data.entry)
        if (savedCard) setCard(savedCard)
        setEntry(data.entry)
        setInterpretation(data.entry.interpretation || "")
        setJournal(data.entry.journal || "")
        setMood(data.entry.mood || "")
        const pendingReminderPreference = readPendingReminderPreference()
        const hasCloudReminderEmail = Boolean(data.entry.reminder_email)
        setReminderEmail(data.entry.reminder_email || pendingReminderPreference?.email || "")
        setReminderTime(
          hasCloudReminderEmail
            ? data.entry.reminder_time || "08:30"
            : pendingReminderPreference?.time || data.entry.reminder_time || "08:30",
        )
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
    const nextReminderEmail = Object.prototype.hasOwnProperty.call(input, "reminderEmail")
      ? input.reminderEmail
      : existing?.reminder_email ?? reminderEmail
    const requestedReminderEnabled = input.reminderEnabled ?? existing?.reminder_enabled ?? reminderEnabled
    const nextReminderEnabled = emailDeliveryEnabled ? requestedReminderEnabled : false

    return {
      ...existing,
      entry_date: dateKey,
      card_id: card.id,
      card_name: card.nameEn,
      is_reversed: card.isReversed,
      question: activeDailyQuestion,
      interpretation: input.interpretation ?? existing?.interpretation ?? interpretation,
      journal: input.journal ?? existing?.journal ?? journal,
      mood: input.mood ?? existing?.mood ?? mood,
      streak_count: nextStreak,
      reminder_enabled: nextReminderEnabled,
      reminder_email: nextReminderEnabled ? nextReminderEmail : null,
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
      if (Array.isArray(result.recent_entries)) {
        setRecentEntries(result.recent_entries.length > 0 ? result.recent_entries : readRecentLocalEntries(nextEntry.entry_date))
      }
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
        keyword: dailyAnalyticsKeyword,
        metadata: { surface: "daily-tarot", daily_focus: activeDailyFocus?.id || "general" },
      })

      let fullText = ""
      try {
        const response = await readingApi.interpret(activeDailyQuestion, [card], false, undefined, undefined, language, "one_card")
        if (!response.ok) throw new Error("Daily reading failed")
        fullText = await readStream(response, setInterpretation)
      } catch {
        fullText = createFallbackDailyInterpretation(card, language, activeDailyFocus?.returnFocus || activeDailyQuestion)
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
        keyword: dailyAnalyticsKeyword,
        metadata: { surface: "daily-tarot", card_id: card.id, daily_focus: activeDailyFocus?.id || "general" },
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
    if (!emailDeliveryEnabled) {
      if (normalizedEmail && !isValidReminderEmail(normalizedEmail)) {
        setStatus(copy.reminderEmailInvalid)
        setReminderStatus(copy.reminderEmailInvalid)
        return
      }

      setIsSaving(true)
      setReminderStatus("")
      try {
        savePendingReminderPreference({ email: normalizedEmail, time: reminderTime })
        setReminderEmail(normalizedEmail)
        setReminderEnabled(false)
        const localEntry = createLocalEntry({
          reminderEnabled: false,
          reminderEmail: null,
          reminderTime,
        })
        if (localEntry) saveLocalEntry(localEntry)
        setStatus(copy.reminderSavedPending)
        setReminderStatus(copy.reminderSavedPending)
        analyticsApi.track("daily_reminder_preference_saved", {
          ...getCurrentAttribution(),
          locale: language,
          keyword: "daily tarot",
          metadata: {
            surface: "daily-tarot",
            reminder_enabled: false,
            reminder_time: reminderTime,
            has_email: Boolean(normalizedEmail),
            pending_reminder_preference_saved: true,
            email_delivery_enabled: false,
            delivery_status: reminderCapability?.delivery_status || "setup_required",
            synced_to_cloud: false,
            missing_capabilities: reminderCapability?.missing_capabilities || [],
          },
        })
      } finally {
        setIsSaving(false)
      }
      return
    }

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
      const syncedToCloud = Boolean(syncedEntry)
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
      analyticsApi.track("daily_reminder_preference_saved", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: {
          surface: "daily-tarot",
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime,
          has_email: Boolean(reminderEnabled && normalizedEmail),
          email_delivery_enabled: emailDeliveryEnabled,
          delivery_status: reminderCapability?.delivery_status || (emailDeliveryEnabled ? "ready" : "setup_required"),
          synced_to_cloud: syncedToCloud,
          missing_capabilities: reminderCapability?.missing_capabilities || [],
        },
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadCalendarReminder = () => {
    downloadDailyReturnCalendar({
      time: reminderTime,
      summary: copy.calendarReminderSummary,
      description: copy.calendarReminderDescription,
      url: buildDailyReturnUrl("return_link"),
      filename: "poptarot-daily-tarot.ics",
    })
    setCalendarStatus(copy.calendarReminderSaved)
    analyticsApi.track("daily_calendar_reminder_downloaded", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        surface: "daily-tarot",
        reminder_time: reminderTime,
        email_delivery_enabled: emailDeliveryEnabled,
      },
    })
  }

  const handleOpenGoogleCalendarReminder = () => {
    const url = createGoogleCalendarDailyReturnUrl({
      time: reminderTime,
      summary: copy.calendarReminderSummary,
      description: copy.calendarReminderDescription,
      url: buildDailyReturnUrl("return_link"),
    })
    const opened = window.open(url, "_blank", "noopener,noreferrer")
    if (!opened) window.location.href = url
    setCalendarStatus(copy.googleCalendarOpened)
    analyticsApi.track("daily_calendar_reminder_downloaded", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        action: "daily_google_calendar_opened",
        provider: "google_calendar",
        surface: "daily-tarot",
        reminder_time: reminderTime,
        email_delivery_enabled: emailDeliveryEnabled,
      },
    })
  }

  const handleSaveReturnCommitment = () => {
    if (!dateKey) return
    const targetDate = getNextDateKey(dateKey)
    const nextCommitment: DailyReturnCommitment = {
      target_date: targetDate,
      source_entry_date: dateKey,
      focus: returnFocus.trim() || returnCopy.defaultFocus,
      note: returnNote.trim(),
      created_at: new Date().toISOString(),
    }
    localStorage.setItem(localReturnCommitmentKey(targetDate), JSON.stringify(nextCommitment))
    setTomorrowReturnCommitment(nextCommitment)
    setReturnFocus(nextCommitment.focus)
    setReturnNote(nextCommitment.note)
    setReturnCommitmentStatus(returnCopy.saved)
    setReturnLinkStatus("")
  }

  const buildDailyReturnPath = (medium: "return_link" | "email_self") => {
    const focus = cleanReturnFocus(tomorrowReturnCommitment?.focus || returnFocus || returnCopy.defaultFocus) || returnCopy.defaultFocus
    const params = new URLSearchParams({
      return_focus: focus,
      utm_source: "daily-tarot",
      utm_medium: medium,
      utm_campaign: "daily-return-cue",
    })
    if (activeDailyFocus) params.set("daily_focus", activeDailyFocus.id)

    return `/daily-tarot?${params.toString()}`
  }

  const buildDailyReturnUrl = (medium: "return_link" | "email_self") => {
    return `${window.location.origin}${buildDailyReturnPath(medium)}`
  }

  const handleCopyReturnLink = async () => {
    const url = buildDailyReturnUrl("return_link")
    await navigator.clipboard.writeText(url)
    setReturnLinkStatus(returnCopy.linkCopied)
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        action: "daily_return_link_copied",
        surface: "daily-tarot",
        focus: cleanReturnFocus(tomorrowReturnCommitment?.focus || returnFocus),
      },
    })
  }

  const handleEmailReturnLink = () => {
    const url = buildDailyReturnUrl("email_self")
    const subject = encodeURIComponent("POPTarot Daily Tarot")
    const body = encodeURIComponent(`${returnCopy.linkLabel}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setReturnLinkStatus(returnCopy.mailOpened)
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        action: "daily_return_email_opened",
        surface: "daily-tarot",
        focus: cleanReturnFocus(tomorrowReturnCommitment?.focus || returnFocus),
      },
    })
  }

  const scrollToReminder = () => {
    document.querySelector("[data-daily-reminder-form]")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const scrollToJournal = () => {
    document.querySelector("[data-daily-journal-form]")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const scrollToReturnCue = () => {
    const target = document.querySelector("[data-daily-return-commitment]") || document.querySelector("[data-daily-return-setup]")
    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  useEffect(() => {
    const action = new URLSearchParams(window.location.search).get("return_action")
    if (action !== "reminder" && action !== "return-cue") return

    const timeout = window.setTimeout(() => {
      if (action === "reminder") {
        const target = document.querySelector("[data-daily-return-setup]") || document.querySelector("[data-daily-reminder-form]")
        target?.scrollIntoView({ behavior: "smooth", block: "center" })
        return
      }

      scrollToReturnCue()
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [])

  const handleInstallPrompt = async () => {
    if (!installPrompt) {
      setInstallStatus(copy.installFallback)
      analyticsApi.track("daily_install_fallback_shown", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: {
          surface: "daily-tarot",
          reason: "beforeinstallprompt_unavailable",
        },
      })
      return
    }

    analyticsApi.track("daily_install_prompt_opened", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        surface: "daily-tarot",
      },
    })
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    if (choice.outcome === "accepted") {
      setShowInstallPrompt(false)
      setInstallStatus(copy.installInstalled)
      analyticsApi.track("daily_install_completed", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: {
          surface: "daily-tarot",
          platform: choice.platform,
        },
      })
      return
    }
    setInstallStatus(copy.installFallback)
    analyticsApi.track("daily_install_dismissed", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        surface: "daily-tarot",
        platform: choice.platform,
      },
    })
  }

  const ensureShareUrl = async () => {
    if (shareUrl) return shareUrl
    if (!card || !interpretation) throw new Error("No daily reading to share")

    const ready = await ensureUser()
    if (!ready) throw new Error("Unable to prepare sharing")
    const dailyPosition =
      {
        zh: "今日指引",
        en: "Daily Card",
        ja: "今日の指針",
        ko: "오늘의 안내",
      }[language] || "Daily Card"

    const result = await readingApi.createShare({
      question: activeDailyQuestion,
      cards: [{ ...card, position: dailyPosition }],
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
        daily_focus: activeDailyFocus?.id || "general",
      },
    })
    return absoluteUrl
  }

  const getDailyFallbackShareUrl = () => {
    const params = new URLSearchParams({
      utm_source: "share",
      utm_medium: "fallback_share",
      utm_campaign: "daily_tarot",
    })
    if (activeDailyFocus) params.set("daily_focus", activeDailyFocus.id)
    return `${window.location.origin}/daily-tarot?${params.toString()}`
  }

  const buildDailyShareCaption = (platform: ShareTemplatePlatform, url: string) => {
    if (!card) throw new Error("No daily card to share")
    return createShareTemplate({
      platform,
      locale: language,
      question: activeDailyQuestion,
      cards: [
        {
          name: localizedCardName(card),
          position:
            {
              zh: "今日指引",
              en: "Daily Card",
              ja: "今日の指針",
              ko: "오늘의 안내",
            }[language] || "Daily Card",
          isReversed: card.isReversed,
        },
      ],
      interpretation,
      url,
    })
  }

  const trackDailyFallbackShare = (platform: ShareTemplatePlatform, channel: "native" | "clipboard") => {
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: "daily tarot",
      metadata: {
        fallback: true,
        platform,
        channel,
        surface: "daily-tarot",
        daily_focus: activeDailyFocus?.id || "general",
      },
    })
  }

  const shareDailyFallbackCaption = async (platform: ShareTemplatePlatform, preferNativeShare: boolean) => {
    const fallbackUrl = getDailyFallbackShareUrl()
    const text = buildDailyShareCaption(platform, fallbackUrl)

    if (preferNativeShare && navigator.share) {
      await navigator.share({
        title: "POPTarot Daily Tarot",
        text,
        url: fallbackUrl,
      })
      trackDailyFallbackShare(platform, "native")
      setShareStatus(shareCopy.fallbackGenerated)
      return
    }

    await navigator.clipboard.writeText(text)
    trackDailyFallbackShare(platform, "clipboard")
    setShareStatus(shareCopy.fallbackCopied)
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
          text: activeDailyQuestion,
          url: absoluteUrl,
        })
        setShareStatus(shareCopy.generated)
      } else {
        await navigator.clipboard.writeText(absoluteUrl)
        setShareStatus(shareCopy.copied)
      }
    } catch {
      try {
        await shareDailyFallbackCaption("instagram", true)
      } catch {
        setShareStatus(shareCopy.failed)
      }
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
      const text = buildDailyShareCaption(platform, absoluteUrl)
      await navigator.clipboard.writeText(text)
      analyticsApi.track("share_template_copied", {
        ...getCurrentAttribution(),
        locale: language,
        keyword: "daily tarot",
        metadata: {
          platform,
          surface: "daily-tarot",
          daily_focus: activeDailyFocus?.id || "general",
        },
      })
      setShareStatus(shareCopy.templateCopied)
    } catch {
      try {
        await shareDailyFallbackCaption(platform, false)
      } catch {
        setShareStatus(shareCopy.failed)
      }
    } finally {
      setIsCreatingShare(false)
    }
  }

  const localizedCardName = useCallback(
    (item: DrawnCard) =>
      language === "zh" ? item.name : language === "ja" ? item.nameJa || item.nameEn : language === "ko" ? item.nameKo || item.nameEn : item.nameEn,
    [language],
  )

  const displayName = card ? localizedCardName(card) : ""
  const dailyPattern = useMemo(() => {
    const trackedDays = recentEntries.length
    const journalCount = recentEntries.filter((item) => Boolean(item.journal?.trim())).length
    const reversedCount = recentEntries.filter((item) => item.is_reversed).length
    const uprightCount = Math.max(0, trackedDays - reversedCount)
    const missedDays = Math.max(0, 7 - trackedDays)
    const completionRate = Math.round((trackedDays / 7) * 100)
    const noteRate = trackedDays > 0 ? Math.round((journalCount / trackedDays) * 100) : 0
    const dominantTheme = trackedDays > 0 ? mostCommonTheme(recentEntries, language) : mostCommonTheme([], language)
    const body = trackedDays > 0
      ? patternCopy.activeBody.replace("{theme}", dominantTheme)
      : patternCopy.emptyBody
    const nextAction = !entry
      ? { type: "draw", label: patternCopy.drawAction, body: patternCopy.nextActionDraw }
      : journalCount < trackedDays
        ? { type: "journal", label: patternCopy.journalAction, body: patternCopy.nextActionJournal }
        : !tomorrowReturnCommitment
          ? { type: "return", label: patternCopy.returnAction, body: patternCopy.nextActionReturn }
          : { type: "review", label: patternCopy.reviewAction, body: patternCopy.nextActionReview }
    const entryByDate = new Map(recentEntries.map((item) => [item.entry_date, item]))
    const timeline = (dateKey ? getRecentDateKeys(dateKey).reverse() : recentEntries.map((item) => item.entry_date).reverse()).map(
      (dayKey) => {
        const item = entryByDate.get(dayKey)
        const itemCard = item ? cardFromEntry(item) : null
        return {
          date: dayKey,
          label: dayKey.slice(5),
          cardName: itemCard ? localizedCardName(itemCard) : item?.card_name || patternCopy.emptyDay,
          hasEntry: Boolean(item),
          hasJournal: Boolean(item?.journal?.trim()),
          isReversed: Boolean(item?.is_reversed),
          theme: item ? entryTheme(item.card_id, language) : patternCopy.emptyDay,
        }
      },
    )

    return {
      body,
      dominantTheme,
      nextAction,
      timeline,
      stats: [
        { label: patternCopy.days, value: `${trackedDays}/7` },
        { label: patternCopy.journals, value: String(journalCount) },
        { label: patternCopy.theme, value: dominantTheme },
      ],
      detailStats: [
        { label: patternCopy.completion, value: `${completionRate}%` },
        { label: patternCopy.missed, value: String(missedDays) },
        { label: patternCopy.noteRate, value: `${noteRate}%` },
        { label: patternCopy.upright, value: String(uprightCount) },
        { label: patternCopy.reversed, value: String(reversedCount) },
        { label: patternCopy.journalSignal, value: `${journalCount}/${Math.max(trackedDays, 1)}` },
      ],
    }
  }, [
    dateKey,
    entry,
    language,
    localizedCardName,
    patternCopy.activeBody,
    patternCopy.completion,
    patternCopy.days,
    patternCopy.drawAction,
    patternCopy.emptyBody,
    patternCopy.emptyDay,
    patternCopy.journalSignal,
    patternCopy.journalAction,
    patternCopy.journals,
    patternCopy.missed,
    patternCopy.nextActionDraw,
    patternCopy.nextActionJournal,
    patternCopy.nextActionReturn,
    patternCopy.nextActionReview,
    patternCopy.noteRate,
    patternCopy.reversed,
    patternCopy.returnAction,
    patternCopy.reviewAction,
    patternCopy.theme,
    patternCopy.upright,
    recentEntries,
    tomorrowReturnCommitment,
  ])
  const reminderModeTitle = emailDeliveryEnabled ? copy.emailReminderReadyTitle : copy.calendarFallbackTitle
  const reminderModeBody = emailDeliveryEnabled ? copy.reminderHelp : copy.calendarFallbackBody
  const calendarReminderAvailable = reminderCapability?.calendar_reminder_available ?? true
  const dailyPatternHref = useMemo(() => {
    const params = new URLSearchParams({
      q: patternCopy.patternQuestion.replace("{theme}", dailyPattern.dominantTheme),
      auto: "1",
      spread: "three_card",
      lang: language,
      source: "daily-tarot",
      utm_source: "daily-tarot",
      utm_medium: "daily_pattern",
      utm_campaign: "daily-pattern-free-reading",
    })
    return `/input?${params.toString()}`
  }, [dailyPattern.dominantTheme, language, patternCopy.patternQuestion])
  const dailyFeedbackHref = useMemo(() => {
    const params = new URLSearchParams({
      type: "daily_tarot",
      surface: "daily_tarot_tool",
      context: "Daily Tarot",
      locale: language,
    })
    return `/reviews?${params.toString()}#reader-feedback`
  }, [language])
  const hasReading = Boolean(interpretation)
  const stickyPrimaryLabel = hasReading ? shareCopy.button : isDrawing ? copy.drawing : quickActionCopy.draw
  const stickyPrimaryTitle = hasReading ? shareCopy.button : copy.draw
  const stickyPrimaryDisabled = hasReading ? isCreatingShare || isDrawing : isDrawing

  return (
    <div
      data-daily-tarot-tool
      className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 pb-[calc(env(safe-area-inset-bottom)+6.75rem)] pt-6 sm:px-8 sm:pb-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-10 lg:py-12"
    >
      <div
        data-daily-sticky-cta
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#090411]/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:hidden"
      >
        <div className="mx-auto flex max-w-md items-center gap-2">
          <button
            type="button"
            onClick={scrollToReminder}
            aria-label={copy.reminderTitle}
            title={copy.reminderTitle}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/12 text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
          {calendarReminderAvailable && (
            <button
              type="button"
              data-daily-sticky-calendar
              onClick={handleDownloadCalendarReminder}
              aria-label={copy.calendarReminder}
              title={copy.calendarReminder}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#c9c0ff]/26 bg-[#c9c0ff]/[0.08] text-[#eee9ff] transition hover:bg-[#c9c0ff]/14"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            data-daily-sticky-return-cue
            onClick={scrollToReturnCue}
            aria-label={returnCopy.title}
            title={returnCopy.title}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/12 text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={hasReading ? handleShare : handleDraw}
            disabled={stickyPrimaryDisabled}
            title={stickyPrimaryTitle}
            className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 text-xs font-medium text-[#120c22] shadow-[0_12px_30px_rgba(146,132,239,0.24)] transition hover:brightness-110 disabled:opacity-60"
          >
            {isDrawing || (hasReading && isCreatingShare) ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : hasReading ? (
              <Share2 className="h-4 w-4" aria-hidden="true" />
            ) : null}
            <span className={quickActionTextClass}>{stickyPrimaryLabel}</span>
          </button>
        </div>
      </div>
      <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-6">
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

        {todayReturnCommitment && (
          <section
            data-daily-linked-return-focus
            className="mt-5 rounded-lg border border-[#c9c0ff]/22 bg-[#c9c0ff]/[0.065] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/76">{returnCopy.linkedEyebrow}</p>
                <h2 className="mt-2 break-words text-base font-medium leading-6 text-white">{returnCopy.linkedTitle}</h2>
                <p className="mt-2 break-words text-sm font-medium leading-6 text-[#f3efff]">{todayReturnCommitment.focus}</p>
                <p className="mt-2 text-xs leading-5 text-white/52">{returnCopy.linkedBody}</p>
              </div>
              <button
                type="button"
                data-daily-linked-return-focus-edit
                onClick={scrollToReturnCue}
                className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[#c9c0ff]/30 px-4 text-xs text-[#eee9ff] transition hover:bg-[#c9c0ff]/10"
              >
                {returnCopy.linkedAction}
              </button>
            </div>
          </section>
        )}

        <div data-daily-quick-actions className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            type="button"
            data-daily-quick-action="draw"
            onClick={handleDraw}
            disabled={isDrawing}
            title={copy.draw}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/26 bg-[#c9c0ff]/[0.08] px-3 text-xs font-medium text-[#f2edff] transition hover:border-[#c9c0ff]/45 hover:bg-[#c9c0ff]/[0.13] disabled:opacity-55"
          >
            {isDrawing ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" /> : null}
            <span className={quickActionTextClass}>{isDrawing ? copy.drawing : quickActionCopy.draw}</span>
          </button>
          <button
            type="button"
            data-daily-quick-action="journal"
            onClick={scrollToJournal}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
          >
            <NotebookPen className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={quickActionTextClass}>{copy.saveJournal}</span>
          </button>
          <button
            type="button"
            data-daily-quick-action="reminder"
            onClick={scrollToReminder}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
          >
            <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={quickActionTextClass}>{copy.reminderTitle}</span>
          </button>
          <button
            type="button"
            data-daily-quick-action="calendar"
            onClick={handleDownloadCalendarReminder}
            title={copy.calendarReminder}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
          >
            <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={quickActionTextClass}>{quickActionCopy.calendar}</span>
          </button>
          <button
            type="button"
            data-daily-quick-action="share"
            onClick={handleShare}
            disabled={!hasReading || isCreatingShare || isDrawing}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white disabled:opacity-42"
          >
            {isCreatingShare ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
            ) : (
              <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className={quickActionTextClass}>{shareCopy.button}</span>
          </button>
          <button
            type="button"
            data-daily-quick-action="return-cue"
            onClick={scrollToReturnCue}
            className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
          >
            <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className={quickActionTextClass}>{returnCopy.quickAction}</span>
          </button>
        </div>

        {activeDailyFocus && (
          <section
            data-daily-focused-entry
            data-daily-focus={activeDailyFocus.id}
            className="mt-5 rounded-lg border border-[#c9c0ff]/24 bg-[#c9c0ff]/[0.055] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/76">{activeDailyFocus.label}</p>
                <h2 className="mt-2 break-words text-base font-medium leading-6 text-white">{activeDailyFocus.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/56">{activeDailyFocus.body}</p>
                <p className="mt-3 break-words text-xs leading-5 text-[#dcd5ff]/78">{activeDailyQuestion}</p>
              </div>
              <button
                type="button"
                data-daily-focused-entry-draw
                onClick={handleDraw}
                disabled={isDrawing}
                className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-4 text-xs text-[#eee9ff] transition hover:bg-[#c9c0ff]/12 disabled:opacity-55"
              >
                {isDrawing ? copy.drawing : quickActionCopy.draw}
              </button>
            </div>
          </section>
        )}

        <section
          data-daily-direct-return-actions
          className="mt-5 border-t border-white/10 pt-5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/76">{directReturnCopy.eyebrow}</p>
          <div className="mt-2 grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="min-w-0">
              <h2 className="break-words text-base font-medium leading-6 text-white">{directReturnCopy.title}</h2>
              <p className="mt-2 text-xs leading-5 text-white/52">{directReturnCopy.body}</p>
            </div>
            <div className="grid min-w-0 gap-2 min-[420px]:grid-cols-2">
              <button
                type="button"
                data-daily-direct-return-copy
                onClick={handleCopyReturnLink}
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
              >
                <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className={quickActionTextClass}>{returnCopy.copyLink}</span>
              </button>
              <button
                type="button"
                data-daily-direct-return-mailto
                onClick={handleEmailReturnLink}
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/26 bg-[#c9c0ff]/[0.08] px-3 text-xs text-[#f2edff] transition hover:border-[#c9c0ff]/45 hover:bg-[#c9c0ff]/[0.13]"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className={quickActionTextClass}>{returnCopy.mailLink}</span>
              </button>
              <button
                type="button"
                data-daily-direct-return-calendar
                onClick={handleDownloadCalendarReminder}
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
              >
                <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className={quickActionTextClass}>{quickActionCopy.calendar}</span>
              </button>
              <button
                type="button"
                data-daily-direct-return-google-calendar
                onClick={handleOpenGoogleCalendarReminder}
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.035] px-3 text-xs text-white/72 transition hover:border-[#c9c0ff]/35 hover:text-white"
              >
                <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className={quickActionTextClass}>{copy.googleCalendarReminder}</span>
              </button>
            </div>
          </div>
          {returnLinkStatus && (
            <p className="mt-3 text-xs leading-5 text-[#c9c0ff]">
              {returnLinkStatus}
            </p>
          )}
          {calendarStatus && (
            <p className="mt-2 text-xs leading-5 text-white/45">
              {calendarStatus}
            </p>
          )}
        </section>

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

        <div data-daily-habit-snapshot className="mt-8 border-t border-white/10 pt-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72">{habitSnapshotCopy.eyebrow}</p>
          <h2 className="mt-2 font-serif text-xl leading-tight text-white">{habitSnapshotCopy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/58">{habitSnapshotCopy.body}</p>
          <div className="mt-4 grid min-w-0 grid-cols-3 gap-2">
            {dailyPattern.stats.map((item, index) => (
              <div
                key={item.label}
                className={`min-w-0 ${index === 0 ? "" : "border-l border-white/10 pl-2"}`}
              >
                <p className="text-[9px] uppercase leading-snug tracking-[0.12em] text-white/36">{item.label}</p>
                <p className="mt-2 break-words text-xs font-medium leading-snug text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
            <Link
              data-daily-habit-snapshot-pattern
              href={dailyPatternHref}
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-4 text-center text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/14"
            >
              {habitSnapshotCopy.pattern}
            </Link>
            <button
              type="button"
              data-daily-habit-snapshot-return-cue
              onClick={scrollToReturnCue}
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-white/12 px-4 text-center text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
            >
              {habitSnapshotCopy.returnCue}
            </button>
          </div>
        </div>
      </section>

      <section className="min-w-0 space-y-5">
        <article
          data-daily-return-setup
          data-daily-install-prompt={showInstallPrompt ? "true" : undefined}
          className="rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.045] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] sm:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#bfb6ff]/24 bg-[#bfb6ff]/[0.1] text-[#dcd5ff]">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72">{copy.returnSetupEyebrow}</p>
              <h2 className="mt-2 text-base font-medium leading-snug text-white">{copy.returnSetupTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-white/56">{copy.returnSetupBody}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              data-daily-return-setup-calendar
              onClick={handleDownloadCalendarReminder}
              className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/40 bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 text-sm font-medium text-[#130d24] shadow-[0_16px_42px_rgba(146,132,239,0.18)] transition hover:brightness-110"
            >
              <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className={quickActionTextClass}>{copy.returnSetupCalendar}</span>
            </button>
            <button
              type="button"
              data-daily-return-setup-google-calendar
              onClick={handleOpenGoogleCalendarReminder}
              className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/26 bg-[#c9c0ff]/[0.08] px-4 text-sm text-[#f2edff] transition hover:border-[#c9c0ff]/45 hover:bg-[#c9c0ff]/[0.13]"
            >
              <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className={quickActionTextClass}>{copy.googleCalendarReminder}</span>
            </button>
            <button
              type="button"
              data-daily-return-setup-mailto
              onClick={handleEmailReturnLink}
              className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/26 bg-[#c9c0ff]/[0.08] px-4 text-sm text-[#f2edff] transition hover:border-[#c9c0ff]/45 hover:bg-[#c9c0ff]/[0.13]"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className={quickActionTextClass}>{copy.returnSetupMail}</span>
            </button>
            <button
              type="button"
              data-daily-return-setup-reminder
              onClick={scrollToReminder}
              className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
            >
              <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className={quickActionTextClass}>{copy.returnSetupReminder}</span>
            </button>
            {showInstallPrompt && (
              <button
                type="button"
                data-daily-return-setup-install
                onClick={handleInstallPrompt}
                className="inline-flex min-h-11 min-w-0 w-full items-center justify-center gap-2 rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white sm:col-span-2"
              >
                <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className={quickActionTextClass}>{copy.returnSetupHome}</span>
              </button>
            )}
          </div>
          {calendarStatus && <p className="mt-3 text-xs leading-5 text-[#c9c0ff]">{calendarStatus}</p>}
          {installStatus && <p className="mt-3 text-xs leading-5 text-white/45">{installStatus}</p>}
        </article>

        <article data-daily-journal-form className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6">
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
                <Link
                  href={dailyFeedbackHref}
                  data-daily-feedback-link
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/66 transition hover:border-[#bfb6ff]/35 hover:bg-white/[0.045]"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {shareCopy.feedback}
                </Link>
              </div>
              {shareStatus && <p className="mt-3 text-xs text-white/45">{shareStatus}</p>}
            </div>
          )}
        </article>

        <article data-daily-return-commitment className="min-w-0 rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72">{returnCopy.eyebrow}</p>
              <h2 className="mt-2 font-serif text-xl leading-tight text-white">{returnCopy.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{returnCopy.body}</p>
            </div>

            {todayReturnCommitment && (
              <div className="rounded-lg border border-white/10 bg-black/18 p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/38">{returnCopy.todayLabel}</p>
                <p className="mt-2 text-sm font-medium leading-snug text-white">{todayReturnCommitment.focus}</p>
                {todayReturnCommitment.note && (
                  <p className="mt-2 text-sm leading-6 text-white/54">{todayReturnCommitment.note}</p>
                )}
              </div>
            )}

            <div className="grid min-w-0 gap-3">
              <div className="min-w-0">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-white/38">{returnCopy.tomorrowLabel}</p>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {returnCopy.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setReturnFocus(chip)}
                      className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3 text-xs transition ${
                        returnFocus === chip
                          ? "border-[#c9c0ff]/52 bg-[#c9c0ff]/16 text-white"
                          : "border-white/10 bg-black/18 text-white/58 hover:border-[#c9c0ff]/35 hover:text-white"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input
                  value={returnFocus}
                  onChange={(event) => setReturnFocus(event.target.value)}
                  placeholder={returnCopy.defaultFocus}
                  className="mt-3 min-h-11 min-w-0 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#bfb6ff]/55"
                />
              </div>

              <label className="grid min-w-0 gap-2">
                <span className="text-xs uppercase tracking-[0.16em] text-white/38">{returnCopy.noteLabel}</span>
                <textarea
                  value={returnNote}
                  onChange={(event) => setReturnNote(event.target.value)}
                  placeholder={returnCopy.notePlaceholder}
                  className="min-h-24 min-w-0 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-[#bfb6ff]/55"
                />
              </label>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              {tomorrowReturnCommitment ? (
                <p className="text-xs leading-5 text-white/45">
                  {returnCopy.savedPrefix}: {tomorrowReturnCommitment.target_date} · {tomorrowReturnCommitment.focus}
                </p>
              ) : (
                <p className="text-xs leading-5 text-white/45">{getNextDateKey(dateKey || getLocalDateKey())}</p>
              )}
              <button
                type="button"
                onClick={handleSaveReturnCommitment}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/28 bg-[#c9c0ff]/[0.08] px-4 text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/14"
              >
                {returnCopy.save}
              </button>
            </div>

            <div
              data-daily-return-link
              className="rounded-lg border border-white/10 bg-black/16 p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/38">{returnCopy.linkLabel}</p>
              <p className="mt-2 break-all text-xs leading-5 text-white/48">
                {buildDailyReturnPath("return_link")}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  data-daily-return-link-copy
                  onClick={handleCopyReturnLink}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/28 bg-[#c9c0ff]/[0.08] px-4 text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/14"
                >
                  <Link2 className="h-4 w-4" aria-hidden="true" />
                  {returnCopy.copyLink}
                </button>
                <button
                  type="button"
                  data-daily-return-link-mailto
                  onClick={handleEmailReturnLink}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {returnCopy.mailLink}
                </button>
              </div>
              {returnLinkStatus && <p className="mt-3 text-xs text-[#c9c0ff]">{returnLinkStatus}</p>}
            </div>

            {returnCommitmentStatus && <p className="text-xs text-[#c9c0ff]">{returnCommitmentStatus}</p>}
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

        <article
          data-daily-reminder-email-fallback={!emailDeliveryEnabled ? "true" : undefined}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="font-serif text-xl text-white">{copy.reminderTitle}</h2>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex min-h-8 items-center rounded-lg border px-3 text-[11px] uppercase tracking-[0.14em] ${
                  emailDeliveryEnabled
                    ? "border-emerald-300/24 bg-emerald-300/10 text-emerald-100"
                    : "border-[#c9c0ff]/22 bg-[#c9c0ff]/10 text-[#dcd5ff]"
                }`}
              >
                {emailDeliveryEnabled ? copy.emailActiveBadge : copy.emailPendingBadge}
              </span>
              {calendarReminderAvailable && (
                <span className="inline-flex min-h-8 items-center rounded-lg border border-white/10 bg-white/[0.045] px-3 text-[11px] uppercase tracking-[0.14em] text-white/56">
                  {copy.calendarNowBadge}
                </span>
              )}
            </div>
          </div>
          <div className="mb-4 rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.045] p-4">
            <p className="text-sm font-medium text-[#f2edff]">{reminderModeTitle}</p>
            <p className="mt-2 text-xs leading-5 text-white/52">{reminderModeBody}</p>
            {!emailDeliveryEnabled && (
              <p data-daily-reminder-email-disabled-copy className="mt-3 text-xs leading-5 text-[#c9c0ff]">
                {copy.emailSetupPendingAction}
              </p>
            )}
          </div>
          <div data-daily-reminder-form>
            <div className="grid gap-3 sm:grid-cols-[1fr_132px]">
              <input
                type="email"
                value={reminderEmail}
                onChange={(event) => {
                  const nextEmail = event.target.value
                  setReminderEmail(nextEmail)
                  if (emailDeliveryEnabled && normalizeReminderEmail(nextEmail) && !reminderEnabled) setReminderEnabled(true)
                }}
                data-daily-reminder-pending-email-input={!emailDeliveryEnabled ? "true" : undefined}
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
                checked={emailDeliveryEnabled && reminderEnabled}
                onChange={(event) => setReminderEnabled(event.target.checked)}
                disabled={!emailDeliveryEnabled}
                aria-disabled={!emailDeliveryEnabled}
                className="h-4 w-4 accent-[#bfb6ff] disabled:cursor-not-allowed disabled:opacity-45"
              />
              {emailDeliveryEnabled ? copy.reminderToggle : copy.emailSetupDisabled}
            </label>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                onClick={handleSaveReminder}
                disabled={isSaving || (emailDeliveryEnabled && !reminderEmail && reminderEnabled)}
                data-daily-reminder-save-email
                data-daily-reminder-pending-save={!emailDeliveryEnabled ? "true" : undefined}
                className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-white/14 px-5 text-sm text-white/72 transition hover:bg-white/[0.05] disabled:opacity-45"
              >
                {emailDeliveryEnabled ? copy.saveReminder : copy.saveEmailPreference}
              </button>
              <button
                onClick={handleDownloadCalendarReminder}
                data-daily-reminder-calendar-fallback
                className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm transition ${
                  emailDeliveryEnabled
                    ? "border border-[#bfb6ff]/28 bg-[#bfb6ff]/[0.06] text-[#eee9ff] hover:bg-[#bfb6ff]/12"
                    : "border border-[#c9c0ff]/40 bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] font-medium text-[#130d24] shadow-[0_16px_42px_rgba(146,132,239,0.22)] hover:brightness-110"
                }`}
              >
                <CalendarPlus className="h-4 w-4" />
                {copy.calendarReminder}
              </button>
              <button
                onClick={handleEmailReturnLink}
                data-daily-reminder-mailto-fallback
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/12 px-5 text-sm text-white/72 transition hover:border-[#bfb6ff]/38 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {returnCopy.mailLink}
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

        <article data-daily-pattern-review className="rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72">{patternCopy.eyebrow}</p>
              <h2 className="mt-2 font-serif text-xl leading-tight text-white">{patternCopy.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{dailyPattern.body}</p>
            </div>
            <div className="grid shrink-0 gap-2 sm:min-w-[12rem]">
              <Link
                data-daily-pattern-free-cta
                href={dailyPatternHref}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 text-sm font-medium text-[#130d24] shadow-[0_14px_34px_rgba(146,132,239,0.2)] transition hover:brightness-110"
              >
                {patternCopy.askPattern}
              </Link>
              <Link
                href="/monthly-tarot-report"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/26 px-4 text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/10"
              >
                {patternCopy.report}
              </Link>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {dailyPattern.stats.map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg border border-white/10 bg-black/16 p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/36">{item.label}</p>
                <p className="mt-2 break-words text-sm font-medium leading-snug text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div data-daily-pattern-detail-stats className="mt-3 grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
            {dailyPattern.detailStats.map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg border border-white/10 bg-black/14 p-3">
                <p className="text-[9px] uppercase leading-snug tracking-[0.14em] text-white/34">{item.label}</p>
                <p className="mt-2 break-words text-sm font-medium leading-snug text-[#eee9ff]">{item.value}</p>
              </div>
            ))}
          </div>
          <div
            data-daily-pattern-next-action
            className="mt-4 grid min-w-0 gap-3 rounded-lg border border-[#c9c0ff]/18 bg-black/18 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{patternCopy.nextActionLabel}</p>
              <p className="mt-2 text-sm leading-6 text-white/58">{dailyPattern.nextAction.body}</p>
            </div>
            {dailyPattern.nextAction.type === "review" ? (
              <Link
                data-daily-pattern-next-action-review
                href={dailyPatternHref}
                className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-4 text-center text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/14"
              >
                {dailyPattern.nextAction.label}
              </Link>
            ) : (
              <button
                type="button"
                data-daily-pattern-next-action-button
                onClick={
                  dailyPattern.nextAction.type === "draw"
                    ? handleDraw
                    : dailyPattern.nextAction.type === "journal"
                      ? scrollToJournal
                      : scrollToReturnCue
                }
                disabled={dailyPattern.nextAction.type === "draw" && isDrawing}
                className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-[#c9c0ff]/30 bg-[#c9c0ff]/[0.08] px-4 text-center text-sm text-[#eee9ff] transition hover:bg-[#c9c0ff]/14 disabled:opacity-55"
              >
                {dailyPattern.nextAction.label}
              </button>
            )}
          </div>
          <div data-daily-pattern-timeline className="mt-5 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/36">{patternCopy.timeline}</p>
            <div className="mt-3 grid min-w-0 grid-cols-7 gap-1.5">
              {dailyPattern.timeline.map((item) => (
                <div
                  key={item.date}
                  data-daily-pattern-day
                  data-daily-pattern-filled={item.hasEntry ? "true" : "false"}
                  title={`${item.date}: ${item.cardName}`}
                  aria-label={`${item.date}: ${item.cardName}`}
                  className={`min-w-0 rounded-lg border px-1.5 py-2 text-center transition ${
                    item.hasEntry
                      ? item.hasJournal
                        ? "border-[#c9c0ff]/36 bg-[#c9c0ff]/13 text-white"
                        : "border-[#c9c0ff]/24 bg-[#c9c0ff]/[0.07] text-white/72"
                      : "border-white/8 bg-black/14 text-white/28"
                  }`}
                >
                  <p className="truncate text-[9px] leading-none">{item.label}</p>
                  <p className="mt-2 text-[10px] font-medium leading-none">
                    {item.hasEntry ? (item.isReversed ? "R" : "U") : "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
