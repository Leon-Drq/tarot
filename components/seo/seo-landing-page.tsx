import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { getAllLocalizedSeoPages, type SeoPage } from "@/lib/seo-pages"
import { SPREAD_CONFIGS, type SpreadConfig } from "@/lib/spread-config"
import { getAllCardSeoPages, getCardKeywords, getCardSuit } from "@/lib/tarot-card-seo"
import { TAROT_CARDS } from "@/lib/tarot-cards"
import {
  appUrl,
  editorialTeamJsonLd,
  highIntentQuestionLinks,
  organizationJsonLd,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import { trustLastReviewed } from "@/lib/trust-signals"

const relatedCopy = {
  zh: { title: "相关塔罗入口", body: "继续从一个具体问题开始，直接进入更匹配的牌阵。" },
  en: { title: "Related Tarot Tools", body: "Keep the next step specific and enter a spread matched to your question." },
  ja: { title: "関連タロット", body: "次の質問を具体的にし、合うスプレッドへ進みましょう。" },
  ko: { title: "관련 타로 도구", body: "다음 질문을 구체적으로 정하고 맞는 스프레드로 이동하세요." },
  es: { title: "Herramientas relacionadas", body: "Continúa con una pregunta concreta y entra en una tirada más adecuada." },
  "pt-br": { title: "Ferramentas relacionadas", body: "Continue com uma pergunta concreta e entre em uma tiragem mais adequada." },
}

const cardIndexCopy = {
  zh: {
    title: "78 张塔罗牌",
    body: "按大阿卡纳和四个花色浏览所有牌义，每张牌都包含正位、逆位、爱情、事业、财运、是或否、建议、组合和 FAQ。",
    browseLabel: "按类别浏览",
    upright: "正位",
    reversed: "逆位",
    groups: {
      major: "大阿卡纳",
      wands: "权杖",
      cups: "圣杯",
      pentacles: "星币",
      swords: "宝剑",
    },
  },
  en: {
    title: "78 Tarot Cards",
    body: "Browse every card by Major Arcana and suit. Each card page covers upright, reversed, love, career, money, yes-or-no, advice, combinations, and FAQ.",
    browseLabel: "Browse by group",
    upright: "Upright",
    reversed: "Reversed",
    groups: {
      major: "Major Arcana",
      wands: "Wands",
      cups: "Cups",
      pentacles: "Pentacles",
      swords: "Swords",
    },
  },
  ja: {
    title: "78 枚のタロットカード",
    body: "大アルカナとスート別にカードを探せます。各カードには正位置、逆位置、恋愛、仕事、金運、Yes/No、助言、組み合わせ、FAQ があります。",
    browseLabel: "カテゴリ別に見る",
    upright: "正位置",
    reversed: "逆位置",
    groups: {
      major: "大アルカナ",
      wands: "ワンド",
      cups: "カップ",
      pentacles: "ペンタクル",
      swords: "ソード",
    },
  },
  ko: {
    title: "78장 타로 카드",
    body: "메이저 아르카나와 수트별로 모든 카드를 탐색하세요. 각 카드에는 정방향, 역방향, 사랑, 커리어, 돈, 예/아니오, 조언, 조합, FAQ가 있습니다.",
    browseLabel: "그룹별 보기",
    upright: "정방향",
    reversed: "역방향",
    groups: {
      major: "메이저 아르카나",
      wands: "완드",
      cups: "컵",
      pentacles: "펜타클",
      swords: "소드",
    },
  },
  es: {
    title: "78 cartas del tarot",
    body: "Explora todas las cartas por Arcanos Mayores y palo. Cada página cubre significado normal, invertido, amor, carrera, dinero, sí o no, consejo, combinaciones y FAQ.",
    browseLabel: "Explorar por grupo",
    upright: "Normal",
    reversed: "Invertida",
    groups: {
      major: "Arcanos Mayores",
      wands: "Bastos",
      cups: "Copas",
      pentacles: "Pentáculos",
      swords: "Espadas",
    },
  },
  "pt-br": {
    title: "78 cartas de tarot",
    body: "Explore todas as cartas por Arcanos Maiores e naipes. Cada página cobre carta em pé, invertida, amor, carreira, dinheiro, sim ou não, conselho, combinações e FAQ.",
    browseLabel: "Explorar por grupo",
    upright: "Em pé",
    reversed: "Invertida",
    groups: {
      major: "Arcanos Maiores",
      wands: "Paus",
      cups: "Copas",
      pentacles: "Pentáculos",
      swords: "Espadas",
    },
  },
} satisfies Record<SeoPage["locale"], {
  title: string
  body: string
  browseLabel: string
  upright: string
  reversed: string
  groups: Record<"major" | "wands" | "cups" | "pentacles" | "swords", string>
}>

const cardIndexGroupOrder = ["major", "wands", "cups", "pentacles", "swords"] as const

function relatedPages(page: SeoPage) {
  const priority = [
    "free-ai-tarot-reading",
    "daily-tarot",
    "love-tarot-reading",
    "will-my-ex-come-back-tarot",
    "does-he-love-me-tarot",
    "is-he-thinking-about-me-tarot",
    "should-i-text-him-tarot",
    "yes-or-no-tarot-love",
    "when-will-i-find-love-tarot",
    "career-tarot-reading",
    "should-i-quit-my-job-tarot",
    "monthly-tarot-report",
    "tarot-card-meanings",
  ]
  const candidates = getAllLocalizedSeoPages().filter((candidate) => candidate.locale === page.locale && candidate.slug !== page.slug)

  return candidates
    .sort((a, b) => {
      const aIndex = priority.indexOf(a.slug)
      const bIndex = priority.indexOf(b.slug)
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    })
    .slice(0, 6)
}

function readingHref(page: SeoPage) {
  const params = new URLSearchParams({
    q: page.ctaQuestion,
    auto: "1",
    lang: page.locale,
    utm_source: "seo",
    utm_medium: "landing",
    utm_campaign: page.slug,
  })

  if (page.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

type QuestionToolkit = {
  label: string
  title: string
  body: string
  promptTitle: string
  prompts: string[]
  spreadTitle?: string
  spreadBody?: string
  positionNames?: string[]
  frameTitle: string
  frames: Array<{
    title: string
    body: string
  }>
}

type ToolkitUiCopy = {
  recommendedSpread: string
  card: string
  drawPrompt: string
  startSpread: string
}

const defaultToolkitUiCopy: ToolkitUiCopy = {
  recommendedSpread: "Recommended spread",
  card: "Card",
  drawPrompt: "Draw this question",
  startSpread: "Start this spread free",
}

const toolkitUiCopy: Partial<Record<SeoPage["locale"], ToolkitUiCopy>> = {
  en: defaultToolkitUiCopy,
  es: {
    recommendedSpread: "Tirada recomendada",
    card: "Carta",
    drawPrompt: "Tirar esta pregunta",
    startSpread: "Empezar gratis",
  },
  "pt-br": {
    recommendedSpread: "Tiragem recomendada",
    card: "Carta",
    drawPrompt: "Tirar esta pergunta",
    startSpread: "Comecar gratis",
  },
}

const stickyCtaCopy = {
  zh: {
    eyebrow: "免费问题牌阵",
    primary: "开始抽牌",
    secondary: "每日塔罗",
  },
  en: {
    eyebrow: "Free question spread",
    primary: "Start free",
    secondary: "Daily",
  },
  ja: {
    eyebrow: "無料の質問スプレッド",
    primary: "無料で始める",
    secondary: "毎日",
  },
  ko: {
    eyebrow: "무료 질문 스프레드",
    primary: "무료 시작",
    secondary: "데일리",
  },
  es: {
    eyebrow: "Tirada gratis",
    primary: "Empezar",
    secondary: "Diario",
  },
  "pt-br": {
    eyebrow: "Tiragem gratis",
    primary: "Comecar",
    secondary: "Diario",
  },
} satisfies Record<SeoPage["locale"], { eyebrow: string; primary: string; secondary: string }>

const highIntentQuestionSlugs = new Set(highIntentQuestionLinks.map((link) => link.href.replace(/^\//, "")))

const fallbackQuestionToolkitCopy = {
  zh: {
    label: "推荐牌阵",
    title: (pageTitle: string) => `用匹配牌阵解读${pageTitle}`,
    body: (spreadName: string) => `这不是普通文章入口。点击后会把你的问题直接带入${spreadName}，减少重新输入和选错牌阵的步骤。`,
    promptTitle: "直接试这几个问法",
    promptTwo: "我现在最需要先看清什么？",
    promptThree: "下一步最稳妥的行动是什么？",
    spreadBody: (spreadName: string) => `${spreadName}会把问题拆成具体牌位，让答案更接近真实处境。`,
    frameTitle: "如何使用这个答案",
    frames: [
      { title: "先看主题", body: "第一层不是预测结果，而是看这件事现在最核心的能量和阻碍。" },
      { title: "再看行动", body: "把建议牌翻译成一个现实动作：等待、沟通、准备、离开或继续观察。" },
      { title: "最后看边界", body: "如果答案让你焦虑，先问什么能保护你的清晰，而不是反复追问同一件事。" },
    ],
  },
  en: {
    label: "Matched spread",
    title: (pageTitle: string) => `Start ${pageTitle} with the right spread`,
    body: (spreadName: string) => `This page is built to convert the question into a ${spreadName} reading, so you do not have to retype the prompt or choose a layout from scratch.`,
    promptTitle: "Try these ready-to-draw questions",
    promptTwo: "What should I understand before I act?",
    promptThree: "What is the healthiest next step I can control?",
    spreadBody: (spreadName: string) => `${spreadName} breaks the question into card positions, making the first free answer easier to use than a generic reading.`,
    frameTitle: "How to use the answer",
    frames: [
      { title: "Read the signal", body: "Start with the main energy and obstacle instead of treating the spread as a fixed prediction." },
      { title: "Translate advice", body: "Turn the advice card into one concrete action: wait, message, prepare, set a boundary, or move forward." },
      { title: "Protect clarity", body: "If the answer makes you anxious, ask what protects your judgment instead of repeating the same question." },
    ],
  },
  ja: {
    label: "おすすめスプレッド",
    title: (pageTitle: string) => `${pageTitle}を合うスプレッドで読む`,
    body: (spreadName: string) => `このページは、質問をそのまま${spreadName}へつなげる入口です。質問を入れ直したり、スプレッドを選び直す必要を減らします。`,
    promptTitle: "すぐ試せる質問",
    promptTwo: "行動する前に何を理解すべき？",
    promptThree: "自分が動かせる次の一歩は？",
    spreadBody: (spreadName: string) => `${spreadName}は質問をカード位置に分け、一般的なリーディングより具体的に読みやすくします。`,
    frameTitle: "答えの使い方",
    frames: [
      { title: "サインを見る", body: "結果を急がず、今の主なエネルギーと障害を確認します。" },
      { title: "助言を行動へ", body: "待つ、伝える、準備する、境界線を引く、進むなど、一つの行動にします。" },
      { title: "冷静さを守る", body: "不安が強い時は同じ質問を繰り返さず、判断を守る方法を確認します。" },
    ],
  },
  ko: {
    label: "추천 스프레드",
    title: (pageTitle: string) => `${pageTitle}를 맞는 스프레드로 시작하기`,
    body: (spreadName: string) => `이 페이지는 질문을 바로 ${spreadName} 리딩으로 연결해, 다시 입력하거나 배열을 고르는 과정을 줄입니다.`,
    promptTitle: "바로 뽑아볼 질문",
    promptTwo: "행동하기 전에 무엇을 이해해야 할까요?",
    promptThree: "내가 조절할 수 있는 가장 건강한 다음 단계는?",
    spreadBody: (spreadName: string) => `${spreadName}는 질문을 카드 위치로 나눠 일반 리딩보다 첫 답을 더 구체적으로 사용할 수 있게 합니다.`,
    frameTitle: "답을 사용하는 법",
    frames: [
      { title: "신호 읽기", body: "고정된 예언보다 현재의 핵심 에너지와 장애물을 먼저 봅니다." },
      { title: "조언을 행동으로", body: "기다리기, 메시지 보내기, 준비하기, 경계 세우기, 앞으로 가기 중 하나로 옮깁니다." },
      { title: "명료함 지키기", body: "불안하다면 같은 질문을 반복하기보다 판단을 지키는 방법을 물어보세요." },
    ],
  },
  es: {
    label: "Tirada adecuada",
    title: (pageTitle: string) => `Empieza ${pageTitle} con la tirada correcta`,
    body: (spreadName: string) => `Esta pagina convierte la pregunta en una lectura de ${spreadName}, sin volver a escribir ni elegir una tirada desde cero.`,
    promptTitle: "Preguntas listas para tirar",
    promptTwo: "Que debo entender antes de actuar?",
    promptThree: "Cual es el siguiente paso mas sano que puedo controlar?",
    spreadBody: (spreadName: string) => `${spreadName} divide la pregunta en posiciones de cartas para que la primera lectura gratis sea mas util que una lectura generica.`,
    frameTitle: "Como usar la respuesta",
    frames: [
      { title: "Lee la senal", body: "Empieza por la energia principal y el bloqueo, no por tratar la tirada como una prediccion fija." },
      { title: "Traduce el consejo", body: "Convierte la carta de consejo en una accion: esperar, escribir, preparar, poner limite o avanzar." },
      { title: "Protege claridad", body: "Si la respuesta aumenta la ansiedad, pregunta que protege tu juicio en vez de repetir lo mismo." },
    ],
  },
  "pt-br": {
    label: "Tiragem adequada",
    title: (pageTitle: string) => `Comece ${pageTitle} com a tiragem certa`,
    body: (spreadName: string) => `Esta pagina transforma a pergunta em uma leitura de ${spreadName}, sem redigitar nem escolher uma tiragem do zero.`,
    promptTitle: "Perguntas prontas para tirar",
    promptTwo: "O que devo entender antes de agir?",
    promptThree: "Qual e o proximo passo mais saudavel que posso controlar?",
    spreadBody: (spreadName: string) => `${spreadName} divide a pergunta em posicoes de cartas para que a primeira leitura gratis seja mais util que uma leitura generica.`,
    frameTitle: "Como usar a resposta",
    frames: [
      { title: "Leia o sinal", body: "Comece pela energia principal e pelo bloqueio, nao por tratar a tiragem como predicao fixa." },
      { title: "Traduza o conselho", body: "Transforme a carta de conselho em uma acao: esperar, escrever, preparar, colocar limite ou avancar." },
      { title: "Proteja clareza", body: "Se a resposta aumentar ansiedade, pergunte o que protege seu julgamento em vez de repetir a mesma pergunta." },
    ],
  },
} satisfies Record<SeoPage["locale"], {
  label: string
  title: (pageTitle: string) => string
  body: (spreadName: string) => string
  promptTitle: string
  promptTwo: string
  promptThree: string
  spreadBody: (spreadName: string) => string
  frameTitle: string
  frames: Array<{ title: string; body: string }>
}>

function spreadNameForLocale(spread: SpreadConfig, locale: SeoPage["locale"]) {
  return locale === "zh" ? spread.name : spread.nameEn
}

function createFallbackQuestionToolkit(page: SeoPage, recommendedSpread: SpreadConfig | undefined): QuestionToolkit | undefined {
  if (!recommendedSpread || !highIntentQuestionSlugs.has(page.slug)) return undefined

  const copy = fallbackQuestionToolkitCopy[page.locale]
  const spreadName = spreadNameForLocale(recommendedSpread, page.locale)

  return {
    label: copy.label,
    title: copy.title(page.h1),
    body: copy.body(spreadName),
    promptTitle: copy.promptTitle,
    prompts: [page.ctaQuestion, copy.promptTwo, copy.promptThree],
    spreadTitle: spreadName,
    spreadBody: copy.spreadBody(spreadName),
    positionNames: recommendedSpread.positions.map((position) => (page.locale === "zh" ? position.name : position.nameEn)),
    frameTitle: copy.frameTitle,
    frames: copy.frames,
  }
}

const questionToolkits: Record<string, QuestionToolkit> = {
  "will-my-ex-come-back-tarot": {
    label: "Reconciliation spread",
    title: "Read the return question with more than hope",
    body: "A useful ex reading should separate remaining attachment from changed behavior. The spread below keeps the first answer grounded in cause, readiness, advice, and likely direction.",
    promptTitle: "Try a sharper ex question",
    prompts: [
      "Will my ex come back, and what has actually changed?",
      "Is reaching out to my ex healthy right now?",
      "What would help me move on with self-respect?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Return energy",
        body: "Look for cards that show accountability, communication, and mutual willingness, not only nostalgia or longing.",
      },
      {
        title: "Pause energy",
        body: "Heavy delay, avoidance, or repeated conflict cards usually ask you to protect peace before chasing contact.",
      },
      {
        title: "Your next step",
        body: "The advice card should become one real action: wait, set a boundary, send one clear message, or stop checking.",
      },
    ],
  },
  "does-he-love-me-tarot": {
    label: "Feelings spread",
    title: "Separate attraction, emotion, and consistent action",
    body: "This question works best when the reading compares what he may feel with how he behaves. Real love has to show up in safety, respect, and communication.",
    promptTitle: "Try a sharper feelings question",
    prompts: [
      "Does he love me, or is this only attraction?",
      "What are his true feelings and fears about me?",
      "What would make this connection emotionally safe for me?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Mutual feeling",
        body: "Cups, Lovers, Sun, or steady Pentacles can support affection when the surrounding cards show action too.",
      },
      {
        title: "Mixed signal",
        body: "Moon, Seven of Cups, or reversed court cards often point to uncertainty, projection, or inconsistent expression.",
      },
      {
        title: "Your clarity",
        body: "Read the advice card as a boundary check. The answer is not only what he feels, but what you need next.",
      },
    ],
  },
  "is-he-thinking-about-me-tarot": {
    label: "Thoughts and attitude spread",
    title: "Read silence without turning it into certainty",
    body: "This question is useful when no contact or mixed signals make you wonder what is happening internally. The spread compares thoughts with concerns and likely action.",
    promptTitle: "Try a sharper thoughts question",
    prompts: [
      "Is he thinking about me, and what is blocking action?",
      "Does he miss me or just remember the past?",
      "What would help me feel clear without waiting for him?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Mental attention",
        body: "High Priestess, Moon, Six of Cups, or Pages can show private thought, but look for action cards before assuming contact.",
      },
      {
        title: "Avoidance",
        body: "Four of Swords, Seven of Swords, or reversed court cards can show withdrawal, pride, fear, or inconsistent expression.",
      },
      {
        title: "Your dignity",
        body: "The advice card should help you stop reading silence as your only source of clarity.",
      },
    ],
  },
  "yes-or-no-tarot-love": {
    label: "Yes or no spread",
    title: "Get a quick answer without losing the reason",
    body: "A love yes-or-no reading should explain why the energy leans yes, no, or not yet. The reason matters more than forcing a one-word answer.",
    promptTitle: "Try a cleaner yes-or-no question",
    prompts: [
      "Is this connection worth pursuing right now?",
      "Should I text them today?",
      "Is reconciliation likely in the near future?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Yes",
        body: "Treat yes as permission for a thoughtful step, not a guarantee that the other person will do all the work.",
      },
      {
        title: "No",
        body: "A no can be protective. Read whether the block is timing, intention, readiness, or a pattern you already know.",
      },
      {
        title: "Not yet",
        body: "Not yet usually points to missing information, emotional readiness, or a condition that needs to change first.",
      },
    ],
  },
  "should-i-text-him-tarot": {
    label: "Contact decision spread",
    title: "Check the timing before you press send",
    body: "This yes-or-no reading keeps the focus on timing, intention, and emotional safety so a message becomes a clear choice instead of an anxious reflex.",
    promptTitle: "Try a cleaner texting question",
    prompts: [
      "Should I text him today, or should I wait?",
      "What intention is behind my urge to message him?",
      "What kind of message would protect my peace?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Text now",
        body: "Clear Wands, Magician, or balanced Cups can support a direct message when the advice card also shows grounded intention.",
      },
      {
        title: "Wait",
        body: "Temperance, Hanged Man, Four of Swords, or Moon energy often asks for timing, calm, or more information first.",
      },
      {
        title: "One message",
        body: "If you do text, let the reading shape one brief message, not a chain of reassurance-seeking follow-ups.",
      },
    ],
  },
  "career-tarot-reading": {
    label: "Career spread",
    title: "Turn career uncertainty into one practical move",
    body: "Career tarot is strongest when it names momentum, resistance, timing, and the next action. Use the spread as a reflection tool, then test it against real options.",
    promptTitle: "Try a sharper career question",
    prompts: [
      "What should I focus on in my career this month?",
      "Is this job opportunity aligned with my growth?",
      "What practical action would move my career forward now?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Momentum",
        body: "Magician, World, Wands, and Pentacles can show opportunity when they are paired with realistic resources.",
      },
      {
        title: "Risk",
        body: "Tower, Devil, Five of Pentacles, or Seven of Swords ask you to examine pressure, contracts, money, or trust.",
      },
      {
        title: "Action",
        body: "Translate the advice card into a concrete step: apply, prepare, negotiate, rest, wait, or change direction.",
      },
    ],
  },
  "when-will-i-find-love-tarot": {
    label: "Love timing spread",
    title: "Read timing as readiness, not a countdown",
    body: "This love timing reading looks at openness, dating energy, likely meeting conditions, and the pattern that needs to shift before healthier love can land.",
    promptTitle: "Try a sharper love timing question",
    prompts: [
      "When will I find love, and what should I open to?",
      "What blocks me from meeting healthier love?",
      "What kind of relationship is trying to enter my life next?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Readiness",
        body: "Empress, Star, Ace of Cups, and Two of Cups can support openness when the advice card shows real movement too.",
      },
      {
        title: "Timing",
        body: "Wheel, Temperance, and seasonal cards are better read as timing themes than exact dates.",
      },
      {
        title: "New pattern",
        body: "The strongest answer names what changes in your choices, spaces, or standards before love becomes easier to meet.",
      },
    ],
  },
  "should-i-quit-my-job-tarot": {
    label: "Job decision spread",
    title: "Read quitting as a decision, not a dramatic impulse",
    body: "This page is for the moment when staying feels heavy but leaving has real consequences. The spread should separate burnout, completed cycles, risk, and preparation.",
    promptTitle: "Try a safer job-decision question",
    prompts: [
      "Should I quit my job or prepare first?",
      "Is this burnout temporary or a sign to leave?",
      "What do I need before making my next career move?",
    ],
    frameTitle: "How to read the answer",
    frames: [
      {
        title: "Leave signal",
        body: "Death, Tower, Eight of Cups, World, or Ten of Wands can support transition when the advice card also shows readiness.",
      },
      {
        title: "Prepare signal",
        body: "Four of Pentacles, Two of Wands, or Temperance usually ask for savings, timing, boundaries, or a bridge plan.",
      },
      {
        title: "Reality check",
        body: "Before acting, pair the reading with money, contracts, health, references, and concrete alternatives.",
      },
    ],
  },
  "monthly-tarot-report": {
    label: "Monthly pattern spread",
    title: "Turn one free check-in into a useful monthly pattern",
    body: "A monthly tarot report should start simple, then become deeper only when saved readings, repeated cards, journal notes, and follow-up themes give it real context.",
    promptTitle: "Try a monthly check-in question",
    prompts: [
      "What theme should guide my next month?",
      "What pattern from this month should I carry forward?",
      "What should I release before the next month begins?",
    ],
    spreadTitle: "Monthly check-in spread",
    spreadBody: "A three-card spread for the month's core theme, what to release, and the next practical focus.",
    positionNames: ["Theme", "Release", "Focus"],
    frameTitle: "How to use the report",
    frames: [
      {
        title: "Free check-in",
        body: "Use the first reading to name the month's theme before deciding whether deeper history is needed.",
      },
      {
        title: "Saved pattern",
        body: "Membership becomes useful when repeated cards, old questions, and journal notes can be compared across time.",
      },
      {
        title: "Next month action",
        body: "The report should end with one practical commitment, not a dramatic prediction.",
      },
    ],
  },
}

