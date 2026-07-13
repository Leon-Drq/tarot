"use client"

import { useEffect, useState, Suspense, type FormEvent, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { BackgroundGradient } from "./mystic/background-gradient"
import { StarsLayer } from "./mystic/stars-layer"
import { CoreLight } from "./mystic/core-light"
import { TarotCard } from "./mystic/tarot-card"
import { MysticAnimations } from "./mystic/mystic-animations"
import { MenuButton } from "./menu-button"
import { MenuPanel } from "./menu-panel"
import { LanguageSwitcher } from "./language-switcher"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { getLocalDateKey } from "@/lib/daily-tarot"
import type { ReaderStyle } from "@/lib/reader-style"
import type { SpreadType } from "@/lib/spread-config"

const DEFAULT_FRONT = "/images/0.png"
const DEFAULT_BACK = "/images/back1.jpg"
const HOME_SCROLL_TARGET_ID = "home-free-paths"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>
}

function isStandalonePwa() {
  if (typeof window === "undefined") return false
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true
}

function isTextInputFocused() {
  if (typeof document === "undefined") return false
  const active = document.activeElement
  if (!(active instanceof HTMLElement)) return false
  return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active.isContentEditable
}

function scrollToHomeContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()

  const target = document.getElementById(HOME_SCROLL_TARGET_ID)
  if (!target) {
    window.location.hash = HOME_SCROLL_TARGET_ID
    return
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" })
  window.history.replaceState(null, "", `#${HOME_SCROLL_TARGET_ID}`)
}

// 单独提取 searchParams 相关逻辑
function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      localStorage.setItem("poptarot_ref", ref.toUpperCase())
    }
  }, [searchParams])

  return null
}

