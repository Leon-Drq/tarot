"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BackgroundGradient } from "./mystic/background-gradient"
import { StarsLayer } from "./mystic/stars-layer"
import { CoreLight } from "./mystic/core-light"
import { TarotCard } from "./mystic/tarot-card"
import { MysticAnimations } from "./mystic/mystic-animations"
import { StartButton } from "./tarot/start-button"
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
        line: "質問してカードを引き、まず無料で AI リーディングを体験できます。",
        daily: "今日の一枚",
        guide: "カードの意味",
      },
      ko: {
        eyebrow: "무료 AI 타로 도구",
        line: "질문하고 카드를 뽑아 먼저 무료 AI 리딩을 받아보세요.",
        daily: "오늘의 카드",
        guide: "카드 의미",
      },
    }[language]

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-mystic-bg">
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

      {/* 1. Background gradient */}
      <BackgroundGradient />

      {/* 2. Dynamic twinkling stars */}
      <StarsLayer count={isMobile ? 80 : 150} />

      {/* 3. Core light effect */}
      <CoreLight />

      <section className="pointer-events-none absolute left-1/2 top-[13%] z-30 w-[min(90vw,680px)] -translate-x-1/2 text-center sm:top-[15%] md:top-[16%]">
        <p className="text-[10px] uppercase tracking-[0.26em] text-mystic-gold-bright/85 sm:text-xs">
          {heroCopy.eyebrow}
        </p>
        <p className="mx-auto mt-3 max-w-[20rem] break-words text-xs leading-6 text-white/62 sm:max-w-[34rem] sm:text-sm md:text-base">
          {heroCopy.line}
        </p>
        <div className="pointer-events-auto mt-3 flex items-center justify-center gap-2 text-[11px] text-white/58 sm:text-xs">
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

      <StartButton />

      <div className="absolute bottom-[2.5%] left-1/2 z-30 flex w-[min(92vw,520px)] -translate-x-1/2 items-center justify-center gap-3 text-[11px] text-white/44 sm:bottom-[3.5%] sm:text-xs">
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
