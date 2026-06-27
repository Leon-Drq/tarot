import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react"
import { localeOpenGraph, type SeoLocale } from "@/lib/locales"
import { appUrl, editorialTeamJsonLd, organizationJsonLd, siteName, websiteJsonLd } from "@/lib/site"
import { getSeoPage } from "@/lib/seo-pages"
import { SPREAD_CONFIGS, type SpreadType } from "@/lib/spread-config"
import { trustLastReviewed } from "@/lib/trust-signals"
import { getTarotSpreadHubPath } from "@/components/seo/tarot-spreads-page"
import { TarotQuestionSearchResults, type TarotQuestionSearchEntry } from "@/components/seo/tarot-question-search-results"

type TarotQuestionHubLocale = Extract<SeoLocale, "en" | "es" | "pt-br">
type QuestionGroup = "love" | "career" | "daily" | "fast"

type QuestionEntry = {
  slug?: string
  title: string
  query: string
  intent: string
  spread: SpreadType
  group: QuestionGroup
}

type QuestionGroupCopy = {
  label: string
  title: string
  body: string
  group: QuestionGroup
}

type QuickStartGroupCopy = {
  label: string
  title: string
  body: string
  slugs: string[]
}

type QuestionPageCopy = {
  locale: TarotQuestionHubLocale
  path: string
  title: string
  description: string
  headerLink: string
  headerLinkLabel: string
  eyebrow: string
  heading: string
  intro: string
  features: Array<{ title: string; body: string }>
  quickStartEyebrow: string
  quickStartTitle: string
  quickStartBody: string
  quickStartGroups: QuickStartGroupCopy[]
  groups: QuestionGroupCopy[]
  entries: QuestionEntry[]
  betterEyebrow: string
  betterTitle: string
  betterBody: string
  browseSpreads: string
  startFree: string
  readGuide: string
  cardLabel: (count: number, spreadName: string) => string
  faqs: Array<{ question: string; answer: string }>
}

const questionHubPaths = {
  en: "/tarot-questions",
  es: "/es/preguntas-tarot",
  "pt-br": "/pt-br/perguntas-tarot",
} satisfies Record<TarotQuestionHubLocale, string>

export function getTarotQuestionHubPath(locale: TarotQuestionHubLocale) {
  return questionHubPaths[locale]
}

