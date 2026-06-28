import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { localeOpenGraph, type SeoLocale } from "@/lib/locales"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, siteName, websiteJsonLd } from "@/lib/site"
import { isAdvancedSpreadType, SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { trustLastReviewed } from "@/lib/trust-signals"

type TarotSpreadHubLocale = Extract<SeoLocale, "en" | "es" | "pt-br">

type SpreadGroupCopy = {
  label: string
  title: string
  body: string
  spreads: SpreadType[]
}

type LocalizedSpreadCopy = {
  name: string
  description: string
  question: string
  positions?: string[]
}

type SpreadHubCopy = {
  locale: TarotSpreadHubLocale
  path: string
  title: string
  description: string
  headerLinkLabel: string
  eyebrow: string
  heading: string
  intro: string
  features: Array<{ title: string; body: string }>
  groups: SpreadGroupCopy[]
  chooseEyebrow: string
  chooseTitle: string
  chooseBody: string
  positionsLabel: string
  startLabel: string
  freeBadge: string
  memberBadge: string
  freeNote: string
  memberNote: string
  freeStarterLabel: string
  boundaryEyebrow: string
  boundaryTitle: string
  boundaryBody: string
  boundaryItems: Array<{ title: string; body: string }>
  cardLabel: (count: number) => string
}

const spreadOrder: SpreadType[] = [
  "single_card",
  "yes_no",
  "three_card",
  "relationship",
  "their_thoughts",
  "breakup_recovery",
  "job_opportunity",
  "binary_choice",
  "love_connection",
  "exam_fortune",
  "shopping_decision",
  "interpersonal",
]

const spreadHubPaths = {
  en: "/tarot-spreads",
  es: "/es/tiradas-tarot",
  "pt-br": "/pt-br/tiragens-tarot",
} satisfies Record<TarotSpreadHubLocale, string>

export function getTarotSpreadHubPath(locale: TarotSpreadHubLocale) {
  return spreadHubPaths[locale]
}

const localizedSpreads: Record<TarotSpreadHubLocale, Partial<Record<SpreadType, LocalizedSpreadCopy>>> = {
  en: {},
  es: {
    single_card: {
      name: "Una carta",
      description: "Una lectura rapida de una carta para ver el mensaje central y el siguiente paso.",
      question: "Que necesito saber ahora mismo?",
      positions: ["Mensaje central"],
    },
    yes_no: {
      name: "Si o no",
      description: "Una tirada directa de una carta para una pregunta clara de si o no.",
      question: "Deberia escribir primero?",
      positions: ["Respuesta"],
    },
    three_card: {
      name: "Pasado, presente y futuro",
      description: "Tirada clasica de tres cartas para leer pasado, presente y futuro.",
      question: "Que necesito entender sobre mi proximo capitulo?",
      positions: ["Pasado", "Presente", "Futuro"],
    },
    relationship: {
      name: "Relacion",
      description: "Una tirada para ver el vinculo actual, ambas partes, el desafio y la direccion probable.",
      question: "Cual es la energia real entre nosotros ahora?",
      positions: ["Estado actual", "Tus sentimientos", "Sus sentimientos", "Desafio", "Futuro"],
    },
    their_thoughts: {
      name: "Sus pensamientos y actitud",
      description: "Cinco cartas para impresion, pensamientos, actitud, dudas y posible accion.",
      question: "Cuales son sus sentimientos reales y su siguiente accion probable?",
      positions: ["Impresion", "Pensamientos", "Actitud", "Dudas", "Accion posible"],
    },
    breakup_recovery: {
      name: "Recuperacion de ruptura",
      description: "Cinco cartas para causas de la ruptura, energia pendiente, consejo y siguiente direccion.",
      question: "Mi ex volvera, y que deberia entender antes de actuar?",
      positions: ["Causa", "Tu estado", "Su estado", "Consejo", "Futuro"],
    },
    job_opportunity: {
      name: "Oportunidad laboral",
      description: "Una tirada de carrera para oportunidades, fortalezas, advertencias y el proximo paso profesional.",
      question: "Que deberia entender sobre mi camino profesional ahora?",
      positions: ["Oportunidad", "Tu fortaleza", "Cuidado", "Proximo paso"],
    },
    binary_choice: {
      name: "Decision A/B",
      description: "Dos cartas para comparar la energia y posible resultado de dos opciones.",
      question: "Deberia elegir la opcion A o la opcion B?",
      positions: ["Opcion A", "Opcion B"],
    },
    love_connection: {
      name: "Conexion amorosa",
      description: "Una tirada de amor para energia de citas, rasgos de pareja, timing y consejo.",
      question: "Que deberia saber sobre un nuevo amor entrando en mi vida?",
      positions: ["Energia amorosa", "Rasgos", "Timing", "Consejo"],
    },
    exam_fortune: {
      name: "Estudios y examenes",
      description: "Tirada para preparacion, fortalezas, cuidados y resultado probable.",
      question: "En que deberia enfocarme antes de este examen?",
      positions: ["Estado actual", "Fortaleza", "Cuidado", "Resultado"],
    },
    shopping_decision: {
      name: "Decision de compra",
      description: "Tirada practica para deseo, valor real y consejo antes de comprar.",
      question: "Esta compra realmente vale la pena para mi?",
      positions: ["Deseo", "Valor", "Consejo"],
    },
    interpersonal: {
      name: "Relaciones sociales",
      description: "Tirada para tension actual, tu papel, feedback, problema y reparacion.",
      question: "Que deberia entender sobre esta tension en la relacion?",
      positions: ["Estado actual", "Tu papel", "Feedback", "Problema", "Mejora"],
    },
  },
  "pt-br": {
    single_card: {
      name: "Uma carta",
      description: "Uma leitura rapida de uma carta para ver a mensagem central e o proximo passo.",
      question: "O que eu preciso saber agora?",
      positions: ["Mensagem central"],
    },
    yes_no: {
      name: "Sim ou nao",
      description: "Uma tiragem direta de uma carta para uma pergunta clara de sim ou nao.",
      question: "Devo mandar mensagem primeiro?",
      positions: ["Resposta"],
    },
    three_card: {
      name: "Passado, presente e futuro",
      description: "Tiragem classica de tres cartas para ler passado, presente e futuro.",
      question: "O que eu preciso entender sobre meu proximo capitulo?",
      positions: ["Passado", "Presente", "Futuro"],
    },
    relationship: {
      name: "Relacionamento",
      description: "Uma tiragem para ver o vinculo atual, os dois lados, o desafio e a direcao provavel.",
      question: "Qual e a energia real entre nos agora?",
      positions: ["Estado atual", "Seus sentimentos", "Sentimentos da outra pessoa", "Desafio", "Futuro"],
    },
    their_thoughts: {
      name: "Pensamentos e atitude",
      description: "Cinco cartas para impressao, pensamentos, atitude, duvidas e possivel acao.",
      question: "Quais sao os sentimentos reais e a proxima acao provavel dessa pessoa?",
      positions: ["Impressao", "Pensamentos", "Atitude", "Duvidas", "Acao possivel"],
    },
    breakup_recovery: {
      name: "Recuperacao de termino",
      description: "Cinco cartas para causas do termino, energia pendente, conselho e proxima direcao.",
      question: "Meu ex vai voltar, e o que eu deveria entender antes de agir?",
      positions: ["Causa", "Seu estado", "Estado da outra pessoa", "Conselho", "Futuro"],
    },
    job_opportunity: {
      name: "Oportunidade profissional",
      description: "Uma tiragem de carreira para oportunidades, forcas, cuidados e o proximo passo profissional.",
      question: "O que eu deveria entender sobre meu caminho profissional agora?",
      positions: ["Oportunidade", "Sua forca", "Cuidado", "Proximo passo"],
    },
    binary_choice: {
      name: "Escolha A/B",
      description: "Duas cartas para comparar a energia e possivel resultado de duas opcoes.",
      question: "Devo escolher a opcao A ou a opcao B?",
      positions: ["Opcao A", "Opcao B"],
    },
    love_connection: {
      name: "Conexao amorosa",
      description: "Uma tiragem de amor para energia de encontros, tracos de parceria, timing e conselho.",
      question: "O que devo saber sobre um novo amor entrando na minha vida?",
      positions: ["Energia amorosa", "Tracos", "Timing", "Conselho"],
    },
    exam_fortune: {
      name: "Estudos e provas",
      description: "Tiragem para preparacao, forcas, cuidados e resultado provavel.",
      question: "No que devo focar antes desta prova?",
      positions: ["Estado atual", "Forca", "Cuidado", "Resultado"],
    },
    shopping_decision: {
      name: "Decisao de compra",
      description: "Tiragem pratica para desejo, valor real e conselho antes de comprar.",
      question: "Essa compra realmente vale a pena para mim?",
      positions: ["Desejo", "Valor", "Conselho"],
    },
    interpersonal: {
      name: "Relacoes sociais",
      description: "Tiragem para tensao atual, seu papel, feedback, problema e reparacao.",
      question: "O que eu deveria entender sobre essa tensao na relacao?",
      positions: ["Estado atual", "Seu papel", "Feedback", "Problema", "Melhora"],
    },
  },
}

const copyByLocale = {
  en: {
    locale: "en",
    path: spreadHubPaths.en,
    title: "Free Tarot Spreads",
    description:
      "Choose a free tarot spread for yes or no questions, love, ex reconciliation, career decisions, daily guidance, and practical next steps.",
    headerLinkLabel: "Daily Tarot",
    eyebrow: "Free spread chooser",
    heading: "Free Tarot Spreads",
    intro:
      "Pick the spread that matches your question, then enter the free AI tarot flow with the card count already set.",
    features: [
      { title: "Free first", body: "Start with a spread before paying. Membership is for deep follow-ups and saved history." },
      { title: "Question matched", body: "Each spread is built around the kind of answer people actually need." },
      { title: "Mobile ready", body: "The chooser leads straight into the existing mobile card selection flow." },
    ],
    groups: [
      {
        label: "Fast clarity",
        title: "Quick free tarot spreads",
        body: "Start with one to three cards when the question is clear and you want a practical first answer.",
        spreads: ["single_card", "yes_no", "three_card", "binary_choice"],
      },
      {
        label: "Love and feelings",
        title: "Relationship tarot spreads",
        body: "Use these when you need emotional context, not just a forced yes or no.",
        spreads: ["relationship", "their_thoughts", "breakup_recovery", "love_connection"],
      },
      {
        label: "Work and life",
        title: "Decision tarot spreads",
        body: "For career, exams, purchases, and social situations, turn the reading into one next action.",
        spreads: ["job_opportunity", "exam_fortune", "shopping_decision", "interpersonal"],
      },
    ],
    chooseEyebrow: "Choose by situation",
    chooseTitle: "Which spread should I use?",
    chooseBody:
      "If the question is emotional, choose a relationship spread. If it is practical, choose a decision or career spread. If it is simple, start with one card.",
    positionsLabel: "Positions",
    startLabel: "Start this spread",
    freeBadge: "Free",
    memberBadge: "Member depth",
    freeNote: "Available as a free starter spread.",
    memberNote: "Open a free starter first; the full multi-card layout is reserved for membership depth.",
    freeStarterLabel: "Start free starter",
    boundaryEyebrow: "Free first",
    boundaryTitle: "Start with the useful free version, upgrade only for depth",
    boundaryBody:
      "POPTarot keeps the first tarot experience free. Simple spreads open directly. Advanced spreads can start as a free starter reading, while the full layout belongs to deeper follow-ups, saved history, and membership reports.",
    boundaryItems: [
      { title: "Free starter spreads", body: "Yes/no, three-card, and choice spreads are the fastest way to get a useful first answer." },
      { title: "Advanced spread depth", body: "Relationship, reconciliation, career, study, social, and love-potential layouts are richer member experiences." },
      { title: "No payment before clarity", body: "Use the free flow first; membership should only matter after the first answer proves useful." },
    ],
    cardLabel: (count: number) => `${count} card${count === 1 ? "" : "s"}`,
  },
  es: {
    locale: "es",
    path: spreadHubPaths.es,
    title: "Tiradas de tarot gratis",
    description:
      "Elige una tirada de tarot gratis para preguntas si o no, amor, ex, carrera, decisiones y proximos pasos practicos.",
    headerLinkLabel: "Tarot diario",
    eyebrow: "Selector de tiradas gratis",
    heading: "Tiradas de tarot gratis",
    intro:
      "Elige la tirada que encaja con tu pregunta y entra al flujo gratis de tarot con IA con el numero de cartas ya preparado.",
    features: [
      { title: "Gratis primero", body: "Empieza con una tirada antes de pagar. La membresia es para seguimientos e historial." },
      { title: "Segun la pregunta", body: "Cada tirada esta pensada para el tipo de claridad que realmente necesitas." },
      { title: "Lista para movil", body: "El selector entra directo al flujo movil de eleccion de cartas." },
    ],
    groups: [
      {
        label: "Claridad rapida",
        title: "Tiradas rapidas gratis",
        body: "Empieza con una a tres cartas cuando la pregunta es clara y necesitas una primera respuesta practica.",
        spreads: ["single_card", "yes_no", "three_card", "binary_choice"],
      },
      {
        label: "Amor y sentimientos",
        title: "Tiradas de amor y relacion",
        body: "Usalas cuando necesitas contexto emocional, no solo un si o no forzado.",
        spreads: ["relationship", "their_thoughts", "breakup_recovery", "love_connection"],
      },
      {
        label: "Trabajo y vida",
        title: "Tiradas para decisiones",
        body: "Para carrera, examenes, compras y situaciones sociales, convierte la lectura en una accion siguiente.",
        spreads: ["job_opportunity", "exam_fortune", "shopping_decision", "interpersonal"],
      },
    ],
    chooseEyebrow: "Elige por situacion",
    chooseTitle: "Que tirada de tarot deberia usar?",
    chooseBody:
      "Si la pregunta es emocional, elige una tirada de relacion. Si es practica, usa una de decision o carrera. Si es simple, empieza con una carta.",
    positionsLabel: "Posiciones",
    startLabel: "Empezar esta tirada",
    freeBadge: "Gratis",
    memberBadge: "Profundidad miembro",
    freeNote: "Disponible como tirada inicial gratis.",
    memberNote: "Abre primero una version inicial gratis; la tirada completa de varias cartas queda para profundidad de membresia.",
    freeStarterLabel: "Empezar gratis",
    boundaryEyebrow: "Gratis primero",
    boundaryTitle: "Empieza con una version gratis util y mejora solo si necesitas profundidad",
    boundaryBody:
      "POPTarot mantiene la primera experiencia de tarot gratis. Las tiradas simples se abren directamente. Las avanzadas pueden empezar como lectura inicial gratis; el diseno completo queda para seguimientos, historial y reportes de membresia.",
    boundaryItems: [
      { title: "Tiradas iniciales gratis", body: "Si/no, tres cartas y elecciones son la forma mas rapida de obtener una primera respuesta util." },
      { title: "Profundidad avanzada", body: "Relacion, reconciliacion, carrera, estudios, social y potencial amoroso son experiencias mas ricas para miembros." },
      { title: "Sin pago antes de claridad", body: "Usa primero el flujo gratis; la membresia importa solo despues de que la primera respuesta sea util." },
    ],
    cardLabel: (count: number) => `${count} carta${count === 1 ? "" : "s"}`,
  },
  "pt-br": {
    locale: "pt-br",
    path: spreadHubPaths["pt-br"],
    title: "Tiragens de tarot gratis",
    description:
      "Escolha uma tiragem de tarot gratis para perguntas sim ou nao, amor, ex, carreira, decisoes e proximos passos praticos.",
    headerLinkLabel: "Tarot diario",
    eyebrow: "Seletor de tiragens gratis",
    heading: "Tiragens de tarot gratis",
    intro:
      "Escolha a tiragem que combina com sua pergunta e entre no fluxo gratis de tarot com IA com o numero de cartas ja preparado.",
    features: [
      { title: "Gratis primeiro", body: "Comece com uma tiragem antes de pagar. A assinatura e para aprofundamentos e historico." },
      { title: "Combinada a pergunta", body: "Cada tiragem foi pensada para o tipo de clareza que voce realmente precisa." },
      { title: "Pronta para mobile", body: "O seletor entra direto no fluxo mobile de escolha de cartas." },
    ],
    groups: [
      {
        label: "Clareza rapida",
        title: "Tiragens rapidas gratis",
        body: "Comece com uma a tres cartas quando a pergunta e clara e voce quer uma primeira resposta pratica.",
        spreads: ["single_card", "yes_no", "three_card", "binary_choice"],
      },
      {
        label: "Amor e sentimentos",
        title: "Tiragens de amor e relacionamento",
        body: "Use quando precisa de contexto emocional, nao apenas um sim ou nao forcado.",
        spreads: ["relationship", "their_thoughts", "breakup_recovery", "love_connection"],
      },
      {
        label: "Trabalho e vida",
        title: "Tiragens para decisoes",
        body: "Para carreira, provas, compras e situacoes sociais, transforme a leitura em uma proxima acao.",
        spreads: ["job_opportunity", "exam_fortune", "shopping_decision", "interpersonal"],
      },
    ],
    chooseEyebrow: "Escolha por situacao",
    chooseTitle: "Qual tiragem de tarot devo usar?",
    chooseBody:
      "Se a pergunta e emocional, escolha uma tiragem de relacionamento. Se e pratica, use uma de decisao ou carreira. Se e simples, comece com uma carta.",
    positionsLabel: "Posicoes",
    startLabel: "Comecar esta tiragem",
    freeBadge: "Gratis",
    memberBadge: "Profundidade membro",
    freeNote: "Disponivel como tiragem inicial gratis.",
    memberNote: "Abra primeiro uma versao inicial gratis; o layout completo de varias cartas fica para profundidade de assinatura.",
    freeStarterLabel: "Comecar gratis",
    boundaryEyebrow: "Gratis primeiro",
    boundaryTitle: "Comece com a versao gratis util e assine so se precisar aprofundar",
    boundaryBody:
      "POPTarot mantem a primeira experiencia de tarot gratis. Tiragens simples abrem direto. Tiragens avancadas podem comecar como leitura inicial gratis; o layout completo fica para aprofundamentos, historico e relatorios de assinatura.",
    boundaryItems: [
      { title: "Tiragens iniciais gratis", body: "Sim/nao, tres cartas e escolhas sao a forma mais rapida de receber uma primeira resposta util." },
      { title: "Profundidade avancada", body: "Relacionamento, reconciliacao, carreira, estudos, social e potencial amoroso sao experiencias mais ricas para membros." },
      { title: "Sem pagamento antes da clareza", body: "Use primeiro o fluxo gratis; assinatura so deve importar depois que a primeira resposta for util." },
    ],
    cardLabel: (count: number) => `${count} carta${count === 1 ? "" : "s"}`,
  },
} satisfies Record<TarotSpreadHubLocale, SpreadHubCopy>

function getSpreadHubCopy(locale: TarotSpreadHubLocale) {
  return copyByLocale[locale]
}

function getSpreadCopy(type: SpreadType, locale: TarotSpreadHubLocale) {
  const spread = SPREAD_CONFIGS[type]
  const localized = localizedSpreads[locale][type]
  return {
    name: localized?.name || spread.nameEn,
    description: localized?.description || spread.descriptionEn || spread.description,
    question:
      localized?.question ||
      {
        single_card: "What do I need to know right now?",
        yes_no: "Should I text first?",
        daily_fashion: "What energy should guide my style today?",
        reconciliation_starter: "What remains between us, and what is the healthiest next step?",
        love_starter: "What is the real love energy here, and what should I do next?",
        career_starter: "What pressure, opportunity, and next move should I notice in my career?",
        decision_starter: "What is the core choice, hidden cost, and next action?",
        breakup_recovery: "Will my ex come back, and what should I understand before I act?",
        exam_fortune: "What should I focus on before this exam?",
        shopping_decision: "Is this purchase actually worth it for me?",
        love_connection: "What should I know about new love entering my life?",
        relationship: "What is the real energy between us right now?",
        their_thoughts: "What are their real feelings and likely next action?",
        job_opportunity: "What should I understand about my career path right now?",
        binary_choice: "Should I choose option A or option B?",
        interpersonal: "What should I understand about this relationship tension?",
        triple_choice: "Which direction is most aligned for me now?",
        three_card: "What do I need to understand about the next chapter?",
      }[type],
    positions: localized?.positions || spread.positions.map((position) => position.nameEn),
  }
}

function spreadHref(type: SpreadType, locale: TarotSpreadHubLocale) {
  const params = new URLSearchParams({
    q: getSpreadCopy(type, locale).question,
    auto: "1",
    spread: type,
    source: locale === "en" ? "tarot-spreads" : `${locale}-tarot-spreads`,
    lang: locale,
  })
  return `/input?${params.toString()}`
}

function buildStructuredData(copy: SpreadHubCopy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      editorialTeamJsonLd(),
      websiteJsonLd(),
      {
        "@type": "CollectionPage",
        "@id": `${appUrl}${copy.path}#webpage`,
        name: copy.title,
        description: copy.description,
        url: `${appUrl}${copy.path}`,
        dateModified: trustLastReviewed,
        isAccessibleForFree: true,
        inLanguage: copy.locale === "pt-br" ? "pt-BR" : copy.locale,
        isPartOf: {
          "@id": `${appUrl}/#website`,
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
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#spread-list`,
        name: `${copy.title} on POPTarot`,
        description: copy.boundaryBody,
        itemListElement: spreadOrder.map((type, index) => {
          const spread = SPREAD_CONFIGS[type]
          const spreadCopy = getSpreadCopy(type, copy.locale)
          const isAdvanced = isAdvancedSpreadType(type)
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "HowTo",
              name: spreadCopy.name,
              description: spreadCopy.description,
              isAccessibleForFree: !isAdvanced,
              totalTime: "PT3M",
              supply: copy.cardLabel(spread.cardCount),
              url: `${appUrl}${spreadHref(type, copy.locale)}`,
              potentialAction: {
                "@type": "InteractAction",
                name: isAdvanced ? copy.freeStarterLabel : copy.startLabel,
                target: `${appUrl}${spreadHref(type, copy.locale)}`,
              },
              step: spreadCopy.positions.map((position, positionIndex) => ({
                "@type": "HowToStep",
                position: positionIndex + 1,
                name: position,
                text: position,
              })),
            },
          }
        }),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#free-starter-spread-boundary`,
        name: copy.boundaryTitle,
        description: copy.boundaryBody,
        itemListElement: copy.boundaryItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}${copy.path}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteName,
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.title,
            item: `${appUrl}${copy.path}`,
          },
        ],
      },
    ],
  }
}

