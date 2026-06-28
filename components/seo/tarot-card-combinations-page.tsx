import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, CalendarDays, Search, Shuffle } from "lucide-react"
import { localeOpenGraph, type SeoLocale } from "@/lib/locales"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, siteName, websiteJsonLd } from "@/lib/site"
import { getSeoPage } from "@/lib/seo-pages"
import { TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"
import { getCardBySlug, getCardSlug, getTarotCardSeoPage, type TarotCardSeoPage } from "@/lib/tarot-card-seo"
import { trustLastReviewed } from "@/lib/trust-signals"

export type TarotCardCombinationHubLocale = Extract<SeoLocale, "en" | "es" | "pt-br">

type CombinationEntry = {
  source: TarotCard
  sourcePage: TarotCardSeoPage
  sourceName: string
  heading: string
  body: string
  cardHref: string
  pairedCard?: TarotCard
  pairedPage?: TarotCardSeoPage
  pairedName?: string
  pairedHref?: string
}

type CombinationContextGuide = {
  label: string
  title: string
  body: string
  slug: string
}

type CombinationHubCopy = {
  locale: TarotCardCombinationHubLocale
  path: string
  title: string
  description: string
  backLabel: string
  eyebrow: string
  heading: string
  intro: string
  heroPrimary: string
  heroDaily: string
  quickMethodLabel: string
  popularEyebrow: string
  popularTitle: string
  popularBody: string
  browseAllCards: string
  entryPatternLabel: string
  entryPairLabel: string
  readMeaning: string
  tryFreeSpread: string
  contextEyebrow: string
  contextTitle: string
  contextBody: string
  contextOpen: string
  methodEyebrow: string
  methodTitle: string
  methodBody: string
  stepLabel: string
  dailyEyebrow: string
  dailyTitle: string
  dailyBody: string
  dailyPrimary: string
  dailySecondary: string
  genericQuestion: string
  pairQuestion: (sourceName: string, pairedName: string) => string
  methodSections: Array<{ title: string; body: string }>
  contextGuides: CombinationContextGuide[]
  faqItems: Array<{ question: string; answer: string }>
}

export const tarotCardCombinationHubPaths = {
  en: "/tarot-card-combinations",
  es: "/es/combinaciones-cartas-tarot",
  "pt-br": "/pt-br/combinacoes-cartas-tarot",
} satisfies Record<TarotCardCombinationHubLocale, string>

const hubAlternates = {
  en: tarotCardCombinationHubPaths.en,
  es: tarotCardCombinationHubPaths.es,
  "pt-br": tarotCardCombinationHubPaths["pt-br"],
  "x-default": tarotCardCombinationHubPaths.en,
}

const featuredCardNames = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
  "Ace of Cups",
  "Two of Cups",
  "Ace of Pentacles",
]