const copyByLocale = {
  en: {
    locale: "en",
    path: questionHubPaths.en,
    title: "Tarot Questions",
    description:
      "Choose a tarot question for love, ex reconciliation, texting, yes-or-no answers, career, and job decisions, then start a free AI tarot spread.",
    headerLink: "/tarot-spreads",
    headerLinkLabel: "Tarot Spreads",
    eyebrow: "Question chooser",
    heading: "Tarot Questions",
    intro:
      "Start from the question people actually search for, then open the free AI tarot flow with the right spread already selected.",
    features: [
      { title: "Free first", body: "Each entry opens a free reading path before any membership decision." },
      { title: "Intent matched", body: "Love, ex, career, and yes-or-no questions use different card layouts." },
      { title: "Search ready", body: "High-intent guide pages and direct spread links reinforce each other." },
    ],
    quickStartEyebrow: "Quick start",
    quickStartTitle: "Open a matching free spread in one tap",
    quickStartBody:
      "These are the highest-intent paths for new readers. Each link keeps the real question, spread, locale, and attribution attached.",
    quickStartGroups: [
      {
        label: "Ex and no contact",
        title: "Reconciliation and silence",
        body: "For breakup waiting, no contact, reaching out, and whether repair is realistic.",
        slugs: ["will-my-ex-come-back-tarot", "no-contact-tarot-reading", "will-my-ex-reach-out-tarot"],
      },
      {
        label: "Love signals",
        title: "Feelings and mixed signals",
        body: "For whether feelings are mutual, what someone thinks, and whether a crush is real.",
        slugs: ["does-he-love-me-tarot", "how-does-he-feel-about-me-tarot", "what-does-she-think-of-me-tarot", "does-my-crush-like-me-tarot"],
      },
      {
        label: "Career decisions",
        title: "Work, offers, and next moves",
        body: "For job changes, interviews, quitting, accepting an offer, business timing, and money pressure.",
        slugs: ["career-tarot-reading", "will-i-get-the-job-tarot", "will-i-get-promoted-tarot", "should-i-accept-this-job-offer-tarot", "what-career-is-right-for-me-tarot"],
      },
      {
        label: "Daily return",
        title: "Come back tomorrow with one focused question",
        body: "For daily love, work, yes-or-no, mood, and action prompts that build a habit.",
        slugs: ["daily-love-tarot", "daily-career-tarot", "daily-yes-or-no-tarot"],
      },
    ],
    groups: [
      {
        label: "Love",
        title: "Love and relationship questions",
        body: "Use these when the real need is emotional clarity: feelings, reconnection, timing, mixed signals, or whether a bond is worth your energy.",
        group: "love",
      },
      {
        label: "Career",
        title: "Career and work questions",
        body: "Use these when a job decision needs both intuition and practical next steps: stay, leave, prepare, negotiate, or change direction.",
        group: "career",
      },
      {
        label: "Daily",
        title: "Daily tarot return questions",
        body: "Use these when you want one focused reason to come back: love, career, yes-or-no, mood, or a practical action for today.",
        group: "daily",
      },
      {
        label: "Fast clarity",
        title: "Quick yes-or-no and direction questions",
        body: "Use these when you need a compact first answer, then let the spread explain the reason and the next action.",
        group: "fast",
      },
    ],
    entries: [
      {
        slug: "will-my-ex-come-back-tarot",
        title: "Will my ex come back?",
        query: "Will my ex come back, and what should I understand before I act?",
        intent: "For breakup clarity, remaining emotional energy, timing, and whether reaching out is wise.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-he-love-me-tarot",
        title: "Does he love me?",
        query: "Does he love me, and what is the real emotional energy between us?",
        intent: "For mixed signals, emotional consistency, and whether the connection is mutual.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "how-does-he-feel-about-me-tarot",
        title: "How does he feel about me?",
        query: "How does he feel about me, and what should I understand before I act?",
        intent: "For attraction, hidden feelings, private emotion, mixed signals, and whether feelings may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "does-my-ex-miss-me-tarot",
        title: "Does my ex miss me?",
        query: "Does my ex miss me, and what does that feeling mean now?",
        intent: "For breakup silence, nostalgia, no-contact periods, unfinished feelings, and whether missing you is enough to reconnect.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-he-come-back-tarot",
        title: "Will he come back?",
        query: "Will he come back, and what should I understand before waiting?",
        intent: "For no-contact periods, reunion hopes, motives, delays, and setting a healthy waiting boundary.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "future-spouse-tarot-reading",
        title: "Future spouse tarot reading",
        query: "What should I know about my future spouse energy and readiness for lasting love?",
        intent: "For future partner questions, spouse energy, timing themes, relationship readiness, and lasting love.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-he-thinking-about-me-tarot",
        title: "Is he thinking about me?",
        query: "Is he thinking about me, and what is the real energy behind his silence?",
        intent: "For silence, delayed replies, no-contact periods, and whether thoughts may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-he-think-of-me-tarot",
        title: "What does he think of me?",
        query: "What does he think of me, and what should I understand about his attitude?",
        intent: "For uncertain attraction, mixed behavior, private thoughts, and whether perception may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-contact-me-tarot",
        title: "Will he contact me?",
        query: "Will he contact me, and what should I do while I wait?",
        intent: "For no-contact periods, delayed replies, breakup silence, and deciding whether waiting still helps.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "is-this-relationship-over-tarot",
        title: "Is this relationship over?",
        query: "Is this relationship over, and what is the healthiest next step?",
        intent: "For emotional distance, repeated conflict, breakup signals, and whether repair is realistic.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-move-on-tarot",
        title: "Should I move on?",
        query: "Should I move on, and what would help me choose closure with self-respect?",
        intent: "For breakup limbo, waiting, attachment, unfinished emotion, and deciding whether closure is healthier than holding on.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "no-contact-tarot-reading",
        title: "No contact tarot reading",
        query: "What should I understand during no contact, and what is the healthiest next step?",
        intent: "For breakup silence, delayed replies, emotional distance, waiting boundaries, and whether contact would help or hurt.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-no-contact-work-tarot",
        title: "Does no contact work?",
        query: "Is no contact working, and what should I do next?",
        intent: "For no-contact strategy, breakup silence, emotional distance, whether waiting is helping, and when to stop checking signs.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-my-ex-reach-out-tarot",
        title: "Will my ex reach out?",
        query: "Will my ex reach out, and how should I respond if they do?",
        intent: "For delayed messages, no-contact waiting, outreach motives, reconciliation hopes, and preparing a calm response.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "should-i-stay-or-leave-tarot",
        title: "Should I stay or leave?",
        query: "Should I stay or leave, and what is the healthiest next step?",
        intent: "For relationship uncertainty, repeated conflict, repair conditions, emotional safety, and deciding whether staying still protects your wellbeing.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-give-him-another-chance-tarot",
        title: "Should I give him another chance?",
        query: "Should I give him another chance, and what would need to change?",
        intent: "For second chances, apologies, broken trust, repair conditions, changed behavior, and emotional safety.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-give-her-another-chance-tarot",
        title: "Should I give her another chance?",
        query: "Should I give her another chance, and what would need to change?",
        intent: "For second chances, apologies, broken trust, repair conditions, changed behavior, and emotional safety.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "does-my-crush-like-me-tarot",
        title: "Does my crush like me?",
        query: "Does my crush like me, and what signs should I trust?",
        intent: "For crushes, early dating, subtle signals, mixed attention, and checking whether interest is mutual.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-text-me-tarot",
        title: "Will he text me?",
        query: "Will he text me, and what should I do while I wait?",
        intent: "For delayed replies, no-contact periods, communication blocks, and deciding whether waiting still helps.",
        spread: "yes_no",
        group: "love",
      },
      {
        slug: "does-she-love-me-tarot",
        title: "Does she love me?",
        query: "Does she love me, and what is the real emotional energy between us?",
        intent: "For mixed signals, emotional consistency, and whether the connection is mutual.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "how-does-she-feel-about-me-tarot",
        title: "How does she feel about me?",
        query: "How does she feel about me, and what should I understand before I act?",
        intent: "For attraction, hidden feelings, private emotion, mixed signals, and whether feelings may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-she-text-me-tarot",
        title: "Will she text me?",
        query: "Will she text me, and what should I do while I wait?",
        intent: "For delayed replies, no-contact periods, communication blocks, and deciding whether waiting still helps.",
        spread: "yes_no",
        group: "love",
      },
      {
        slug: "what-are-her-intentions-tarot",
        title: "What are her intentions?",
        query: "What are her intentions toward me, and what should I watch in her actions?",
        intent: "For dating uncertainty, mixed signals, and whether attraction is serious, casual, or avoidant.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-she-think-of-me-tarot",
        title: "What does she think of me?",
        query: "What does she think of me, and what should I understand about her attitude?",
        intent: "For mixed signals, private thoughts, uncertain attraction, silence, and whether attention may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-she-contact-me-tarot",
        title: "Will she contact me?",
        query: "Will she contact me, and what should I do while I wait?",
        intent: "For no-contact periods, delayed replies, breakup silence, and choosing a healthy waiting boundary.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "is-she-thinking-about-me-tarot",
        title: "Is she thinking about me?",
        query: "Is she thinking about me, and what is the real energy behind her silence?",
        intent: "For silence, delayed replies, no-contact periods, and whether thoughts may become action.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "should-i-text-her-tarot",
        title: "Should I text her?",
        query: "Should I text her today, and what should I consider before I send it?",
        intent: "For timing, intention, emotional safety, and deciding whether to message or wait.",
        spread: "yes_no",
        group: "love",
      },
      {
        slug: "should-i-break-up-with-him-tarot",
        title: "Should I break up with him?",
        query: "Should I break up with him, and what is the healthiest next step?",
        intent: "For repeated conflict, broken trust, emotional distance, repair conditions, and relationship safety.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-break-up-with-her-tarot",
        title: "Should I break up with her?",
        query: "Should I break up with her, and what is the healthiest next step?",
        intent: "For repeated conflict, broken trust, emotional distance, repair conditions, and relationship safety.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "twin-flame-tarot-reading",
        title: "Twin flame tarot reading",
        query: "What should I understand about this twin flame connection and my healthiest next step?",
        intent: "For intense connections, separation, reunion hopes, lessons, mirroring, and checking whether the bond is grounded and safe.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "will-i-get-married-tarot",
        title: "Will I get married?",
        query: "Will I get married, and what should I understand about long-term love readiness?",
        intent: "For commitment questions, marriage timing, future partnership, readiness, and what helps lasting love become realistic.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "when-will-i-find-love-tarot",
        title: "When will I find love?",
        query: "When will I find love, and what should I open myself to next?",
        intent: "For single readers, dating fatigue, soulmate timing, and the pattern that needs to shift first.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "what-are-his-intentions-tarot",
        title: "What are his intentions?",
        query: "What are his intentions toward me, and what should I watch in his actions?",
        intent: "For dating uncertainty, mixed signals, and whether attraction is serious, casual, or avoidant.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-we-get-back-together-tarot",
        title: "Will we get back together?",
        query: "Will we get back together, and what would need to change for it to be healthy?",
        intent: "For reconciliation, second chances, unresolved feelings, and whether repair is realistic.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "is-he-my-soulmate-tarot",
        title: "Is he my soulmate?",
        query: "Is he my soulmate, and what is this connection here to teach me?",
        intent: "For intense connections, soulmate questions, spiritual attraction, and healthy reciprocity.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-she-my-soulmate-tarot",
        title: "Is she my soulmate?",
        query: "Is she my soulmate, and what is this connection here to teach me?",
        intent: "For intense connections, soulmate questions, spiritual attraction, and healthy reciprocity.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "yes-or-no-tarot-love",
        title: "Yes or no love tarot",
        query: "Give me a yes or no love tarot answer with the reason behind it.",
        intent: "For a simple love question when you still want the reason behind the answer.",
        spread: "yes_no",
        group: "fast",
      },
      {
        slug: "career-tarot-reading",
        title: "Career tarot reading",
        query: "What should I understand about my career path right now?",
        intent: "For job changes, interviews, workplace conflict, money choices, and professional direction.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-get-the-job-tarot",
        title: "Will I get the job?",
        query: "Will I get the job, and what should I do to improve my chances?",
        intent: "For interviews, pending offers, applications, promotion chances, and practical follow-up steps.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-take-this-job-tarot",
        title: "Should I take this job?",
        query: "Should I take this job, and what should I compare before deciding?",
        intent: "For comparing salary, culture fit, growth, risk, stability, and whether negotiation is needed.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "should-i-accept-this-job-offer-tarot",
        title: "Should I accept this job offer?",
        query: "Should I accept this job offer, and what should I compare before deciding?",
        intent: "For comparing salary, role fit, manager energy, growth, stability, negotiation, and hidden tradeoffs before committing.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-i-get-promoted-tarot",
        title: "Will I get promoted?",
        query: "Will I get promoted, and what should I do to improve my chances?",
        intent: "For promotion timing, recognition, performance reviews, salary growth, workplace politics, and the next professional action.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "what-career-is-right-for-me-tarot",
        title: "What career is right for me?",
        query: "What career path is right for me, and what next step should I explore?",
        intent: "For career direction, feeling stuck, choosing a path, changing industries, strengths, and better-fit work.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-start-a-business-tarot",
        title: "Should I start a business?",
        query: "Should I start this business, and what should I prepare before I move?",
        intent: "For startup ideas, side hustles, self-employment, launch timing, money risk, and the first validation step.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-my-business-succeed-tarot",
        title: "Will my business succeed?",
        query: "Will my business succeed, and what should I focus on next?",
        intent: "For business launches, customer fit, sales momentum, cash pressure, resources, and operating focus.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-be-successful-tarot",
        title: "Will I be successful?",
        query: "Will I be successful, and what should I focus on next?",
        intent: "For goals, launches, exams, creative projects, and the controllable action that improves your odds.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "should-i-quit-my-job-tarot",
        title: "Should I quit my job?",
        query: "Should I quit my job, and what is the wisest next step?",
        intent: "For burnout, toxic workplaces, financial timing, and deciding whether to stay, plan, or leave.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "money-tarot-reading",
        title: "Money tarot reading",
        query: "What should I understand about my money situation and next practical step?",
        intent: "For money stress, income direction, spending patterns, resources, and a grounded next step.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "daily-love-tarot",
        title: "Daily love tarot",
        query: "What should I understand about today's love energy and one grounded next step?",
        intent: "For today's relationship energy, feelings, timing, and one action you can actually take.",
        spread: "relationship",
        group: "daily",
      },
      {
        slug: "daily-career-tarot",
        title: "Daily career tarot",
        query: "What should I focus on at work today, and what practical move would help?",
        intent: "For daily work pressure, opportunities, preparation, timing, and one practical career move.",
        spread: "job_opportunity",
        group: "daily",
      },
      {
        slug: "daily-yes-or-no-tarot",
        title: "Daily yes or no tarot",
        query: "Give me a daily yes or no tarot answer with the reason behind it.",
        intent: "For one simple choice today when you need a quick direction and the reason behind it.",
        spread: "yes_no",
        group: "daily",
      },
      {
        slug: "daily-mood-tarot",
        title: "Daily mood tarot",
        query: "What is shaping my mood today, and what would help me reset?",
        intent: "For emotional patterns, triggers, grounding, and a small reset for today.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "daily-action-tarot",
        title: "Daily action tarot",
        query: "What is one grounded action I can take today?",
        intent: "For turning today's card or question into one clear next step.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "should-i-text-him-tarot",
        title: "Should I text him today?",
        query: "Should I text him today, and what should I consider first?",
        intent: "For quick contact decisions where the answer needs one clear next action.",
        spread: "yes_no",
        group: "fast",
      },
      {
        title: "What should I focus on this month?",
        query: "What should I focus on this month, and what pattern should I notice?",
        intent: "For a broader check-in that turns reflection into one practical priority.",
        spread: "three_card",
        group: "fast",
      },
      {
        title: "Is this connection worth pursuing?",
        query: "Is this connection worth pursuing, and what energy should I pay attention to?",
        intent: "For new love, uncertain dating energy, and whether the bond has real potential.",
        spread: "love_connection",
        group: "love",
      },
    ],
    betterEyebrow: "Better questions",
    betterTitle: "How to choose the right tarot question",
    betterBody:
      "A good question names the situation and leaves room for interpretation. The goal is clarity you can act on, not a fixed prediction that removes your choice.",
    browseSpreads: "Browse every spread",
    startFree: "Start free",
    readGuide: "Read guide",
    cardLabel: (count: number, spreadName: string) => `${count} card${count === 1 ? "" : "s"} · ${spreadName}`,
    faqs: [
      {
        question: "Can I start these tarot questions for free?",
        answer:
          "Yes. Each question can open a free AI tarot flow with the spread already selected. Membership is reserved for deeper follow-ups, saved history, advanced spreads, and longer reports.",
      },
      {
        question: "Should I ask a yes-or-no tarot question or an open question?",
        answer:
          "Use yes-or-no when the choice is simple. Use an open question when you need context, emotional pattern, timing, or a practical next step.",
      },
      {
        question: "Why does each question use a different tarot spread?",
        answer:
          "A breakup question needs more positions than a simple yes-or-no question. Matching the spread to the intent makes the reading more useful than a generic card draw.",
      },
    ],
  },
  es: {
    locale: "es",
    path: questionHubPaths.es,
    title: "Preguntas de tarot",
    description:
      "Elige una pregunta de tarot sobre amor, ex, mensajes, respuestas si o no, carrera y trabajo, y empieza una tirada gratis con IA.",
    headerLink: "/es/tiradas-tarot",
    headerLinkLabel: "Tiradas de tarot",
    eyebrow: "Selector de preguntas",
    heading: "Preguntas de tarot",
    intro:
      "Empieza con la pregunta que realmente quieres aclarar y abre una lectura gratis con la tirada adecuada ya seleccionada.",
    features: [
      { title: "Gratis primero", body: "Cada entrada abre una lectura gratis antes de cualquier decision de membresia." },
      { title: "Intencion clara", body: "Amor, ex, carrera y si/no usan tiradas distintas para evitar respuestas genericas." },
      { title: "Lista para busqueda", body: "Las guias de alta intencion y los enlaces directos a tiradas se refuerzan entre si." },
    ],
    quickStartEyebrow: "Inicio rapido",
    quickStartTitle: "Abre una tirada gratis en un toque",
    quickStartBody:
      "Estas son rutas de alta intencion para nuevos lectores. Cada enlace conserva la pregunta, la tirada, el idioma y la atribucion.",
    quickStartGroups: [
      {
        label: "Ex y contacto cero",
        title: "Reconciliacion y silencio",
        body: "Para ruptura, espera, contacto cero, mensajes pendientes y si reparar es realista.",
        slugs: ["will-my-ex-come-back-tarot", "no-contact-tarot-reading", "will-my-ex-reach-out-tarot"],
      },
      {
        label: "Senales de amor",
        title: "Sentimientos y senales mixtas",
        body: "Para saber si los sentimientos son mutuos, que piensa alguien y si hay interes real.",
        slugs: ["does-he-love-me-tarot", "how-does-he-feel-about-me-tarot", "what-does-she-think-of-me-tarot", "does-my-crush-like-me-tarot"],
      },
      {
        label: "Trabajo",
        title: "Carrera, ofertas y siguientes pasos",
        body: "Para cambios de trabajo, entrevistas, renunciar, aceptar una oferta, emprender y presion economica.",
        slugs: [
          "career-tarot-reading",
          "will-i-get-the-job-tarot",
          "should-i-accept-this-job-offer-tarot",
          "will-i-get-promoted-tarot",
          "what-career-is-right-for-me-tarot",
          "should-i-start-a-business-tarot",
          "should-i-quit-my-job-tarot",
        ],
      },
      {
        label: "Diario",
        title: "Vuelve manana con una pregunta clara",
        body: "Para amor, carrera, si/no, estado de animo y acciones diarias que crean habito.",
        slugs: ["daily-love-tarot", "daily-career-tarot", "daily-yes-or-no-tarot"],
      },
    ],
    groups: [
      {
        label: "Amor",
        title: "Preguntas de amor y relaciones",
        body: "Usalas cuando necesitas claridad emocional: sentimientos, reconexion, tiempos, senales mixtas o si un vinculo merece tu energia.",
        group: "love",
      },
      {
        label: "Carrera",
        title: "Preguntas de carrera y trabajo",
        body: "Usalas cuando una decision laboral necesita intuicion y pasos concretos: quedarte, salir, prepararte, negociar o cambiar de rumbo.",
        group: "career",
      },
      {
        label: "Diario",
        title: "Preguntas de tarot diario",
        body: "Usalas cuando quieres una razon concreta para volver: amor, carrera, si/no, animo o una accion practica para hoy.",
        group: "daily",
      },
      {
        label: "Claridad rapida",
        title: "Preguntas si/no y de direccion",
        body: "Usalas cuando necesitas una primera respuesta compacta y luego quieres entender la razon y el proximo paso.",
        group: "fast",
      },
    ],
    entries: [
      {
        slug: "will-my-ex-come-back-tarot",
        title: "Mi ex volvera?",
        query: "Mi ex volvera, y que deberia entender antes de actuar?",
        intent: "Para claridad despues de una ruptura, energia emocional pendiente, timing y si conviene escribir.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-he-love-me-tarot",
        title: "El me ama?",
        query: "El me ama, y cual es la energia emocional real entre nosotros?",
        intent: "Para senales mixtas, consistencia emocional y si la conexion es realmente mutua.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "how-does-he-feel-about-me-tarot",
        title: "Que siente por mi?",
        query: "Que siente por mi y que debo entender antes de actuar?",
        intent: "Para senales mixtas, atraccion, emocion privada y si sus sentimientos pueden convertirse en accion.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "does-my-ex-miss-me-tarot",
        title: "Mi ex me extrana?",
        query: "Mi ex me extrana y que significa ese sentimiento ahora?",
        intent: "Para silencio despues de una ruptura, nostalgia, contacto cero y si extranar basta para reconectar.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-he-come-back-tarot",
        title: "El volvera?",
        query: "El volvera y que debo entender antes de esperar?",
        intent: "Para contacto cero, esperanza de regreso, motivos, demoras y limites sanos mientras esperas.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "future-spouse-tarot-reading",
        title: "Tarot del futuro esposo",
        query: "Que debo saber sobre mi futura pareja y mi preparacion para un amor estable?",
        intent: "Para energia de futura pareja, matrimonio, tiempos, preparacion emocional y amor duradero.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-he-thinking-about-me-tarot",
        title: "Esta pensando en mi?",
        query: "Esta pensando en mi, y que energia hay detras de su silencio?",
        intent: "Para silencio, respuestas tardias, contacto cero y si los pensamientos pueden convertirse en accion.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-he-think-of-me-tarot",
        title: "Que piensa de mi?",
        query: "Que piensa de mi, y que debo entender sobre su actitud?",
        intent: "Para senales mixtas, atraccion incierta, silencio y si su percepcion puede convertirse en accion.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-contact-me-tarot",
        title: "Me contactara?",
        query: "Me contactara, y que debo hacer mientras espero?",
        intent: "Para contacto cero, respuestas tardias, silencio tras una ruptura y decidir si esperar todavia ayuda.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-she-think-of-me-tarot",
        title: "Que piensa ella de mi?",
        query: "Que piensa ella de mi y que debo entender sobre su actitud?",
        intent: "Para senales mixtas, pensamientos privados, atraccion incierta, silencio y si su atencion puede convertirse en accion.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-she-contact-me-tarot",
        title: "Ella me contactara?",
        query: "Ella me contactara y que debo hacer mientras espero?",
        intent: "Para contacto cero, respuestas tardias, silencio despues de una ruptura y limites sanos mientras esperas.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "is-this-relationship-over-tarot",
        title: "Esta relacion termino?",
        query: "Esta relacion termino, y cual es el siguiente paso mas sano?",
        intent: "Para distancia emocional, conflicto repetido, senales de ruptura y si reparar es realista.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-move-on-tarot",
        title: "Deberia seguir adelante?",
        query: "Deberia seguir adelante, y que me ayudaria a elegir cierre con amor propio?",
        intent: "Para limbo despues de una ruptura, espera, apego, emociones pendientes y decidir si cerrar es mas sano que seguir aferrandote.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "no-contact-tarot-reading",
        title: "Lectura contacto cero",
        query: "Que debo entender durante el contacto cero y cual es el siguiente paso mas sano?",
        intent: "Para silencio tras ruptura, respuestas demoradas, distancia emocional, limites al esperar y si contactar ayudaria o danaria.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-no-contact-work-tarot",
        title: "Funciona el contacto cero?",
        query: "El contacto cero esta funcionando y que debo hacer ahora?",
        intent: "Para estrategia de contacto cero, silencio tras ruptura, distancia emocional, si esperar ayuda y cuando dejar de buscar senales.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-my-ex-reach-out-tarot",
        title: "Mi ex me buscara?",
        query: "Mi ex me buscara y como debo responder si lo hace?",
        intent: "Para mensajes demorados, contacto cero, motivos de acercamiento, esperanza de reconciliacion y respuesta tranquila.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "should-i-stay-or-leave-tarot",
        title: "Deberia quedarme o irme?",
        query: "Deberia quedarme o irme y cual es el siguiente paso mas sano?",
        intent: "Para incertidumbre de relacion, conflicto repetido, reparacion, seguridad emocional y bienestar.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-give-him-another-chance-tarot",
        title: "Darle otra oportunidad?",
        query: "Deberia darle otra oportunidad y que tendria que cambiar?",
        intent: "Para segundas oportunidades, disculpas, confianza rota, condiciones de reparacion, cambio real y seguridad emocional.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "does-my-crush-like-me-tarot",
        title: "Le gusto a mi crush?",
        query: "Le gusto a mi crush y que senales deberia confiar?",
        intent: "Para crushes, citas iniciales, senales sutiles, atencion mixta y saber si el interes es mutuo.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-text-me-tarot",
        title: "Me escribira?",
        query: "Me escribira, y que debo hacer mientras espero?",
        intent: "Para respuestas tardias, contacto cero, bloqueos de comunicacion y decidir si esperar todavia ayuda.",
        spread: "yes_no",
        group: "love",
      },
      {
        slug: "should-i-break-up-with-him-tarot",
        title: "Deberia terminar con el?",
        query: "Deberia terminar con el, y cual es el siguiente paso mas sano?",
        intent: "Para conflicto repetido, confianza rota, distancia emocional, condiciones de reparacion y seguridad en la relacion.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "twin-flame-tarot-reading",
        title: "Lectura de tarot llama gemela",
        query: "Que debo entender sobre esta conexion de llama gemela y mi siguiente paso mas sano?",
        intent: "Para conexiones intensas, separacion, reunion, lecciones, espejos emocionales y revisar si el vinculo es sano.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "will-i-get-married-tarot",
        title: "Me casare?",
        query: "Me casare, y que debo entender sobre mi preparacion para un amor duradero?",
        intent: "Para compromiso, tiempo de matrimonio, futura pareja, preparacion emocional y lo que vuelve realista un amor estable.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "when-will-i-find-love-tarot",
        title: "Cuando encontrare el amor?",
        query: "Cuando encontrare el amor, y a que deberia abrirme ahora?",
        intent: "Para personas solteras, cansancio de citas, timing amoroso y patrones que conviene mover primero.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "what-are-his-intentions-tarot",
        title: "Cuales son sus intenciones?",
        query: "Cuales son sus intenciones hacia mi y que debo observar en sus acciones?",
        intent: "Para citas inciertas, senales mixtas y si la atraccion es seria, casual o evitativa.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-we-get-back-together-tarot",
        title: "Volveremos a estar juntos?",
        query: "Volveremos a estar juntos y que tendria que cambiar para que sea sano?",
        intent: "Para reconciliacion, segundas oportunidades, sentimientos pendientes y si reparar es realista.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "is-he-my-soulmate-tarot",
        title: "Es mi alma gemela?",
        query: "Es mi alma gemela y que me ensena esta conexion?",
        intent: "Para conexiones intensas, atraccion espiritual, patrones repetidos y reciprocidad sana.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-she-my-soulmate-tarot",
        title: "Ella es mi alma gemela?",
        query: "Ella es mi alma gemela y que me ensena esta conexion?",
        intent: "Para conexiones intensas, atraccion espiritual, patrones repetidos y reciprocidad sana.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "yes-or-no-tarot-love",
        title: "Tarot del amor si o no",
        query: "Dame una respuesta de tarot del amor si o no con la razon detras.",
        intent: "Para una pregunta amorosa simple cuando necesitas tambien el motivo de la respuesta.",
        spread: "yes_no",
        group: "fast",
      },
      {
        slug: "career-tarot-reading",
        title: "Lectura de tarot para carrera",
        query: "Que deberia entender sobre mi camino profesional ahora?",
        intent: "Para cambios de trabajo, entrevistas, conflictos laborales, dinero y direccion profesional.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-get-the-job-tarot",
        title: "Conseguire el trabajo?",
        query: "Conseguire el trabajo, y que puedo hacer para mejorar mis posibilidades?",
        intent: "Para entrevistas, ofertas pendientes, postulaciones, ascensos y proximos pasos practicos.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-take-this-job-tarot",
        title: "Deberia aceptar este trabajo?",
        query: "Deberia aceptar este trabajo, y que debo comparar antes de decidir?",
        intent: "Para comparar salario, cultura, crecimiento, riesgo, estabilidad y si conviene negociar.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "should-i-accept-this-job-offer-tarot",
        title: "Deberia aceptar esta oferta de trabajo?",
        query: "Deberia aceptar esta oferta de trabajo y que debo negociar o revisar antes de decidir?",
        intent: "Para ofertas laborales, salario, beneficios, cultura, estabilidad, negociacion y encaje real.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-i-get-promoted-tarot",
        title: "Conseguire un ascenso?",
        query: "Conseguire un ascenso y que debo hacer para mejorar mis posibilidades?",
        intent: "Para evaluaciones, aumentos, reconocimiento, politica interna y conversaciones con jefes.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "what-career-is-right-for-me-tarot",
        title: "Que carrera es para mi?",
        query: "Que camino profesional es para mi y que paso deberia explorar ahora?",
        intent: "Para cambiar de industria, elegir carrera, sentirte estancado y probar una ruta con menor riesgo.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-start-a-business-tarot",
        title: "Deberia empezar un negocio?",
        query: "Deberia empezar este negocio y que debo preparar antes de avanzar?",
        intent: "Para ideas de negocio, emprendimiento, trabajo por cuenta propia, timing, riesgo de dinero y primera prueba.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-my-business-succeed-tarot",
        title: "Tendra exito mi negocio?",
        query: "Tendra exito mi negocio y en que debo enfocarme ahora?",
        intent: "Para lanzamientos, ventas, clientes, presion economica, recursos y foco operativo.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-be-successful-tarot",
        title: "Tendre exito?",
        query: "Tendre exito, y en que deberia enfocarme ahora?",
        intent: "Para metas, lanzamientos, examenes, proyectos creativos y la accion controlable que mejora tus posibilidades.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "should-i-quit-my-job-tarot",
        title: "Deberia renunciar a mi trabajo?",
        query: "Deberia renunciar a mi trabajo, y cual es el siguiente paso mas sabio?",
        intent: "Para burnout, lugares toxicos, timing financiero y decidir si quedarte, planear o salir.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "money-tarot-reading",
        title: "Lectura de tarot del dinero",
        query: "Que debo entender sobre mi dinero y mi proximo paso practico?",
        intent: "Para estres economico, ingresos, gastos, recursos practicos y un siguiente paso realista.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "daily-love-tarot",
        title: "Tarot diario del amor",
        query: "Que deberia entender sobre la energia amorosa de hoy y un siguiente paso concreto?",
        intent: "Para energia de relacion de hoy, sentimientos, timing y una accion posible.",
        spread: "relationship",
        group: "daily",
      },
      {
        slug: "daily-career-tarot",
        title: "Tarot diario de carrera",
        query: "En que deberia enfocarme en el trabajo hoy y que movimiento practico ayudaria?",
        intent: "Para presion laboral diaria, oportunidades, preparacion, timing y un paso profesional practico.",
        spread: "job_opportunity",
        group: "daily",
      },
      {
        slug: "daily-yes-or-no-tarot",
        title: "Tarot diario si o no",
        query: "Dame una respuesta diaria de tarot si o no con la razon detras.",
        intent: "Para una decision simple de hoy cuando necesitas direccion rapida y el motivo.",
        spread: "yes_no",
        group: "daily",
      },
      {
        slug: "daily-mood-tarot",
        title: "Tarot diario del estado de animo",
        query: "Que esta influyendo en mi estado de animo hoy y que me ayudaria a volver al centro?",
        intent: "Para patrones emocionales, detonantes, calma y un pequeno reinicio para hoy.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "daily-action-tarot",
        title: "Tarot diario de accion",
        query: "Cual es una accion concreta que puedo tomar hoy?",
        intent: "Para convertir la carta o pregunta de hoy en un siguiente paso claro.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "should-i-text-him-tarot",
        title: "Deberia escribirle hoy?",
        query: "Deberia escribirle hoy, y que deberia considerar primero?",
        intent: "Para decisiones rapidas de contacto donde necesitas una accion clara.",
        spread: "yes_no",
        group: "fast",
      },
      {
        title: "En que deberia enfocarme este mes?",
        query: "En que deberia enfocarme este mes, y que patron deberia notar?",
        intent: "Para una revision amplia que convierte la reflexion en una prioridad practica.",
        spread: "three_card",
        group: "fast",
      },
      {
        title: "Vale la pena seguir esta conexion?",
        query: "Vale la pena seguir esta conexion, y que energia deberia observar?",
        intent: "Para amor nuevo, citas inciertas y si el vinculo tiene potencial real.",
        spread: "love_connection",
        group: "love",
      },
    ],
    betterEyebrow: "Mejores preguntas",
    betterTitle: "Como elegir la pregunta correcta de tarot",
    betterBody:
      "Una buena pregunta nombra la situacion y deja espacio para interpretar. La meta es claridad accionable, no una prediccion fija que quite tu eleccion.",
    browseSpreads: "Ver todas las tiradas",
    startFree: "Empezar gratis",
    readGuide: "Leer guia",
    cardLabel: (count: number, spreadName: string) => `${count} carta${count === 1 ? "" : "s"} · ${spreadName}`,
    faqs: [
      {
        question: "Puedo empezar estas preguntas de tarot gratis?",
        answer:
          "Si. Cada pregunta puede abrir una lectura de tarot con IA gratis y la tirada ya seleccionada. La membresia queda para seguimientos profundos, historial guardado, tiradas avanzadas e informes largos.",
      },
      {
        question: "Conviene preguntar si/no o hacer una pregunta abierta?",
        answer:
          "Usa si/no cuando la decision es simple. Usa una pregunta abierta si necesitas contexto, patron emocional, timing o un siguiente paso practico.",
      },
      {
        question: "Por que cada pregunta usa una tirada distinta?",
        answer:
          "Una pregunta sobre un ex necesita mas posiciones que una pregunta si/no. Ajustar la tirada a la intencion hace que la lectura sea mas util que robar cartas al azar.",
      },
    ],
  },
  "pt-br": {
    locale: "pt-br",
    path: questionHubPaths["pt-br"],
    title: "Perguntas de tarot",
    description:
      "Escolha uma pergunta de tarot sobre amor, ex, mensagens, respostas sim ou nao, carreira e trabalho, e comece uma tiragem gratuita com IA.",
    headerLink: "/pt-br/tiragens-tarot",
    headerLinkLabel: "Tiragens de tarot",
    eyebrow: "Seletor de perguntas",
    heading: "Perguntas de tarot",
    intro:
      "Comece pela pergunta que voce realmente quer esclarecer e abra uma leitura gratis com a tiragem certa ja selecionada.",
    features: [
      { title: "Gratis primeiro", body: "Cada entrada abre uma leitura gratis antes de qualquer decisao de assinatura." },
      { title: "Intencao clara", body: "Amor, ex, carreira e sim/nao usam tiragens diferentes para evitar respostas genericas." },
      { title: "Pronto para busca", body: "Guias de alta intencao e links diretos para tiragens reforcam uns aos outros." },
    ],
    quickStartEyebrow: "Comeco rapido",
    quickStartTitle: "Abra uma tiragem gratis em um toque",
    quickStartBody:
      "Estas sao rotas de alta intencao para novos leitores. Cada link mantem a pergunta, a tiragem, o idioma e a atribuicao.",
    quickStartGroups: [
      {
        label: "Ex e contato zero",
        title: "Reconciliacao e silencio",
        body: "Para termino, espera, contato zero, mensagens pendentes e se reparar e realista.",
        slugs: ["will-my-ex-come-back-tarot", "no-contact-tarot-reading", "will-my-ex-reach-out-tarot"],
      },
      {
        label: "Sinais de amor",
        title: "Sentimentos e sinais mistos",
        body: "Para saber se os sentimentos sao mutuos, o que alguem pensa e se o interesse e real.",
        slugs: ["does-he-love-me-tarot", "how-does-he-feel-about-me-tarot", "what-does-she-think-of-me-tarot", "does-my-crush-like-me-tarot"],
      },
      {
        label: "Trabalho",
        title: "Carreira, ofertas e proximos passos",
        body: "Para mudancas de trabalho, entrevistas, pedir demissao, aceitar oferta, empreender e pressao financeira.",
        slugs: [
          "career-tarot-reading",
          "will-i-get-the-job-tarot",
          "should-i-accept-this-job-offer-tarot",
          "will-i-get-promoted-tarot",
          "what-career-is-right-for-me-tarot",
          "should-i-start-a-business-tarot",
          "should-i-quit-my-job-tarot",
        ],
      },
      {
        label: "Diario",
        title: "Volte amanha com uma pergunta clara",
        body: "Para amor, carreira, sim/nao, humor e acoes diarias que criam habito.",
        slugs: ["daily-love-tarot", "daily-career-tarot", "daily-yes-or-no-tarot"],
      },
    ],
    groups: [
      {
        label: "Amor",
        title: "Perguntas de amor e relacionamento",
        body: "Use quando voce precisa de clareza emocional: sentimentos, reconexao, timing, sinais mistos ou se um vinculo merece sua energia.",
        group: "love",
      },
      {
        label: "Carreira",
        title: "Perguntas de carreira e trabalho",
        body: "Use quando uma decisao profissional precisa de intuicao e passos concretos: ficar, sair, se preparar, negociar ou mudar de rumo.",
        group: "career",
      },
      {
        label: "Diario",
        title: "Perguntas de tarot diario",
        body: "Use quando voce quer um motivo concreto para voltar: amor, carreira, sim/nao, humor ou uma acao pratica para hoje.",
        group: "daily",
      },
      {
        label: "Clareza rapida",
        title: "Perguntas sim/nao e de direcao",
        body: "Use quando voce precisa de uma primeira resposta compacta e depois quer entender o motivo e o proximo passo.",
        group: "fast",
      },
    ],
    entries: [
      {
        slug: "will-my-ex-come-back-tarot",
        title: "Meu ex vai voltar?",
        query: "Meu ex vai voltar, e o que eu deveria entender antes de agir?",
        intent: "Para clareza apos termino, energia emocional pendente, timing e se vale mandar mensagem.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-he-love-me-tarot",
        title: "Ele me ama?",
        query: "Ele me ama, e qual e a energia emocional real entre nos?",
        intent: "Para sinais mistos, consistencia emocional e se a conexao e realmente mutua.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "how-does-he-feel-about-me-tarot",
        title: "O que ele sente por mim?",
        query: "O que ele sente por mim e o que devo entender antes de agir?",
        intent: "Para sinais mistos, atracao, emocao privada e se sentimentos podem virar acao.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "does-my-ex-miss-me-tarot",
        title: "Meu ex sente minha falta?",
        query: "Meu ex sente minha falta e o que esse sentimento significa agora?",
        intent: "Para silencio depois do termino, nostalgia, contato zero e se sentir falta basta para reconectar.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-he-come-back-tarot",
        title: "Ele vai voltar?",
        query: "Ele vai voltar e o que devo entender antes de esperar?",
        intent: "Para contato zero, esperanca de retorno, motivos, atrasos e limites saudaveis enquanto espera.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "future-spouse-tarot-reading",
        title: "Leitura do futuro conjuge",
        query: "O que devo saber sobre minha futura parceria e minha prontidao para um amor duradouro?",
        intent: "Para energia de futura parceria, casamento, timing, prontidao emocional e amor duradouro.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-he-thinking-about-me-tarot",
        title: "Ele esta pensando em mim?",
        query: "Ele esta pensando em mim, e que energia existe por tras do silencio dele?",
        intent: "Para silencio, respostas demoradas, contato zero e se pensamentos podem virar acao.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-he-think-of-me-tarot",
        title: "O que ele pensa de mim?",
        query: "O que ele pensa de mim, e o que devo entender sobre a atitude dele?",
        intent: "Para sinais mistos, atracao incerta, silencio e se a percepcao pode virar acao.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-contact-me-tarot",
        title: "Ele vai entrar em contato?",
        query: "Ele vai entrar em contato, e o que devo fazer enquanto espero?",
        intent: "Para contato zero, respostas demoradas, silencio depois de termino e decidir se esperar ainda ajuda.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "what-does-she-think-of-me-tarot",
        title: "O que ela pensa de mim?",
        query: "O que ela pensa de mim e o que devo entender sobre a atitude dela?",
        intent: "Para sinais mistos, pensamentos privados, atracao incerta, silencio e se a atencao dela pode virar acao.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-she-contact-me-tarot",
        title: "Ela vai entrar em contato?",
        query: "Ela vai entrar em contato e o que devo fazer enquanto espero?",
        intent: "Para contato zero, respostas demoradas, silencio depois de termino e limites saudaveis enquanto espera.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "is-this-relationship-over-tarot",
        title: "Este relacionamento acabou?",
        query: "Este relacionamento acabou, e qual e o proximo passo mais saudavel?",
        intent: "Para distancia emocional, conflito repetido, sinais de termino e se reparar e realista.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-move-on-tarot",
        title: "Devo seguir em frente?",
        query: "Devo seguir em frente, e o que me ajudaria a escolher encerramento com amor-proprio?",
        intent: "Para limbo apos termino, espera, apego, emocao pendente e decidir se encerrar e mais saudavel que segurar.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "no-contact-tarot-reading",
        title: "Leitura contato zero",
        query: "O que devo entender durante o contato zero e qual e o proximo passo mais saudavel?",
        intent: "Para silencio apos termino, respostas demoradas, distancia emocional, limites de espera e se contato ajudaria ou machucaria.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "does-no-contact-work-tarot",
        title: "Contato zero funciona?",
        query: "O contato zero esta funcionando e o que devo fazer agora?",
        intent: "Para estrategia de contato zero, silencio apos termino, distancia emocional, se esperar ajuda e quando parar de buscar sinais.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "will-my-ex-reach-out-tarot",
        title: "Meu ex vai me procurar?",
        query: "Meu ex vai me procurar e como devo responder se isso acontecer?",
        intent: "Para mensagens demoradas, contato zero, motivos de aproximacao, esperanca de reconciliacao e resposta calma.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "should-i-stay-or-leave-tarot",
        title: "Devo ficar ou ir embora?",
        query: "Devo ficar ou ir embora e qual e o proximo passo mais saudavel?",
        intent: "Para incerteza de relacionamento, conflito repetido, reparo, seguranca emocional e bem-estar.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "should-i-give-him-another-chance-tarot",
        title: "Devo dar outra chance?",
        query: "Devo dar outra chance e o que teria que mudar?",
        intent: "Para segunda chance, desculpas, confianca quebrada, condicoes de reparo, mudanca real e seguranca emocional.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "does-my-crush-like-me-tarot",
        title: "Meu crush gosta de mim?",
        query: "Meu crush gosta de mim e quais sinais devo confiar?",
        intent: "Para crushes, inicio de encontros, sinais sutis, atencao mista e saber se o interesse e mutuo.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-he-text-me-tarot",
        title: "Ele vai mandar mensagem?",
        query: "Ele vai mandar mensagem, e o que devo fazer enquanto espero?",
        intent: "Para respostas demoradas, contato zero, bloqueios de comunicacao e decidir se esperar ainda ajuda.",
        spread: "yes_no",
        group: "love",
      },
      {
        slug: "should-i-break-up-with-him-tarot",
        title: "Devo terminar com ele?",
        query: "Devo terminar com ele, e qual e o proximo passo mais saudavel?",
        intent: "Para conflito repetido, confianca quebrada, distancia emocional, condicoes de reparo e seguranca na relacao.",
        spread: "relationship",
        group: "love",
      },
      {
        slug: "twin-flame-tarot-reading",
        title: "Leitura de tarot chama gemea",
        query: "O que devo entender sobre esta conexao de chama gemea e meu proximo passo mais saudavel?",
        intent: "Para conexoes intensas, separacao, esperanca de volta, licoes, espelhamento e checar se o vinculo e seguro.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "will-i-get-married-tarot",
        title: "Vou me casar?",
        query: "Vou me casar, e o que devo entender sobre minha prontidao para amor duradouro?",
        intent: "Para compromisso, timing de casamento, parceria futura, prontidao emocional e amor duradouro realista.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "when-will-i-find-love-tarot",
        title: "Quando vou encontrar amor?",
        query: "Quando vou encontrar amor, e para o que devo me abrir agora?",
        intent: "Para pessoas solteiras, cansaco de encontros, timing amoroso e padroes que precisam mudar primeiro.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "what-are-his-intentions-tarot",
        title: "Quais sao as intencoes dele?",
        query: "Quais sao as intencoes dele comigo e o que devo observar nas atitudes?",
        intent: "Para encontros incertos, sinais mistos e se a atracao e seria, casual ou evitativa.",
        spread: "their_thoughts",
        group: "love",
      },
      {
        slug: "will-we-get-back-together-tarot",
        title: "Vamos voltar?",
        query: "Vamos voltar e o que teria que mudar para ser saudavel?",
        intent: "Para reconciliacao, segunda chance, sentimentos pendentes e se reparar e realista.",
        spread: "breakup_recovery",
        group: "love",
      },
      {
        slug: "is-he-my-soulmate-tarot",
        title: "Ele e minha alma gemea?",
        query: "Ele e minha alma gemea e o que esta conexao me ensina?",
        intent: "Para conexoes intensas, atracao espiritual, padroes repetidos e reciprocidade saudavel.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "is-she-my-soulmate-tarot",
        title: "Ela e minha alma gemea?",
        query: "Ela e minha alma gemea e o que esta conexao me ensina?",
        intent: "Para conexoes intensas, atracao espiritual, padroes repetidos e reciprocidade saudavel.",
        spread: "love_connection",
        group: "love",
      },
      {
        slug: "yes-or-no-tarot-love",
        title: "Tarot do amor sim ou nao",
        query: "Me de uma resposta de tarot do amor sim ou nao com o motivo por tras.",
        intent: "Para uma pergunta amorosa simples quando voce tambem quer entender a razao da resposta.",
        spread: "yes_no",
        group: "fast",
      },
      {
        slug: "career-tarot-reading",
        title: "Leitura de tarot para carreira",
        query: "O que eu deveria entender sobre meu caminho profissional agora?",
        intent: "Para mudancas de emprego, entrevistas, conflitos no trabalho, dinheiro e direcao profissional.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-get-the-job-tarot",
        title: "Vou conseguir o emprego?",
        query: "Vou conseguir o emprego, e o que posso fazer para melhorar minhas chances?",
        intent: "Para entrevistas, ofertas pendentes, candidaturas, promocoes e proximos passos praticos.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-take-this-job-tarot",
        title: "Devo aceitar este trabalho?",
        query: "Devo aceitar este trabalho, e o que devo comparar antes de decidir?",
        intent: "Para comparar salario, cultura, crescimento, risco, estabilidade e se convem negociar.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "should-i-accept-this-job-offer-tarot",
        title: "Devo aceitar esta oferta de trabalho?",
        query: "Devo aceitar esta oferta de trabalho e o que devo negociar ou revisar antes de decidir?",
        intent: "Para ofertas de emprego, salario, beneficios, cultura, estabilidade, negociacao e encaixe real.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-i-get-promoted-tarot",
        title: "Vou ser promovido?",
        query: "Vou ser promovido e o que devo fazer para melhorar minhas chances?",
        intent: "Para avaliacoes, aumentos, reconhecimento, politica interna e conversas com lideranca.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "what-career-is-right-for-me-tarot",
        title: "Qual carreira combina comigo?",
        query: "Qual caminho profissional combina comigo e que passo devo explorar agora?",
        intent: "Para mudar de area, escolher carreira, se sentir travado e testar uma rota com menos risco.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "should-i-start-a-business-tarot",
        title: "Devo comecar um negocio?",
        query: "Devo comecar este negocio e o que devo preparar antes de avancar?",
        intent: "Para ideias de negocio, empreendedorismo, trabalho por conta propria, timing, risco financeiro e primeiro teste.",
        spread: "binary_choice",
        group: "career",
      },
      {
        slug: "will-my-business-succeed-tarot",
        title: "Meu negocio vai dar certo?",
        query: "Meu negocio vai dar certo e em que devo focar agora?",
        intent: "Para lancamentos, vendas, clientes, pressao financeira, recursos e foco operacional.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "will-i-be-successful-tarot",
        title: "Vou ter sucesso?",
        query: "Vou ter sucesso, e em que devo focar agora?",
        intent: "Para metas, lancamentos, provas, projetos criativos e a acao controlavel que melhora suas chances.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "should-i-quit-my-job-tarot",
        title: "Devo pedir demissao?",
        query: "Devo pedir demissao, e qual e o proximo passo mais sabio?",
        intent: "Para burnout, ambientes toxicos, timing financeiro e decidir se fica, planeja ou sai.",
        spread: "job_opportunity",
        group: "career",
      },
      {
        slug: "money-tarot-reading",
        title: "Leitura de tarot do dinheiro",
        query: "O que devo entender sobre meu dinheiro e meu proximo passo pratico?",
        intent: "Para estresse financeiro, renda, gastos, recursos praticos e um proximo passo realista.",
        spread: "three_card",
        group: "career",
      },
      {
        slug: "daily-love-tarot",
        title: "Tarot diario do amor",
        query: "O que devo entender sobre a energia amorosa de hoje e um proximo passo concreto?",
        intent: "Para energia de relacionamento de hoje, sentimentos, timing e uma acao possivel.",
        spread: "relationship",
        group: "daily",
      },
      {
        slug: "daily-career-tarot",
        title: "Tarot diario de carreira",
        query: "No que devo focar no trabalho hoje e que movimento pratico ajudaria?",
        intent: "Para pressao diaria no trabalho, oportunidades, preparacao, timing e um passo profissional pratico.",
        spread: "job_opportunity",
        group: "daily",
      },
      {
        slug: "daily-yes-or-no-tarot",
        title: "Tarot diario sim ou nao",
        query: "Me de uma resposta diaria de tarot sim ou nao com o motivo por tras.",
        intent: "Para uma decisao simples de hoje quando voce precisa de direcao rapida e do motivo.",
        spread: "yes_no",
        group: "daily",
      },
      {
        slug: "daily-mood-tarot",
        title: "Tarot diario do humor",
        query: "O que esta influenciando meu humor hoje e o que me ajudaria a voltar ao centro?",
        intent: "Para padroes emocionais, gatilhos, aterramento e um pequeno recomeco para hoje.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "daily-action-tarot",
        title: "Tarot diario de acao",
        query: "Qual e uma acao concreta que posso tomar hoje?",
        intent: "Para transformar a carta ou pergunta de hoje em um proximo passo claro.",
        spread: "three_card",
        group: "daily",
      },
      {
        slug: "should-i-text-him-tarot",
        title: "Devo mandar mensagem hoje?",
        query: "Devo mandar mensagem hoje, e o que devo considerar primeiro?",
        intent: "Para decisoes rapidas de contato em que voce precisa de uma acao clara.",
        spread: "yes_no",
        group: "fast",
      },
      {
        title: "No que devo focar este mes?",
        query: "No que devo focar este mes, e que padrao devo perceber?",
        intent: "Para um check-in mais amplo que transforma reflexao em uma prioridade pratica.",
        spread: "three_card",
        group: "fast",
      },
      {
        title: "Vale a pena seguir essa conexao?",
        query: "Vale a pena seguir essa conexao, e que energia devo observar?",
        intent: "Para amor novo, encontros incertos e se o vinculo tem potencial real.",
        spread: "love_connection",
        group: "love",
      },
    ],
    betterEyebrow: "Perguntas melhores",
    betterTitle: "Como escolher a pergunta certa de tarot",
    betterBody:
      "Uma boa pergunta nomeia a situacao e deixa espaco para interpretacao. A meta e clareza acionavel, nao uma previsao fixa que tira sua escolha.",
    browseSpreads: "Ver todas as tiragens",
    startFree: "Comecar gratis",
    readGuide: "Ler guia",
    cardLabel: (count: number, spreadName: string) => `${count} carta${count === 1 ? "" : "s"} · ${spreadName}`,
    faqs: [
      {
        question: "Posso comecar essas perguntas de tarot gratis?",
        answer:
          "Sim. Cada pergunta pode abrir uma leitura de tarot com IA gratis e a tiragem ja selecionada. A assinatura fica para aprofundamentos, historico salvo, tiragens avancadas e relatorios longos.",
      },
      {
        question: "E melhor perguntar sim/nao ou fazer uma pergunta aberta?",
        answer:
          "Use sim/nao quando a escolha e simples. Use uma pergunta aberta quando voce precisa de contexto, padrao emocional, timing ou um proximo passo pratico.",
      },
      {
        question: "Por que cada pergunta usa uma tiragem diferente?",
        answer:
          "Uma pergunta sobre ex precisa de mais posicoes que uma pergunta sim/nao. Combinar a tiragem com a intencao torna a leitura mais util do que tirar cartas genericamente.",
      },
    ],
  },
} satisfies Record<TarotQuestionHubLocale, QuestionPageCopy>

