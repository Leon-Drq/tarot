import type { SeoLocale } from "@/lib/locales"

type ShareCard = {
  name: string
  position?: string
  isReversed?: boolean
}

export type ShareTemplatePlatform = "xhs" | "instagram"

function normalizeText(value: string, maxLength: number) {
  const normalized = value
    .replace(/[#>*_`~-]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized
}

function cardLine(cards: ShareCard[], locale: SeoLocale) {
  const reversed = {
    zh: "逆",
    en: "R",
    ja: "逆",
    ko: "역",
    es: "inv",
    "pt-br": "inv",
  }[locale]

  return cards
    .slice(0, 5)
    .map((card) => {
      const name = card.position ? `${card.position}: ${card.name}` : card.name
      return `${name}${card.isReversed ? ` (${reversed})` : ""}`
    })
    .join(" / ")
}

export function createShareTemplate(input: {
  platform: ShareTemplatePlatform
  locale: SeoLocale
  question: string
  cards: ShareCard[]
  interpretation: string
  url: string
}) {
  const question = normalizeText(input.question, 96)
  const excerpt = normalizeText(input.interpretation, input.platform === "xhs" ? 260 : 220)
  const cards = cardLine(input.cards, input.locale)

  if (input.platform === "xhs") {
    const templates = {
      zh: `今日塔罗：${question}\n\n抽到的牌：${cards}\n\nAI 解读摘录：${excerpt}\n\n完整结果：${input.url}\n\n#塔罗 #AI塔罗 #每日塔罗 #情感占卜 #POPTarot`,
      en: `Today's tarot: ${question}\n\nCards: ${cards}\n\nAI insight: ${excerpt}\n\nFull reading: ${input.url}\n\n#tarot #aitarot #dailyreading #poptarot`,
      ja: `今日のタロット：${question}\n\nカード：${cards}\n\nAIリーディング：${excerpt}\n\n全文：${input.url}\n\n#タロット #AIタロット #今日の占い #POPTarot`,
      ko: `오늘의 타로: ${question}\n\n카드: ${cards}\n\nAI 해석: ${excerpt}\n\n전체 리딩: ${input.url}\n\n#타로 #AI타로 #오늘의타로 #POPTarot`,
      es: `Tarot de hoy: ${question}\n\nCartas: ${cards}\n\nLectura IA: ${excerpt}\n\nLectura completa: ${input.url}\n\n#tarot #tarotia #tarotgratis #poptarot`,
      "pt-br": `Tarot de hoje: ${question}\n\nCartas: ${cards}\n\nLeitura IA: ${excerpt}\n\nLeitura completa: ${input.url}\n\n#tarot #tarotia #tarotgratis #poptarot`,
    }
    return templates[input.locale]
  }

  const templates = {
    zh: `POPTarot reading\n\n"${question}"\n\nCards: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #aitarot #poptarot`,
    en: `POPTarot reading\n\n"${question}"\n\nCards: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #aitarot #poptarot`,
    ja: `POPTarot reading\n\n「${question}」\n\nCards: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #aitarot #poptarot`,
    ko: `POPTarot reading\n\n"${question}"\n\nCards: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #aitarot #poptarot`,
    es: `Lectura POPTarot\n\n"${question}"\n\nCartas: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #tarotia #poptarot`,
    "pt-br": `Leitura POPTarot\n\n"${question}"\n\nCartas: ${cards}\n\n${excerpt}\n\n${input.url}\n\n#tarot #tarotia #poptarot`,
  }
  return templates[input.locale]
}