const copyByLocale = {
  en: {
    locale: "en",
    path: tarotCardCombinationHubPaths.en,
    title: "Tarot Card Combinations",
    description:
      "Learn common tarot card combinations for love, career, money, yes-or-no questions, daily tarot, and free AI tarot readings.",
    backLabel: "Tarot Card Meanings",
    eyebrow: "Card meaning guide",
    heading: "Tarot Card Combinations",
    intro:
      "Learn how two tarot cards change each other, then open a free AI tarot spread when you want the combination read inside your real question.",
    heroPrimary: "Start free combination reading",
    heroDaily: "Use in Daily Tarot",
    quickMethodLabel: "Quick method",
    popularEyebrow: "Popular paths",
    popularTitle: "Common Tarot Card Combination Paths",
    popularBody:
      "These pairs link back to the deeper single-card pages where upright, reversed, love, career, money, yes-or-no, advice, and FAQ sections already live.",
    browseAllCards: "Browse all 78 cards",
    entryPatternLabel: "pattern",
    entryPairLabel: "pair",
    readMeaning: "Read meaning",
    tryFreeSpread: "Try free spread",
    contextEyebrow: "Reading contexts",
    contextTitle: "Read the same pair through the right context",
    contextBody:
      "A tarot combination is strongest when it answers the actual situation. Use these context hubs to avoid turning every pair into the same generic interpretation.",
    contextOpen: "Open context guide",
    methodEyebrow: "How to read pairs",
    methodTitle: "A practical combination method",
    methodBody:
      "Use this before you draw more cards. It keeps a reading focused, especially on mobile when a user wants a clear answer without scanning a huge reference table.",
    stepLabel: "Step",
    dailyEyebrow: "Daily return loop",
    dailyTitle: "Use combinations after your daily card",
    dailyBody:
      "Draw one daily card, write the note, and compare it with the cards that keep appearing in your readings. That gives users a natural reason to come back without forcing a membership pitch.",
    dailyPrimary: "Open Daily Tarot",
    dailySecondary: "Find a question",
    genericQuestion: "What do these tarot cards mean together for my situation?",
    pairQuestion: (sourceName, pairedName) => `What does ${sourceName} with ${pairedName} mean for my situation?`,
    methodSections: [
      {
        title: "Start with the question",
        body: "A pair means something different in love, career, money, and daily guidance. Name the question first, then decide which card is the main signal and which card modifies it.",
      },
      {
        title: "Compare tension and support",
        body: "Some pairs reinforce each other, while others create useful tension. The Lovers with The Tower is not the same message as The Lovers with The Sun.",
      },
      {
        title: "Check upright and reversed tone",
        body: "A reversed card can show delay, blocked expression, avoidance, or an internal version of the same theme. Read the direction before forcing a yes or no answer.",
      },
      {
        title: "Turn the pair into one next step",
        body: "A good combination reading should end with a small action: ask a better question, wait, clarify, apologize, prepare, choose, or stop feeding the pattern.",
      },
    ],
    contextGuides: [
      {
        label: "Love",
        title: "Love tarot combinations",
        body: "Look for attraction, values, emotional safety, timing, and whether the cards show mutual effort or a repeating pattern.",
        slug: "love-tarot-card-meanings",
      },
      {
        label: "Career",
        title: "Career tarot combinations",
        body: "Read the pair through momentum, risk, structure, pressure, skill, authority, and the next practical decision.",
        slug: "career-tarot-card-meanings",
      },
      {
        label: "Money",
        title: "Money tarot combinations",
        body: "Use combinations to separate impulse from stability, short-term opportunity from long-term responsibility, and scarcity from planning.",
        slug: "money-tarot-card-meanings",
      },
      {
        label: "Yes or no",
        title: "Yes-or-no tarot combinations",
        body: "Pairs rarely give a flat answer. They show whether the answer is yes, no, not yet, or yes only after one condition changes.",
        slug: "yes-or-no-tarot-card-meanings",
      },
    ],
    faqItems: [
      {
        question: "What is a tarot card combination?",
        answer:
          "A tarot card combination is the shared message that appears when two or more cards are read together. The first card often names the core theme, while the second card shows pressure, context, support, or consequence.",
      },
      {
        question: "Should I memorize every tarot combination?",
        answer:
          "No. Start with card keywords, question context, card positions, and the relationship between the cards. Memorized meanings can help, but the reading should still respond to the actual question.",
      },
      {
        question: "Can tarot combinations answer love and career questions?",
        answer:
          "Yes. The same pair can shift meaning by context. In love it may describe attraction or boundaries; in career it may describe timing, leadership, skill, risk, or a practical decision.",
      },
      {
        question: "Can I use POPTarot to read a combination for free?",
        answer:
          "Yes. Start a free AI tarot reading, ask one real question, draw cards, and use the card meaning pages to compare upright, reversed, love, career, money, yes-or-no, advice, and combinations.",
      },
    ],
  },
  es: {
    locale: "es",
    path: tarotCardCombinationHubPaths.es,
    title: "Combinaciones de Cartas de Tarot",
    description:
      "Aprende combinaciones comunes de cartas de tarot para amor, carrera, dinero, preguntas de si o no, tarot diario y lecturas gratis con IA.",
    backLabel: "Significados de cartas",
    eyebrow: "Guia de combinaciones",
    heading: "Combinaciones de Cartas de Tarot",
    intro:
      "Aprende como dos cartas cambian entre si, luego abre una tirada gratis con IA cuando quieras leer la combinacion dentro de tu pregunta real.",
    heroPrimary: "Empezar lectura gratis",
    heroDaily: "Usar en Tarot Diario",
    quickMethodLabel: "Metodo rapido",
    popularEyebrow: "Rutas populares",
    popularTitle: "Rutas comunes de combinaciones de tarot",
    popularBody:
      "Estas parejas enlazan con paginas de cada carta donde ya existen normal, invertida, amor, carrera, dinero, si o no, consejo y FAQ.",
    browseAllCards: "Ver las 78 cartas",
    entryPatternLabel: "patron",
    entryPairLabel: "pareja",
    readMeaning: "Leer significado",
    tryFreeSpread: "Probar tirada gratis",
    contextEyebrow: "Contextos de lectura",
    contextTitle: "Lee la misma pareja en el contexto correcto",
    contextBody:
      "Una combinacion de tarot funciona mejor cuando responde a la situacion real. Usa estas guias para evitar que todas las parejas suenen genericas.",
    contextOpen: "Abrir guia",
    methodEyebrow: "Como leer parejas",
    methodTitle: "Un metodo practico de combinacion",
    methodBody:
      "Usa esto antes de sacar mas cartas. Mantiene la lectura enfocada, sobre todo en movil cuando alguien quiere claridad sin revisar una tabla enorme.",
    stepLabel: "Paso",
    dailyEyebrow: "Bucle de regreso diario",
    dailyTitle: "Usa combinaciones despues de tu carta diaria",
    dailyBody:
      "Saca una carta diaria, escribe una nota y comparala con las cartas que se repiten en tus lecturas. Eso crea una razon natural para volver sin empujar membresia.",
    dailyPrimary: "Abrir Tarot Diario",
    dailySecondary: "Encontrar pregunta",
    genericQuestion: "Que significan estas cartas de tarot juntas para mi situacion?",
    pairQuestion: (sourceName, pairedName) => `Que significa ${sourceName} con ${pairedName} para mi situacion?`,
    methodSections: [
      {
        title: "Empieza con la pregunta",
        body: "Una pareja cambia segun amor, carrera, dinero o guia diaria. Nombra la pregunta primero, luego decide que carta es la senal principal y cual la modifica.",
      },
      {
        title: "Compara tension y apoyo",
        body: "Algunas parejas se refuerzan y otras crean tension util. Los Enamorados con La Torre no dicen lo mismo que Los Enamorados con El Sol.",
      },
      {
        title: "Revisa tono normal e invertido",
        body: "Una carta invertida puede mostrar demora, bloqueo, evitacion o una version interna del mismo tema. Lee la direccion antes de forzar si o no.",
      },
      {
        title: "Convierte la pareja en un paso",
        body: "Una buena lectura de combinacion termina con una accion pequena: preguntar mejor, esperar, aclarar, disculparte, prepararte, elegir o cortar un patron.",
      },
    ],
    contextGuides: [
      {
        label: "Amor",
        title: "Combinaciones de tarot amor",
        body: "Busca atraccion, valores, seguridad emocional, timing y si las cartas muestran esfuerzo mutuo o un patron repetido.",
        slug: "love-tarot-card-meanings",
      },
      {
        label: "Carrera",
        title: "Combinaciones de tarot carrera",
        body: "Lee la pareja por impulso, riesgo, estructura, presion, habilidad, autoridad y la siguiente decision practica.",
        slug: "career-tarot-card-meanings",
      },
      {
        label: "Dinero",
        title: "Combinaciones de tarot dinero",
        body: "Usa combinaciones para separar impulso de estabilidad, oportunidad corta de responsabilidad larga y escasez de planificacion.",
        slug: "money-tarot-card-meanings",
      },
      {
        label: "Si o no",
        title: "Combinaciones de tarot si o no",
        body: "Las parejas rara vez dan una palabra plana. Muestran si es si, no, todavia no, o si solo cuando cambia una condicion.",
        slug: "yes-or-no-tarot-card-meanings",
      },
    ],
    faqItems: [
      {
        question: "Que es una combinacion de cartas de tarot?",
        answer:
          "Es el mensaje compartido que aparece cuando dos o mas cartas se leen juntas. Una carta suele nombrar el tema central y la otra muestra presion, contexto, apoyo o consecuencia.",
      },
      {
        question: "Debo memorizar todas las combinaciones?",
        answer:
          "No. Empieza con palabras clave, contexto de la pregunta, posiciones y relacion entre cartas. Memorizar ayuda, pero la lectura debe responder a la pregunta real.",
      },
      {
        question: "Sirven las combinaciones para amor y carrera?",
        answer:
          "Si. La misma pareja cambia por contexto. En amor puede hablar de atraccion o limites; en carrera puede hablar de timing, liderazgo, habilidad, riesgo o decision practica.",
      },
      {
        question: "Puedo leer una combinacion gratis en POPTarot?",
        answer:
          "Si. Empieza una lectura gratis con IA, haz una pregunta real, saca cartas y usa las paginas de significados para comparar normal, invertida, amor, carrera, dinero, si o no, consejo y combinaciones.",
      },
    ],
  },
  "pt-br": {
    locale: "pt-br",
    path: tarotCardCombinationHubPaths["pt-br"],
    title: "Combinacoes de Cartas de Tarot",
    description:
      "Aprenda combinacoes comuns de cartas de tarot para amor, carreira, dinheiro, perguntas de sim ou nao, tarot diario e leituras gratis com IA.",
    backLabel: "Significados das cartas",
    eyebrow: "Guia de combinacoes",
    heading: "Combinacoes de Cartas de Tarot",
    intro:
      "Aprenda como duas cartas mudam uma a outra, depois abra uma tiragem gratis com IA quando quiser ler a combinacao dentro da sua pergunta real.",
    heroPrimary: "Comecar leitura gratis",
    heroDaily: "Usar no Tarot Diario",
    quickMethodLabel: "Metodo rapido",
    popularEyebrow: "Caminhos populares",
    popularTitle: "Caminhos comuns de combinacoes de tarot",
    popularBody:
      "Esses pares apontam para paginas de cada carta onde ja existem normal, invertida, amor, carreira, dinheiro, sim ou nao, conselho e FAQ.",
    browseAllCards: "Ver as 78 cartas",
    entryPatternLabel: "padrao",
    entryPairLabel: "par",
    readMeaning: "Ler significado",
    tryFreeSpread: "Testar tiragem gratis",
    contextEyebrow: "Contextos de leitura",
    contextTitle: "Leia o mesmo par no contexto certo",
    contextBody:
      "Uma combinacao de tarot fica mais forte quando responde a situacao real. Use estes guias para evitar que todo par vire uma interpretacao generica.",
    contextOpen: "Abrir guia",
    methodEyebrow: "Como ler pares",
    methodTitle: "Um metodo pratico de combinacao",
    methodBody:
      "Use isso antes de tirar mais cartas. Mantem a leitura focada, principalmente no celular quando a pessoa quer clareza sem varrer uma tabela enorme.",
    stepLabel: "Passo",
    dailyEyebrow: "Loop de retorno diario",
    dailyTitle: "Use combinacoes depois da sua carta diaria",
    dailyBody:
      "Tire uma carta diaria, escreva uma nota e compare com as cartas que continuam aparecendo nas suas leituras. Isso cria um motivo natural para voltar sem forcar assinatura.",
    dailyPrimary: "Abrir Tarot Diario",
    dailySecondary: "Encontrar pergunta",
    genericQuestion: "O que essas cartas de tarot significam juntas para a minha situacao?",
    pairQuestion: (sourceName, pairedName) => `O que ${sourceName} com ${pairedName} significa para a minha situacao?`,
    methodSections: [
      {
        title: "Comece pela pergunta",
        body: "Um par muda conforme amor, carreira, dinheiro ou orientacao diaria. Nomeie a pergunta primeiro, depois decida qual carta e a mensagem central e qual modifica.",
      },
      {
        title: "Compare tensao e apoio",
        body: "Alguns pares se reforcam e outros criam uma tensao util. Os Enamorados com A Torre nao dizem o mesmo que Os Enamorados com O Sol.",
      },
      {
        title: "Revise tom normal e invertido",
        body: "Uma carta invertida pode mostrar atraso, bloqueio, evitacao ou uma versao interna do mesmo tema. Leia a direcao antes de forcar sim ou nao.",
      },
      {
        title: "Transforme o par em um passo",
        body: "Uma boa leitura de combinacao termina com uma acao pequena: perguntar melhor, esperar, esclarecer, pedir desculpas, se preparar, escolher ou parar de alimentar o padrao.",
      },
    ],
    contextGuides: [
      {
        label: "Amor",
        title: "Combinacoes de tarot amor",
        body: "Procure atracao, valores, seguranca emocional, timing e se as cartas mostram esforco mutuo ou um padrao repetido.",
        slug: "love-tarot-card-meanings",
      },
      {
        label: "Carreira",
        title: "Combinacoes de tarot carreira",
        body: "Leia o par por impulso, risco, estrutura, pressao, habilidade, autoridade e a proxima decisao pratica.",
        slug: "career-tarot-card-meanings",
      },
      {
        label: "Dinheiro",
        title: "Combinacoes de tarot dinheiro",
        body: "Use combinacoes para separar impulso de estabilidade, oportunidade curta de responsabilidade longa e escassez de planejamento.",
        slug: "money-tarot-card-meanings",
      },
      {
        label: "Sim ou nao",
        title: "Combinacoes de tarot sim ou nao",
        body: "Pares raramente dao uma palavra plana. Eles mostram se e sim, nao, ainda nao, ou sim apenas depois que uma condicao muda.",
        slug: "yes-or-no-tarot-card-meanings",
      },
    ],
    faqItems: [
      {
        question: "O que e uma combinacao de cartas de tarot?",
        answer:
          "E a mensagem compartilhada que aparece quando duas ou mais cartas sao lidas juntas. Uma carta costuma nomear o tema central e a outra mostra pressao, contexto, apoio ou consequencia.",
      },
      {
        question: "Preciso memorizar todas as combinacoes?",
        answer:
          "Nao. Comece com palavras-chave, contexto da pergunta, posicoes e relacao entre cartas. Memorizacao ajuda, mas a leitura precisa responder a pergunta real.",
      },
      {
        question: "Combinacoes servem para amor e carreira?",
        answer:
          "Sim. O mesmo par muda pelo contexto. No amor pode falar de atracao ou limites; na carreira pode falar de timing, lideranca, habilidade, risco ou decisao pratica.",
      },
      {
        question: "Posso ler uma combinacao gratis no POPTarot?",
        answer:
          "Sim. Comece uma leitura gratis com IA, faca uma pergunta real, tire cartas e use as paginas de significados para comparar normal, invertida, amor, carreira, dinheiro, sim ou nao, conselho e combinacoes.",
      },
    ],
  },
} satisfies Record<TarotCardCombinationHubLocale, CombinationHubCopy>