function getQuestionHubCopy(locale: TarotQuestionHubLocale) {
  return copyByLocale[locale]
}

function guideHref(entry: QuestionEntry, locale: TarotQuestionHubLocale) {
  if (!entry.slug) return getTarotSpreadHubPath(locale)
  return getSeoPage(entry.slug, locale)?.path || `/${entry.slug}`
}

function quickStartGroupedEntries(copy: QuestionPageCopy) {
  return copy.quickStartGroups
    .map((group) => ({
      ...group,
      entries: group.slugs
        .map((slug) => copy.entries.find((entry) => entry.slug === slug))
        .filter((entry): entry is QuestionEntry => Boolean(entry)),
    }))
    .filter((group) => group.entries.length > 0)
}

function quickStartEntries(copy: QuestionPageCopy) {
  return quickStartGroupedEntries(copy).flatMap((group) => group.entries)
}

function readingHref(entry: QuestionEntry, locale: TarotQuestionHubLocale, medium = "question_hub") {
  const params = new URLSearchParams({
    q: entry.query,
    auto: "1",
    spread: entry.spread,
    source: locale === "en" ? "tarot-questions" : `${locale}-tarot-questions`,
    lang: locale,
    utm_source: locale === "en" ? "tarot_questions" : `${locale}_tarot_questions`,
    utm_medium: medium,
    utm_campaign: entry.slug || entry.group,
  })
  return `/input?${params.toString()}`
}

