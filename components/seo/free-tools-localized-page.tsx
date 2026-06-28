import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { localeOpenGraph, type SeoLocale } from "@/lib/locales"
import { appUrl, siteName } from "@/lib/site"
import { getSeoPage } from "@/lib/seo-pages"
import { representativeTestimonials, trustLastReviewed } from "@/lib/trust-signals"

type FreeToolsLocale = Extract<SeoLocale, "es" | "pt-br">

type ToolCard = {
  title: string
  body: string
  href: string
  label: string
}

type QuickStartCard = {
  label: string
  title: string
  body: string
  slug?: string
  href?: string
  campaign: string
}

type SpreadFormatCard = {
  title: string
  body: string
  slug: string
}

type QuestionClusterCard = {
  key: string
  title: string
  body: string
  slugs: string[]
}

type FreeToolsCopy = {
  locale: FreeToolsLocale
  path: string
  title: string
  description: string
  navLabel: string
  eyebrow: string
  heading: string
  intro: string
  primaryCta: string
  dailyCta: string
  quickEyebrow: string
  quickTitle: string
  quickBody: string
  startFree: string
  viewGuide: string
  spreadEyebrow: string
  spreadTitle: string
  spreadBody: string
  mainEyebrow: string
  mainTitle: string
  boundaryEyebrow: string
  boundaryTitle: string
  boundaryBody: string
  freeLabel: string
  upgradeLabel: string
  trustEyebrow: string
  trustTitle: string
  trustBody: string
  trustCta: string
  clusterEyebrow: string
  clusterTitle: string
  clusterBody: string
  question: string
  tools: ToolCard[]
  quickStarts: QuickStartCard[]
  spreadFormats: SpreadFormatCard[]
  clusters: QuestionClusterCard[]
  boundaries: Array<{ area: string; free: string; upgrade: string; href: string }>
}

export const localizedFreeToolsPaths = {
  es: "/es/herramientas-tarot-gratis",
  "pt-br": "/pt-br/ferramentas-tarot-gratis",
} satisfies Record<FreeToolsLocale, string>

export const freeToolsHubAlternates = {
  en: "/free-tarot-tools",
  es: localizedFreeToolsPaths.es,
  "pt-br": localizedFreeToolsPaths["pt-br"],
  "x-default": "/free-tarot-tools",
}

function seoPath(slug: string, locale: FreeToolsLocale) {
  return getSeoPage(slug, locale)?.path || getSeoPage(slug, "en")?.path || `/${slug}`
}

function localizedHubPath(locale: FreeToolsLocale, key: "questions" | "spreads" | "meanings" | "combinations") {
  const paths = {
    es: {
      questions: "/es/preguntas-tarot",
      spreads: "/es/tiradas-tarot",
      meanings: "/es/significados-cartas-tarot",
      combinations: "/es/combinaciones-cartas-tarot",
    },
    "pt-br": {
      questions: "/pt-br/perguntas-tarot",
      spreads: "/pt-br/tiragens-tarot",
      meanings: "/pt-br/significados-cartas-tarot",
      combinations: "/pt-br/combinacoes-cartas-tarot",
    },
  } satisfies Record<FreeToolsLocale, Record<typeof key, string>>
  return paths[locale][key]
}

