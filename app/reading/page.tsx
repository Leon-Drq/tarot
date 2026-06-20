"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { DrawnCard } from "@/lib/tarot-cards"
import { getCardName } from "@/lib/tarot-cards"
import BlurText from "@/components/ui/blur-text"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { readingApi, getAccessToken, authApi, setAccessToken, type SpreadConfig } from "@/lib/api"

interface Message {
  id: string
  type: "reading" | "followup"
  content: string
  question?: string
}

export default function ReadingPage() {
  const router = useRouter()
  const { user, isLoggedIn, refreshUser } = useAuth()
  const { t, language } = useLanguage()
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [question, setQuestion] = useState("")
  const [spreadType, setSpreadType] = useState("three_card")
  const [spreadConfig, setSpreadConfig] = useState<SpreadConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStreaming, setCurrentStreaming] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")
  const hasStartedRef = useRef(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpInput, setFollowUpInput] = useState("")
  const contentEndRef = useRef<HTMLDivElement>(null)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isExiting, setIsExiting] = useState(false)
  const [readingId, setReadingId] = useState<string | null>(null)
  const [fullInterpretation, setFullInterpretation] = useState("")

  useEffect(() => {
    const data = sessionStorage.getItem("tarotReading")
    if (!data) {
      router.push("/")
      return
    }

    const parsed = JSON.parse(data)
    setDrawnCards(parsed.drawnCards || [])
    setQuestion(parsed.question || "")
    setSpreadType(parsed.spreadType || "three_card")
    setSpreadConfig(parsed.spreadConfig || null)
    setMounted(true)

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      startReading(parsed.drawnCards, parsed.question, false, "", parsed.spreadType || "three_card")
    }
  }, [router])

  useEffect(() => {
    if (!isReading && currentStreaming) {
      const cleanContent = currentStreaming

      // 添加到消息列表
      const newMessage = {
        id: Date.now().toString(),
        type: (messages.length === 0 ? "reading" : "followup") as "reading" | "followup",
        content: cleanContent,
        question: currentQuestion || undefined,
      }
      
      setMessages((prev) => [...prev, newMessage])
      
      // 累积解读内容用于保存
      setFullInterpretation(prev => prev + (prev ? "\n\n---\n\n" : "") + cleanContent)
      
      // 不再自动生成追问建议，让用户自由提问
      setCurrentStreaming("")
      setCurrentQuestion("")
      setShowFollowUp(true)
    }
  }, [isReading, currentStreaming, currentQuestion])

  // 保存解读结果到后端
  useEffect(() => {
    async function saveInterpretation() {
      if (readingId && fullInterpretation && !isReading && showFollowUp) {
        try {
          await readingApi.saveInterpretation(readingId, fullInterpretation)
          console.log("[Reading] Interpretation saved")
        } catch (err) {
          console.error("[Reading] Failed to save interpretation:", err)
        }
      }
    }
    saveInterpretation()
  }, [readingId, fullInterpretation, isReading, showFollowUp])

  const startReading = async (cards: DrawnCard[], userQuestion: string, isFollowUp = false, followUpQuestion = "", currentSpreadType = "three_card") => {
    if (isReading || cards.length === 0) return

    setIsReading(true)
    setCurrentStreaming("")
    setShowFollowUp(false)
    setError("")

    try {
      let hasSession = isLoggedIn
      // 如果未登录，自动创建匿名用户
      if (!isLoggedIn && !isFollowUp) {
        try {
          console.log("[Reading] Creating anonymous user...")
          const anonResult = await authApi.registerAnonymous()
          setAccessToken(anonResult.access_token)
          hasSession = true
          await refreshUser()
          console.log("[Reading] Anonymous user created:", anonResult.user.nickname)
        } catch (anonError) {
          console.error("[Reading] Failed to create anonymous user:", anonError)
          // 如果匿名注册失败，仍然允许继续（降级处理）
        }
      }
      
      // 如果是首次解读且用户已登录，先创建解读记录
      if (!isFollowUp && hasSession && !readingId) {
        try {
          const createResult = await readingApi.create(
            userQuestion,
            cards.map(card => ({
              name: getCardName(card, language),
              isReversed: card.isReversed,
              meaning: card.meaning,
            })),
            currentSpreadType || spreadType
          )
          setReadingId(createResult.reading_id)
          
          // 如果消耗了积分，刷新用户信息
          if (createResult.credits_used > 0) {
            refreshUser()
          }
        } catch (apiError) {
          // 如果是积分不足，显示错误并跳转
          if (apiError instanceof Error && apiError.message.includes("积分不足")) {
            setError(t("tarot.noCredits"))
            setIsReading(false)
            return
          }
          // 其他错误继续执行（允许游客体验）
          console.warn("[Reading] API error, continuing as guest:", apiError)
        }
      }

      // 调用 AI 解读 API（后端流式接口，带语言参数和牌阵类型）
      const response = await readingApi.interpret(
        userQuestion,
        cards.map((card) => ({
          name: getCardName(card, language),
          isReversed: card.isReversed,
          meaning: card.meaning,
        })),
        isFollowUp,
        followUpQuestion,
        messages.map((m) => m.content),
        language,
        currentSpreadType || spreadType
      )

      if (!response.ok) {
        // 处理积分不足的错误
        if (response.status === 402) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "积分不足，请购买会员或积分")
        }
        throw new Error("Reading failed")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""
          
          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue
            
            if (trimmedLine.startsWith("data: ")) {
              const data = trimmedLine.slice(6)
              if (data === "[DONE]") {
                continue
              }
              
              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  setCurrentStreaming((prev) => prev + content)
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e)
              }
            }
          }
        }
        
        // 处理剩余的 buffer
        if (buffer.trim()) {
          const trimmedLine = buffer.trim()
          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6)
            if (data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data)
                const content = parsed.content
                if (content) {
                  setCurrentStreaming((prev) => prev + content)
                }
              } catch (e) {
                console.error("Error parsing final SSE data:", e)
              }
            }
          }
        }
        
        // 追问完成后刷新用户积分（非会员追问会扣积分）
        if (isFollowUp && isLoggedIn) {
          refreshUser()
        }
      }
    } catch (err) {
      console.error("Reading error:", err)
      // 检查是否是积分不足的错误
      if (err instanceof Error && err.message.includes("积分不足")) {
        setError("积分不足，请购买会员或积分")
      } else {
      setError("解读时发生错误，请重试。")
      }
    } finally {
      setIsReading(false)
    }
  }

  const handleFollowUp = (questionText: string) => {
    if (!questionText.trim() || isReading) return
    setFollowUpInput("")
    setCurrentQuestion(questionText)
    startReading(drawnCards, question, true, questionText, spreadType)
  }

  const handleNewReading = () => {
    setIsExiting(true)
    setTimeout(() => {
      sessionStorage.removeItem("tarotReading")
      router.push("/")
    }, 2000)
  }

  // 获取位置标签
  const getPositionLabel = (index: number): string => {
    if (spreadConfig && spreadConfig.positions[index]) {
      return language === 'en' 
        ? spreadConfig.positions[index].nameEn 
        : spreadConfig.positions[index].name
    }
    // 默认标签
    const defaultLabels = [t("tarot.past"), t("tarot.present"), t("tarot.future")]
    return defaultLabels[index] || `Position ${index + 1}`
  }

  const renderContent = (content: string, isNew: boolean) => {
    if (isNew) {
      return parseParagraphs(content).map((para) => renderParagraph(para, true))
    }

    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl text-[#dcb360] font-semibold mt-6 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl text-[#dcb360]/90 font-semibold mt-5 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg text-[#dcb360]/80 font-medium mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="text-white/80 leading-relaxed text-sm sm:text-base mb-3">{children}</p>,
          strong: ({ children }) => <strong className="text-[#dcb360] font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-white/90 italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/80 text-sm sm:text-base mb-3 space-y-1 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/80 text-sm sm:text-base mb-3 space-y-1 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-white/80">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#dcb360]/50 pl-4 my-3 text-white/70 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  const parseParagraphs = (text: string) => {
    return text
      .split("\n\n")
      .filter((p) => p.trim())
      .map((paragraph, index) => {
        const trimmed = paragraph.trim()
        if (trimmed.startsWith("### ")) {
          return { type: "h3", content: trimmed.slice(4), key: index }
        } else if (trimmed.startsWith("## ")) {
          return { type: "h2", content: trimmed.slice(3), key: index }
        } else if (trimmed.startsWith("# ")) {
          return { type: "h1", content: trimmed.slice(2), key: index }
        } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return { type: "bold", content: trimmed.slice(2, -2), key: index }
        }
        return { type: "p", content: trimmed, key: index }
      })
  }

  const renderParagraph = (para: { type: string; content: string; key: number }, isNew: boolean) => {
    const baseDelay = isNew ? 50 : 0

    const classMap: Record<string, string> = {
      h1: "text-xl sm:text-2xl text-[#dcb360] font-semibold mt-6 mb-4 first:mt-0",
      h2: "text-lg sm:text-xl text-[#dcb360]/90 font-semibold mt-5 mb-3",
      h3: "text-base sm:text-lg text-[#dcb360]/80 font-medium mt-4 mb-2",
      bold: "text-[#dcb360] font-semibold",
      p: "text-white/80 leading-relaxed text-sm sm:text-base",
    }

    return (
      <BlurText
        key={para.key}
        text={para.content}
        delay={baseDelay}
        className={classMap[para.type] || classMap.p}
        animateBy="words"
        direction="bottom"
        stepDuration={isNew ? 0.3 : 0}
      />
    )
  }

  const renderQuestion = (questionText: string) => (
    <div className="my-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#dcb360]/40" />
        <div className="w-1 h-1 rounded-full bg-[#dcb360]/60 animate-pulse" />
        <div className="w-8 h-px bg-[#dcb360]/30" />
        <div className="w-1 h-1 rounded-full bg-[#dcb360]/60 animate-pulse" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#dcb360]/40" />
      </div>

      <div className="text-center">
        <p className="text-[#dcb360]/50 text-xs tracking-widest mb-2">{t("tarot.yourQuestion")}</p>
        <p
          className="text-white/90 text-base sm:text-lg font-light italic max-w-md mx-auto"
          style={{
            fontFamily: "var(--font-serif, serif)",
            textShadow: "0 0 20px rgba(220, 179, 96, 0.2)",
          }}
        >
          「{questionText}」
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#dcb360]/40" />
        <div className="w-1 h-1 rounded-full bg-[#dcb360]/60 animate-pulse" />
        <div className="w-8 h-px bg-[#dcb360]/30" />
        <div className="w-1 h-1 rounded-full bg-[#dcb360]/60 animate-pulse" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#dcb360]/40" />
      </div>
    </div>
  )

  return (
    <div
      className="relative w-full min-h-screen allow-scroll scrollbar-hide"
      style={{
        background: "radial-gradient(circle at 50% 0%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isExiting ? 1 : 0,
          background: "radial-gradient(circle at 50% 50%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
        }}
      >
        {isExiting && (
          <>
            <div
              className="absolute w-32 h-32 rounded-full opacity-50"
              style={{
                background: "radial-gradient(circle, rgba(180, 150, 255, 0.6) 0%, transparent 70%)",
                filter: "blur(30px)",
                left: "30%",
                top: "40%",
                animation: "floatOrb1 4s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-40 h-40 rounded-full opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(200, 180, 255, 0.5) 0%, transparent 70%)",
                filter: "blur(40px)",
                left: "50%",
                top: "45%",
                animation: "floatOrb2 5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-24 h-24 rounded-full opacity-45"
              style={{
                background: "radial-gradient(circle, rgba(220, 200, 255, 0.55) 0%, transparent 70%)",
                filter: "blur(25px)",
                left: "60%",
                top: "35%",
                animation: "floatOrb3 3.5s ease-in-out infinite",
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className="text-white/70 text-lg sm:text-xl tracking-widest animate-pulse"
                style={{
                  fontFamily: "var(--font-serif, serif)",
                  textShadow: "0 0 30px rgba(180, 150, 255, 0.5)",
                }}
              >
                {t("tarot.newJourney") || "新的旅程即将开始..."}
              </p>
            </div>
          </>
        )}
      </div>

      <div
        className="relative z-10 py-12 px-4 max-w-4xl mx-auto transition-opacity duration-500"
        style={{ opacity: isExiting ? 0 : 1 }}
      >
        {/* 标题区域 */}
        <div
          className="text-center mb-10 transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          <p className="text-white/40 text-xs tracking-widest mb-2">YOUR QUESTION</p>
          <h1
            className="text-xl sm:text-2xl text-white/90 font-light max-w-md mx-auto"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            {question || t("nav.reading")}
          </h1>
          
          {/* 显示用户状态 */}
          {isLoggedIn && user && (
            <p className="text-white/30 text-xs mt-2">
              {user.is_member ? t("membership.unlimitedReading") : `${t("profile.credits")}: ${user.credits}`}
            </p>
          )}
        </div>

        {/* 三张卡牌 */}
        <div
          className="flex items-start justify-center gap-4 sm:gap-6 mb-10 transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          {drawnCards.map((card, index) => (
            <div key={card.id} className="flex flex-col items-center">
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  width: "80px",
                  height: "136px",
                  border: "2px solid rgba(220, 179, 96, 0.5)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  fill
                  className="object-cover"
                  style={{
                    transform: card.isReversed ? "rotate(180deg)" : "none",
                  }}
                />
              </div>
              <p className="text-[#dcb360]/60 text-xs mt-2">{getPositionLabel(index)}</p>
              <p className="text-white/80 text-xs mt-1 text-center">
                {getCardName(card, language)}
                <span className="text-white/50 ml-1">{card.isReversed ? t("tarot.reversed").substring(0, 1) : t("tarot.upright").substring(0, 1)}</span>
              </p>
            </div>
          ))}
        </div>

        {/* 解读区域 */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "400ms",
          }}
        >
          <div
            className="p-6 sm:p-8 rounded-2xl"
            style={{
              background: "rgba(26, 16, 48, 0.6)",
              border: "1px solid rgba(220, 179, 96, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-8 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(220, 179, 96, 0.5))" }}
              />
              <h3 className="text-[#dcb360] text-sm tracking-widest">{isReading ? t("common.loading") : t("tarot.interpretation")}</h3>
              <div
                className="w-8 h-px"
                style={{ background: "linear-gradient(to left, transparent, rgba(220, 179, 96, 0.5))" }}
              />
            </div>

            {error ? (
              <div className="text-red-400/80 text-center">
                <p>{error}</p>
                <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={() => startReading(drawnCards, question, false, "", spreadType)}
                    className="px-6 py-2 rounded-full text-sm border border-red-400/50 hover:bg-red-400/10 transition-colors"
                >
                  {t("common.retry")}
                </button>
                  {error.includes(t("tarot.noCredits")) && (
                    <button
                      onClick={() => router.push("/membership")}
                      className="px-6 py-2 rounded-full text-sm bg-[#dcb360] text-[#1a0f30] hover:bg-[#dcb360]/90 transition-colors"
                    >
                      {t("membership.upgrade")}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4" style={{ fontFamily: "var(--font-serif, serif)" }}>
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.question && renderQuestion(message.question)}
                    {renderContent(message.content, false)}
                  </div>
                ))}

                {currentStreaming && (
                  <>
                    {currentQuestion && renderQuestion(currentQuestion)}
                    {renderContent(currentStreaming, true)}
                  </>
                )}

                {isReading && <span className="inline-block w-2 h-5 bg-[#dcb360]/80 animate-pulse ml-1" />}

                {!isReading && messages.length === 0 && !currentStreaming && (
                  <div className="text-white/80 text-sm sm:text-base leading-relaxed flex items-center justify-center">
                    <span className="inline-block w-2 h-5 bg-[#dcb360]/80 animate-pulse" />
                  </div>
                )}

                <div ref={contentEndRef} />
              </div>
            )}
          </div>

          <div
            className="mt-8 transition-all duration-700"
            style={{
              opacity: showFollowUp ? 1 : 0,
              transform: showFollowUp ? "translateY(0)" : "translateY(20px)",
              pointerEvents: showFollowUp ? "auto" : "none",
            }}
          >
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(26, 16, 48, 0.4)",
                border: "1px solid rgba(220, 179, 96, 0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p className="text-center text-white/50 text-sm mb-4 tracking-wide">{t("tarot.followUpQuestion")}</p>

              {/* 输入框 */}
              <div
                className="relative rounded-xl overflow-hidden mb-4"
                style={{
                  background: "rgba(15, 5, 24, 0.6)",
                  border: followUpInput.trim() ? "1px solid rgba(220, 179, 96, 0.5)" : "1px solid rgba(220, 179, 96, 0.25)",
                  boxShadow: followUpInput.trim() 
                    ? "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 30px rgba(220, 179, 96, 0.15)" 
                    : "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(220, 179, 96, 0.05)",
                  transition: "all 0.3s ease",
                }}
              >
                <textarea
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleFollowUp(followUpInput)
                    }
                  }}
                  placeholder={t("tarot.questionPlaceholder")}
                  disabled={isReading}
                  rows={3}
                  className="w-full bg-transparent px-5 py-4 text-base text-white/90 placeholder:text-white/30 focus:outline-none disabled:opacity-50 resize-none"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
              </div>

              {/* 发送按钮 - 大而明显 */}
              <button
                onClick={() => handleFollowUp(followUpInput)}
                disabled={isReading || !followUpInput.trim()}
                className="w-full py-4 rounded-xl text-base font-medium tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: followUpInput.trim() 
                    ? "linear-gradient(135deg, rgba(220, 179, 96, 0.9) 0%, rgba(184, 138, 45, 0.9) 100%)" 
                    : "rgba(220, 179, 96, 0.2)",
                  border: followUpInput.trim() ? "1px solid rgba(220, 179, 96, 0.8)" : "1px solid rgba(220, 179, 96, 0.3)",
                  color: followUpInput.trim() ? "#1a0f30" : "rgba(220, 179, 96, 0.6)",
                  boxShadow: followUpInput.trim() 
                    ? "0 4px 20px rgba(220, 179, 96, 0.4), 0 0 40px rgba(220, 179, 96, 0.2)" 
                    : "none",
                  transform: followUpInput.trim() ? "scale(1)" : "scale(0.98)",
                }}
                onMouseEnter={(e) => {
                  if (followUpInput.trim() && !isReading) {
                    e.currentTarget.style.transform = "scale(1.02)"
                    e.currentTarget.style.boxShadow = "0 6px 30px rgba(220, 179, 96, 0.5), 0 0 50px rgba(220, 179, 96, 0.3)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (followUpInput.trim()) {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(220, 179, 96, 0.4), 0 0 40px rgba(220, 179, 96, 0.2)"
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isReading ? (
                    <>
                      <span className="inline-block w-2 h-2 bg-current rounded-full animate-pulse" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {t("tarot.askMe")}
                    </>
                  )}
                </span>
              </button>

              {/* Enter 提示 */}
              {followUpInput.trim() && !isReading && (
                <p className="text-white/30 text-xs text-center mt-3">
                  {t("common.pressEnter") || "Press Enter to send"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div
          className="mt-12 text-center transition-all duration-700"
          style={{
            opacity: showFollowUp && !followUpInput.trim() ? 1 : 0.3,
            transform: showFollowUp ? "translateY(0)" : "translateY(20px)",
            pointerEvents: followUpInput.trim() ? "none" : "auto",
          }}
        >
          <button
            onClick={handleNewReading}
            disabled={isExiting || !!followUpInput.trim()}
            className="px-8 py-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "transparent",
              border: "1px solid rgba(220, 179, 96, 0.3)",
              color: "rgba(220, 179, 96, 0.6)",
            }}
          >
            {t("tarot.newReading")}
          </button>
          
          {/* 提示文字 */}
          {!followUpInput.trim() && (
            <p className="text-white/20 text-xs mt-3">
              {t("tarot.or") || "or"} {t("tarot.continueAsking") || "continue asking questions above"}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.15); }
          66% { transform: translate(35px, -15px) scale(0.9); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 30px) scale(1.05); }
          66% { transform: translate(-30px, -25px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}
