"use client"

import { Suspense, useEffect, useMemo, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { QuestionInput } from "@/components/tarot/question-input"
import { CardSpread } from "@/components/tarot/card-spread"
import { CardSelectionHeader } from "@/components/tarot/card-selection-header"
import { ShuffleButton } from "@/components/tarot/shuffle-button"
import { TAROT_CARDS, type DrawnCard } from "@/lib/tarot-cards"
import { analyticsApi, readingApi, type SpreadConfig, type DeckType } from "@/lib/api"
import { getFreeSpreadFallback, getSpreadConfig, isAdvancedSpreadType, SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { isSeoLocale } from "@/lib/locales"

type PageState = "dealing" | "input" | "shuffling" | "spread_choice" | "selecting" | "collecting"

const PRE_SPREAD_SHUFFLE_DELAY_MS = 760

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

function localizeSpreadFallbackName(value: string | undefined, locale: string) {
  if (!value) return ""
  const normalized = value.trim().toLowerCase()
  const dictionaries: Record<string, Record<string, string>> = {
    es: {
      "past present future": "Pasado Presente Futuro",
      "yes or no": "Si o No",
      "free reconciliation starter": "Inicio gratis de reconciliacion",
      "free love starter": "Inicio gratis de amor",
      "free career starter": "Inicio gratis de carrera",
      "free decision starter": "Inicio gratis de decision",
    },
    "pt-br": {
      "past present future": "Passado Presente Futuro",
      "yes or no": "Sim ou Nao",
      "free reconciliation starter": "Inicio gratis de reconciliacao",
      "free love starter": "Inicio gratis de amor",
      "free career starter": "Inicio gratis de carreira",
      "free decision starter": "Inicio gratis de decisao",
    },
  }
  return dictionaries[locale]?.[normalized] || value
}

function InputContent() {
  const [pageState, setPageState] = useState<PageState>("dealing")
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([])
  const [question, setQuestion] = useState("")
  const [shuffleKey, setShuffleKey] = useState(0)
  const [spreadInfo, setSpreadInfo] = useState<SpreadInfo | null>(null)
  const [dealImmediatelyAfterChoice, setDealImmediatelyAfterChoice] = useState(false)
  const [advancedSpreadPrompt, setAdvancedSpreadPrompt] = useState<{
    requestedName: string
    fallbackName: string
  } | null>(null)
  const hasSubmittedQuestion = useRef(false)
  const spreadChoiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const initialQuestion = searchParams.get("q") || ""
  const autoStart = searchParams.get("auto") === "1"
  const requestedSpread = searchParams.get("spread")
  const requestedLocale = searchParams.get("lang") || ""
  const source = searchParams.get("source") || searchParams.get("utm_source") || ""
  const readingLocale = isSeoLocale(requestedLocale) ? requestedLocale : language
  const preferredSpreadType = isSpreadType(requestedSpread) ? requestedSpread : null

  // 根据牌阵配置获取需要选择的卡牌数量
  const requiredCardCount = spreadInfo?.config.cardCount || 3
  const hasAdvancedSpreadAccess = Boolean(user?.is_member)

  const getLocalizedSpreadName = (config: SpreadConfig) => {
    if (readingLocale === "zh") return config.name
    if (readingLocale === "ja") return config.nameJa || config.nameEn || config.name
    if (readingLocale === "ko") return config.nameKo || config.nameEn || config.name
    return localizeSpreadFallbackName(config.nameEn || config.name, readingLocale)
  }

  const intentHintCopy =
    {
      zh: {
        eyebrow: "已匹配免费牌阵",
        title: "问题已带入，直接抽牌",
        body: "我们已经根据入口问题预选牌阵；你只需要选择卡牌。",
        source: "来源",
      },
      en: {
        eyebrow: "Matched free spread",
        title: "Your question is ready",
        body: "The entry page already matched a spread for this question. Pick your cards to continue free.",
        source: "Source",
      },
      ja: {
        eyebrow: "無料スプレッドを選択済み",
        title: "質問は準備できています",
        body: "入口ページから質問とスプレッドを引き継ぎました。カードを選んで続けられます。",
        source: "Source",
      },
      ko: {
        eyebrow: "무료 스프레드 매칭됨",
        title: "질문이 준비되었습니다",
        body: "입구 페이지에서 질문과 스프레드를 이어받았습니다. 카드를 선택해 무료로 계속하세요.",
        source: "Source",
      },
      es: {
        eyebrow: "Tirada gratis elegida",
        title: "Tu pregunta esta lista",
        body: "La pagina de entrada ya eligio una tirada para esta pregunta. Elige tus cartas para continuar gratis.",
        source: "Origen",
      },
      "pt-br": {
        eyebrow: "Tiragem gratis escolhida",
        title: "Sua pergunta esta pronta",
        body: "A pagina de entrada ja escolheu uma tiragem para esta pergunta. Escolha as cartas para continuar gratis.",
        source: "Origem",
      },
    }[readingLocale] || {
      eyebrow: "Matched free spread",
      title: "Your question is ready",
      body: "The entry page already matched a spread for this question. Pick your cards to continue free.",
      source: "Source",
    }

  const advancedSpreadCopy =
    {
      zh: {
        title: "已切换为免费三牌阵",
        body: "{requested} 是会员高级牌阵。你可以先用 {fallback} 免费解读，之后再升级查看完整牌阵。",
        freeLabel: "免费先开始",
        memberLabel: "会员完整牌阵",
        button: "查看会员功能",
      },
      en: {
        title: "Switched to a free starter spread",
        body: "{requested} is an advanced member spread. Start free with {fallback}, then upgrade when you want the full spread.",
        freeLabel: "Start free",
        memberLabel: "Member full spread",
        button: "View membership",
      },
      ja: {
        title: "無料スタータースプレッドに切り替えました",
        body: "{requested} はメンバー向けの高度なスプレッドです。まず {fallback} で無料リーディングを始められます。",
        freeLabel: "まず無料",
        memberLabel: "メンバー完全版",
        button: "メンバー機能を見る",
      },
      ko: {
        title: "무료 기본 스프레드로 전환했습니다",
        body: "{requested}은 멤버용 고급 스프레드입니다. 먼저 {fallback}으로 무료 리딩을 시작할 수 있습니다.",
        freeLabel: "무료 먼저",
        memberLabel: "멤버 전체 스프레드",
        button: "멤버십 보기",
      },
      es: {
        title: "Cambiamos a una tirada inicial gratis",
        body: "{requested} es una tirada avanzada para miembros. Empieza gratis con {fallback} y mejora cuando quieras la tirada completa.",
        freeLabel: "Empieza gratis",
        memberLabel: "Tirada completa",
        button: "Ver membresia",
      },
      "pt-br": {
        title: "Mudamos para uma tiragem inicial gratis",
        body: "{requested} e uma tiragem avancada para membros. Comece gratis com {fallback} e faca upgrade quando quiser a tiragem completa.",
        freeLabel: "Comece gratis",
        memberLabel: "Tiragem completa",
        button: "Ver assinatura",
      },
    }[readingLocale] || {
      title: "Switched to a free starter spread",
      body: "{requested} is an advanced member spread. Start free with {fallback}, then upgrade when you want the full spread.",
      freeLabel: "Start free",
      memberLabel: "Member full spread",
      button: "View membership",
    }

  const spreadChoiceCopy =
    {
      zh: {
        eyebrow: "确认牌阵",
        title: "默认免费三牌阵",
        genericTitle: "确认免费牌阵",
        body: "先确认牌阵，确认后再进入抽牌，避免选择窗口遮挡卡牌。",
        freeLabel: "当前免费牌阵",
        cardCount: "张牌",
        memberLocked: "会员解锁",
        confirm: "确认并开始抽牌",
        shuffling: "正在洗牌",
        shufflingBody: "先整理能量，再让你确认本次牌阵。",
      },
      en: {
        eyebrow: "Confirm spread",
        title: "Default free three-card spread",
        genericTitle: "Confirm free spread",
        body: "Confirm the spread first. Card selection starts only after this dialog closes.",
        freeLabel: "Current free spread",
        cardCount: "cards",
        memberLocked: "Member unlock",
        confirm: "Confirm and draw",
        shuffling: "Shuffling",
        shufflingBody: "Preparing the deck before you confirm this reading.",
      },
      ja: {
        eyebrow: "スプレッド確認",
        title: "無料3枚スプレッド",
        genericTitle: "無料スプレッドを確認",
        body: "先にスプレッドを確認し、ダイアログを閉じてからカード選択に進みます。",
        freeLabel: "現在の無料スプレッド",
        cardCount: "枚",
        memberLocked: "メンバー限定",
        confirm: "確認してカードを選ぶ",
        shuffling: "シャッフル中",
        shufflingBody: "スプレッド確認の前にデッキを整えています。",
      },
      ko: {
        eyebrow: "스프레드 확인",
        title: "기본 무료 3카드 스프레드",
        genericTitle: "무료 스프레드 확인",
        body: "먼저 스프레드를 확인하고, 창이 닫힌 뒤 카드 선택이 시작됩니다.",
        freeLabel: "현재 무료 스프레드",
        cardCount: "장",
        memberLocked: "멤버십 잠금",
        confirm: "확인하고 카드 뽑기",
        shuffling: "셔플 중",
        shufflingBody: "이번 리딩을 확인하기 전에 덱을 준비하고 있습니다.",
      },
      es: {
        eyebrow: "Confirmar tirada",
        title: "Tirada gratis de tres cartas",
        genericTitle: "Confirmar tirada gratis",
        body: "Primero confirma la tirada. La seleccion de cartas empieza cuando se cierre este dialogo.",
        freeLabel: "Tirada gratis actual",
        cardCount: "cartas",
        memberLocked: "Desbloqueo miembro",
        confirm: "Confirmar y elegir",
        shuffling: "Barajando",
        shufflingBody: "Preparando el mazo antes de confirmar esta lectura.",
      },
      "pt-br": {
        eyebrow: "Confirmar tiragem",
        title: "Tiragem gratis de tres cartas",
        genericTitle: "Confirmar tiragem gratis",
        body: "Confirme a tiragem primeiro. A escolha das cartas comeca so depois que este dialogo fechar.",
        freeLabel: "Tiragem gratis atual",
        cardCount: "cartas",
        memberLocked: "Desbloqueio membro",
        confirm: "Confirmar e tirar",
        shuffling: "Embaralhando",
        shufflingBody: "Preparando o baralho antes de confirmar esta leitura.",
      },
    }[readingLocale] || {
      eyebrow: "Confirm spread",
      title: "Default free three-card spread",
      genericTitle: "Confirm free spread",
      body: "Confirm the spread first. Card selection starts only after this dialog closes.",
      freeLabel: "Current free spread",
      cardCount: "cards",
      memberLocked: "Member unlock",
      confirm: "Confirm and draw",
      shuffling: "Shuffling",
      shufflingBody: "Preparing the deck before you confirm this reading.",
    }

  const resolveSpreadForAccess = (info: SpreadInfo, serverFreeStarter?: SpreadInfo): SpreadInfo => {
    if (!isAdvancedSpreadType(info.type) || hasAdvancedSpreadAccess) {
      setAdvancedSpreadPrompt(null)
      return info
    }

    const fallback = serverFreeStarter || createLocalSpreadInfo(
      getFreeSpreadFallback(info.type).type,
      "Advanced spread reserved for members; using a free starter spread.",
      Math.min(info.confidence, 0.72),
    )
    setAdvancedSpreadPrompt({
      requestedName: getLocalizedSpreadName(info.config),
      fallbackName: getLocalizedSpreadName(fallback.config),
    })
    return fallback
  }

  const handleCardsDealt = () => {
    if (!hasSubmittedQuestion.current) {
      setPageState("input")
    }
  }

  const clearSpreadChoiceTimer = () => {
    if (spreadChoiceTimer.current) {
      clearTimeout(spreadChoiceTimer.current)
      spreadChoiceTimer.current = null
    }
  }

  const beginSpreadChoiceFlow = (nextSpreadInfo: SpreadInfo) => {
    clearSpreadChoiceTimer()
    setSelectedCardIds([])
    setDealImmediatelyAfterChoice(false)
    setSpreadInfo(nextSpreadInfo)
    setPageState("shuffling")
    spreadChoiceTimer.current = setTimeout(() => {
      setPageState("spread_choice")
      spreadChoiceTimer.current = null
    }, PRE_SPREAD_SHUFFLE_DELAY_MS)
  }

  const handleSpreadChoiceConfirm = () => {
    clearSpreadChoiceTimer()
    setSelectedCardIds([])
    setDealImmediatelyAfterChoice(true)
    analyticsApi.track("spread_confirmed", {
      ...getCurrentAttribution(),
      locale: readingLocale,
      keyword: question,
      metadata: {
        spread_type: spreadInfo?.type || "three_card",
        card_count: spreadInfo?.config.cardCount || 3,
        deck_type: spreadInfo?.deckType || "major",
        had_member_upgrade_prompt: Boolean(advancedSpreadPrompt),
      },
    })
    setPageState("selecting")
  }

  useEffect(() => {
    return () => clearSpreadChoiceTimer()
  }, [])

  const handleQuestionSubmit = async (q: string) => {
    setQuestion(q)
    hasSubmittedQuestion.current = true
    setSelectedCardIds([])
    setDealImmediatelyAfterChoice(false)
    setAdvancedSpreadPrompt(null)
    setPageState("shuffling")
    analyticsApi.track("question_submitted", {
      ...getCurrentAttribution(),
      locale: readingLocale,
      keyword: q,
      metadata: {
        question_length: q.length,
        requested_spread: preferredSpreadType || undefined,
      },
    })

    if (preferredSpreadType) {
      beginSpreadChoiceFlow(resolveSpreadForAccess(createLocalSpreadInfo(preferredSpreadType, "Matched from the landing page intent", 0.92)))
      return
    }

    try {
      // 调用问题分类API
      const result = await readingApi.classifyQuestion(q, readingLocale)
      const serverFreeStarter =
        result.free_starter_spread_type && result.free_starter_spread_config
          ? {
              type: result.free_starter_spread_type,
              config: result.free_starter_spread_config,
              deckType:
                result.free_starter_deck_type ||
                (result.free_starter_spread_config.cardCount <= 3 ? "major" : "full"),
              reason:
                result.free_first_message ||
                "Advanced spread reserved for members; using a free starter spread.",
              confidence: Math.min(result.confidence, 0.72),
            }
          : undefined

      beginSpreadChoiceFlow(resolveSpreadForAccess({
        type: result.spread_type,
        config: result.spread_config,
        deckType: result.deck_type || 'major',  // 牌组类型
        reason: result.reason,
        confidence: result.confidence,
      }, serverFreeStarter))
    } catch (error) {
      console.error("问题分类失败:", error)
      // 使用默认的三牌阵
      setAdvancedSpreadPrompt(null)
      beginSpreadChoiceFlow(createLocalSpreadInfo("three_card", "使用默认牌阵", 0.5))
    }
  }

  useEffect(() => {
    if ((pageState === "input" || pageState === "dealing") && autoStart && initialQuestion && !hasSubmittedQuestion.current) {
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
      locale: readingLocale,
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
        readingLocale,
      }),
    )
    router.push("/reveal")
  }

  const handleShuffle = () => {
    setSelectedCardIds([])
    setDealImmediatelyAfterChoice(false)
    setShuffleKey((k) => k + 1)
  }

  const showCardSpread = pageState === "dealing" || pageState === "selecting" || pageState === "collecting"
  const hasEntryQuestionContext = Boolean(
    initialQuestion &&
      autoStart &&
      spreadInfo &&
      (pageState === "spread_choice" || pageState === "selecting" || pageState === "collecting"),
  )
  const shouldShowIntentHint = Boolean(hasEntryQuestionContext && !advancedSpreadPrompt)

  const intentSourceLabel = useMemo(() => {
    const normalized = source.replace(/[_-]+/g, " ").trim()
    if (!normalized) return "POPTarot"
    return normalized
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }, [source])
  const matchedSpreadLabel = spreadInfo ? getLocalizedSpreadName(spreadInfo.config) : ""

  return (
    <div
      data-input-page
      className="fixed inset-0 flex h-[100dvh] min-h-[100svh] w-screen items-center justify-center overflow-hidden overscroll-none"
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

      {showCardSpread && (
        <div data-input-card-selection-surface className="absolute inset-0 z-10">
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
            locale={readingLocale}
            dealImmediately={dealImmediatelyAfterChoice}
          />
        </div>
      )}

      <CardSelectionHeader
        visible={pageState === "selecting" || pageState === "collecting"}
        selectedCount={selectedCardIds.length}
        totalCards={requiredCardCount}
        question={question}
        onShuffle={handleShuffle}
        showShuffle={false}
        spreadConfig={spreadInfo?.config}
        deckType={spreadInfo?.deckType || 'major'}
        locale={readingLocale}
      />

      <ShuffleButton
        visible={selectedCardIds.length === 0 && pageState === "selecting"}
        onClick={handleShuffle}
        locale={readingLocale}
      />

      {pageState === "shuffling" && (
        <div
          data-input-shuffle-prelude
          className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
        >
          <style>{`
            @keyframes poptarotPrepCardLeft {
              0%, 100% { transform: translateX(-0.6rem) rotate(-10deg); }
              50% { transform: translateX(-2.2rem) translateY(-0.25rem) rotate(-18deg); }
            }

            @keyframes poptarotPrepCardRight {
              0%, 100% { transform: translateX(0.6rem) rotate(10deg); }
              50% { transform: translateX(2.2rem) translateY(0.25rem) rotate(18deg); }
            }

            @keyframes poptarotPrepCardCenter {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-0.45rem) rotate(2deg); }
            }
          `}</style>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(153,128,255,0.25),rgba(15,5,24,0.3)_44%,rgba(7,2,13,0.58)_100%)] backdrop-blur-[2px]" />
          <div data-input-prep-deck className="relative z-10 h-44 w-32" aria-hidden="true">
            {[
              ["poptarotPrepCardLeft 1.35s ease-in-out infinite", "0.66", "-0.75rem"],
              ["poptarotPrepCardRight 1.35s ease-in-out infinite", "0.78", "0.75rem"],
              ["poptarotPrepCardCenter 1.35s ease-in-out infinite", "1", "0"],
            ].map(([animation, opacity, top], index) => (
              <div
                key={index}
                className="absolute inset-0 rounded-xl border border-[#e7dcaf]/50 bg-cover bg-center shadow-[0_18px_42px_rgba(0,0,0,0.38)]"
                style={{
                  animation,
                  backgroundImage: 'url("https://klinelife.oss-cn-beijing.aliyuncs.com/tarot/back1.jpg")',
                  opacity,
                  top,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 mt-7 w-[min(84vw,22rem)] rounded-2xl border border-[#c9c0ff]/18 bg-[#10081d]/72 px-5 py-4 shadow-[0_18px_46px_rgba(0,0,0,0.36)] backdrop-blur-md">
            <p className="text-sm font-medium tracking-[0.18em] text-[#f1ecff]">{spreadChoiceCopy.shuffling}</p>
            <p className="mt-2 text-xs leading-5 text-white/58">{spreadChoiceCopy.shufflingBody}</p>
          </div>
        </div>
      )}

      {shouldShowIntentHint && (
        <div
          data-input-intent-hint
          data-input-mobile-intent-compact
          className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+0.625rem)] z-40 w-[min(92vw,36rem)] -translate-x-1/2 rounded-xl border border-[#c9c0ff]/18 bg-[#10081d]/76 p-2.5 shadow-[0_14px_38px_rgba(0,0,0,0.32)] backdrop-blur-md sm:top-[calc(env(safe-area-inset-top)+1.25rem)] sm:p-4 sm:shadow-[0_18px_45px_rgba(0,0,0,0.36)]"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{intentHintCopy.eyebrow}</p>
              <h2 className="mt-1 truncate text-sm font-medium leading-snug text-[#f2edff] sm:text-base">{intentHintCopy.title}</h2>
              <p className="mt-1 line-clamp-1 text-xs leading-5 text-white/58 sm:line-clamp-2 sm:text-sm sm:leading-6">{question || initialQuestion}</p>
              <p className="mt-1 truncate text-[11px] leading-4 text-[#c9c0ff]/64 sm:hidden">{matchedSpreadLabel}</p>
            </div>
            <div className="hidden gap-1 rounded-lg border border-white/10 bg-black/18 px-3 py-2 text-xs text-white/54 sm:grid sm:min-w-[10rem]">
              <span className="truncate text-[#c9c0ff]/72">{matchedSpreadLabel}</span>
              <span className="truncate">
                {intentHintCopy.source}: {intentSourceLabel}
              </span>
            </div>
          </div>
          <p className="mt-2 hidden text-xs leading-5 text-white/45 sm:block">{intentHintCopy.body}</p>
        </div>
      )}

      {pageState === "spread_choice" && spreadInfo && (
        <div className="absolute inset-0 z-50 flex items-end justify-center px-0 pb-0 pt-[calc(env(safe-area-inset-top)+1rem)] sm:items-center sm:px-4 sm:pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="absolute inset-0 bg-[#07020d]/72 backdrop-blur-sm" />
          <div
            role="dialog"
            aria-modal="true"
            data-input-spread-choice-dialog
            className="relative max-h-[calc(100dvh-env(safe-area-inset-top)-1rem)] w-full overflow-y-auto rounded-t-[1.75rem] border-t border-[#c9c0ff]/22 bg-[#11091f]/94 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-28px_80px_rgba(0,0,0,0.52)] backdrop-blur-xl sm:w-[min(92vw,34rem)] sm:rounded-2xl sm:border sm:p-5 sm:shadow-[0_28px_80px_rgba(0,0,0,0.52)]"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/66">{spreadChoiceCopy.eyebrow}</p>
            <h2 className="mt-2 text-xl font-medium leading-tight text-[#f4f0ff] sm:text-2xl">
              {advancedSpreadPrompt
                ? advancedSpreadCopy.title
                : spreadInfo.config.cardCount === 3
                  ? spreadChoiceCopy.title
                  : spreadChoiceCopy.genericTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {advancedSpreadPrompt
                ? advancedSpreadCopy.body
                    .replace("{requested}", advancedSpreadPrompt.requestedName)
                    .replace("{fallback}", advancedSpreadPrompt.fallbackName)
                : spreadChoiceCopy.body}
            </p>

            <div data-input-free-first-boundary className="mt-5 grid gap-3">
              <button
                type="button"
                data-input-free-starter-spread
                aria-pressed="true"
                className="min-w-0 rounded-xl border border-[#c9c0ff]/38 bg-[#c9c0ff]/[0.12] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">
                  {advancedSpreadPrompt ? advancedSpreadCopy.freeLabel : spreadChoiceCopy.freeLabel}
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-[#f4f0ff]">
                  {advancedSpreadPrompt?.fallbackName || getLocalizedSpreadName(spreadInfo.config)}
                </span>
                <span className="mt-1 block text-xs text-white/46">
                  {spreadInfo.config.cardCount} {spreadChoiceCopy.cardCount}
                </span>
              </button>

              {advancedSpreadPrompt && (
                <div
                  data-input-member-spread-name
                  className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">{advancedSpreadCopy.memberLabel}</p>
                      <p className="mt-1 truncate text-sm font-medium text-white/64">{advancedSpreadPrompt.requestedName}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/44">
                      {spreadChoiceCopy.memberLocked}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {hasEntryQuestionContext && (
              <div
                data-input-entry-context
                className="mt-4 grid gap-1 rounded-xl border border-white/10 bg-black/18 px-3 py-2 text-xs text-white/54"
              >
                <p className="line-clamp-2 leading-5 text-white/64">{question || initialQuestion}</p>
                <p className="truncate text-[#c9c0ff]/70">
                  {intentHintCopy.source}: {intentSourceLabel}
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
              {advancedSpreadPrompt && (
                <button
                  data-input-member-upgrade-cta
                  type="button"
                  onClick={() => router.push("/membership")}
                  className="min-h-12 rounded-full border border-[#c9c0ff]/30 px-4 py-3 text-sm font-medium text-[#eeeaff] transition hover:border-[#eeeaff] hover:bg-[#c9c0ff]/10"
                >
                  {advancedSpreadCopy.button}
                </button>
              )}
              <button
                data-input-spread-choice-confirm
                type="button"
                onClick={handleSpreadChoiceConfirm}
                className="min-h-12 rounded-full border border-[#c9c0ff]/36 bg-[#d9d4ff] px-5 py-3 text-sm font-semibold text-[#160d24] shadow-[0_14px_42px_rgba(129,114,232,0.26)] transition hover:bg-[#eeeaff] active:scale-[0.98]"
              >
                {spreadChoiceCopy.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      <QuestionInput
        visible={pageState === "input"}
        onSubmit={handleQuestionSubmit}
        initialQuestion={initialQuestion}
        localeOverride={readingLocale}
      />
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