const copyByLocale = {
  es: {
    locale: "es",
    path: localizedFreeToolsPaths.es,
    title: "Herramientas de Tarot Gratis con IA",
    description:
      "Empieza con lecturas gratis de tarot con IA, Tarot Diario, preguntas de amor y carrera, tiradas, significados de cartas y combinaciones en POPTarot.",
    navLabel: "Herramientas gratis",
    eyebrow: "Hub gratis de tarot con IA",
    heading: "Empieza gratis: lectura, tarot diario, preguntas y significados.",
    intro:
      "POPTarot debe sentirse como una herramienta gratis primero. Haz una pregunta real, vuelve manana con Tarot Diario y usa las paginas SEO para entrar desde amor, ex, carrera, si o no, cartas y combinaciones.",
    primaryCta: "Empezar lectura gratis",
    dailyCta: "Abrir Tarot Diario",
    quickEyebrow: "Inicio rapido",
    quickTitle: "Empieza desde la intencion que ya tienes",
    quickBody:
      "Cada tarjeta abre una lectura gratis con la pregunta y la tirada adecuadas. La guia queda disponible si quieres contexto antes de sacar cartas.",
    startFree: "Empezar gratis",
    viewGuide: "Ver guia",
    spreadEyebrow: "Formatos gratis",
    spreadTitle: "Elige una tirada simple antes de pagar",
    spreadBody:
      "Los formatos basicos ayudan a entender la experiencia antes de cualquier membresia. Las funciones pagas quedan para seguimiento, historial, tiradas avanzadas e informes.",
    mainEyebrow: "Rutas principales",
    mainTitle: "Usa la herramienta desde la pagina que coincide con tu necesidad",
    boundaryEyebrow: "Gratis vs upgrade",
    boundaryTitle: "Mantener gratis la primera respuesta util",
    boundaryBody:
      "La membresia no debe aparecer como primer paso. Se reserva para profundidad, memoria y revision de patrones cuando la experiencia gratis ya fue util.",
    freeLabel: "Gratis primero",
    upgradeLabel: "Upgrade despues",
    trustEyebrow: "Confianza",
    trustTitle: "Mostrar seguridad antes de pedir una cuenta",
    trustBody:
      "Las paginas de reseñas, ejemplos, politica editorial, privacidad y canales oficiales hacen que nuevos usuarios entiendan quien esta detras del producto.",
    trustCta: "Leer reseñas",
    clusterEyebrow: "Preguntas por situacion",
    clusterTitle: "Encuentra la entrada gratis que coincide con el momento",
    clusterBody:
      "Las busquedas de tarot suelen venir de amor, silencio de un ex, habito diario, carrera o decisiones rapidas. Estos grupos convierten esas busquedas en lecturas gratis directas.",
    question: "Que necesito entender ahora?",
    tools: [
      {
        title: "Lectura gratis con IA",
        body: "Haz una pregunta real y recibe una interpretacion antes de decidir si necesitas funciones pagas.",
        href: seoPath("free-ai-tarot-reading", "es"),
        label: "Comenzar",
      },
      {
        title: "Tarot Diario",
        body: "Una carta diaria gratis, racha, diario privado y recordatorio para volver.",
        href: "/daily-tarot",
        label: "Volver diario",
      },
      {
        title: "Preguntas de tarot",
        body: "Amor, ex, si o no, carrera y decisiones laborales con tiradas ya conectadas.",
        href: localizedHubPath("es", "questions"),
        label: "Preguntas",
      },
      {
        title: "Tiradas de tarot",
        body: "Elige una tirada para relacion, ruptura, carrera, decision o claridad rapida.",
        href: localizedHubPath("es", "spreads"),
        label: "Tiradas",
      },
      {
        title: "Significados de cartas",
        body: "78 cartas con normal, invertida, amor, carrera, dinero, si o no, consejo y FAQ.",
        href: localizedHubPath("es", "meanings"),
        label: "Cartas",
      },
      {
        title: "Combinaciones de cartas",
        body: "Lee parejas comunes y abre una tirada gratis cuando necesitas contexto real.",
        href: localizedHubPath("es", "combinations"),
        label: "Combinaciones",
      },
    ],
    quickStarts: [
      {
        label: "Amor",
        title: "El me ama?",
        body: "Para senales mixtas, sentimientos reales y coherencia entre palabras y acciones.",
        slug: "does-he-love-me-tarot",
        campaign: "does_he_love_me",
      },
      {
        label: "Ex",
        title: "Mi ex volvera?",
        body: "Para contacto, reconciliacion, cierre y si esperar todavia tiene sentido.",
        slug: "will-my-ex-come-back-tarot",
        campaign: "ex_return",
      },
      {
        label: "Carrera",
        title: "Lectura de carrera",
        body: "Para direccion laboral, presion, entrevistas y siguiente paso practico.",
        slug: "career-tarot-reading",
        campaign: "career_tarot",
      },
      {
        label: "Diario",
        title: "Tarot Diario",
        body: "Una carta gratis hoy, nota de diario y motivo claro para volver manana.",
        href: "/daily-tarot?utm_source=free_tools_es&utm_medium=quick_start&utm_campaign=daily_tarot",
        campaign: "daily_tarot",
      },
    ],
    spreadFormats: [
      { title: "Una carta", body: "Mensaje central y proximo paso para una pregunta simple.", slug: "one-card-tarot-reading" },
      { title: "Tres cartas", body: "Situacion, obstaculo y consejo, o pasado, presente y futuro.", slug: "three-card-tarot-reading" },
      { title: "Pasado presente futuro", body: "Una linea de tiempo clara para entender direccion y accion.", slug: "past-present-future-tarot" },
    ],
    clusters: [
      {
        key: "amor_senales",
        title: "Amor y senales",
        body: "Para sentimientos, senales mixtas, intenciones y si las acciones coinciden con las palabras.",
        slugs: ["does-he-love-me-tarot", "how-does-he-feel-about-me-tarot", "what-does-he-think-of-me-tarot", "does-my-crush-like-me-tarot"],
      },
      {
        key: "ex_contacto",
        title: "Ex y contacto cero",
        body: "Para reconciliacion, silencio, contacto pendiente, esperar o empezar a soltar.",
        slugs: ["will-my-ex-come-back-tarot", "does-my-ex-miss-me-tarot", "will-my-ex-reach-out-tarot", "no-contact-tarot-reading"],
      },
      {
        key: "diario_habito",
        title: "Diario y semanal",
        body: "Para volver cada dia o cada semana con una carta, una nota y una accion concreta.",
        slugs: ["tarot-card-of-the-day", "daily-tarot-card", "daily-love-tarot", "daily-career-tarot", "weekly-tarot-reading"],
      },
      {
        key: "carrera_dinero",
        title: "Carrera y dinero",
        body: "Para entrevistas, ofertas, renuncia, direccion profesional y presion economica.",
        slugs: ["career-tarot-reading", "will-i-get-the-job-tarot", "should-i-take-this-job-tarot", "should-i-quit-my-job-tarot", "will-i-get-money-tarot"],
      },
    ],
    boundaries: [
      {
        area: "Primera lectura",
        free: "Una pregunta real, cartas e interpretacion con IA.",
        upgrade: "Seguimientos profundos cuando la respuesta abre otro tema.",
        href: seoPath("free-ai-tarot-reading", "es"),
      },
      {
        area: "Regreso diario",
        free: "Carta diaria, racha, diario y recordatorio.",
        upgrade: "Informes de patrones cuando haya historial suficiente.",
        href: "/daily-tarot",
      },
      {
        area: "Preguntas SEO",
        free: "Amor, ex, si/no, carrera y trabajo con tiradas correctas.",
        upgrade: "Guardar historial si el tema se vuelve recurrente.",
        href: localizedHubPath("es", "questions"),
      },
    ],
  },
  "pt-br": {
    locale: "pt-br",
    path: localizedFreeToolsPaths["pt-br"],
    title: "Ferramentas de Tarot Gratis com IA",
    description:
      "Comece com leituras gratis de tarot com IA, Tarot Diario, perguntas de amor e carreira, tiragens, significados das cartas e combinacoes no POPTarot.",
    navLabel: "Ferramentas gratis",
    eyebrow: "Hub gratis de tarot com IA",
    heading: "Comece gratis: leitura, tarot diario, perguntas e significados.",
    intro:
      "POPTarot deve parecer uma ferramenta gratis primeiro. Faca uma pergunta real, volte amanha com Tarot Diario e use paginas SEO para entrar por amor, ex, carreira, sim ou nao, cartas e combinacoes.",
    primaryCta: "Comecar leitura gratis",
    dailyCta: "Abrir Tarot Diario",
    quickEyebrow: "Inicio rapido",
    quickTitle: "Comece pela intencao que voce ja tem",
    quickBody:
      "Cada cartao abre uma leitura gratis com a pergunta e a tiragem adequadas. A guia continua disponivel se voce quiser contexto antes de tirar cartas.",
    startFree: "Comecar gratis",
    viewGuide: "Ver guia",
    spreadEyebrow: "Formatos gratis",
    spreadTitle: "Escolha uma tiragem simples antes de pagar",
    spreadBody:
      "Formatos basicos ajudam a entender a experiencia antes de qualquer assinatura. Recursos pagos ficam para acompanhamento, historico, tiragens avancadas e relatorios.",
    mainEyebrow: "Rotas principais",
    mainTitle: "Use a ferramenta pela pagina que combina com sua necessidade",
    boundaryEyebrow: "Gratis vs upgrade",
    boundaryTitle: "Manter gratis a primeira resposta util",
    boundaryBody:
      "A assinatura nao deve aparecer como primeiro passo. Ela fica para profundidade, memoria e revisao de padroes quando a experiencia gratis ja provou valor.",
    freeLabel: "Gratis primeiro",
    upgradeLabel: "Upgrade depois",
    trustEyebrow: "Confianca",
    trustTitle: "Mostrar seguranca antes de pedir uma conta",
    trustBody:
      "Paginas de avaliacoes, exemplos, politica editorial, privacidade e canais oficiais ajudam novos usuarios a entender quem esta por tras do produto.",
    trustCta: "Ler avaliacoes",
    clusterEyebrow: "Perguntas por situacao",
    clusterTitle: "Encontre a entrada gratis que combina com o momento",
    clusterBody:
      "Buscas de tarot quase sempre nascem de amor, silencio de ex, habito diario, carreira ou decisoes rapidas. Estes grupos transformam a busca em uma leitura gratis direta.",
    question: "O que eu preciso entender agora?",
    tools: [
      {
        title: "Leitura gratis com IA",
        body: "Faca uma pergunta real e receba uma interpretacao antes de decidir se precisa de recursos pagos.",
        href: seoPath("free-ai-tarot-reading", "pt-br"),
        label: "Comecar",
      },
      {
        title: "Tarot Diario",
        body: "Uma carta diaria gratis, sequencia, diario privado e lembrete para voltar.",
        href: "/daily-tarot",
        label: "Voltar diario",
      },
      {
        title: "Perguntas de tarot",
        body: "Amor, ex, sim ou nao, carreira e decisoes de trabalho com tiragens conectadas.",
        href: localizedHubPath("pt-br", "questions"),
        label: "Perguntas",
      },
      {
        title: "Tiragens de tarot",
        body: "Escolha uma tiragem para relacionamento, termino, carreira, decisao ou clareza rapida.",
        href: localizedHubPath("pt-br", "spreads"),
        label: "Tiragens",
      },
      {
        title: "Significados das cartas",
        body: "78 cartas com normal, invertida, amor, carreira, dinheiro, sim ou nao, conselho e FAQ.",
        href: localizedHubPath("pt-br", "meanings"),
        label: "Cartas",
      },
      {
        title: "Combinacoes de cartas",
        body: "Leia pares comuns e abra uma tiragem gratis quando precisar de contexto real.",
        href: localizedHubPath("pt-br", "combinations"),
        label: "Combinacoes",
      },
    ],
    quickStarts: [
      {
        label: "Amor",
        title: "Ele me ama?",
        body: "Para sinais mistos, sentimentos reais e coerencia entre palavras e acoes.",
        slug: "does-he-love-me-tarot",
        campaign: "does_he_love_me",
      },
      {
        label: "Ex",
        title: "Meu ex vai voltar?",
        body: "Para contato, reconciliacao, fechamento e se esperar ainda faz sentido.",
        slug: "will-my-ex-come-back-tarot",
        campaign: "ex_return",
      },
      {
        label: "Carreira",
        title: "Leitura de carreira",
        body: "Para direcao profissional, pressao, entrevistas e proximo passo pratico.",
        slug: "career-tarot-reading",
        campaign: "career_tarot",
      },
      {
        label: "Diario",
        title: "Tarot Diario",
        body: "Uma carta gratis hoje, nota no diario e motivo claro para voltar amanha.",
        href: "/daily-tarot?utm_source=free_tools_pt_br&utm_medium=quick_start&utm_campaign=daily_tarot",
        campaign: "daily_tarot",
      },
    ],
    spreadFormats: [
      { title: "Uma carta", body: "Mensagem central e proximo passo para uma pergunta simples.", slug: "one-card-tarot-reading" },
      { title: "Tres cartas", body: "Situacao, obstaculo e conselho, ou passado, presente e futuro.", slug: "three-card-tarot-reading" },
      { title: "Passado presente futuro", body: "Uma linha do tempo clara para entender direcao e acao.", slug: "past-present-future-tarot" },
    ],
    clusters: [
      {
        key: "amor_sinais",
        title: "Amor e sinais",
        body: "Para sentimentos, sinais mistos, intencoes e se as atitudes combinam com as palavras.",
        slugs: ["does-he-love-me-tarot", "how-does-he-feel-about-me-tarot", "what-does-he-think-of-me-tarot", "does-my-crush-like-me-tarot"],
      },
      {
        key: "ex_contato",
        title: "Ex e contato zero",
        body: "Para reconciliacao, silencio, contato pendente, esperar ou comecar a soltar.",
        slugs: ["will-my-ex-come-back-tarot", "does-my-ex-miss-me-tarot", "will-my-ex-reach-out-tarot", "no-contact-tarot-reading"],
      },
      {
        key: "diario_habito",
        title: "Diario e semanal",
        body: "Para voltar todo dia ou toda semana com uma carta, uma nota e uma acao concreta.",
        slugs: ["tarot-card-of-the-day", "daily-tarot-card", "daily-love-tarot", "daily-career-tarot", "weekly-tarot-reading"],
      },
      {
        key: "carreira_dinheiro",
        title: "Carreira e dinheiro",
        body: "Para entrevistas, ofertas, demissao, direcao profissional e pressao financeira.",
        slugs: ["career-tarot-reading", "will-i-get-the-job-tarot", "should-i-take-this-job-tarot", "should-i-quit-my-job-tarot", "will-i-get-money-tarot"],
      },
    ],
    boundaries: [
      {
        area: "Primeira leitura",
        free: "Uma pergunta real, cartas e interpretacao com IA.",
        upgrade: "Acompanhamentos profundos quando a resposta abre outro tema.",
        href: seoPath("free-ai-tarot-reading", "pt-br"),
      },
      {
        area: "Retorno diario",
        free: "Carta diaria, sequencia, diario e lembrete.",
        upgrade: "Relatorios de padroes quando houver historico suficiente.",
        href: "/daily-tarot",
      },
      {
        area: "Perguntas SEO",
        free: "Amor, ex, sim/nao, carreira e trabalho com tiragens certas.",
        upgrade: "Salvar historico se o tema se tornar recorrente.",
        href: localizedHubPath("pt-br", "questions"),
      },
    ],
  },
} satisfies Record<FreeToolsLocale, FreeToolsCopy>

