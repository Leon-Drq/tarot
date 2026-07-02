"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getCardById, getCardName, TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"
import { getSpreadConfig, isKnownSpreadType } from "@/lib/spread-config"
import ReactMarkdown from "react-markdown"
import { useLanguage } from "@/contexts/language-context"
import { readingApi, type CardData, type ReadingRecord } from "@/lib/api"
import { cleanReadingMarkdownForUser, extractReadingSections } from "@/lib/reading-presentation"

type ReadingDetailCard = CardData & {
  id?: number
  image?: string
  nameEn?: string
  nameJa?: string
  nameKo?: string
}

function normalizeCardName(value?: string) {
  return value?.trim().toLowerCase() || ""
}

function resolveCatalogCard(card: ReadingDetailCard): TarotCard | undefined {
  if (typeof card.id === "number") {
    const byId = getCardById(card.id)
    if (byId) return byId
  }

  const names = new Set([card.name, card.nameEn, card.nameJa, card.nameKo].map(normalizeCardName).filter(Boolean))
  if (names.size === 0) return undefined

  return TAROT_CARDS.find((item) =>
    [item.name, item.nameEn, item.nameJa, item.nameKo].some((name) => names.has(normalizeCardName(name))),
  )
}

function localizedFallbackPosition(index: number, lang: string) {
  const labels =
    {
      zh: ["位置 1", "位置 2", "位置 3"],
      ja: ["位置 1", "位置 2", "位置 3"],
      ko: ["위치 1", "위치 2", "위치 3"],
      en: ["Position 1", "Position 2", "Position 3"],
    }[lang] || ["Position 1", "Position 2", "Position 3"]

  if (labels[index]) return labels[index]
  if (lang === "zh" || lang === "ja") return `位置 ${index + 1}`
  if (lang === "ko") return `위치 ${index + 1}`
  return `Position ${index + 1}`
}

function getReadingDetailPositionLabel(card: ReadingDetailCard, spreadType: string | undefined, index: number, lang: string) {
  if (card.position) return card.position

  if (isKnownSpreadType(spreadType)) {
    const position = getSpreadConfig(spreadType).positions[index]
    if (position) return lang === "zh" ? position.name : position.nameEn || position.name
  }

  return localizedFallbackPosition(index, lang)
}

function getReadingDetailCardName(card: ReadingDetailCard, lang: string) {
  const catalogCard = resolveCatalogCard(card)
  if (catalogCard) return getCardName(catalogCard, lang)
  if (lang === "zh") return card.name || card.nameEn || "Tarot Card"
  if (lang === "ja") return card.nameJa || card.nameEn || card.name || "Tarot Card"
  if (lang === "ko") return card.nameKo || card.nameEn || card.name || "Tarot Card"
  return card.nameEn || card.name || "Tarot Card"
}

function getReadingDetailCardImage(card: ReadingDetailCard) {
  return card.image || resolveCatalogCard(card)?.image || "/placeholder.svg"
}