function languageCode(locale: TarotCardCombinationHubLocale) {
  return locale === "pt-br" ? "pt-BR" : locale
}

export function getTarotCardCombinationHubPath(locale: TarotCardCombinationHubLocale) {
  return tarotCardCombinationHubPaths[locale]
}

function getCombinationHubCopy(locale: TarotCardCombinationHubLocale) {
  return copyByLocale[locale]
}

function cardDisplayName(page: TarotCardSeoPage, locale: TarotCardCombinationHubLocale) {
  const suffixes = {
    en: " Tarot Meaning",
    es: " significado en tarot",
    "pt-br": " significado no tarot",
  } satisfies Record<TarotCardCombinationHubLocale, string>
  const suffix = suffixes[locale]
  return page.title.endsWith(suffix) ? page.title.slice(0, -suffix.length) : page.card.nameEn
}

function cardMeaningPath(card: TarotCard, locale: TarotCardCombinationHubLocale) {
  return getTarotCardSeoPage(card, locale).path
}

function localizedSeoHref(slug: string, locale: TarotCardCombinationHubLocale) {
  return getSeoPage(slug, locale)?.path || getSeoPage(slug, "en")?.path || `/${slug}`
}

function buildCombinationEntries(locale: TarotCardCombinationHubLocale) {
  return featuredCardNames
    .map((name) => TAROT_CARDS.find((card) => card.nameEn === name))
    .filter((card): card is TarotCard => Boolean(card))
    .flatMap((source) => {
      const sourcePage = getTarotCardSeoPage(source, locale)
      const sourceName = cardDisplayName(sourcePage, locale)

      return sourcePage.combinations.map((item) => {
        const pairedCard = item.hrefSlug ? getCardBySlug(item.hrefSlug) : undefined
        const pairedPage = pairedCard ? getTarotCardSeoPage(pairedCard, locale) : undefined
        return {
          source,
          sourcePage,
          sourceName,
          heading: item.heading,
          body: item.body,
          cardHref: `${sourcePage.path}#combinations`,
          pairedCard,
          pairedPage,
          pairedName: pairedPage ? cardDisplayName(pairedPage, locale) : undefined,
          pairedHref: pairedCard ? `${cardMeaningPath(pairedCard, locale)}#combinations` : undefined,
        }
      })
    })
}

