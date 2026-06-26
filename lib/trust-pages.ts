import type { Metadata } from "next"
import { appUrl, siteName, trustLinks } from "@/lib/site"
import { representativeTestimonials } from "@/lib/trust-signals"

export type TrustPage = {
  slug: string
  type: "AboutPage" | "WebPage" | "PrivacyPolicy" | "CollectionPage"
  title: string
  description: string
  eyebrow: string
  intro: string
  sections: Array<{
    heading: string
    body: string
  }>
  testimonials?: Array<{
    title: string
    quote: string
    context: string
  }>
  examples?: Array<{
    question: string
    betterQuestion: string
    note: string
  }>
  readingExamples?: Array<{
    label: string
    title: string
    question: string
    spread: string
    cards: string
    interpretation: string
    nextStep: string
    href: string
  }>
  actionLinks?: Array<{
    label: string
    title: string
    body: string
    href: string
  }>
  brandAssets?: Array<{
    label: string
    title: string
    description: string
    src: string
    width: number
    height: number
    href: string
  }>
}

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
      { heading: "Who edits POPTarot", body: "The product is maintained as an AI-assisted tarot tool with editorial review for card meanings, SEO page structure, responsible-use language, and user-facing guidance." },
      { heading: "Our point of view", body: "Tarot should support reflection, emotional clarity, and better questions. It should not replace professional, medical, legal, or financial advice." },
      { heading: "Why free first", body: "The first experience should be useful before anyone pays. Membership is reserved for deeper follow-ups, saved history, advanced spreads, and long-form reports." },
      { heading: "Official channels", body: "poptarot.com is the source of truth for product pages, readings, privacy guidance, and policy updates. Official social profiles are linked here when active." },
      { heading: "What we verify", body: "We check that core pages explain free access, membership boundaries, AI limitations, privacy expectations, and practical next steps without overstating certainty." },
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
      { heading: "Human-readable standards", body: "We avoid presenting tarot as certainty. Pages should explain symbols in plain language, state limitations clearly, and keep calls to action focused on free reading first." },
      { heading: "Updates", body: "We expand pages when search data, user questions, or product analytics show that people need clearer explanations." },
      { heading: "Localization standards", body: "English is the primary SEO language for card meanings and question pages. Spanish and Brazilian Portuguese pages are localized for regional search intent instead of direct machine-style copies." },
    ],
  },
  {
    slug: "official-channels",
    type: "WebPage",
    title: "Official POPTarot Channels",
    description: "Verify official POPTarot links, brand channels, product support paths, and safe ways to recognize poptarot.com.",
    eyebrow: "Official Channels",
    intro: "poptarot.com is the source of truth for POPTarot product pages, free readings, daily tarot, privacy guidance, and membership information.",
    sections: [
      { heading: "Primary website", body: "The canonical POPTarot experience is hosted at poptarot.com. Use this domain for free AI tarot readings, daily tarot, card meanings, and official policy pages." },
      { heading: "Social profiles", body: "Official social profiles are listed on this page and in structured data only after they are active and verified. We do not publish placeholder social links." },
      { heading: "Brand verification", body: "Search engines and users can check the same brand signals across About, Editorial Policy, AI Disclaimer, Privacy, Reviews, Reading Examples, and this official channels page." },
      { heading: "Brand search terms", body: "The official brand terms are POPTarot, Pop Tarot AI, and POPTarot AI Tarot. The canonical product category is free AI tarot tool." },
      { heading: "Crawlable sources", body: "The sitemap, brand assets, free tools hub, daily tarot page, question pages, and card meanings give search engines a consistent map of the product." },
      { heading: "Safe link checks", body: "Be careful with copied links, payment requests, or messages that do not point back to poptarot.com. Official product and policy links should resolve under this domain." },
      { heading: "Membership boundary", body: "The free reading flow stays available before payment. Membership belongs to saved history, deeper follow-ups, advanced spreads, and long-form reports." },
      { heading: "How updates appear", body: "When official accounts, support inboxes, or new public channels are launched, they will be added here first and then reflected in site-wide structured data." },
    ],
  },
  {
    slug: "brand-assets",
    type: "CollectionPage",
    title: "POPTarot Brand Assets",
    description: "Official POPTarot logo, app icon, favicon, and social sharing image for brand verification and media previews.",
    eyebrow: "Brand Assets",
    intro: "These are the canonical POPTarot visual assets used by poptarot.com, structured data, app metadata, social previews, and saved-home-screen icons.",
    sections: [
      { heading: "Canonical logo", body: "The primary POPTarot logo signal is the 512 x 512 icon used in Organization structured data and app manifests." },
      { heading: "Search and preview consistency", body: "The favicon, apple touch icon, app icon, and Open Graph image point back to the same brand identity so search engines and social previews read one consistent source." },
      { heading: "Official source", body: "Use only assets hosted under poptarot.com for brand verification. New public channels should link back to this page or the official channels page." },
      { heading: "Free-first positioning", body: "POPTarot should be described as a free AI tarot tool first. Membership is for deeper follow-ups, saved history, advanced spreads, and longer reports." },
      { heading: "AI tarot boundary", body: "Brand descriptions should keep readings framed as reflective guidance, not professional medical, legal, financial, psychological, or safety advice." },
      { heading: "Update policy", body: "When icons or sharing images change, this page, metadata, manifest, and Organization schema should be updated together." },
    ],
    brandAssets: [
      {
        label: "Logo",
        title: "512 x 512 app logo",
        description: "Primary image used in Organization structured data and installable app metadata.",
        src: "/icon-512x512.png",
        width: 512,
        height: 512,
        href: "/icon-512x512.png",
      },
      {
        label: "App icon",
        title: "192 x 192 app icon",
        description: "Compact icon used for web app manifests and smaller app surfaces.",
        src: "/icon-192x192.png",
        width: 192,
        height: 192,
        href: "/icon-192x192.png",
      },
      {
        label: "Apple",
        title: "Apple touch icon",
        description: "Home-screen icon for iOS and mobile browser save actions.",
        src: "/apple-touch-icon.png",
        width: 180,
        height: 180,
        href: "/apple-touch-icon.png",
      },
      {
        label: "Preview",
        title: "Open Graph share image",
        description: "Default image for social sharing, rich previews, and brand context.",
        src: "/og-image.jpg",
        width: 1200,
        height: 630,
        href: "/og-image.jpg",
      },
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
      { heading: "Follow-up questions", body: "Follow-ups are meant to clarify a pattern or next step. Repeating the same question many times can increase anxiety rather than insight." },
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
      { heading: "Anonymous first use", body: "The free reading flow is designed to work before account creation. Account features are used when you want saved history, journal entries, reminders, or membership benefits." },
      { heading: "Analytics", body: "We track aggregate events such as page views, question submissions, reading completion, share actions, and payment conversion to improve the site." },
      { heading: "Daily reminders", body: "If you add an email reminder for daily tarot, the reminder address, time, and timezone are used to send that reminder and manage delivery status. Each reminder email includes a link to turn off Daily Tarot reminders." },
      { heading: "Payments", body: "Payments are processed through configured payment providers. POPTarot stores order status and membership entitlement information, not full card details." },
    ],
  },
  {
    slug: "reviews",
    type: "CollectionPage",
    title: "POPTarot Reader Feedback",
    description: "Representative reader feedback patterns for POPTarot daily tarot, love readings, career readings, and free AI tarot guidance.",
    eyebrow: "Reader Feedback",
    intro: "These representative feedback patterns show the product experience we are optimizing for: clear, quick, reflective, and easy to return to.",
    sections: [
      { heading: "How to read this feedback", body: "Feedback shown here is representative product language written to describe the user experience we optimize for. It should not be read as guaranteed outcomes from any tarot reading." },
      { heading: "Daily tarot", body: "The daily card feels useful because it gives one clear focus instead of overwhelming me with a huge spread." },
      { heading: "Love readings", body: "The relationship answers are calmer than generic yes/no tools. I liked that the advice told me what I could actually do next." },
      { heading: "Career readings", body: "The career spread helped me separate burnout from a real signal that I needed to make a plan." },
      { heading: "Card meanings", body: "Readers need card pages that go beyond a keyword list. Upright, reversed, love, career, money, yes/no, advice, combinations, and FAQ make the pages easier to use." },
    ],
    testimonials: representativeTestimonials,
    actionLinks: [
      {
        label: "Daily habit",
        title: "Try Daily Tarot",
        body: "Start with one free card, a journal note, and a simple reason to return tomorrow.",
        href: "/daily-tarot",
      },
      {
        label: "Love clarity",
        title: "Ask a love question",
        body: "Use a relationship spread when the question needs feelings, behavior, and next action.",
        href: "/does-he-love-me-tarot",
      },
      {
        label: "Career decision",
        title: "Open career tarot",
        body: "Turn work uncertainty into a practical reading about risk, timing, and preparation.",
        href: "/career-tarot-reading",
      },
      {
        label: "Card meanings",
        title: "Browse card meanings",
        body: "Use upright, reversed, love, career, money, yes/no, advice, combinations, and FAQ pages.",
        href: "/tarot-card-meanings",
      },
    ],
  },
  {
    slug: "tarot-reading-examples",
    type: "WebPage",
    title: "Tarot Reading Examples",
    description: "Realistic tarot reading examples for love, reconciliation, career, daily guidance, and yes/no questions with sample cards and next steps.",
    eyebrow: "Examples",
    intro: "These realistic sample readings show how POPTarot turns a question, spread, cards, and card meanings into grounded guidance without pretending the cards guarantee an outcome.",
    sections: [
      { heading: "Question first", body: "Each example starts with the real thing people type: love uncertainty, an ex, a job choice, a daily focus, or a yes/no decision." },
      { heading: "Cards in context", body: "The same card can read differently depending on the spread position, question, and whether the answer needs emotional clarity or practical action." },
      { heading: "Action over certainty", body: "A useful reading should end with one next step the reader can observe, prepare, communicate, or choose." },
    ],
    readingExamples: [
      {
        label: "Love",
        title: "Does he love me?",
        question: "Does he love me, or am I reading too much into mixed signals?",
        spread: "Relationship spread",
        cards: "The Lovers, Two of Cups, Nine of Swords",
        interpretation: "The connection has genuine attraction and mutual resonance, but the Nine of Swords shows anxiety filling the gaps where direct communication is missing. The cards do not prove a private feeling; they show that the relationship needs clearer signals before you build a conclusion.",
        nextStep: "Look for consistent behavior over a full week, then ask one calm question instead of testing him indirectly.",
        href: "/does-he-love-me-tarot",
      },
      {
        label: "Reconciliation",
        title: "Will my ex come back?",
        question: "Will my ex come back, and would reconnecting actually be healthy?",
        spread: "Reconciliation spread",
        cards: "Six of Cups, Judgment, Four of Cups",
        interpretation: "The Six of Cups shows nostalgia and unfinished emotion, while Judgment suggests a chance to review what happened honestly. Four of Cups warns that one person may still be closed off or emotionally tired. The reading points to possible contact, not automatic repair.",
        nextStep: "Before reaching out, write down what would need to change for the relationship to feel different this time.",
        href: "/will-my-ex-come-back-tarot",
      },
      {
        label: "Career",
        title: "Should I quit my job?",
        question: "Should I quit my job now, or wait until I have a clearer plan?",
        spread: "Career decision spread",
        cards: "Eight of Swords, Ace of Pentacles, Temperance",
        interpretation: "Eight of Swords reflects feeling trapped, but Ace of Pentacles says a practical opportunity can be built. Temperance argues against an impulsive exit. This is less about staying forever and more about creating a staged transition.",
        nextStep: "Set a two-week plan: update your resume, price your expenses, and test one concrete opportunity before resigning.",
        href: "/should-i-quit-my-job-tarot",
      },
      {
        label: "Daily",
        title: "What do I need today?",
        question: "What guidance do I need today?",
        spread: "Daily one-card reading",
        cards: "The Hermit",
        interpretation: "The Hermit asks for quiet focus, fewer outside opinions, and one honest look at what you already know. It is a good daily card for research, reflection, and choosing a slower but wiser pace.",
        nextStep: "Protect one uninterrupted block of time and use it for the decision you have been avoiding.",
        href: "/daily-tarot",
      },
      {
        label: "Yes / No",
        title: "Yes or no tarot love",
        question: "Should I text first?",
        spread: "Yes/no love spread",
        cards: "Page of Cups, Two of Swords, Queen of Swords",
        interpretation: "The answer leans yes, but only if the message is emotionally honest and not designed to force reassurance. Two of Swords shows hesitation; Queen of Swords says your words should be simple, direct, and self-respecting.",
        nextStep: "Send one clear message, then let the response show you whether the energy is mutual.",
        href: "/yes-or-no-tarot-love",
      },
    ],
    examples: [
      {
        question: "Does he love me?",
        betterQuestion: "What is the real emotional energy between us, and what should I understand before I act?",
        note: "This keeps the focus on patterns, observable behavior, and your next decision.",
      },
      {
        question: "Will my ex come back?",
        betterQuestion: "What should I understand before reconnecting, and what has actually changed?",
        note: "This helps the reading look at boundaries and repair instead of only longing.",
      },
      {
        question: "Should I quit my job?",
        betterQuestion: "What does my current job situation show about timing, risk, and the wisest next step?",
        note: "This turns the reading into a practical career spread with advice and preparation.",
      },
    ],
    actionLinks: [
      {
        label: "Start free",
        title: "Free AI Tarot Reading",
        body: "Ask your own question and move directly into a matching free tarot flow.",
        href: "/free-ai-tarot-reading",
      },
      {
        label: "Question paths",
        title: "Browse tarot questions",
        body: "Use long-tail question pages for love, ex, yes/no, career, and quitting-work decisions.",
        href: "/tarot-questions",
      },
      {
        label: "Daily return",
        title: "Open Daily Tarot",
        body: "Use a one-card daily reading when you want a light habit instead of a full spread.",
        href: "/daily-tarot",
      },
      {
        label: "Learn cards",
        title: "Card meanings",
        body: "Compare each example with individual card meanings and related card combinations.",
        href: "/tarot-card-meanings",
      },
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
      siteName,
      type: "website",
    },
  }
}

export function getRelatedTrustLinks(currentSlug: string) {
  return trustLinks.filter((link) => link.href !== `/${currentSlug}`)
}