function languageCode(locale: FreeToolsLocale) {
  return locale === "pt-br" ? "pt-BR" : locale
}

function copyFor(locale: FreeToolsLocale) {
  return copyByLocale[locale]
}

function readingHref(copy: FreeToolsCopy, item: QuickStartCard | SpreadFormatCard, medium: string) {
  const page = "slug" in item && item.slug ? getSeoPage(item.slug, copy.locale) : undefined
  const params = new URLSearchParams({
    q: page?.ctaQuestion || copy.question,
    auto: "1",
    source: "free_tools",
    lang: copy.locale,
    utm_source: copy.locale === "es" ? "free_tools_es" : "free_tools_pt_br",
    utm_medium: medium,
    utm_campaign: "campaign" in item ? item.campaign : item.slug,
  })

  if (page?.recommendedSpread) params.set("spread", page.recommendedSpread)
  return `/input?${params.toString()}`
}

function guideHref(copy: FreeToolsCopy, item: QuickStartCard | SpreadFormatCard) {
  if ("href" in item && item.href) return item.href
  return "slug" in item && item.slug ? seoPath(item.slug, copy.locale) : copy.path
}

function questionClusterItems(copy: FreeToolsCopy, cluster: QuestionClusterCard) {
  return cluster.slugs.map((slug) => {
    const page = getSeoPage(slug, copy.locale) || getSeoPage(slug, "en")
    if (!page) throw new Error(`Missing localized free tools cluster SEO page: ${slug}`)

    return {
      slug,
      title: page.title,
      body: page.description,
      guideHref: seoPath(slug, copy.locale),
      readingHref: questionClusterReadingHref(copy, slug, cluster.key),
    }
  })
}