function HomeHeader({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const { language } = useLanguage()
  const { isLoggedIn } = useAuth()
  const copy =
    {
      zh: {
        nav: [
          ["免费解读", "/free-ai-tarot-reading"],
          ["爱情塔罗", "/love-tarot-reading"],
          ["Yes / No", "/yes-or-no-tarot"],
          ["每日塔罗", "/daily-tarot"],
          ["牌义", "/tarot-card-meanings"],
          ["会员", "/membership"],
        ],
        account: isLoggedIn ? "我的账户" : "登录",
        accountHref: isLoggedIn ? "/profile" : "/auth/login",
        start: "免费开始",
      },
      en: {
        nav: [
          ["Free Reading", "/free-ai-tarot-reading"],
          ["Love Tarot", "/love-tarot-reading"],
          ["Yes / No", "/yes-or-no-tarot"],
          ["Daily Tarot", "/daily-tarot"],
          ["Card Meanings", "/tarot-card-meanings"],
          ["Membership", "/membership"],
        ],
        account: isLoggedIn ? "Account" : "Sign in",
        accountHref: isLoggedIn ? "/profile" : "/auth/login",
        start: "Start free",
      },
      ja: {
        nav: [
          ["無料リーディング", "/free-ai-tarot-reading"],
          ["恋愛タロット", "/love-tarot-reading"],
          ["Yes / No", "/yes-or-no-tarot"],
          ["今日のタロット", "/daily-tarot"],
          ["カード意味", "/tarot-card-meanings"],
          ["メンバー", "/membership"],
        ],
        account: isLoggedIn ? "アカウント" : "ログイン",
        accountHref: isLoggedIn ? "/profile" : "/auth/login",
        start: "無料で開始",
      },
      ko: {
        nav: [
          ["무료 리딩", "/free-ai-tarot-reading"],
          ["연애 타로", "/love-tarot-reading"],
          ["Yes / No", "/yes-or-no-tarot"],
          ["데일리 타로", "/daily-tarot"],
          ["카드 의미", "/tarot-card-meanings"],
          ["멤버십", "/membership"],
        ],
        account: isLoggedIn ? "계정" : "로그인",
        accountHref: isLoggedIn ? "/profile" : "/auth/login",
        start: "무료로 시작",
      },
    }[language]

  const focusQuestion = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById("home-question")?.scrollIntoView({ behavior: "smooth", block: "center" })
    window.setTimeout(() => document.getElementById("home-question")?.focus({ preventScroll: true }), 350)
  }

  return (
    <header
      data-home-header
      className="home-site-header fixed inset-x-0 z-50 border-b border-white/10 bg-[#08030f]/82 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[4.25rem] w-[calc(100%-1.5rem)] max-w-[1280px] items-center justify-between gap-3 lg:h-[4.75rem]">
        <div className="flex min-w-0 items-center gap-3 lg:w-auto">
          <div className="lg:hidden">
            <MenuButton isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
          <Link
            href="/"
            aria-label="POPTarot home"
            className="flex min-w-0 items-center gap-2.5 text-white"
          >
            <Image
              data-home-brand-logo
              src="/logo.png"
              width="36"
              height="36"
              alt="POPTarot logo"
              className="h-8 w-8 shrink-0 rounded-md lg:h-9 lg:w-9"
              priority
            />
            <span className="whitespace-nowrap font-serif text-sm tracking-[0.12em] sm:text-lg sm:tracking-[0.16em] lg:text-xl">
              POP TAROT
            </span>
          </Link>
        </div>

        <nav aria-label="Primary navigation" className="hidden min-w-0 items-center justify-center gap-1 lg:flex">
          {copy.nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center whitespace-nowrap px-2.5 text-[13px] text-white/62 transition hover:text-white xl:px-3"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <LanguageSwitcher />
          <Link
            href={copy.accountHref}
            className="hidden min-h-10 items-center px-2 text-sm text-white/62 transition hover:text-white xl:inline-flex"
          >
            {copy.account}
          </Link>
          <a
            href="#home-question"
            onClick={focusQuestion}
            className="hidden min-h-10 items-center justify-center rounded-md bg-[#b9c7ff] px-4 text-sm font-medium text-[#0b1026] transition hover:bg-[#d2dbff] sm:inline-flex"
          >
            {copy.start}
          </a>
        </div>
      </div>
    </header>
  )
}

function HomeQuestionForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [question, setQuestion] = useState("")
  const [readerStyle, setReaderStyle] = useState<ReaderStyle>("gentle")
  type QuickStartExample = {
    label: string
    question: string
    campaign: string
    spread?: SpreadType
    href?: string
  }

  const copy =
    {
      zh: {
        styleLabel: "选择解读方式",
        styles: [
          { id: "gentle", title: "温柔陪伴", body: "先理解感受" },
          { id: "direct", title: "清醒直说", body: "直接指出重点" },
          { id: "relationship", title: "关系洞察", body: "看互动与边界" },
        ],
        prompt: "我会先听懂你的问题，再结合牌面给出清晰答案。",
        label: "写下一个真实、具体的问题",
        placeholder: "输入你现在最想弄清楚的问题...",
        action: "免费抽牌并解读",
        trust: "无需注册 · 首次完整解读免费 · 内容仅用于本次解读",
        examples: [
          { label: "前任会回来吗？", question: "前任会回来吗？我该继续等还是放下？", campaign: "ex_return", spread: "breakup_recovery" },
          { label: "他爱我吗？", question: "他爱我吗？这段关系真实的情绪是什么？", campaign: "does_he_love_me", spread: "their_thoughts" },
          { label: "事业塔罗", question: "我现在的事业方向需要注意什么？", campaign: "career_tarot", spread: "job_opportunity" },
          { label: "爱情 Yes / No", question: "请给我一个爱情问题的是或否方向，并解释原因。", campaign: "yes_no_love", spread: "yes_no" },
          { label: "每日塔罗", question: "", campaign: "daily_tarot", href: "/daily-tarot?utm_source=home&utm_medium=hero_quick_start&utm_campaign=daily_tarot" },
        ] satisfies QuickStartExample[],
      },
      en: {
        styleLabel: "Choose a reading style",
        styles: [
          { id: "gentle", title: "Gentle guide", body: "Start with your feelings" },
          { id: "direct", title: "Clear truth", body: "Name the real pattern" },
          { id: "relationship", title: "Relationship lens", body: "Read dynamics and limits" },
        ],
        prompt: "I will understand the question first, then read the cards in context.",
        label: "Ask one real, specific question",
        placeholder: "Ask what you really want to know...",
        action: "Draw cards free",
        trust: "No sign-up · First complete reading free · Private by default",
        examples: [
          { label: "Will my ex come back?", question: "Will my ex come back, and what should I understand before I act?", campaign: "ex_return", spread: "breakup_recovery" },
          { label: "Does he love me?", question: "Does he love me, and what is the real emotional energy between us?", campaign: "does_he_love_me", spread: "their_thoughts" },
          { label: "Career tarot", question: "What should I understand about my career path right now?", campaign: "career_tarot", spread: "job_opportunity" },
          { label: "Yes / no love", question: "Give me a yes or no love tarot answer with the reason behind it.", campaign: "yes_no_love", spread: "yes_no" },
          { label: "Daily Tarot", question: "", campaign: "daily_tarot", href: "/daily-tarot?utm_source=home&utm_medium=hero_quick_start&utm_campaign=daily_tarot" },
        ] satisfies QuickStartExample[],
      },
      ja: {
        styleLabel: "読み方を選ぶ",
        styles: [
          { id: "gentle", title: "やさしい伴走", body: "気持ちから理解" },
          { id: "direct", title: "率直な答え", body: "要点を明確に" },
          { id: "relationship", title: "関係の洞察", body: "関係性と境界を見る" },
        ],
        prompt: "質問を理解してから、カードを文脈に沿って読みます。",
        label: "具体的な質問をひとつ書く",
        placeholder: "本当に知りたいことを入力...",
        action: "無料でカードを引く",
        trust: "登録不要 · 初回の完全リーディング無料 · 非公開",
        examples: [
          { label: "元恋人は戻る？", question: "元恋人は戻りますか？行動する前に何を理解すべきですか？", campaign: "ex_return", spread: "breakup_recovery" },
          { label: "彼は私を愛している？", question: "彼は私を愛していますか？二人の本当の感情は何ですか？", campaign: "does_he_love_me", spread: "their_thoughts" },
          { label: "仕事のタロット", question: "今の仕事の流れについて何を理解すべきですか？", campaign: "career_tarot", spread: "job_opportunity" },
          { label: "恋愛 Yes / No", question: "恋愛の質問に Yes / No と理由をください。", campaign: "yes_no_love", spread: "yes_no" },
          { label: "今日のタロット", question: "", campaign: "daily_tarot", href: "/daily-tarot?utm_source=home&utm_medium=hero_quick_start&utm_campaign=daily_tarot" },
        ] satisfies QuickStartExample[],
      },
      ko: {
        styleLabel: "리딩 방식을 선택하세요",
        styles: [
          { id: "gentle", title: "부드러운 안내", body: "감정부터 이해" },
          { id: "direct", title: "명확한 진실", body: "핵심을 직접 설명" },
          { id: "relationship", title: "관계 통찰", body: "관계와 경계를 분석" },
        ],
        prompt: "질문을 먼저 이해한 뒤 카드의 맥락을 읽어드릴게요.",
        label: "구체적인 질문 하나를 적어보세요",
        placeholder: "지금 정말 알고 싶은 질문...",
        action: "무료로 카드 뽑기",
        trust: "가입 불필요 · 첫 전체 리딩 무료 · 기본 비공개",
        examples: [
          { label: "전 애인이 돌아올까?", question: "전 애인이 돌아올까요? 행동하기 전에 무엇을 이해해야 하나요?", campaign: "ex_return", spread: "breakup_recovery" },
          { label: "그는 나를 사랑할까?", question: "그는 나를 사랑하나요? 우리 사이의 진짜 감정은 무엇인가요?", campaign: "does_he_love_me", spread: "their_thoughts" },
          { label: "커리어 타로", question: "지금 내 커리어 흐름에서 무엇을 이해해야 하나요?", campaign: "career_tarot", spread: "job_opportunity" },
          { label: "연애 Yes / No", question: "연애 질문에 대해 예/아니오와 그 이유를 알려주세요.", campaign: "yes_no_love", spread: "yes_no" },
          { label: "데일리 타로", question: "", campaign: "daily_tarot", href: "/daily-tarot?utm_source=home&utm_medium=hero_quick_start&utm_campaign=daily_tarot" },
        ] satisfies QuickStartExample[],
      },
    }[language]

  const startReading = (value: string, source: "home" | "home_example", campaign?: string, spread: SpreadType = "three_card") => {
    const trimmed = value.trim()
    if (!trimmed) {
      router.push("/input?source=home&utm_source=home&utm_medium=hero_form")
      return
    }

    const params = new URLSearchParams({
      q: trimmed,
      auto: "1",
      source,
      spread,
      reader_style: readerStyle,
      lang: language,
      utm_source: "home",
      utm_medium: source === "home_example" ? "hero_quick_start" : "hero_form",
    })

    if (campaign) params.set("utm_campaign", campaign)
    sessionStorage.setItem("tarot_question", trimmed)
    sessionStorage.setItem("tarot_reader_style", readerStyle)
    router.push(`/input?${params.toString()}`)
  }

  const openExample = (example: QuickStartExample) => {
    if (example.href) {
      router.push(example.href)
      return
    }

    startReading(example.question, "home_example", example.campaign, example.spread || "three_card")
  }

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startReading(question, "home")
  }

  return (
    <form
      data-home-question-form
      onSubmit={submitQuestion}
      className="relative z-30 mx-auto w-full max-w-[42rem]"
    >
      <fieldset>
        <legend className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/48">{copy.styleLabel}</legend>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-white/12 bg-black/30 p-1 backdrop-blur-md">
          {copy.styles.map((style) => {
            const selected = style.id === readerStyle
            return (
              <button
                key={style.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setReaderStyle(style.id as ReaderStyle)}
                className={`min-h-[3.5rem] rounded-[4px] px-2 py-2 text-left transition sm:min-h-[3.75rem] sm:px-3 ${
                  selected ? "bg-[#d8dfff] text-[#11162c]" : "text-white/68 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span className="block text-xs font-medium leading-4 sm:text-sm">{style.title}</span>
                <span className={`mt-0.5 hidden text-[10px] leading-4 sm:block ${selected ? "text-[#2e3657]/72" : "text-white/38"}`}>
                  {style.body}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>
      <p className="mt-2 text-xs leading-5 text-white/54">{copy.prompt}</p>
      <label htmlFor="home-question" className="mt-4 block text-[11px] uppercase tracking-[0.18em] text-white/48">
        {copy.label}
      </label>
      <div className="group relative mt-2 rounded-md border border-white/16 bg-[#0c0714]/88 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-md transition focus-within:border-[#b9c7ff]/72">
        <textarea
          id="home-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={copy.placeholder}
          rows={2}
          className="block min-h-[5.25rem] w-full resize-none bg-transparent px-4 py-3 text-base leading-6 text-white outline-none placeholder:text-white/32 sm:min-h-[5.75rem] sm:px-5 sm:py-4"
        />
      </div>
      <button
        type="submit"
        data-home-hero-primary-cta
        aria-label={copy.action}
        className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-[#b9c7ff] px-5 text-sm font-semibold text-[#0b1026] shadow-[0_18px_45px_rgba(88,104,175,0.24)] transition hover:bg-[#d2dbff]"
      >
        <span>{copy.action}</span>
      </button>
      <div
        data-home-hero-quick-start
        className="scrollbar-hide -mx-1 mt-3 flex snap-x flex-nowrap justify-start gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:pb-0"
      >
        {copy.examples.map((example) => (
          <button
            key={example.campaign}
            type="button"
            data-home-example-start
            data-home-hero-quick-start-link
            onClick={() => openExample(example)}
            className="inline-flex min-h-9 shrink-0 snap-start items-center rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-center text-[11px] leading-4 text-white/56 transition hover:border-[#b9c7ff]/45 hover:text-white sm:max-w-full"
          >
            {example.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] leading-5 text-white/38">{copy.trust}</p>
    </form>
  )
}

function HomeDailyReturnPanel() {
  const { language } = useLanguage()
  const [hasDailyEntry, setHasDailyEntry] = useState(false)
  const [streak, setStreak] = useState(0)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installStatus, setInstallStatus] = useState("")
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const today = getLocalDateKey()
    const raw = localStorage.getItem(`poptarot_daily_${today}`)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { interpretation?: string | null; streak_count?: number | null }
      setHasDailyEntry(Boolean(parsed.interpretation))
      setStreak(Number(parsed.streak_count || 0))
    } catch {
      // Ignore corrupt local daily tarot cache.
    }
  }, [])

  const copy =
    {
      zh: {
        eyebrow: "每日复访",
        titleReady: "今天的每日塔罗还没抽",
        titleDone: "今天的每日牌已保存",
        bodyReady: "每天一张免费牌，保留连续打卡和日记，比一次性解读更容易形成回访。",
        bodyDone: "明天回来继续打卡；也可以补一条日记，记录这张牌今天是否应验在情绪或行动上。",
        primary: "打开每日塔罗",
        secondary: "查看牌义",
        install: "添加到主屏幕",
        installFallback: "在浏览器菜单中选择添加到主屏幕，明天可以直接回来。",
        installInstalled: "已可从主屏幕直接打开。",
        streak: "连续",
        days: "天",
      },
      en: {
        eyebrow: "Daily return",
        titleReady: "Today's Daily Tarot is waiting",
        titleDone: "Today's daily card is saved",
        bodyReady: "One free card each day keeps the habit light: draw, read, journal, and return tomorrow.",
        bodyDone: "Come back tomorrow to keep the streak, or add a short journal note while today's card is still fresh.",
        primary: "Open Daily Tarot",
        secondary: "Learn card meanings",
        install: "Add to Home Screen",
        installFallback: "Use your browser menu to add POPTarot to your home screen for a direct daily return.",
        installInstalled: "POPTarot can open from your home screen.",
        streak: "Streak",
        days: "days",
      },
      ja: {
        eyebrow: "毎日の入口",
        titleReady: "今日のタロットを引けます",
        titleDone: "今日のカードを保存済み",
        bodyReady: "毎日一枚だけなら続けやすく、記録と振り返りでまた戻ってこられます。",
        bodyDone: "明日また戻って連続記録を続けるか、今日のカードに短いメモを残しましょう。",
        primary: "毎日のタロットへ",
        secondary: "カードの意味",
        install: "ホーム画面に追加",
        installFallback: "ブラウザメニューからホーム画面に追加すると、明日すぐ戻れます。",
        installInstalled: "ホーム画面から開けます。",
        streak: "連続",
        days: "日",
      },
      ko: {
        eyebrow: "매일 돌아오기",
        titleReady: "오늘의 데일리 타로가 기다려요",
        titleDone: "오늘의 카드가 저장됐어요",
        bodyReady: "하루 한 장 무료 카드로 가볍게 시작하고, 기록과 저널로 다시 돌아오세요.",
        bodyDone: "내일 다시 돌아와 연속 기록을 이어가거나, 오늘 카드에 짧은 저널을 남겨보세요.",
        primary: "데일리 타로 열기",
        secondary: "카드 의미 보기",
        install: "홈 화면에 추가",
        installFallback: "브라우저 메뉴에서 홈 화면에 추가하면 내일 바로 돌아올 수 있습니다.",
        installInstalled: "홈 화면에서 바로 열 수 있습니다.",
        streak: "연속",
        days: "일",
      },
    }[language]

  useEffect(() => {
    setIsInstalled(isStandalonePwa())

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
      setInstallStatus(copy.installInstalled)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [copy.installInstalled])

  const handleInstallPwa = async () => {
    if (isInstalled) {
      setInstallStatus(copy.installInstalled)
      return
    }

    if (!installPrompt) {
      setInstallStatus(copy.installFallback)
      return
    }

    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      setInstallPrompt(null)
      if (choice.outcome === "accepted") {
        setIsInstalled(true)
        setInstallStatus(copy.installInstalled)
        return
      }
      setInstallStatus(copy.installFallback)
    } catch {
      setInstallStatus(copy.installFallback)
    }
  }

  return (
    <div
      data-home-daily-return-panel
      className="relative z-30 mx-auto w-[calc(100vw_-_3rem)] max-w-[620px] rounded-lg border border-white/10 bg-[#0b0314] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9c0ff]/72 sm:text-xs">{copy.eyebrow}</p>
          <h2 className="mt-2 text-base font-medium leading-snug text-white sm:text-lg">
            {hasDailyEntry ? copy.titleDone : copy.titleReady}
          </h2>
          <p className="mt-2 text-xs leading-6 text-white/54 sm:text-sm">
            {hasDailyEntry ? copy.bodyDone : copy.bodyReady}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:w-[168px]">
          {streak > 0 && (
            <div className="rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.08] px-3 py-2 text-center text-xs text-[#eeeaff]">
              {copy.streak} {streak} {copy.days}
            </div>
          )}
          <a
            href="/daily-tarot"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 text-sm font-medium text-[#120c22] shadow-[0_14px_35px_rgba(143,128,238,0.22)] transition hover:brightness-110"
          >
            {copy.primary}
          </a>
          <a
            href="/tarot-card-meanings"
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/68 transition hover:border-[#bfb6ff]/35 hover:text-white"
          >
            {copy.secondary}
          </a>
          {!isInstalled && (
            <button
              type="button"
              data-home-pwa-install
              onClick={handleInstallPwa}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/22 bg-[#c9c0ff]/[0.07] px-3 text-center text-sm leading-4 text-[#eee9ff] transition hover:bg-[#c9c0ff]/13"
            >
              {copy.install}
            </button>
          )}
          {installStatus && (
            <p data-home-pwa-install-status className="text-xs leading-5 text-white/45">
              {installStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function HomeScrollContent() {
  const { language } = useLanguage()
  const copy =
    {
      zh: {
        eyebrow: "继续探索",
        title: "每天回来，或直接问一个具体问题",
        body: "你可以从每日一牌、免费工具、牌阵和牌义继续探索，让每次抽牌都更有上下文。",
        trustEyebrow: "信任与透明",
        trustTitle: "先免费体验，也能清楚知道它如何工作",
        trustBody: "补充阅读编辑说明、AI 解读边界、隐私政策、用户反馈和真实问题案例。",
        items: [
          { href: "/daily-tarot", title: "每日塔罗", body: "每日一牌、连续打卡、保存日记。" },
          { href: "/free-tarot-tools", title: "免费工具", body: "从一个入口查看免费解读、每日塔罗、问题页、牌阵和牌义。" },
          { href: "/tarot-spreads", title: "免费牌阵", body: "爱情、事业、是/否问题直接匹配牌阵。" },
          { href: "/tarot-questions", title: "问题入口", body: "前任、爱情、事业和是否问题直接开始。" },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "适合快速判断，但保留 AI 解释。" },
          { href: "/love-tarot-reading", title: "爱情塔罗", body: "感情、复合、对方想法专项入口。" },
          { href: "/tarot-card-meanings", title: "牌义大全", body: "78 张牌的正位、逆位和场景解读。" },
          { href: "/tarot-card-combinations", title: "牌组组合", body: "从常见配对进入更具体的免费牌阵。" },
        ],
        trustItems: [
          { href: "/about", title: "关于" },
          { href: "/official-channels", title: "官方渠道" },
          { href: "/contact", title: "联系" },
          { href: "/editorial-policy", title: "编辑说明" },
          { href: "/ai-tarot-disclaimer", title: "AI 声明" },
          { href: "/privacy", title: "隐私" },
          { href: "/reviews", title: "用户评价" },
          { href: "/tarot-reading-examples", title: "真实案例" },
        ],
        feedbackEyebrow: "读者反馈",
        feedbackTitle: "好的免费解读，应该先让人更清楚",
        feedbackBody: "这些是我们优化产品时参考的代表性体验：快速、具体、不过度承诺，并且能给出下一步。",
        feedbackItems: [
          { title: "每日塔罗", body: "每日一牌比泛泛的运势更容易坚持，因为它只给今天一个重点。" },
          { title: "爱情问题", body: "感情解读不只回答是或否，而是解释能观察什么、接下来怎么问。" },
          { title: "事业选择", body: "事业牌阵帮助区分短期疲惫和真正需要制定离开计划的信号。" },
        ],
        assuranceItems: [
          { title: "免费优先", body: "第一次解读、每日塔罗、牌义和问题页都可以先免费使用。" },
          { title: "需要时再升级", body: "深度追问、历史保存、高级牌阵和长期报告可以在需要时再开启。" },
          { title: "边界清楚", body: "AI 塔罗是反思工具，不替代医疗、法律、财务或安全建议。" },
        ],
        growthEyebrow: "如何开始",
        growthTitle: "从一个真实问题，进入一次清晰解读",
        growthBody: "写下正在困扰你的爱情、事业或选择问题，确认牌阵后按直觉抽牌，再阅读结合牌位和问题的解读。",
        growthItems: [
          { title: "提出真实问题", body: "把你最想弄清楚的感情、事业、复合或选择问题直接写出来。", href: "/free-ai-tarot-reading" },
          { title: "选择合适牌阵", body: "从免费三牌阵开始，也可以进入每日塔罗或更多主题牌阵。", href: "/tarot-spreads" },
          { title: "按直觉抽牌", body: "在洗牌完成后选择卡牌，让牌面、牌位和问题一起形成解读。", href: "/tarot-questions" },
          { title: "理解每张牌", body: "需要时查看牌义、示例和 AI 声明，知道解读能帮你到哪里。", href: "/tarot-card-meanings" },
        ],
        questionEyebrow: "常见问题入口",
        questionTitle: "从你真正想问的问题开始",
        questionBody: "如果你暂时不知道怎么开口，可以从这些常见问题进入对应牌阵，再把细节补充得更具体。",
        questionItems: [
          { href: "/will-my-ex-come-back-tarot", title: "Will my ex come back?", body: "复合、联系、时机和是否还值得等待。" },
          { href: "/does-he-love-me-tarot", title: "Does he love me?", body: "用行为、一致性和情绪安全感一起判断。" },
          { href: "/yes-or-no-tarot-love", title: "Yes or no love tarot", body: "快速方向，但解释为什么是 yes、no 或 not yet。" },
          { href: "/career-tarot-reading", title: "Career tarot reading", body: "职业方向、压力、风险、资源和下一步。" },
          { href: "/should-i-quit-my-job-tarot", title: "Should I quit my job?", body: "区分短期疲惫、真正转折和离开前准备。" },
          { href: "/what-does-he-think-of-me-tarot", title: "What does he think of me?", body: "暧昧、沉默、私人想法和下一步行动线索。" },
          { href: "/will-he-contact-me-tarot", title: "Will he contact me?", body: "断联、迟迟不回、分手沉默和边界感。" },
          { href: "/is-this-relationship-over-tarot", title: "Is this relationship over?", body: "关系疏远、反复冲突、修复可能和止损信号。" },
          { href: "/will-i-get-the-job-tarot", title: "Will I get the job?", body: "面试、offer、晋升机会和现实跟进动作。" },
          { href: "/should-i-take-this-job-tarot", title: "Should I take this job?", body: "薪资、文化、稳定性、成长和谈判空间。" },
          { href: "/will-i-be-successful-tarot", title: "Will I be successful?", body: "项目、考试、发布、创作和下一步可控行动。" },
        ],
      },
      en: {
        eyebrow: "Explore next",
        title: "Come back daily, or ask a precise question",
        body: "Keep exploring through Daily Tarot, free tools, spreads, and card meanings so each reading has more context.",
        trustEyebrow: "Trust and transparency",
        trustTitle: "Try it free, and see how the guidance is framed",
        trustBody: "Read the editorial policy, AI disclaimer, privacy notes, representative reviews, and realistic reading examples.",
        items: [
          { href: "/daily-tarot", title: "Daily Tarot", body: "One card, streaks, journal, and reminders." },
          { href: "/free-tarot-tools", title: "Free Tools", body: "One hub for free readings, Daily Tarot, question pages, spreads, and meanings." },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "Choose yes/no, love, ex, career, and decision spreads." },
          { href: "/tarot-questions", title: "Tarot Questions", body: "Start from ex, love, yes/no, and career questions." },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "A quick answer with the reason behind it." },
          { href: "/love-tarot-reading", title: "Love Tarot", body: "Feelings, reconnection, and relationship clarity." },
          { href: "/tarot-card-meanings", title: "Card Meanings", body: "Upright, reversed, love, career, money, and advice." },
          { href: "/tarot-card-combinations", title: "Card Combinations", body: "Compare common pairs, then open a free spread for your question." },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/contact", title: "Contact" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "Reader feedback",
        feedbackTitle: "A good free reading should make the next step clearer",
        feedbackBody: "These representative patterns describe the experience we optimize for: fast, specific, grounded, and easy to return to.",
        feedbackItems: [
          { title: "Daily tarot", body: "One daily card is easier to keep using because it gives a single focus instead of vague horoscope text." },
          { title: "Love questions", body: "Relationship readings should explain what can be observed next, not only force a yes or no answer." },
          { title: "Career choices", body: "Career spreads help separate temporary burnout from a real signal to build a practical exit plan." },
        ],
        assuranceItems: [
          { title: "Free first", body: "Your first reading, Daily Tarot, card meanings, and question pages are available before any upgrade." },
          { title: "Upgrade when needed", body: "Deeper follow-ups, saved history, advanced spreads, and longer reports can be opened later." },
          { title: "Clear limits", body: "AI tarot is reflective guidance, not medical, legal, financial, psychological, or safety advice." },
        ],
        growthEyebrow: "How to begin",
        growthTitle: "Start with one real question and a clear reading",
        growthBody: "Write the love, career, or decision question that is actually on your mind, confirm a spread, draw by instinct, and read the guidance in context.",
        growthItems: [
          { title: "Ask a real question", body: "Put your love, career, reconciliation, or decision question into your own words.", href: "/free-ai-tarot-reading" },
          { title: "Choose a spread", body: "Start with the free three-card spread, or open Daily Tarot and themed spreads when they fit better.", href: "/tarot-spreads" },
          { title: "Draw by instinct", body: "After the deck is ready, choose cards and let the cards, positions, and question shape the reading.", href: "/tarot-questions" },
          { title: "Understand the cards", body: "Use meanings, examples, and the AI disclaimer to understand what the reading can and cannot do.", href: "/tarot-card-meanings" },
        ],
        questionEyebrow: "Common question paths",
        questionTitle: "Start from the question you really want to ask",
        questionBody: "If it is hard to phrase the question, choose a common path below, then add the details that make it yours.",
        questionItems: [
          { href: "/will-my-ex-come-back-tarot", title: "Will my ex come back?", body: "Reconciliation, contact, timing, closure, and whether waiting still helps." },
          { href: "/does-he-love-me-tarot", title: "Does he love me?", body: "Compare feelings with behavior, consistency, and emotional safety." },
          { href: "/how-does-he-feel-about-me-tarot", title: "How does he feel about me?", body: "Attraction, hidden feelings, emotional availability, and whether feelings may become action." },
          { href: "/does-my-ex-miss-me-tarot", title: "Does my ex miss me?", body: "Breakup silence, nostalgia, no-contact energy, and whether missing you is enough." },
          { href: "/will-he-come-back-tarot", title: "Will he come back?", body: "Return energy, motives, delays, and a healthy boundary while you wait." },
          { href: "/future-spouse-tarot-reading", title: "Future spouse tarot reading", body: "Future partner traits, timing themes, readiness, and lasting love." },
          { href: "/yes-or-no-tarot-love", title: "Yes or no love tarot", body: "A quick direction with the reason behind yes, no, or not yet." },
          { href: "/career-tarot-reading", title: "Career tarot reading", body: "Career direction, pressure, risk, resources, and the next practical move." },
          { href: "/should-i-quit-my-job-tarot", title: "Should I quit my job?", body: "Separate temporary burnout from a real transition signal and preparation." },
          { href: "/what-does-he-think-of-me-tarot", title: "What does he think of me?", body: "Mixed signals, silence, private thoughts, and possible next actions." },
          { href: "/will-he-contact-me-tarot", title: "Will he contact me?", body: "No-contact periods, delayed replies, breakup silence, and healthy boundaries." },
          { href: "/is-this-relationship-over-tarot", title: "Is this relationship over?", body: "Distance, repeated conflict, repair potential, and when to stop chasing." },
          { href: "/will-i-get-the-job-tarot", title: "Will I get the job?", body: "Interviews, offers, applications, promotion chances, and follow-up." },
          { href: "/should-i-take-this-job-tarot", title: "Should I take this job?", body: "Salary, culture fit, stability, risk, growth, and negotiation." },
          { href: "/will-i-be-successful-tarot", title: "Will I be successful?", body: "Projects, exams, launches, creative work, and the next controllable action." },
        ],
      },
      ja: {
        eyebrow: "次に見る",
        title: "毎日の一枚、または具体的な質問へ",
        body: "無料リーディングから始め、毎日・カード意味・質問別ページで継続利用できます。",
        trustEyebrow: "信頼と透明性",
        trustTitle: "無料で試し、読み方の前提も確認できます",
        trustBody: "編集方針、AI 免責、プライバシー、レビュー、質問例を確認できます。",
        items: [
          { href: "/daily-tarot", title: "今日のタロット", body: "一枚引き、記録、リマインダー。" },
          { href: "/free-tarot-tools", title: "Free Tools", body: "無料リーディング、毎日の一枚、質問、スプレッド、カード意味の入口。" },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "恋愛、仕事、Yes/No に合うスプレッド。" },
          { href: "/tarot-questions", title: "質問別タロット", body: "復縁、恋愛、仕事、Yes/No から開始。" },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "短い答えと理由を確認。" },
          { href: "/love-tarot-reading", title: "恋愛タロット", body: "気持ち、復縁、関係の流れ。" },
          { href: "/tarot-card-meanings", title: "カードの意味", body: "正位置、逆位置、恋愛、仕事、金運。" },
          { href: "/tarot-card-combinations", title: "カードの組み合わせ", body: "よくあるペアから無料リーディングへ進みます。" },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/contact", title: "Contact" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "読者の声",
        feedbackTitle: "よい無料リーディングは、次の一歩を少し明確にします",
        feedbackBody: "私たちは、速く、具体的で、過度に断定せず、また戻ってきやすい体験を目指しています。",
        feedbackItems: [
          { title: "毎日のタロット", body: "一枚だけのカードは、今日の焦点を絞りやすく、続けやすい形式です。" },
          { title: "恋愛の質問", body: "恋愛リーディングは Yes/No だけでなく、観察すべき行動を示します。" },
          { title: "仕事の選択", body: "仕事のスプレッドは、一時的な疲れと計画すべき転機を分けて考えます。" },
        ],
        assuranceItems: [
          { title: "まず無料", body: "初回リーディング、毎日の一枚、カード意味、質問ページは無料で使えます。" },
          { title: "必要な時にアップグレード", body: "深い追質問、履歴保存、高度なスプレッド、長いレポートは後から選べます。" },
          { title: "限界を明確に", body: "AI タロットは内省の補助であり、専門的な助言の代わりではありません。" },
        ],
        growthEyebrow: "始め方",
        growthTitle: "本当に聞きたい質問から、読みやすい解釈へ",
        growthBody: "恋愛、仕事、選択など今気になっている質問を書き、スプレッドを確認して直感でカードを選びます。",
        growthItems: [
          { title: "質問を書く", body: "恋愛、仕事、復縁、選択など、知りたいことを自分の言葉で入力します。", href: "/free-ai-tarot-reading" },
          { title: "スプレッドを選ぶ", body: "無料の三枚引きから始め、必要に応じて毎日の一枚やテーマ別スプレッドへ進めます。", href: "/tarot-spreads" },
          { title: "直感で引く", body: "デッキの準備ができたらカードを選び、カード・位置・質問を合わせて読みます。", href: "/tarot-questions" },
          { title: "意味を確認する", body: "カード意味、例、AI 免責を見ながら、解釈の範囲を理解できます。", href: "/tarot-card-meanings" },
        ],
        questionEyebrow: "よくある質問",
        questionTitle: "本当に聞きたいことから始める",
        questionBody: "質問の言い方に迷う時は、下の入口を選び、自分の状況に合わせて細部を足してください。",
        questionItems: [
          { href: "/will-my-ex-come-back-tarot", title: "Will my ex come back?", body: "復縁、連絡、タイミング、待つ意味を確認。" },
          { href: "/does-he-love-me-tarot", title: "Does he love me?", body: "気持ちだけでなく行動と一貫性も見る。" },
          { href: "/yes-or-no-tarot-love", title: "Yes or no love tarot", body: "Yes、No、Not yet の理由まで確認。" },
          { href: "/career-tarot-reading", title: "Career tarot reading", body: "仕事の方向性、負荷、リスク、次の一歩。" },
          { href: "/should-i-quit-my-job-tarot", title: "Should I quit my job?", body: "疲れと本当の転機、退職前の準備を分ける。" },
          { href: "/what-does-he-think-of-me-tarot", title: "What does he think of me?", body: "曖昧な態度、沈黙、本音、次の行動を見る。" },
          { href: "/will-he-contact-me-tarot", title: "Will he contact me?", body: "連絡待ち、返信遅れ、別れ後の沈黙、境界線。" },
          { href: "/is-this-relationship-over-tarot", title: "Is this relationship over?", body: "距離、衝突、修復の可能性、手放すサイン。" },
          { href: "/will-i-get-the-job-tarot", title: "Will I get the job?", body: "面接、オファー、応募、昇進、フォローアップ。" },
          { href: "/should-i-take-this-job-tarot", title: "Should I take this job?", body: "給与、文化、安定性、成長、交渉材料。" },
          { href: "/will-i-be-successful-tarot", title: "Will I be successful?", body: "試験、企画、公開、創作、次に動かせる一歩。" },
        ],
      },
      ko: {
        eyebrow: "다음 탐색",
        title: "매일 돌아오거나 구체적인 질문을 해보세요",
        body: "데일리 타로, 무료 도구, 스프레드, 카드 의미를 이어서 보며 리딩의 맥락을 더 넓힐 수 있습니다.",
        trustEyebrow: "신뢰와 투명성",
        trustTitle: "무료로 시작하고, 해석 기준도 확인하세요",
        trustBody: "편집 원칙, AI 안내, 개인정보, 리뷰, 실제 질문 예시를 확인할 수 있습니다.",
        items: [
          { href: "/daily-tarot", title: "오늘의 타로", body: "한 장 뽑기, 기록, 알림." },
          { href: "/free-tarot-tools", title: "Free Tools", body: "무료 리딩, 데일리 타로, 질문 페이지, 스프레드, 카드 의미 입구." },
          { href: "/tarot-spreads", title: "Tarot Spreads", body: "사랑, 커리어, 예/아니오 질문별 스프레드." },
          { href: "/tarot-questions", title: "질문별 타로", body: "재회, 사랑, 커리어, 예/아니오로 시작." },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "빠른 답과 그 이유." },
          { href: "/love-tarot-reading", title: "연애 타로", body: "감정, 재회, 관계 흐름." },
          { href: "/tarot-card-meanings", title: "카드 의미", body: "정방향, 역방향, 사랑, 커리어, 조언." },
          { href: "/tarot-card-combinations", title: "카드 조합", body: "자주 나오는 조합에서 무료 스프레드로 이어집니다." },
        ],
        trustItems: [
          { href: "/about", title: "About" },
          { href: "/official-channels", title: "Official" },
          { href: "/contact", title: "Contact" },
          { href: "/editorial-policy", title: "Editorial" },
          { href: "/ai-tarot-disclaimer", title: "AI Disclaimer" },
          { href: "/privacy", title: "Privacy" },
          { href: "/reviews", title: "Reviews" },
          { href: "/tarot-reading-examples", title: "Examples" },
        ],
        feedbackEyebrow: "사용자 피드백",
        feedbackTitle: "좋은 무료 리딩은 다음 행동을 더 분명하게 만듭니다",
        feedbackBody: "빠르고, 구체적이며, 과장하지 않고, 다시 돌아오기 쉬운 경험을 기준으로 제품을 다듬고 있습니다.",
        feedbackItems: [
          { title: "데일리 타로", body: "하루 한 장은 막연한 운세보다 오늘의 초점을 하나로 잡기 쉽습니다." },
          { title: "연애 질문", body: "관계 리딩은 예/아니오뿐 아니라 다음에 관찰할 행동을 설명해야 합니다." },
          { title: "커리어 선택", body: "커리어 스프레드는 일시적 번아웃과 실제 전환 신호를 구분하는 데 도움을 줍니다." },
        ],
        assuranceItems: [
          { title: "무료 우선", body: "첫 리딩, 데일리 타로, 카드 의미, 질문 페이지는 먼저 무료로 이용할 수 있습니다." },
          { title: "필요할 때 업그레이드", body: "심층 후속 질문, 기록 저장, 고급 스프레드, 긴 리포트는 나중에 열 수 있습니다." },
          { title: "명확한 한계", body: "AI 타로는 성찰을 돕는 도구이며 전문 조언을 대체하지 않습니다." },
        ],
        growthEyebrow: "시작 방법",
        growthTitle: "진짜 질문 하나에서 선명한 리딩으로",
        growthBody: "지금 마음에 있는 사랑, 커리어, 선택의 질문을 쓰고 스프레드를 확인한 뒤 직감으로 카드를 선택하세요.",
        growthItems: [
          { title: "질문을 적기", body: "사랑, 커리어, 재회, 선택처럼 알고 싶은 내용을 자신의 말로 입력합니다.", href: "/free-ai-tarot-reading" },
          { title: "스프레드 선택", body: "무료 세 장 스프레드로 시작하거나 상황에 맞게 데일리 타로와 주제별 스프레드를 선택합니다.", href: "/tarot-spreads" },
          { title: "직감으로 뽑기", body: "덱이 준비되면 카드를 고르고 카드, 위치, 질문을 함께 읽습니다.", href: "/tarot-questions" },
          { title: "카드 의미 확인", body: "카드 의미, 예시, AI 안내를 보며 리딩이 도울 수 있는 범위를 이해합니다.", href: "/tarot-card-meanings" },
        ],
        questionEyebrow: "자주 묻는 질문",
        questionTitle: "정말 묻고 싶은 질문에서 시작하세요",
        questionBody: "질문을 어떻게 써야 할지 어렵다면 아래 입구를 선택하고 자신의 상황을 더해보세요.",
        questionItems: [
          { href: "/will-my-ex-come-back-tarot", title: "Will my ex come back?", body: "재회, 연락, 타이밍, 기다림의 의미를 확인." },
          { href: "/does-he-love-me-tarot", title: "Does he love me?", body: "감정과 행동, 일관성, 정서적 안전감을 함께 봅니다." },
          { href: "/yes-or-no-tarot-love", title: "Yes or no love tarot", body: "Yes, no, not yet 뒤의 이유까지 확인합니다." },
          { href: "/career-tarot-reading", title: "Career tarot reading", body: "일의 방향, 압박, 리스크, 다음 실천 단계." },
          { href: "/should-i-quit-my-job-tarot", title: "Should I quit my job?", body: "번아웃과 실제 전환 신호, 퇴사 전 준비를 구분." },
          { href: "/what-does-he-think-of-me-tarot", title: "What does he think of me?", body: "애매한 신호, 침묵, 속마음, 다음 행동 가능성." },
          { href: "/will-he-contact-me-tarot", title: "Will he contact me?", body: "무연락, 늦은 답장, 이별 후 침묵, 건강한 경계." },
          { href: "/is-this-relationship-over-tarot", title: "Is this relationship over?", body: "거리감, 반복 갈등, 회복 가능성, 놓아야 할 신호." },
          { href: "/will-i-get-the-job-tarot", title: "Will I get the job?", body: "면접, 오퍼, 지원, 승진 가능성, 후속 행동." },
          { href: "/should-i-take-this-job-tarot", title: "Should I take this job?", body: "연봉, 문화, 안정성, 성장, 협상 포인트." },
          { href: "/will-i-be-successful-tarot", title: "Will I be successful?", body: "프로젝트, 시험, 출시, 창작, 다음 실천 단계." },
        ],
      },
    }[language]

  const layoutCopy =
    {
      zh: {
        pathsEyebrow: "热门入口",
        pathsTitle: "从你真正想问的问题开始",
        pathsBody: "不用先学习塔罗。选择一个接近你处境的问题，再把细节改成自己的。",
        previewEyebrow: "解读示例",
        previewTitle: "你会得到答案，也会知道下一步怎么做",
        previewQuestion: "他最近忽冷忽热，我应该继续投入吗？",
        previewAnswer: "核心答案",
        previewAnswerBody: "先停止猜测，用对方持续、可观察的行动判断投入是否对等。",
        previewPattern: "牌面线索",
        previewPatternBody: "吸引仍在，但节奏不一致；真正的阻碍是承诺和沟通没有落地。",
        previewNext: "下一步",
        previewNextBody: "给关系一个清晰边界和时间点，再根据行动而不是承诺做决定。",
        toolsEyebrow: "继续探索",
        toolsTitle: "免费工具、每日回访和 78 张牌义",
        memberEyebrow: "需要更深时再升级",
        memberTitle: "免费完成第一次解读，会员负责长期价值",
        memberBody: "Plus 用于深度追问、历史保存、高级牌阵和周期报告，不挡住第一次体验。",
        memberCta: "查看会员方案",
        freeLabel: "免费",
        freeBody: "首次完整解读、每日塔罗、基础牌阵与牌义",
        plusLabel: "Plus",
        plusBody: "深度追问、历史、高级牌阵与长期报告",
        trustTitle: "透明、私密，并清楚说明 AI 的边界",
      },
      en: {
        pathsEyebrow: "Popular paths",
        pathsTitle: "Start with the question you actually want to ask",
        pathsBody: "You do not need to study tarot first. Pick the closest question, then make the details your own.",
        previewEyebrow: "Reading preview",
        previewTitle: "Get a clear answer and a practical next step",
        previewQuestion: "They have become hot and cold. Should I keep investing in this relationship?",
        previewAnswer: "Core answer",
        previewAnswerBody: "Pause the guessing and judge reciprocity through consistent, observable action.",
        previewPattern: "Card pattern",
        previewPatternBody: "Attraction remains, but the rhythm is uneven; commitment and communication have not become action.",
        previewNext: "Next step",
        previewNextBody: "Set one clear boundary and timeframe, then decide from behavior rather than promises.",
        toolsEyebrow: "Keep exploring",
        toolsTitle: "Free tools, a daily return, and all 78 card meanings",
        memberEyebrow: "Upgrade only when you need depth",
        memberTitle: "Complete the first reading free; use Plus for continuity",
        memberBody: "Plus adds deeper follow-ups, saved history, advanced spreads, and recurring reports without blocking the first experience.",
        memberCta: "See membership",
        freeLabel: "Free",
        freeBody: "First complete reading, Daily Tarot, starter spreads, and meanings",
        plusLabel: "Plus",
        plusBody: "Deep follow-ups, history, advanced spreads, and longer reports",
        trustTitle: "Private by default, transparent about AI, and clear about limits",
      },
      ja: {
        pathsEyebrow: "人気の入口",
        pathsTitle: "本当に聞きたい質問から始める",
        pathsBody: "先にタロットを学ぶ必要はありません。近い質問を選び、自分の状況に合わせてください。",
        previewEyebrow: "リーディング例",
        previewTitle: "答えと、次にできることを受け取る",
        previewQuestion: "相手の態度が不安定です。この関係に投資し続けるべきですか？",
        previewAnswer: "核心の答え",
        previewAnswerBody: "推測を止め、一貫して観察できる行動で関係の対等さを判断します。",
        previewPattern: "カードの流れ",
        previewPatternBody: "魅力は残っていますが、歩調が合わず、約束と対話が行動になっていません。",
        previewNext: "次の一歩",
        previewNextBody: "境界線と期限を一つ決め、言葉ではなく行動から判断します。",
        toolsEyebrow: "さらに探索",
        toolsTitle: "無料ツール、毎日の一枚、78 枚のカード意味",
        memberEyebrow: "深さが必要な時だけアップグレード",
        memberTitle: "初回は無料、継続的な価値は Plus で",
        memberBody: "Plus では深い追質問、履歴、高度なスプレッド、定期レポートを利用できます。",
        memberCta: "メンバーを見る",
        freeLabel: "無料",
        freeBody: "初回の完全リーディング、毎日の一枚、基本スプレッド、カード意味",
        plusLabel: "Plus",
        plusBody: "深い追質問、履歴、高度なスプレッド、長期レポート",
        trustTitle: "非公開を基本に、AI と解釈の限界を明示",
      },
      ko: {
        pathsEyebrow: "인기 입구",
        pathsTitle: "정말 묻고 싶은 질문에서 시작하세요",
        pathsBody: "타로를 먼저 공부할 필요가 없습니다. 가까운 질문을 고르고 자신의 상황을 더하세요.",
        previewEyebrow: "리딩 예시",
        previewTitle: "명확한 답과 현실적인 다음 단계를 받으세요",
        previewQuestion: "상대가 요즘 밀고 당깁니다. 이 관계에 계속 투자해야 할까요?",
        previewAnswer: "핵심 답변",
        previewAnswerBody: "추측을 멈추고 지속적이고 관찰 가능한 행동으로 상호성을 판단하세요.",
        previewPattern: "카드 흐름",
        previewPatternBody: "끌림은 남아 있지만 리듬이 맞지 않고 약속과 소통이 행동으로 이어지지 않았습니다.",
        previewNext: "다음 단계",
        previewNextBody: "명확한 경계와 시점을 정한 뒤 말이 아닌 행동으로 결정하세요.",
        toolsEyebrow: "계속 탐색",
        toolsTitle: "무료 도구, 데일리 리딩, 78장 카드 의미",
        memberEyebrow: "깊이가 필요할 때만 업그레이드",
        memberTitle: "첫 리딩은 무료, 지속적인 가치는 Plus로",
        memberBody: "Plus는 심층 질문, 기록, 고급 스프레드, 정기 리포트를 제공합니다.",
        memberCta: "멤버십 보기",
        freeLabel: "무료",
        freeBody: "첫 전체 리딩, 데일리 타로, 기본 스프레드, 카드 의미",
        plusLabel: "Plus",
        plusBody: "심층 질문, 기록, 고급 스프레드, 장기 리포트",
        trustTitle: "기본 비공개, AI 사용과 해석의 한계를 투명하게 안내",
      },
    }[language]

  return (
    <section
      id={HOME_SCROLL_TARGET_ID}
      data-home-scroll-content
      className="relative z-10 mx-auto w-[calc(100%-1.5rem)] max-w-[1120px] pb-[calc(env(safe-area-inset-bottom)+5rem)] pt-12 sm:pt-16 lg:pt-20"
    >
      <div className="max-w-2xl">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#b9c7ff]/76 sm:text-xs">
          {layoutCopy.pathsEyebrow}
        </p>
        <h2 className="mt-2 font-serif text-2xl leading-tight text-white sm:mt-3 sm:text-4xl">{layoutCopy.pathsTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-white/58 sm:mt-4 sm:text-base sm:leading-7">{layoutCopy.pathsBody}</p>
      </div>
      <div data-home-question-paths className="mt-6 grid border-y border-white/10 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
        {copy.questionItems.slice(0, 4).map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group min-w-0 border-b border-white/10 px-1 py-4 transition hover:bg-white/[0.035] sm:px-4 lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <h3 className="break-words text-sm font-medium leading-snug text-[#f2f4ff] sm:text-base">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-white/50 sm:mt-2 sm:text-sm sm:leading-6">{item.body}</p>
          </a>
        ))}
      </div>

      <div data-home-result-preview className="mt-12 border-y border-[#b9c7ff]/18 py-8 sm:mt-16 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#b9c7ff]/76 sm:text-xs">{layoutCopy.previewEyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-white sm:mt-3 sm:text-3xl">{layoutCopy.previewTitle}</h2>
            <p className="mt-4 border-l-2 border-[#b9c7ff]/55 pl-4 text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
              {layoutCopy.previewQuestion}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              [layoutCopy.previewAnswer, layoutCopy.previewAnswerBody],
              [layoutCopy.previewPattern, layoutCopy.previewPatternBody],
              [layoutCopy.previewNext, layoutCopy.previewNextBody],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-white/12 pt-3">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52 sm:text-sm sm:leading-6">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <HomeDailyReturnPanel />
      </div>

      <div className="mt-12 sm:mt-16">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#b9c7ff]/76 sm:text-xs">{layoutCopy.toolsEyebrow}</p>
        <h2 className="mt-2 max-w-2xl font-serif text-2xl leading-tight text-white sm:mt-3 sm:text-3xl">{layoutCopy.toolsTitle}</h2>
        <div className="mt-5 grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {copy.items.slice(0, 6).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group min-w-0 border-b border-white/10 px-1 py-4 transition hover:bg-white/[0.035] sm:px-4 lg:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <h3 className="text-sm font-medium leading-snug text-white sm:text-base">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-white/50 sm:mt-2 sm:text-sm sm:leading-6">{item.body}</p>
            </a>
          ))}
        </div>
      </div>

      <div data-home-membership className="mt-12 border-y border-white/10 py-8 sm:mt-16 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#b9c7ff]/76 sm:text-xs">{layoutCopy.memberEyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl leading-tight text-white sm:mt-3 sm:text-3xl">{layoutCopy.memberTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-white/56 sm:mt-4 sm:text-base sm:leading-7">{layoutCopy.memberBody}</p>
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-t border-white/14 pt-3">
                <h3 className="text-sm font-medium text-white">{layoutCopy.freeLabel}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52 sm:text-sm">{layoutCopy.freeBody}</p>
              </div>
              <div className="border-t border-[#b9c7ff]/45 pt-3">
                <h3 className="text-sm font-medium text-[#e8ecff]">{layoutCopy.plusLabel}</h3>
                <p className="mt-2 text-xs leading-5 text-white/52 sm:text-sm">{layoutCopy.plusBody}</p>
              </div>
            </div>
            <a
              href="/membership"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#b9c7ff] px-5 text-sm font-semibold text-[#0b1026] transition hover:bg-[#d2dbff]"
            >
              {layoutCopy.memberCta}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <h2 className="max-w-xl font-serif text-xl leading-tight text-white sm:text-2xl">{layoutCopy.trustTitle}</h2>
        <nav aria-label="Trust and transparency" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">
          {copy.trustItems.map((item) => (
            <a key={item.href} href={item.href} className="inline-flex min-h-9 items-center text-xs text-white/48 transition hover:text-white sm:text-sm">
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}

function MysticContent() {
  const { language } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [customFront, setCustomFront] = useState<string | null>(null)
  const [customBack, setCustomBack] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const viewport = window.visualViewport
    const userAgent = navigator.userAgent || ""
    const isGoogleAppBrowser = /\bGSA\//i.test(userAgent)
    const isEmbeddedBrowser = isGoogleAppBrowser || /\b(FBAN|FBAV|FBIOS|Instagram|Line\/|MicroMessenger|Pinterest|TikTok|BytedanceWebview)\b/i.test(userAgent)
    let stableTopOffset = 0
    let stableBottomOffset = 0
    let focusOutTimer = 0

    const applyBrowserOffset = (topValue: number, bottomValue: number) => {
      root.style.setProperty("--home-mobile-browser-offset", `${topValue}px`)
      root.style.setProperty("--home-mobile-browser-bottom-offset", `${bottomValue}px`)
    }

    const updateBrowserOffset = () => {
      const offsetTop = viewport?.offsetTop ?? 0
      const viewportHeight = viewport?.height ?? window.innerHeight
      const layoutHeight = document.documentElement.clientHeight || window.innerHeight
      const topOffset = Number.isFinite(offsetTop) ? Math.min(Math.max(offsetTop, 0), 120) : 0
      const bottomOffset = Math.min(Math.max(layoutHeight - topOffset - viewportHeight, 0), 160)
      const mobileWidth = window.innerWidth < 768
      const embeddedTopOffset = mobileWidth && isEmbeddedBrowser ? (isGoogleAppBrowser ? 112 : 72) : 0
      const embeddedBottomOffset = mobileWidth && isEmbeddedBrowser ? (isGoogleAppBrowser ? 88 : 64) : 0

      if (mobileWidth && isTextInputFocused()) {
        applyBrowserOffset(stableTopOffset, stableBottomOffset)
        return
      }

      stableTopOffset = Math.min(topOffset + embeddedTopOffset, 128)
      stableBottomOffset = Math.min(bottomOffset + embeddedBottomOffset, 184)
      applyBrowserOffset(stableTopOffset, stableBottomOffset)
    }

    const updateAfterFocusOut = () => {
      window.clearTimeout(focusOutTimer)
      focusOutTimer = window.setTimeout(updateBrowserOffset, 180)
    }

    updateBrowserOffset()
    viewport?.addEventListener("resize", updateBrowserOffset)
    viewport?.addEventListener("scroll", updateBrowserOffset)
    window.addEventListener("orientationchange", updateBrowserOffset)
    document.addEventListener("focusin", updateBrowserOffset)
    document.addEventListener("focusout", updateAfterFocusOut)

    return () => {
      window.clearTimeout(focusOutTimer)
      viewport?.removeEventListener("resize", updateBrowserOffset)
      viewport?.removeEventListener("scroll", updateBrowserOffset)
      window.removeEventListener("orientationchange", updateBrowserOffset)
      document.removeEventListener("focusin", updateBrowserOffset)
      document.removeEventListener("focusout", updateAfterFocusOut)
      root.style.removeProperty("--home-mobile-browser-offset")
      root.style.removeProperty("--home-mobile-browser-bottom-offset")
    }
  }, [])

  const heroCopy =
    {
      zh: {
        eyebrow: "免费 AI 塔罗解读",
        title: "先问清楚，再抽牌",
        line: "选择一种解读方式，写下爱情、前任、事业或选择问题。60 秒获得结合牌位与处境的清晰答案。",
        scroll: "查看热门问题与每日塔罗",
      },
      en: {
        eyebrow: "Free AI tarot reading",
        title: "Ask clearly. Draw intuitively.",
        line: "Choose a reading style, ask about love, an ex, career, or a decision, and get a contextual tarot answer in about 60 seconds.",
        scroll: "Explore popular questions and Daily Tarot",
      },
      ja: {
        eyebrow: "無料 AI タロット",
        title: "質問を整え、直感で引く",
        line: "読み方を選び、恋愛、元恋人、仕事、選択について質問。約 60 秒で文脈に沿った答えを受け取れます。",
        scroll: "人気の質問と毎日のタロットを見る",
      },
      ko: {
        eyebrow: "무료 AI 타로 리딩",
        title: "명확히 묻고, 직감으로 뽑으세요",
        line: "리딩 방식을 선택하고 사랑, 전 애인, 커리어, 선택을 질문하세요. 약 60초 안에 맥락 있는 답을 받습니다.",
        scroll: "인기 질문과 데일리 타로 보기",
      },
    }[language]

  return (
    <div className="allow-scroll home-hero-stage relative bg-mystic-bg">
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full">
        <BackgroundGradient />
        <StarsLayer count={isMobile ? 80 : 150} />
      </div>

      <HomeHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {menuOpen && (
        <MenuPanel
          isOpen={menuOpen}
          frontImage={customFront}
          backImage={customBack}
          onFrontChange={setCustomFront}
          onBackChange={setCustomBack}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <div
        data-home-hero-shell
        className="home-hero-shell relative z-10 mx-auto flex w-[calc(100%-1.5rem)] max-w-[1120px] flex-col items-center px-0 pb-10 text-center sm:pb-12"
      >
        <section
          data-home-hero-copy
          className="relative z-30 mx-auto max-w-[46rem]"
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9c7ff]/82 sm:text-xs">
            {heroCopy.eyebrow}
          </p>
          <h1 className="mt-3 text-balance font-serif text-[2rem] leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
            {heroCopy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-[39rem] break-words text-sm leading-6 text-white/58 [overflow-wrap:anywhere] sm:mt-4 sm:text-base sm:leading-7">
            {heroCopy.line}
          </p>
        </section>

        <div
          data-home-card-scene
          className="relative z-20 mt-2 flex h-36 w-full items-center justify-center overflow-visible sm:mt-3 sm:h-40 lg:h-44"
        >
          <div data-home-card-focal className="relative h-0 w-0 overflow-visible">
            <div
              data-home-focal-glow
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-0 h-[var(--home-hero-glow-size)] w-[var(--home-hero-glow-size)] rounded-full bg-[radial-gradient(circle,rgba(246,244,255,0.56)_0%,rgba(155,170,236,0.34)_32%,rgba(76,42,120,0.12)_58%,transparent_76%)] blur-2xl mix-blend-screen"
              style={{ transform: "translate3d(-50%, -50%, 0)" }}
            />
            <CoreLight
              className="pointer-events-none absolute left-0 top-0 z-0 flex h-0 w-0 items-center justify-center"
            />
            <div
              data-home-card-anchor
              className="absolute left-0 top-0 z-10 flex h-[var(--home-hero-card-height)] w-[var(--home-hero-card-width)] items-center justify-center overflow-visible"
              style={{ transform: "translate3d(-50%, -50%, 0)" }}
            >
              <TarotCard
                frontImage={customFront || DEFAULT_FRONT}
                backImage={customBack || DEFAULT_BACK}
                tiltAngle={-15}
                rotationDuration={16}
              />
            </div>
          </div>
        </div>

        <div data-home-hero-actions className="relative z-30 mt-3 w-full">
          <HomeQuestionForm />
        </div>

        <a
          data-home-scroll-cue
          href={`#${HOME_SCROLL_TARGET_ID}`}
          onClick={scrollToHomeContent}
          className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs text-white/45 transition hover:text-white sm:mt-8 sm:text-sm"
        >
          <span>{heroCopy.scroll}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        </a>
      </div>

      <HomeScrollContent />
      <MysticAnimations />
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
    </div>
  )
}

export default function MysticBackground() {
  return <MysticContent />
}
