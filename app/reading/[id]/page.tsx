"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import type { DrawnCard } from "@/lib/tarot-cards"
import { getCardName } from "@/lib/tarot-cards"
import ReactMarkdown from "react-markdown"
import { useLanguage } from "@/contexts/language-context"
import { readingApi, ReadingRecord } from "@/lib/api"

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
      <div className="fixed inset-0 bg-gradient-to-b from-mystic-bg to-mystic-bg-deep flex items-center justify-center">
        <div className="text-mystic-foreground-muted">加载中...</div>
      </div>
    )
  }

  if (error || !reading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-mystic-bg to-mystic-bg-deep flex items-center justify-center p-4">
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

  const cards = reading.cards as DrawnCard[]

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-mystic-bg to-mystic-bg-deep overflow-auto scrollbar-hide">
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
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
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
                  {index === 0 ? t("tarot.past") : index === 1 ? t("tarot.present") : t("tarot.future")}
                </p>
                <p className="text-mystic-foreground text-sm font-medium">
                  {getCardName(card, language)}
                </p>
                <p className="text-mystic-foreground-muted text-xs">
                  ({card.isReversed ? t("tarot.reversed") : t("tarot.upright")})
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 解读内容 */}
        {reading.interpretation && (
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
                  {reading.interpretation}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

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

