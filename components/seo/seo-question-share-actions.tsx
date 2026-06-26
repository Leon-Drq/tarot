"use client"

import Link from "next/link"
import { useState } from "react"
import { CalendarDays, Link2, Play, Share2 } from "lucide-react"
import { analyticsApi } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"

type Locale = "zh" | "en" | "ja" | "ko" | "es" | "pt-br"

type Props = {
  locale: Locale
  title: string
  description: string
  question: string
  url: string
  readingHref: string
  dailyHref: string
  campaign: string
}

const copyByLocale = {
  zh: {
    eyebrow: "保存这个问题",
    title: "分享给自己，明天回来复盘",
    body: "如果这个问题重要，不要只读完就离开。复制或分享这页，先免费抽牌，明天用每日塔罗看主题是否重复。",
    share: "分享问题",
    copy: "复制链接",
    daily: "明天回访",
    start: "免费抽牌",
    copied: "链接已复制",
    shared: "分享面板已打开",
    failed: "暂时无法分享，请复制链接",
  },
  en: {
    eyebrow: "Save this question",
    title: "Share it with yourself and return tomorrow",
    body: "If the question matters, do not let the search visit end here. Copy or share this page, start the free reading, then use Daily Tarot tomorrow to see whether the theme repeats.",
    share: "Share question",
    copy: "Copy link",
    daily: "Return tomorrow",
    start: "Start free reading",
    copied: "Link copied",
    shared: "Share sheet opened",
    failed: "Could not share. Copy the link instead.",
  },
  ja: {
    eyebrow: "質問を保存",
    title: "自分に共有して、明日また確認する",
    body: "大切な質問なら、このページで終わらせず、リンクを保存して無料リーディングを始め、明日の Daily Tarot で同じテーマが出るか見ましょう。",
    share: "質問を共有",
    copy: "リンクをコピー",
    daily: "明日戻る",
    start: "無料で始める",
    copied: "リンクをコピーしました",
    shared: "共有シートを開きました",
    failed: "共有できません。リンクをコピーしてください。",
  },
  ko: {
    eyebrow: "질문 저장",
    title: "나에게 공유하고 내일 다시 확인하기",
    body: "중요한 질문이라면 여기서 끝내지 마세요. 링크를 저장하고 무료 리딩을 시작한 뒤, 내일 Daily Tarot에서 같은 주제가 반복되는지 확인하세요.",
    share: "질문 공유",
    copy: "링크 복사",
    daily: "내일 돌아오기",
    start: "무료 리딩 시작",
    copied: "링크가 복사되었습니다",
    shared: "공유 창을 열었습니다",
    failed: "공유할 수 없습니다. 링크를 복사하세요.",
  },
  es: {
    eyebrow: "Guarda esta pregunta",
    title: "Compártela contigo y vuelve mañana",
    body: "Si la pregunta importa, no dejes que la visita termine aquí. Copia o comparte esta página, empieza la lectura gratis y usa Daily Tarot mañana para ver si el tema se repite.",
    share: "Compartir pregunta",
    copy: "Copiar enlace",
    daily: "Volver mañana",
    start: "Empezar gratis",
    copied: "Enlace copiado",
    shared: "Panel de compartir abierto",
    failed: "No se pudo compartir. Copia el enlace.",
  },
  "pt-br": {
    eyebrow: "Salve esta pergunta",
    title: "Compartilhe com voce e volte amanha",
    body: "Se a pergunta importa, nao deixe a visita acabar aqui. Copie ou compartilhe esta pagina, comece a leitura gratis e use o Daily Tarot amanha para ver se o tema se repete.",
    share: "Compartilhar pergunta",
    copy: "Copiar link",
    daily: "Voltar amanha",
    start: "Comecar gratis",
    copied: "Link copiado",
    shared: "Painel de compartilhamento aberto",
    failed: "Nao foi possivel compartilhar. Copie o link.",
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  body: string
  share: string
  copy: string
  daily: string
  start: string
  copied: string
  shared: string
  failed: string
}>

function trackQuestionShare(locale: Locale, campaign: string, question: string, action: string) {
  analyticsApi.track("share_template_copied", {
    ...getCurrentAttribution(),
    locale,
    keyword: question,
    metadata: {
      action,
      campaign,
      surface: "seo_question_page",
    },
  })
}

async function writeClipboardText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = value
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "fixed"
  textarea.style.left = "-9999px"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  textarea.remove()
}

export function SeoQuestionShareActions({
  locale,
  title,
  description,
  question,
  url,
  readingHref,
  dailyHref,
  campaign,
}: Props) {
  const [status, setStatus] = useState("")
  const copy = copyByLocale[locale] || copyByLocale.en

  const handleCopy = async () => {
    await writeClipboardText(url)
    trackQuestionShare(locale, campaign, question, "copy_question_url")
    setStatus(copy.copied)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        })
        trackQuestionShare(locale, campaign, question, "native_question_share")
        setStatus(copy.shared)
        return
      }

      await handleCopy()
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setStatus(copy.failed)
      }
    }
  }

  return (
    <section
      data-seo-question-share
      className="border-b border-white/10 bg-[#0d0618]"
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-6 rounded-lg border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{copy.eyebrow}</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{copy.body}</p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleShare}
              data-seo-question-share-native
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#c9c0ff]/28 bg-[#c9c0ff]/[0.06] px-4 py-3 text-sm text-[#eeeaff] transition hover:border-[#c9c0ff]/55 hover:bg-[#c9c0ff]/[0.1]"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>{copy.share}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              data-seo-question-share-copy
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 py-3 text-sm text-white/72 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              <span>{copy.copy}</span>
            </button>
            <Link
              href={dailyHref}
              data-seo-question-daily-return
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 py-3 text-sm text-white/72 transition hover:border-[#c9c0ff]/45 hover:bg-white/[0.05] hover:text-white"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span>{copy.daily}</span>
            </Link>
            <Link
              href={readingHref}
              data-seo-question-share-start
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 py-3 text-sm font-medium text-[#120c22] shadow-[0_14px_34px_rgba(146,132,239,0.2)] transition hover:brightness-110"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>{copy.start}</span>
            </Link>
            {status && (
              <p aria-live="polite" className="sm:col-span-2 text-center text-xs text-white/48">
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
