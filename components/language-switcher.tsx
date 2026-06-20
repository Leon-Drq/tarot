"use client"

import React, { useState } from "react"
import { useLanguage, LANGUAGES, type Language } from "@/contexts/language-context"
import { Globe, ChevronDown } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-center gap-1.5 sm:gap-2 
          h-8 px-2.5 sm:h-9 sm:px-3.5 md:h-10 md:px-4 
          rounded-full transition-all duration-300 backdrop-blur-md border 
          ${
            isOpen
              ? "bg-black/40 border-mystic-gold/50 text-mystic-gold-bright shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              : "bg-black/20 border-white/10 text-white/60 hover:bg-black/30 hover:text-white/90 hover:border-white/20"
          }
        `}
        aria-label="Change language"
      >
        <Globe className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 ${isOpen ? "rotate-180" : "group-hover:rotate-12"}`} />
        <span className="text-xs sm:text-sm font-medium tracking-wide font-sans">
          {LANGUAGES[language].name}
        </span>
        <ChevronDown 
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : "text-white/40 group-hover:text-white/60"}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 语言选择菜单 */}
          <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-[#0f0518]/90 backdrop-blur-xl border border-mystic-gold/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="py-1">
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    w-full px-3 py-2 sm:px-4 sm:py-2.5 text-left transition-all duration-200 flex items-center gap-2 sm:gap-3
                    group relative
                    ${
                      language === lang
                        ? "text-mystic-gold-bright bg-white/10"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }
                  `}
                >
                  {language === lang && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-mystic-gold-bright shadow-[2px_0_10px_rgba(255,215,100,0.3)]" />
                  )}
                  <span className="text-sm sm:text-base leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                    {LANGUAGES[lang].flag}
                  </span>
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    {LANGUAGES[lang].name}
                  </span>
                  {language === lang && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mystic-gold-bright shadow-[0_0_8px_#ffd764]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