function questionClusterReadingHref(copy: FreeToolsCopy, slug: string, clusterKey: string) {
  const page = getSeoPage(slug, copy.locale) || getSeoPage(slug, "en")
  const params = new URLSearchParams({
    q: page?.ctaQuestion || copy.question,
    auto: "1",
    source: "free_tools",
    lang: copy.locale,
    utm_source: copy.locale === "es" ? "free_tools_es" : "free_tools_pt_br",
    utm_medium: "question_cluster",
    utm_campaign: slug,
    utm_content: clusterKey,
  })

  if (page?.recommendedSpread) params.set("spread", page.recommendedSpread)
  return `/input?${params.toString()}`
}

function structuredData(copy: FreeToolsCopy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${appUrl}${copy.path}#webpage`,
        name: copy.title,
        description: copy.description,
        url: `${appUrl}${copy.path}`,
        isAccessibleForFree: true,
        dateModified: trustLastReviewed,
        inLanguage: languageCode(copy.locale),
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        mainEntity: {
          "@id": `${appUrl}${copy.path}#free-tools-list`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#free-tools-list`,
        name: copy.mainTitle,
        itemListElement: copy.tools.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.body,
          url: `${appUrl}${item.href}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#quick-start-free-readings`,
        name: copy.quickTitle,
        itemListElement: copy.quickStarts.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": item.href ? "WebApplication" : "WebPage",
            name: item.title,
            description: item.body,
            url: `${appUrl}${guideHref(copy, item)}`,
            isAccessibleForFree: true,
            potentialAction: {
              "@type": "InteractAction",
              name: copy.startFree,
              target: `${appUrl}${item.href || readingHref(copy, item, "quick_start")}`,
            },
          },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#free-vs-upgrade-boundary`,
        name: copy.boundaryTitle,
        itemListElement: copy.boundaries.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.area,
          description: `${copy.freeLabel}: ${item.free} ${copy.upgradeLabel}: ${item.upgrade}`,
          url: `${appUrl}${item.href}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#question-clusters`,
        name: copy.clusterTitle,
        itemListElement: copy.clusters.map((cluster, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "ItemList",
            name: cluster.title,
            description: cluster.body,
            itemListElement: questionClusterItems(copy, cluster).map((item, itemIndex) => ({
              "@type": "ListItem",
              position: itemIndex + 1,
              item: {
                "@type": "WebPage",
                name: item.title,
                description: item.body,
                url: `${appUrl}${item.guideHref}`,
                isAccessibleForFree: true,
                potentialAction: {
                  "@type": "InteractAction",
                  name: copy.startFree,
                  target: `${appUrl}${item.readingHref}`,
                },
              },
            })),
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}${copy.path}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: appUrl },
          { "@type": "ListItem", position: 2, name: copy.title, item: `${appUrl}${copy.path}` },
        ],
      },
    ],
  }
}

