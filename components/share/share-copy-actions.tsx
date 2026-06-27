"use client"

import { useState } from "react"
import { Copy, Instagram, Link2, Mail, Share2 } from "lucide-react"
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
      emailSelf: "发到我的邮箱",
      emailSubject: "我的 POPTarot 解读",
      emailIntro: "把这份解读留给之后的自己：",
      emailCardsLabel: "抽到的牌",
      emailInsightLabel: "解读摘录",
      emailOpenLabel: "打开完整解读",
      emailDailyLabel: "明天继续每日塔罗",
      linkCopied: "链接已复制",
      shared: "分享面板已打开",
      copied: "文案已复制",
      emailOpened: "邮件草稿已打开",
      failed: "分享失败，请再试一次",
    },
    en: {
      sharePage: "Share this page",
      copyLink: "Copy page link",
      xhs: "Copy Xiaohongshu",
      instagram: "Copy Instagram",
      emailSelf: "Email to myself",
      emailSubject: "My POPTarot reading",
      emailIntro: "Save this reading for your future self:",
      emailCardsLabel: "Cards",
      emailInsightLabel: "Insight excerpt",
      emailOpenLabel: "Open full reading",
      emailDailyLabel: "Continue with Daily Tarot tomorrow",
      linkCopied: "Link copied",
      shared: "Share sheet opened",
      copied: "Caption copied",
      emailOpened: "Email draft opened",
      failed: "Sharing failed. Please try again.",
    },
    ja: {
      sharePage: "このページを共有",
      copyLink: "ページリンクをコピー",
      xhs: "小紅書テキストをコピー",
      instagram: "Instagramをコピー",
      emailSelf: "自分にメール",
      emailSubject: "POPTarot リーディング",
      emailIntro: "未来の自分のためにこのリーディングを保存：",
      emailCardsLabel: "カード",
      emailInsightLabel: "解釈の抜粋",
      emailOpenLabel: "全文を開く",
      emailDailyLabel: "明日も Daily Tarot を続ける",
      linkCopied: "リンクをコピーしました",
      shared: "共有シートを開きました",
      copied: "テキストをコピーしました",
      emailOpened: "メール下書きを開きました",
      failed: "共有に失敗しました。もう一度お試しください",
    },
    ko: {
      sharePage: "이 페이지 공유",
      copyLink: "페이지 링크 복사",
      xhs: "샤오홍슈 문구 복사",
      instagram: "Instagram 복사",
      emailSelf: "내게 이메일 보내기",
      emailSubject: "나의 POPTarot 리딩",
      emailIntro: "나중의 나를 위해 이 리딩을 저장하세요:",
      emailCardsLabel: "카드",
      emailInsightLabel: "해석 요약",
      emailOpenLabel: "전체 리딩 열기",
      emailDailyLabel: "내일 Daily Tarot 이어가기",
      linkCopied: "링크가 복사되었습니다",
      shared: "공유 창을 열었습니다",
      copied: "문구를 복사했습니다",
      emailOpened: "이메일 초안이 열렸습니다",
      failed: "공유에 실패했습니다. 다시 시도해 주세요",
    },
    es: {
      sharePage: "Compartir esta pagina",
      copyLink: "Copiar enlace",
      xhs: "Copiar Xiaohongshu",
      instagram: "Copiar Instagram",
      emailSelf: "Enviar a mi email",
      emailSubject: "Mi lectura de POPTarot",
      emailIntro: "Guarda esta lectura para tu yo futuro:",
      emailCardsLabel: "Cartas",
      emailInsightLabel: "Extracto de la lectura",
      emailOpenLabel: "Abrir lectura completa",
      emailDailyLabel: "Continuar con Daily Tarot manana",
      linkCopied: "Enlace copiado",
      shared: "Panel de compartir abierto",
      copied: "Texto copiado",
      emailOpened: "Borrador de email abierto",
      failed: "No se pudo compartir. Intentalo otra vez.",
    },
    "pt-br": {
      sharePage: "Compartilhar esta pagina",
      copyLink: "Copiar link",
      xhs: "Copiar Xiaohongshu",
      instagram: "Copiar Instagram",
      emailSelf: "Enviar para meu email",
      emailSubject: "Minha leitura POPTarot",
      emailIntro: "Guarde esta leitura para seu eu futuro:",
      emailCardsLabel: "Cartas",
      emailInsightLabel: "Trecho da leitura",
      emailOpenLabel: "Abrir leitura completa",
      emailDailyLabel: "Continuar com Daily Tarot amanha",
      linkCopied: "Link copiado",
      shared: "Painel de compartilhamento aberto",
      copied: "Texto copiado",
      emailOpened: "Rascunho de email aberto",
      failed: "Nao foi possivel compartilhar. Tente novamente.",
    },
  } as const

  const copy = copyByLanguage[language as keyof typeof copyByLanguage] || copyByLanguage.en
  const shareSlug = url.split("/share/")[1]?.split(/[?#]/)[0]

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

  const buildSelfEmailBody = () => {
    const orientationCopy = {
      zh: { upright: "正", reversed: "逆" },
      en: { upright: "upright", reversed: "reversed" },
      ja: { upright: "正位置", reversed: "逆位置" },
      ko: { upright: "정방향", reversed: "역방향" },
      es: { upright: "upright", reversed: "reversed" },
      "pt-br": { upright: "upright", reversed: "reversed" },
    } as const
    const orientation = orientationCopy[language as keyof typeof orientationCopy] || orientationCopy.en
    const dailyUrl = `${window.location.origin}/daily-tarot?utm_source=public_share_email&utm_medium=email_self&utm_campaign=shared_reading`
    const cardSummary = cards
      .slice(0, 8)
      .map((card) => {
        const name = card.nameEn || card.name || "Tarot Card"
        const label = card.position ? `${card.position}: ${name}` : name
        return `${label} (${card.isReversed ? orientation.reversed : orientation.upright})`
      })
      .join(" / ")
    const excerpt = interpretation.replace(/\s+/g, " ").trim().slice(0, 900)

    return [
      copy.emailIntro,
      "",
      question,
      "",
      `${copy.emailCardsLabel}: ${cardSummary}`,
      "",
      `${copy.emailInsightLabel}:`,
      excerpt,
      "",
      `${copy.emailOpenLabel}: ${url}`,
      `${copy.emailDailyLabel}: ${dailyUrl}`,
    ].join("\n")
  }

  const handleSelfEmail = () => {
    const subject = encodeURIComponent(copy.emailSubject)
    const body = encodeURIComponent(buildSelfEmailBody())
    analyticsApi.track("reading_email_self_opened", {
      ...getCurrentAttribution(),
      locale: language,
      keyword: question,
      share_slug: shareSlug,
      metadata: {
        surface: "public_share_page",
        has_public_share_url: true,
      },
    })
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setStatus(copy.emailOpened)
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
      <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
          onClick={handleSelfEmail}
          data-public-share-email-self
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/25 bg-[#c9c0ff]/[0.06] px-3 py-2 text-xs text-[#eeeaff] transition hover:border-[#c9c0ff]/50 hover:bg-[#c9c0ff]/[0.1]"
        >
          <Mail className="h-3.5 w-3.5" />
          {copy.emailSelf}
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
