import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { localePath } from "@/lib/locales"
import { getSeoPage } from "@/lib/seo-pages"
import { getCardKeywords, getCardSlug, getCardSuit, type TarotCardSeoPage } from "@/lib/tarot-card-seo"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, trustLinks, websiteJsonLd } from "@/lib/site"
import type { SpreadType } from "@/lib/spread-config"
import { TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"
import { trustHighlights, trustLastReviewed } from "@/lib/trust-signals"

function readingHref(page: TarotCardSeoPage) {
  const params = new URLSearchParams({
    q: page.tryQuestion,
    auto: "1",
    lang: page.locale,
    spread: "three_card",
    utm_source: "seo",
    utm_medium: "card_meaning",
    utm_campaign: page.slug,
  })

  return `/input?${params.toString()}`
}

type CardPrompt = {
  label: string
  question: string
  spread: SpreadType
}

type QuestionPath = {
  title: string
  body: string
  href: string
}

type PracticePath = {
  title: string
  body: string
  href: string
}

function cardDisplayName(page: TarotCardSeoPage) {
  if (page.locale === "zh") return page.card.name
  if (page.locale === "ja") return page.card.nameJa || page.card.nameEn
  if (page.locale === "ko") return page.card.nameKo || page.card.nameEn
  return page.card.nameEn
}

function cardPageGuideCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)

  if (page.locale === "zh") {
    return {
      navTitle: "本页内容",
      summaryEyebrow: "快速答案",
      summaryTitle: `${name}怎么解`,
      summaryIntro: "先看正逆位和常见问题场景，再用下面的免费入口把牌义放进真实问题里。",
      coreLabel: "核心牌义",
      promptsLabel: "免费解读",
      questionsLabel: "问题入口",
      relatedLabel: "相关牌",
    }
  }

  if (page.locale === "ja") {
    return {
      navTitle: "このページ",
      summaryEyebrow: "クイック回答",
      summaryTitle: `${name}の読み方`,
      summaryIntro: "正逆とよくある質問テーマを先に確認し、その後で無料リーディングに進めます。",
      coreLabel: "基本の意味",
      promptsLabel: "無料リーディング",
      questionsLabel: "質問別",
      relatedLabel: "関連カード",
    }
  }

  if (page.locale === "ko") {
    return {
      navTitle: "페이지 내용",
      summaryEyebrow: "빠른 해석",
      summaryTitle: `${name} 해석 요약`,
      summaryIntro: "정/역방향과 자주 묻는 질문 상황을 먼저 보고, 아래 무료 리딩으로 실제 질문에 적용하세요.",
      coreLabel: "핵심 의미",
      promptsLabel: "무료 리딩",
      questionsLabel: "질문 경로",
      relatedLabel: "관련 카드",
    }
  }

  if (page.locale === "es") {
    return {
      navTitle: "En esta página",
      summaryEyebrow: "Respuesta rápida",
      summaryTitle: `Cómo leer ${name}`,
      summaryIntro: "Empieza con la posición normal, invertida y los temas de búsqueda más comunes; después prueba la carta en una lectura gratis.",
      coreLabel: "Significado base",
      promptsLabel: "Lectura gratis",
      questionsLabel: "Preguntas",
      relatedLabel: "Cartas relacionadas",
    }
  }

  if (page.locale === "pt-br") {
    return {
      navTitle: "Nesta página",
      summaryEyebrow: "Resposta rápida",
      summaryTitle: `Como ler ${name}`,
      summaryIntro: "Comece pela posição normal, invertida e temas de busca comuns; depois teste a carta em uma leitura grátis.",
      coreLabel: "Significado base",
      promptsLabel: "Leitura grátis",
      questionsLabel: "Perguntas",
      relatedLabel: "Cartas relacionadas",
    }
  }

  return {
    navTitle: "On this page",
    summaryEyebrow: "Quick answer",
    summaryTitle: `${name} meaning at a glance`,
    summaryIntro: "Start with upright, reversed, and high-intent search contexts, then try the card in a free AI tarot reading.",
    coreLabel: "Core meaning",
    promptsLabel: "Free reading",
    questionsLabel: "Question paths",
    relatedLabel: "Related cards",
  }
}

function cardStickyCtaCopy(page: TarotCardSeoPage) {
  if (page.locale === "zh") {
    return {
      eyebrow: "免费牌义解读",
      primary: "免费解读",
      secondary: "问题",
      secondaryLabel: "查看相关问题入口",
    }
  }

  if (page.locale === "ja") {
    return {
      eyebrow: "無料カード解釈",
      primary: "無料で読む",
      secondary: "質問",
      secondaryLabel: "関連する質問を見る",
    }
  }

  if (page.locale === "ko") {
    return {
      eyebrow: "무료 카드 리딩",
      primary: "무료 리딩",
      secondary: "질문",
      secondaryLabel: "관련 질문 보기",
    }
  }

  if (page.locale === "es") {
    return {
      eyebrow: "Lectura gratis",
      primary: "Leer gratis",
      secondary: "Preguntas",
      secondaryLabel: "Ver preguntas relacionadas",
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Leitura gratis",
      primary: "Ler gratis",
      secondary: "Perguntas",
      secondaryLabel: "Ver perguntas relacionadas",
    }
  }

  return {
    eyebrow: "Free card reading",
    primary: "Free reading",
    secondary: "Questions",
    secondaryLabel: "View related tarot question paths",
  }
}

function deepSectionAnchorId(page: TarotCardSeoPage, index: number) {
  if (page.locale === "en" || page.locale === "es" || page.locale === "pt-br") {
    return ["love", "career", "money", "yes-or-no", "advice"][index] || `context-${index + 1}`
  }

  return ["love", "career-money", "yes-or-no"][index] || `context-${index + 1}`
}

function cardQuickAnswerRows(page: TarotCardSeoPage, keywords: ReturnType<typeof getCardKeywords>) {
  return [
    { id: "upright", label: page.uprightLabel, body: keywords.upright },
    { id: "reversed", label: page.reversedLabel, body: keywords.reversed },
    ...page.deepSections.map((section, index) => ({
      id: deepSectionAnchorId(page, index),
      label: section.heading,
      body: section.body,
    })),
  ]
}

function cardPageNavItems(page: TarotCardSeoPage) {
  const copy = cardPageGuideCopy(page)

  return [
    { href: "#upright", label: page.uprightLabel },
    { href: "#reversed", label: page.reversedLabel },
    { href: "#core-meaning", label: copy.coreLabel },
    ...(page.locale === "en" ? [{ href: "#context-signals", label: "Context signals" }] : []),
    ...page.deepSections.map((section, index) => ({
      href: `#${deepSectionAnchorId(page, index)}`,
      label: section.heading,
    })),
    { href: "#spread-positions", label: page.positionLabel },
    { href: "#combinations", label: page.combinationsLabel },
    { href: "#example-readings", label: page.exampleLabel },
    { href: "#try-reading", label: copy.promptsLabel },
    { href: "#daily-practice", label: dailyPracticeNavLabel(page) },
    { href: "#question-paths", label: copy.questionsLabel },
    { href: "#related-cards", label: copy.relatedLabel },
    { href: "#faq", label: page.faqLabel },
  ]
}

