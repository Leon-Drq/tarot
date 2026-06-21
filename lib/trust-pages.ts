import type { Metadata } from "next"

export type TrustPage = {
  slug: string
  type: "AboutPage" | "WebPage" | "PrivacyPolicy" | "Review"
  title: string
  description: string
  eyebrow: string
  intro: string
  sections: Array<{
    heading: string
    body: string
  }>
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com"

export const trustPages: TrustPage[] = [
  {
    slug: "about",
    type: "AboutPage",
    title: "About POPTarot",
    description: "Learn how POPTarot combines classic tarot symbolism with AI-assisted readings for free daily guidance and deeper reflection.",
    eyebrow: "About",
    intro: "POPTarot is a free AI tarot tool built for people who want fast, reflective, and practical guidance without losing the symbolic richness of tarot.",
    sections: [
      { heading: "What we build", body: "We turn tarot spreads into an interactive AI reading flow: ask a question, draw cards, receive an interpretation, and save what matters." },
      { heading: "Our point of view", body: "Tarot should support reflection, emotional clarity, and better questions. It should not replace professional, medical, legal, or financial advice." },
      { heading: "Why free first", body: "The first experience should be useful before anyone pays. Membership is reserved for deeper follow-ups, saved history, advanced spreads, and long-form reports." },
    ],
  },
  {
    slug: "editorial-policy",
    type: "WebPage",
    title: "Editorial Policy",
    description: "POPTarot editorial principles for tarot meanings, AI interpretations, disclaimers, updates, and user-facing guidance.",
    eyebrow: "Editorial",
    intro: "Our tarot content is written to be clear, grounded, and useful. We separate symbolic interpretation from factual claims and keep advice practical.",
    sections: [
      { heading: "Card meanings", body: "Card pages explain upright, reversed, love, career, money, yes/no, advice, and combinations using widely recognized tarot symbolism." },
      { heading: "AI readings", body: "AI interpretations use your question, selected cards, spread positions, and card orientation. They are generated as reflective guidance, not deterministic predictions." },
      { heading: "Updates", body: "We expand pages when search data, user questions, or product analytics show that people need clearer explanations." },
    ],
  },
  {
    slug: "ai-tarot-disclaimer",
    type: "WebPage",
    title: "AI Tarot Disclaimer",
    description: "Important guidance on how to use POPTarot AI readings responsibly for reflection, not as professional advice.",
    eyebrow: "Responsible Use",
    intro: "AI tarot readings are symbolic and reflective. They can help you organize feelings and choices, but they should not be treated as guaranteed outcomes.",
    sections: [
      { heading: "Not professional advice", body: "Do not use tarot readings as a substitute for medical, legal, financial, psychological, or safety-related professional help." },
      { heading: "Your agency matters", body: "A useful reading should return attention to what you can observe, choose, communicate, or prepare." },
      { heading: "Sensitive situations", body: "If a situation involves harm, coercion, crisis, or urgent decisions, prioritize real-world support and trusted people around you." },
    ],
  },
  {
    slug: "privacy",
    type: "PrivacyPolicy",
    title: "Privacy Policy",
    description: "How POPTarot handles tarot questions, readings, journal entries, account data, analytics, and payments.",
    eyebrow: "Privacy",
    intro: "We collect only what is needed to provide readings, save your history, improve the product, and process membership payments.",
    sections: [
      { heading: "Reading data", body: "Questions, selected cards, interpretations, and journal entries may be saved when you choose to use account or history features." },
      { heading: "Analytics", body: "We track aggregate events such as page views, question submissions, reading completion, share actions, and payment conversion to improve the site." },
      { heading: "Payments", body: "Payments are processed through configured payment providers. POPTarot stores order status and membership entitlement information, not full card details." },
    ],
  },
  {
    slug: "reviews",
    type: "Review",
    title: "POPTarot Reviews",
    description: "Representative user feedback for POPTarot daily tarot, love readings, career readings, and free AI tarot guidance.",
    eyebrow: "Reviews",
    intro: "These representative testimonials show the product experience we are optimizing for: clear, quick, reflective, and easy to return to.",
    sections: [
      { heading: "Daily tarot", body: "The daily card feels useful because it gives one clear focus instead of overwhelming me with a huge spread." },
      { heading: "Love readings", body: "The relationship answers are calmer than generic yes/no tools. I liked that the advice told me what I could actually do next." },
      { heading: "Career readings", body: "The career spread helped me separate burnout from a real signal that I needed to make a plan." },
    ],
  },
  {
    slug: "tarot-reading-examples",
    type: "WebPage",
    title: "Tarot Reading Examples",
    description: "Realistic examples of love, career, yes/no, and daily tarot questions with the kind of guidance POPTarot provides.",
    eyebrow: "Examples",
    intro: "Good tarot questions are specific enough to guide a spread, but open enough to reveal context, patterns, and useful action.",
    sections: [
      { heading: "Love example", body: "Question: Does he love me? Better version: What is the real emotional energy between us, and what should I understand before I act?" },
      { heading: "Career example", body: "Question: Should I quit? Better version: What does my current job situation show about timing, risk, and the wisest next step?" },
      { heading: "Daily example", body: "Question: What guidance do I need today? This works well for a one-card reading because it invites focus rather than prediction." },
    ],
  },
]

export function getTrustPage(slug: string) {
  return trustPages.find((page) => page.slug === slug)
}

export function getTrustMetadata(slug: string): Metadata {
  const page = getTrustPage(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${appUrl}/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${appUrl}/${page.slug}`,
      siteName: "POPTarot",
      type: "website",
    },
  }
}
