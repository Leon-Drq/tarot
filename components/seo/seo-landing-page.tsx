import Image from "next/image"
import Link from "next/link"
import { SeoQuestionShareActions } from "@/components/seo/seo-question-share-actions"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { getAllLocalizedSeoPages, getSeoPage, type CardMeaningContext, type SeoPage } from "@/lib/seo-pages"
import { SPREAD_CONFIGS, type SpreadConfig, type SpreadType } from "@/lib/spread-config"
import { getAllCardSeoPages, getCardKeywords, getCardSuit } from "@/lib/tarot-card-seo"
import { getCardName, TAROT_CARDS } from "@/lib/tarot-cards"
import {
  appUrl,
  editorialTeamJsonLd,
  highIntentQuestionLinks,
  organizationJsonLd,
  softwareApplicationJsonLd,
  trustLinks,
  websiteJsonLd,
} from "@/lib/site"
import { representativeTestimonials, trustHighlights, trustLastReviewed } from "@/lib/trust-signals"

const relatedCopy = {
  zh: { title: "相关塔罗入口", body: "继续从一个具体问题开始，直接进入更匹配的牌阵。" },
  en: { title: "Related Tarot Tools", body: "Keep the next step specific and enter a spread matched to your question." },
  ja: { title: "関連タロット", body: "次の質問を具体的にし、合うスプレッドへ進みましょう。" },
  ko: { title: "관련 타로 도구", body: "다음 질문을 구체적으로 정하고 맞는 스프레드로 이동하세요." },
  es: { title: "Herramientas relacionadas", body: "Continúa con una pregunta concreta y entra en una tirada más adecuada." },
  "pt-br": { title: "Ferramentas relacionadas", body: "Continue com uma pergunta concreta e entre em uma tiragem mais adequada." },
}

const questionClusterCopy = {
  zh: {
    title: "同主题问题",
    body: "如果这个问题还不够精确，可以从相邻问题进入更匹配的免费牌阵。",
    action: "打开问题页",
    startAction: "直接免费抽牌",
  },
  en: {
    title: "Related Tarot Questions",
    body: "If this question is close but not exact, use a nearby long-tail question to open a more precise free spread.",
    action: "Open question",
    startAction: "Start free spread",
  },
  ja: {
    title: "関連する質問",
    body: "今の質問に近い入口から、より合う無料スプレッドへ進めます。",
    action: "質問を見る",
    startAction: "無料で始める",
  },
  ko: {
    title: "관련 질문",
    body: "지금 질문과 가까운 롱테일 질문에서 더 정확한 무료 스프레드로 이동하세요.",
    action: "질문 열기",
    startAction: "무료 스프레드 시작",
  },
  es: {
    title: "Preguntas relacionadas",
    body: "Si esta pregunta se acerca pero no es exacta, abre una pregunta cercana con una tirada gratis más precisa.",
    action: "Abrir pregunta",
    startAction: "Empezar tirada gratis",
  },
  "pt-br": {
    title: "Perguntas relacionadas",
    body: "Se esta pergunta chega perto mas nao e exata, abra uma pergunta proxima com uma tiragem gratis mais precisa.",
    action: "Abrir pergunta",
    startAction: "Comecar tiragem gratis",
  },
} satisfies Record<SeoPage["locale"], { title: string; body: string; action: string; startAction: string }>

const questionTrustCopy = {
  zh: {
    eyebrow: "信任边界",
    title: "先免费体验，再决定是否需要深度功能",
    body: "这些长尾问题页承接搜索流量，所以必须把免费范围、AI 边界和读者反馈说清楚。先完成免费解读，再用历史保存、深度追问或月报做长期复盘。",
    highlightsLabel: "产品原则",
    feedbackLabel: "代表性反馈",
    feedbackAction: "打开免费入口",
    reviews: "查看反馈",
    disclaimer: "AI 解读声明",
    privacy: "隐私说明",
  },
  en: {
    eyebrow: "Trust boundary",
    title: "Try the free reading first, then upgrade only for depth",
    body: "Search pages should make the promise clear before asking for commitment. POPTarot keeps the first answer free, frames AI tarot as reflective guidance, and reserves membership for saved history, deeper follow-ups, advanced spreads, and monthly reports.",
    highlightsLabel: "Product principles",
    feedbackLabel: "Representative feedback",
    feedbackAction: "Open free path",
    reviews: "Read feedback",
    disclaimer: "AI disclaimer",
    privacy: "Privacy",
  },
  ja: {
    eyebrow: "信頼の境界",
    title: "まず無料で試し、深く使う時だけアップグレード",
    body: "検索ページでは、先に約束を明確にします。最初の答えは無料、AIタロットは内省のガイド、会員機能は履歴保存・深い追質問・高度なスプレッド・月間レポート向けです。",
    highlightsLabel: "プロダクト原則",
    feedbackLabel: "代表的なフィードバック",
    feedbackAction: "無料入口を開く",
    reviews: "フィードバックを見る",
    disclaimer: "AI免責事項",
    privacy: "プライバシー",
  },
  ko: {
    eyebrow: "신뢰 경계",
    title: "먼저 무료로 경험하고, 깊이가 필요할 때만 업그레이드",
    body: "검색 페이지는 약속을 먼저 분명히 해야 합니다. 첫 답변은 무료이고, AI 타로는 성찰용 안내이며, 멤버십은 기록 저장, 깊은 후속 질문, 고급 스프레드, 월간 리포트를 위한 기능입니다.",
    highlightsLabel: "제품 원칙",
    feedbackLabel: "대표 피드백",
    feedbackAction: "무료 경로 열기",
    reviews: "피드백 보기",
    disclaimer: "AI 안내",
    privacy: "개인정보",
  },
  es: {
    eyebrow: "Límite de confianza",
    title: "Prueba gratis primero; mejora solo si necesitas profundidad",
    body: "Una página de búsqueda debe explicar la promesa antes de pedir compromiso. POPTarot mantiene gratis la primera respuesta, presenta el tarot IA como guía reflexiva y reserva la membresía para historial, preguntas profundas, tiradas avanzadas e informes mensuales.",
    highlightsLabel: "Principios del producto",
    feedbackLabel: "Comentarios representativos",
    feedbackAction: "Abrir ruta gratis",
    reviews: "Leer comentarios",
    disclaimer: "Aviso de IA",
    privacy: "Privacidad",
  },
  "pt-br": {
    eyebrow: "Limite de confiança",
    title: "Experimente gratis primeiro; assine so quando precisar de profundidade",
    body: "Uma pagina vinda da busca precisa deixar a promessa clara antes de pedir compromisso. POPTarot mantem a primeira resposta gratis, apresenta tarot IA como guia reflexivo e reserva assinatura para historico, perguntas profundas, tiragens avancadas e relatorios mensais.",
    highlightsLabel: "Principios do produto",
    feedbackLabel: "Feedback representativo",
    feedbackAction: "Abrir caminho gratis",
    reviews: "Ler feedback",
    disclaimer: "Aviso de IA",
    privacy: "Privacidade",
  },
} satisfies Record<SeoPage["locale"], {
  eyebrow: string
  title: string
  body: string
  highlightsLabel: string
  feedbackLabel: string
  feedbackAction: string
  reviews: string
  disclaimer: string
  privacy: string
}>

type QuestionDecisionCategory = "relationship" | "career" | "daily" | "general"

type QuestionDecisionGuide = {
  eyebrow: string
  title: string
  body: string
  items: Array<{
    label: string
    title: string
    body: string
  }>
}

