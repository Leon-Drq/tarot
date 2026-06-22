import Image from "next/image"
import Link from "next/link"
import { EditorialByline } from "@/components/trust/editorial-byline"
import { localePath } from "@/lib/locales"
import { getCardKeywords, getCardSlug, getCardSuit, type TarotCardSeoPage } from "@/lib/tarot-card-seo"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, trustLinks, websiteJsonLd } from "@/lib/site"
import type { SpreadType } from "@/lib/spread-config"
import { TAROT_CARDS, type TarotCard } from "@/lib/tarot-cards"
import { trustLastReviewed } from "@/lib/trust-signals"

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

function cardDisplayName(page: TarotCardSeoPage) {
  if (page.locale === "zh") return page.card.name
  if (page.locale === "ja") return page.card.nameJa || page.card.nameEn
  if (page.locale === "ko") return page.card.nameKo || page.card.nameEn
  return page.card.nameEn
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
  const path = (slug: string) => localePath(page.locale, `/${slug}`)

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
        { title: "Will my ex come back?", body: `${name} puede aclarar contacto, timing, cierre y si esperar todavia te ayuda.`, href: path("will-my-ex-come-back-tarot") },
        { title: "Does he love me?", body: `Usa ${name} para comparar sentimientos, conducta, consistencia y seguridad emocional.`, href: path("does-he-love-me-tarot") },
        { title: "Yes or no love tarot", body: `Lee ${name} con la razon del si, no o todavia no, no solo como una palabra.`, href: path("yes-or-no-tarot-love") },
        { title: "Career tarot reading", body: `${name} ayuda a ver direccion laboral, riesgo, recursos y el siguiente paso practico.`, href: path("career-tarot-reading") },
        { title: "Should I quit my job?", body: `${name} puede separar cansancio temporal, ciclo terminado y preparacion real antes de salir.`, href: path("should-i-quit-my-job-tarot") },
      ] satisfies QuestionPath[],
    }
  }

  if (page.locale === "pt-br") {
    return {
      eyebrow: "Perguntas relacionadas",
      title: `Leia ${name} dentro de perguntas reais`,
      body: "A pagina de significado explica o simbolo. Estes caminhos abrem uma tiragem gratis focada em uma pergunta concreta.",
      paths: [
        { title: "Will my ex come back?", body: `${name} pode clarear contato, timing, fechamento e se esperar ainda ajuda.`, href: path("will-my-ex-come-back-tarot") },
        { title: "Does he love me?", body: `Use ${name} para comparar sentimentos, comportamento, consistencia e seguranca emocional.`, href: path("does-he-love-me-tarot") },
        { title: "Yes or no love tarot", body: `Leia ${name} com a razao do sim, nao ou ainda nao, nao apenas como uma palavra.`, href: path("yes-or-no-tarot-love") },
        { title: "Career tarot reading", body: `${name} ajuda a ver direcao profissional, risco, recursos e o proximo passo pratico.`, href: path("career-tarot-reading") },
        { title: "Should I quit my job?", body: `${name} pode separar cansaco temporario, ciclo encerrado e preparacao real antes de sair.`, href: path("should-i-quit-my-job-tarot") },
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
      { title: "Yes or no love tarot", body: `Read ${name} with the reason behind yes, no, or not yet instead of forcing one word.`, href: path("yes-or-no-tarot-love") },
      { title: "Career tarot reading", body: `${name} can help reveal career direction, risk, resources, and the next practical move.`, href: path("career-tarot-reading") },
      { title: "Should I quit my job?", body: `${name} can separate temporary burnout, a completed cycle, and the preparation needed before leaving.`, href: path("should-i-quit-my-job-tarot") },
    ] satisfies QuestionPath[],
  }
}

type RelatedCardLink = {
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

export function TarotCardMeaningPageView({ page }: { page: TarotCardSeoPage }) {
  const keywords = getCardKeywords(page.card, page.locale)
  const meaningsHref = localePath(page.locale, "/tarot-card-meanings")
  const cardImage = page.card.image.startsWith("http") ? page.card.image : `${appUrl}${page.card.image}`
  const primaryHref = readingHref(page)
  const promptCopy = cardPromptCopy(page)
  const questionPaths = questionPathCopy(page)
  const relatedCopy = relatedCardCopy(page)
  const relatedCards = createRelatedCardLinks(page)
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
        isPartOf: {
          "@id": `${appUrl}/#website`,
        },
        reviewedBy: {
          "@id": `${appUrl}/#editorial-team`,
        },
        publisher: {
          "@id": `${appUrl}/#organization`,
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
    ],
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080310] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_0%,rgba(123,83,178,0.38),transparent_34%),linear-gradient(180deg,#12091f_0%,#080310_100%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <nav className="flex w-full max-w-full items-center justify-between gap-3 overflow-hidden">
            <Link href="/" className="shrink-0 font-serif text-sm tracking-[0.28em] text-white/80">
              POP TAROT
            </Link>
            <Link
              href={meaningsHref}
              className="hidden min-h-10 min-w-0 items-center rounded-lg border border-white/12 px-4 py-2 text-xs text-white/68 transition hover:border-[#bfb6ff]/45 hover:text-white sm:inline-flex"
            >
              <span>{page.backLabel}</span>
            </Link>
          </nav>

          <div className="grid min-h-[78vh] items-center gap-10 py-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
              <div className="relative aspect-[7/12] overflow-hidden rounded-xl border border-[#bfb6ff]/35 bg-[#211330] shadow-2xl shadow-black/45">
                <Image src={page.card.image} alt={page.title} fill className="object-cover" sizes="360px" priority />
                <div className="absolute inset-3 rounded-lg border border-[#e8e3ff]/20" />
              </div>
            </div>

            <div className="min-w-0 max-w-[21rem] sm:max-w-3xl">
              <div className="mb-5 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#c9c0ff]">
                {page.eyebrow}
              </div>
              <h1 className="break-words font-serif text-3xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 break-words text-sm leading-7 text-white/72 sm:text-lg sm:leading-8">{page.intro}</p>
              <EditorialByline locale={page.locale} className="mt-7" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#bfb6ff]/25 bg-white/[0.04] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-[#c9c0ff]">{page.uprightLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">{keywords.upright}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="text-sm uppercase tracking-[0.16em] text-white/55">{page.reversedLabel}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{keywords.reversed}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.sections.map((section) => (
                  <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {page.deepSections.map((section) => (
                  <article key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <h2 className="font-serif text-xl text-white">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/62">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.04] p-5">
                <h2 className="font-serif text-xl text-white">{page.combinationsLabel}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {page.combinations.map((item) => (
                    <article key={item.heading}>
                      <h3 className="text-sm font-medium text-[#c9c0ff]">{item.heading}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/62">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-[#bfb6ff]/22 bg-[#bfb6ff]/[0.045] p-5">
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

              <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
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

              <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
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

              <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-5">
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
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/56 transition hover:border-[#bfb6ff]/45 hover:text-white"
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
