"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import type { SeoLocale } from "@/lib/locales"

interface QuestionInputProps {
  visible?: boolean
  onSubmit?: (question: string) => void
  initialQuestion?: string
  localeOverride?: SeoLocale
}

const questionInputCopy = {
  zh: {
    title: "告诉我你的心事",
    subtitle: "我会倾听你内心真正的困惑",
    placeholder: "向我倾诉你的困惑...",
    button: "选择卡牌",
    bottomHint: "带着真诚的心，塔罗会为你指引方向",
    suggestedQuestions: [
      "他现在对我还有感觉吗？",
      "这段关系值得继续吗？",
      "我该不该主动联系他？",
      "接下来一个月我需要注意什么？",
      "我最近的财运如何？",
      "现在的方向对吗？",
      "未来三个月会有什么变化？",
      "我的潜意识想告诉我什么？",
    ],
  },
  en: {
    title: "Tell Me What's on Your Mind",
    subtitle: "I will listen to your true concerns",
    placeholder: "Share your concerns with me...",
    button: "Select Cards",
    bottomHint: "With a sincere heart, the tarot will guide you",
    suggestedQuestions: [
      "Does he still have feelings for me?",
      "Is this relationship worth continuing?",
      "Should I reach out first?",
      "What should I watch out for this month?",
      "How's my financial luck recently?",
      "Am I on the right path?",
      "What changes will happen in the next three months?",
      "What is my subconscious trying to tell me?",
    ],
  },
  ja: {
    title: "あなたの心の声を聞かせてください",
    subtitle: "あなたの本当の悩みに耳を傾けます",
    placeholder: "あなたの悩みを教えてください...",
    button: "カードを選択",
    bottomHint: "誠実な心で、タロットがあなたを導きます",
    suggestedQuestions: [
      "彼は今も私に気持ちがありますか？",
      "この関係は続ける価値がありますか？",
      "私から連絡を取るべきですか？",
      "来月何に注意すべきですか？",
      "最近の金運はどうですか？",
      "今の方向性は正しいですか？",
      "今後3ヶ月で何が変わりますか？",
      "私の潜在意識は何を伝えようとしていますか？",
    ],
  },
  ko: {
    title: "당신의 마음을 들려주세요",
    subtitle: "당신의 진정한 고민에 귀 기울이겠습니다",
    placeholder: "당신의 고민을 말씀해주세요...",
    button: "카드 선택",
    bottomHint: "진심을 담은 마음으로, 타로가 당신을 안내할 것입니다",
    suggestedQuestions: [
      "그는 아직 나에게 감정이 있나요?",
      "이 관계를 계속할 가치가 있나요?",
      "내가 먼저 연락해야 할까요?",
      "다음 달에 무엇을 조심해야 하나요?",
      "최근 내 재운은 어떤가요?",
      "지금 가는 방향이 맞나요?",
      "앞으로 3개월 동안 무슨 변화가 있을까요?",
      "내 잠재의식은 무엇을 말하려고 하나요?",
    ],
  },
  es: {
    title: "Cuéntame tu pregunta real",
    subtitle: "Empieza gratis con una pregunta concreta",
    placeholder: "Escribe tu pregunta...",
    button: "Elegir cartas",
    bottomHint: "Haz una pregunta sincera y usa la lectura como una guía práctica, no como una certeza.",
    suggestedQuestions: [
      "¿Mi ex va a volver?",
      "¿Él todavía siente algo por mí?",
      "¿Debo escribirle primero?",
      "¿Esta relación tiene futuro?",
      "¿Qué debo saber sobre mi carrera ahora?",
      "¿Debería aceptar esta oferta de trabajo?",
      "¿Qué energía me acompaña esta semana?",
      "¿Qué paso práctico puedo tomar hoy?",
    ],
  },
  "pt-br": {
    title: "Conte sua pergunta real",
    subtitle: "Comece gratis com uma pergunta concreta",
    placeholder: "Escreva sua pergunta...",
    button: "Escolher cartas",
    bottomHint: "Faca uma pergunta sincera e use a leitura como orientacao pratica, nao como certeza.",
    suggestedQuestions: [
      "Meu ex vai voltar?",
      "Ele ainda sente algo por mim?",
      "Devo mandar mensagem primeiro?",
      "Esse relacionamento tem futuro?",
      "O que devo entender sobre minha carreira agora?",
      "Devo aceitar esta oferta de trabalho?",
      "Que energia me acompanha esta semana?",
      "Qual passo pratico posso tomar hoje?",
    ],
  },
} satisfies Record<SeoLocale, {
  title: string
  subtitle: string
  placeholder: string
  button: string
  bottomHint: string
  suggestedQuestions: string[]
}>

export function QuestionInput({ visible = true, onSubmit, initialQuestion = "", localeOverride }: QuestionInputProps) {
  const { language } = useLanguage()
  const [question, setQuestion] = useState(initialQuestion)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const copy = questionInputCopy[localeOverride || language] || questionInputCopy.en

  const suggestedQuestions = copy.suggestedQuestions

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

          <div className="absolute inset-0 z-20 translate-y-0 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)] opacity-100 transition-all delay-300 duration-700 sm:px-6 md:pt-[calc(env(safe-area-inset-top)+2rem)]">
            <div className="mx-auto flex min-h-full w-full flex-col items-center justify-center gap-5 py-2 sm:gap-6 md:gap-7">
              <div className="flex flex-col items-center gap-3 text-center">
                <p
                  className="text-xs uppercase text-[#c9c0ff]/68 md:text-sm"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                  }}
                >
                  {copy.subtitle}
                </p>
                <h1
                  className="max-w-[17rem] whitespace-normal break-words text-center text-[1.45rem] leading-tight text-white/86 sm:max-w-xl sm:text-3xl"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 600,
                  }}
                >
                  {copy.title}
                </h1>
              </div>

              {suggestedQuestions.length > 0 && (
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
              )}

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
                      placeholder={copy.placeholder}
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
                      {copy.button}
                    </span>
                  </div>
                </div>
              </button>

              <p className="max-w-md text-center text-xs leading-5 text-white/40">
                {copy.bottomHint}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
