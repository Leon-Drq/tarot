import { localePath, type Locale } from "@/lib/locales"
import { getCardName, TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"

export type TarotCardSeoPage = {
  card: TarotCard
  slug: string
  locale: Locale
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  uprightLabel: string
  reversedLabel: string
  tryQuestion: string
  ctaLabel: string
  backLabel: string
  sections: Array<{
    heading: string
    body: string
  }>
}

const suitThemes = {
  zh: {
    major: "人生主题、精神成长和关键转折",
    wands: "行动力、热情、创意和事业推进",
    cups: "情感、关系、直觉和内在满足",
    pentacles: "金钱、身体、工作和现实资源",
    swords: "思考、沟通、冲突和清晰判断",
  },
  en: {
    major: "life lessons, spiritual growth, and turning points",
    wands: "action, ambition, creativity, and momentum",
    cups: "emotion, relationships, intuition, and inner fulfillment",
    pentacles: "money, work, body, and material resources",
    swords: "thought, communication, conflict, and clear judgment",
  },
  ja: {
    major: "人生のテーマ、精神的成長、重要な転機",
    wands: "行動力、情熱、創造性、仕事の前進",
    cups: "感情、関係性、直感、内面の満足",
    pentacles: "お金、仕事、身体、現実的な資源",
    swords: "思考、コミュニケーション、葛藤、明晰な判断",
  },
  ko: {
    major: "삶의 주제, 영적 성장, 중요한 전환점",
    wands: "행동력, 열정, 창의성, 추진력",
    cups: "감정, 관계, 직관, 내면의 충족",
    pentacles: "돈, 일, 몸, 현실 자원",
    swords: "생각, 소통, 갈등, 명확한 판단",
  },
} satisfies Record<Locale, Record<CardSuit, string>>

type CardSuit = "major" | "wands" | "cups" | "pentacles" | "swords"

export function getCardSlug(card: TarotCard) {
  return card.nameEn
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getCardBySlug(slug: string) {
  return TAROT_CARDS.find((card) => getCardSlug(card) === slug)
}

export function getCardSuit(card: TarotCard): CardSuit {
  if (card.id <= 21) return "major"
  if (card.id >= 22 && card.id <= 35) return "wands"
  if (card.id >= 36 && card.id <= 49) return "cups"
  if (card.id >= 50 && card.id <= 63) return "pentacles"
  return "swords"
}

function cleanKeywords(value: string) {
  return value.replace(/、/g, " / ")
}

export function getTarotCardSeoPage(card: TarotCard, locale: Locale): TarotCardSeoPage {
  const name = getCardName(card, locale)
  const englishName = card.nameEn
  const slug = getCardSlug(card)
  const theme = suitThemes[locale][getCardSuit(card)]

  const copy = {
    zh: {
      title: `${name}牌义`,
      description: `了解${name}（${englishName}）正位、逆位和在爱情、事业、每日塔罗中的含义。`,
      eyebrow: "塔罗牌义",
      intro: `${name}会围绕${theme}展开。真正的解读要结合你的问题、牌位和正逆位。`,
      uprightLabel: "正位关键词",
      reversedLabel: "逆位关键词",
      tryQuestion: `${name}现在想提醒我什么？`,
      ctaLabel: "用这张牌开始解读",
      backLabel: "返回牌义大全",
      sections: [
        {
          heading: "这张牌通常代表什么",
          body: `${name}并不是固定答案，而是一组象征。它会把注意力带向${theme}，提醒你看见当前局面里的核心力量。`,
        },
        {
          heading: "如何在牌阵中解读",
          body: "如果它落在过去位置，通常指向已经形成的模式；落在现在位置，代表当前正在运作的能量；落在建议位置，则更像行动提醒。",
        },
      ],
    },
    en: {
      title: `${englishName} Tarot Meaning`,
      description: `Learn the upright and reversed meaning of ${englishName} in love, career, daily tarot, and AI tarot readings.`,
      eyebrow: "Tarot Card Meaning",
      intro: `${englishName} points toward ${theme}. A useful interpretation always depends on your question, the card position, and whether it appears upright or reversed.`,
      uprightLabel: "Upright Keywords",
      reversedLabel: "Reversed Keywords",
      tryQuestion: `What is ${englishName} trying to show me now?`,
      ctaLabel: "Start a Reading With This Card",
      backLabel: "Back to Card Meanings",
      sections: [
        {
          heading: "What this card usually represents",
          body: `${englishName} is not a fixed answer. It is a symbolic lens that brings attention to ${theme} in your current situation.`,
        },
        {
          heading: "How to read it in a spread",
          body: "In a past position, it can describe an existing pattern. In a present position, it shows current energy. In an advice position, it becomes a practical prompt.",
        },
      ],
    },
    ja: {
      title: `${name}の意味`,
      description: `${name}（${englishName}）の正位置・逆位置、恋愛や仕事での読み方を学びます。`,
      eyebrow: "タロットカードの意味",
      intro: `${name}は${theme}に関わるカードです。質問、位置、正逆によって読み方が変わります。`,
      uprightLabel: "正位置キーワード",
      reversedLabel: "逆位置キーワード",
      tryQuestion: `${name}はいま何を示していますか？`,
      ctaLabel: "このカードで占う",
      backLabel: "カード一覧へ戻る",
      sections: [
        {
          heading: "このカードが表すこと",
          body: `${name}は固定された答えではなく、現在の状況にある${theme}へ意識を向ける象徴です。`,
        },
        {
          heading: "スプレッドでの読み方",
          body: "過去の位置では既存のパターン、現在では今動いているエネルギー、助言では実践的なヒントとして読みます。",
        },
      ],
    },
    ko: {
      title: `${name} 의미`,
      description: `${name}(${englishName})의 정방향/역방향 의미와 사랑, 커리어, 데일리 타로 해석을 알아보세요.`,
      eyebrow: "타로 카드 의미",
      intro: `${name} 카드는 ${theme}와 관련됩니다. 질문, 위치, 정/역방향에 따라 해석이 달라집니다.`,
      uprightLabel: "정방향 키워드",
      reversedLabel: "역방향 키워드",
      tryQuestion: `${name} 카드가 지금 보여주는 것은 무엇인가요?`,
      ctaLabel: "이 카드로 리딩 시작",
      backLabel: "카드 의미로 돌아가기",
      sections: [
        {
          heading: "이 카드가 나타내는 것",
          body: `${name}는 고정된 답이 아니라 현재 상황 속 ${theme}에 주목하게 하는 상징입니다.`,
        },
        {
          heading: "스프레드에서 읽는 법",
          body: "과거 위치에서는 기존 패턴, 현재 위치에서는 작동 중인 에너지, 조언 위치에서는 실천 힌트로 읽습니다.",
        },
      ],
    },
  }[locale]

  return {
    card,
    slug,
    locale,
    path: localePath(locale, `/tarot-card-meanings/${slug}`),
    h1: copy.title,
    title: copy.title,
    description: copy.description,
    eyebrow: copy.eyebrow,
    intro: copy.intro,
    uprightLabel: copy.uprightLabel,
    reversedLabel: copy.reversedLabel,
    tryQuestion: copy.tryQuestion,
    ctaLabel: copy.ctaLabel,
    backLabel: copy.backLabel,
    sections: copy.sections,
  }
}

export function getCardKeywords(card: TarotCard) {
  return {
    upright: cleanKeywords(card.meaning.upright),
    reversed: cleanKeywords(card.meaning.reversed),
  }
}

export function getAllCardSeoPages(locale: Locale) {
  return TAROT_CARDS.map((card) => getTarotCardSeoPage(card, locale))
}
