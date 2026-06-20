"use client"

import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"

export function StartButton() {
  const { t } = useLanguage()
  const { startAudio } = useAudio()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    startAudio()
    router.push("/input")
  }

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] left-1/2 -translate-x-1/2 z-30 group"
    >
      <div className="relative cursor-pointer inline-flex items-center">
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, var(--mystic-glow) 0%, transparent 70%)",
            transform: "scale(2)",
          }}
        />

        <span
          className="text-sm sm:text-lg md:text-xl tracking-[0.08em] sm:tracking-[0.15em] text-mystic-foreground whitespace-nowrap transition-all duration-300 group-hover:drop-shadow-[0_0_10px_var(--mystic-glow-strong)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("tarot.startReading")}
        </span>
      </div>
    </button>
  )
}
