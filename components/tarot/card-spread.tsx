"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import Image from "next/image"
import { getMajorArcana, getFullDeck, type TarotCard } from "@/lib/tarot-cards"
import { type DeckType } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"
import type { SeoLocale } from "@/lib/locales"

interface CardSpreadProps {
  onShuffle?: () => void
  onCardsDealt?: () => void
  selectionMode?: boolean
  collectingMode?: boolean
  onCardSelect?: (cardId: number) => void
  selectedCardIds?: number[]
  onCollectComplete?: () => void
  maxCards?: number  // 最大可选卡牌数量
  deckType?: DeckType  // 牌组类型: major=大阿尔卡纳22张, full=全部78张
  locale?: SeoLocale
}

export function CardSpread({
  onShuffle,
  onCardsDealt,
  selectionMode = false,
  collectingMode = false,
  onCardSelect,
  selectedCardIds = [],
  onCollectComplete,
  maxCards = 3,
  deckType = 'major',  // 默认使用大阿尔卡纳
  locale,
}: CardSpreadProps) {
  const [cardsDealt, setCardsDealt] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const hasNotifiedRef = useRef(false)
  const onCardsDealtRef = useRef(onCardsDealt)

  const [rotationOffset, setRotationOffset] = useState(0)
  const touchStartRef = useRef<{ x: number; rotation: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const activeLocale = locale || language

  const [isMobile, setIsMobile] = useState(false)
  const mobileCardTop = "clamp(10rem, 26dvh, 14.5rem)"

  // 根据牌组类型获取牌，并随机打乱顺序
  const deck = useMemo(() => {
    const baseDeck = deckType === 'major' ? getMajorArcana() : getFullDeck()
    // 随机打乱牌组顺序
    return [...baseDeck].sort(() => Math.random() - 0.5)
  }, [deckType])

  const CARD_COUNT = deck.length
  const mobileSwipeHint =
    {
      zh: "滑动旋转牌阵",
      en: "Swipe to rotate the spread",
      ja: "スワイプでスプレッドを回転",
      ko: "스와이프로 스프레드 회전",
      es: "Desliza para girar la tirada",
      "pt-br": "Deslize para girar a tiragem",
    }[activeLocale] || "Swipe to rotate the spread"

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!selectionMode || collectingMode) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      rotation: rotationOffset,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !selectionMode || collectingMode) return
    const deltaX = e.touches[0].clientX - touchStartRef.current.x
    // 每移动 5px 旋转 1 度
    const newRotation = touchStartRef.current.rotation + deltaX / 5
    // 限制旋转范围
    setRotationOffset(Math.max(-60, Math.min(60, newRotation)))
  }

  const handleTouchEnd = () => {
    touchStartRef.current = null
  }

  useEffect(() => {
    onCardsDealtRef.current = onCardsDealt
  }, [onCardsDealt])

  useEffect(() => {
    if (hasNotifiedRef.current) return

    const timer = setTimeout(() => {
      setCardsDealt(true)
      const notifyTimer = setTimeout(
        () => {
          if (!hasNotifiedRef.current) {
            hasNotifiedRef.current = true
            onCardsDealtRef.current?.()
          }
        },
        CARD_COUNT * 80 + 1000,
      )
      return () => clearTimeout(notifyTimer)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (collectingMode) {
      const timer = setTimeout(() => {
        onCollectComplete?.()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [collectingMode, onCollectComplete])

  const cards = useMemo(() => {
    return deck.map((card, i) => {
      const maxAngle = 65
      const step = CARD_COUNT > 1 ? (maxAngle * 2) / (CARD_COUNT - 1) : 0
      const baseRotation = maxAngle - step * i
      const rotation = (isMobile ? -baseRotation : baseRotation) + rotationOffset

      return {
        id: card.id,  // 使用实际的卡牌 id
        rotation,
        baseRotation,
        zIndex: i + 1,
        delay: i * (deckType === 'full' ? 40 : 80),  // 78张牌时加快动画
      }
    })
  }, [deck, CARD_COUNT, isMobile, rotationOffset, deckType])

  const handleCardClick = (cardId: number) => {
    if (!selectionMode || collectingMode) return

    const isSelected = selectedCardIds.includes(cardId)

    if (isSelected) {
      onCardSelect?.(cardId)
      return
    }

    if (selectedCardIds.length < maxCards) {
      onCardSelect?.(cardId)
    }
  }

  const getCollectingTransform = (card: { id: number; rotation: number; baseRotation: number }, index: number) => {
    const isSelected = selectedCardIds.includes(card.id)

    if (isSelected) {
      const selectedIndex = selectedCardIds.indexOf(card.id)
      const totalSelected = selectedCardIds.length
      // 计算中心偏移：使卡牌居中排列
      const centerOffset = (totalSelected - 1) / 2
      // 根据选中卡牌数量调整间距
      const spacing = isMobile ? Math.min(100, 280 / totalSelected) : Math.min(200, 600 / totalSelected)
      const xOffset = (selectedIndex - centerOffset) * spacing
      // 根据卡牌数量调整缩放
      const scale = isMobile ? Math.min(1, 2.5 / totalSelected) : Math.min(1.1, 3 / totalSelected)
      return `translate(${xOffset}px, ${isMobile ? "50px" : "-50px"}) rotate(0deg) scale(${scale})`
    } else {
      const exitDirection = card.baseRotation > 0 ? 1 : card.baseRotation < 0 ? -1 : 0
      const exitX = (isMobile ? -exitDirection : exitDirection) * 150
      const exitY = isMobile ? -300 - Math.abs(card.baseRotation) * 3 : 300 + Math.abs(card.baseRotation) * 3
      return `rotate(${card.rotation}deg) translate(${exitX}px, ${exitY}px) scale(0.6)`
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ perspective: "1000px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {selectionMode && !collectingMode && cardsDealt && (
        <div className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+9.25rem)] left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap text-xs text-[#c9c0ff]/56 sm:hidden">
          {mobileSwipeHint}
        </div>
      )}

      {cards.map((card, index) => {
        const isSelected = selectedCardIds.includes(card.id)
        const canSelect = selectionMode && !collectingMode && (isSelected || selectedCardIds.length < maxCards)

        let transform: string
        let opacity = 1
        let transitionDuration = "800ms"
        let transitionDelay = cardsDealt ? `${card.delay}ms` : "0ms"

        if (collectingMode) {
          transform = getCollectingTransform(card, index)
          opacity = isSelected ? 1 : 0
          transitionDuration = "1200ms"
          const distanceFromCenter = Math.abs(card.baseRotation)
          transitionDelay = `${distanceFromCenter * 12}ms`
        } else if (!cardsDealt) {
          transform = isMobile
            ? "translate(60vw, 80vh) rotate(-120deg) scale(0.8)"
            : "translate(-60vw, -80vh) rotate(120deg) scale(0.8)"
          opacity = 0
        } else if (isSelected) {
          transform = `rotate(${card.rotation}deg) translateY(${isMobile ? "-60px" : "60px"}) scale(1.05)`
        } else if (hoveredCard === card.id && canSelect) {
          transform = `rotate(${card.rotation}deg) translateY(${isMobile ? "-30px" : "30px"}) scale(1.1)`
        } else {
          transform = `rotate(${card.rotation}deg)`
        }

        return (
          <div
            key={card.id}
            className={`absolute transition-all ease-[cubic-bezier(0.19,1,0.22,1)] ${
              canSelect ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
            }`}
            style={{
              width: isMobile ? "90px" : "140px",
              height: isMobile ? "155px" : "240px",
              left: "50%",
              top: isMobile ? mobileCardTop : "auto",
              bottom: isMobile ? "auto" : "25%",
              marginLeft: isMobile ? "-45px" : "-70px",
              transformOrigin: isMobile ? "50% 280%" : "50% -180%",
              transform,
              opacity,
              transitionDuration: touchStartRef.current ? "50ms" : transitionDuration,
              transitionDelay: touchStartRef.current ? "0ms" : transitionDelay,
              zIndex: isSelected
                ? 1500 + selectedCardIds.indexOf(card.id)
                : hoveredCard === card.id
                  ? 1000
                  : card.zIndex,
              willChange: "transform, opacity",
            }}
            onMouseEnter={() => canSelect && !isSelected && setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(card.id)}
          >
            <div
              className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-500"
              style={{
                backgroundColor: "#24163f",
                border: isSelected
                  ? "2px solid #c9c0ff"
                  : hoveredCard === card.id && canSelect
                    ? "1px solid #b7adff"
                    : "1px solid #543d7a",
                boxShadow: isSelected
                  ? "0 0 26px rgba(201, 192, 255, 0.52), 0 10px 32px rgba(129, 114, 232, 0.28)"
                  : hoveredCard === card.id && canSelect
                    ? "0 0 20px rgba(183, 173, 255, 0.28)"
                    : "-5px 5px 20px rgba(0,0,0,0.6)",
                filter: isSelected
                  ? "brightness(1.15)"
                  : hoveredCard === card.id && canSelect
                    ? "brightness(1.1)"
                    : "brightness(1)",
              }}
            >
              <Image src="https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/back1.jpg" alt="Tarot card back" fill className="object-cover" priority />
              <div
                className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 rounded-lg pointer-events-none"
                style={{
                  border: isSelected ? "1px solid rgba(201, 192, 255, 0.5)" : "1px solid rgba(201, 192, 255, 0.24)",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