export default function ReadingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { t, language } = useLanguage()
  const [reading, setReading] = useState<ReadingRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loadReading = async () => {
      const readingId = params.id as string
      if (!readingId) {
        router.push("/profile")
        return
      }

      try {
        setLoading(true)
        const data = await readingApi.getDetail(readingId)
        setReading(data)
        setError("")
      } catch (err) {
        console.error("Failed to load reading:", err)
        setError(err instanceof Error ? err.message : t("common.error"))
      } finally {
        setLoading(false)
        setTimeout(() => setMounted(true), 100)
      }
    }

    loadReading()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020103]">
        <div className="text-mystic-foreground-muted">加载中...</div>
      </div>
    )
  }

  if (error || !reading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020103] p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || t("errors.notFound")}</p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-2 rounded-lg bg-mystic-surface border border-mystic-border text-mystic-foreground hover:bg-mystic-surface-hover transition-colors"
          >
            返回个人中心
          </button>
        </div>
      </div>
    )
  }

  const cards = reading.cards as ReadingDetailCard[]
  const visibleInterpretation = cleanReadingMarkdownForUser(reading.interpretation || "")
  const detailSummarySections = extractReadingSections(visibleInterpretation, 3)
  const returnCopy =
    {
      zh: {
        eyebrow: "每日复访",
        title: "把这次历史解读接到明天的每日塔罗",
        body: "如果这个主题还在反复出现，明天抽一张免费每日牌，保留连续打卡和日记，看看它是否变成你的长期模式。",
        daily: "打开每日塔罗",
        free: "再问一个免费问题",
        tools: "免费工具",
        summaryEyebrow: "答案摘要",
        summaryTitle: "先看这次历史解读的重点",
      },
      en: {
        eyebrow: "Daily return",
        title: "Use this saved reading as tomorrow's Daily Tarot",
        body: "If this theme keeps returning, draw one free daily card tomorrow, keep your streak, and add a journal note so the pattern becomes easier to see.",
        daily: "Open Daily Tarot",
        free: "New Free Question",
        tools: "Free Tools",
        summaryEyebrow: "Answer summary",
        summaryTitle: "Start with the saved reading highlights",
      },
      ja: {
        eyebrow: "毎日の再訪",
        title: "保存したリーディングを明日のデイリータロットへ",
        body: "このテーマが続いているなら、明日また無料の1枚を引き、連続記録と日記でパターンを見やすくしましょう。",
        daily: "デイリータロット",
        free: "別の無料質問",
        tools: "無料ツール",
        summaryEyebrow: "答えの要約",
        summaryTitle: "保存したリーディングの要点",
      },
      ko: {
        eyebrow: "매일 돌아오기",
        title: "저장한 리딩을 내일의 데일리 타로로 이어가기",
        body: "이 주제가 계속 돌아온다면 내일 무료 일일 카드를 뽑고, 연속 기록과 저널로 패턴을 더 쉽게 확인하세요.",
        daily: "데일리 타로",
        free: "무료 질문 더 하기",
        tools: "무료 도구",
        summaryEyebrow: "답변 요약",
        summaryTitle: "저장한 리딩의 핵심",
      },
    }[language] || {
      eyebrow: "Daily return",
      title: "Use this saved reading as tomorrow's Daily Tarot",
      body: "If this theme keeps returning, draw one free daily card tomorrow, keep your streak, and add a journal note so the pattern becomes easier to see.",
      daily: "Open Daily Tarot",
      free: "New Free Question",
      tools: "Free Tools",
      summaryEyebrow: "Answer summary",
      summaryTitle: "Start with the saved reading highlights",
    }
  const returnParams = new URLSearchParams({
    utm_source: "reading_history",
    utm_medium: "return_path",
    utm_campaign: "saved_reading",
    lang: language,
  })
  const detailDailyReturnHref = `/daily-tarot?${returnParams.toString()}`
  const detailFreeReadingHref = `/input?${returnParams.toString()}&source=history_return`
  const detailToolsHref = `/free-tarot-tools?${returnParams.toString()}`

  return (
    <div className="fixed inset-0 overflow-auto bg-[radial-gradient(circle_at_50%_0%,rgba(128,102,193,0.18)_0%,rgba(8,4,17,0.98)_36%,#020103_100%)] text-mystic-foreground scrollbar-hide">
      {/* 返回按钮 */}
      <button
        onClick={() => router.push("/profile")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-mystic-surface/80 backdrop-blur-sm border border-mystic-border text-mystic-foreground hover:bg-mystic-surface transition-colors"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>{t("profile.backButton")}</span>
      </button>

      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* 标题区域 */}
        <div
          className="text-center mb-12"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.7s ease-out",
          }}
        >
          <p className="text-mystic-foreground-muted text-xs tracking-widest mb-2">
            {new Date(reading.created_at).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-2xl sm:text-3xl text-mystic-foreground font-light mb-2">
            {reading.question || t("nav.reading")}
          </h1>
        </div>

        {/* 卡牌展示 */}
        <div
          className="flex flex-wrap items-start justify-center gap-6 mb-12"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.3s",
          }}
        >
          {cards.map((card, index) => (
            <div key={card.id} className="flex flex-col items-center">
              {/* 卡牌 */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  width: "140px",
                  height: "240px",
                  border: "2px solid #dcb360",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={getReadingDetailCardImage(card)}
                  alt={getReadingDetailCardName(card, language)}
                  fill
                  className="object-cover"
                  style={{
                    transform: card.isReversed ? "rotate(180deg)" : "none",
                  }}
                />
                <div
                  className="absolute top-2 left-2 right-2 bottom-2 rounded-lg pointer-events-none"
                  style={{ border: "1px solid rgba(220, 179, 96, 0.4)" }}
                />
              </div>

              {/* 卡牌信息 */}
              <div className="mt-4 text-center">
                <p className="text-mystic-foreground-muted text-xs mb-1">
                  {getReadingDetailPositionLabel(card, reading.spread_type, index, language)}
                </p>
                <p className="text-mystic-foreground text-sm font-medium">
                  {getReadingDetailCardName(card, language)}
                </p>
                <p className="text-mystic-foreground-muted text-xs">
                  ({card.isReversed ? t("tarot.reversed") : t("tarot.upright")})
                </p>
              </div>
            </div>
          ))}
        </div>

        {detailSummarySections.length > 0 && (
          <section
            className="mb-8 rounded-xl border border-[#c9c0ff]/20 bg-[#0c0715]/72 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-6"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease-out 0.5s",
            }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/72">{returnCopy.summaryEyebrow}</p>
            <h2 className="mt-2 text-lg font-medium leading-snug text-mystic-foreground">{returnCopy.summaryTitle}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {detailSummarySections.map((section) => (
                <article key={`${section.title}-${section.body}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <h3 className="break-words text-sm font-medium text-mystic-foreground">{section.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-mystic-foreground-muted">{section.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 解读内容 */}
        {visibleInterpretation && (
          <div
            className="prose prose-invert max-w-none"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease-out 0.6s",
            }}
          >
            <div className="p-6 rounded-xl bg-mystic-surface/30 border border-mystic-border">
              <h2 className="text-mystic-foreground text-xl font-medium mb-4">
                {t("tarot.interpretation")}
              </h2>
              <div className="text-mystic-foreground-muted leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-mystic-foreground mt-6 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-mystic-foreground mt-5 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium text-mystic-foreground mt-4 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="ml-4">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-mystic-foreground">{children}</strong>,
                    em: ({ children }) => <em className="italic text-mystic-accent">{children}</em>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-mystic-accent pl-4 italic my-4 text-mystic-foreground-muted">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-mystic-surface-hover px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {visibleInterpretation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        <section
          data-reading-detail-return-path
          className="mt-8 rounded-xl border border-[#c9c0ff]/22 bg-[#0c0715]/92 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.36)] backdrop-blur-sm sm:p-6"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.75s",
          }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/72">{returnCopy.eyebrow}</p>
              <h2 className="mt-2 text-base font-medium text-mystic-foreground">{returnCopy.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-mystic-foreground-muted">{returnCopy.body}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 md:min-w-[32rem]">
              <Link
                href={detailDailyReturnHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c9c0ff] px-4 py-2 text-sm font-medium text-[#130d27] transition hover:bg-[#eeeaff]"
              >
                {returnCopy.daily}
              </Link>
              <Link
                href={detailFreeReadingHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm text-mystic-foreground-muted transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-mystic-foreground"
              >
                {returnCopy.free}
              </Link>
              <Link
                href={detailToolsHref}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm text-mystic-foreground-muted transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-mystic-foreground"
              >
                {returnCopy.tools}
              </Link>
            </div>
          </div>
        </section>

        {/* 底部按钮 */}
        <div
          className="mt-12 flex justify-center gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.9s",
          }}
        >
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-full border border-mystic-border text-mystic-foreground hover:bg-mystic-surface transition-colors"
          >
            {t("tarot.startNewReading")}
          </button>
        </div>
      </div>
    </div>
  )
}
