"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { readingApi } from "@/lib/api"
import { getRandomCards, type DrawnCard } from "@/lib/tarot-cards"
import Image from "next/image"

export default function DailyReadingPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { t, language } = useLanguage()
  
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<'greeting' | 'drawing' | 'revealing' | 'interpreting' | 'complete'>('greeting')
  const [card, setCard] = useState<DrawnCard | null>(null)
  const [interpretation, setInterpretation] = useState("")
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zodiacSign, setZodiacSign] = useState("")
  const [birthElement, setBirthElement] = useState("")

  useEffect(() => {
    setMounted(true)

    // 检查今天是否已经抽过卡
    const lastDrawDate = localStorage.getItem('last_daily_draw_date')
    const today = new Date().toDateString()
    
    if (lastDrawDate === today) {
      setError(t("daily.ritualLocked"))
      return
    }

    // 获取生日信息，计算星座和元素
    const birthday = sessionStorage.getItem('user_birthday') || user?.birthday
    if (birthday) {
      const zodiac = getZodiacSign(birthday)
      const element = getBirthElement(birthday)
      setZodiacSign(zodiac)
      setBirthElement(element)
    }

    // 显示个性化问候 3 秒
    setTimeout(() => {
      setPhase('drawing')
      
      // 2 秒后开始抽牌
      setTimeout(() => {
        const drawnCard = getRandomCards(1)[0]
        setCard(drawnCard)
        setPhase('revealing')
        
        // 保存今天的抽卡记录
        localStorage.setItem('last_daily_draw_date', today)
      }, 2000)
    }, 3000)
  }, [t, user?.birthday])

  // 根据生日计算星座
  const getZodiacSign = (birthday: string): string => {
    const date = new Date(birthday)
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const signs = [
      { name: "Capricorn", emoji: "♑", zh: "摩羯座", start: [12, 22], end: [1, 19] },
      { name: "Aquarius", emoji: "♒", zh: "水瓶座", start: [1, 20], end: [2, 18] },
      { name: "Pisces", emoji: "♓", zh: "双鱼座", start: [2, 19], end: [3, 20] },
      { name: "Aries", emoji: "♈", zh: "白羊座", start: [3, 21], end: [4, 19] },
      { name: "Taurus", emoji: "♉", zh: "金牛座", start: [4, 20], end: [5, 20] },
      { name: "Gemini", emoji: "♊", zh: "双子座", start: [5, 21], end: [6, 21] },
      { name: "Cancer", emoji: "♋", zh: "巨蟹座", start: [6, 22], end: [7, 22] },
      { name: "Leo", emoji: "♌", zh: "狮子座", start: [7, 23], end: [8, 22] },
      { name: "Virgo", emoji: "♍", zh: "处女座", start: [8, 23], end: [9, 22] },
      { name: "Libra", emoji: "♎", zh: "天秤座", start: [9, 23], end: [10, 23] },
      { name: "Scorpio", emoji: "♏", zh: "天蝎座", start: [10, 24], end: [11, 21] },
      { name: "Sagittarius", emoji: "♐", zh: "射手座", start: [11, 22], end: [12, 21] },
    ]
    
    for (const sign of signs) {
      const [startMonth, startDay] = sign.start
      const [endMonth, endDay] = sign.end
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return language === 'zh' ? `${sign.emoji} ${sign.zh}` : `${sign.emoji} ${sign.name}`
      }
    }
    
    return signs[0].emoji + (language === 'zh' ? signs[0].zh : signs[0].name)
  }

  // 根据生日计算元素
  const getBirthElement = (birthday: string): string => {
    const date = new Date(birthday)
    const year = date.getFullYear()
    const elements = language === 'zh' 
      ? ["金", "水", "木", "火", "土"]
      : ["Metal", "Water", "Wood", "Fire", "Earth"]
    return elements[year % 5]
  }

  const handleRevealCard = useCallback(() => {
    if (phase !== 'revealing') return
    setPhase('interpreting')
    startInterpretation()
  }, [phase])

  const startInterpretation = async () => {
    if (!card || !user?.birthday) return
    
    setIsReading(true)
    try {
      // 构建每日运势专属的问题
      const dailyQuestion = `Today's Energy Reading for ${user.birthday}`
      
      const response = await readingApi.interpret(
        dailyQuestion,
        [card],
        false,
        undefined,
        undefined,
        language
      )

      if (!response.ok) {
        throw new Error('Failed to get interpretation')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              setPhase('complete')
              continue
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullText += parsed.content
                setInterpretation(fullText)
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      console.error('Interpretation error:', err)
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setIsReading(false)
    }
  }

  if (error) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center p-6"
        style={{
          background: "radial-gradient(circle at 50% 30%, #2a1f4e 0%, #1a1030 40%, #0f0518 100%)",
        }}
      >
        <p className="text-red-400 mb-4 text-center">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          {t("daily.backToHome")}
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 30%, #4a3068 0%, #2a1f4e 30%, #1a1030 60%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 背景光晕 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: "300px",
            height: "300px",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(220, 179, 96, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Phase 1: 个性化问候 */}
        {phase === 'greeting' && (
          <div
            className="text-center transition-all duration-1000"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1)" : "scale(0.95)",
            }}
          >
            <div className="mb-8">
              <p className="text-[#dcb360]/60 text-sm tracking-widest mb-4">
                {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : 'en-US', {
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h1 className="text-3xl sm:text-4xl text-white/90 font-light tracking-widest mb-6">
                {t("daily.greeting") || "Welcome"}
              </h1>
              
              {/* 星座和元素信息 */}
              {(zodiacSign || birthElement) && (
                <div className="flex items-center justify-center gap-6 mb-8">
                  {zodiacSign && (
                    <div className="text-center">
                      <p className="text-[#dcb360] text-2xl mb-1">{zodiacSign}</p>
                      <p className="text-white/40 text-xs tracking-wider">{t("daily.yourSign") || "Your Sign"}</p>
                    </div>
                  )}
                  
                  {birthElement && (
                    <div className="text-center">
                      <p className="text-[#dcb360] text-2xl mb-1">{birthElement}</p>
                      <p className="text-white/40 text-xs tracking-wider">{t("daily.element") || "Element"}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 连接中动画 */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                {/* 外圈旋转 */}
                <div className="absolute inset-0 border-2 border-[#dcb360]/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-3 border-2 border-[#dcb360]/30 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 border-2 border-[#dcb360]/40 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                
                {/* 中心图标 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#dcb360] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.036a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.455z" />
                  </svg>
                </div>
              </div>
              
              <p className="text-white/60 text-sm tracking-wider animate-pulse">
                {t("daily.connecting") || "Connecting to cosmic energy..."}
              </p>
            </div>
          </div>
        )}

        {/* Phase 2: 标题 */}
        {(phase === 'drawing' || phase === 'revealing' || phase === 'interpreting' || phase === 'complete') && (
          <div
            className="text-center mb-12 transition-all duration-1000"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-20px)",
            }}
          >
            <p className="text-[#dcb360]/60 text-sm tracking-widest mb-2">
              {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <h1 className="text-2xl sm:text-3xl text-white/90 font-light tracking-widest">
              {t("daily.title")}
            </h1>
          </div>
        )}

        {/* Phase 2: 抽牌中 */}
        {phase === 'drawing' && (
          <div className="text-center">
            <div className="w-32 h-32 border-4 border-[#dcb360]/30 border-t-[#dcb360] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-white/60">{t("common.loading")}</p>
          </div>
        )}

        {(phase === 'revealing' || phase === 'interpreting' || phase === 'complete') && card && (
          <div
            className="transition-all duration-700 mb-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1)" : "scale(0.9)",
            }}
          >
            <div
              className="relative group cursor-pointer"
              onClick={handleRevealCard}
              style={{
                perspective: "1000px",
              }}
            >
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-700 border-4 border-[#dcb360]/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                style={{
                  width: "clamp(200px, 40vw, 280px)",
                  height: "clamp(344px, 68vw, 480px)",
                  transformStyle: "preserve-3d",
                  transform: phase === 'revealing' ? "rotateY(0deg)" : "rotateY(180deg)",
                }}
              >
                {/* 卡背 */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src="/images/back1.jpg"
                    alt="Card back"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 卡面 */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    style={{
                      transform: card.isReversed ? "rotate(180deg)" : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {phase === 'revealing' && (
              <p className="text-center text-[#dcb360] text-sm mt-6 animate-pulse">
                {t("tarot.reveal")}
              </p>
            )}
          </div>
        )}

        {/* AI解读区域 */}
        {(phase === 'interpreting' || phase === 'complete') && (
          <div
            className="w-full max-w-2xl bg-black/30 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 transition-all duration-700"
            style={{
              opacity: 1,
              transform: "translateY(0)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#dcb360] to-transparent" />
              <h2 className="text-white/90 text-lg font-light tracking-wider">
                {t("tarot.interpretation")}
              </h2>
            </div>

            <div className="text-white/80 leading-relaxed space-y-3 text-sm sm:text-base">
              {interpretation || (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#dcb360] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#dcb360] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-[#dcb360] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>

            {phase === 'complete' && (
              <button
                onClick={() => router.push("/")}
                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-[#dcb360]/20 to-[#b88a2d]/20 hover:from-[#dcb360]/30 hover:to-[#b88a2d]/30 text-[#dcb360] border border-[#dcb360]/30 font-medium tracking-widest transition-all"
              >
                {t("daily.backToHome")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-20 text-white/40 hover:text-white/60 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    </div>
  )
}
