"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"

export function StartButton() {
  const { t, language } = useLanguage()
  const { startAudio } = useAudio()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    startAudio()
    router.push("/input")
  }

  const freeLabel =
    {
      zh: "免费抽一次",
      en: "Free Reading",
      ja: "無料リーディング",
      ko: "무료 리딩",
    }[language] || t("tarot.startReading")

  const subLabel =
    {
      zh: "先体验，再决定是否升级",
      en: "Start first, upgrade later",
      ja: "まず体験、アップグレードは後で",
      ko: "먼저 체험하고 나중에 업그레이드",
    }[language] || "Start first, upgrade later"

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-[calc(env(safe-area-inset-bottom)+4.7rem)] sm:bottom-[9%] md:bottom-[10%] left-1/2 -translate-x-1/2 z-30 group"
    >
      <div className="relative cursor-pointer inline-flex flex-col items-center gap-2">
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, var(--mystic-glow) 0%, transparent 70%)",
            transform: "scale(2.4)",
          }}
        />

        <span
          className="rounded-full border border-mystic-gold/45 bg-black/25 px-7 py-3 text-sm sm:text-lg md:text-xl tracking-[0.08em] sm:tracking-[0.15em] text-mystic-foreground whitespace-nowrap transition-all duration-300 group-hover:border-mystic-gold group-hover:bg-mystic-gold/10 group-hover:drop-shadow-[0_0_10px_var(--mystic-glow-strong)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {freeLabel}
        </span>
        <span className="text-[11px] sm:text-xs tracking-[0.12em] text-white/45 whitespace-nowrap">
          {subLabel}
        </span>
      </div>
    </button>
  )
}
