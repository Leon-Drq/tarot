export type SeoPage = {
  slug: string
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  intent: string
  ctaQuestion: string
  cards: number[]
  sections: Array<{
    heading: string
    body: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const seoPages: SeoPage[] = [
  {
    slug: "free-ai-tarot-reading",
    title: "Free AI Tarot Reading",
    description:
      "Draw tarot cards online and receive a free AI tarot reading for love, career, daily guidance, and personal decisions.",
    eyebrow: "Free Online Tarot",
    h1: "Free AI Tarot Reading",
    intro:
      "Start with one clear question, draw your cards, and receive a focused AI interpretation without creating an account first.",
    intent: "A fast first reading for anyone who wants practical guidance before committing to a deeper spread.",
    ctaQuestion: "What do I most need to understand right now?",
    cards: [0, 2, 17],
    sections: [
      {
        heading: "How the free reading works",
        body:
          "Ask one sincere question, choose your cards, reveal them, and read an interpretation shaped around your actual question and card positions.",
      },
      {
        heading: "What to ask",
        body:
          "Open questions work best. Try asking what you need to notice, what energy surrounds a choice, or what action would help you move forward.",
      },
      {
        heading: "When to upgrade",
        body:
          "Membership is useful after the first reading if you want unlimited follow-up questions, saved history, advanced spreads, and deeper reports.",
      },
    ],
    faqs: [
      {
        question: "Is the first AI tarot reading free?",
        answer:
          "Yes. You can start a reading from the site without paying first. Membership adds unlimited use and saved history.",
      },
      {
        question: "Do I need to log in before drawing cards?",
        answer:
          "No. The reading flow lets you begin first, then you can keep history or upgrade after you see the result.",
      },
    ],
  },
  {
    slug: "love-tarot-reading",
    title: "Love Tarot Reading",
    description:
      "Ask a relationship question and draw tarot cards for an AI love reading about feelings, timing, connection, and next steps.",
    eyebrow: "Relationship Guidance",
    h1: "Love Tarot Reading",
    intro:
      "Use a love tarot reading when you need a calmer view of a relationship, a crush, a breakup, or the emotional pattern between two people.",
    intent:
      "Best for questions about feelings, communication, reconciliation, commitment, or whether a relationship is worth continuing.",
    ctaQuestion: "What is the real energy between us right now?",
    cards: [6, 36, 37],
    sections: [
      {
        heading: "Ask about the connection",
        body:
          "Tarot is strongest when the question gives room for nuance. Instead of asking for a yes or no verdict, ask what the cards reveal about the connection.",
      },
      {
        heading: "Read the pattern, not only one card",
        body:
          "A relationship reading looks at the whole spread: attraction, fear, timing, communication, and the choice you can control.",
      },
      {
        heading: "Use follow-up questions carefully",
        body:
          "After the first answer, ask one precise follow-up. This keeps the reading grounded instead of chasing reassurance.",
      },
    ],
    faqs: [
      {
        question: "Can tarot tell me if someone loves me?",
        answer:
          "A love reading can explore emotional signals and relationship dynamics, but it should be used as guidance, not as control over another person's choices.",
      },
      {
        question: "What is a good love tarot question?",
        answer:
          "Try: What is the real energy between us now? What should I understand before I act? What pattern keeps repeating in this relationship?",
      },
    ],
  },
  {
    slug: "daily-tarot",
    title: "Daily Tarot Reading",
    description:
      "Draw a daily tarot card or spread for today's energy, practical guidance, and a clear theme to carry through the day.",
    eyebrow: "Today\u2019s Energy",
    h1: "Daily Tarot Reading",
    intro:
      "A daily tarot reading gives you one grounded theme for the day, helping you notice the choice, emotion, or opportunity that deserves attention.",
    intent:
      "Use it in the morning for focus, at midday for recalibration, or at night to reflect on what the day was teaching you.",
    ctaQuestion: "What energy should guide me today?",
    cards: [19, 10, 14],
    sections: [
      {
        heading: "Keep it simple",
        body:
          "Daily tarot works best when the question is small and immediate. Ask what to notice today, not what your entire future will become.",
      },
      {
        heading: "Turn the reading into action",
        body:
          "After reading the card, choose one small action that matches the advice. The value is in how you move through the day.",
      },
      {
        heading: "Track patterns over time",
        body:
          "Members can save reading history, which makes it easier to see repeated cards, moods, and themes across multiple days.",
      },
    ],
    faqs: [
      {
        question: "Should I do a daily tarot reading every day?",
        answer:
          "Yes, if it helps you reflect. Keep the question simple and avoid repeating the same question many times in one day.",
      },
      {
        question: "Is a daily card enough?",
        answer:
          "For a quick check-in, one card is enough. For a more complex situation, a three-card spread can show context and advice.",
      },
    ],
  },
  {
    slug: "yes-or-no-tarot",
    title: "Yes or No Tarot",
    description:
      "Use yes or no tarot for a quick decision reading, with AI interpretation that explains the energy behind the answer.",
    eyebrow: "Decision Reading",
    h1: "Yes or No Tarot",
    intro:
      "A yes or no tarot reading is useful when you need a quick signal, but the real value is understanding why the answer leans one way.",
    intent:
      "Best for decisions with a clear action: reach out, wait, accept, decline, continue, or change course.",
    ctaQuestion: "Should I move forward with this choice?",
    cards: [11, 12, 20],
    sections: [
      {
        heading: "Ask a clean question",
        body:
          "Make the question specific and time-bound. The clearer the decision, the easier it is to read the cards without forcing the answer.",
      },
      {
        heading: "Look for the reason",
        body:
          "The card's orientation and meaning can show whether the situation has momentum, resistance, hidden information, or a need for patience.",
      },
      {
        heading: "Avoid repeating the same question",
        body:
          "If the result feels uncomfortable, ask what you need to understand next instead of asking the same yes or no question again.",
      },
    ],
    faqs: [
      {
        question: "Can tarot answer yes or no questions?",
        answer:
          "It can give a directional answer, but the explanation matters. Tarot is most useful when it reveals the conditions around the choice.",
      },
      {
        question: "What should I do after a yes or no reading?",
        answer:
          "Use the answer as a reflection point, then check whether the advice matches your real-world facts and responsibilities.",
      },
    ],
  },
  {
    slug: "career-tarot",
    title: "Career Tarot Reading",
    description:
      "Ask a career tarot question about work, money, direction, job changes, creative projects, or professional timing.",
    eyebrow: "Work And Direction",
    h1: "Career Tarot Reading",
    intro:
      "Career tarot helps you examine direction, timing, motivation, and the unseen pattern around a work or money decision.",
    intent:
      "Best for job changes, interviews, creative projects, workplace conflict, business timing, and long-term direction.",
    ctaQuestion: "What should I understand about my career path now?",
    cards: [1, 7, 21],
    sections: [
      {
        heading: "Clarify the decision",
        body:
          "Career readings are more helpful when tied to a concrete choice: stay or move, pitch or wait, study or launch, negotiate or observe.",
      },
      {
        heading: "Separate fear from signal",
        body:
          "The cards can help distinguish useful caution from self-doubt, especially when a path is promising but uncomfortable.",
      },
      {
        heading: "Use deeper spreads for big moves",
        body:
          "A major career transition often needs more than one card. Advanced spreads can examine obstacles, resources, timing, and likely outcomes.",
      },
    ],
    faqs: [
      {
        question: "Can tarot help with career decisions?",
        answer:
          "Tarot can help you reflect on motivation, risk, timing, and next steps. It should complement practical research and planning.",
      },
      {
        question: "What is a good career tarot question?",
        answer:
          "Try: What is blocking my career growth? What should I focus on this month? What should I know before changing jobs?",
      },
    ],
  },
  {
    slug: "tarot-card-meanings",
    title: "Tarot Card Meanings",
    description:
      "Learn core tarot card meanings for upright and reversed cards, then draw your own spread for a personalized AI interpretation.",
    eyebrow: "Card Meanings",
    h1: "Tarot Card Meanings",
    intro:
      "Tarot card meanings are a language of symbols. Each card changes depending on the question, position, and whether it appears upright or reversed.",
    intent:
      "Use this page as a starting point before drawing cards, then let the full reading connect the symbols to your situation.",
    ctaQuestion: "What message do these cards have for me?",
    cards: [2, 8, 18],
    sections: [
      {
        heading: "Upright and reversed meanings",
        body:
          "Upright meanings often show the active or integrated form of a card. Reversed meanings can show delay, imbalance, resistance, or a private inner process.",
      },
      {
        heading: "Position changes meaning",
        body:
          "The same card feels different in a past, present, future, obstacle, advice, or outcome position. Context is part of the interpretation.",
      },
      {
        heading: "The spread tells a story",
        body:
          "A strong reading connects cards together rather than treating them as isolated definitions. The relationship between cards is where insight appears.",
      },
    ],
    faqs: [
      {
        question: "Do reversed tarot cards always mean something bad?",
        answer:
          "No. A reversed card can show blocked energy, a private process, delay, or a need to rebalance the card's theme.",
      },
      {
        question: "Should beginners memorize every tarot meaning?",
        answer:
          "Meanings help, but context matters more. Start with a few keywords, then read how the card answers the question in its spread position.",
      },
    ],
  },
]

export const seoPageMap = new Map(seoPages.map((page) => [page.slug, page]))

export function getSeoPage(slug: string) {
  return seoPageMap.get(slug)
}