const localizedQuestionToolkits: Partial<Record<SeoPage["locale"], Record<string, QuestionToolkit>>> = {
  en: questionToolkits,
  es: {
    "will-my-ex-come-back-tarot": {
      label: "Tirada de reconciliacion",
      title: "Lee la pregunta de tu ex sin depender solo de la esperanza",
      body: "Una buena lectura sobre un ex separa la nostalgia de los cambios reales. Esta tirada mira causa, disposicion, consejo y direccion probable antes de convertir la respuesta en accion.",
      promptTitle: "Prueba una pregunta mas clara sobre tu ex",
      prompts: [
        "Mi ex volvera, y que ha cambiado de verdad?",
        "Es sano contactar a mi ex ahora mismo?",
        "Que me ayudaria a seguir adelante con respeto propio?",
      ],
      spreadTitle: "Recuperacion tras una ruptura",
      spreadBody: "Una tirada de cinco cartas para entender el motivo de la ruptura, el estado de ambos, el consejo practico y la direccion probable.",
      positionNames: ["Motivo", "Tu estado", "Su estado", "Consejo", "Futuro"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Energia de regreso", body: "Busca responsabilidad, comunicacion y voluntad mutua, no solo cartas de nostalgia o deseo." },
        { title: "Energia de pausa", body: "Cartas de retraso, evitacion o conflicto repetido suelen pedir calma antes de perseguir contacto." },
        { title: "Tu proximo paso", body: "Convierte el consejo en una accion real: esperar, poner un limite, enviar un mensaje claro o dejar de revisar." },
      ],
    },
    "does-he-love-me-tarot": {
      label: "Tirada de sentimientos",
      title: "Separa atraccion, emocion y acciones consistentes",
      body: "Esta pregunta funciona mejor cuando la lectura compara lo que puede sentir con lo que hace. El amor real tambien se nota en seguridad, respeto y comunicacion.",
      promptTitle: "Prueba una pregunta mas precisa sobre sentimientos",
      prompts: [
        "Me ama, o esto es solo atraccion?",
        "Cuales son sus verdaderos sentimientos y miedos hacia mi?",
        "Que haria esta conexion emocionalmente segura para mi?",
      ],
      spreadTitle: "Sus pensamientos y actitud",
      spreadBody: "Una tirada de cinco cartas para leer impresion, pensamientos, actitud, preocupaciones y posible accion.",
      positionNames: ["Impresion", "Pensamientos", "Actitud", "Preocupaciones", "Accion posible"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Sentimiento mutuo", body: "Copas, Los Enamorados, El Sol o Pentaculos estables apoyan afecto cuando tambien hay accion." },
        { title: "Senal mixta", body: "La Luna, Siete de Copas o cortes invertidas pueden mostrar incertidumbre, proyeccion o expresion irregular." },
        { title: "Tu claridad", body: "Lee la carta de consejo como un limite. No importa solo lo que el siente, sino lo que tu necesitas despues." },
      ],
    },
    "is-he-thinking-about-me-tarot": {
      label: "Tirada de pensamientos",
      title: "Lee el silencio sin convertirlo en certeza",
      body: "Esta pregunta sirve cuando el contacto cero o las senales mixtas te hacen imaginar lo que pasa por dentro. La tirada compara pensamientos, dudas y posible accion.",
      promptTitle: "Prueba una pregunta mas precisa",
      prompts: [
        "Esta pensando en mi y que bloquea la accion?",
        "Me extrana o solo recuerda el pasado?",
        "Que me ayudaria a estar clara sin esperarlo?",
      ],
      spreadTitle: "Pensamientos y actitud",
      spreadBody: "Una tirada de cinco cartas para ver impresion, pensamientos, actitud, preocupaciones y accion posible.",
      positionNames: ["Impresion", "Pensamientos", "Actitud", "Preocupaciones", "Accion posible"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Atencion mental", body: "Sacerdotisa, Luna, Seis de Copas o Pajes pueden mostrar pensamiento privado, pero busca accion antes de asumir contacto." },
        { title: "Evasion", body: "Cuatro de Espadas, Siete de Espadas o cortes invertidas pueden indicar retirada, orgullo, miedo o expresion irregular." },
        { title: "Tu dignidad", body: "La carta de consejo debe ayudarte a dejar de leer el silencio como tu unica fuente de claridad." },
      ],
    },
    "should-i-text-him-tarot": {
      label: "Tirada de contacto",
      title: "Revisa el timing antes de enviar",
      body: "Esta lectura si/no mantiene el foco en timing, intencion y seguridad emocional para que el mensaje sea una eleccion clara.",
      promptTitle: "Prueba una pregunta de mensaje mas limpia",
      prompts: [
        "Deberia escribirle hoy o esperar?",
        "Que intencion hay detras de mis ganas de escribirle?",
        "Que tipo de mensaje protegeria mi paz?",
      ],
      spreadTitle: "Si o no",
      spreadBody: "Una carta directa para una decision clara, con explicacion de la energia detras de la respuesta.",
      positionNames: ["Respuesta"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Escribir ahora", body: "Bastos claros, El Mago o Copas equilibradas pueden apoyar un mensaje directo si el consejo tambien es sereno." },
        { title: "Esperar", body: "Templanza, El Colgado, Cuatro de Espadas o Luna suelen pedir calma, timing o mas informacion." },
        { title: "Un mensaje", body: "Si escribes, deja que la lectura forme un mensaje breve, no una cadena de busqueda de seguridad." },
      ],
    },
    "when-will-i-find-love-tarot": {
      label: "Tirada de timing amoroso",
      title: "Lee el timing como disponibilidad, no como cuenta regresiva",
      body: "Esta lectura mira apertura, energia de citas, condiciones de encuentro y el patron que debe cambiar para que llegue un amor mas sano.",
      promptTitle: "Prueba una pregunta de amor mas clara",
      prompts: [
        "Cuando encontrare el amor y a que debo abrirme?",
        "Que me bloquea de encontrar un amor mas sano?",
        "Que tipo de relacion quiere entrar en mi vida?",
      ],
      spreadTitle: "Conexion amorosa",
      spreadBody: "Una tirada para energia de citas, rasgos de pareja, timing y consejo.",
      positionNames: ["Energia", "Rasgos", "Timing", "Consejo"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Disponibilidad", body: "Emperatriz, Estrella, As de Copas y Dos de Copas apoyan apertura cuando el consejo tambien muestra movimiento." },
        { title: "Timing", body: "Rueda, Templanza y cartas estacionales se leen mejor como temas de tiempo que como fechas exactas." },
        { title: "Nuevo patron", body: "La respuesta mas fuerte nombra que cambia en tus elecciones, espacios o estandares antes de encontrar amor." },
      ],
    },
    "yes-or-no-tarot-love": {
      label: "Tirada si o no",
      title: "Recibe una respuesta rapida sin perder el motivo",
      body: "Un si o no de amor debe explicar por que la energia se inclina a si, no o todavia no. La razon importa mas que una palabra forzada.",
      promptTitle: "Prueba una pregunta si/no mas limpia",
      prompts: [
        "Vale la pena seguir esta conexion ahora?",
        "Deberia escribirle hoy?",
        "Es probable una reconciliacion en el futuro cercano?",
      ],
      spreadTitle: "Si o no",
      spreadBody: "Una carta directa para una decision clara, con explicacion de la energia detras de la respuesta.",
      positionNames: ["Respuesta"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Si", body: "Toma el si como permiso para un paso cuidadoso, no como garantia de que la otra persona hara todo." },
        { title: "No", body: "Un no puede protegerte. Mira si el bloqueo es tiempo, intencion, disposicion o un patron conocido." },
        { title: "Todavia no", body: "Todavia no suele indicar informacion faltante, madurez emocional o una condicion que debe cambiar." },
      ],
    },
    "career-tarot-reading": {
      label: "Tirada profesional",
      title: "Convierte la incertidumbre laboral en una accion practica",
      body: "El tarot profesional sirve mas cuando nombra impulso, resistencia, tiempo y siguiente paso. Usa la lectura como reflexion y comparala con opciones reales.",
      promptTitle: "Prueba una pregunta profesional mas concreta",
      prompts: [
        "En que deberia enfocarme en mi carrera este mes?",
        "Esta oportunidad laboral esta alineada con mi crecimiento?",
        "Que accion practica moveria mi carrera hacia adelante ahora?",
      ],
      spreadTitle: "Oportunidad laboral",
      spreadBody: "Una tirada para oportunidades, fortalezas, cautelas y la siguiente apertura profesional.",
      positionNames: ["Oportunidad", "Fortaleza", "Cuidado", "Proxima apertura"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Impulso", body: "El Mago, El Mundo, Bastos y Pentaculos pueden mostrar oportunidad cuando tambien existen recursos reales." },
        { title: "Riesgo", body: "La Torre, El Diablo, Cinco de Pentaculos o Siete de Espadas piden revisar presion, contratos, dinero o confianza." },
        { title: "Accion", body: "Traduce el consejo en un paso concreto: postular, preparar, negociar, descansar, esperar o cambiar direccion." },
      ],
    },
    "should-i-quit-my-job-tarot": {
      label: "Tirada de decision laboral",
      title: "Lee renunciar como decision, no como impulso dramatico",
      body: "Esta pagina es para cuando quedarse pesa, pero irse tiene consecuencias reales. La tirada separa agotamiento, ciclo completado, riesgo y preparacion.",
      promptTitle: "Prueba una pregunta laboral mas segura",
      prompts: [
        "Deberia renunciar a mi trabajo o prepararme primero?",
        "Este agotamiento es temporal o una senal para irme?",
        "Que necesito antes de hacer mi proximo movimiento profesional?",
      ],
      spreadTitle: "Oportunidad laboral",
      spreadBody: "Una tirada para revisar presion actual, riesgos, recursos disponibles, tiempo y el siguiente paso mas estable.",
      positionNames: ["Situacion", "Riesgo", "Recurso", "Tiempo"],
      frameTitle: "Como leer la respuesta",
      frames: [
        { title: "Senal de salida", body: "Muerte, Torre, Ocho de Copas, Mundo o Diez de Bastos apoyan transicion solo si el consejo muestra preparacion." },
        { title: "Senal de preparacion", body: "Cuatro de Pentaculos, Dos de Bastos o Templanza suelen pedir ahorro, tiempo, limites o un plan puente." },
        { title: "Chequeo real", body: "Antes de actuar, combina la lectura con dinero, contratos, salud, referencias y alternativas concretas." },
      ],
    },
    "monthly-tarot-report": {
      label: "Tirada de patron mensual",
      title: "Convierte un chequeo gratis en un patron mensual util",
      body: "Un informe mensual debe empezar simple y volverse mas profundo solo cuando el historial, las cartas repetidas, las notas y los seguimientos dan contexto real.",
      promptTitle: "Prueba una pregunta mensual",
      prompts: [
        "Que tema debe guiar mi proximo mes?",
        "Que patron de este mes deberia llevar conmigo?",
        "Que debo soltar antes de que empiece el proximo mes?",
      ],
      spreadTitle: "Tirada de chequeo mensual",
      spreadBody: "Una tirada de tres cartas para el tema central del mes, lo que conviene soltar y el enfoque practico siguiente.",
      positionNames: ["Tema", "Soltar", "Enfoque"],
      frameTitle: "Como usar el informe",
      frames: [
        { title: "Chequeo gratis", body: "Usa la primera lectura para nombrar el tema del mes antes de decidir si necesitas historial mas profundo." },
        { title: "Patron guardado", body: "La membresia tiene sentido cuando cartas repetidas, preguntas antiguas y notas pueden compararse con el tiempo." },
        { title: "Accion del proximo mes", body: "El informe debe terminar con un compromiso practico, no con una prediccion dramatica." },
      ],
    },
  },
  "pt-br": {
    "will-my-ex-come-back-tarot": {
      label: "Tiragem de reconciliacao",
      title: "Leia a pergunta sobre o ex sem depender so de esperanca",
      body: "Uma boa leitura sobre ex separa nostalgia de mudanca real. Esta tiragem olha causa, disponibilidade, conselho e direcao provavel antes de virar acao.",
      promptTitle: "Teste uma pergunta mais clara sobre seu ex",
      prompts: [
        "Meu ex vai voltar, e o que mudou de verdade?",
        "E saudavel procurar meu ex agora?",
        "O que me ajudaria a seguir em frente com respeito proprio?",
      ],
      spreadTitle: "Recuperacao apos termino",
      spreadBody: "Uma tiragem de cinco cartas para entender motivo do termino, estado dos dois lados, conselho pratico e direcao provavel.",
      positionNames: ["Motivo", "Seu estado", "Estado da outra pessoa", "Conselho", "Futuro"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Energia de retorno", body: "Procure responsabilidade, comunicacao e vontade mutua, nao apenas nostalgia ou saudade." },
        { title: "Energia de pausa", body: "Cartas de atraso, evitacao ou conflito repetido geralmente pedem paz antes de buscar contato." },
        { title: "Seu proximo passo", body: "Transforme o conselho em uma acao real: esperar, colocar limite, enviar uma mensagem clara ou parar de verificar." },
      ],
    },
    "does-he-love-me-tarot": {
      label: "Tiragem de sentimentos",
      title: "Separe atracao, emocao e atitudes consistentes",
      body: "Essa pergunta funciona melhor quando a leitura compara o que ele pode sentir com o que ele faz. Amor real tambem aparece em seguranca, respeito e comunicacao.",
      promptTitle: "Teste uma pergunta mais precisa sobre sentimentos",
      prompts: [
        "Ele me ama, ou isso e so atracao?",
        "Quais sao os verdadeiros sentimentos e medos dele sobre mim?",
        "O que tornaria essa conexao emocionalmente segura para mim?",
      ],
      spreadTitle: "Pensamentos e atitude dele",
      spreadBody: "Uma tiragem de cinco cartas para ler impressao, pensamentos, atitude, preocupacoes e possivel acao.",
      positionNames: ["Impressao", "Pensamentos", "Atitude", "Preocupacoes", "Possivel acao"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Sentimento mutuo", body: "Copas, Os Enamorados, O Sol ou Pentaculos estaveis podem apoiar afeto quando tambem ha acao." },
        { title: "Sinal misto", body: "A Lua, Sete de Copas ou cartas da corte invertidas podem indicar incerteza, projecao ou expressao inconsistente." },
        { title: "Sua clareza", body: "Leia a carta de conselho como um limite. A resposta nao e so o que ele sente, mas o que voce precisa depois." },
      ],
    },
    "is-he-thinking-about-me-tarot": {
      label: "Tiragem de pensamentos",
      title: "Leia o silencio sem transformar em certeza",
      body: "Esta pergunta ajuda quando contato zero ou sinais mistos fazem voce imaginar o que acontece por dentro. A tiragem compara pensamentos, duvidas e possivel acao.",
      promptTitle: "Teste uma pergunta mais precisa",
      prompts: [
        "Ele esta pensando em mim e o que bloqueia a acao?",
        "Ele sente minha falta ou so lembra do passado?",
        "O que me ajudaria a ter clareza sem esperar por ele?",
      ],
      spreadTitle: "Pensamentos e atitude",
      spreadBody: "Uma tiragem de cinco cartas para ver impressao, pensamentos, atitude, preocupacoes e acao possivel.",
      positionNames: ["Impressao", "Pensamentos", "Atitude", "Preocupacoes", "Acao possivel"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Atencao mental", body: "Sacerdotisa, Lua, Seis de Copas ou Pajens podem mostrar pensamento privado, mas procure acao antes de assumir contato." },
        { title: "Evasao", body: "Quatro de Espadas, Sete de Espadas ou cortes invertidas podem indicar retirada, orgulho, medo ou expressao irregular." },
        { title: "Sua dignidade", body: "A carta de conselho deve ajudar voce a parar de ler o silencio como unica fonte de clareza." },
      ],
    },
    "should-i-text-him-tarot": {
      label: "Tiragem de contato",
      title: "Revise o timing antes de enviar",
      body: "Esta leitura sim/nao mantem o foco em timing, intencao e seguranca emocional para que a mensagem seja uma escolha clara.",
      promptTitle: "Teste uma pergunta de mensagem mais limpa",
      prompts: [
        "Devo mandar mensagem hoje ou esperar?",
        "Que intencao existe por tras da minha vontade de escrever?",
        "Que tipo de mensagem protegeria minha paz?",
      ],
      spreadTitle: "Sim ou nao",
      spreadBody: "Uma carta direta para uma decisao clara, com explicacao da energia por tras da resposta.",
      positionNames: ["Resposta"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Mandar agora", body: "Paus claros, O Mago ou Copas equilibradas podem apoiar uma mensagem direta se o conselho tambem for centrado." },
        { title: "Esperar", body: "Temperanca, O Enforcado, Quatro de Espadas ou Lua geralmente pedem calma, timing ou mais informacao." },
        { title: "Uma mensagem", body: "Se escrever, deixe a leitura formar uma mensagem breve, nao uma sequencia em busca de seguranca." },
      ],
    },
    "when-will-i-find-love-tarot": {
      label: "Tiragem de timing amoroso",
      title: "Leia timing como disponibilidade, nao contagem regressiva",
      body: "Esta leitura olha abertura, energia de encontros, condicoes de encontro e o padrao que precisa mudar para um amor mais saudavel chegar.",
      promptTitle: "Teste uma pergunta de amor mais clara",
      prompts: [
        "Quando vou encontrar amor e ao que devo me abrir?",
        "O que me bloqueia de encontrar um amor mais saudavel?",
        "Que tipo de relacionamento quer entrar na minha vida?",
      ],
      spreadTitle: "Conexao amorosa",
      spreadBody: "Uma tiragem para energia de encontros, tracos de parceria, timing e conselho.",
      positionNames: ["Energia", "Tracos", "Timing", "Conselho"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Disponibilidade", body: "Imperatriz, Estrela, As de Copas e Dois de Copas apoiam abertura quando o conselho tambem mostra movimento." },
        { title: "Timing", body: "Roda, Temperanca e cartas sazonais funcionam melhor como temas de tempo do que datas exatas." },
        { title: "Novo padrao", body: "A resposta mais forte nomeia o que muda em escolhas, espacos ou padroes antes de encontrar amor." },
      ],
    },
    "yes-or-no-tarot-love": {
      label: "Tiragem sim ou nao",
      title: "Receba uma resposta rapida sem perder o motivo",
      body: "Um sim ou nao no amor deve explicar por que a energia inclina para sim, nao ou ainda nao. O motivo importa mais do que uma palavra forcada.",
      promptTitle: "Teste uma pergunta sim/nao mais limpa",
      prompts: [
        "Vale a pena investir nessa conexao agora?",
        "Devo mandar mensagem hoje?",
        "Uma reconciliacao e provavel em breve?",
      ],
      spreadTitle: "Sim ou nao",
      spreadBody: "Uma carta direta para uma decisao clara, com explicacao da energia por tras da resposta.",
      positionNames: ["Resposta"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Sim", body: "Trate o sim como permissao para um passo cuidadoso, nao como garantia de que a outra pessoa fara tudo." },
        { title: "Nao", body: "Um nao pode proteger voce. Veja se o bloqueio e tempo, intencao, preparo ou um padrao conhecido." },
        { title: "Ainda nao", body: "Ainda nao costuma apontar informacao faltando, maturidade emocional ou uma condicao que precisa mudar." },
      ],
    },
    "career-tarot-reading": {
      label: "Tiragem de carreira",
      title: "Transforme incerteza profissional em um movimento pratico",
      body: "Tarot de carreira funciona melhor quando nomeia impulso, resistencia, tempo e proxima acao. Use a leitura como reflexao e compare com opcoes reais.",
      promptTitle: "Teste uma pergunta de carreira mais concreta",
      prompts: [
        "No que devo focar na minha carreira este mes?",
        "Essa oportunidade de trabalho esta alinhada com meu crescimento?",
        "Que acao pratica faria minha carreira avancar agora?",
      ],
      spreadTitle: "Oportunidade de trabalho",
      spreadBody: "Uma tiragem para oportunidades, pontos fortes, cuidados e a proxima abertura profissional.",
      positionNames: ["Oportunidade", "Forca", "Cuidado", "Proxima abertura"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Impulso", body: "O Mago, O Mundo, Paus e Pentaculos podem mostrar oportunidade quando existem recursos realistas." },
        { title: "Risco", body: "A Torre, O Diabo, Cinco de Pentaculos ou Sete de Espadas pedem revisar pressao, contratos, dinheiro ou confianca." },
        { title: "Acao", body: "Traduza o conselho em um passo concreto: aplicar, preparar, negociar, descansar, esperar ou mudar direcao." },
      ],
    },
    "should-i-quit-my-job-tarot": {
      label: "Tiragem de decisao profissional",
      title: "Leia a demissao como decisao, nao como impulso dramatico",
      body: "Esta pagina e para quando ficar pesa, mas sair tem consequencias reais. A tiragem separa esgotamento, ciclo completo, risco e preparacao.",
      promptTitle: "Teste uma pergunta profissional mais segura",
      prompts: [
        "Devo pedir demissao ou me preparar primeiro?",
        "Esse esgotamento e temporario ou um sinal para sair?",
        "O que preciso antes do meu proximo movimento profissional?",
      ],
      spreadTitle: "Oportunidade de trabalho",
      spreadBody: "Uma tiragem para revisar pressao atual, riscos, recursos disponiveis, tempo e o proximo passo mais estavel.",
      positionNames: ["Situacao", "Risco", "Recurso", "Tempo"],
      frameTitle: "Como ler a resposta",
      frames: [
        { title: "Sinal de saida", body: "Morte, Torre, Oito de Copas, Mundo ou Dez de Paus apoiam transicao apenas quando o conselho tambem mostra preparo." },
        { title: "Sinal de preparo", body: "Quatro de Pentaculos, Dois de Paus ou Temperanca geralmente pedem economia, tempo, limites ou um plano ponte." },
        { title: "Cheque real", body: "Antes de agir, combine a leitura com dinheiro, contratos, saude, referencias e alternativas concretas." },
      ],
    },
    "monthly-tarot-report": {
      label: "Tiragem de padrao mensal",
      title: "Transforme um check-in gratis em um padrao mensal util",
      body: "Um relatorio mensal deve comecar simples e ficar mais profundo apenas quando historico, cartas repetidas, notas e acompanhamentos dao contexto real.",
      promptTitle: "Teste uma pergunta mensal",
      prompts: [
        "Que tema deve guiar meu proximo mes?",
        "Que padrao deste mes devo levar comigo?",
        "O que devo soltar antes do proximo mes comecar?",
      ],
      spreadTitle: "Tiragem de check-in mensal",
      spreadBody: "Uma tiragem de tres cartas para o tema central do mes, o que soltar e o proximo foco pratico.",
      positionNames: ["Tema", "Soltar", "Foco"],
      frameTitle: "Como usar o relatorio",
      frames: [
        { title: "Check-in gratis", body: "Use a primeira leitura para nomear o tema do mes antes de decidir se precisa de historico mais profundo." },
        { title: "Padrao salvo", body: "A assinatura faz sentido quando cartas repetidas, perguntas antigas e notas podem ser comparadas ao longo do tempo." },
        { title: "Acao do proximo mes", body: "O relatorio deve terminar com um compromisso pratico, nao com uma predicao dramatica." },
      ],
    },
  },
}

