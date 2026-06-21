"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface QuestionInputProps {
  visible?: boolean
  onSubmit?: (question: string) => void
  initialQuestion?: string
}

export function QuestionInput({ visible = true, onSubmit, initialQuestion = "" }: QuestionInputProps) {
  const { t, language } = useLanguage()
  const [question, setQuestion] = useState(initialQuestion)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // 直接从翻译对象获取建议问题列表
  const suggestedQuestions = translations[language]?.tarot?.suggestedQuestions || []

  // Auto-scroll suggested questions
  useEffect(() => {
    if (suggestedQuestions.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuestionIndex((prev) => (prev + 1) % suggestedQuestions.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [suggestedQuestions.length])

  useEffect(() => {
    if (initialQuestion && !hasSubmitted) {
      setQuestion(initialQuestion)
    }
  }, [initialQuestion, hasSubmitted])

  const handleSubmit = () => {
    if (question.trim() && !hasSubmitted) {
      setHasSubmitted(true)
      sessionStorage.setItem("tarot_question", question)
      onSubmit?.(question)
    }
  }

  if (!visible && hasSubmitted) {
    return null
  }

  return (
    <>
      {visible && (
        <>
          <div
            className="absolute inset-0 z-10 transition-all duration-1000 opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(90, 60, 133, 0.85) 0%, rgba(36, 20, 56, 0.9) 50%, rgba(15, 5, 24, 0.95) 100%)",
              backdropFilter: "blur(8px)",
            }}
          />

          <div className="relative z-20 flex flex-col items-center justify-center gap-6 md:gap-8 w-full max-w-3xl px-6 transition-all duration-700 delay-300 opacity-100 translate-y-0 overflow-hidden">
            {/* Decorative top element */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-mystic-gold/40" />
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-mystic-gold/60">
                <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="6" cy="6" r="1.5" fill="currentColor" />
              </svg>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-mystic-gold/40" />
            </div>

            {/* Main heading */}
            <div className="flex flex-col items-center gap-3">
              <p 
                className="text-white/40 text-xs md:text-sm mb-2" 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300
                }}
              >
                {t("tarot.questionInputSubtitle")}
              </p>
              <h1 
                className="text-2xl md:text-3xl text-white/70 tracking-wide"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  letterSpacing: '0.15em'
                }}
              >
                {t("tarot.questionInputTitle")}
              </h1>
            </div>

            {/* Scrolling suggested questions */}
            <div className="h-14 overflow-hidden relative w-full max-w-2xl flex justify-center items-center">
              <div 
                key={currentQuestionIndex}
                className="animate-fade-in-up absolute cursor-pointer group px-4"
                onClick={() => setQuestion(suggestedQuestions[currentQuestionIndex])}
              >
                <div className="flex items-center justify-center gap-2 text-center">
                  <span className="text-white/30 text-sm md:text-base">•</span>
                  <span className="text-white/50 text-sm md:text-lg group-hover:text-white/80 transition-colors duration-300">
                    {suggestedQuestions[currentQuestionIndex]}
                  </span>
                  <span className="text-white/30 text-sm md:text-base">•</span>
                </div>
              </div>
            </div>

            {/* Mystic symbols decoration */}
            <div className="flex items-center gap-3 text-white/20 text-base md:text-lg">
              <span style={{ fontFamily: 'var(--font-display)' }}>⋆</span>
              <span style={{ fontFamily: 'var(--font-display)' }}>⊹</span>
              <span style={{ fontFamily: 'var(--font-display)' }}>✦</span>
              <span style={{ fontFamily: 'var(--font-display)' }}>⊹</span>
              <span style={{ fontFamily: 'var(--font-display)' }}>⋆</span>
            </div>

            {/* Input field */}
            <div className="w-full max-w-xl relative">
              {/* 金色光晕效果 */}
              <div 
                className="absolute -inset-1 rounded-2xl opacity-50 blur-lg transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, var(--mystic-gold) 0%, transparent 70%)",
                }}
              />
              <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-mystic-gold/20 px-6 py-4 md:px-8 md:py-5 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="text"
                    value={question}
                    autoFocus
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={t("tarot.questionInputPlaceholder")}
                    className="flex-1 bg-transparent text-white/90 text-base md:text-lg outline-none placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || hasSubmitted}
              className="group relative px-12 py-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative border border-mystic-gold/50 rounded-full px-10 py-3 md:px-12 md:py-4 group-hover:border-mystic-gold group-disabled:group-hover:border-mystic-gold/50 transition-all duration-300 bg-black/20 backdrop-blur-sm shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-disabled:group-hover:opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle,_rgba(212,175,55,0.2)_0%,_transparent_70%)] blur-xl -z-10" />

                <div className="flex items-center gap-3">
                  <div className="w-6 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-mystic-gold/60" />
                  <span className="text-mystic-gold-bright group-hover:text-white transition-colors duration-300 text-sm md:text-base tracking-[0.2em] font-medium whitespace-nowrap">
                    {t("tarot.selectCardButton")}
                  </span>
                  <div className="w-6 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-mystic-gold/60" />
                </div>
              </div>
            </button>

            {/* Bottom hint */}
            <p className="text-xs text-white/40 text-center max-w-md">
              {t("tarot.questionInputBottomHint")}
            </p>
          </div>
        </>
      )}
    </>
  )
}