function freeReadingHref(copy: CombinationHubCopy, entry?: CombinationEntry) {
  const question =
    entry?.pairedName && entry.sourceName
      ? copy.pairQuestion(entry.sourceName, entry.pairedName)
      : copy.genericQuestion
  const campaign = entry ? `${getCardSlug(entry.source)}_combination` : "tarot_card_combinations"
  const params = new URLSearchParams({
    q: question,
    auto: "1",
    source: "card_combinations",
    lang: copy.locale,
    spread: "three_card",
    utm_source: "seo",
    utm_medium: "card_combinations",
    utm_campaign: campaign,
  })

  return `/input?${params.toString()}`
}

function buildStructuredData(copy: CombinationHubCopy, previewEntries: CombinationEntry[]) {
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
        isAccessibleForFree: true,
        dateModified: trustLastReviewed,
        inLanguage: languageCode(copy.locale),
        about: ["tarot card combinations", "tarot card meanings", "free AI tarot reading"],
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
        },
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        mainEntity: {
          "@id": `${appUrl}${copy.path}#popular-combinations`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#popular-combinations`,
        name: copy.popularTitle,
        numberOfItems: previewEntries.length,
        itemListElement: previewEntries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.heading,
          description: entry.body,
          url: `${appUrl}${entry.cardHref}`,
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${appUrl}${copy.path}#how-to-read-card-combinations`,
        name: copy.methodTitle,
        description: copy.methodBody,
        step: copy.methodSections.map((section, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: section.title,
          text: section.body,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}${copy.path}#faq`,
        mainEntity: copy.faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
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

export function getTarotCardCombinationHubMetadata(locale: TarotCardCombinationHubLocale): Metadata {
  const copy = getCombinationHubCopy(locale)

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${appUrl}${copy.path}`,
      languages: hubAlternates,
    },
    openGraph: {
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      url: `${appUrl}${copy.path}`,
      siteName,
      type: "website",
      locale: localeOpenGraph[locale],
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} ${copy.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      images: ["/og-image.jpg"],
    },
  }
}

export function TarotCardCombinationsPageView({ locale }: { locale: TarotCardCombinationHubLocale }) {
  const copy = getCombinationHubCopy(locale)
  const combinationEntries = buildCombinationEntries(locale)
  const previewEntries = combinationEntries.slice(0, 24)
  const heroEntry = previewEntries[0]
  const structuredData = buildStructuredData(copy, previewEntries)

  return (
    <main data-card-combinations-hub className="min-h-screen bg-[#0d0618] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto w-[min(92vw,1120px)] pb-14 pt-10 sm:pt-16 md:pb-20">
        <nav className="mb-8 text-xs text-white/42">
          <Link
            href={localizedSeoHref("tarot-card-meanings", copy.locale)}
            className="inline-flex min-h-10 items-center gap-2 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {copy.backLabel}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[#c9c0ff]/72">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {copy.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">{copy.intro}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                data-card-combination-start-free
                href={freeReadingHref(copy, heroEntry)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f7f4ff_0%,#c9c0ff_48%,#8f80ee_100%)] px-5 text-sm font-semibold text-[#120c22] shadow-[0_18px_46px_rgba(143,128,238,0.28)] transition hover:brightness-110"
              >
                {copy.heroPrimary}
                <Shuffle className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/daily-tarot?utm_source=card_combinations&utm_medium=hero&utm_campaign=daily_return"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-5 text-sm font-medium text-white/72 transition hover:border-[#c9c0ff]/42 hover:text-white"
              >
                {copy.heroDaily}
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e7ddff]/58">{copy.quickMethodLabel}</p>
            <div className="mt-4 grid gap-3">
              {copy.methodSections.slice(0, 3).map((section, index) => (
                <div key={section.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c9c0ff]/12 text-xs text-[#f0ecff]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-medium text-white">{section.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-white/56">{section.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#150b25] py-12 sm:py-16">
        <div className="mx-auto w-[min(92vw,1120px)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.26em] text-[#9fd8d0]/76">{copy.popularEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">{copy.popularTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">{copy.popularBody}</p>
            </div>
            <Link
              href={localizedSeoHref("tarot-card-meanings", copy.locale)}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/12 px-4 text-sm text-white/72 transition hover:border-[#c9c0ff]/40 hover:text-white"
            >
              {copy.browseAllCards}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {previewEntries.map((entry) => (
              <article
                key={`${entry.source.id}-${entry.heading}`}
                className="min-w-0 rounded-lg border border-white/10 bg-[#0d0618]/78 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#9fd8d0]/70">
                  {entry.pairedCard
                    ? `${entry.sourceName} ${copy.entryPairLabel}`
                    : `${entry.sourceName} ${copy.entryPatternLabel}`}
                </p>
                <h3 className="mt-3 break-words text-base font-semibold leading-6 text-white">{entry.heading}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{entry.body}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    data-card-combination-hub-link
                    href={entry.cardHref}
                    className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c9c0ff] transition hover:text-white"
                  >
                    {copy.readMeaning}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={freeReadingHref(copy, entry)}
                    className="inline-flex min-h-10 items-center text-xs font-semibold uppercase tracking-[0.12em] text-white/48 transition hover:text-white"
                  >
                    {copy.tryFreeSpread}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(92vw,1120px)] gap-10 py-14 md:grid-cols-[0.92fr_1.08fr] md:py-20">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.26em] text-[#c9c0ff]/72">{copy.contextEyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">{copy.contextTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-white/58">{copy.contextBody}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.contextGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={localizedSeoHref(guide.slug, copy.locale)}
              className="group min-w-0 rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#9fd8d0]/35 hover:bg-white/[0.055]"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9fd8d0]/70">{guide.label}</p>
              <h3 className="mt-3 break-words text-base font-semibold text-white">{guide.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{guide.body}</p>
              <span className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#c9c0ff] transition group-hover:text-white">
                {copy.contextOpen}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#10091d] py-14 md:py-20">
        <div className="mx-auto grid w-[min(92vw,1120px)] gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9fd8d0]/76">{copy.methodEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">{copy.methodTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.methodBody}</p>
          </div>
          <div data-card-combination-method className="grid gap-4 sm:grid-cols-2">
            {copy.methodSections.map((section, index) => (
              <article key={section.title} className="rounded-lg border border-white/10 bg-[#0d0618]/76 p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/68">
                  {copy.stepLabel} {index + 1}
                </p>
                <h3 className="mt-3 text-base font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(92vw,1120px)] py-14 md:py-20">
        <div
          data-card-combination-daily-return
          className="rounded-lg border border-[#9fd8d0]/22 bg-[#9fd8d0]/[0.055] p-6 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9fd8d0]/76">{copy.dailyEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-white">{copy.dailyTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{copy.dailyBody}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/daily-tarot?utm_source=card_combinations&utm_medium=daily_return_panel&utm_campaign=return_loop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#d8f3ee] px-5 text-sm font-semibold text-[#09211d] transition hover:brightness-110"
              >
                {copy.dailyPrimary}
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={copy.locale === "en" ? "/tarot-questions" : copy.locale === "es" ? "/es/preguntas-tarot" : "/pt-br/perguntas-tarot"}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-5 text-sm font-medium text-white/72 transition hover:border-[#c9c0ff]/40 hover:text-white"
              >
                {copy.dailySecondary}
                <Search className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(92vw,920px)] pb-16 md:pb-24">
        <div data-card-combination-faq className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.035]">
          {copy.faqItems.map((item) => (
            <article key={item.question} className="p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-white/58">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