export function getLocalizedFreeToolsMetadata(locale: FreeToolsLocale): Metadata {
  const copy = copyFor(locale)

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${appUrl}${copy.path}`,
      languages: freeToolsHubAlternates,
    },
    openGraph: {
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      url: `${appUrl}${copy.path}`,
      siteName,
      type: "website",
      locale: localeOpenGraph[locale],
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${siteName} ${copy.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} | ${siteName}`,
      description: copy.description,
      images: ["/og-image.jpg"],
    },
  }
}

export function LocalizedFreeToolsPage({ locale }: { locale: FreeToolsLocale }) {
  const copy = copyFor(locale)
  const jsonLd = structuredData(copy)
  const testimonials = representativeTestimonials.slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0d0618] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto w-[min(92vw,1120px)] pb-16 pt-10 sm:pt-16 md:pb-24">
        <nav className="mb-8 text-xs text-white/42">
          <Link href="/" className="transition hover:text-white">
            POPTarot
          </Link>
          <span className="mx-2 text-white/24">/</span>
          <span>{copy.navLabel}</span>
        </nav>

        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#c9c0ff]/76">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl">{copy.heading}</h1>
          </div>
          <div>
            <p className="text-sm leading-7 text-white/62 sm:text-base">{copy.intro}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/input?source=free_tools&lang=${copy.locale}&utm_source=${copy.locale === "es" ? "free_tools_es" : "free_tools_pt_br"}&utm_medium=hero`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f5f2ff_0%,#b7adff_42%,#6d63d8_100%)] px-5 text-sm font-medium text-[#0c0920] shadow-[0_18px_45px_rgba(109,99,216,0.24)] transition hover:brightness-110"
              >
                {copy.primaryCta}
              </Link>
              <Link
                href="/daily-tarot"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/12 px-5 text-sm text-white/72 transition hover:border-[#bfb6ff]/45 hover:text-white"
              >
                {copy.dailyCta}
              </Link>
            </div>
          </div>
        </div>

        <section data-free-tools-quick-start className="border-b border-white/10 py-8 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.quickEyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.quickTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{copy.quickBody}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {copy.quickStarts.map((item) => (
                <article
                  key={item.campaign}
                  data-free-tools-quick-start-card
                  className="flex min-h-[13rem] min-w-0 flex-col rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#bfb6ff]/42 hover:bg-white/[0.06]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">{item.label}</p>
                  <h3 className="mt-3 break-words text-base font-medium leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/52">{item.body}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Link
                      data-free-tools-quick-start-start
                      href={item.href || readingHref(copy, item, "quick_start")}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.18)] transition hover:brightness-110"
                    >
                      {copy.startFree}
                    </Link>
                    <Link
                      href={guideHref(copy, item)}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/62 transition hover:border-[#bfb6ff]/40 hover:text-white"
                    >
                      {copy.viewGuide}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-free-tools-spread-formats className="border-b border-white/10 py-8 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.spreadEyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.spreadTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{copy.spreadBody}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {copy.spreadFormats.map((item) => (
                <article
                  key={item.slug}
                  data-free-tools-spread-format-card
                  className="flex min-h-[14rem] min-w-0 flex-col rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4 transition hover:border-[#bfb6ff]/45 hover:bg-[#bfb6ff]/[0.07]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">{copy.spreadEyebrow}</p>
                  <h3 className="mt-3 break-words text-base font-medium leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/52">{item.body}</p>
                  <div className="mt-auto grid gap-2 pt-4">
                    <Link
                      data-free-tools-spread-format-start
                      href={readingHref(copy, item, "spread_format")}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.18)] transition hover:brightness-110"
                    >
                      {copy.startFree}
                    </Link>
                    <Link
                      data-free-tools-spread-format-guide
                      href={guideHref(copy, item)}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-xs text-white/62 transition hover:border-[#bfb6ff]/40 hover:text-white"
                    >
                      {copy.viewGuide}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.mainEyebrow}</p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">{copy.mainTitle}</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.tools.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.06]"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{item.label}</p>
                <h3 className="mt-3 text-base font-medium text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <section data-free-tools-membership-boundary className="mt-12 border-t border-white/10 pt-8">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.boundaryEyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.boundaryTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{copy.boundaryBody}</p>
            </div>
            <div className="grid gap-3">
              {copy.boundaries.map((item) => (
                <article
                  key={item.area}
                  data-free-tools-membership-boundary-row
                  className="grid min-w-0 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[0.72fr_1fr_1fr]"
                >
                  <Link href={item.href} className="group min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">Area</p>
                    <h3 className="mt-2 break-words text-base font-medium leading-snug text-white group-hover:text-[#eeeaff]">
                      {item.area}
                    </h3>
                  </Link>
                  <div className="min-w-0 rounded-md border border-[#bfb6ff]/16 bg-[#bfb6ff]/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/74">{copy.freeLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-white/64">{item.free}</p>
                  </div>
                  <div className="min-w-0 rounded-md border border-white/10 bg-black/20 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">{copy.upgradeLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-white/56">{item.upgrade}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-free-tools-question-clusters className="mt-12 border-t border-white/10 pt-8">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.clusterEyebrow}</p>
              <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.clusterTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">{copy.clusterBody}</p>
            </div>
            <div className="grid gap-4">
              {copy.clusters.map((cluster) => (
                <article
                  key={cluster.key}
                  data-free-tools-question-cluster
                  className="min-w-0 rounded-lg border border-[#bfb6ff]/14 bg-[#bfb6ff]/[0.035] p-4"
                >
                  <div className="grid gap-2 border-b border-white/10 pb-4 sm:grid-cols-[0.52fr_1fr] sm:items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/72">
                        {cluster.key.replace(/_/g, " ")}
                      </p>
                      <h3 className="mt-2 break-words text-lg font-medium leading-snug text-white">{cluster.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-white/56">{cluster.body}</p>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {questionClusterItems(copy, cluster).map((item) => (
                      <div
                        key={`${cluster.key}-${item.slug}`}
                        data-free-tools-question-cluster-link
                        className="min-w-0 border-t border-white/8 pt-3 first:border-t-0 first:pt-0 sm:first:border-t sm:first:pt-3"
                      >
                        <h4 className="break-words text-sm font-medium leading-snug text-[#f3efff]">{item.title}</h4>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/48">{item.body}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Link
                            data-free-tools-question-cluster-start
                            href={item.readingHref}
                            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_52%,#9284ef_100%)] px-3 py-2 text-center text-xs font-medium text-[#120c22] shadow-[0_12px_28px_rgba(146,132,239,0.16)] transition hover:brightness-110"
                          >
                            {copy.startFree}
                          </Link>
                          <Link
                            data-free-tools-question-cluster-guide
                            href={item.guideHref}
                            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-center text-xs text-white/64 transition hover:border-[#bfb6ff]/40 hover:text-white"
                          >
                            {copy.viewGuide}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          data-free-tools-social-proof
          className="mt-12 grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-[0.86fr_1.14fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.trustEyebrow}</p>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-white sm:text-3xl">{copy.trustTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.trustBody}</p>
            <Link
              href="/reviews"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#bfb6ff]/35 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#eeeaff] hover:bg-white/[0.06]"
            >
              {copy.trustCta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {testimonials.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/70">&quot;{item.quote}&quot;</p>
                <p className="mt-3 text-xs leading-5 text-white/38">{item.context}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