function promptHref(page: SeoPage, prompt: string) {
  const params = new URLSearchParams({
    q: prompt,
    auto: "1",
    lang: page.locale,
    utm_source: "seo",
    utm_medium: "question_prompt",
    utm_campaign: page.slug,
  })

  if (page.recommendedSpread) {
    params.set("spread", page.recommendedSpread)
  }

  return `/input?${params.toString()}`
}

export function SeoLandingPageView({ page }: { page: SeoPage }) {
  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)
  const cardPages = page.slug === "tarot-card-meanings" ? getAllCardSeoPages(page.locale) : []
  const primaryHref = readingHref(page)
  const related = relatedPages(page)
  const relatedText = relatedCopy[page.locale]
  const cardText = cardIndexCopy[page.locale]
  const toolkitCopy = toolkitUiCopy[page.locale] || defaultToolkitUiCopy
  const stickyCopy = stickyCtaCopy[page.locale]
  const recommendedSpread = page.recommendedSpread ? SPREAD_CONFIGS[page.recommendedSpread] : undefined
  const toolkit = localizedQuestionToolkits[page.locale]?.[page.slug] || createFallbackQuestionToolkit(page, recommendedSpread)
  const cardGroups = cardIndexGroupOrder.map((group) => ({
    key: group,
    title: cardText.groups[group],
    cards: cardPages.filter((cardPage) => getCardSuit(cardPage.card) === group),
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      softwareApplicationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${appUrl}${page.path}#webpage`,
        url: `${appUrl}${page.path}`,
        name: page.title,
        description: page.description,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        potentialAction: {
          "@type": "ReadAction",
          name: "Start free AI tarot reading",
          target: `${appUrl}${primaryHref}`,
        },
      },
      {
        "@type": "Article",
        "@id": `${appUrl}${page.path}#article`,
        headline: page.title,
        description: page.description,
        url: `${appUrl}${page.path}`,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        mainEntityOfPage: {
          "@id": `${appUrl}${page.path}#webpage`,
        },
        author: {
          "@id": `${appUrl}/#editorial-team`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}${page.path}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "POPTarot",
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.h1,
            item: `${appUrl}${page.path}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}${page.path}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      ...(cardPages.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#card-index`,
              name: cardText.title,
              description: cardText.body,
              numberOfItems: cardPages.length,
              itemListElement: cardPages.map((cardPage, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${appUrl}${cardPage.path}`,
                name: cardPage.h1,
              })),
            },
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#card-groups`,
              name: `${cardText.title} groups`,
              numberOfItems: cardGroups.length,
              itemListElement: cardGroups.map((group, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "ItemList",
                  "@id": `${appUrl}${page.path}#card-index-${group.key}`,
                  name: group.title,
                  numberOfItems: group.cards.length,
                  url: `${appUrl}${page.path}#card-index-${group.key}`,
                  itemListElement: group.cards.map((cardPage, cardIndex) => ({
                    "@type": "ListItem",
                    position: cardIndex + 1,
                    url: `${appUrl}${cardPage.path}`,
                    name: cardPage.h1,
                  })),
                },
              })),
            },
          ]
        : []),
      ...(recommendedSpread
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#recommended-spread`,
              name: recommendedSpread.nameEn,
              description: recommendedSpread.descriptionEn || recommendedSpread.description,
              numberOfItems: recommendedSpread.positions.length,
              itemListElement: recommendedSpread.positions.map((position, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: position.nameEn,
                description: position.description,
              })),
            },
          ]
        : []),
      ...(toolkit
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#ready-question-prompts`,
              name: toolkit.promptTitle,
              numberOfItems: toolkit.prompts.length,
              itemListElement: toolkit.prompts.map((prompt, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: prompt,
                url: `${appUrl}${promptHref(page, prompt)}`,
              })),
            },
          ]
        : []),
      ...(toolkit && recommendedSpread
        ? [
            {
              "@type": "HowTo",
              "@id": `${appUrl}${page.path}#how-to-use-answer`,
              name: toolkit.frameTitle,
              description: toolkit.body,
              totalTime: "PT3M",
              step: toolkit.frames.map((frame, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: frame.title,
                text: frame.body,
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <main className={`min-h-screen bg-[#080310] text-white ${toolkit ? "pb-[calc(env(safe-area-inset-bottom)+5.75rem)] sm:pb-0" : ""}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {toolkit && (
        <div
          data-question-sticky-cta
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#090411]/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:hidden"
        >
          <div className="mx-auto flex max-w-md items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">
                {stickyCopy.eyebrow}
              </p>
              <p className="mt-1 truncate text-xs text-white/52">{toolkit.label}</p>
            </div>
            <Link
              href="/daily-tarot"
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-white/12 px-3 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
            >
              {stickyCopy.secondary}
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 text-xs font-medium text-[#120c22] shadow-[0_12px_30px_rgba(146,132,239,0.24)] transition hover:brightness-110"
            >
              {stickyCopy.primary}
            </Link>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.42),transparent_36%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
          <nav className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 lg:left-10 lg:right-10">
            <Link href="/" className="font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex min-h-10 items-center rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#e8e3ff] transition hover:border-[#e8e3ff] hover:bg-white/[0.06]"
            >
              {page.primaryCta}
            </Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="max-w-full break-words font-serif text-[2.1rem] font-semibold leading-tight tracking-normal text-white [overflow-wrap:anywhere] sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{page.intro}</p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/56">{page.intent}</p>
              <EditorialByline locale={page.locale} className="mt-7 max-w-xl" />

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
                >
                  {page.primaryCta}
                </Link>
                <Link
                  href="/daily-tarot"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  {page.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="flex min-h-[320px] items-center justify-center gap-4 sm:min-h-[360px] sm:gap-6">
              {cards.map((card, index) =>
                card ? (
                  <div
                    key={card.id}
                    className="relative aspect-[7/12] w-[28%] max-w-[160px] overflow-hidden rounded-lg border border-[#bfb6ff]/35 bg-[#211330] shadow-2xl shadow-black/40"
                    style={{
                      transform: `translateY(${index === 1 ? "-28px" : "18px"}) rotate(${index === 0 ? "-9deg" : index === 2 ? "9deg" : "0deg"})`,
                    }}
                  >
                    <Image src={card.image} alt={card.nameEn} fill className="object-cover" sizes="180px" />
                    <div className="absolute inset-2 rounded border border-[#e8e3ff]/20" />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0618]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          {page.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <div className="mb-4 h-px w-10 bg-[#bfb6ff]/45" />
              <h2 className="font-serif text-xl text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      {toolkit && recommendedSpread && (
        <section className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{toolkit.label}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{toolkit.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{toolkit.body}</p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.045] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{toolkitCopy.recommendedSpread}</p>
                <h3 className="mt-3 font-serif text-2xl text-white">{toolkit.spreadTitle || recommendedSpread.nameEn}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{toolkit.spreadBody || recommendedSpread.descriptionEn}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {recommendedSpread.positions.map((position, index) => (
                    <div key={position.nameEn} className="rounded-lg border border-white/10 bg-black/[0.18] p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/38">{toolkitCopy.card} {index + 1}</p>
                      <p className="mt-1 text-sm font-medium text-white">{toolkit.positionNames?.[index] || position.nameEn}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={primaryHref}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 py-2 text-sm font-medium text-[#120c22] shadow-[0_14px_34px_rgba(143,128,238,0.2)] transition hover:brightness-110"
                >
                  {toolkitCopy.startSpread}
                </Link>
              </article>

              <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{toolkit.promptTitle}</p>
                <div className="mt-5 grid gap-3">
                  {toolkit.prompts.map((prompt) => (
                    <Link
                      key={prompt}
                      href={promptHref(page, prompt)}
                      className="group rounded-lg border border-white/10 bg-black/[0.16] px-4 py-3 text-sm leading-6 text-white/68 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055] hover:text-white"
                    >
                      <span className="block">{prompt}</span>
                      <span className="mt-1 block text-xs text-[#c9c0ff]/62 group-hover:text-[#e8e3ff]">{toolkitCopy.drawPrompt}</span>
                    </Link>
                  ))}
                </div>
              </article>
            </div>

            <div className="mt-8">
              <h3 className="font-serif text-2xl text-white">{toolkit.frameTitle}</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {toolkit.frames.map((frame) => (
                  <article key={frame.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h4 className="text-base font-medium text-white">{frame.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-white/60">{frame.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {cardPages.length > 0 && (
        <section className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <h2 className="font-serif text-2xl text-white sm:text-4xl">{cardText.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/60">{cardText.body}</p>
              </div>
              <Link href={primaryHref} className="text-sm text-[#c9c0ff] hover:text-white">
                {page.primaryCta}
              </Link>
            </div>
            <nav
              aria-label={cardText.browseLabel}
              className="mb-9 flex flex-wrap gap-2"
            >
              {cardGroups
                .filter((group) => group.cards.length > 0)
                .map((group) => (
                  <a
                    key={group.key}
                    href={`#card-index-${group.key}`}
                    className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-white/66 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055] hover:text-white"
                  >
                    <span>{group.title}</span>
                    <span className="rounded-full bg-[#bfb6ff]/10 px-2 py-0.5 text-xs text-[#c9c0ff]/80">
                      {group.cards.length}
                    </span>
                  </a>
                ))}
            </nav>
            <div className="space-y-10">
              {cardGroups.map((group) =>
                group.cards.length > 0 ? (
                  <section key={group.key} aria-labelledby={`card-index-${group.key}`}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px w-8 bg-[#bfb6ff]/45" />
                      <h3 id={`card-index-${group.key}`} className="font-serif text-xl text-white">
                        {group.title}
                      </h3>
                      <span className="text-xs text-white/36">{group.cards.length}</span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.cards.map((cardPage) => {
                        const keywords = getCardKeywords(cardPage.card, page.locale)

                        return (
                          <Link
                            key={cardPage.path}
                            href={cardPage.path}
                            className="group flex min-w-0 gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#bfb6ff]/55 hover:bg-white/[0.06]"
                          >
                            <div className="relative aspect-[7/12] w-14 shrink-0 overflow-hidden rounded-md border border-[#bfb6ff]/30 bg-[#211330] sm:w-16">
                              <Image src={cardPage.card.image} alt={cardPage.title} fill className="object-cover" sizes="80px" />
                            </div>
                            <div className="min-w-0 flex-1 py-1">
                              <h4 className="line-clamp-2 text-sm font-medium leading-6 text-white/82 group-hover:text-white">
                                {cardPage.h1}
                              </h4>
                              <p className="mt-2 line-clamp-1 text-xs leading-5 text-[#c9c0ff]/72">
                                {cardText.upright}: {keywords.upright}
                              </p>
                              <p className="line-clamp-1 text-xs leading-5 text-white/44">
                                {cardText.reversed}: {keywords.reversed}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                ) : null,
              )}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-b border-white/10 bg-[#0d0618]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-7 max-w-2xl">
              <h2 className="font-serif text-2xl text-white">{relatedText.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{relatedText.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.06]"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/80">{item.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-xl leading-7 text-white group-hover:text-[#f4f0ff]">{item.h1}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">{item.intent}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#080310]">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-10 bg-[#bfb6ff]/45" />
            <h2 className="font-serif text-2xl text-white">{page.questionsTitle}</h2>
          </div>
          <div className="space-y-4">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-base font-medium text-white">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-white/62">{faq.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={primaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-7 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
            >
              {page.bottomCta}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-8">
            {trustLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/56 transition hover:border-[#bfb6ff]/45 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