function cardPromptHref(page: TarotCardSeoPage, prompt: CardPrompt) {
  const params = new URLSearchParams({
    q: prompt.question,
    auto: "1",
    lang: page.locale,
    spread: prompt.spread,
    utm_source: "seo",
    utm_medium: "card_prompt",
    utm_campaign: page.slug,
  })

  return `/input?${params.toString()}`
}

function cardExampleHref(page: TarotCardSeoPage, hrefSlug: string) {
  return getSeoPage(hrefSlug, page.locale)?.path || localePath(page.locale, `/${hrefSlug}`)
}

function cardCombinationHref(page: TarotCardSeoPage, item: TarotCardSeoPage["combinations"][number]) {
  if (!item.hrefSlug) return null
  return localePath(page.locale, `/tarot-card-meanings/${item.hrefSlug}`)
}

function combinationLinkLabel(page: TarotCardSeoPage) {
  if (page.locale === "zh") return "打开配对牌义"
  if (page.locale === "ja") return "組み合わせのカードを見る"
  if (page.locale === "ko") return "연결 카드 보기"
  if (page.locale === "es") return "Abrir carta relacionada"
  if (page.locale === "pt-br") return "Abrir carta relacionada"
  return "Open paired card"
}

function cardPromptCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)

  if (page.locale === "es") {
    return {
      eyebrow: "Preguntas para probar",
      title: `Usa ${name} en una lectura gratis`,
      body: "Convierte el significado de la carta en una pregunta concreta. Cada enlace abre una lectura de IA gratuita con una tirada adecuada.",
      action: "Tirar esta pregunta",
      prompts: [
        { label: "Amor", question: `Que significa ${name} para mi vida amorosa ahora?`, spread: "relationship" },
        { label: "Carrera", question: `Como puedo usar la energia de ${name} en mi carrera esta semana?`, spread: "job_opportunity" },
        { label: "Dinero", question: `Que debo entender sobre ${name} y mi decision de dinero ahora?`, spread: "shopping_decision" },
        { label: "Si o no", question: `${name} sugiere si o no para mi decision actual?`, spread: "yes_no" },
      ] satisfies CardPrompt[],
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Perguntas para testar",
      title: `Use ${name} em uma leitura gratis`,
      body: "Transforme o significado da carta em uma pergunta concreta. Cada link abre uma leitura de IA gratuita com uma tiragem adequada.",
      action: "Tirar esta pergunta",
      prompts: [
        { label: "Amor", question: `O que ${name} significa para minha vida amorosa agora?`, spread: "relationship" },
        { label: "Carreira", question: `Como posso usar a energia de ${name} na minha carreira esta semana?`, spread: "job_opportunity" },
        { label: "Dinheiro", question: `O que preciso entender sobre ${name} e minha escolha de dinheiro agora?`, spread: "shopping_decision" },
        { label: "Sim ou nao", question: `${name} sugere sim ou nao para minha decisao atual?`, spread: "yes_no" },
      ] satisfies CardPrompt[],
    }
  }

  return {
    eyebrow: "Try the meaning",
    title: `Use ${name} in a free AI reading`,
    body: "Turn the card meaning into a concrete question. Each prompt opens a free AI tarot reading with a matching spread.",
    action: "Draw this question",
    prompts: [
      { label: "Love", question: `What does ${name} mean for my love life right now?`, spread: "relationship" },
      { label: "Career", question: `How should I use ${name} energy in my career this week?`, spread: "job_opportunity" },
      { label: "Money", question: `What does ${name} suggest about my money choice right now?`, spread: "shopping_decision" },
      { label: "Yes or no", question: `Is ${name} a yes or no for my current decision?`, spread: "yes_no" },
    ] satisfies CardPrompt[],
  }
}

function questionPathCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)
  const path = (slug: string) => getSeoPage(slug, page.locale)?.path || localePath(page.locale, `/${slug}`)

  if (page.locale === "zh") {
    return {
      eyebrow: "相关问题入口",
      title: `把${name}放进真实问题里读`,
      body: "牌义页适合理解符号，问题页适合直接进入对应牌阵。下面这些入口会把用户带到更具体的免费 AI 塔罗解读。",
      paths: [
        { title: "前任会回来吗？", body: `${name}可以帮助判断联系、时机、未完成情绪和是否还值得等待。`, href: path("will-my-ex-come-back-tarot") },
        { title: "他爱我吗？", body: `用${name}观察感情是否只有吸引，还是有稳定行为和真实投入。`, href: path("does-he-love-me-tarot") },
        { title: "爱情 Yes / No", body: `当你需要快速方向时，把${name}和牌阵里的建议一起看。`, href: path("yes-or-no-tarot-love") },
        { title: "事业塔罗", body: `用${name}看清职业动力、风险、资源和下一步行动。`, href: path("career-tarot-reading") },
        { title: "该辞职吗？", body: `${name}可以帮助区分短期疲惫、真正转折和离开前要准备的事。`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  if (page.locale === "ja") {
    return {
      eyebrow: "関連する質問",
      title: `${name}を具体的な質問で読む`,
      body: "カードの意味を理解したら、次は質問別ページで実際のスプレッドに進めます。",
      paths: [
        { title: "元恋人は戻る？", body: `${name}で連絡、タイミング、未完了の感情、待つべきかを見ます。`, href: path("will-my-ex-come-back-tarot") },
        { title: "彼は私を愛している？", body: `${name}を、気持ちだけでなく行動や一貫性と一緒に読みます。`, href: path("does-he-love-me-tarot") },
        { title: "恋愛 Yes / No", body: `${name}を使い、答えだけでなく理由と次の行動を確認します。`, href: path("yes-or-no-tarot-love") },
        { title: "仕事のタロット", body: `${name}で仕事の方向性、リスク、資源、次の一歩を見ます。`, href: path("career-tarot-reading") },
        { title: "仕事を辞めるべき？", body: `${name}で疲れ、転機、準備すべき現実的条件を分けて考えます。`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  if (page.locale === "ko") {
    return {
      eyebrow: "관련 질문",
      title: `${name}를 실제 질문에 적용하기`,
      body: "카드 의미를 이해했다면, 질문형 페이지에서 바로 맞는 스프레드로 이어갈 수 있습니다.",
      paths: [
        { title: "전 애인이 돌아올까?", body: `${name}로 연락, 타이밍, 남은 감정, 기다림의 의미를 봅니다.`, href: path("will-my-ex-come-back-tarot") },
        { title: "그는 나를 사랑할까?", body: `${name}를 감정뿐 아니라 행동, 일관성, 안정감과 함께 읽습니다.`, href: path("does-he-love-me-tarot") },
        { title: "연애 Yes / No", body: `${name}로 답뿐 아니라 이유와 건강한 다음 행동을 확인합니다.`, href: path("yes-or-no-tarot-love") },
        { title: "커리어 타로", body: `${name}로 일의 방향, 리스크, 자원, 다음 행동을 점검합니다.`, href: path("career-tarot-reading") },
        { title: "퇴사해야 할까?", body: `${name}로 번아웃, 전환 신호, 준비해야 할 현실 조건을 나눠 봅니다.`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  if (page.locale === "es") {
    return {
      eyebrow: "Preguntas relacionadas",
      title: `Lee ${name} dentro de preguntas reales`,
      body: "La pagina de significado explica el simbolo. Estas entradas llevan a una tirada gratis enfocada en una pregunta concreta.",
      paths: [
        { title: "Mi ex volvera?", body: `${name} puede aclarar contacto, timing, cierre y si esperar todavia te ayuda.`, href: path("will-my-ex-come-back-tarot") },
        { title: "El me ama?", body: `Usa ${name} para comparar sentimientos, conducta, consistencia y seguridad emocional.`, href: path("does-he-love-me-tarot") },
        { title: "Esta pensando en mi?", body: `${name} ayuda a distinguir atencion privada, silencio y si un pensamiento puede volverse accion.`, href: path("is-he-thinking-about-me-tarot") },
        { title: "Deberia escribirle?", body: `Usa ${name} para revisar timing, intencion y si escribir protege tu claridad.`, href: path("should-i-text-him-tarot") },
        { title: "Tarot del amor si o no", body: `Lee ${name} con la razon del si, no o todavia no, no solo como una palabra.`, href: path("yes-or-no-tarot-love") },
        { title: "Cuando encontrare el amor?", body: `${name} convierte el timing amoroso en preparacion, energia de citas y un siguiente paso concreto.`, href: path("when-will-i-find-love-tarot") },
        { title: "Lectura de tarot para carrera", body: `${name} ayuda a ver direccion laboral, riesgo, recursos y el siguiente paso practico.`, href: path("career-tarot-reading") },
        { title: "Deberia renunciar a mi trabajo?", body: `${name} puede separar cansancio temporal, ciclo terminado y preparacion real antes de salir.`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Perguntas relacionadas",
      title: `Leia ${name} dentro de perguntas reais`,
      body: "A pagina de significado explica o simbolo. Estes caminhos abrem uma tiragem gratis focada em uma pergunta concreta.",
      paths: [
        { title: "Meu ex vai voltar?", body: `${name} pode clarear contato, timing, fechamento e se esperar ainda ajuda.`, href: path("will-my-ex-come-back-tarot") },
        { title: "Ele me ama?", body: `Use ${name} para comparar sentimentos, comportamento, consistencia e seguranca emocional.`, href: path("does-he-love-me-tarot") },
        { title: "Ele esta pensando em mim?", body: `${name} ajuda a separar atencao privada, silencio e se pensamento pode virar acao.`, href: path("is-he-thinking-about-me-tarot") },
        { title: "Devo mandar mensagem?", body: `Use ${name} para revisar timing, intencao e se mandar mensagem protege sua clareza.`, href: path("should-i-text-him-tarot") },
        { title: "Tarot do amor sim ou nao", body: `Leia ${name} com a razao do sim, nao ou ainda nao, nao apenas como uma palavra.`, href: path("yes-or-no-tarot-love") },
        { title: "Quando vou encontrar amor?", body: `${name} transforma timing amoroso em prontidao, energia de encontros e um proximo passo concreto.`, href: path("when-will-i-find-love-tarot") },
        { title: "Leitura de tarot para carreira", body: `${name} ajuda a ver direcao profissional, risco, recursos e o proximo passo pratico.`, href: path("career-tarot-reading") },
        { title: "Devo pedir demissao?", body: `${name} pode separar cansaco temporario, ciclo encerrado e preparacao real antes de sair.`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  return {
    eyebrow: "Related reading paths",
    title: `Read ${name} in real tarot questions`,
    body: "The card meaning explains the symbol. These question pages move directly into focused free AI tarot spreads for high-intent situations.",
    paths: [
      { title: "Will my ex come back?", body: `${name} can clarify contact, timing, closure, and whether waiting is still helping you.`, href: path("will-my-ex-come-back-tarot") },
      { title: "Does he love me?", body: `Use ${name} to compare feelings with behavior, consistency, and emotional safety.`, href: path("does-he-love-me-tarot") },
      { title: "Is he thinking about me?", body: `${name} can help separate private attention, silence, and whether thought is likely to become action.`, href: path("is-he-thinking-about-me-tarot") },
      { title: "Should I text him?", body: `Use ${name} to check timing, intention, and whether a message would protect your clarity.`, href: path("should-i-text-him-tarot") },
      { title: "Yes or no love tarot", body: `Read ${name} with the reason behind yes, no, or not yet instead of forcing one word.`, href: path("yes-or-no-tarot-love") },
      { title: "When will I find love?", body: `${name} can turn love timing into readiness, dating energy, and one practical next step.`, href: path("when-will-i-find-love-tarot") },
      { title: "Career tarot reading", body: `${name} can help reveal career direction, risk, resources, and the next practical move.`, href: path("career-tarot-reading") },
      { title: "Should I quit my job?", body: `${name} can separate temporary burnout, a completed cycle, and the preparation needed before leaving.`, href: path("should-i-quit-my-job-tarot") },
    ] satisfies QuestionPath[],
  }
}

function dailyPracticeNavLabel(page: TarotCardSeoPage) {
  if (page.locale === "zh") return "每日练习"
  if (page.locale === "ja") return "毎日の練習"
  if (page.locale === "ko") return "매일 연습"
  if (page.locale === "es") return "Práctica diaria"
  if (page.locale === "pt-br") return "Prática diária"
  return "Daily practice"
}

function dailyPracticeCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)
  const path = (slug: string) => getSeoPage(slug, page.locale)?.path || localePath(page.locale, `/${slug}`)

  if (page.locale === "zh") {
    return {
      eyebrow: "免费复访入口",
      title: `把${name}放进每天的练习里`,
      body: "单张牌义适合理解符号，每日塔罗和免费解读适合把它变成持续记录、真实问题和下一步行动。",
      action: "打开",
      paths: [
        { title: "每日塔罗", body: "每日一牌、连续打卡、日记和提醒，让用户明天有理由回来。", href: path("daily-tarot") },
        { title: "免费 AI 塔罗", body: `用${name}围绕一个真实问题开始免费解读，先获得价值，再决定是否深入。`, href: path("free-ai-tarot-reading") },
        { title: "月度塔罗报告", body: "当你有历史记录和连续主题后，再用更长报告观察模式。", href: path("monthly-tarot-report") },
      ] satisfies PracticePath[],
    }
  }

  if (page.locale === "ja") {
    return {
      eyebrow: "無料で戻れる入口",
      title: `${name}を毎日の練習に入れる`,
      body: "カードの意味は象徴の理解に役立ちます。毎日のタロットと無料リーディングは、それを記録、質問、行動に変えます。",
      action: "開く",
      paths: [
        { title: "今日のタロット", body: "一枚引き、連続記録、日記、リマインダーで戻る理由を作ります。", href: path("daily-tarot") },
        { title: "無料 AI タロット", body: `${name}を実際の質問に入れて、まず無料で意味を確認します。`, href: path("free-ai-tarot-reading") },
        { title: "月間タロットレポート", body: "履歴と繰り返すテーマができたら、長いレポートで流れを見ます。", href: path("monthly-tarot-report") },
      ] satisfies PracticePath[],
    }
  }

  if (page.locale === "ko") {
    return {
      eyebrow: "무료 재방문 입구",
      title: `${name}를 매일의 연습에 넣기`,
      body: "카드 의미는 상징을 이해하는 데 좋고, 데일리 타로와 무료 리딩은 기록, 질문, 다음 행동으로 이어집니다.",
      action: "열기",
      paths: [
        { title: "데일리 타로", body: "한 장 뽑기, 연속 기록, 저널, 알림으로 다시 올 이유를 만듭니다.", href: path("daily-tarot") },
        { title: "무료 AI 타로", body: `${name}를 실제 질문에 넣어 먼저 무료로 해석해 봅니다.`, href: path("free-ai-tarot-reading") },
        { title: "월간 타로 리포트", body: "기록과 반복되는 테마가 생기면 더 긴 리포트로 흐름을 봅니다.", href: path("monthly-tarot-report") },
      ] satisfies PracticePath[],
    }
  }

  if (page.locale === "es") {
    return {
      eyebrow: "Vuelve gratis",
      title: `Usa ${name} en una práctica diaria`,
      body: "El significado explica el símbolo. El tarot diario y la lectura gratis lo convierten en seguimiento, preguntas reales y un próximo paso.",
      action: "Abrir",
      paths: [
        { title: "Tarot diario", body: "Una carta al día, racha, diario y recordatorios para volver con una razón clara.", href: path("daily-tarot") },
        { title: "Lectura gratis con IA", body: `Usa ${name} dentro de una pregunta real y recibe valor antes de profundizar.`, href: path("free-ai-tarot-reading") },
        { title: "Informe mensual", body: "Cuando tengas historial y temas repetidos, usa un informe más largo para ver patrones.", href: path("monthly-tarot-report") },
      ] satisfies PracticePath[],
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Volte grátis",
      title: `Use ${name} em uma prática diária`,
      body: "O significado explica o símbolo. O tarot diário e a leitura grátis transformam isso em acompanhamento, perguntas reais e próximo passo.",
      action: "Abrir",
      paths: [
        { title: "Tarot diário", body: "Uma carta por dia, sequência, diário e lembretes para voltar com um motivo claro.", href: path("daily-tarot") },
        { title: "Leitura grátis com IA", body: `Use ${name} dentro de uma pergunta real e receba valor antes de aprofundar.`, href: path("free-ai-tarot-reading") },
        { title: "Relatório mensal", body: "Quando houver histórico e temas repetidos, use um relatório mais longo para ver padrões.", href: path("monthly-tarot-report") },
      ] satisfies PracticePath[],
    }
  }

  return {
    eyebrow: "Free return path",
    title: `Use ${name} in a daily tarot practice`,
    body: "The meaning explains the symbol. Daily Tarot and free AI readings turn it into a returning habit, a real question, and one practical next step.",
    action: "Open",
    paths: [
      { title: "Daily Tarot", body: "Draw one card each day, keep a streak, save a journal note, and set a reminder to come back tomorrow.", href: path("daily-tarot") },
      { title: "Free AI Tarot Reading", body: `Put ${name} into a real question and get useful guidance before deciding whether to go deeper.`, href: path("free-ai-tarot-reading") },
      { title: "Monthly Tarot Report", body: "After you have saved readings and repeated themes, use a longer report to see the bigger pattern.", href: path("monthly-tarot-report") },
    ] satisfies PracticePath[],
  }
}

function trustHighlightCopy(page: TarotCardSeoPage) {
  if (page.locale === "zh") return { eyebrow: "为什么先免费读", title: "先理解牌义，再决定是否深入", action: "阅读信任说明" }
  if (page.locale === "ja") return { eyebrow: "無料で始める理由", title: "意味を理解してから深く読む", action: "信頼ページを見る" }
  if (page.locale === "ko") return { eyebrow: "무료로 먼저 읽기", title: "카드 의미를 이해한 뒤 더 깊게 보기", action: "신뢰 안내 보기" }
  if (page.locale === "es") return { eyebrow: "Por qué empezar gratis", title: "Entiende la carta antes de profundizar", action: "Ver páginas de confianza" }
  if (page.locale === "pt-br") return { eyebrow: "Por que começar grátis", title: "Entenda a carta antes de aprofundar", action: "Ver páginas de confiança" }
  return { eyebrow: "Why start free", title: "Understand the card before you go deeper", action: "Read trust pages" }
}

function trustHighlightItems(page: TarotCardSeoPage) {
  if (page.locale === "zh") {
    return [
      { title: "先免费", body: "第一次解读、每日塔罗、牌义和搜索入口都应该先提供真实价值。" },
      { title: "会员放后面", body: "会员只用于历史保存、深度追问、高级牌阵和更长报告。" },
      { title: "负责的 AI", body: "AI 用来围绕牌面和问题做反思式解读，不把结果包装成确定预言。" },
    ]
  }

  if (page.locale === "ja") {
    return [
      { title: "まず無料", body: "初回リーディング、毎日のタロット、カード意味、検索ページは無料で役立つ形にしています。" },
      { title: "会員機能は後で", body: "会員機能は履歴保存、深い追質問、高度なスプレッド、長いレポート向けです。" },
      { title: "責任ある AI", body: "AI はカードと質問に沿った内省の補助であり、確定した予言として扱いません。" },
    ]
  }

  if (page.locale === "ko") {
    return [
      { title: "무료 먼저", body: "첫 리딩, 데일리 타로, 카드 의미, 검색 페이지는 결제 전에도 유용하도록 설계했습니다." },
      { title: "멤버십은 이후", body: "멤버십은 기록 저장, 깊은 후속 질문, 고급 스프레드, 긴 리포트에 사용됩니다." },
      { title: "책임 있는 AI", body: "AI는 카드와 질문을 바탕으로 성찰을 돕는 도구이며 확정 예언으로 제공하지 않습니다." },
    ]
  }

  if (page.locale === "es") {
    return [
      { title: "Gratis primero", body: "La primera lectura, el tarot diario, los significados y las páginas de búsqueda deben ser útiles sin pago." },
      { title: "Membresía después", body: "La membresía queda para historial guardado, seguimientos profundos, tiradas avanzadas e informes largos." },
      { title: "IA responsable", body: "La IA adapta la interpretación a cartas y preguntas, sin presentar resultados garantizados." },
    ]
  }

  if (page.locale === "pt-br") {
    return [
      { title: "Grátis primeiro", body: "A primeira leitura, o tarot diário, os significados e as páginas de busca precisam ser úteis sem pagamento." },
      { title: "Assinatura depois", body: "A assinatura fica para histórico salvo, perguntas profundas, tiragens avançadas e relatórios longos." },
      { title: "IA responsável", body: "A IA adapta a interpretação às cartas e perguntas, sem tratar resultados como garantidos." },
    ]
  }

  return trustHighlights
}

type RelatedCardLink = {
  title: string
  body: string
  href: string
  card: TarotCard
}

type NeighborCardLink = {
  eyebrow: string
  title: string
  body: string
  href: string
  card: TarotCard
}

function cardNameForLocale(card: TarotCard, page: TarotCardSeoPage) {
  if (page.locale === "zh") return card.name
  if (page.locale === "ja") return card.nameJa || card.nameEn
  if (page.locale === "ko") return card.nameKo || card.nameEn
  return card.nameEn
}

function relatedCardCopy(page: TarotCardSeoPage) {
  const name = cardDisplayName(page)

  if (page.locale === "zh") {
    return {
      eyebrow: "相关牌义",
      title: `继续比较${name}的相邻牌`,
      body: "相邻牌和同花色牌能帮助你看清同一主题在爱情、事业、财运、是或否问题里的变化。",
      action: "打开牌义",
    }
  }

  if (page.locale === "ja") {
    return {
      eyebrow: "関連カード",
      title: `${name}と近いカードを比べる`,
      body: "近いカードや同じスートのカードを見ると、恋愛、仕事、お金、Yes/No の読み方の違いが分かります。",
      action: "意味を開く",
    }
  }

  if (page.locale === "ko") {
    return {
      eyebrow: "관련 카드",
      title: `${name}와 가까운 카드를 비교하기`,
      body: "가까운 카드와 같은 수트의 카드를 함께 보면 사랑, 커리어, 돈, 예/아니오 해석의 차이가 더 선명해집니다.",
      action: "카드 의미 보기",
    }
  }

  if (page.locale === "es") {
    return {
      eyebrow: "Cartas relacionadas",
      title: `Compara ${name} con cartas cercanas`,
      body: "Las cartas cercanas y del mismo palo ayudan a ver cómo cambia el tema en amor, carrera, dinero y preguntas de sí o no.",
      action: "Abrir significado",
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Cartas relacionadas",
      title: `Compare ${name} com cartas próximas`,
      body: "Cartas próximas e do mesmo naipe ajudam a ver como o tema muda no amor, carreira, dinheiro e perguntas de sim ou não.",
      action: "Abrir significado",
    }
  }

  return {
    eyebrow: "Related card meanings",
    title: `Compare ${name} with nearby tarot cards`,
    body: "Nearby cards and same-suit cards help you see how the theme changes across love, career, money, and yes-or-no readings.",
    action: "Open meaning",
  }
}

function relatedCardBody(page: TarotCardSeoPage, relatedName: string) {
  const currentName = cardDisplayName(page)

  if (page.locale === "zh") {
    return `比较${currentName}与${relatedName}，看同一主题在正位、逆位和具体问题中如何变化。`
  }

  if (page.locale === "ja") {
    return `${currentName}と${relatedName}を比べ、正逆や質問ごとの違いを確認します。`
  }

  if (page.locale === "ko") {
    return `${currentName}와 ${relatedName}를 비교해 정/역방향과 질문별 차이를 확인합니다.`
  }

  if (page.locale === "es") {
    return `Compara ${currentName} con ${relatedName} para ver diferencias en posición normal, invertida y preguntas concretas.`
  }

  if (page.locale === "pt-br") {
    return `Compare ${currentName} com ${relatedName} para ver diferenças na posição normal, invertida e em perguntas concretas.`
  }

  return `Compare ${currentName} with ${relatedName} across upright, reversed, love, career, money, and yes-or-no meanings.`
}

function createRelatedCardLinks(page: TarotCardSeoPage): RelatedCardLink[] {
  const currentIndex = TAROT_CARDS.findIndex((card) => card.id === page.card.id)
  const suit = getCardSuit(page.card)
  const sameSuitCards = TAROT_CARDS.filter((card) => card.id !== page.card.id && getCardSuit(card) === suit)
  const sameSuitStart = sameSuitCards.findIndex((card) => card.id > page.card.id)
  const rotatedSameSuit =
    sameSuitStart === -1 ? sameSuitCards : [...sameSuitCards.slice(sameSuitStart), ...sameSuitCards.slice(0, sameSuitStart)]
  const partnerId = {
    major: 21,
    wands: 7,
    cups: 18,
    pentacles: 4,
    swords: 11,
  }[suit]

  const candidates = [
    TAROT_CARDS[currentIndex - 1],
    TAROT_CARDS[currentIndex + 1],
    ...rotatedSameSuit.slice(0, 3),
    TAROT_CARDS.find((card) => card.id === partnerId),
  ]

  const seen = new Set<number>()
  return candidates
    .filter((card): card is TarotCard => card !== undefined && card.id !== page.card.id)
    .filter((card) => {
      if (seen.has(card.id)) return false
      seen.add(card.id)
      return true
    })
    .slice(0, 4)
    .map((card) => {
      const name = cardNameForLocale(card, page)
      return {
        card,
        title:
          page.locale === "zh"
            ? `${name}牌义`
            : page.locale === "ja"
              ? `${name}の意味`
              : page.locale === "ko"
                ? `${name} 의미`
                : `${card.nameEn} Tarot Meaning`,
        body: relatedCardBody(page, name),
        href: localePath(page.locale, `/tarot-card-meanings/${getCardSlug(card)}`),
      }
    })
}

function neighborCardCopy(page: TarotCardSeoPage) {
  if (page.locale === "zh") {
    return {
      eyebrow: "牌义顺序",
      title: "继续按塔罗顺序浏览",
      body: "上一张和下一张牌能帮助你把这张牌放回完整牌组，看主题如何向前或向后变化。",
      previous: "上一张",
      next: "下一张",
    }
  }

  if (page.locale === "ja") {
    return {
      eyebrow: "カード順",
      title: "タロット順で続けて読む",
      body: "前後のカードを見ると、このカードのテーマがデッキ全体の流れの中でどう変わるか分かります。",
      previous: "前のカード",
      next: "次のカード",
    }
  }

  if (page.locale === "ko") {
    return {
      eyebrow: "카드 순서",
      title: "타로 순서대로 이어서 보기",
      body: "앞뒤 카드를 함께 보면 이 카드의 주제가 전체 덱 흐름에서 어떻게 변하는지 더 쉽게 보입니다.",
      previous: "이전 카드",
      next: "다음 카드",
    }
  }

  if (page.locale === "es") {
    return {
      eyebrow: "Orden del tarot",
      title: "Continúa por el orden del mazo",
      body: "Las cartas anterior y siguiente ayudan a ubicar este significado dentro del recorrido completo del tarot.",
      previous: "Carta anterior",
      next: "Carta siguiente",
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Ordem do tarot",
      title: "Continue pela ordem do baralho",
      body: "As cartas anterior e seguinte ajudam a colocar este significado dentro do caminho completo do tarot.",
      previous: "Carta anterior",
      next: "Próxima carta",
    }
  }

  return {
    eyebrow: "Tarot order",
    title: "Continue through the deck",
    body: "The previous and next cards help you place this meaning inside the full tarot sequence, not as an isolated symbol.",
    previous: "Previous card",
    next: "Next card",
  }
}

function createNeighborCardLinks(page: TarotCardSeoPage): NeighborCardLink[] {
  const index = TAROT_CARDS.findIndex((card) => card.id === page.card.id)
  if (index === -1) return []

  const copy = neighborCardCopy(page)
  const neighbors = [
    { eyebrow: copy.previous, card: TAROT_CARDS[(index - 1 + TAROT_CARDS.length) % TAROT_CARDS.length] },
    { eyebrow: copy.next, card: TAROT_CARDS[(index + 1) % TAROT_CARDS.length] },
  ]

  return neighbors.map(({ eyebrow, card }) => {
    const name = cardNameForLocale(card, page)

    return {
      eyebrow,
      card,
      title:
        page.locale === "zh"
          ? `${name}牌义`
          : page.locale === "ja"
            ? `${name}の意味`
            : page.locale === "ko"
              ? `${name} 의미`
              : page.locale === "es"
                ? `${name} significado`
                : page.locale === "pt-br"
                  ? `${name} significado`
                  : `${card.nameEn} Tarot Meaning`,
      body: relatedCardBody(page, name),
      href: localePath(page.locale, `/tarot-card-meanings/${getCardSlug(card)}`),
    }
  })
}

type CardContextSignalGrid = {
  navLabel: string
  eyebrow: string
  title: string
  body: string
  uprightLabel: string
  reversedLabel: string
  questionLabel: string
  actionLabel: string
  rows: Array<CardPrompt & {
    context: string
    upright: string
    reversed: string
  }>
}

function cardContextSignalGrid(
  page: TarotCardSeoPage,
  keywords: ReturnType<typeof getCardKeywords>
): CardContextSignalGrid | null {
  if (page.locale !== "en") return null

  const name = cardDisplayName(page)

  return {
    navLabel: "Context signals",
    eyebrow: "English search guide",
    title: `${name} by question type`,
    body: "Use these short signals when you need a fast answer, then open the matching free spread for a full AI reading.",
    uprightLabel: "Upright signal",
    reversedLabel: "Reversed signal",
    questionLabel: "Good next question",
    actionLabel: "Open free spread",
    rows: [
      {
        label: "Love",
        context: "Love",
        upright: `${keywords.upright}. Look for behavior that matches the feeling, not only attraction.`,
        reversed: `${keywords.reversed}. Slow down if the same relationship pattern keeps creating confusion.`,
        question: `What does ${name} mean for my love life right now?`,
        spread: "relationship",
      },
      {
        label: "Career",
        context: "Career",
        upright: `${keywords.upright}. Use it as a signal for momentum, responsibility, or the next practical move.`,
        reversed: `${keywords.reversed}. Check whether pressure, poor timing, or unclear priorities are distorting the decision.`,
        question: `How should I use ${name} energy in my career this week?`,
        spread: "job_opportunity",
      },
      {
        label: "Money",
        context: "Money",
        upright: `${keywords.upright}. Connect the meaning to real resources, spending, planning, and stability.`,
        reversed: `${keywords.reversed}. Avoid rushed choices until the risk, cost, or missing information is clear.`,
        question: `What does ${name} suggest about my money choice right now?`,
        spread: "shopping_decision",
      },
      {
        label: "Yes or no",
        context: "Yes or no",
        upright: `${keywords.upright}. It leans clearer when the question matches the card's active energy.`,
        reversed: `${keywords.reversed}. Treat the answer as wait, clarify, or repair the pattern before acting.`,
        question: `Is ${name} a yes or no for my current decision?`,
        spread: "yes_no",
      },
      {
        label: "Advice",
        context: "Advice",
        upright: `${keywords.upright}. Choose one grounded action that works with the card instead of chasing reassurance.`,
        reversed: `${keywords.reversed}. The useful advice is to correct the imbalance before making the next move.`,
        question: `What advice does ${name} give me today?`,
        spread: "three_card",
      },
    ],
  }
}

export function TarotCardMeaningPageView({ page }: { page: TarotCardSeoPage }) {
  const keywords = getCardKeywords(page.card, page.locale)
  const meaningsHref = localePath(page.locale, "/tarot-card-meanings")
  const cardImage = page.card.image.startsWith("http") ? page.card.image : `${appUrl}${page.card.image}`
  const primaryHref = readingHref(page)
  const promptCopy = cardPromptCopy(page)
  const practiceCopy = dailyPracticeCopy(page)
  const questionPaths = questionPathCopy(page)
  const relatedCopy = relatedCardCopy(page)
  const relatedCards = createRelatedCardLinks(page)
  const neighborCopy = neighborCardCopy(page)
  const neighborCards = createNeighborCardLinks(page)
  const trustCopy = trustHighlightCopy(page)
  const trustItems = trustHighlightItems(page)
  const guideCopy = cardPageGuideCopy(page)
  const stickyCopy = cardStickyCtaCopy(page)
  const navItems = cardPageNavItems(page)
  const quickRows = cardQuickAnswerRows(page, keywords)
  const contextSignalGrid = cardContextSignalGrid(page, keywords)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${appUrl}${page.path}#webpage`,
        name: page.title,
        description: page.description,
        url: `${appUrl}${page.path}`,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        isAccessibleForFree: true,
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        mainEntity: {
          "@id": `${appUrl}${page.path}#defined-term`,
        },
        about: {
          "@id": `${appUrl}${page.path}#defined-term`,
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
        image: cardImage,
        url: `${appUrl}${page.path}`,
        inLanguage: page.locale,
        dateModified: trustLastReviewed,
        isAccessibleForFree: true,
        mainEntityOfPage: {
          "@id": `${appUrl}${page.path}#webpage`,
        },
        about: {
          "@id": `${appUrl}${page.path}#defined-term`,
        },
        mentions: [
          ...page.deepSections.map((section) => section.heading),
          ...page.positionSections.map((section) => section.heading),
          ...page.exampleReadings.map((item) => item.label),
        ],
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
        "@type": "DefinedTermSet",
        "@id": `${appUrl}${meaningsHref}#defined-term-set`,
        name: "Tarot Card Meanings",
        url: `${appUrl}${meaningsHref}`,
        hasDefinedTerm: {
          "@id": `${appUrl}${page.path}#defined-term`,
        },
      },
      {
        "@type": "DefinedTerm",
        "@id": `${appUrl}${page.path}#defined-term`,
        name: page.h1,
        alternateName: Array.from(new Set([cardDisplayName(page), page.card.nameEn, page.card.name].filter(Boolean))),
        description: page.description,
        termCode: page.slug,
        url: `${appUrl}${page.path}`,
        inDefinedTermSet: {
          "@id": `${appUrl}${meaningsHref}#defined-term-set`,
        },
        subjectOf: [
          {
            "@id": `${appUrl}${page.path}#article`,
          },
          {
            "@id": `${appUrl}${page.path}#card-quick-answer`,
          },
          {
            "@id": `${appUrl}${page.path}#faq`,
          },
        ],
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
            name: "Tarot Card Meanings",
            item: `${appUrl}${meaningsHref}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.h1,
            item: `${appUrl}${page.path}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#card-quick-answer`,
        name: guideCopy.summaryTitle,
        description: guideCopy.summaryIntro,
        numberOfItems: quickRows.length,
        itemListElement: quickRows.map((row, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: row.label,
          description: row.body,
          url: `${appUrl}${page.path}#${row.id}`,
        })),
      },
      ...(contextSignalGrid
        ? [
            {
              "@type": "ItemList",
              "@id": `${appUrl}${page.path}#context-signal-grid`,
              name: contextSignalGrid.title,
              description: contextSignalGrid.body,
              numberOfItems: contextSignalGrid.rows.length,
              itemListElement: contextSignalGrid.rows.map((row, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: row.context,
                description: `${contextSignalGrid.uprightLabel}: ${row.upright} ${contextSignalGrid.reversedLabel}: ${row.reversed}`,
                url: `${appUrl}${cardPromptHref(page, row)}`,
              })),
            },
          ]
        : []),
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
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#spread-position-meanings`,
        name: page.positionLabel,
        itemListElement: page.positionSections.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.heading,
          description: item.body,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#card-combinations`,
        name: page.combinationsLabel,
        itemListElement: page.combinations.map((item, index) => {
          const href = cardCombinationHref(page, item)

          return {
            "@type": "ListItem",
            position: index + 1,
            name: item.heading,
            description: item.body,
            ...(href ? { url: `${appUrl}${href}` } : {}),
          }
        }),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#reading-prompts`,
        name: promptCopy.title,
        itemListElement: promptCopy.prompts.map((prompt, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: prompt.question,
          url: `${appUrl}${cardPromptHref(page, prompt)}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#example-readings`,
        name: page.exampleLabel,
        itemListElement: page.exampleReadings.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          description: `${item.question} ${item.interpretation}`,
          url: `${appUrl}${cardExampleHref(page, item.hrefSlug)}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#practice-paths`,
        name: practiceCopy.title,
        itemListElement: practiceCopy.paths.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#question-paths`,
        name: questionPaths.title,
        itemListElement: questionPaths.paths.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#related-card-meanings`,
        name: relatedCopy.title,
        itemListElement: relatedCards.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${page.path}#neighbor-card-meanings`,
        name: neighborCopy.title,
        description: neighborCopy.body,
        itemListElement: neighborCards.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
    ],
  }

  return (
    <main
      data-tarot-card-meaning-page
      className="min-h-screen overflow-x-hidden bg-[#080310] pb-[calc(env(safe-area-inset-bottom)+5.75rem)] text-white sm:pb-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div
        data-card-sticky-cta
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#090411]/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_50px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:hidden"
      >
        <div className="mx-auto flex max-w-md items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">
              {stickyCopy.eyebrow}
            </p>
            <p className="mt-1 truncate text-xs text-white/52">{cardDisplayName(page)}</p>
          </div>
          <a
            href="#question-paths"
            aria-label={stickyCopy.secondaryLabel}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-white/12 px-3 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
          >
            {stickyCopy.secondary}
          </a>
          <Link
            href={primaryHref}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-4 text-xs font-medium text-[#120c22] shadow-[0_12px_30px_rgba(146,132,239,0.24)] transition hover:brightness-110"
          >
            {stickyCopy.primary}
          </Link>
        </div>
      </div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_0%,rgba(123,83,178,0.38),transparent_34%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex w-full max-w-full items-center justify-between gap-3 overflow-hidden">
            <Link href="/" className="inline-flex min-h-10 shrink-0 items-center font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={meaningsHref}
              className="hidden min-h-10 min-w-0 items-center rounded-lg border border-white/12 px-4 py-2 text-xs text-white/68 transition hover:border-[#bfb6ff]/45 hover:text-white sm:inline-flex"
            >
              <span>{page.backLabel}</span>
            </Link>
          </nav>

          <div className="grid items-start gap-10 py-12 lg:min-h-[78vh] lg:grid-cols-[0.75fr_1.25fr]">
            <div data-card-hero-art className="hidden w-full max-w-[340px] lg:sticky lg:top-24 lg:order-1 lg:block">
              <div className="relative aspect-[7/12] overflow-hidden rounded-xl border border-[#bfb6ff]/35 bg-[#211330] shadow-2xl shadow-black/45">
                <Image src={page.card.image} alt={page.title} fill className="object-cover" sizes="360px" priority />
                <div className="absolute inset-3 rounded-lg border border-[#e8e3ff]/20" />
              </div>
            </div>

            <div data-card-hero-content className="order-1 min-w-0 max-w-[21rem] sm:max-w-3xl lg:order-2">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="break-words font-serif text-3xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 break-words text-sm leading-7 text-white/72 sm:text-lg sm:leading-8">{page.intro}</p>
              <EditorialByline locale={page.locale} className="mt-7" />

              <div data-card-mobile-art className="mt-6 w-[min(44vw,9rem)] lg:hidden">
                <div className="relative aspect-[7/12] overflow-hidden rounded-lg border border-[#bfb6ff]/35 bg-[#211330] shadow-xl shadow-black/35">
                  <Image src={page.card.image} alt={page.title} fill className="object-cover" sizes="144px" priority />
                  <div className="absolute inset-2 rounded border border-[#e8e3ff]/20" />
                </div>
              </div>

              <nav
                aria-label={guideCopy.navTitle}
                className="mt-7 rounded-lg border border-white/10 bg-white/[0.035] p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{guideCopy.navTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {navItems.map((item) => (
                    <a
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="inline-flex min-h-10 items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-white/62 transition hover:border-[#bfb6ff]/45 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>

              <section
                id="quick-answer"
                data-card-quick-answer
                className="mt-6 scroll-mt-24 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.035] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{guideCopy.summaryEyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{guideCopy.summaryTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{guideCopy.summaryIntro}</p>
                <dl className="mt-4 divide-y divide-white/10">
                  {quickRows.map((row) => (
                    <div key={row.id} className="grid gap-2 py-3 sm:grid-cols-[150px_1fr]">
                      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-[#c9c0ff]/72">{row.label}</dt>
                      <dd className="text-sm leading-6 text-white/64">{row.body}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {contextSignalGrid && (
                <section
                  id="context-signals"
                  data-card-context-signal-grid
                  className="mt-6 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{contextSignalGrid.eyebrow}</p>
                  <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{contextSignalGrid.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{contextSignalGrid.body}</p>
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    {contextSignalGrid.rows.map((row) => (
                      <article
                        key={row.context}
                        className="min-w-0 rounded-lg border border-white/10 bg-black/[0.14] p-4"
                      >
                        <h3 className="text-sm font-medium text-[#f1edff]">{row.context}</h3>
                        <div className="mt-3 space-y-3">
                          <p className="text-sm leading-6 text-white/62">
                            <span className="block text-[11px] uppercase tracking-[0.14em] text-[#c9c0ff]/68">
                              {contextSignalGrid.uprightLabel}
                            </span>
                            {row.upright}
                          </p>
                          <p className="text-sm leading-6 text-white/56">
                            <span className="block text-[11px] uppercase tracking-[0.14em] text-white/38">
                              {contextSignalGrid.reversedLabel}
                            </span>
                            {row.reversed}
                          </p>
                        </div>
                        <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/36">
                          {contextSignalGrid.questionLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/68">{row.question}</p>
                        <Link
                          href={cardPromptHref(page, row)}
                          data-card-context-signal-link
                          className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-[#c9c0ff] transition hover:text-white"
                        >
                          {contextSignalGrid.actionLabel}
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div id="upright" className="scroll-mt-24 rounded-lg border border-[#bfb6ff]/25 bg-white/[0.04] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-[#c9c0ff]">{page.uprightLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">{keywords.upright}</p>
                </div>
                <div id="reversed" className="scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-white/55">{page.reversedLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{keywords.reversed}</p>
                </div>
              </div>

              <div id="core-meaning" className="mt-8 grid scroll-mt-24 gap-4 md:grid-cols-2">
                {page.sections.map((section) => (
                  <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.deepSections.map((section, index) => (
                  <article
                    key={section.heading}
                    id={deepSectionAnchorId(page, index)}
                    className="scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5"
                  >
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <section
                id="spread-positions"
                className="mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5"
              >
                <h2 className="font-serif text-2xl leading-tight text-white">{page.positionLabel}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{page.positionIntro}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {page.positionSections.map((item) => (
                    <article key={item.heading} className="rounded-lg border border-white/10 bg-black/[0.14] p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/68">{item.position}</p>
                      <h3 className="mt-2 break-words text-sm font-medium text-white">{item.heading}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div id="combinations" className="mt-8 scroll-mt-24 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
                <h2 className="font-serif text-xl text-white">{page.combinationsLabel}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {page.combinations.map((item) => {
                    const href = cardCombinationHref(page, item)

                    return (
                      <article key={item.heading}>
                        <h3 className="text-sm font-medium text-[#c9c0ff]">{item.heading}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                        {href && (
                          <Link
                            href={href}
                            className="mt-3 inline-flex min-h-9 items-center text-xs font-medium uppercase tracking-[0.12em] text-[#eeeaff]/68 transition hover:text-white"
                          >
                            {combinationLinkLabel(page)}
                          </Link>
                        )}
                      </article>
                    )
                  })}
                </div>
              </div>

              <section
                id="example-readings"
                className="mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5"
              >
                <h2 className="font-serif text-2xl leading-tight text-white">{page.exampleLabel}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{page.exampleIntro}</p>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  {page.exampleReadings.map((item) => (
                    <article key={item.label} className="min-w-0 rounded-lg border border-white/10 bg-black/[0.14] p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/70">{item.label}</p>
                      <h3 className="mt-3 break-words text-base font-medium leading-6 text-white">{item.question}</h3>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/36">{item.cards}</p>
                      <p className="mt-3 text-sm leading-6 text-white/60">{item.interpretation}</p>
                      <p className="mt-3 text-sm leading-6 text-[#d9d2ff]/72">{item.nextStep}</p>
                      <Link
                        href={cardExampleHref(page, item.hrefSlug)}
                        className="mt-4 inline-flex min-h-10 items-center text-sm text-[#c9c0ff] transition hover:text-white"
                      >
                        {questionPaths.eyebrow}
                      </Link>
                    </article>
                  ))}
                </div>
              </section>

              <div id="try-reading" className="mt-8 scroll-mt-24 rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.045] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/80">{promptCopy.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{promptCopy.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{promptCopy.body}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {promptCopy.prompts.map((prompt) => (
                    <Link
                      key={prompt.question}
                      href={cardPromptHref(page, prompt)}
                      className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{prompt.label}</p>
                      <p className="mt-3 break-words text-sm leading-6 text-white/72 group-hover:text-white">{prompt.question}</p>
                      <p className="mt-3 text-xs text-[#c9c0ff]/65 group-hover:text-[#e8e3ff]">{promptCopy.action}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <section id="daily-practice" className="mt-8 scroll-mt-24">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{practiceCopy.eyebrow}</p>
                <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl leading-tight text-white">{practiceCopy.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{practiceCopy.body}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {practiceCopy.paths.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-[#bfb6ff]/[0.055]"
                    >
                      <h3 className="break-words text-sm font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                      <p className="mt-3 text-xs text-[#c9c0ff]/65 group-hover:text-[#e8e3ff]">{practiceCopy.action}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <div id="question-paths" className="mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{questionPaths.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{questionPaths.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{questionPaths.body}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {questionPaths.paths.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.14] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                    >
                      <h3 className="break-words text-sm font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.035] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{trustCopy.eyebrow}</p>
                <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <h2 className="max-w-2xl font-serif text-2xl leading-tight text-white">{trustCopy.title}</h2>
                  <Link href="/about" className="inline-flex min-h-10 items-center text-sm text-[#c9c0ff] transition hover:text-white">
                    {trustCopy.action}
                  </Link>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {trustItems.map((item) => (
                    <article key={item.title} className="rounded-lg border border-white/10 bg-black/[0.14] p-4">
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div id="related-cards" className="mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{relatedCopy.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{relatedCopy.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{relatedCopy.body}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {relatedCards.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.14] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                    >
                      <h3 className="break-words text-sm font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                      <p className="mt-3 text-xs text-[#c9c0ff]/65 group-hover:text-[#e8e3ff]">{relatedCopy.action}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div id="faq" className="mt-8 scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <h2 className="font-serif text-xl text-white">{page.faqLabel}</h2>
                <div className="mt-4 space-y-4">
                  {page.faqs.map((faq) => (
                    <article key={faq.question}>
                      <h3 className="text-sm font-medium text-white">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/62">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </div>

              <nav
                data-card-neighbor-nav
                aria-label={neighborCopy.title}
                className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.035] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/75">{neighborCopy.eyebrow}</p>
                <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{neighborCopy.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{neighborCopy.body}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {neighborCards.map((item) => (
                    <Link
                      key={item.href}
                      data-card-neighbor-link
                      href={item.href}
                      className="group min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/38">{item.eyebrow}</p>
                      <h3 className="mt-2 break-words text-sm font-medium text-white group-hover:text-[#eeeaff]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-6 py-3 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.22)] transition hover:brightness-110"
                >
                  {page.ctaLabel}
                </Link>
                <Link
                  href={meaningsHref}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/14 px-6 py-3 text-sm text-white/72 transition hover:border-white/32 hover:bg-white/[0.05]"
                >
                  {page.backLabel}
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-8">
                {trustLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-10 items-center rounded-lg border border-white/10 px-3 py-2 text-sm text-white/56 transition hover:border-[#bfb6ff]/45 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
