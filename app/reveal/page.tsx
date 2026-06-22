"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { DrawnCard } from "@/lib/tarot-cards"
import { getCardName } from "@/lib/tarot-cards"
import { useLanguage } from "@/contexts/language-context"
import type { SpreadConfig } from "@/lib/api"

interface FlipCardProps {
  card: DrawnCard
  index: number
  label: string
  mounted: boolean
  isFlipped: boolean
  onFlip: () => void
  allFlipped: boolean
  t: (key: string) => string
  language: string
  totalCards: number
}

function FlipCard({ card, index, label, mounted, isFlipped, onFlip, allFlipped, t, language, totalCards }: FlipCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFront, setShowFront] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const [elevated, setElevated] = useState(false)

  // 根据卡牌数量动态调整大小 - 电脑版更大更醒目
  const getCardSize = () => {
    if (totalCards <= 2) return { width: 'w-[100px] h-[171px] sm:w-[180px] sm:h-[308px] lg:w-[200px] lg:h-[343px]' }
    if (totalCards === 3) return { width: 'w-[95px] h-[163px] sm:w-[160px] sm:h-[274px] lg:w-[180px] lg:h-[308px]' }
    if (totalCards === 4) return { width: 'w-[80px] h-[137px] sm:w-[140px] sm:h-[240px] lg:w-[160px] lg:h-[274px]' }
    return { width: 'w-[65px] h-[111px] sm:w-[120px] sm:h-[206px] lg:w-[140px] lg:h-[240px]' }
  }
  
  const cardSize = getCardSize()

  const handleClick = useCallback(() => {
    if (isFlipped || isAnimating) return

    setIsAnimating(true)

    // 阶段1：卡牌上浮 + 发光
    setElevated(true)
    setShowGlow(true)

    // 阶段2：翻转到90度时切换正反面
    setTimeout(() => {
      setShowFront(true)
    }, 400)

    // 阶段3：翻转完成，回落
    setTimeout(() => {
      setElevated(false)
      setIsAnimating(false)
      onFlip()
    }, 800)

    // 阶段4：光晕消退
    setTimeout(() => {
      setShowGlow(false)
    }, 1200)
  }, [isFlipped, isAnimating, onFlip])

  return (
    <div
      className="flex flex-col items-center pt-4 sm:pt-8"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.7s ease-out",
        transitionDelay: `${index * 200 + 300}ms`,
      }}
    >
      {/* 卡牌容器 */}
      <div
        className={`relative cursor-pointer ${cardSize.width}`}
        onClick={handleClick}
        style={{
          perspective: "1000px",
        }}
      >
        {/* 外层光晕 */}
        <div
          className="absolute -inset-4 rounded-2xl transition-opacity duration-500"
          style={{
            opacity: showGlow ? 1 : 0,
            background: "radial-gradient(ellipse at center, rgba(220, 179, 96, 0.4) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* 3D翻转容器 */}
        <div
          className="relative w-full h-full transition-all"
          style={{
            transformStyle: "preserve-3d",
            transform: `
              translateY(${elevated ? "-15px" : "0"}) 
              scale(${elevated ? 1.05 : 1}) 
              rotateY(${showFront ? "180deg" : "0deg"})
            `,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* 背面 */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              border: "2px solid #dcb360",
              boxShadow: elevated
                ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(220, 179, 96, 0.3)"
                : "0 10px 40px rgba(0,0,0,0.5)",
              transition: "box-shadow 0.4s ease-out",
            }}
          >
            <Image src="https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/back1.jpg" alt="Card back" fill className="object-cover" />
            {/* 内边框 */}
            <div
              className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 sm:top-2 sm:left-2 sm:right-2 sm:bottom-2 lg:top-3 lg:left-3 lg:right-3 lg:bottom-3 rounded-lg pointer-events-none"
              style={{ border: "1px solid rgba(220, 179, 96, 0.4)" }}
            />
            {/* 未翻开时的闪烁提示 */}
            {!isFlipped && !isAnimating && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" style={{ animationDuration: "2s" }} />
            )}
          </div>

          {/* 正面 */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              border: "2px solid #dcb360",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              background: "linear-gradient(145deg, #2a1f4e 0%, #1a1030 100%)",
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
            {/* 内边框 */}
            <div
              className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 sm:top-2 sm:left-2 sm:right-2 sm:bottom-2 lg:top-3 lg:left-3 lg:right-3 lg:bottom-3 rounded-lg pointer-events-none"
              style={{ border: "1px solid rgba(220, 179, 96, 0.4)" }}
            />
          </div>
        </div>
      </div>

      {/* 卡牌标签 */}
      <div className="mt-3 sm:mt-4 lg:mt-5 text-center relative h-12 sm:h-14">
        <p
          className="text-white/50 text-xs sm:text-sm lg:text-base transition-all duration-500"
          style={{
            opacity: isFlipped ? 0 : 1,
            transform: isFlipped ? "translateY(-10px)" : "translateY(0)",
          }}
        >
          {label}
        </p>
        {/* 翻牌后：名称和正/逆位分两行显示 */}
        <div
          className="flex flex-col items-center gap-0.5 transition-all duration-500 absolute left-1/2 -translate-x-1/2 w-full"
          style={{
            opacity: isFlipped ? 1 : 0,
            transform: isFlipped ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <p className="text-[#dcb360] text-xs sm:text-sm lg:text-base font-medium truncate max-w-full px-1">
            {getCardName(card, language)}
          </p>
          <p className="text-[10px] sm:text-xs text-white/70">
            {card.isReversed ? t("tarot.reversed") : t("tarot.upright")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RevealPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [question, setQuestion] = useState("")
  const [spreadType, setSpreadType] = useState("three_card")
  const [spreadConfig, setSpreadConfig] = useState<SpreadConfig | null>(null)
  const [mounted, setMounted] = useState(false)
  const [flippedCards, setFlippedCards] = useState<boolean[]>([])
  const [allFlipped, setAllFlipped] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("tarotReading")
    if (data) {
      const parsed = JSON.parse(data)
      const cards = parsed.drawnCards || []
      setDrawnCards(cards)
      setQuestion(parsed.question || "")
      setSpreadType(parsed.spreadType || "three_card")
      setSpreadConfig(parsed.spreadConfig || null)
      // 初始化翻牌状态
      setFlippedCards(new Array(cards.length).fill(false))
    }
    setTimeout(() => setMounted(true), 100)
  }, [])

  // 不再需要滚动居中逻辑

  const handleFlip = useCallback((index: number) => {
    setFlippedCards((prev) => {
      const newFlipped = [...prev]
      newFlipped[index] = true

      if (newFlipped.every((f) => f)) {
        setTimeout(() => setAllFlipped(true), 500)
      }

      return newFlipped
    })
  }, [])

  const handleStartReading = () => {
    router.push("/loading-reading")
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

  return (
    <div
      className="fixed inset-0 overflow-hidden touch-none flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% 30%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
      }}
    >
      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 顶部装饰 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px transition-all duration-1000"
        style={{
          height: mounted ? "10vh" : "0",
          background: "linear-gradient(to bottom, transparent, rgba(191, 182, 255, 0.3))",
        }}
      />

      {/* 标题区域 */}
      <div
        className="text-center mb-6 sm:mb-12 transition-all duration-1000"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        {/* 牌阵类型显示 */}
        {spreadConfig && (
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#bfb6ff]/35" />
            <span className="text-white/60 text-sm">
              {language === 'en' ? spreadConfig.nameEn : spreadConfig.name}
            </span>
            <span className="h-px w-8 bg-[#bfb6ff]/35" />
          </div>
        )}
        
        <p className="text-white/40 text-xs tracking-widest mb-2">YOUR QUESTION</p>
        <h1
          className="text-xl sm:text-2xl text-white/90 font-light max-w-md mx-auto px-4"
          style={{ fontFamily: "var(--font-serif, serif)" }}
        >
          {question || t("nav.reading")}
        </h1>

        {/* 提示文字 */}
        <p
          className="text-[#c9c0ff]/80 text-sm mt-6 transition-all duration-500"
          style={{
            opacity: allFlipped ? 0 : 1,
            transform: allFlipped ? "translateY(-10px)" : "translateY(0)",
          }}
        >
          {t("tarot.reveal")}
        </p>
      </div>

      {/* 卡牌展示 - 去掉滚动，居中显示 */}
      <div
        ref={scrollContainerRef}
        className={`flex items-start justify-center flex-wrap px-4 sm:px-8 ${
          drawnCards.length > 3 ? 'gap-2 sm:gap-4 lg:gap-6' : 'gap-3 sm:gap-8 lg:gap-12'
        }`}
      >
        {drawnCards.map((card, index) => (
          <div key={card.id}>
            <FlipCard
              card={card}
              index={index}
              label={getPositionLabel(index)}
              mounted={mounted}
              isFlipped={flippedCards[index] || false}
              onFlip={() => handleFlip(index)}
              allFlipped={allFlipped}
              t={t}
              language={language}
              totalCards={drawnCards.length}
            />
          </div>
        ))}
      </div>

      {/* 全部翻完后的按钮 */}
      <div
        className="mt-8 sm:mt-12 transition-all duration-700"
        style={{
          opacity: allFlipped ? 1 : 0,
          transform: allFlipped ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <button
          onClick={handleStartReading}
          className="px-8 py-3 rounded-full text-sm tracking-wider transition-all duration-300 hover:scale-105"
          style={{
            background: "transparent",
            border: "1px solid rgba(220, 179, 96, 0.5)",
            color: "#dcb360",
          }}
        >
          {t("tarot.startReading")}
        </button>
      </div>

      {/* 底部装饰线 */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px"
        style={{
          height: "15vh",
          background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)",
        }}
      />
    </div>
  )
}