const questionDecisionGuideCopy = {
  en: {
    relationship: {
      eyebrow: "Before you draw",
      title: "Use the reading to check signals, not to force certainty",
      body: "Love and reconciliation searches can carry a lot of hope. This quick checklist keeps the free spread grounded before you ask.",
      items: [
        { label: "01", title: "Name the real question", body: "Separate feelings, contact, timing, and safety so the spread answers one thing at a time." },
        { label: "02", title: "Compare cards with behavior", body: "Use the answer as reflection, then check whether real actions match the emotional pattern." },
        { label: "03", title: "Choose one next step", body: "End with a calm boundary, observation, or conversation instead of repeatedly asking the same question." },
      ],
    },
    career: {
      eyebrow: "Before you draw",
      title: "Use the spread to separate stress from a real work signal",
      body: "Career and money questions need practical grounding. Let the cards organize risk, timing, resources, and the next controllable move.",
      items: [
        { label: "01", title: "Define the decision", body: "Ask about one choice: stay, quit, apply, negotiate, wait, or prepare." },
        { label: "02", title: "List real constraints", body: "Keep money, contracts, health, deadlines, and support outside the reading but visible beside it." },
        { label: "03", title: "Set a checkpoint", body: "Turn the reading into one action and one date to review what changed." },
      ],
    },
    daily: {
      eyebrow: "Before you draw",
      title: "Turn a daily card into one small action",
      body: "Daily tarot works best as a repeatable check-in. Keep it short, save a note, and come back tomorrow with a little more evidence.",
      items: [
        { label: "01", title: "Pick today's focus", body: "Ask about love, career, mood, action, or boundaries instead of trying to solve everything." },
        { label: "02", title: "Write one sentence", body: "A short journal note makes tomorrow's card more useful than a one-off reading." },
        { label: "03", title: "Save a return cue", body: "Use Daily Tarot or a calendar reminder so the pattern can build over several days." },
      ],
    },
    general: {
      eyebrow: "Before you draw",
      title: "Make the free answer specific enough to use",
      body: "The best tarot questions are concrete, time-bounded, and connected to a choice you can actually influence.",
      items: [
        { label: "01", title: "Ask one question", body: "Remove hidden second questions so the spread does not split its answer." },
        { label: "02", title: "Look for the pattern", body: "Read what the cards repeat across obstacle, advice, and next-step positions." },
        { label: "03", title: "Act lightly", body: "Use the insight for reflection and planning, not as professional or guaranteed advice." },
      ],
    },
  },
  es: {
    relationship: {
      eyebrow: "Antes de tirar",
      title: "Usa la lectura para revisar senales, no para forzar certeza",
      body: "Las busquedas de amor o reconciliacion pueden venir con mucha esperanza. Esta lista mantiene la tirada gratis mas aterrizada.",
      items: [
        { label: "01", title: "Nombra la pregunta real", body: "Separa sentimientos, contacto, tiempo y seguridad para que la tirada responda una cosa." },
        { label: "02", title: "Compara con acciones", body: "Usa la respuesta como reflexion y observa si los hechos coinciden con el patron emocional." },
        { label: "03", title: "Elige un paso", body: "Termina con un limite, observacion o conversacion en vez de repetir la misma pregunta." },
      ],
    },
    career: {
      eyebrow: "Antes de tirar",
      title: "Separa estres de una senal real de trabajo",
      body: "Las preguntas de carrera y dinero necesitan tierra firme: riesgo, tiempo, recursos y un siguiente paso controlable.",
      items: [
        { label: "01", title: "Define la decision", body: "Pregunta por una eleccion: quedarte, renunciar, aplicar, negociar, esperar o prepararte." },
        { label: "02", title: "Lista limites reales", body: "Dinero, contratos, salud, plazos y apoyo deben estar visibles junto a la lectura." },
        { label: "03", title: "Marca una fecha", body: "Convierte la lectura en una accion y una fecha para revisar que cambio." },
      ],
    },
    daily: {
      eyebrow: "Antes de tirar",
      title: "Convierte una carta diaria en una accion pequena",
      body: "El tarot diario funciona mejor como check-in repetible: breve, con nota, y con una razon para volver manana.",
      items: [
        { label: "01", title: "Elige el foco", body: "Pregunta por amor, carrera, estado de animo, accion o limites, no por todo a la vez." },
        { label: "02", title: "Escribe una frase", body: "Una nota corta hace que la carta de manana sea mas util que una lectura aislada." },
        { label: "03", title: "Guarda el regreso", body: "Usa Daily Tarot o un recordatorio de calendario para formar un patron de varios dias." },
      ],
    },
    general: {
      eyebrow: "Antes de tirar",
      title: "Haz que la respuesta gratis sea concreta",
      body: "Las mejores preguntas de tarot son especificas, tienen tiempo definido y se conectan con algo que puedes influir.",
      items: [
        { label: "01", title: "Haz una pregunta", body: "Quita preguntas escondidas para que la tirada no divida su respuesta." },
        { label: "02", title: "Busca el patron", body: "Lee lo que se repite entre obstaculo, consejo y siguiente paso." },
        { label: "03", title: "Actua con calma", body: "Usa la lectura para reflexion y planificacion, no como consejo profesional garantizado." },
      ],
    },
  },
  "pt-br": {
    relationship: {
      eyebrow: "Antes de tirar",
      title: "Use a leitura para checar sinais, nao para forcar certeza",
      body: "Perguntas de amor ou reconciliacao podem vir com muita esperanca. Esta lista mantem a tiragem gratis mais aterrada.",
      items: [
        { label: "01", title: "Nomeie a pergunta real", body: "Separe sentimentos, contato, tempo e seguranca para a tiragem responder uma coisa." },
        { label: "02", title: "Compare com atitudes", body: "Use a resposta como reflexao e observe se os fatos combinam com o padrao emocional." },
        { label: "03", title: "Escolha um passo", body: "Termine com um limite, observacao ou conversa em vez de repetir a mesma pergunta." },
      ],
    },
    career: {
      eyebrow: "Antes de tirar",
      title: "Separe estresse de um sinal real de trabalho",
      body: "Perguntas de carreira e dinheiro precisam de base: risco, tempo, recursos e o proximo movimento controlavel.",
      items: [
        { label: "01", title: "Defina a decisao", body: "Pergunte sobre uma escolha: ficar, sair, aplicar, negociar, esperar ou se preparar." },
        { label: "02", title: "Liste limites reais", body: "Dinheiro, contratos, saude, prazos e apoio devem ficar visiveis junto da leitura." },
        { label: "03", title: "Marque uma data", body: "Transforme a leitura em uma acao e uma data para revisar o que mudou." },
      ],
    },
    daily: {
      eyebrow: "Antes de tirar",
      title: "Transforme uma carta diaria em uma acao pequena",
      body: "O tarot diario funciona melhor como check-in repetivel: curto, com nota, e com um motivo para voltar amanha.",
      items: [
        { label: "01", title: "Escolha o foco", body: "Pergunte por amor, carreira, humor, acao ou limites, nao por tudo ao mesmo tempo." },
        { label: "02", title: "Escreva uma frase", body: "Uma nota curta torna a carta de amanha mais util do que uma leitura isolada." },
        { label: "03", title: "Guarde o retorno", body: "Use Daily Tarot ou um lembrete de calendario para formar um padrao de varios dias." },
      ],
    },
    general: {
      eyebrow: "Antes de tirar",
      title: "Deixe a resposta gratis concreta",
      body: "As melhores perguntas de tarot sao especificas, tem prazo e se conectam com algo que voce pode influenciar.",
      items: [
        { label: "01", title: "Faca uma pergunta", body: "Remova perguntas escondidas para que a tiragem nao divida a resposta." },
        { label: "02", title: "Procure o padrao", body: "Leia o que se repete entre obstaculo, conselho e proximo passo." },
        { label: "03", title: "Aja com calma", body: "Use a leitura para reflexao e planejamento, nao como conselho profissional garantido." },
      ],
    },
  },
} satisfies Partial<Record<SeoPage["locale"], Record<QuestionDecisionCategory, QuestionDecisionGuide>>>

function questionDecisionCategory(slug: string): QuestionDecisionCategory {
  if (slug.startsWith("daily-")) return "daily"
  if (/(career|job|money|successful)/.test(slug)) return "career"
  if (/(love|ex|he|him|soulmate|spouse|relationship|text|contact)/.test(slug)) return "relationship"
  return "general"
}