function searchCopy(locale: TarotQuestionHubLocale) {
  if (locale === "es") {
    return {
      eyebrow: "Busqueda de preguntas",
      title: "Preguntas de tarot que coinciden",
      body: "Elige una pregunta cercana y abre una lectura gratis con la tirada adecuada.",
      emptyTitle: "No encontramos una coincidencia exacta",
      emptyBody: "Estas preguntas populares son buenos puntos de partida para una lectura gratis.",
      startFree: "Empezar gratis",
      readGuide: "Leer guia",
    }
  }

  if (locale === "pt-br") {
    return {
      eyebrow: "Busca de perguntas",
      title: "Perguntas de tarot relacionadas",
      body: "Escolha uma pergunta proxima e abra uma leitura gratis com a tiragem adequada.",
      emptyTitle: "Nao encontramos uma correspondencia exata",
      emptyBody: "Estas perguntas populares sao bons pontos de partida para uma leitura gratis.",
      startFree: "Comecar gratis",
      readGuide: "Ler guia",
    }
  }

  return {
    eyebrow: "Question search",
    title: "Matching tarot questions",
    body: "Pick the closest question and open a free reading with the right spread already selected.",
    emptyTitle: "No exact match yet",
    emptyBody: "These popular question paths are strong starting points for a free reading.",
    startFree: "Start free",
    readGuide: "Read guide",
  }
}

