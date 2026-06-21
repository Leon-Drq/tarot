"use client"

import { useEffect, useState, Suspense, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, BookOpen, CalendarDays, Heart, Sparkles } from "lucide-react"
import { BackgroundGradient } from "./mystic/background-gradient"
import { StarsLayer } from "./mystic/stars-layer"
import { CoreLight } from "./mystic/core-light"
import { TarotCard } from "./mystic/tarot-card"
import { MysticAnimations } from "./mystic/mystic-animations"
import { OnlineCounter } from "./tarot/online-counter"
import { MenuButton } from "./menu-button"
import { MenuPanel } from "./menu-panel"
import { LanguageSwitcher } from "./language-switcher"
import { useLanguage } from "@/contexts/language-context"

const DEFAULT_FRONT = "/images/0.png"
const DEFAULT_BACK = "/images/back1.jpg"

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

function HomeQuestionForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const [question, setQuestion] = useState("")

  const copy =
    {
      zh: {
        label: "从一个真实问题开始",
        placeholder: "输入你的问题...",
        action: "抽牌",
        examples: ["他对我是什么感觉？", "我该换工作吗？", "今天我需要注意什么？"],
      },
      en: {
        label: "Start with one real question",
        placeholder: "Ask your question...",
        action: "Draw",
        examples: ["Will my ex come back?", "Should I quit my job?", "What do I need today?"],
      },
      ja: {
        label: "ひとつの本当の質問から",
        placeholder: "質問を入力...",
        action: "引く",
        examples: ["相手の気持ちは？", "転職すべき？", "今日必要なメッセージは？"],
      },
      ko: {
        label: "진짜 질문 하나로 시작",
        placeholder: "질문을 입력하세요...",
        action: "뽑기",
        examples: ["그 사람 마음은?", "이직해야 할까?", "오늘 필요한 조언은?"],
      },
    }[language]

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) {
      router.push("/input?source=home")
      return
    }
    sessionStorage.setItem("tarot_question", trimmed)
    router.push(`/input?q=${encodeURIComponent(trimmed)}&auto=1&source=home`)
  }

  return (
    <form
      onSubmit={submitQuestion}
      className="absolute bottom-[calc(env(safe-area-inset-bottom)+4.55rem)] left-1/2 z-30 w-[min(90vw,460px)] -translate-x-1/2 sm:bottom-[12%] sm:w-[min(80vw,560px)]"
    >
      <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/38 sm:text-xs">
        {copy.label}
      </p>
      <div className="group relative rounded-lg border border-mystic-gold/25 bg-black/38 p-1 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition focus-within:border-mystic-gold/70">
        <div className="pointer-events-none absolute -inset-1 rounded-lg bg-mystic-gold/10 opacity-0 blur-xl transition group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-2">
          <Sparkles className="ml-3 h-4 w-4 shrink-0 text-mystic-gold/65" />
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={copy.placeholder}
            className="min-w-0 flex-1 bg-transparent py-3 pr-3 text-sm text-white outline-none placeholder:text-white/35 sm:py-4 sm:text-base"
          />
        </div>
      </div>
      <button
        type="submit"
        aria-label={copy.action}
        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-mystic-gold text-sm font-medium text-[#160b25] shadow-[0_0_22px_rgba(212,175,55,0.26)] transition hover:bg-mystic-gold-bright sm:h-11"
      >
        <span>{copy.action}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {copy.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuestion(example)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/58 transition hover:border-mystic-gold/50 hover:text-mystic-gold-bright"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  )
}

function HomeScrollContent() {
  const { language } = useLanguage()
  const copy =
    {
      zh: {
        eyebrow: "继续探索",
        title: "每天回来，或直接问一个具体问题",
        body: "免费入口负责起步；牌义、每日塔罗和长尾问题页负责复访与搜索收录。",
        items: [
          { href: "/daily-tarot", title: "每日塔罗", body: "每日一牌、连续打卡、保存日记。", icon: CalendarDays },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "适合快速判断，但保留 AI 解释。", icon: Sparkles },
          { href: "/love-tarot-reading", title: "爱情塔罗", body: "感情、复合、对方想法专项入口。", icon: Heart },
          { href: "/tarot-card-meanings", title: "牌义大全", body: "78 张牌的正位、逆位和场景解读。", icon: BookOpen },
        ],
      },
      en: {
        eyebrow: "Explore next",
        title: "Come back daily, or ask a precise question",
        body: "Free readings start the loop. Daily tarot, card meanings, and long-tail tools make the site worth revisiting.",
        items: [
          { href: "/daily-tarot", title: "Daily Tarot", body: "One card, streaks, journal, and reminders.", icon: CalendarDays },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "A quick answer with the reason behind it.", icon: Sparkles },
          { href: "/love-tarot-reading", title: "Love Tarot", body: "Feelings, reconnection, and relationship clarity.", icon: Heart },
          { href: "/tarot-card-meanings", title: "Card Meanings", body: "Upright, reversed, love, career, money, and advice.", icon: BookOpen },
        ],
      },
      ja: {
        eyebrow: "次に見る",
        title: "毎日の一枚、または具体的な質問へ",
        body: "無料リーディングから始め、毎日・カード意味・質問別ページで継続利用できます。",
        items: [
          { href: "/daily-tarot", title: "今日のタロット", body: "一枚引き、記録、リマインダー。", icon: CalendarDays },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "短い答えと理由を確認。", icon: Sparkles },
          { href: "/love-tarot-reading", title: "恋愛タロット", body: "気持ち、復縁、関係の流れ。", icon: Heart },
          { href: "/tarot-card-meanings", title: "カードの意味", body: "正位置、逆位置、恋愛、仕事、金運。", icon: BookOpen },
        ],
      },
      ko: {
        eyebrow: "다음 탐색",
        title: "매일 돌아오거나 구체적인 질문을 해보세요",
        body: "무료 리딩으로 시작하고, 데일리 타로와 카드 의미 페이지로 다시 방문하게 만듭니다.",
        items: [
          { href: "/daily-tarot", title: "오늘의 타로", body: "한 장 뽑기, 기록, 알림.", icon: CalendarDays },
          { href: "/yes-or-no-tarot", title: "Yes / No Tarot", body: "빠른 답과 그 이유.", icon: Sparkles },
          { href: "/love-tarot-reading", title: "연애 타로", body: "감정, 재회, 관계 흐름.", icon: Heart },
          { href: "/tarot-card-meanings", title: "카드 의미", body: "정방향, 역방향, 사랑, 커리어, 조언.", icon: BookOpen },
        ],
      },
    }[language]

  return (
    <section className="relative z-10 mx-auto w-[min(92vw,1040px)] px-1 pb-20 pt-12 sm:pt-20">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-mystic-gold-bright/70">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">{copy.title}</h2>
        <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base">{copy.body}</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {copy.items.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-mystic-gold/45 hover:bg-white/[0.075]"
            >
              <Icon className="h-5 w-5 text-mystic-gold/75 transition group-hover:text-mystic-gold-bright" />
              <h3 className="mt-4 text-base font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/52">{item.body}</p>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function MysticContent() {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [customFront, setCustomFront] = useState<string | null>(null)
  const [customBack, setCustomBack] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!mounted) return null

  const heroCopy =
    {
      zh: {
        eyebrow: "免费 AI 塔罗工具",
        line: "先免费抽牌解读；深度追问、历史保存和报告再升级。",
        daily: "每日一牌",
        guide: "牌义大全",
      },
      en: {
        eyebrow: "Free AI Tarot Tool",
        line: "Ask a question, draw cards, and get your first AI tarot reading free.",
        daily: "Daily Card",
        guide: "Card Meanings",
      },
      ja: {
        eyebrow: "無料 AI タロット",
        line: "質問して、まず無料で AI リーディング。",
        daily: "今日の一枚",
        guide: "カードの意味",
      },
      ko: {
        eyebrow: "무료 AI 타로 도구",
        line: "질문하고 먼저 무료 AI 리딩을 받아보세요.",
        daily: "오늘의 카드",
        guide: "카드 의미",
      },
    }[language]

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mystic-bg">
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 1. Background gradient */}
        <BackgroundGradient />

        {/* 2. Dynamic twinkling stars */}
        <StarsLayer count={isMobile ? 80 : 150} />
      </div>

      {/* Header Area - 确保所有元素垂直居中对齐 */}
      <header className="absolute top-4 left-0 right-0 sm:top-6 md:top-8 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none">
        <div className="flex-1 flex justify-start pointer-events-auto">
          <MenuButton isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
        
        <h1 className="font-serif text-lg sm:text-2xl md:text-4xl lg:text-5xl font-semibold tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.3em] text-mystic-foreground drop-shadow-[0_0_15px_var(--mystic-glow)] whitespace-nowrap pointer-events-auto">
          POP TAROT
        </h1>

        <div className="flex-1 flex justify-end pointer-events-auto">
          <LanguageSwitcher />
        </div>
      </header>

      <MenuPanel
        isOpen={menuOpen}
        frontImage={customFront}
        backImage={customBack}
        onFrontChange={setCustomFront}
        onBackChange={setCustomBack}
        onClose={() => setMenuOpen(false)}
      />

      <div className="relative min-h-[100dvh] overflow-hidden">
        {/* 3. Core light effect */}
        <CoreLight />

        <section className="pointer-events-none absolute left-1/2 top-[12%] z-30 w-[min(90vw,680px)] -translate-x-1/2 text-center sm:top-[15%] md:top-[16%]">
          <p className="text-[10px] uppercase tracking-[0.26em] text-mystic-gold-bright/85 sm:text-xs">
            {heroCopy.eyebrow}
          </p>
          <p className="mx-auto mt-3 max-w-[20rem] break-words text-xs leading-6 text-white/62 [overflow-wrap:anywhere] sm:max-w-[34rem] sm:text-sm md:text-base">
            {heroCopy.line}
          </p>
          <div className="pointer-events-auto mt-3 hidden items-center justify-center gap-2 text-[11px] text-white/58 sm:flex sm:text-xs">
            <a
              href="/daily-tarot"
              className="rounded-full border border-white/12 bg-black/20 px-3 py-1.5 transition hover:border-mystic-gold/50 hover:text-mystic-gold-bright"
            >
              {heroCopy.daily}
            </a>
            <a
              href="/tarot-card-meanings"
              className="rounded-full border border-white/12 bg-black/20 px-3 py-1.5 transition hover:border-mystic-gold/50 hover:text-mystic-gold-bright"
            >
              {heroCopy.guide}
            </a>
          </div>
        </section>

        {/* 4. 3D rotating tarot card - use custom images if available */}
        <TarotCard
          frontImage={customFront || DEFAULT_FRONT}
          backImage={customBack || DEFAULT_BACK}
          tiltAngle={-15}
          rotationDuration={8}
        />

        {/* 在线人数显示 */}
        <OnlineCounter />

        <HomeQuestionForm />

        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-1/2 z-30 flex w-[min(92vw,520px)] -translate-x-1/2 items-center justify-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] text-white/52 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md sm:bottom-[3.5%] sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:text-white/44 sm:shadow-none sm:backdrop-blur-0">
          <a href="/daily-tarot" className="transition hover:text-mystic-gold-bright">
            Daily Tarot
          </a>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <a href="/tarot-card-meanings" className="transition hover:text-mystic-gold-bright">
            Card Meanings
          </a>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <a href="/about" className="transition hover:text-mystic-gold-bright">
            About
          </a>
        </div>
      </div>

      <HomeScrollContent />

      {/* Global animations */}
      <MysticAnimations />

      {/* 捕获邀请码 */}
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
    </div>
  )
}

export default function MysticBackground() {
  return <MysticContent />
}