function questionDecisionGuide(page: SeoPage): QuestionDecisionGuide {
  const category = questionDecisionCategory(page.slug)
  const localizedCopy = questionDecisionGuideCopy[page.locale as keyof typeof questionDecisionGuideCopy]
  return localizedCopy?.[category] || questionDecisionGuideCopy.en[category]
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

const cardCombinationCopy = {
  zh: {
    title: "常见牌组组合入口",
    body: "组合解读能帮助你理解一张牌和另一张牌同时出现时，主题如何被放大、修正或转向。",
    action: "查看组合",
  },
  en: {
    title: "Common Tarot Card Combination Paths",
    body: "Card combinations help you read how one card changes, strengthens, or redirects another card in a real spread.",
    action: "Read combinations",
  },
  ja: {
    title: "よくあるカード組み合わせ",
    body: "カードの組み合わせを見ると、1枚の意味が別のカードによってどう強まり、変化するかを読みやすくなります。",
    action: "組み合わせを見る",
  },
  ko: {
    title: "자주 나오는 카드 조합",
    body: "카드 조합은 한 카드의 의미가 다른 카드와 함께 나올 때 어떻게 강화되거나 바뀌는지 이해하게 해줍니다.",
    action: "조합 보기",
  },
  es: {
    title: "Combinaciones comunes de tarot",
    body: "Las combinaciones ayudan a leer cómo una carta cambia, refuerza o redirige a otra carta dentro de una tirada real.",
    action: "Leer combinaciones",
  },
  "pt-br": {
    title: "Combinações comuns de tarot",
    body: "As combinações ajudam a ler como uma carta muda, reforça ou redireciona outra carta dentro de uma tiragem real.",
    action: "Ler combinações",
  },
} satisfies Record<SeoPage["locale"], { title: string; body: string; action: string }>

const cardIndexGroupOrder = ["major", "wands", "cups", "pentacles", "swords"] as const
const combinationPreviewCardIds = [0, 1, 2, 6, 10, 13, 15, 16, 17, 18, 19, 20]
const cardMeaningHubSlugs = [
  "tarot-card-meanings",
  "love-tarot-card-meanings",
  "career-tarot-card-meanings",
  "money-tarot-card-meanings",
  "yes-or-no-tarot-card-meanings",
] as const
type CardMeaningPage = ReturnType<typeof getAllCardSeoPages>[number]
type CardIndexMode = "all" | CardMeaningContext

const cardMeaningFreeStartCopy = {
  zh: {
    eyebrow: "免费下一步",
    title: "从一张牌义进入真实问题",
    body: "看完牌义后，直接带着这张牌进入免费三牌阵，让 AI 把象征、牌位和你的处境连起来。",
    action: "用这张牌提问",
    questions: {
      all: "{card} 对我现在的情况意味着什么？",
      love: "{card} 对我现在的感情意味着什么？",
      career: "{card} 对我的事业下一步意味着什么？",
      money: "{card} 对我的金钱决定意味着什么？",
      "yes-or-no": "{card} 对我的问题更偏向是还是否？",
    },
  },
  en: {
    eyebrow: "Free next step",
    title: "Turn one card meaning into a real question",
    body: "After you read a card meaning, start a free spread with that card in mind so the AI can connect symbol, position, and situation.",
    action: "Ask with this card",
    questions: {
      all: "What does {card} mean for my current situation?",
      love: "What does {card} mean for my love life right now?",
      career: "What does {card} mean for my next career step?",
      money: "What does {card} mean for my money decision?",
      "yes-or-no": "Does {card} lean yes or no for my question?",
    },
  },
  ja: {
    eyebrow: "無料の次の一歩",
    title: "1枚の意味から実際の質問へ",
    body: "カードの意味を読んだら、そのカードを軸に無料スプレッドへ進み、象徴と状況をつなげて読みます。",
    action: "このカードで質問する",
    questions: {
      all: "{card} は今の私の状況で何を意味しますか？",
      love: "{card} は今の恋愛で何を意味しますか？",
      career: "{card} は仕事の次の一歩に何を意味しますか？",
      money: "{card} はお金の判断に何を意味しますか？",
      "yes-or-no": "{card} は私の質問に Yes と No のどちらを示しますか？",
    },
  },
  ko: {
    eyebrow: "무료 다음 단계",
    title: "한 장의 의미를 실제 질문으로 연결",
    body: "카드 의미를 읽은 뒤 그 카드를 중심으로 무료 스프레드를 시작해 상징, 위치, 상황을 함께 읽어보세요.",
    action: "이 카드로 질문하기",
    questions: {
      all: "{card}는 지금 내 상황에서 무엇을 의미하나요?",
      love: "{card}는 지금 내 사랑에서 무엇을 의미하나요?",
      career: "{card}는 내 커리어 다음 단계에 무엇을 의미하나요?",
      money: "{card}는 내 돈 결정에 무엇을 의미하나요?",
      "yes-or-no": "{card}는 내 질문에 예 또는 아니오 중 어디에 가깝나요?",
    },
  },
  es: {
    eyebrow: "Siguiente paso gratis",
    title: "Convierte una carta en una pregunta real",
    body: "Después de leer el significado, abre una tirada gratis con esa carta en mente para conectar símbolo, posición y situación.",
    action: "Preguntar con esta carta",
    questions: {
      all: "¿Qué significa {card} para mi situación actual?",
      love: "¿Qué significa {card} para mi vida amorosa ahora?",
      career: "¿Qué significa {card} para mi siguiente paso profesional?",
      money: "¿Qué significa {card} para mi decisión de dinero?",
      "yes-or-no": "¿{card} se inclina hacia sí o no para mi pregunta?",
    },
  },
  "pt-br": {
    eyebrow: "Próximo passo grátis",
    title: "Transforme uma carta em uma pergunta real",
    body: "Depois de ler o significado, abra uma tiragem grátis com essa carta em mente para conectar símbolo, posição e situação.",
    action: "Perguntar com esta carta",
    questions: {
      all: "O que {card} significa para minha situação atual?",
      love: "O que {card} significa para minha vida amorosa agora?",
      career: "O que {card} significa para meu próximo passo profissional?",
      money: "O que {card} significa para minha decisão financeira?",
      "yes-or-no": "{card} aponta mais para sim ou não na minha pergunta?",
    },
  },
} satisfies Record<SeoPage["locale"], {
  eyebrow: string
  title: string
  body: string
  action: string
  questions: Record<CardIndexMode, string>
}>

const cardMeaningContextCopy = {
  en: {
    love: {
      title: "Love Tarot Card Meanings",
      body: "Jump directly to each card's love meaning: attraction, emotional availability, boundaries, timing, commitment, and whether behavior supports the feeling.",
      browseLabel: "Browse love meanings by group",
      label: "Love",
      action: "Read love meaning",
      anchor: "love",
      headingPart: " in Love",
    },
    career: {
      title: "Career Tarot Card Meanings",
      body: "Jump directly to each card's career meaning for work choices, interviews, pressure, skill, timing, opportunity, and practical next steps.",
      browseLabel: "Browse career meanings by group",
      label: "Career",
      action: "Read career meaning",
      anchor: "career",
      headingPart: " in Career",
    },
    money: {
      title: "Money Tarot Card Meanings",
      body: "Jump directly to each card's money meaning for stability, spending, saving, debt, value, resources, risk, and material decisions.",
      browseLabel: "Browse money meanings by group",
      label: "Money",
      action: "Read money meaning",
      anchor: "money",
      headingPart: " for Money",
    },
    "yes-or-no": {
      title: "Yes or No Tarot Card Meanings",
      body: "Jump directly to each card's yes-or-no meaning and read the reason behind yes, no, not yet, or a conditional answer.",
      browseLabel: "Browse yes-or-no meanings by group",
      label: "Yes / No",
      action: "Read yes-or-no meaning",
      anchor: "yes-or-no",
      headingPart: " Yes or No",
    },
  },
  es: {
    love: {
      title: "Significados de cartas de tarot en el amor",
      body: "Abre directamente el significado amoroso de cada carta: atracción, disponibilidad emocional, límites, tiempos, compromiso y conducta real.",
      browseLabel: "Explorar significados de amor por grupo",
      label: "Amor",
      action: "Leer significado amoroso",
      anchor: "love",
      headingPart: " en el amor",
    },
    career: {
      title: "Significados de cartas de tarot en carrera",
      body: "Abre directamente el significado profesional de cada carta para decisiones laborales, entrevistas, presión, habilidad, tiempos y próximos pasos.",
      browseLabel: "Explorar significados de carrera por grupo",
      label: "Carrera",
      action: "Leer significado profesional",
      anchor: "career",
      headingPart: " en carrera",
    },
    money: {
      title: "Significados de cartas de tarot en dinero",
      body: "Abre directamente el significado de dinero de cada carta para estabilidad, gastos, ahorro, deudas, valor, recursos y riesgo.",
      browseLabel: "Explorar significados de dinero por grupo",
      label: "Dinero",
      action: "Leer significado de dinero",
      anchor: "money",
      headingPart: " en dinero",
    },
    "yes-or-no": {
      title: "Significados de cartas de tarot sí o no",
      body: "Abre directamente el significado sí o no de cada carta y lee la razón detrás de sí, no, todavía no o una respuesta condicional.",
      browseLabel: "Explorar significados sí o no por grupo",
      label: "Sí / No",
      action: "Leer significado sí o no",
      anchor: "yes-or-no",
      headingPart: " sí o no",
    },
  },
  "pt-br": {
    love: {
      title: "Significados das cartas de tarot no amor",
      body: "Abra direto o significado amoroso de cada carta: atração, disponibilidade emocional, limites, tempo, compromisso e comportamento real.",
      browseLabel: "Explorar significados de amor por grupo",
      label: "Amor",
      action: "Ler significado amoroso",
      anchor: "love",
      headingPart: " no amor",
    },
    career: {
      title: "Significados das cartas de tarot na carreira",
      body: "Abra direto o significado profissional de cada carta para decisões de trabalho, entrevistas, pressão, habilidade, tempo e próximos passos.",
      browseLabel: "Explorar significados de carreira por grupo",
      label: "Carreira",
      action: "Ler significado profissional",
      anchor: "career",
      headingPart: " na carreira",
    },
    money: {
      title: "Significados das cartas de tarot em dinheiro",
      body: "Abra direto o significado financeiro de cada carta para estabilidade, gastos, poupança, dívida, valor, recursos e risco.",
      browseLabel: "Explorar significados de dinheiro por grupo",
      label: "Dinheiro",
      action: "Ler significado de dinheiro",
      anchor: "money",
      headingPart: " em dinheiro",
    },
    "yes-or-no": {
      title: "Significados das cartas de tarot sim ou não",
      body: "Abra direto o significado sim ou não de cada carta e leia a razão por trás de sim, não, ainda não ou uma resposta condicional.",
      browseLabel: "Explorar significados sim ou não por grupo",
      label: "Sim / Não",
      action: "Ler significado sim ou não",
      anchor: "yes-or-no",
      headingPart: " sim ou não",
    },
  },
} satisfies Partial<Record<SeoPage["locale"], Record<CardMeaningContext, {
  title: string
  body: string
  browseLabel: string
  label: string
  action: string
  anchor: string
  headingPart: string
}>>>

function cardMeaningContextUi(locale: SeoPage["locale"], mode: CardMeaningContext) {
  const localizedCopy = cardMeaningContextCopy[locale as keyof typeof cardMeaningContextCopy]
  return localizedCopy?.[mode] || cardMeaningContextCopy.en[mode]
}

function cardIndexMode(page: SeoPage): CardIndexMode | null {
  if (page.cardMeaningContext) return page.cardMeaningContext
  return page.slug === "tarot-card-meanings" ? "all" : null
}

function cardIndexHref(cardPage: CardMeaningPage, mode: CardIndexMode | null) {
  if (!mode || mode === "all") return cardPage.path
  return `${cardPage.path}#${cardMeaningContextUi(cardPage.locale, mode).anchor}`
}

function cardContextSummary(cardPage: CardMeaningPage, mode: CardIndexMode | null) {
  if (!mode || mode === "all") return null
  const context = cardMeaningContextUi(cardPage.locale, mode)
  const section = cardPage.deepSections.find((item) => item.heading.includes(context.headingPart))
  return section?.body || cardPage.description
}

function cardMeaningFreeStartQuestion(cardPage: CardMeaningPage, locale: SeoPage["locale"], mode: CardIndexMode | null) {
  const cardName = getCardName(cardPage.card, locale)
  const questionMode = mode || "all"
  return cardMeaningFreeStartCopy[locale].questions[questionMode].replace("{card}", cardName)
}

function cardMeaningFreeStartSpread(mode: CardIndexMode | null): SpreadType {
  return mode === "yes-or-no" ? "yes_no" : "three_card"
}

function cardMeaningFreeStartHref(page: SeoPage, cardPage: CardMeaningPage, mode: CardIndexMode | null) {
  const params = new URLSearchParams({
    q: cardMeaningFreeStartQuestion(cardPage, page.locale, mode),
    spread: cardMeaningFreeStartSpread(mode),
    source: "card_meaning_free_start",
    card: cardPage.slug,
    utm_source: page.slug,
    utm_medium: "card_meaning_free_start",
    utm_campaign: "card_meanings",
  })

  if (mode && mode !== "all") {
    params.set("context", mode)
  }

  return `/input?${params.toString()}`
}

function cardMeaningHubPages(page: SeoPage) {
  if (!cardMeaningContextCopy[page.locale as keyof typeof cardMeaningContextCopy]) return []
  return cardMeaningHubSlugs
    .map((slug) => getSeoPage(slug, page.locale))
    .filter((item): item is SeoPage => Boolean(item))
    .filter((item) => item.slug !== page.slug)
}

function previewCombination(cardPage: CardMeaningPage) {
  const selfPair = `${cardPage.card.nameEn} with ${cardPage.card.nameEn}`
  return cardPage.combinations.find((item) => !item.heading.includes(selfPair)) || cardPage.combinations[0]
}

function relatedPages(page: SeoPage) {
  const priority = [
    "free-ai-tarot-reading",
    "daily-tarot",
    ...highIntentQuestionLinks.map((link) => link.href.replace(/^\//, "")),
    "monthly-tarot-report",
    "tarot-card-meanings",
    "love-tarot-card-meanings",
    "career-tarot-card-meanings",
    "money-tarot-card-meanings",
    "yes-or-no-tarot-card-meanings",
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

const relatedQuestionClusters: Record<string, string[]> = {
  "daily-love-tarot": [
    "daily-mood-tarot",
    "does-he-love-me-tarot",
    "yes-or-no-tarot-love",
    "daily-action-tarot",
  ],
  "daily-career-tarot": [
    "daily-action-tarot",
    "career-tarot-reading",
    "should-i-quit-my-job-tarot",
    "daily-yes-or-no-tarot",
  ],
  "daily-yes-or-no-tarot": [
    "daily-action-tarot",
    "yes-or-no-tarot-love",
    "daily-love-tarot",
    "daily-career-tarot",
  ],
  "daily-mood-tarot": [
    "daily-love-tarot",
    "daily-action-tarot",
    "how-does-he-feel-about-me-tarot",
    "daily-yes-or-no-tarot",
  ],
  "daily-action-tarot": [
    "daily-yes-or-no-tarot",
    "daily-career-tarot",
    "daily-love-tarot",
    "will-i-be-successful-tarot",
  ],
  "will-my-ex-come-back-tarot": [
    "will-he-come-back-tarot",
    "does-my-ex-miss-me-tarot",
    "will-we-get-back-together-tarot",
    "will-he-contact-me-tarot",
  ],
  "does-my-ex-miss-me-tarot": [
    "will-he-come-back-tarot",
    "will-my-ex-come-back-tarot",
    "will-he-contact-me-tarot",
    "is-he-thinking-about-me-tarot",
  ],
  "will-he-come-back-tarot": [
    "does-my-ex-miss-me-tarot",
    "will-my-ex-come-back-tarot",
    "will-we-get-back-together-tarot",
    "is-this-relationship-over-tarot",
  ],
  "will-we-get-back-together-tarot": [
    "will-he-come-back-tarot",
    "will-my-ex-come-back-tarot",
    "is-this-relationship-over-tarot",
    "will-he-contact-me-tarot",
  ],
  "will-he-contact-me-tarot": [
    "does-my-ex-miss-me-tarot",
    "should-i-text-him-tarot",
    "is-he-thinking-about-me-tarot",
    "will-my-ex-come-back-tarot",
  ],
  "should-i-text-him-tarot": [
    "will-he-contact-me-tarot",
    "is-he-thinking-about-me-tarot",
    "what-are-his-intentions-tarot",
    "yes-or-no-tarot-love",
  ],
  "does-he-love-me-tarot": [
    "how-does-he-feel-about-me-tarot",
    "what-are-his-intentions-tarot",
    "what-does-he-think-of-me-tarot",
    "is-he-thinking-about-me-tarot",
  ],
  "how-does-he-feel-about-me-tarot": [
    "does-he-love-me-tarot",
    "what-are-his-intentions-tarot",
    "what-does-he-think-of-me-tarot",
    "is-he-thinking-about-me-tarot",
  ],
  "what-are-his-intentions-tarot": [
    "how-does-he-feel-about-me-tarot",
    "does-he-love-me-tarot",
    "what-does-he-think-of-me-tarot",
    "is-he-thinking-about-me-tarot",
  ],
  "what-does-he-think-of-me-tarot": [
    "how-does-he-feel-about-me-tarot",
    "what-are-his-intentions-tarot",
    "does-he-love-me-tarot",
    "is-he-thinking-about-me-tarot",
  ],
  "is-he-thinking-about-me-tarot": [
    "how-does-he-feel-about-me-tarot",
    "does-my-ex-miss-me-tarot",
    "will-he-contact-me-tarot",
    "what-does-he-think-of-me-tarot",
  ],
  "is-he-my-soulmate-tarot": [
    "future-spouse-tarot-reading",
    "does-he-love-me-tarot",
    "when-will-i-find-love-tarot",
    "what-are-his-intentions-tarot",
  ],
  "when-will-i-find-love-tarot": [
    "future-spouse-tarot-reading",
    "is-he-my-soulmate-tarot",
    "does-he-love-me-tarot",
    "yes-or-no-tarot-love",
  ],
  "future-spouse-tarot-reading": [
    "when-will-i-find-love-tarot",
    "is-he-my-soulmate-tarot",
    "does-he-love-me-tarot",
    "yes-or-no-tarot-love",
  ],
  "yes-or-no-tarot-love": [
    "should-i-text-him-tarot",
    "does-he-love-me-tarot",
    "what-are-his-intentions-tarot",
    "is-this-relationship-over-tarot",
  ],
  "is-this-relationship-over-tarot": [
    "will-we-get-back-together-tarot",
    "will-my-ex-come-back-tarot",
    "will-he-contact-me-tarot",
    "yes-or-no-tarot-love",
  ],
  "career-tarot-reading": [
    "will-i-get-the-job-tarot",
    "should-i-take-this-job-tarot",
    "should-i-quit-my-job-tarot",
    "money-tarot-reading",
  ],
  "will-i-get-the-job-tarot": [
    "career-tarot-reading",
    "should-i-take-this-job-tarot",
    "will-i-be-successful-tarot",
    "money-tarot-reading",
  ],
  "should-i-take-this-job-tarot": [
    "career-tarot-reading",
    "will-i-get-the-job-tarot",
    "should-i-quit-my-job-tarot",
    "money-tarot-reading",
  ],
  "should-i-quit-my-job-tarot": [
    "career-tarot-reading",
    "should-i-take-this-job-tarot",
    "money-tarot-reading",
    "will-i-be-successful-tarot",
  ],
  "will-i-be-successful-tarot": [
    "career-tarot-reading",
    "will-i-get-the-job-tarot",
    "money-tarot-reading",
    "monthly-tarot-report",
  ],
  "money-tarot-reading": [
    "career-tarot-reading",
    "should-i-take-this-job-tarot",
    "will-i-be-successful-tarot",
    "should-i-quit-my-job-tarot",
  ],
}

function questionClusterPages(page: SeoPage) {
  const slugs = relatedQuestionClusters[page.slug] || []
  if (slugs.length === 0) return []

  const localizedPages = getAllLocalizedSeoPages().filter((candidate) => candidate.locale === page.locale)
  const bySlug = new Map(localizedPages.map((candidate) => [candidate.slug, candidate]))

  const pages: SeoPage[] = []
  for (const slug of slugs) {
    const candidate = bySlug.get(slug)
    if (candidate && candidate.slug !== page.slug) pages.push(candidate)
  }

  return pages
}

const highIntentQuestionSlugs = new Set(highIntentQuestionLinks.map((link) => link.href.replace(/^\//, "")))

function seoLandingSource(page: SeoPage) {
  return highIntentQuestionSlugs.has(page.slug) ? "seo_question_page" : "seo_landing_page"
}

function readingHref(page: SeoPage) {
  if (page.slug === "daily-tarot") {
    const params = new URLSearchParams({
      lang: page.locale,
      source: "seo",
      utm_source: "seo",
      utm_medium: "daily_landing",
      utm_campaign: page.locale === "es" || page.locale === "pt-br" ? page.path.replace(/^\//, "") : page.slug,
    })

    return `/daily-tarot?${params.toString()}`
  }

  const params = new URLSearchParams({
    q: page.ctaQuestion,
    auto: "1",
    source: seoLandingSource(page),
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

type QuestionReturnLoopItem = {
  id: string
  label: string
  title: string
  body: string
  action: string
  href: string
}

const questionReturnLoopCopy = {
  zh: {
    eyebrow: "免费回访路径",
    title: "先免费抽牌，再把复访接起来",
    body: "从 Google 进来的问题不应该只读一次。先获得免费答案，明天用每日塔罗复盘，等有足够记录后再考虑保存历史和月报。",
    items: [
      {
        label: "01",
        title: "先抽这个具体问题",
        body: "问题和牌阵已经预填好，先用免费解读确认方向，不需要先开会员。",
        action: "开始免费解读",
      },
      {
        label: "02",
        title: "明天用每日塔罗回访",
        body: "把今天的问题作为 return cue，明天抽一张每日牌，看情绪、行动或关系是否出现同一主题。",
        action: "打开每日塔罗",
      },
      {
        label: "03",
        title: "有记录后再看月度模式",
        body: "历史保存、高级牌阵和月度报告适合在多次免费体验之后使用，不放在第一步。",
        action: "查看月报入口",
      },
    ],
  },
  en: {
    eyebrow: "Free return loop",
    title: "Start free, then make the next visit obvious",
    body: "A search question should not be a dead end. Draw the matched spread first, come back with Daily Tarot tomorrow, and use saved history or monthly reports only after there is enough activity to review.",
    items: [
      {
        label: "01",
        title: "Draw this exact question",
        body: "The question and spread are already loaded, so the first useful answer stays free and immediate.",
        action: "Start free reading",
      },
      {
        label: "02",
        title: "Return with Daily Tarot",
        body: "Use today's question as a return cue, then check whether tomorrow's daily card repeats the same emotion, action, or relationship theme.",
        action: "Open Daily Tarot",
      },
      {
        label: "03",
        title: "Review patterns later",
        body: "Saved history, advanced spreads, and monthly reports become useful after several readings, not before the first answer.",
        action: "Preview monthly report",
      },
    ],
  },
  ja: {
    eyebrow: "無料の再訪導線",
    title: "まず無料で引き、次に戻る理由を作る",
    body: "検索から来た質問を一度で終わらせず、無料リーディング、翌日の Daily Tarot、記録が増えた後の月間レビューへつなげます。",
    items: [
      {
        label: "01",
        title: "この質問で引く",
        body: "質問とスプレッドは入力済みです。まず無料で方向を確認できます。",
        action: "無料で始める",
      },
      {
        label: "02",
        title: "Daily Tarot で戻る",
        body: "今日の質問を return cue として残し、明日のカードで同じテーマが出るか見ます。",
        action: "Daily Tarot を開く",
      },
      {
        label: "03",
        title: "後でパターンを見る",
        body: "履歴保存、高度なスプレッド、月間レポートは、記録が増えてから役立ちます。",
        action: "月間レポートを見る",
      },
    ],
  },
  ko: {
    eyebrow: "무료 재방문 흐름",
    title: "먼저 무료로 뽑고, 다시 올 이유를 만듭니다",
    body: "검색 질문을 한 번으로 끝내지 않고 무료 리딩, 내일의 Daily Tarot, 기록이 쌓인 뒤의 월간 리뷰로 연결합니다.",
    items: [
      {
        label: "01",
        title: "이 질문으로 뽑기",
        body: "질문과 스프레드가 준비되어 있어 첫 답은 무료로 바로 시작할 수 있습니다.",
        action: "무료 리딩 시작",
      },
      {
        label: "02",
        title: "Daily Tarot으로 돌아오기",
        body: "오늘 질문을 return cue로 남기고 내일 카드에서 같은 감정, 행동, 관계 테마가 반복되는지 봅니다.",
        action: "Daily Tarot 열기",
      },
      {
        label: "03",
        title: "나중에 패턴 보기",
        body: "기록 저장, 고급 스프레드, 월간 리포트는 여러 번 사용한 뒤 더 유용합니다.",
        action: "월간 리포트 보기",
      },
    ],
  },
  es: {
    eyebrow: "Ruta gratis de regreso",
    title: "Empieza gratis y deja claro el proximo paso",
    body: "Una pregunta desde Google no debe terminar en una sola visita. Tira la pregunta primero, vuelve manana con Daily Tarot y usa historial o informe mensual solo cuando haya actividad suficiente.",
    items: [
      {
        label: "01",
        title: "Tira esta pregunta exacta",
        body: "La pregunta y la tirada ya estan cargadas, para que la primera respuesta util sea gratis e inmediata.",
        action: "Empezar gratis",
      },
      {
        label: "02",
        title: "Vuelve con Daily Tarot",
        body: "Usa la pregunta de hoy como return cue y revisa manana si aparece el mismo tema emocional, practico o relacional.",
        action: "Abrir Daily Tarot",
      },
      {
        label: "03",
        title: "Revisa patrones despues",
        body: "El historial, las tiradas avanzadas y los informes mensuales son utiles despues de varias lecturas, no antes de la primera respuesta.",
        action: "Ver informe mensual",
      },
    ],
  },
  "pt-br": {
    eyebrow: "Caminho gratis de retorno",
    title: "Comece gratis e deixe o proximo passo claro",
    body: "Uma pergunta vinda do Google nao deve acabar em uma unica visita. Tire a pergunta primeiro, volte amanha com Daily Tarot e use historico ou relatorio mensal apenas quando houver atividade suficiente.",
    items: [
      {
        label: "01",
        title: "Tire esta pergunta exata",
        body: "A pergunta e a tiragem ja estao carregadas, para que a primeira resposta util seja gratis e imediata.",
        action: "Comecar gratis",
      },
      {
        label: "02",
        title: "Volte com Daily Tarot",
        body: "Use a pergunta de hoje como return cue e veja amanha se o mesmo tema emocional, pratico ou relacional aparece de novo.",
        action: "Abrir Daily Tarot",
      },
      {
        label: "03",
        title: "Revise padroes depois",
        body: "Historico salvo, tiragens avancadas e relatorios mensais ficam mais uteis depois de varias leituras, nao antes da primeira resposta.",
        action: "Ver relatorio mensal",
      },
    ],
  },
} satisfies Record<SeoPage["locale"], {
  eyebrow: string
  title: string
  body: string
  items: Array<Omit<QuestionReturnLoopItem, "id" | "href">>
}>

function questionReturnLoopItems(page: SeoPage, primaryHref: string): QuestionReturnLoopItem[] {
  const copy = questionReturnLoopCopy[page.locale]
  const dailyParams = new URLSearchParams({
    return_focus: page.ctaQuestion,
    utm_source: "seo",
    utm_medium: "question_return_loop",
    utm_campaign: page.slug,
  })
  const monthlyParams = new URLSearchParams({
    utm_source: "seo",
    utm_medium: "question_return_loop",
    utm_campaign: page.slug,
  })
  const hrefs = [
    primaryHref,
    `/daily-tarot?${dailyParams.toString()}`,
    `/monthly-tarot-report?${monthlyParams.toString()}`,
  ]
  const ids = ["free-reading", "daily-return", "monthly-pattern"]

  return copy.items.map((item, index) => ({
    ...item,
    id: ids[index],
    href: hrefs[index],
  }))
}

const questionHeroToolCopy = {
  zh: {
    label: "免费匹配牌阵",
    question: "已带入的问题",
    spread: "推荐牌阵",
    positions: "牌位",
    start: "免费抽这个问题",
    prompts: "也可以换成这些问法",
  },
  en: {
    label: "Free matched spread",
    question: "Question already loaded",
    spread: "Recommended spread",
    positions: "Positions",
    start: "Draw this question free",
    prompts: "Or switch to one of these prompts",
  },
  ja: {
    label: "無料の適合スプレッド",
    question: "入力済みの質問",
    spread: "おすすめスプレッド",
    positions: "カード位置",
    start: "この質問で無料リーディング",
    prompts: "別の質問に切り替える",
  },
  ko: {
    label: "무료 맞춤 스프레드",
    question: "미리 입력된 질문",
    spread: "추천 스프레드",
    positions: "카드 위치",
    start: "이 질문으로 무료 시작",
    prompts: "다른 질문으로 바꾸기",
  },
  es: {
    label: "Tirada gratis adecuada",
    question: "Pregunta ya cargada",
    spread: "Tirada recomendada",
    positions: "Posiciones",
    start: "Tirar esta pregunta gratis",
    prompts: "O cambia a una de estas preguntas",
  },
  "pt-br": {
    label: "Tiragem gratis adequada",
    question: "Pergunta ja carregada",
    spread: "Tiragem recomendada",
    positions: "Posicoes",
    start: "Tirar esta pergunta gratis",
    prompts: "Ou troque para uma destas perguntas",
  },
} satisfies Record<SeoPage["locale"], {
  label: string
  question: string
  spread: string
  positions: string
  start: string
  prompts: string
}>

const questionToolEntryCopy = {
  zh: {
    eyebrow: "免费问题入口",
    title: "这个问题已经准备好，可以直接抽牌",
    body: "页面内容负责帮你判断问题是否问对；真正的解读从一个预填好的问题和对应牌阵开始。",
    loaded: "已预填问题",
    spread: "推荐牌阵",
    positions: "会看的牌位",
    primary: "开始免费解读",
    related: "也可以直接抽这些问题",
    relatedAction: "免费抽这个问题",
  },
  en: {
    eyebrow: "Free question tool",
    title: "This search question is already ready to draw",
    body: "Use the page to frame the situation, then start the matching spread with the question already loaded.",
    loaded: "Question loaded",
    spread: "Recommended spread",
    positions: "Positions checked",
    primary: "Start the free reading",
    related: "Or draw a related question",
    relatedAction: "Draw this question free",
  },
  ja: {
    eyebrow: "無料質問ツール",
    title: "この検索質問はすぐに引けます",
    body: "ページで状況を整理し、入力済みの質問と対応スプレッドから無料リーディングを始められます。",
    loaded: "入力済みの質問",
    spread: "おすすめスプレッド",
    positions: "確認する位置",
    primary: "無料リーディング開始",
    related: "関連する質問も引けます",
    relatedAction: "この質問で無料リーディング",
  },
  ko: {
    eyebrow: "무료 질문 도구",
    title: "이 검색 질문은 바로 뽑을 수 있습니다",
    body: "페이지에서 상황을 정리한 뒤, 미리 입력된 질문과 맞춤 스프레드로 무료 리딩을 시작하세요.",
    loaded: "입력된 질문",
    spread: "추천 스프레드",
    positions: "확인할 포지션",
    primary: "무료 리딩 시작",
    related: "관련 질문도 바로 뽑기",
    relatedAction: "이 질문으로 무료 리딩",
  },
  es: {
    eyebrow: "Herramienta gratis",
    title: "Esta pregunta de busqueda ya esta lista para tirar",
    body: "Usa la pagina para ordenar la situacion y empieza la tirada adecuada con la pregunta ya cargada.",
    loaded: "Pregunta cargada",
    spread: "Tirada recomendada",
    positions: "Posiciones revisadas",
    primary: "Empezar lectura gratis",
    related: "O tira una pregunta relacionada",
    relatedAction: "Tirar esta pregunta gratis",
  },
  "pt-br": {
    eyebrow: "Ferramenta gratis",
    title: "Esta pergunta de busca ja esta pronta para tirar",
    body: "Use a pagina para organizar a situacao e comece a tiragem adequada com a pergunta ja carregada.",
    loaded: "Pergunta carregada",
    spread: "Tiragem recomendada",
    positions: "Posicoes analisadas",
    primary: "Comecar leitura gratis",
    related: "Ou tire uma pergunta relacionada",
    relatedAction: "Tirar esta pergunta gratis",
  },
} satisfies Record<SeoPage["locale"], {
  eyebrow: string
  title: string
  body: string
  loaded: string
  spread: string
  positions: string
  primary: string
  related: string
  relatedAction: string
}>

type ResultPreview = {
  eyebrow: string
  title: string
  body: string
  questionLabel: string
  cardsLabel: string
  interpretationLabel: string
  nextStepLabel: string
  actionLabel: string
  question: string
  cards: Array<{
    position: string
    card: string
    meaning: string
  }>
  interpretation: string
  nextStep: string
}

const resultPreviewUiCopy = {
  zh: {
    eyebrow: "结果预览",
    title: "免费答案会长什么样",
    body: "这是代表性示例，不是私人用户记录。它展示页面如何把具体问题、牌位和下一步行动连起来。",
    questionLabel: "示例问题",
    cardsLabel: "示例牌",
    interpretationLabel: "示例解读",
    nextStepLabel: "下一步",
    actionLabel: "免费试这个牌阵",
  },
  en: {
    eyebrow: "Result preview",
    title: "What the free answer can look like",
    body: "This is a representative sample, not a private user record. It shows how the page turns the question, card positions, and next step into a usable first reading.",
    questionLabel: "Sample question",
    cardsLabel: "Sample cards",
    interpretationLabel: "Sample interpretation",
    nextStepLabel: "Practical next step",
    actionLabel: "Try this spread free",
  },
  ja: {
    eyebrow: "結果プレビュー",
    title: "無料の答えの例",
    body: "これは代表例であり、個人の記録ではありません。質問、カード位置、次の一歩がどうつながるかを示します。",
    questionLabel: "例の質問",
    cardsLabel: "例のカード",
    interpretationLabel: "解釈例",
    nextStepLabel: "次の一歩",
    actionLabel: "無料で試す",
  },
  ko: {
    eyebrow: "결과 미리보기",
    title: "무료 답변 예시",
    body: "개인 기록이 아닌 대표 예시입니다. 질문, 카드 위치, 다음 행동이 어떻게 연결되는지 보여줍니다.",
    questionLabel: "예시 질문",
    cardsLabel: "예시 카드",
    interpretationLabel: "예시 해석",
    nextStepLabel: "다음 단계",
    actionLabel: "무료로 시작",
  },
  es: {
    eyebrow: "Vista previa",
    title: "Como puede verse la respuesta gratis",
    body: "Es un ejemplo representativo, no un registro privado. Muestra como la pagina conecta pregunta, posiciones y siguiente paso.",
    questionLabel: "Pregunta de ejemplo",
    cardsLabel: "Cartas de ejemplo",
    interpretationLabel: "Interpretacion de ejemplo",
    nextStepLabel: "Siguiente paso",
    actionLabel: "Probar gratis",
  },
  "pt-br": {
    eyebrow: "Previa do resultado",
    title: "Como pode ser a resposta gratis",
    body: "E um exemplo representativo, nao um registro privado. Mostra como a pagina conecta pergunta, posicoes e proximo passo.",
    questionLabel: "Pergunta de exemplo",
    cardsLabel: "Cartas de exemplo",
    interpretationLabel: "Interpretacao de exemplo",
    nextStepLabel: "Proximo passo",
    actionLabel: "Testar gratis",
  },
} satisfies Record<SeoPage["locale"], Omit<ResultPreview, "question" | "cards" | "interpretation" | "nextStep">>

const englishResultSamples: Record<string, {
  question: string
  cards: string[]
  meanings: string[]
  interpretation: string
  nextStep: string
}> = {
  "will-my-ex-come-back-tarot": {
    question: "Will my ex come back, and what has actually changed?",
    cards: ["Six of Cups", "The Hanged Man", "Justice", "Temperance", "Two of Cups"],
    meanings: ["nostalgia is present", "timing is paused", "accountability matters", "repair needs patience", "reconnection needs mutual care"],
    interpretation:
      "The sample answer is not a simple yes. Six of Cups shows unfinished memory, but The Hanged Man and Justice say return only becomes useful if something has changed in behavior, responsibility, and timing.",
    nextStep: "Wait for evidence of accountability before initiating a serious conversation.",
  },
  "does-he-love-me-tarot": {
    question: "Does he love me, or is this only attraction?",
    cards: ["The Lovers", "Knight of Wands", "Two of Cups", "The Moon", "Queen of Cups"],
    meanings: ["real attraction", "inconsistent pursuit", "mutual warmth", "unclear fear", "protect emotional dignity"],
    interpretation:
      "The Lovers and Two of Cups support affection, but Knight of Wands and The Moon warn that intensity is not the same as steady love. The answer asks you to compare feeling with follow-through.",
    nextStep: "Look for consistent behavior before investing more emotional energy.",
  },
  "yes-or-no-tarot-love": {
    question: "Is this connection worth pursuing right now?",
    cards: ["Ace of Cups", "Seven of Cups", "Justice"],
    meanings: ["yes to emotional opening", "confusion still exists", "choose based on facts"],
    interpretation:
      "This sample leans yes, but only with clarity. Ace of Cups opens the door, Seven of Cups shows mixed signals, and Justice says the next move should be based on honest evidence rather than fantasy.",
    nextStep: "Take one small clear step, then watch whether their response matches their words.",
  },
  "career-tarot-reading": {
    question: "What should I focus on in my career this month?",
    cards: ["The Magician", "Eight of Pentacles", "Two of Wands", "The Chariot", "Justice"],
    meanings: ["use available skills", "practice matters", "choose a direction", "commit momentum", "review contracts and consequences"],
    interpretation:
      "The answer points toward action, but not scattered action. The Magician and Eight of Pentacles ask for skillful execution, while Two of Wands and The Chariot ask you to choose one track instead of trying everything.",
    nextStep: "Pick one measurable professional move for the next two weeks and review the result.",
  },
  "should-i-quit-my-job-tarot": {
    question: "Should I quit my job or prepare first?",
    cards: ["Ten of Wands", "Death", "Four of Pentacles", "Two of Wands", "Temperance"],
    meanings: ["burnout is real", "a cycle may be ending", "money needs protection", "plan the next route", "pace the transition"],
    interpretation:
      "This sample shows strong transition energy, but not an impulsive exit. Ten of Wands and Death say the old pattern is heavy; Four of Pentacles and Temperance say planning matters before leaving.",
    nextStep: "Create a financial and timing plan before making the exit final.",
  },
}

function resultSampleForPage(page: SeoPage, toolkit: QuestionToolkit) {
  if (page.locale === "en" && englishResultSamples[page.slug]) return englishResultSamples[page.slug]

  return {
    question: toolkit.prompts[0] || page.ctaQuestion,
    cards: ["The High Priestess", "Two of Cups", "Justice", "Temperance", "The Star"],
    meanings: toolkit.frames.map((frame) => frame.title),
    interpretation:
      page.locale === "zh"
        ? "这个示例答案先读核心信号，再看阻碍和建议。重点不是制造确定预言，而是把问题转成一个可以执行的下一步。"
        : page.locale === "ja"
          ? "この例では、まず主要なサインを読み、次に障害と助言を確認します。確定した予言ではなく、実行できる一歩に変えるための読み方です。"
          : page.locale === "ko"
            ? "이 예시는 핵심 신호를 먼저 읽고, 장애물과 조언을 확인합니다. 확정 예언이 아니라 실행 가능한 다음 단계로 바꾸는 방식입니다."
            : page.locale === "es"
              ? "Este ejemplo lee primero la senal principal, luego el bloqueo y el consejo. No busca una prediccion fija, sino un siguiente paso util."
              : page.locale === "pt-br"
                ? "Este exemplo le primeiro o sinal principal, depois o bloqueio e o conselho. Nao busca uma predicao fixa, mas um proximo passo util."
                : "This sample reads the main signal first, then the obstacle and advice. It is not a fixed prediction; it turns the question into a useful next step.",
    nextStep:
      page.locale === "zh"
        ? "把建议写成一个今天能执行的动作，再决定是否需要更深追问。"
        : page.locale === "ja"
          ? "助言を今日できる一つの行動にしてから、さらに深く聞くか決めます。"
          : page.locale === "ko"
            ? "조언을 오늘 할 수 있는 한 가지 행동으로 바꾼 뒤 더 깊게 물을지 정하세요."
            : page.locale === "es"
              ? "Convierte el consejo en una accion que puedas hacer hoy antes de preguntar mas."
              : page.locale === "pt-br"
                ? "Transforme o conselho em uma acao que voce possa fazer hoje antes de perguntar mais."
                : "Turn the advice into one action you can take today before asking a deeper follow-up.",
  }
}

function createResultPreview(page: SeoPage, toolkit: QuestionToolkit | undefined, recommendedSpread: SpreadConfig | undefined): ResultPreview | undefined {
  if (!toolkit || !recommendedSpread || !highIntentQuestionSlugs.has(page.slug)) return undefined

  const copy = resultPreviewUiCopy[page.locale]
  const sample = resultSampleForPage(page, toolkit)
  const positionNames = toolkit.positionNames || recommendedSpread.positions.map((position) => (page.locale === "zh" ? position.name : position.nameEn))
  const previewPositions = positionNames.slice(0, Math.min(5, positionNames.length))

  return {
    ...copy,
    question: sample.question,
    cards: previewPositions.map((position, index) => ({
      position,
      card: sample.cards[index] || sample.cards[index % sample.cards.length],
      meaning: sample.meanings[index] || toolkit.frames[index % toolkit.frames.length]?.title || page.intent,
    })),
    interpretation: sample.interpretation,
    nextStep: sample.nextStep,
  }
}

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
    source: seoLandingSource(page),
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

function heroPositionNames(page: SeoPage, toolkit: QuestionToolkit, recommendedSpread: SpreadConfig) {
  return (toolkit.positionNames || recommendedSpread.positions.map((position) => (page.locale === "zh" ? position.name : position.nameEn))).slice(0, 6)
}

function QuestionHeroStart({
  page,
  toolkit,
  recommendedSpread,
  primaryHref,
}: {
  page: SeoPage
  toolkit: QuestionToolkit
  recommendedSpread: SpreadConfig
  primaryHref: string
}) {
  const copy = questionHeroToolCopy[page.locale]
  const spreadName = toolkit.spreadTitle || spreadNameForLocale(recommendedSpread, page.locale)

  return (
    <div
      data-question-hero-start
      data-question-matched-spread
      className="mt-7 rounded-lg border border-[#bfb6ff]/20 bg-black/28 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md lg:hidden"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{copy.label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-white">{page.ctaQuestion}</p>
      <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row">
        <Link
          href={primaryHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 text-sm font-medium text-[#120c22] shadow-[0_14px_34px_rgba(143,128,238,0.22)] transition hover:brightness-110"
        >
          {copy.start}
        </Link>
        <a
          href="#recommended-spread"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-white/68 transition hover:border-[#bfb6ff]/35 hover:text-white"
        >
          {spreadName}
        </a>
      </div>
    </div>
  )
}

function QuestionHeroTool({
  page,
  toolkit,
  recommendedSpread,
  primaryHref,
}: {
  page: SeoPage
  toolkit: QuestionToolkit
  recommendedSpread: SpreadConfig
  primaryHref: string
}) {
  const copy = questionHeroToolCopy[page.locale]
  const positionNames = heroPositionNames(page, toolkit, recommendedSpread)
  const spreadName = toolkit.spreadTitle || spreadNameForLocale(recommendedSpread, page.locale)
  const promptRows = toolkit.prompts.slice(0, 3)

  return (
    <aside
      data-question-hero-tool
      data-question-matched-spread
      className="relative rounded-lg border border-[#bfb6ff]/22 bg-black/32 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.32)] backdrop-blur-md"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e3ff]/50 to-transparent" />
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/82">{copy.label}</p>
      <div className="mt-5 border-b border-white/10 pb-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.question}</p>
        <p className="mt-2 break-words text-base font-medium leading-7 text-white">{page.ctaQuestion}</p>
        <Link
          href={primaryHref}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 text-sm font-medium text-[#120c22] shadow-[0_14px_34px_rgba(143,128,238,0.22)] transition hover:brightness-110"
        >
          {copy.start}
        </Link>
      </div>
      <div className="border-b border-white/10 py-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.spread}</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight text-white">{spreadName}</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">{toolkit.spreadBody || recommendedSpread.descriptionEn}</p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.positions}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {positionNames.map((position) => (
            <span key={position} className="inline-flex min-h-8 items-center rounded-full border border-white/10 px-3 text-xs text-white/64">
              {position}
            </span>
          ))}
        </div>
      </div>
      <div className="pt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.prompts}</p>
        <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {promptRows.map((prompt) => (
            <Link
              key={prompt}
              href={promptHref(page, prompt)}
              className="group block py-3 text-sm leading-6 text-white/64 transition hover:text-white"
            >
              <span className="block break-words">{prompt}</span>
              <span className="mt-1 block text-xs text-[#c9c0ff]/62 group-hover:text-[#e8e3ff]">{toolkitUiCopy[page.locale]?.drawPrompt || defaultToolkitUiCopy.drawPrompt}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

function QuestionToolEntry({
  page,
  toolkit,
  recommendedSpread,
  primaryHref,
  clusterRelated,
}: {
  page: SeoPage
  toolkit: QuestionToolkit
  recommendedSpread: SpreadConfig
  primaryHref: string
  clusterRelated: SeoPage[]
}) {
  const copy = questionToolEntryCopy[page.locale]
  const spreadName = toolkit.spreadTitle || spreadNameForLocale(recommendedSpread, page.locale)
  const positionNames = heroPositionNames(page, toolkit, recommendedSpread).slice(0, 4)
  const relatedRows = clusterRelated.slice(0, 3)

  return (
    <section
      id="question-tool-entry"
      data-seo-question-tool-entry
      data-long-tail-free-spread-entry
      className="border-b border-white/10 bg-[#0a0414]"
    >
      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="min-w-0 rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/80">{copy.eyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/62">{copy.body}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-[1.12fr_0.88fr]">
            <div className="rounded-lg border border-white/10 bg-black/[0.18] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.loaded}</p>
              <p className="mt-2 break-words text-sm font-medium leading-6 text-white">{page.ctaQuestion}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/[0.18] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.spread}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white">{spreadName}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/38">{copy.positions}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {positionNames.map((position) => (
                <span key={position} className="inline-flex min-h-8 items-center rounded-full border border-white/10 bg-black/[0.14] px-3 text-xs text-white/64">
                  {position}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={primaryHref}
            data-seo-question-tool-primary
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-5 py-3 text-sm font-medium text-[#120c22] shadow-[0_16px_38px_rgba(143,128,238,0.22)] transition hover:brightness-110 sm:w-auto"
          >
            {copy.primary}
          </Link>
        </div>

        {relatedRows.length > 0 && (
          <aside data-seo-question-tool-related className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/80">{copy.related}</p>
            <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {relatedRows.map((item) => (
                <Link
                  key={item.path}
                  href={readingHref(item)}
                  data-seo-question-related-direct-start
                  className="group block py-4"
                >
                  <h3 className="break-words text-sm font-medium leading-6 text-white group-hover:text-[#f4f0ff]">{item.h1}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/52">{item.intent}</p>
                  <span className="mt-2 block text-xs text-[#c9c0ff]/68 group-hover:text-[#eeeaff]">{copy.relatedAction}</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

export function SeoLandingPageView({ page }: { page: SeoPage }) {
  const cards = page.cards
    .map((id) => TAROT_CARDS.find((card) => card.id === id))
    .filter(Boolean)
  const activeCardIndexMode = cardIndexMode(page)
  const cardPages = activeCardIndexMode ? getAllCardSeoPages(page.locale) : []
  const primaryHref = readingHref(page)
  const clusterRelated = questionClusterPages(page)
  const clusterRelatedSlugs = new Set(clusterRelated.map((item) => item.slug))
  const related = relatedPages(page).filter((item) => !clusterRelatedSlugs.has(item.slug))
  const relatedText = relatedCopy[page.locale]
  const clusterText = questionClusterCopy[page.locale]
  const baseCardText = cardIndexCopy[page.locale]
  const contextCardText =
    activeCardIndexMode && activeCardIndexMode !== "all"
      ? cardMeaningContextUi(page.locale, activeCardIndexMode)
      : null
  const cardText = contextCardText
    ? {
        ...baseCardText,
        title: contextCardText.title,
        body: contextCardText.body,
        browseLabel: contextCardText.browseLabel,
      }
    : baseCardText
  const combinationText = cardCombinationCopy[page.locale]
  const toolkitCopy = toolkitUiCopy[page.locale] || defaultToolkitUiCopy
  const toolEntryCopy = questionToolEntryCopy[page.locale]
  const stickyCopy = stickyCtaCopy[page.locale]
  const recommendedSpread = page.recommendedSpread ? SPREAD_CONFIGS[page.recommendedSpread] : undefined
  const toolkit = localizedQuestionToolkits[page.locale]?.[page.slug] || createFallbackQuestionToolkit(page, recommendedSpread)
  const resultPreview = createResultPreview(page, toolkit, recommendedSpread)
  const isHighIntentQuestion = highIntentQuestionSlugs.has(page.slug)
  const decisionGuide = isHighIntentQuestion ? questionDecisionGuide(page) : null
  const returnLoopCopy = questionReturnLoopCopy[page.locale]
  const returnLoopItems = isHighIntentQuestion ? questionReturnLoopItems(page, primaryHref) : []
  const questionTrust = questionTrustCopy[page.locale]
  const questionTrustTestimonials = representativeTestimonials.slice(0, 3)
  const questionShareDailyParams = new URLSearchParams({
    return_focus: page.ctaQuestion,
    utm_source: "seo",
    utm_medium: "question_share_return",
    utm_campaign: page.slug,
  })
  const questionShareDailyHref = `/daily-tarot?${questionShareDailyParams.toString()}`
  const cardHubs = activeCardIndexMode ? cardMeaningHubPages(page) : []
  const cardGroups = cardIndexGroupOrder.map((group) => ({
    key: group,
    title: cardText.groups[group],
    cards: cardPages.filter((cardPage) => getCardSuit(cardPage.card) === group),
  }))
  const combinationPreviewPages =
    activeCardIndexMode === "all"
      ? combinationPreviewCardIds
          .map((id) => cardPages.find((cardPage) => cardPage.card.id === id))
          .filter((cardPage): cardPage is (typeof cardPages)[number] => Boolean(cardPage))
      : []
  const cardFreeStartText = cardMeaningFreeStartCopy[page.locale]
  const cardFreeStartPages = activeCardIndexMode
    ? combinationPreviewCardIds
        .map((id) => cardPages.find((cardPage) => cardPage.card.id === id))
        .filter((cardPage): cardPage is (typeof cardPages)[number] => Boolean(cardPage))
    : []

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
        potentialAction: [
          {
            "@type": "ReadAction",
            name: "Start free AI tarot reading",
            target: `${appUrl}${primaryHref}`,
          },
          ...(isHighIntentQuestion
            ? [
                {
                  "@type": "ShareAction",
                  name: "Share this tarot question",
                  target: `${appUrl}${page.path}`,
                },
              ]
            : []),
        ],
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
            ...(cardHubs.length > 0
              ? [
                  {
                    "@type": "ItemList",
                    "@id": `${appUrl}${page.path}#card-context-hubs`,
                    name: "Tarot card meaning context hubs",
                    numberOfItems: cardHubs.length,
                    itemListElement: cardHubs.map((hub, index) => ({
                      "@type": "ListItem",
                      position: index + 1,
                      url: `${appUrl}${hub.path}`,
                      name: hub.h1,
                      description: hub.description,
                    })),
                  },
                ]
              : []),
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#card-index`,
              name: cardText.title,
              description: cardText.body,
              numberOfItems: cardPages.length,
              itemListElement: cardPages.map((cardPage, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${appUrl}${cardIndexHref(cardPage, activeCardIndexMode)}`,
                name: cardPage.h1,
                description: cardContextSummary(cardPage, activeCardIndexMode) || cardPage.description,
              })),
            },
            ...(cardFreeStartPages.length > 0
              ? [
                  {
                    "@type": "ItemList",
                    "@id": `${appUrl}${page.path}#card-meaning-free-starts`,
                    name: cardFreeStartText.title,
                    description: cardFreeStartText.body,
                    numberOfItems: cardFreeStartPages.length,
                    itemListElement: cardFreeStartPages.map((cardPage, index) => ({
                      "@type": "ListItem",
                      position: index + 1,
                      url: `${appUrl}${cardMeaningFreeStartHref(page, cardPage, activeCardIndexMode)}`,
                      name: cardMeaningFreeStartQuestion(cardPage, page.locale, activeCardIndexMode),
                      description: cardPage.description,
                    })),
                  },
                ]
              : []),
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
                    url: `${appUrl}${cardIndexHref(cardPage, activeCardIndexMode)}`,
                    name: cardPage.h1,
                    description: cardContextSummary(cardPage, activeCardIndexMode) || cardPage.description,
                  })),
                },
              })),
            },
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#card-combination-paths`,
              name: combinationText.title,
              description: combinationText.body,
              numberOfItems: combinationPreviewPages.length,
              itemListElement: combinationPreviewPages.map((cardPage, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${appUrl}${cardPage.path}#combinations`,
                name: `${cardPage.h1} ${cardPage.combinationsLabel}`,
                description: previewCombination(cardPage)?.body || cardPage.description,
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
      ...(resultPreview
        ? [
            {
              "@type": "CreativeWork",
              "@id": `${appUrl}${page.path}#sample-result-preview`,
              name: resultPreview.title,
              description: resultPreview.interpretation,
              text: resultPreview.nextStep,
              isAccessibleForFree: true,
              about: resultPreview.question,
            },
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#sample-result-cards`,
              name: resultPreview.cardsLabel,
              numberOfItems: resultPreview.cards.length,
              itemListElement: resultPreview.cards.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: `${item.position}: ${item.card}`,
                description: item.meaning,
              })),
            },
          ]
        : []),
      ...(decisionGuide
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#decision-checklist`,
              name: decisionGuide.title,
              description: decisionGuide.body,
              numberOfItems: decisionGuide.items.length,
              itemListElement: decisionGuide.items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.title,
                description: item.body,
              })),
            },
          ]
        : []),
      ...(returnLoopItems.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#question-return-loop`,
              name: returnLoopCopy.title,
              description: returnLoopCopy.body,
              numberOfItems: returnLoopItems.length,
              itemListElement: returnLoopItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${appUrl}${item.href}`,
                name: item.title,
                description: item.body,
              })),
            },
          ]
        : []),
      ...(isHighIntentQuestion
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#reader-trust-signals`,
              name: questionTrust.title,
              description: questionTrust.body,
              numberOfItems: trustHighlights.length + questionTrustTestimonials.length,
              itemListElement: [
                ...trustHighlights.map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: item.title,
                  description: item.body,
                  url: `${appUrl}/free-tarot-tools`,
                })),
                ...questionTrustTestimonials.map((item, index) => ({
                  "@type": "ListItem",
                  position: trustHighlights.length + index + 1,
                  name: item.title,
                  description: item.quote,
                  url: `${appUrl}${item.actionHref || "/reviews"}`,
                })),
              ],
            },
          ]
        : []),
      ...(clusterRelated.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#related-question-cluster`,
              name: clusterText.title,
              description: clusterText.body,
              numberOfItems: clusterRelated.length,
              itemListElement: clusterRelated.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "WebPage",
                  "@id": `${appUrl}${item.path}#webpage`,
                  name: item.h1,
                  description: item.intent,
                  url: `${appUrl}${item.path}`,
                  isAccessibleForFree: true,
                  potentialAction: {
                    "@type": "InteractAction",
                    name: "Start related free tarot spread",
                    target: `${appUrl}${readingHref(item)}`,
                  },
                },
              })),
            },
          ]
        : []),
      ...(toolkit && recommendedSpread
        ? [
            {
              "@type": "WebApplication",
              "@id": `${appUrl}${page.path}#question-tool-entry`,
              name: toolEntryCopy.title,
              description: toolEntryCopy.body,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              inLanguage: page.locale,
              isAccessibleForFree: true,
              url: `${appUrl}${primaryHref}`,
              potentialAction: {
                "@type": "InteractAction",
                name: toolEntryCopy.primary,
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${appUrl}${primaryHref}`,
                  actionPlatform: [
                    "https://schema.org/DesktopWebPlatform",
                    "https://schema.org/MobileWebPlatform",
                  ],
                },
                object: {
                  "@type": "Question",
                  name: page.ctaQuestion,
                },
              },
            },
            {
              "@type": "WebApplication",
              "@id": `${appUrl}${page.path}#matched-question-spread`,
              name: `${toolkit.spreadTitle || recommendedSpread.nameEn} for ${page.ctaQuestion}`,
              description: toolkit.body,
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              inLanguage: page.locale,
              isAccessibleForFree: true,
              url: `${appUrl}${primaryHref}`,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              potentialAction: {
                "@type": "InteractAction",
                name: toolkitCopy.startSpread,
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${appUrl}${primaryHref}`,
                  actionPlatform: [
                    "https://schema.org/DesktopWebPlatform",
                    "https://schema.org/MobileWebPlatform",
                  ],
                },
                object: {
                  "@type": "Question",
                  name: page.ctaQuestion,
                },
              },
              about: {
                "@type": "ItemList",
                "@id": `${appUrl}${page.path}#matched-question-spread-positions`,
                name: toolkit.spreadTitle || recommendedSpread.nameEn,
                description: toolkit.spreadBody || recommendedSpread.descriptionEn || recommendedSpread.description,
                numberOfItems: recommendedSpread.positions.length,
                itemListElement: recommendedSpread.positions.map((position, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: toolkit.positionNames?.[index] || position.nameEn,
                  description: position.description,
                  url: `${appUrl}${primaryHref}`,
                })),
              },
            },
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
            <Link href="/" className="inline-flex min-h-10 items-center font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex min-h-10 items-center rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#e8e3ff] transition hover:border-[#e8e3ff] hover:bg-white/[0.06]"
            >
              {page.primaryCta}
            </Link>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="max-w-full break-words font-serif text-[2.1rem] font-semibold leading-tight tracking-normal text-white [overflow-wrap:anywhere] sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{page.intro}</p>
              {toolkit && recommendedSpread && (
                <QuestionHeroStart
                  page={page}
                  toolkit={toolkit}
                  recommendedSpread={recommendedSpread}
                  primaryHref={primaryHref}
                />
              )}
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

            {toolkit && recommendedSpread ? (
              <div className="hidden lg:block">
                <QuestionHeroTool
                  page={page}
                  toolkit={toolkit}
                  recommendedSpread={recommendedSpread}
                  primaryHref={primaryHref}
                />
              </div>
            ) : (
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
            )}
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
        <QuestionToolEntry
          page={page}
          toolkit={toolkit}
          recommendedSpread={recommendedSpread}
          primaryHref={primaryHref}
          clusterRelated={clusterRelated}
        />
      )}

      {decisionGuide && (
        <section id="decision-checklist" data-question-decision-checklist className="border-b border-white/10 bg-[#0d0618]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{decisionGuide.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{decisionGuide.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{decisionGuide.body}</p>
              </div>
              <div className="grid min-w-0 gap-3">
                {decisionGuide.items.map((item) => (
                  <article
                    key={item.title}
                    data-question-decision-checklist-item
                    className="min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-4"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="mt-1 inline-flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.08] text-[11px] tracking-[0.12em] text-[#c9c0ff]/82">
                        {item.label}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-base font-medium leading-6 text-white">{item.title}</span>
                        <span className="mt-2 block text-sm leading-6 text-white/58">{item.body}</span>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {returnLoopItems.length > 0 && (
        <section
          id="question-return-loop"
          data-question-return-loop
          className="border-b border-white/10 bg-[#0b0415]"
        >
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{returnLoopCopy.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{returnLoopCopy.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{returnLoopCopy.body}</p>
              </div>
              <div className="grid gap-3">
                {returnLoopItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    data-question-return-loop-card
                    data-question-return-loop-step={item.id}
                    className="group min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.06]"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="mt-1 inline-flex h-8 w-10 shrink-0 items-center justify-center rounded-md border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.08] text-[11px] tracking-[0.12em] text-[#c9c0ff]/82">
                        {item.label}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-base font-medium leading-6 text-white group-hover:text-[#f4f0ff]">
                          {item.title}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-white/56">{item.body}</span>
                        <span className="mt-3 block text-sm text-[#c9c0ff]/76 group-hover:text-[#eeeaff]">{item.action}</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {isHighIntentQuestion && (
        <SeoQuestionShareActions
          locale={page.locale}
          title={page.title}
          description={page.description}
          question={page.ctaQuestion}
          url={`${appUrl}${page.path}`}
          readingHref={primaryHref}
          dailyHref={questionShareDailyHref}
          campaign={page.slug}
        />
      )}

      {isHighIntentQuestion && (
        <section
          id="reader-trust-signals"
          data-seo-reader-trust
          className="border-b border-white/10 bg-[#0b0415]"
        >
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{questionTrust.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{questionTrust.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{questionTrust.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="/reviews"
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#c9c0ff]/24 px-3 py-2 text-sm text-[#e8e3ff] transition hover:border-[#c9c0ff]/55 hover:bg-white/[0.05]"
                  >
                    {questionTrust.reviews}
                  </Link>
                  <Link
                    href="/ai-tarot-disclaimer"
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-sm text-white/62 transition hover:border-[#c9c0ff]/40 hover:text-white"
                  >
                    {questionTrust.disclaimer}
                  </Link>
                  <Link
                    href="/privacy"
                    className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-sm text-white/62 transition hover:border-[#c9c0ff]/40 hover:text-white"
                  >
                    {questionTrust.privacy}
                  </Link>
                </div>
              </div>

              <div className="grid min-w-0 gap-4">
                <section data-seo-reader-trust-highlights className="min-w-0 border-t border-white/10 pt-5 lg:border-t-0 lg:pt-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/78">{questionTrust.highlightsLabel}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {trustHighlights.map((item) => (
                      <article
                        key={item.title}
                        data-seo-reader-trust-highlight
                        className="min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4"
                      >
                        <h3 className="break-words text-sm font-medium leading-6 text-white">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-white/54">{item.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section data-seo-reader-trust-testimonials className="min-w-0 border-t border-white/10 pt-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/78">{questionTrust.feedbackLabel}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {questionTrustTestimonials.map((item) => (
                      <article
                        key={item.title}
                        data-seo-reader-trust-testimonial
                        className="flex min-w-0 flex-col rounded-lg border border-white/10 bg-black/[0.16] p-4"
                      >
                        <h3 className="break-words text-sm font-medium leading-6 text-white">{item.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-white/56">{item.quote}</p>
                        <p className="mt-3 text-[11px] leading-5 text-white/36">{item.context}</p>
                        {item.actionHref && (
                          <Link
                            href={item.actionHref}
                            data-seo-reader-trust-testimonial-start
                            className="mt-auto pt-4 text-xs text-[#c9c0ff]/78 transition hover:text-white"
                          >
                            {item.actionLabel || questionTrust.feedbackAction}
                          </Link>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      )}

      {toolkit && recommendedSpread && (
        <section id="recommended-spread" className="border-b border-white/10 bg-[#080310]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{toolkit.label}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{toolkit.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">{toolkit.body}</p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article data-question-recommended-spread className="rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.045] p-5">
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

              <article id="ready-question-prompts" data-question-ready-prompts className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
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

            {resultPreview && (
              <section
                data-question-result-preview
                id="result-preview"
                className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.035] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/78">{resultPreview.eyebrow}</p>
                <div className="mt-3 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-tight text-white">{resultPreview.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/62">{resultPreview.body}</p>
                    <div className="mt-5 rounded-lg border border-white/10 bg-black/[0.16] p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{resultPreview.questionLabel}</p>
                      <p className="mt-2 break-words text-sm leading-6 text-white/76">{resultPreview.question}</p>
                    </div>
                    <Link
                      href={primaryHref}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#bfb6ff]/30 px-4 py-2 text-sm text-[#e8e3ff] transition hover:border-[#e8e3ff] hover:bg-white/[0.06] sm:w-auto"
                    >
                      {resultPreview.actionLabel}
                    </Link>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/78">{resultPreview.cardsLabel}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {resultPreview.cards.map((item) => (
                        <article key={`${item.position}-${item.card}`} className="rounded-lg border border-white/10 bg-black/[0.16] p-3">
                          <p className="text-xs uppercase tracking-[0.16em] text-white/38">{item.position}</p>
                          <p className="mt-1 text-sm font-medium text-white">{item.card}</p>
                          <p className="mt-2 text-xs leading-5 text-white/52">{item.meaning}</p>
                        </article>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <article className="rounded-lg border border-white/10 bg-black/[0.16] p-4">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{resultPreview.interpretationLabel}</p>
                        <p className="mt-3 text-sm leading-7 text-white/62">{resultPreview.interpretation}</p>
                      </article>
                      <article className="rounded-lg border border-white/10 bg-black/[0.16] p-4">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{resultPreview.nextStepLabel}</p>
                        <p className="mt-3 text-sm leading-7 text-white/62">{resultPreview.nextStep}</p>
                      </article>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      )}

      {cardPages.length > 0 && (
        <section
          data-card-context-index={activeCardIndexMode && activeCardIndexMode !== "all" ? activeCardIndexMode : undefined}
          className="border-b border-white/10 bg-[#080310]"
        >
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
            {cardHubs.length > 0 && (
              <div data-card-context-hubs className="mb-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {cardHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={hub.path}
                    className="group rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-[#bfb6ff]/[0.07]"
                  >
                    <h3 className="break-words text-sm font-medium leading-snug text-[#f1edff] group-hover:text-white">
                      {hub.h1}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/52">{hub.description}</p>
                  </Link>
                ))}
              </div>
            )}
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
                        const contextSummary = cardContextSummary(cardPage, activeCardIndexMode)

                        return (
                          <Link
                            key={cardPage.path}
                            href={cardIndexHref(cardPage, activeCardIndexMode)}
                            className="group flex min-w-0 gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#bfb6ff]/55 hover:bg-white/[0.06]"
                          >
                            <div className="relative aspect-[7/12] w-14 shrink-0 overflow-hidden rounded-md border border-[#bfb6ff]/30 bg-[#211330] sm:w-16">
                              <Image src={cardPage.card.image} alt={cardPage.title} fill className="object-cover" sizes="80px" />
                            </div>
                            <div className="min-w-0 flex-1 py-1">
                              <h4 className="line-clamp-2 text-sm font-medium leading-6 text-white/82 group-hover:text-white">
                                {cardPage.h1}
                              </h4>
                              {contextSummary && contextCardText ? (
                                <>
                                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/56">
                                    <span className="text-[#c9c0ff]/72">{contextCardText.label}:</span> {contextSummary}
                                  </p>
                                  <p className="mt-2 text-xs text-[#c9c0ff]/70 group-hover:text-[#e8e3ff]">
                                    {contextCardText.action}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="mt-2 line-clamp-1 text-xs leading-5 text-[#c9c0ff]/72">
                                    {cardText.upright}: {keywords.upright}
                                  </p>
                                  <p className="line-clamp-1 text-xs leading-5 text-white/44">
                                    {cardText.reversed}: {keywords.reversed}
                                  </p>
                                </>
                              )}
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

      {cardFreeStartPages.length > 0 && (
        <section id="card-meaning-free-starts" data-card-meaning-free-starts className="border-b border-white/10 bg-[#0d0618]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{cardFreeStartText.eyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-4xl">{cardFreeStartText.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">{cardFreeStartText.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cardFreeStartPages.map((cardPage) => {
                const question = cardMeaningFreeStartQuestion(cardPage, page.locale, activeCardIndexMode)

                return (
                  <Link
                    key={`${cardPage.path}-free-start`}
                    href={cardMeaningFreeStartHref(page, cardPage, activeCardIndexMode)}
                    data-card-meaning-free-start
                    className="group flex min-w-0 gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.06]"
                  >
                    <div className="relative aspect-[7/12] w-12 shrink-0 overflow-hidden rounded-md border border-[#bfb6ff]/28 bg-[#211330] sm:w-14">
                      <Image src={cardPage.card.image} alt={cardPage.title} fill className="object-cover" sizes="72px" />
                    </div>
                    <span className="min-w-0 flex-1 py-0.5">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">
                        {cardPage.h1}
                      </span>
                      <span className="mt-2 block break-words text-sm font-medium leading-6 text-white/82 group-hover:text-white">
                        {question}
                      </span>
                      <span className="mt-3 block text-sm text-[#c9c0ff]/72 group-hover:text-[#eeeaff]">
                        {cardFreeStartText.action}
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {combinationPreviewPages.length > 0 && (
        <section id="card-combination-paths" data-card-combination-paths className="border-b border-white/10 bg-[#0b0415]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{cardText.title}</p>
              <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">{combinationText.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{combinationText.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {combinationPreviewPages.map((cardPage) => {
                const firstCombination = previewCombination(cardPage)

                return (
                  <Link
                    key={`${cardPage.path}-combinations`}
                    href={`${cardPage.path}#combinations`}
                    className="group min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.06]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">
                      {cardPage.combinationsLabel}
                    </p>
                    <h3 className="mt-3 text-base font-medium leading-6 text-white group-hover:text-[#f4f0ff]">
                      {cardPage.h1}
                    </h3>
                    {firstCombination ? (
                      <>
                        <p className="mt-3 text-sm font-medium leading-6 text-[#e8e3ff]/82">{firstCombination.heading}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/56">{firstCombination.body}</p>
                      </>
                    ) : (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/56">{cardPage.description}</p>
                    )}
                    <span className="mt-4 inline-flex min-h-10 items-center text-sm text-[#c9c0ff] group-hover:text-white">
                      {combinationText.action}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {clusterRelated.length > 0 && (
        <section data-question-cluster className="border-b border-white/10 bg-[#0b0415]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
            <div className="mb-7 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{toolkit?.label || page.eyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">{clusterText.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{clusterText.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {clusterRelated.map((item) => (
                <article
                  key={item.path}
                  data-question-cluster-card
                  className="group flex min-h-[12rem] min-w-0 flex-col rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.06]"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/74">{item.eyebrow}</p>
                  <h3 className="mt-3 text-base font-medium leading-6 text-white group-hover:text-[#f4f0ff]">
                    {item.h1}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/56">{item.intent}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Link
                      href={readingHref(item)}
                      data-question-cluster-start
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#c9c0ff] px-3 py-2 text-center text-xs font-medium text-[#120c22] transition hover:bg-[#eeeaff]"
                    >
                      {clusterText.startAction}
                    </Link>
                    <Link
                      href={item.path}
                      data-question-cluster-guide
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-[#c9c0ff]/76 transition hover:border-[#c9c0ff]/40 hover:bg-white/[0.05] hover:text-[#eeeaff]"
                    >
                      {clusterText.action}
                    </Link>
                  </div>
                </article>
              ))}
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
