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
            className="absolute inset-0 z-10 opacity-100 transition-all duration-1000"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(101, 80, 176, 0.72) 0%, rgba(31, 18, 53, 0.92) 48%, rgba(8, 3, 16, 0.98) 100%)",
              backdropFilter: "blur(10px)",
            }}
          />

          <div className="absolute inset-0 z-20 flex translate-y-0 flex-col items-center justify-center gap-5 overflow-visible px-5 py-[calc(env(safe-area-inset-top)+2rem)] opacity-100 transition-all delay-300 duration-700 sm:gap-6 sm:px-6 md:gap-7">
            <div className="flex flex-col items-center gap-3 text-center">
              <p 
                className="text-xs uppercase text-[#c9c0ff]/68 md:text-sm" 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300
                }}
              >
                {t("tarot.questionInputSubtitle")}
              </p>
              <h1 
                className="max-w-[17rem] whitespace-normal break-words text-center text-[1.45rem] leading-tight text-white/86 sm:max-w-xl sm:text-3xl"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                }}
              >
                {t("tarot.questionInputTitle")}
              </h1>
            </div>

            <div className="relative flex h-16 w-[18rem] max-w-[calc(100vw-2.5rem)] items-center justify-center overflow-hidden sm:w-full sm:max-w-xl">
              <button
                type="button"
                key={currentQuestionIndex}
                className="animate-fade-in-up group absolute rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-center transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.07]"
                onClick={() => setQuestion(suggestedQuestions[currentQuestionIndex])}
              >
                <span className="line-clamp-2 text-sm leading-6 text-white/58 transition-colors duration-300 group-hover:text-white/82 md:text-base">
                  {suggestedQuestions[currentQuestionIndex]}
                </span>
              </button>
            </div>

            <div className="relative w-[18rem] max-w-[calc(100vw-2.5rem)] sm:w-full sm:max-w-xl">
              <div 
                className="absolute -inset-1 rounded-lg opacity-45 blur-xl transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(191, 182, 255, 0.32) 0%, transparent 72%)",
                }}
              />
              <div className="relative rounded-lg border border-white/14 bg-black/38 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md transition focus-within:border-[#bfb6ff]/60 md:px-5 md:py-4">
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="text"
                    value={question}
                    autoFocus
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={t("tarot.questionInputPlaceholder")}
                    className="min-w-0 flex-1 bg-transparent text-base text-white/90 outline-none placeholder:text-white/32 md:text-lg"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!question.trim() || hasSubmitted}
              className="group relative w-[18rem] max-w-[calc(100vw-2.5rem)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:w-full sm:max-w-xl"
            >
              <div className="relative flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_48%,#8172e8_100%)] px-6 py-3 text-[#120c22] shadow-[0_18px_45px_rgba(129,114,232,0.26)] transition duration-300 group-hover:brightness-110">
                <div className="flex items-center">
                  <span className="whitespace-nowrap text-sm font-medium transition-colors duration-300 md:text-base">
                    {t("tarot.selectCardButton")}
                  </span>
                </div>
              </div>
            </button>

            <p className="text-xs text-white/40 text-center max-w-md">
              {t("tarot.questionInputBottomHint")}
            </p>
          </div>
        </>
      )}
    </>
  )
}