function searchEntries(copy: QuestionPageCopy): TarotQuestionSearchEntry[] {
  return copy.entries.map((entry) => {
    const spread = SPREAD_CONFIGS[entry.spread]
    return {
      key: entry.slug || entry.title,
      title: entry.title,
      query: entry.query,
      intent: entry.intent,
      spreadLabel: copy.cardLabel(spread.cardCount, spread.nameEn),
      guideHref: guideHref(entry, copy.locale),
      readingHref: readingHref(entry, copy.locale),
    }
  })
}

function buildStructuredData(copy: QuestionPageCopy) {
  const quickEntries = quickStartEntries(copy)

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
        "@id": `${appUrl}${copy.path}#question-list`,
        name: `${copy.title} on POPTarot`,
        itemListElement: copy.entries.map((entry, index) => {
          const spread = SPREAD_CONFIGS[entry.spread]
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "WebPage",
              name: entry.title,
              description: entry.intent,
              url: `${appUrl}${guideHref(entry, copy.locale)}`,
              potentialAction: {
                "@type": "Action",
                name: copy.startFree,
                target: `${appUrl}${readingHref(entry, copy.locale)}`,
                result: {
                  "@type": "CreativeWork",
                  name: `${spread.nameEn} AI tarot reading`,
                },
              },
            },
          }
        }),
      },
      {
        "@type": "ItemList",
        "@id": `${appUrl}${copy.path}#quick-start-question-paths`,
        name: copy.quickStartTitle,
        description: copy.quickStartBody,
        itemListElement: quickEntries.map((entry, index) => {
          const spread = SPREAD_CONFIGS[entry.spread]
          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "WebPage",
              name: entry.title,
              description: entry.intent,
              url: `${appUrl}${guideHref(entry, copy.locale)}`,
              isAccessibleForFree: true,
              potentialAction: {
                "@type": "Action",
                name: copy.startFree,
                target: `${appUrl}${readingHref(entry, copy.locale, "question_hub_quick_start")}`,
                result: {
                  "@type": "CreativeWork",
                  name: `${spread.nameEn} AI tarot reading`,
                },
              },
            },
          }
        }),
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}${copy.path}#faq`,
        mainEntity: copy.faqs.map((item) => ({
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

export function getTarotQuestionHubMetadata(locale: TarotQuestionHubLocale): Metadata {
  const copy = getQuestionHubCopy(locale)

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${appUrl}${copy.path}`,
      languages: {
        en: questionHubPaths.en,
        es: questionHubPaths.es,
        "pt-br": questionHubPaths["pt-br"],
        "x-default": questionHubPaths.en,
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

export function TarotQuestionsPageView({ locale }: { locale: TarotQuestionHubLocale }) {
  const copy = getQuestionHubCopy(locale)
  const structuredData = buildStructuredData(copy)
  const questionSearchEntries = searchEntries(copy)
  const quickGroups = quickStartGroupedEntries(copy)
  const quickEntries = quickStartEntries(copy)

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
          <Link href={copy.headerLink} className="inline-flex min-h-10 items-center text-sm text-[#c9c0ff]/85 transition hover:text-white">
            {copy.headerLinkLabel}
          </Link>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(123,83,178,0.34),transparent_40%),linear-gradient(180deg,#12091f_0%,#080310_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/78">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-6xl">
              {copy.heading}
            </h1>
            <p className="mt-6 text-base leading-8 text-white/66 sm:text-lg">{copy.intro}</p>
          </div>
          {quickEntries.length > 0 && (
            <div
              data-question-quick-start
              className="mt-8 rounded-lg border border-[#bfb6ff]/18 bg-[#bfb6ff]/[0.045] p-4 sm:p-5"
            >
              <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#c9c0ff]/78">
                    {copy.quickStartEyebrow}
                  </p>
                  <h2 className="mt-2 font-serif text-xl leading-tight text-white sm:text-2xl">
                    {copy.quickStartTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/58">{copy.quickStartBody}</p>
                </div>
                <div data-question-quick-start-groups className="grid gap-3">
                  {quickGroups.map((group) => (
                    <section
                      key={group.label}
                      data-question-quick-start-group
                      data-question-quick-start-group-label={group.label}
                      className="rounded-lg border border-white/10 bg-black/[0.18] p-3"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-[#c9c0ff]/72">{group.label}</p>
                          <h3 className="mt-1 break-words text-sm font-medium leading-snug text-white">{group.title}</h3>
                        </div>
                        <p className="text-xs leading-5 text-white/45 sm:max-w-[17rem]">{group.body}</p>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {group.entries.map((entry) => {
                          const spread = SPREAD_CONFIGS[entry.spread]
                          return (
                            <Link
                              key={entry.slug || entry.title}
                              data-question-quick-start-card
                              data-question-quick-start-slug={entry.slug || undefined}
                              data-question-quick-start-spread={entry.spread}
                              data-question-quick-start-group-card={group.label}
                              href={readingHref(entry, copy.locale, "question_hub_quick_start")}
                              aria-label={`${copy.startFree}: ${entry.query}`}
                              className="group flex min-h-[7rem] flex-col justify-between rounded-lg border border-white/10 bg-[#0d0618]/72 p-3 transition hover:border-[#bfb6ff]/45 hover:bg-white/[0.055]"
                            >
                              <span className="text-[10px] uppercase tracking-[0.14em] text-[#c9c0ff]/72">
                                {copy.cardLabel(spread.cardCount, spread.nameEn)}
                              </span>
                              <span className="mt-2 break-words text-sm font-medium leading-snug text-white">
                                {entry.title}
                              </span>
                              <span className="mt-3 inline-flex items-center gap-1 text-xs text-white/45 transition group-hover:text-white/72">
                                {copy.startFree}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {copy.features.map((item) => (
              <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <h2 className="text-sm font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <TarotQuestionSearchResults entries={questionSearchEntries} copy={searchCopy(locale)} />
      </Suspense>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-5">
          {copy.groups.map((group) => (
            <section key={group.label} className="rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
              <div className="grid gap-5 lg:grid-cols-[0.85fr_1.45fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#c9c0ff]/75">{group.label}</p>
                  <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">{group.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/58">{group.body}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {copy.entries
                    .filter((entry) => entry.group === group.group)
                    .map((entry) => {
                      const spread = SPREAD_CONFIGS[entry.spread]
                      return (
                        <article
                          key={entry.title}
                          data-question-entry-card
                          data-question-entry-slug={entry.slug || undefined}
                          data-question-entry-spread={entry.spread}
                          data-question-entry-group={entry.group}
                          className="rounded-lg border border-white/10 bg-[#0d0618]/72 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9c0ff]/70">
                                {copy.cardLabel(spread.cardCount, spread.nameEn)}
                              </p>
                              <h3 className="mt-2 text-lg font-medium leading-snug text-white">{entry.title}</h3>
                            </div>
                            <Search className="mt-1 h-4 w-4 shrink-0 text-[#c9c0ff]/60" />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-white/58">{entry.intent}</p>
                          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <Link
                              data-question-entry-start
                              href={readingHref(entry, copy.locale)}
                              aria-label={`${copy.startFree}: ${entry.query}`}
                              className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#f4f0ff_0%,#c9c0ff_50%,#8f80ee_100%)] px-3 py-2 text-sm font-medium text-[#120c22] shadow-[0_16px_34px_rgba(143,128,238,0.18)] transition hover:brightness-110"
                            >
                              {copy.startFree}
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                            <Link
                              data-question-entry-guide
                              href={guideHref(entry, copy.locale)}
                              aria-label={`${copy.readGuide}: ${entry.title}`}
                              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-white/12 px-3 py-2 text-sm text-white/68 transition hover:border-[#bfb6ff]/40 hover:text-white"
                            >
                              {copy.readGuide}
                            </Link>
                          </div>
                        </article>
                      )
                    })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0618]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c9c0ff]/75">{copy.betterEyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl text-white">{copy.betterTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58">{copy.betterBody}</p>
            <Link
              href={copy.headerLink}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#bfb6ff]/26 px-4 py-2 text-sm text-[#eeeaff] transition hover:border-[#bfb6ff]/50 hover:bg-white/[0.04]"
            >
              {copy.browseSpreads}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {copy.faqs.map((item) => (
              <article key={item.question} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-medium text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
