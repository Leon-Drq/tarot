"use client"

import { useState } from "react"
import { Copy, Instagram, Link2, Share2 } from "lucide-react"
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

  const copyByLanguage = {
    zh: {
      sharePage: "分享这个页面",
      copyLink: "复制页面链接",
      xhs: "复制小红书文案",
      instagram: "复制 Instagram 文案",
      linkCopied: "链接已复制",
      shared: "分享面板已打开",
      copied: "文案已复制",
      failed: "分享失败，请再试一次",
    },
    en: {
      sharePage: "Share this page",
      copyLink: "Copy page link",
      xhs: "Copy Xiaohongshu",
      instagram: "Copy Instagram",
      linkCopied: "Link copied",
      shared: "Share sheet opened",
      copied: "Caption copied",
      failed: "Sharing failed. Please try again.",
    },
    ja: {
      sharePage: "このページを共有",
      copyLink: "ページリンクをコピー",
      xhs: "小紅書テキストをコピー",
      instagram: "Instagramをコピー",
      linkCopied: "リンクをコピーしました",
      shared: "共有シートを開きました",
      copied: "テキストをコピーしました",
      failed: "共有に失敗しました。もう一度お試しください",
    },
    ko: {
      sharePage: "이 페이지 공유",
      copyLink: "페이지 링크 복사",
      xhs: "샤오홍슈 문구 복사",
      instagram: "Instagram 복사",
      linkCopied: "링크가 복사되었습니다",
      shared: "공유 창을 열었습니다",
      copied: "문구를 복사했습니다",
      failed: "공유에 실패했습니다. 다시 시도해 주세요",
    },
    es: {
      sharePage: "Compartir esta pagina",
      copyLink: "Copiar enlace",
      xhs: "Copiar Xiaohongshu",
      instagram: "Copiar Instagram",
      linkCopied: "Enlace copiado",
      shared: "Panel de compartir abierto",
      copied: "Texto copiado",
      failed: "No se pudo compartir. Intentalo otra vez.",
    },
    "pt-br": {
      sharePage: "Compartilhar esta pagina",
      copyLink: "Copiar link",
      xhs: "Copiar Xiaohongshu",
      instagram: "Copiar Instagram",
      linkCopied: "Link copiado",
      shared: "Painel de compartilhamento aberto",
      copied: "Texto copiado",
      failed: "Nao foi possivel compartilhar. Tente novamente.",
    },
  } as const

  const copy = copyByLanguage[language as keyof typeof copyByLanguage] || copyByLanguage.en

  const trackShareAction = (action: string) => {
    analyticsApi.track("share_template_copied", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: question,
      metadata: {
        action,
        surface: "public_share_page",
      },
    })
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    trackShareAction("copy_public_share_url")
    setStatus(copy.linkCopied)
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: question,
          text: interpretation,
          url,
        })
        trackShareAction("native_public_share")
        setStatus(copy.shared)
        return
      }

      await handleCopyLink()
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setStatus(copy.failed)
      }
    }
  }

  const handleCopy = async (platform: ShareTemplatePlatform) => {
    const text = createShareTemplate({
      platform,
      locale: language,
      question,
      cards: cards.map((card) => ({
        name: card.nameEn || card.name || "Tarot Card",
        position: card.position,
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
    <div data-public-share-copy-actions className="mt-5 flex flex-col items-center gap-3">
      <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
        <button
          onClick={handleNativeShare}
          data-public-share-native-share
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/25 bg-[#c9c0ff]/[0.06] px-3 py-2 text-xs text-[#eeeaff] transition hover:border-[#c9c0ff]/50 hover:bg-[#c9c0ff]/[0.1]"
        >
          <Share2 className="h-3.5 w-3.5" />
          {copy.sharePage}
        </button>
        <button
          onClick={handleCopyLink}
          data-public-share-copy-link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/25 bg-[#c9c0ff]/[0.06] px-3 py-2 text-xs text-[#eeeaff] transition hover:border-[#c9c0ff]/50 hover:bg-[#c9c0ff]/[0.1]"
        >
          <Link2 className="h-3.5 w-3.5" />
          {copy.copyLink}
        </button>
        <button
          onClick={() => handleCopy("xhs")}
          data-public-share-copy-template="xhs"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          {copy.xhs}
        </button>
        <button
          onClick={() => handleCopy("instagram")}
          data-public-share-copy-template="instagram"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/68 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
        >
          <Instagram className="h-3.5 w-3.5" />
          {copy.instagram}
        </button>
      </div>
      {status && <p className="text-xs text-white/45">{status}</p>}
    </div>
  )
}
