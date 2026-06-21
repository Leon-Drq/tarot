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
  deepSections: Array<{
    heading: string
    body: string
  }>
  combinations: Array<{
    heading: string
    body: string
  }>
  faqs: Array<{
    question: string
    answer: string
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

function cardTone(card: TarotCard) {
  if (card.id <= 21) return "major life pattern"
  if (card.id >= 22 && card.id <= 35) return "creative and motivational signal"
  if (card.id >= 36 && card.id <= 49) return "emotional and relational signal"
  if (card.id >= 50 && card.id <= 63) return "practical and material signal"
  return "mental and communicative signal"
}

function createDeepSections(card: TarotCard, locale: Locale, theme: string) {
  const englishName = card.nameEn
  const name = getCardName(card, locale)
  const upright = cleanKeywords(card.meaning.upright)
  const reversed = cleanKeywords(card.meaning.reversed)

  if (locale === "en") {
    return [
      {
        heading: `${englishName} in Love`,
        body: `In love readings, ${englishName} asks you to look at the relationship pattern rather than chase a single yes-or-no answer. Upright, it can highlight ${upright}. Reversed, it may show where ${reversed} is blocking emotional clarity.`,
      },
      {
        heading: `${englishName} in Career`,
        body: `For work and career, ${englishName} points to ${theme}. It is useful when you are asking about timing, motivation, team dynamics, or whether the next professional step has enough support behind it.`,
      },
      {
        heading: `${englishName} for Money`,
        body: `In money questions, this card is less about prediction and more about behavior. It asks whether your current decisions are aligned with stability, appetite for risk, and the resources already available to you.`,
      },
      {
        heading: `${englishName} Yes or No`,
        body: `${englishName} is usually a nuanced answer. Upright, it leans toward movement if your question matches ${upright}. Reversed, it suggests waiting, clarifying motives, or fixing the pattern shown by ${reversed}.`,
      },
      {
        heading: `Advice from ${englishName}`,
        body: `The advice is to treat this card as a ${cardTone(card)}. Name the energy honestly, choose one action you can control today, and avoid forcing the reading to confirm what you already wanted to hear.`,
      },
    ]
  }

  return [
    {
      heading: locale === "zh" ? "爱情含义" : locale === "ja" ? "恋愛での意味" : "사랑에서의 의미",
      body:
        locale === "zh"
          ? `${name}在爱情中提醒你观察关系模式，而不是只追一个确定答案。正位看见${upright}，逆位则提示${reversed}。`
          : locale === "ja"
            ? `${name}は恋愛で、単純な答えより関係のパターンを見るよう促します。正位置は${upright}、逆位置は${reversed}を示します。`
            : `${name}는 사랑에서 단순한 답보다 관계 패턴을 보라고 말합니다. 정방향은 ${upright}, 역방향은 ${reversed}를 보여줍니다.`,
    },
    {
      heading: locale === "zh" ? "事业与金钱" : locale === "ja" ? "仕事とお金" : "커리어와 돈",
      body:
        locale === "zh"
          ? `在事业和金钱问题里，这张牌把注意力带向${theme}，适合用来判断下一步行动是否稳妥。`
          : locale === "ja"
            ? `仕事やお金の質問では、${theme}に意識を向け、次の一歩が現実的かを見ます。`
            : `커리어와 돈 질문에서는 ${theme}에 주목하며 다음 행동이 현실적인지 살펴봅니다.`,
    },
    {
      heading: locale === "zh" ? "是或否" : locale === "ja" ? "Yes / No" : "예 / 아니오",
      body:
        locale === "zh"
          ? `${name}通常不是绝对的是或否。正位偏向推进，逆位更适合等待、修正或先看清问题。`
          : locale === "ja"
            ? `${name}は単純な Yes/No よりも、進める条件と整えるべき点を示します。`
            : `${name}는 단순한 예/아니오보다 진행 조건과 먼저 정리할 점을 보여줍니다.`,
    },
  ]
}

function createCombinations(card: TarotCard, locale: Locale) {
  const name = getCardName(card, locale)
  const englishName = card.nameEn

  if (locale === "en") {
    return [
      {
        heading: `${englishName} with The Lovers`,
        body: `This combination often brings the card into relationship choices, attraction, values, or the need to make a decision with emotional honesty.`,
      },
      {
        heading: `${englishName} with The Tower`,
        body: `The Tower intensifies the message. It can show a pattern breaking open so the lesson of ${englishName} can no longer be ignored.`,
      },
      {
        heading: `${englishName} with Ace cards`,
        body: `Any Ace beside ${englishName} points to a new beginning. Look at the Ace suit to understand whether the fresh start is emotional, practical, mental, or creative.`,
      },
    ]
  }

  return [
    {
      heading: locale === "zh" ? `${name}与恋人牌` : locale === "ja" ? `${name}と恋人` : `${name}와 연인 카드`,
      body:
        locale === "zh"
          ? "这个组合通常把重点带到关系选择、价值观和诚实沟通上。"
          : locale === "ja"
            ? "この組み合わせは、関係の選択、価値観、正直な対話を強調します。"
            : "이 조합은 관계 선택, 가치관, 솔직한 소통을 강조합니다.",
    },
    {
      heading: locale === "zh" ? `${name}与高塔` : locale === "ja" ? `${name}と塔` : `${name}와 탑`,
      body:
        locale === "zh"
          ? "高塔会放大这张牌的信息，说明旧模式可能已经无法继续。"
          : locale === "ja"
            ? "塔はこのカードの意味を強め、古いパターンが続けられないことを示します。"
            : "탑은 이 카드의 메시지를 강하게 만들며 오래된 패턴이 지속되기 어렵다는 뜻입니다.",
    },
  ]
}

function createCardFaqs(card: TarotCard, locale: Locale) {
  const name = getCardName(card, locale)
  const englishName = card.nameEn

  if (locale === "en") {
    return [
      {
        question: `What does ${englishName} mean in tarot?`,
        answer: `${englishName} represents ${cleanKeywords(card.meaning.upright)} when upright, while the reversed meaning can point to ${cleanKeywords(card.meaning.reversed)}.`,
      },
      {
        question: `Is ${englishName} a yes or no card?`,
        answer: `${englishName} can answer yes or no only when you read the orientation, question, and nearby cards together. Upright usually supports movement; reversed asks for correction first.`,
      },
      {
        question: `What should I do when I draw ${englishName}?`,
        answer: `Use ${englishName} as a prompt for reflection and action. Notice the pattern it names, then choose one practical next step instead of treating the card as fixed fate.`,
      },
    ]
  }

  return [
    {
      question: locale === "zh" ? `${name}是什么意思？` : locale === "ja" ? `${name}の意味は？` : `${name}의 의미는?`,
      answer:
        locale === "zh"
          ? `${name}正位通常指向${cleanKeywords(card.meaning.upright)}，逆位则提示${cleanKeywords(card.meaning.reversed)}。`
          : locale === "ja"
            ? `${name}の正位置は${cleanKeywords(card.meaning.upright)}、逆位置は${cleanKeywords(card.meaning.reversed)}を示します。`
            : `${name} 정방향은 ${cleanKeywords(card.meaning.upright)}, 역방향은 ${cleanKeywords(card.meaning.reversed)}를 의미합니다.`,
    },
    {
      question: locale === "zh" ? `${name}是或否怎么解？` : locale === "ja" ? `${name}は Yes/No でどう読む？` : `${name}는 예/아니오에서 어떻게 읽나요?`,
      answer:
        locale === "zh"
          ? "需要结合问题、牌位和正逆位。正位多偏向推进，逆位则提醒先修正问题。"
          : locale === "ja"
            ? "質問、位置、正逆を合わせて読みます。正位置は前進、逆位置は調整を示します。"
            : "질문, 위치, 정/역방향을 함께 봅니다. 정방향은 진행, 역방향은 조정이 필요함을 뜻합니다.",
    },
  ]
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
    deepSections: createDeepSections(card, locale, theme),
    combinations: createCombinations(card, locale),
    faqs: createCardFaqs(card, locale),
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
