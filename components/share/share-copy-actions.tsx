"use client"

import { useState } from "react"
import { Copy, Instagram } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi, type ReadingShareCard } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { createShareTemplate, type ShareTemplatePlatform } from "@/lib/share-templates"

type Props = {
  question: string
  cards: ReadingShareCard[]
  interpretation: string
  url: string
}

export function ShareCopyActions({ question, cards, interpretation, url }: Props) {
  const { language } = useLanguage()
  const [status, setStatus] = useState("")

  const copy = {
    zh: {
      xhs: "复制小红书文案",
      instagram: "复制 Instagram 文案",
      copied: "文案已复制",
    },
    en: {
      xhs: "Copy Xiaohongshu",
      instagram: "Copy Instagram",
      copied: "Caption copied",
    },
    ja: {
      xhs: "小紅書テキストをコピー",
      instagram: "Instagramをコピー",
      copied: "テキストをコピーしました",
    },
    ko: {
      xhs: "샤오홍슈 문구 복사",
      instagram: "Instagram 복사",
      copied: "문구를 복사했습니다",
    },
  }[language]

  const handleCopy = async (platform: ShareTemplatePlatform) => {
    const text = createShareTemplate({
      platform,
      locale: language,
      question,
      cards: cards.map((card) => ({
        name: card.nameEn || card.name || "Tarot Card",
        isReversed: card.isReversed,
      })),
      interpretation,
      url,
    })
    await navigator.clipboard.writeText(text)
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: question,
      metadata: {
        platform,
        surface: "public_share_page",
      },
    })
    setStatus(copy.copied)
  }

  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
        <button
          onClick={() => handleCopy("xhs")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#dcb360]/45 hover:bg-white/[0.05] hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          {copy.xhs}
        </button>
        <button
          onClick={() => handleCopy("instagram")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#dcb360]/45 hover:bg-white/[0.05] hover:text-white"
        >
          <Instagram className="h-3.5 w-3.5" />
          {copy.instagram}
        </button>
      </div>
      {status && <p className="text-xs text-white/45">{status}</p>}
    </div>
  )
}
