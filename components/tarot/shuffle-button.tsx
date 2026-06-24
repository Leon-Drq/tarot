"use client"

import { useLanguage } from "@/contexts/language-context"
import type { SeoLocale } from "@/lib/locales"

interface ShuffleButtonProps {
  visible: boolean
  onClick: () => void
  locale?: SeoLocale
}

export function ShuffleButton({ visible, onClick, locale }: ShuffleButtonProps) {
  const { t, language } = useLanguage()
  const label =
    {
      zh: "洗牌",
      en: "Shuffle",
      ja: "シャッフル",
      ko: "셔플",
      es: "Barajar",
      "pt-br": "Embaralhar",
    }[locale || language] || t("tarot.shuffle")

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+2rem)] left-1/2 z-40 -translate-x-1/2 transition-all duration-700 sm:bottom-12 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <button
        onClick={onClick}
        className="px-8 sm:px-12 py-3 sm:py-4 rounded-full uppercase tracking-[3px] text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          fontFamily: "var(--font-sans)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(201,192,255,0.12)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(201,192,255,0.14)"
          e.currentTarget.style.borderColor = "rgba(201,192,255,0.56)"
          e.currentTarget.style.boxShadow = "0 4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(129,114,232,0.28)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.3)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(201,192,255,0.12)"
        }}
      >
        <span className="flex items-center gap-2">
          {/* 洗牌图标 */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {label}
        </span>
      </button>
    </div>
  )
}