export function getTarotSpreadHubMetadata(locale: TarotSpreadHubLocale): Metadata {
  const copy = getSpreadHubCopy(locale)

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${appUrl}${copy.path}`,
      languages: {
        en: spreadHubPaths.en,
        es: spreadHubPaths.es,
        "pt-br": spreadHubPaths["pt-br"],
        "x-default": spreadHubPaths.en,
      },
    },
    openGraph: {
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      url: `${appUrl}${copy.path}`,
      siteName,
      type: "website",
      locale: localeOpenGraph[locale],
    },
  }
}

export function TarotSpreadsPageView({ locale }: { locale: TarotSpreadHubLocale }) {
  const copy = getSpreadHubCopy(locale)
  const structuredData = buildStructuredData(copy)

  return (
    <main className="min-h-screen bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <header className="border-b border-white/10 bg-[#0d0618]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-white/62 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            POP TAROT
          </Link>
          <Link href="/daily-tarot" className="inline-flex min-h-10 items-center text-sm text-[#c9c0ff]/85 transition hover:text-white">
            {copy.headerLinkLabel}
          </Link>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.36),transparent_38%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/78">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">
              {copy.heading}
            </h1>
            <p className="mt-6 text-base leading-8 text-white/66 sm:text-lg">{copy.intro}</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {copy.features.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h2 className="text-sm font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
          <section
            data-spread-access-boundary
            className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.045] p-5 sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/78">{copy.boundaryEyebrow}</p>
            <div className="mt-3 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2 className="font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.boundaryTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{copy.boundaryBody}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {copy.boundaryItems.map((item) => (
                  <article key={item.title} className="min-w-0 rounded-lg border border-white/10 bg-black/[0.16] p-4">
                    <h3 className="text-sm font-medium leading-6 text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-white/54">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {spreadOrder.map((type) => {
            const spread = SPREAD_CONFIGS[type]
            const spreadCopy = getSpreadCopy(type, copy.locale)
            const isAdvanced = isAdvancedSpreadType(type)
            return (
              <article
                key={type}
                data-spread-card
                data-spread-access={isAdvanced ? "member-depth" : "free"}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#c9c0ff]/75">
                      {copy.cardLabel(spread.cardCount)}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-white">{spreadCopy.name}</h2>
                  </div>
                  <span className="rounded-lg border border-[#bfb6ff]/20 bg-[#bfb6ff]/[0.07] px-3 py-1.5 text-xs text-[#eeeaff]">
                    {spread.icon}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/62">{spreadCopy.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    data-spread-access-badge
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      isAdvanced
                        ? "border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.06] text-[#d9d2ff]"
                        : "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100/86"
                    }`}
                  >
                    {isAdvanced ? copy.memberBadge : copy.freeBadge}
                  </span>
                  <span className="min-w-0 text-xs leading-5 text-white/46">
                    {isAdvanced ? copy.memberNote : copy.freeNote}
                  </span>
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/36">{copy.positionsLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {spreadCopy.positions.map((position) => (
                      <span
                        key={position}
                        className="rounded-full border border-white/10 bg-black/18 px-3 py-1.5 text-xs text-white/58"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={spreadHref(type, copy.locale)}
                  data-spread-free-start
                  data-spread-free-start-mode={isAdvanced ? "starter" : "direct"}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-4 py-2 text-sm font-medium text-[#120c22] shadow-[0_18px_45px_rgba(143,128,238,0.2)] transition hover:brightness-110 sm:w-auto"
                >
                  {isAdvanced ? copy.freeStarterLabel : copy.startLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0618]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.chooseEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl text-white">{copy.chooseTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.chooseBody}</p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {copy.groups.map((group) => (
              <article key={group.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#c9c0ff]/75">{group.label}</p>
                <h3 className="mt-3 font-serif text-2xl text-white">{group.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{group.body}</p>
                <div className="mt-4 space-y-2">
                  {group.spreads.map((type) => {
                    const isAdvanced = isAdvancedSpreadType(type)

                    return (
                      <Link
                        key={type}
                        href={spreadHref(type, copy.locale)}
                        data-spread-group-start
                        data-spread-free-start-mode={isAdvanced ? "starter" : "direct"}
                        className="flex min-h-10 items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/66 transition hover:border-[#bfb6ff]/35 hover:bg-white/[0.04] hover:text-white"
                      >
                        <span className="min-w-0 flex-1 break-words">{getSpreadCopy(type, copy.locale).name}</span>
                        <span className="shrink-0 text-xs text-[#c9c0ff]/68">
                          {isAdvanced ? copy.freeStarterLabel : copy.freeBadge}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
