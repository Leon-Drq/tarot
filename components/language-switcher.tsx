"use client"

import React, { useState } from "react"
import { useLanguage, LANGUAGES, type Language } from "@/contexts/language-context"
import { ChevronDown } from "lucide-react"

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
              ? "bg-black/42 border-[#aaa1ff]/45 text-white shadow-[0_0_18px_rgba(170,161,255,0.18)]"
              : "bg-black/20 border-white/10 text-white/60 hover:bg-black/30 hover:text-white/90 hover:border-white/20"
          }
        `}
        aria-label="Change language"
      >
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
          <div className="absolute right-0 mt-2 w-32 sm:w-36 bg-[#0f0518]/90 backdrop-blur-xl border border-[#aaa1ff]/20 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
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
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }
                  `}
                >
                  {language === lang && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#aaa1ff] shadow-[2px_0_10px_rgba(170,161,255,0.22)]" />
                  )}
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    {LANGUAGES[lang].name}
                  </span>
                  {language === lang && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#aaa1ff] shadow-[0_0_8px_rgba(170,161,255,0.45)]" />
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
