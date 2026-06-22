"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { QuestionInput } from "@/components/tarot/question-input"
import { CardSpread } from "@/components/tarot/card-spread"
import { CardSelectionHeader } from "@/components/tarot/card-selection-header"
import { ShuffleButton } from "@/components/tarot/shuffle-button"
import { TAROT_CARDS, type DrawnCard } from "@/lib/tarot-cards"
import { analyticsApi, readingApi, type SpreadConfig, type DeckType } from "@/lib/api"
import { getSpreadConfig, SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { useLanguage } from "@/contexts/language-context"
import { getCurrentAttribution } from "@/lib/client-analytics"

type PageState = "dealing" | "input" | "classifying" | "selecting" | "collecting"

interface SpreadInfo {
  type: string
  config: SpreadConfig
  deckType: DeckType  // 牌组类型
  reason: string
  confidence: number
}

function isSpreadType(value: string | null): value is SpreadType {
  return !!value && Object.prototype.hasOwnProperty.call(SPREAD_CONFIGS, value)
}

function createLocalSpreadInfo(type: SpreadType, reason: string, confidence: number): SpreadInfo {
  const config = getSpreadConfig(type)
  return {
    type,
    config,
    deckType: config.cardCount <= 3 ? "major" : "full",
    reason,
    confidence,
  }
}

function InputContent() {
  const [pageState, setPageState] = useState<PageState>("dealing")
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  const [question, setQuestion] = useState("")
  const [shuffleKey, setShuffleKey] = useState(0)
  const [spreadInfo, setSpreadInfo] = useState<SpreadInfo | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const hasSubmittedQuestion = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, language } = useLanguage()
  const initialQuestion = searchParams.get("q") || ""
  const autoStart = searchParams.get("auto") === "1"
  const requestedSpread = searchParams.get("spread")
  const preferredSpreadType = isSpreadType(requestedSpread) ? requestedSpread : null

  // 根据牌阵配置获取需要选择的卡牌数量
  const requiredCardCount = spreadInfo?.config.cardCount || 3

  const handleCardsDealt = () => {
    if (!hasSubmittedQuestion.current) {
      setPageState("input")
    }
  }

  const handleQuestionSubmit = async (q: string) => {
    setQuestion(q)
    hasSubmittedQuestion.current = true
    setPageState("classifying")
    setIsClassifying(true)
    analyticsApi.track("question_submitted", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: q,
      metadata: {
        question_length: q.length,
      },
    })

    if (preferredSpreadType) {
      setSpreadInfo(createLocalSpreadInfo(preferredSpreadType, "Matched from the landing page intent", 0.92))
      setIsClassifying(false)
      setPageState("selecting")
      return
    }

    try {
      // 调用问题分类API
      const result = await readingApi.classifyQuestion(q, language)
      setSpreadInfo({
        type: result.spread_type,
        config: result.spread_config,
        deckType: result.deck_type || 'major',  // 牌组类型
        reason: result.reason,
        confidence: result.confidence,
      })
    } catch (error) {
      console.error("问题分类失败:", error)
      // 使用默认的三牌阵
      setSpreadInfo(createLocalSpreadInfo("three_card", "使用默认牌阵", 0.5))
    } finally {
      setIsClassifying(false)
      setPageState("selecting")
    }
  }

  useEffect(() => {
    if (pageState === "input" && autoStart && initialQuestion && !hasSubmittedQuestion.current) {
      void handleQuestionSubmit(initialQuestion)
    }
  }, [pageState, autoStart, initialQuestion])

  const handleCardSelect = (cardId: number) => {
    setSelectedCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId)
      } else if (prev.length < requiredCardCount) {
        const newSelected = [...prev, cardId]
        if (newSelected.length === requiredCardCount) {
          setTimeout(() => setPageState("collecting"), 800)
        }
        return newSelected
      }
      return prev
    })
  }

  const handleCollectComplete = () => {
    const drawnCards: DrawnCard[] = selectedCardIds.map((id) => {
      const card = TAROT_CARDS.find((c) => c.id === id) || TAROT_CARDS[0]
      return {
        ...card,
        isReversed: Math.random() < 0.5, // 50%概率逆位
      }
    })

    analyticsApi.track("cards_selected", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: question,
      metadata: {
        spread_type: spreadInfo?.type || "three_card",
        card_count: drawnCards.length,
        deck_type: spreadInfo?.deckType || "major",
      },
    })

    sessionStorage.setItem(
      "tarotReading",
      JSON.stringify({
        question,
        drawnCards,
        spreadType: spreadInfo?.type || "three_card",
        spreadConfig: spreadInfo?.config,
        deckType: spreadInfo?.deckType || "major",
      }),
    )
    router.push("/reveal")
  }

  const handleShuffle = () => {
    setSelectedCardIds([])
    setShuffleKey((k) => k + 1)
  }

  return (
    <div
      className="fixed inset-0 w-screen h-[100dvh] overflow-hidden touch-none flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at 50% -10%, #5a3c85 0%, #241438 40%, #0f0518 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none"
        style={{
          height: "40vh",
          background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)",
          zIndex: 2,
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          bottom: "-30vh",
          width: "120vw",
          height: "120vw",
          border: "1px solid rgba(255,255,255,0.05)",
          zIndex: 2,
        }}
      />

      <CardSpread
        key={`${shuffleKey}-${spreadInfo?.deckType || 'major'}`}
        onCardsDealt={handleCardsDealt}
        selectionMode={pageState === "selecting"}
        collectingMode={pageState === "collecting"}
        onCardSelect={handleCardSelect}
        selectedCardIds={selectedCardIds}
        onCollectComplete={handleCollectComplete}
        maxCards={requiredCardCount}
        deckType={spreadInfo?.deckType || 'major'}
      />

      <CardSelectionHeader
        visible={pageState === "selecting" || pageState === "collecting"}
        selectedCount={selectedCardIds.length}
        totalCards={requiredCardCount}
        question={question}
        onShuffle={handleShuffle}
        showShuffle={false}
        spreadConfig={spreadInfo?.config}
        deckType={spreadInfo?.deckType || 'major'}
      />

      <ShuffleButton
        visible={selectedCardIds.length === 0 && pageState === "selecting"}
        onClick={handleShuffle}
      />

      {/* 问题分类中的加载状态 */}
      {pageState === "classifying" && (
        <>
          <div
            className="absolute inset-0 z-10 transition-all duration-500 opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 24%, rgba(101, 80, 176, 0.9) 0%, rgba(31, 18, 53, 0.98) 50%, rgba(8, 3, 16, 1) 100%)",
              backdropFilter: "blur(12px)",
            }}
          />
          <div className="relative z-20 flex flex-col items-center justify-center gap-6">
            <div className="animate-pulse">
              <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin text-[#c9c0ff]/70">
                <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="50 100" />
              </svg>
            </div>
            <p className="text-white/70 text-lg">
              {{
                zh: '正在分析你的问题...',
                en: 'Analyzing your question...',
                ja: '質問を分析しています...',
                ko: '질문을 분석 중...',
              }[language] || '正在分析你的问题...'}
            </p>
            <p className="text-white/40 text-sm">
              {{
                zh: '为你匹配最适合的牌阵',
                en: 'Finding the best spread for you',
                ja: '最適なスプレッドを見つけています',
                ko: '최적의 스프레드를 찾는 중',
              }[language] || '为你匹配最适合的牌阵'}
            </p>
          </div>
        </>
      )}

      <QuestionInput visible={pageState === "input"} onSubmit={handleQuestionSubmit} initialQuestion={initialQuestion} />
    </div>
  )
}

export default function InputPage() {
  return (
    <Suspense fallback={null}>
      <InputContent />
    </Suspense>
  )
}
