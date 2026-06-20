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

const DEFAULT_FRONT = "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/0.png"
const DEFAULT_BACK = "https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/back1.jpg"

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
