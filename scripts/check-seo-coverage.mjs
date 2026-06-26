import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

function read(path) {
  return readFileSync(join(root, path), "utf8")
}

function assertIncludes(file, needle, label) {
  if (!file.source.includes(needle)) {
    throw new Error(`${file.path} is missing ${label}: ${needle}`)
  }
}

function assertNotIncludes(file, needle, label) {
  if (file.source.includes(needle)) {
    throw new Error(`${file.path} should not include ${label}: ${needle}`)
  }
}

function assertMatches(file, pattern, label) {
  if (!pattern.test(file.source)) {
    throw new Error(`${file.path} is missing ${label}: ${pattern}`)
  }
}

function assertFileExists(path, label) {
  if (!existsSync(join(root, path))) {
    throw new Error(`Missing ${label}: ${path}`)
  }
}

const files = {
  layout: { path: "app/layout.tsx", source: read("app/layout.tsx") },
  homePage: { path: "app/page.tsx", source: read("app/page.tsx") },
  dailyTarotPage: { path: "app/daily-tarot/page.tsx", source: read("app/daily-tarot/page.tsx") },
  dailyTarotTool: {
    path: "components/daily/daily-tarot-tool.tsx",
    source: read("components/daily/daily-tarot-tool.tsx"),
  },
  homeExperience: {
    path: "components/mystic-background.tsx",
    source: read("components/mystic-background.tsx"),
  },
  globalStyles: { path: "app/globals.css", source: read("app/globals.css") },
  manifest: { path: "public/manifest.webmanifest", source: read("public/manifest.webmanifest") },
  robots: { path: "app/robots.ts", source: read("app/robots.ts") },
  vercelConfig: { path: "vercel.json", source: read("vercel.json") },
  tarotCardSeo: { path: "lib/tarot-card-seo.ts", source: read("lib/tarot-card-seo.ts") },
  cardMeaningPage: {
    path: "components/seo/tarot-card-meaning-page.tsx",
    source: read("components/seo/tarot-card-meaning-page.tsx"),
  },
  seoOgImage: {
    path: "lib/seo-og-image.tsx",
    source: read("lib/seo-og-image.tsx"),
  },
  tarotCardOgRoute: {
    path: "app/api/og/tarot-card/route.tsx",
    source: read("app/api/og/tarot-card/route.tsx"),
  },
  tarotCardRoute: {
    path: "app/(seo)/tarot-card-meanings/[card]/page.tsx",
    source: read("app/(seo)/tarot-card-meanings/[card]/page.tsx"),
  },
  spanishTarotCardRoute: {
    path: "app/es/tarot-card-meanings/[card]/page.tsx",
    source: read("app/es/tarot-card-meanings/[card]/page.tsx"),
  },
  portugueseTarotCardRoute: {
    path: "app/pt-br/tarot-card-meanings/[card]/page.tsx",
    source: read("app/pt-br/tarot-card-meanings/[card]/page.tsx"),
  },
  seoPages: { path: "lib/seo-pages.ts", source: read("lib/seo-pages.ts") },
  site: { path: "lib/site.ts", source: read("lib/site.ts") },
  spreadConfig: { path: "lib/spread-config.ts", source: read("lib/spread-config.ts") },
  tarotQuestions: {
    path: "components/seo/tarot-questions-page.tsx",
    source: read("components/seo/tarot-questions-page.tsx"),
  },
  tarotQuestionSearchResults: {
    path: "components/seo/tarot-question-search-results.tsx",
    source: read("components/seo/tarot-question-search-results.tsx"),
  },
  seoLanding: {
    path: "components/seo/seo-landing-page.tsx",
    source: read("components/seo/seo-landing-page.tsx"),
  },
  trustPages: { path: "lib/trust-pages.ts", source: read("lib/trust-pages.ts") },
  trustSignals: { path: "lib/trust-signals.ts", source: read("lib/trust-signals.ts") },
  trustPageView: {
    path: "components/trust/trust-page.tsx",
    source: read("components/trust/trust-page.tsx"),
  },
  reminderCapability: {
    path: "app/api/daily-tarot/reminder-capability/route.ts",
    source: read("app/api/daily-tarot/reminder-capability/route.ts"),
  },
  reminderCron: {
    path: "app/api/cron/daily-tarot-reminders/route.ts",
    source: read("app/api/cron/daily-tarot-reminders/route.ts"),
  },
  reminderUnsubscribe: {
    path: "app/api/daily-tarot/unsubscribe/route.ts",
    source: read("app/api/daily-tarot/unsubscribe/route.ts"),
  },
  reminderUnsubscribeToken: {
    path: "lib/server/daily-reminder-unsubscribe.ts",
    source: read("lib/server/daily-reminder-unsubscribe.ts"),
  },
  reminderRpc: {
    path: "lib/server/daily-reminder-rpc.ts",
    source: read("lib/server/daily-reminder-rpc.ts"),
  },
  reminderCheckScript: {
    path: "scripts/check-reminder-capability.mjs",
    source: read("scripts/check-reminder-capability.mjs"),
  },
  memberGate: {
    path: "lib/server/member-gate.ts",
    source: read("lib/server/member-gate.ts"),
  },
  monthlyReportPage: {
    path: "app/monthly-tarot-report/page.tsx",
    source: read("app/monthly-tarot-report/page.tsx"),
  },
  monthlyReportTool: {
    path: "components/monthly/monthly-tarot-report.tsx",
    source: read("components/monthly/monthly-tarot-report.tsx"),
  },
  monthlyReportRoute: {
    path: "app/api/monthly-tarot-report/route.ts",
    source: read("app/api/monthly-tarot-report/route.ts"),
  },
  readingRoute: {
    path: "app/api/reading/route.ts",
    source: read("app/api/reading/route.ts"),
  },
  readingSpreadsRoute: {
    path: "app/api/reading/spreads/route.ts",
    source: read("app/api/reading/spreads/route.ts"),
  },
  readingClassifyRoute: {
    path: "app/api/reading/classify-question/route.ts",
    source: read("app/api/reading/classify-question/route.ts"),
  },
  readingCreateRoute: {
    path: "app/api/reading/create/route.ts",
    source: read("app/api/reading/create/route.ts"),
  },
  readingHistoryRoute: {
    path: "app/api/reading/history/route.ts",
    source: read("app/api/reading/history/route.ts"),
  },
  readingDetailRoute: {
    path: "app/api/reading/[id]/route.ts",
    source: read("app/api/reading/[id]/route.ts"),
  },
  readingSaveRoute: {
    path: "app/api/reading/save-interpretation/route.ts",
    source: read("app/api/reading/save-interpretation/route.ts"),
  },
  readingPage: {
    path: "app/reading/page.tsx",
    source: read("app/reading/page.tsx"),
  },
  readingDetailPage: {
    path: "app/reading/[id]/page.tsx",
    source: read("app/reading/[id]/page.tsx"),
  },
  inputPage: {
    path: "app/input/page.tsx",
    source: read("app/input/page.tsx"),
  },
  inputLayout: {
    path: "app/input/layout.tsx",
    source: read("app/input/layout.tsx"),
  },
  readingLayout: {
    path: "app/reading/layout.tsx",
    source: read("app/reading/layout.tsx"),
  },
  revealLayout: {
    path: "app/reveal/layout.tsx",
    source: read("app/reveal/layout.tsx"),
  },
  loadingReadingLayout: {
    path: "app/loading-reading/layout.tsx",
    source: read("app/loading-reading/layout.tsx"),
  },
  profilePage: {
    path: "app/profile/page.tsx",
    source: read("app/profile/page.tsx"),
  },
  sharePage: {
    path: "app/share/[slug]/page.tsx",
    source: read("app/share/[slug]/page.tsx"),
  },
  shareRoute: {
    path: "app/api/reading/share/route.ts",
    source: read("app/api/reading/share/route.ts"),
  },
  shareTemplates: {
    path: "lib/share-templates.ts",
    source: read("lib/share-templates.ts"),
  },
  freeToolsPage: {
    path: "app/free-tarot-tools/page.tsx",
    source: read("app/free-tarot-tools/page.tsx"),
  },
  sitemap: { path: "app/sitemap.ts", source: read("app/sitemap.ts") },
}

const cardCoverage = [
  ["Upright meaning", "${englishName} Upright Meaning"],
  ["Reversed meaning", "${englishName} Reversed Meaning"],
  ["Love context", "${englishName} in Love"],
  ["Career context", "${englishName} in Career"],
  ["Money context", "${englishName} for Money"],
  ["Yes/no context", "${englishName} Yes or No"],
  ["Advice context", "Advice from ${englishName}"],
  ["Spread position label", "Spread position meanings"],
  ["Past position", "${englishName} in the past position"],
  ["Future position", "${englishName} in the future position"],
  ["Outcome position", "${englishName} as an outcome"],
  ["Example readings", "Example readings"],
  ["Love example", "Love example"],
  ["Career example", "Career example"],
  ["Yes or no example", "Yes or no example"],
  ["Common combinations", "Common Card Combinations"],
  ["Combination href slugs", "hrefSlug: linkedSlug"],
  ["FAQ", "faqLabel: \"FAQ\""],
]

for (const [label, needle] of cardCoverage) {
  assertIncludes(files.tarotCardSeo, needle, `card SEO ${label}`)
}

for (const anchor of ["love", "career", "money", "yes-or-no", "advice"]) {
  assertIncludes(files.cardMeaningPage, `"${anchor}"`, `card page anchor ${anchor}`)
}

for (const section of ["#spread-positions", "#example-readings", "#combinations", "#faq", "#question-paths", "#daily-practice", "#context-signals"]) {
  assertIncludes(files.cardMeaningPage, section, `card page section ${section}`)
}

for (const [needle, label] of [
  ["data-card-hero-content", "card meaning mobile-first hero content hook"],
  ["data-card-hero-art", "card meaning hero card art hook"],
  ["data-card-mobile-art", "card meaning compact mobile card art hook"],
  ["lg:sticky", "card meaning desktop sticky card art"],
  ["lg:top-24", "card meaning desktop sticky card art offset"],
  ["lg:order-1", "card meaning desktop card-art ordering"],
  ["lg:order-2", "card meaning desktop content ordering"],
  ["data-card-quick-answer", "card quick answer visible section hook"],
  ["#card-quick-answer", "card quick answer structured data item list"],
  ["numberOfItems: quickRows.length", "card quick answer row count schema"],
  ["data-card-context-signal-grid", "English card context signal grid hook"],
  ["#context-signal-grid", "English card context signal structured data"],
  ["data-card-context-signal-link", "English card context signal free-spread links"],
  ["page.locale !== \"en\"", "card context signal English-first guard"],
  ["Open free spread", "English card context signal CTA"],
  ["cardCombinationHref", "card combination internal-link helper"],
  ["combinationLinkLabel", "card combination localized link label"],
  ["#card-combinations", "card combination structured data item list"],
  ["Open paired card", "English paired-card link label"],
]) {
  assertIncludes(files.cardMeaningPage, needle, label)
}

for (const [slug, context, anchor] of [
  ["love-tarot-card-meanings", "love", "love"],
  ["career-tarot-card-meanings", "career", "career"],
  ["money-tarot-card-meanings", "money", "money"],
  ["yes-or-no-tarot-card-meanings", "yes-or-no", "yes-or-no"],
]) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `card context SEO page ${slug}`)
  assertIncludes(files.seoPages, `context: "${context}"`, `card context SEO page context ${context}`)
  assertIncludes(files.seoLanding, `"${slug}"`, `card context hub link ${slug}`)
  assertIncludes(files.seoLanding, `data-card-context-index`, `card context index data hook ${slug}`)
  assertIncludes(files.seoLanding, `anchor: "${anchor}"`, `card context anchor link ${anchor}`)
}
assertIncludes(files.seoPages, "cardMeaningContext?: CardMeaningContext", "card context SEO page model")
assertIncludes(files.seoLanding, "#card-context-hubs", "card context hub structured data")
assertIncludes(files.seoLanding, "data-card-context-hubs", "card context visible hub links")
assertIncludes(files.seoLanding, "cardIndexHref(cardPage, activeCardIndexMode)", "card context card anchor hrefs")

const highIntentLongTailSlugs = [
  "will-my-ex-come-back-tarot",
  "does-he-love-me-tarot",
  "how-does-he-feel-about-me-tarot",
  "does-my-ex-miss-me-tarot",
  "will-he-come-back-tarot",
  "future-spouse-tarot-reading",
  "yes-or-no-tarot-love",
  "career-tarot-reading",
  "should-i-quit-my-job-tarot",
  "is-he-thinking-about-me-tarot",
  "should-i-text-him-tarot",
  "when-will-i-find-love-tarot",
  "what-are-his-intentions-tarot",
  "will-we-get-back-together-tarot",
  "is-he-my-soulmate-tarot",
  "money-tarot-reading",
  "what-does-he-think-of-me-tarot",
  "will-he-contact-me-tarot",
  "is-this-relationship-over-tarot",
  "will-i-get-the-job-tarot",
  "should-i-take-this-job-tarot",
  "will-i-be-successful-tarot",
]

for (const slug of highIntentLongTailSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `SEO page ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `high-intent site link ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `tarot question hub entry ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `related question cluster for ${slug}`,
  )
}

const dailyIntentSlugs = [
  "daily-love-tarot",
  "daily-career-tarot",
  "daily-yes-or-no-tarot",
  "daily-mood-tarot",
  "daily-action-tarot",
]

for (const slug of dailyIntentSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `daily intent SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `daily intent regional locale control ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `daily intent site link ${slug}`)
  assertIncludes(files.dailyTarotPage, `slug: "${slug}"`, `daily tarot prompt card ${slug}`)
  assertIncludes(files.seoLanding, `"${slug}"`, `daily intent related cluster ${slug}`)
}

const regionalDailyIntentSlugs = {
  es: [
    "tarot-diario-amor",
    "tarot-diario-carrera",
    "tarot-diario-si-o-no",
    "tarot-diario-estado-de-animo",
    "tarot-diario-accion",
  ],
  "pt-br": [
    "tarot-diario-amor",
    "tarot-diario-carreira",
    "tarot-diario-sim-ou-nao",
    "tarot-diario-humor",
    "tarot-diario-acao",
  ],
}

for (const [locale, slugs] of Object.entries(regionalDailyIntentSlugs)) {
  for (const slug of slugs) {
    assertIncludes(files.seoPages, `"${slug}"`, `${locale} daily intent localized slug ${slug}`)
    assertIncludes(files.dailyTarotPage, `/${locale}/${slug}`, `Daily Tarot regional intent link /${locale}/${slug}`)
  }
}

for (const label of ["Tarot diario del amor", "Tarot diario para carrera", "Tarot diário do amor", "Tarot diário para carreira"]) {
  assertIncludes(files.seoPages, label, `regional daily intent copy ${label}`)
}

for (const regionalDailyPath of ["/es/tarot-diario", "/pt-br/tarot-diario"]) {
  assertIncludes(files.seoPages, `"daily-tarot": "tarot-diario"`, `regional Daily Tarot slug mapping ${regionalDailyPath}`)
  assertIncludes(files.dailyTarotPage, regionalDailyPath, `Daily Tarot regional guide link ${regionalDailyPath}`)
}

assertIncludes(files.dailyTarotPage, "data-daily-regional-guides", "Daily Tarot regional guide section")
assertIncludes(files.dailyTarotPage, "#regional-daily-guides", "Daily Tarot regional guide structured data")
assertIncludes(files.dailyTarotPage, "data-daily-regional-intent-links", "Daily Tarot regional intent link section")
assertIncludes(files.dailyTarotPage, "data-daily-regional-intent-link", "Daily Tarot regional intent link cards")
assertIncludes(files.dailyTarotPage, "#regional-daily-intent-links", "Daily Tarot regional intent structured data")
assertIncludes(files.seoLanding, "utm_medium: \"daily_landing\"", "Daily Tarot SEO landing attribution")
assertIncludes(files.seoLanding, "page.slug === \"daily-tarot\"", "Daily Tarot SEO pages open the daily tool")
assertIncludes(files.dailyTarotTool, "data-daily-quick-actions", "Daily Tarot first-screen quick action rail")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot", "Daily Tarot first-screen habit snapshot")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot-pattern", "Daily Tarot habit snapshot pattern CTA")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot-return-cue", "Daily Tarot habit snapshot return cue CTA")
assertIncludes(files.dailyTarotTool, "Check streak, notes, and the main 7-day theme", "Daily Tarot habit snapshot free return positioning")
assertIncludes(files.dailyTarotTool, "grid-cols-1", "Daily Tarot mobile grid uses shrinkable single column")
assertIncludes(files.dailyTarotTool, "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]", "Daily Tarot desktop grid columns cannot force mobile overflow")
assertIncludes(files.dailyTarotTool, "min-w-0 rounded-lg border border-white/10", "Daily Tarot primary panel can shrink on mobile")
assertIncludes(files.dailyTarotTool, "min-w-0 space-y-5", "Daily Tarot secondary panel can shrink on mobile")
for (const action of ["draw", "journal", "reminder", "calendar", "share", "return-cue"]) {
  assertIncludes(files.dailyTarotTool, `data-daily-quick-action="${action}"`, `Daily Tarot quick action ${action}`)
}
assertIncludes(files.dailyTarotTool, "scrollToJournal", "Daily Tarot quick journal scroll handler")
assertIncludes(files.dailyTarotTool, "scrollToReturnCue", "Daily Tarot return cue scroll handler")
assertIncludes(files.dailyTarotTool, "data-daily-journal-form", "Daily Tarot journal scroll target")
assertIncludes(files.dailyTarotTool, "data-daily-return-link", "Daily Tarot direct return link block")
assertIncludes(files.dailyTarotTool, "data-daily-return-link-copy", "Daily Tarot copy return link CTA")
assertIncludes(files.dailyTarotTool, "data-daily-return-link-mailto", "Daily Tarot email self return link CTA")
assertIncludes(files.dailyTarotTool, "return_focus", "Daily Tarot return focus URL parameter")
assertIncludes(files.dailyTarotTool, "daily_return_email_opened", "Daily Tarot self-email return tracking")
assertIncludes(files.dailyTarotTool, "daily_return_link_copied", "Daily Tarot copied return link tracking")

assertIncludes(files.freeToolsPage, "highIntentQuestionLinks.map", "free tools high-intent daily links")
assertIncludes(files.freeToolsPage, "quickStartIntents", "free tools quick-start intent data")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start", "free tools quick-start visible section")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start-card", "free tools quick-start cards")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start-start", "free tools quick-start direct CTA")
assertIncludes(files.freeToolsPage, "utm_medium: \"quick_start\"", "free tools quick-start attribution")
assertIncludes(files.freeToolsPage, "#quick-start-free-readings", "free tools quick-start structured data")
assertIncludes(files.freeToolsPage, "data-free-tools-question-start", "free tools direct high-intent start CTA")
assertIncludes(files.freeToolsPage, "data-free-tools-question-guide", "free tools high-intent guide CTA")
assertIncludes(files.freeToolsPage, "utm_medium: \"question_grid\"", "free tools high-intent question attribution")
assertIncludes(files.freeToolsPage, "getSeoPage(slug, \"en\")", "free tools high-intent SEO page lookup")
assertIncludes(files.freeToolsPage, "Start matching free tarot spread", "free tools high-intent structured action")
assertIncludes(files.freeToolsPage, "data-free-tools-social-proof", "free tools visible reader proof section")
assertIncludes(files.freeToolsPage, "data-free-tools-example-readings", "free tools visible example readings section")
assertIncludes(files.freeToolsPage, "#reader-feedback", "free tools reader feedback structured data")
assertIncludes(files.freeToolsPage, "#example-readings", "free tools example readings structured data")
assertIncludes(files.freeToolsPage, "representativeTestimonials.slice(0, 3)", "free tools representative testimonial reuse")
assertIncludes(files.freeToolsPage, "getTrustPage(\"tarot-reading-examples\")", "free tools sample reading example reuse")
assertIncludes(files.homeExperience, "data-home-example-start", "homepage one-tap example start CTA")
assertIncludes(files.homeExperience, "data-home-hero-quick-start", "homepage quick-start visible section")
assertIncludes(files.homeExperience, "data-home-hero-quick-start-link", "homepage quick-start link hook")
assertIncludes(files.homeExperience, "\"home_example\"", "homepage example source attribution")
assertIncludes(files.homeExperience, "utm_medium", "homepage hero attribution")
assertIncludes(files.homeExperience, "hero_quick_start", "homepage quick-start campaign medium")
for (const spread of ["breakup_recovery", "their_thoughts", "job_opportunity", "yes_no"]) {
  assertIncludes(files.homeExperience, spread, `homepage quick-start spread ${spread}`)
}
assertIncludes(files.homePage, "#homepage-quick-start-free-readings", "homepage quick-start structured data")
assertIncludes(files.homePage, "homeQuickStartActionTarget", "homepage quick-start structured action target")
assertIncludes(files.homePage, "InteractAction", "homepage quick-start structured interact action")
assertIncludes(files.globalStyles, "--home-hero-browser-offset: min(var(--home-mobile-browser-offset, 0px), 7rem)", "homepage browser chrome offset variable")
assertIncludes(files.globalStyles, "--home-hero-focal-y: calc(var(--home-hero-browser-offset) + clamp(24.75rem, 58svh, 28.5rem))", "homepage mobile focal centering with browser chrome offset")
assertIncludes(files.globalStyles, "--home-hero-card-height: calc(var(--home-hero-card-width) * 1.7142857)", "homepage card size variable")
assertIncludes(files.globalStyles, "--home-hero-card-half-y: calc(var(--home-hero-card-height) / 2)", "homepage card half-height variable")
assertIncludes(files.globalStyles, "--home-hero-shell-min-height", "homepage hero shell dynamic height reserve")
assertIncludes(files.globalStyles, "--home-hero-content-reserve: 72rem", "homepage mobile content reserve prevents overlap under browser chrome")
assertIncludes(files.globalStyles, "--home-hero-after-actions-gap", "homepage measured action bottom spacing")
assertIncludes(files.globalStyles, "--home-hero-actions-bottom", "homepage measured action bottom variable")
assertIncludes(files.globalStyles, "calc(var(--home-hero-actions-bottom) + var(--home-hero-after-actions-gap))", "homepage shell follows measured hero action bottom")
assertIncludes(files.globalStyles, "max(\n        205svh,", "homepage mobile shell keeps following content below hero actions")
assertIncludes(files.globalStyles, "calc(var(--home-hero-content-y) + var(--home-hero-content-reserve))", "homepage hero content bottom reserve")
assertIncludes(files.homeExperience, "data-home-hero-actions", "homepage hero actions measurement hook")
assertIncludes(files.homeExperience, "heroActionsRef", "homepage hero actions ref for mobile overlap measurement")
assertIncludes(files.homeExperience, "ResizeObserver", "homepage hero action resize observer")
assertIncludes(files.homeExperience, "stage.style.setProperty(\"--home-hero-actions-bottom\"", "homepage measured action bottom setter")
assertIncludes(files.homeExperience, "--home-mobile-browser-offset", "homepage visual viewport browser chrome offset")
assertIncludes(files.homeExperience, "data-home-hero-shell", "homepage hero shell measurement hook")
assertIncludes(files.homeExperience, "home-hero-shell", "homepage hero shell class")
assertIncludes(files.homeExperience, "overflow-hidden", "homepage hero shell clips accidental overlap")
assertIncludes(files.homeExperience, "bg-[#0b0314]", "homepage solid mobile panels prevent text bleed-through")
assertIncludes(files.homeExperience, "data-home-daily-return-panel", "homepage daily return panel measurement hook")
assertIncludes(files.homeExperience, "data-home-secondary-nav", "homepage secondary nav measurement hook")
assertIncludes(files.homeExperience, "data-home-scroll-content", "homepage scroll content measurement hook")
assertIncludes(files.homeExperience, "data-home-focal-glow", "homepage focal glow hook")
assertIncludes(files.homeExperience, "data-home-card-anchor", "homepage card anchor hook")
assertIncludes(files.homeExperience, "style={{ transform: \"translate3d(-50%, -50%, 0)\" }}", "homepage card and glow center transform")
assertIncludes(files.tarotQuestions, "TarotQuestionSearchResults", "tarot questions public search results import")
assertIncludes(files.tarotQuestions, "searchEntries(copy)", "tarot questions public search result entries")
assertIncludes(files.tarotQuestions, "quickStartSlugs", "tarot questions quick-start high-intent slug list")
assertIncludes(files.tarotQuestions, "quickStartEntries(copy)", "tarot questions quick-start visible entries")
assertIncludes(files.tarotQuestions, "data-question-quick-start", "tarot questions quick-start section")
assertIncludes(files.tarotQuestions, "data-question-quick-start-card", "tarot questions quick-start card links")
assertIncludes(files.tarotQuestions, "#quick-start-question-paths", "tarot questions quick-start structured data")
assertIncludes(files.tarotQuestions, "question_hub_quick_start", "tarot questions quick-start attribution")
assertIncludes(files.tarotQuestions, "utm_medium", "tarot questions free-reading UTM attribution")
assertIncludes(files.tarotQuestions, "utm_campaign", "tarot questions campaign attribution")
assertIncludes(files.tarotQuestionSearchResults, "data-question-search-results", "tarot questions public search result section")
assertIncludes(files.tarotQuestionSearchResults, "searchParams.get(\"query\")", "tarot questions SearchAction query reader")
assertIncludes(files.tarotQuestionSearchResults, "searchParams.get(\"q\")", "tarot questions fallback query reader")
assertIncludes(files.tarotQuestionSearchResults, "readingHref", "tarot questions search result free-reading CTA")
assertIncludes(files.tarotQuestionSearchResults, "guideHref", "tarot questions search result guide CTA")

for (const localeRoute of [
  "app/zh/[slug]/page.tsx",
  "app/ja/[slug]/page.tsx",
  "app/ko/[slug]/page.tsx",
  "app/es/[slug]/page.tsx",
  "app/pt-br/[slug]/page.tsx",
]) {
  assertIncludes({ path: localeRoute, source: read(localeRoute) }, "getSeoStaticParams(locale)", `locale-aware static params in ${localeRoute}`)
}

assertIncludes(files.seoPages, "sourceSupportsLocale", "SEO source locale filtering")
assertIncludes(files.seoPages, "supportedLocales", "SEO alternates locale filtering")

for (const conversionSignal of [
  "const highIntentQuestionSlugs = new Set",
  "createFallbackQuestionToolkit(page, recommendedSpread)",
  "data-question-hero-start",
  "data-question-hero-tool",
  "data-question-matched-spread",
  "data-seo-question-tool-entry",
  "data-long-tail-free-spread-entry",
  "data-seo-question-tool-primary",
  "data-seo-question-related-direct-start",
  "questionToolEntryCopy",
  "#question-tool-entry",
  "source: seoLandingSource(page)",
  "\"seo_question_page\"",
  "Free matched spread",
  "#matched-question-spread",
  "#matched-question-spread-positions",
  "\"@type\": \"WebApplication\"",
  "\"@type\": \"InteractAction\"",
  "\"@type\": \"EntryPoint\"",
  "isAccessibleForFree: true",
  "#ready-question-prompts",
  "data-question-ready-prompts",
  "#recommended-spread",
  "data-question-recommended-spread",
  "#sample-result-preview",
  "#sample-result-cards",
  "data-question-result-preview",
  "What the free answer can look like",
  "questionReturnLoopCopy",
  "#question-return-loop",
  "data-question-return-loop",
  "data-question-return-loop-card",
  "question_return_loop",
  "return_focus: page.ctaQuestion",
  "monthly-pattern",
  "#related-question-cluster",
  "data-question-sticky-cta",
  "utm_medium: \"question_prompt\"",
]) {
  assertIncludes(files.seoLanding, conversionSignal, `high-intent question conversion signal ${conversionSignal}`)
}

for (const cardMeaningSignal of [
  "cardCombinationCopy",
  "combinationPreviewCardIds",
  "previewCombination(cardPage)",
  "#card-combination-paths",
  "data-card-combination-paths",
  "cardPage.path}#combinations",
  "Common Tarot Card Combination Paths",
]) {
  assertIncludes(files.seoLanding, cardMeaningSignal, `card meaning hub combination signal ${cardMeaningSignal}`)
}

for (const localizedSlug of [
  "que-siente-por-mi-tarot",
  "mi-ex-me-extrana-tarot",
  "el-volvera-tarot",
  "lectura-tarot-futuro-esposo",
  "o-que-ele-sente-por-mim-tarot",
  "meu-ex-sente-minha-falta-tarot",
  "ele-vai-voltar-tarot",
  "leitura-tarot-futuro-conjuge",
  "esta-pensando-en-mi-tarot",
  "deberia-escribirle-tarot",
  "cuando-encontrare-amor-tarot",
  "cuales-son-sus-intenciones-tarot",
  "volveremos-a-estar-juntos-tarot",
  "es-mi-alma-gemela-tarot",
  "lectura-tarot-dinero",
  "que-piensa-de-mi-tarot",
  "me-contactara-tarot",
  "esta-relacion-termino-tarot",
  "conseguire-el-trabajo-tarot",
  "deberia-aceptar-este-trabajo-tarot",
  "tendre-exito-tarot",
  "ele-esta-pensando-em-mim-tarot",
  "tarot-amor-sim-ou-nao",
  "devo-mandar-mensagem-tarot",
  "quando-vou-encontrar-amor-tarot",
  "quais-sao-as-intencoes-dele-tarot",
  "vamos-voltar-tarot",
  "ele-e-minha-alma-gemea-tarot",
  "leitura-tarot-dinheiro",
  "leitura-tarot-carreira",
  "devo-pedir-demissao-tarot",
  "o-que-ele-pensa-de-mim-tarot",
  "ele-vai-entrar-em-contato-tarot",
  "este-relacionamento-acabou-tarot",
  "vou-conseguir-o-emprego-tarot",
  "devo-aceitar-este-trabalho-tarot",
  "vou-ter-sucesso-tarot",
]) {
  assertIncludes(files.seoPages, localizedSlug, `localized long-tail slug ${localizedSlug}`)
}

const trustSlugs = [
  "about",
  "official-channels",
  "brand-assets",
  "editorial-policy",
  "ai-tarot-disclaimer",
  "privacy",
  "reviews",
  "tarot-reading-examples",
]

for (const slug of trustSlugs) {
  assertIncludes(files.trustPages, `slug: "${slug}"`, `trust page ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `trust navigation link ${slug}`)
}

const trustDataCoverage = [
  [files.trustPages, "testimonials: representativeTestimonials", "reviews testimonials"],
  [files.trustPages, "readingExamples:", "reading examples content"],
  [files.trustPages, "brandAssets:", "brand asset registry"],
  [files.trustPages, "actionLinks:", "trust-to-free-reading action links"],
  [files.site, "officialVerificationLinks", "official verification registry"],
  [files.trustSignals, "Free first", "free-first trust highlight"],
  [files.trustSignals, "Membership second", "membership-second trust highlight"],
  [files.trustSignals, "Responsible AI", "responsible AI trust highlight"],
  [files.trustPageView, "#testimonials", "testimonial structured data"],
  [files.trustPageView, "#sample-readings", "sample reading structured data"],
  [files.trustPageView, "#brand-assets", "brand asset structured data"],
  [files.trustPageView, "defaultTrustActionLinks", "default trust free action links"],
  [files.trustPageView, "effectiveActionLinks", "trust pages use default or custom action links"],
  [files.trustPageView, "data-trust-default-free-actions", "trust pages visible default free actions"],
  [files.trustPageView, "data-trust-default-free-action", "trust pages free action cards"],
  [files.trustPageView, "#next-actions", "trust pages next-action structured data"],
  [files.trustPageView, "Free AI Tarot Reading", "trust default free reading action"],
  [files.trustPageView, "Daily Tarot", "trust default daily return action"],
  [files.trustPageView, "Tarot Questions", "trust default question path action"],
  [files.trustPageView, "#official-verification-links", "official verification structured data"],
  [files.trustPageView, "Official Social Accounts", "official social account section"],
  [files.trustPageView, "Where POPTarot Confirms Its Identity", "official verification visible section"],
]

for (const [file, needle, label] of trustDataCoverage) {
  assertIncludes(file, needle, label)
}

const structuredDataCoverage = [
  [files.site, "logo: {", "Organization logo"],
  [files.site, "/icon-512x512.png", "Organization logo asset"],
  [files.site, "data.sameAs = socialLinks.map", "verified sameAs emission"],
  [files.site, "makesOffer:", "free offer on Organization"],
  [files.site, "price: \"0\"", "free pricing signal"],
  [files.site, "\"@type\": \"SearchAction\"", "Website SearchAction"],
  [files.site, "query-input", "SearchAction query input"],
  [files.site, "/tarot-questions?query={search_term_string}", "public SearchAction target"],
  [files.site, "citation: representativeTestimonials.map", "SoftwareApplication testimonial citations"],
  [files.homePage, "#free-tarot-paths", "homepage free path ItemList"],
  [files.homePage, "#high-intent-tarot-questions", "homepage high-intent question ItemList"],
  [files.homePage, "#trust-paths", "homepage trust path ItemList"],
  [files.homePage, "#representative-feedback", "homepage representative feedback ItemList"],
  [files.dailyTarotPage, "\"@type\": \"SoftwareApplication\"", "daily tarot SoftwareApplication schema"],
  [files.dailyTarotPage, "\"@type\": \"HowTo\"", "daily tarot HowTo schema"],
  [files.dailyTarotPage, "\"@type\": \"FAQPage\"", "daily tarot FAQ schema"],
  [files.dailyTarotPage, "Calendar reminder", "daily tarot calendar reminder"],
  [files.dailyTarotPage, "Email reminder preference with capability-based delivery status", "daily tarot capability-based email reminder signal"],
  [files.cardMeaningPage, "#card-quick-answer", "card quick answer ItemList schema"],
  [files.cardMeaningPage, "#card-combinations", "card combinations ItemList schema"],
]

for (const [file, needle, label] of structuredDataCoverage) {
  assertIncludes(file, needle, label)
}

const identityMetadataCoverage = [
  [files.layout, "manifest: \"/manifest.webmanifest\"", "web app manifest metadata"],
  [files.layout, "/favicon-48x48.png", "48px favicon metadata"],
  [files.layout, "/favicon-96x96.png", "96px favicon metadata"],
  [files.layout, "/apple-touch-icon.png", "Apple touch icon metadata"],
  [files.layout, "/og-image.jpg", "Open Graph image metadata"],
  [files.manifest, "\"name\": \"POPTarot - Free AI Tarot Reading\"", "manifest product name"],
  [files.manifest, "\"shortcuts\"", "manifest shortcuts"],
  [files.manifest, "\"url\": \"/daily-tarot\"", "Daily Tarot manifest shortcut"],
  [files.manifest, "\"url\": \"/free-ai-tarot-reading\"", "Free Reading manifest shortcut"],
  [files.manifest, "\"url\": \"/tarot-card-meanings\"", "card meanings manifest shortcut"],
  [files.manifest, "\"src\": \"/icon-512x512.png\"", "512px manifest icon"],
]

for (const [file, needle, label] of identityMetadataCoverage) {
  assertIncludes(file, needle, label)
}

const dynamicOgCoverage = [
  [files.seoOgImage, "renderSeoOgImage", "SEO landing dynamic OG renderer"],
  [files.seoOgImage, "renderTarotCardOgImage", "tarot card dynamic OG renderer"],
  [files.tarotCardOgRoute, "getCardBySlug", "tarot card OG slug lookup"],
  [files.tarotCardOgRoute, "renderTarotCardOgImage", "tarot card OG response"],
  [files.tarotCardRoute, "/api/og/tarot-card?locale=${page.locale}&card=${page.slug}", "English card page dynamic OG image"],
  [files.spanishTarotCardRoute, "/api/og/tarot-card?locale=${page.locale}&card=${page.slug}", "Spanish card page dynamic OG image"],
  [files.portugueseTarotCardRoute, "/api/og/tarot-card?locale=${page.locale}&card=${page.slug}", "Portuguese card page dynamic OG image"],
  [files.tarotCardRoute, "width: 1200", "English card page OG landscape width"],
  [files.spanishTarotCardRoute, "width: 1200", "Spanish card page OG landscape width"],
  [files.portugueseTarotCardRoute, "width: 1200", "Portuguese card page OG landscape width"],
]

for (const [file, needle, label] of dynamicOgCoverage) {
  assertIncludes(file, needle, label)
}

const tarotCardRankingCoverage = [
  [files.tarotCardSeo, "function createDeepSections", "card page deep section generator"],
  [files.tarotCardSeo, "${englishName} in Love", "English card love meaning section"],
  [files.tarotCardSeo, "${englishName} in Career", "English card career meaning section"],
  [files.tarotCardSeo, "${englishName} for Money", "English card money meaning section"],
  [files.tarotCardSeo, "${englishName} Yes or No", "English card yes-or-no meaning section"],
  [files.tarotCardSeo, "Advice from", "English card advice section"],
  [files.tarotCardSeo, "function createCombinations", "card combination generator"],
  [files.tarotCardSeo, "function createCardFaqs", "card FAQ generator"],
  [files.tarotCardSeo, "What does ${englishName} mean upright?", "English upright FAQ"],
  [files.tarotCardSeo, "What does ${englishName} mean reversed?", "English reversed FAQ"],
  [files.tarotCardSeo, "What does ${englishName} mean in love?", "English love FAQ"],
  [files.tarotCardSeo, "What does ${englishName} mean for career and money?", "English career and money FAQ"],
  [files.tarotCardSeo, "What is the best advice from ${englishName}?", "English advice FAQ"],
  [files.tarotCardSeo, "createRegionalCoreSections(card, \"es\", theme)", "Spanish card core sections"],
  [files.tarotCardSeo, "createRegionalCoreSections(card, \"pt-br\", theme)", "Portuguese card core sections"],
  [files.tarotCardSeo, "Que significa ${name} para carrera y dinero?", "Spanish career and money FAQ"],
  [files.tarotCardSeo, "O que ${name} significa para carreira e dinheiro?", "Portuguese career and money FAQ"],
  [files.tarotCardSeo, "Cual es el mejor consejo de ${name}?", "Spanish advice FAQ"],
  [files.tarotCardSeo, "Qual e o melhor conselho de ${name}?", "Portuguese advice FAQ"],
  [files.tarotCardSeo, "majorKeywordSets", "major arcana regional keyword data"],
  [files.tarotCardSeo, "regionalCardNames", "Spanish and Portuguese card names"],
  [files.cardMeaningPage, "id=\"upright\"", "card page upright anchor"],
  [files.cardMeaningPage, "id=\"reversed\"", "card page reversed anchor"],
  [files.cardMeaningPage, "id=\"context-signals\"", "card page context signal anchor"],
  [files.cardMeaningPage, "id=\"combinations\"", "card page combinations anchor"],
  [files.cardMeaningPage, "id=\"example-readings\"", "card page example readings anchor"],
  [files.cardMeaningPage, "id=\"faq\"", "card page FAQ anchor"],
  [files.cardMeaningPage, "data-card-context-signal-grid", "card page English context grid"],
  [files.cardMeaningPage, "data-card-context-signal-link", "card page context grid free spread links"],
  [files.cardMeaningPage, "\"@type\": \"FAQPage\"", "card page FAQ structured data"],
  [files.cardMeaningPage, "\"@id\": `${appUrl}${page.path}#card-combinations`", "card page combinations structured data"],
  [files.cardMeaningPage, "\"@id\": `${appUrl}${page.path}#example-readings`", "card page examples structured data"],
  [files.cardMeaningPage, "Daily Tarot", "card page Daily Tarot retention path"],
  [files.cardMeaningPage, "Free AI Tarot Reading", "card page free tool path"],
  [files.cardMeaningPage, "Monthly Tarot Report", "card page member feature path"],
]

for (const [file, needle, label] of tarotCardRankingCoverage) {
  assertIncludes(file, needle, label)
}

const crawlHygieneCoverage = [
  [files.robots, '"/input"', "input flow robots disallow"],
  [files.robots, '"/reading"', "reading flow robots disallow"],
  [files.robots, '"/reveal"', "reveal flow robots disallow"],
  [files.robots, '"/loading-reading"', "loading flow robots disallow"],
  [files.inputLayout, "index: false", "input noindex metadata"],
  [files.inputLayout, "follow: false", "input nofollow metadata"],
  [files.readingLayout, "index: false", "reading noindex metadata"],
  [files.revealLayout, "index: false", "reveal noindex metadata"],
  [files.loadingReadingLayout, "index: false", "loading noindex metadata"],
]

for (const [file, needle, label] of crawlHygieneCoverage) {
  assertIncludes(file, needle, label)
}

for (const [needle, label] of [
  ['path: "/input"', "input flow sitemap route"],
  ['path: "/reading"', "reading flow sitemap route"],
  ['path: "/reveal"', "reveal flow sitemap route"],
  ['path: "/loading-reading"', "loading flow sitemap route"],
]) {
  assertNotIncludes(files.sitemap, needle, label)
}

for (const [path, label] of [
  ["public/favicon-48x48.png", "48px favicon"],
  ["public/favicon-96x96.png", "96px favicon"],
  ["public/apple-touch-icon.png", "Apple touch icon"],
  ["public/icon-192x192.png", "192px app icon"],
  ["public/icon-512x512.png", "512px app icon"],
  ["public/icon.svg", "SVG icon"],
  ["public/og-image.jpg", "Open Graph image"],
]) {
  assertFileExists(path, label)
}

const dailyReminderCoverage = [
  [files.vercelConfig, "\"path\": \"/api/cron/daily-tarot-reminders\"", "Vercel cron path"],
  [files.vercelConfig, "\"schedule\": \"0 * * * *\"", "hourly reminder cron schedule"],
  [files.reminderCron, "authorization", "cron authorization header check"],
  [files.reminderCron, "Bearer", "cron bearer token check"],
  [files.reminderCron, "dry_run", "cron dry-run mode"],
  [files.reminderCron, "dryRun", "cron dry-run camelCase alias"],
  [files.reminderCron, "email_provider_configured", "cron dry-run email provider status"],
  [files.reminderCron, "hasEmailProvider()", "cron email provider guard"],
  [files.reminderCron, "dailyReminderUnsubscribeUrl", "cron unsubscribe URL"],
  [files.reminderCron, "idempotencyKey", "cron email idempotency"],
  [files.reminderCapability, "unsubscribe_configured", "reminder unsubscribe capability"],
  [files.reminderCapability, "checkDailyReminderUnsubscribeAccess", "reminder unsubscribe RPC capability check"],
  [files.reminderCapability, "unsubscribe_rpc", "reminder missing unsubscribe RPC capability"],
  [files.reminderCapability, "delivery_status", "reminder delivery status"],
  [files.reminderCapability, "next_setup_step", "reminder next setup step"],
  [files.reminderCheckScript, "check-reminder-capability", "reminder capability check script identity"],
  [files.reminderCheckScript, "can_send_email_reminders", "reminder capability check script scheduled email output"],
  [files.reminderCheckScript, "--strict", "reminder capability strict mode"],
  [files.reminderCheckScript, "--cron", "reminder cron dry-run option"],
  [files.reminderCheckScript, "CHECK_REMINDER_CRON_SECRET", "reminder cron dry-run secret env"],
  [files.reminderCheckScript, "/api/cron/daily-tarot-reminders?dry_run=1", "reminder cron dry-run endpoint"],
  [files.reminderUnsubscribe, "verifyDailyReminderUnsubscribeToken", "unsubscribe token verification"],
  [files.reminderUnsubscribe, "disableDailyReminders", "unsubscribe disables reminders through RPC"],
  [files.reminderRpc, "disable_daily_tarot_reminders", "unsubscribe RPC helper"],
  [files.reminderUnsubscribeToken, "DAILY_TAROT_UNSUBSCRIBE_SECRET", "dedicated unsubscribe secret"],
  [files.reminderUnsubscribeToken, "timingSafeEqual", "safe unsubscribe token comparison"],
  [files.dailyTarotTool, "data-daily-return-setup", "Daily Tarot return setup panel"],
  [files.dailyTarotTool, "data-daily-return-setup-calendar", "Daily Tarot prominent calendar reminder CTA"],
  [files.dailyTarotTool, "data-daily-return-setup-reminder", "Daily Tarot reminder preference CTA"],
  [files.dailyTarotTool, "returnSetupTitle", "Daily Tarot return setup localized copy"],
  [files.dailyTarotTool, "data-daily-return-commitment className=\"min-w-0", "Daily Tarot return cue panel can shrink on narrow mobile"],
  [files.dailyTarotTool, "className=\"grid min-w-0 gap-3\"", "Daily Tarot return cue form grid can shrink on narrow mobile"],
  [files.dailyTarotTool, "className=\"mt-3 min-h-11 min-w-0 w-full", "Daily Tarot return cue input can shrink on narrow mobile"],
  [files.dailyTarotTool, "className=\"min-h-24 min-w-0 rounded-lg", "Daily Tarot return cue textarea can shrink on narrow mobile"],
]

for (const [file, needle, label] of dailyReminderCoverage) {
  assertIncludes(file, needle, label)
}

const dailyTarotShareCoverage = [
  [files.dailyTarotTool, "getDailyFallbackShareUrl", "Daily Tarot fallback share URL helper"],
  [files.dailyTarotTool, "utm_campaign: \"daily_tarot\"", "Daily Tarot fallback share campaign"],
  [files.dailyTarotTool, "fallback: true", "Daily Tarot fallback share analytics metadata"],
  [files.dailyTarotTool, "shareDailyFallbackCaption", "Daily Tarot fallback share handler"],
  [files.dailyTarotTool, "Log in to create a public Daily Tarot page", "Daily Tarot fallback share copy"],
  [files.dailyTarotTool, "data-daily-pattern-free-cta", "Daily Tarot free pattern CTA"],
  [files.dailyTarotTool, "utm_medium: \"daily_pattern\"", "Daily Tarot pattern CTA attribution"],
  [files.dailyTarotTool, "daily-pattern-free-reading", "Daily Tarot pattern CTA campaign"],
]

for (const [file, needle, label] of dailyTarotShareCoverage) {
  assertIncludes(file, needle, label)
}

const monthlyReportCoverage = [
  [files.memberGate, "monthly_report", "monthly report membership feature key"],
  [files.memberGate, "Monthly reports are a membership feature", "monthly report membership response copy"],
  [files.monthlyReportPage, "MonthlyTarotReportView", "explicit monthly report route"],
  [files.monthlyReportPage, "getSeoAlternates(\"monthly-tarot-report\")", "monthly report SEO alternates"],
  [files.monthlyReportTool, "data-monthly-free-checkin", "monthly report free check-in section"],
  [files.monthlyReportTool, "data-monthly-free-checkin-question", "monthly report direct free question links"],
  [files.monthlyReportTool, "utm_medium: medium", "monthly report free check-in attribution helper"],
  [files.monthlyReportTool, "\"free_checkin\"", "monthly report free check-in campaign link"],
  [files.monthlyReportTool, "data-monthly-report-locked", "monthly report locked state"],
  [files.monthlyReportTool, "monthlyReportApi.get", "monthly report client fetch"],
  [files.monthlyReportTool, "data-monthly-report-ready", "monthly report ready state"],
  [files.monthlyReportTool, "report.next_month_prompts", "monthly report next question prompts"],
  [files.monthlyReportRoute, "requireMemberAccess(auth.supabase, auth.user, \"monthly_report\", lang)", "monthly report server member gate"],
  [files.monthlyReportRoute, ".from(\"tarot_readings\")", "monthly report reads saved readings"],
  [files.monthlyReportRoute, ".from(\"daily_tarot_entries\")", "monthly report reads daily entries"],
  [files.monthlyReportRoute, ".eq(\"user_id\", auth.user.id)", "monthly report current-user filters"],
  [files.monthlyReportRoute, "journal_notes", "monthly report journal summary"],
  [files.monthlyReportRoute, "top_cards", "monthly report repeated cards"],
]

for (const [file, needle, label] of monthlyReportCoverage) {
  assertIncludes(file, needle, label)
}

const publicShareConversionCoverage = [
  [files.sharePage, "function sharedReadingHref", "public share same-question href helper"],
  [files.sharePage, "q: share.question", "public share carries original question"],
  [files.sharePage, "params.set(\"spread\", share.spread_type)", "public share carries original spread"],
  [files.sharePage, "getShareSpreadContext", "public share resolves spread context"],
  [files.sharePage, "getSharePositionLabel", "public share renders spread-aware position labels"],
  [files.sharePage, "if (card.position) return card.position", "public share preserves stored card position"],
  [files.sharePage, "Position-aware reading", "public share position-aware badge"],
  [files.shareRoute, "position: trimText(card.position, 80) || undefined", "public share API persists card position"],
  [files.shareTemplates, "card.position ? `${card.position}: ${card.name}`", "share templates include card positions"],
  [files.sharePage, "data-public-share-free-loop", "public share free conversion section"],
  [files.sharePage, "data-public-share-daily-return", "public share Daily Tarot return section"],
  [files.sharePage, "data-public-share-daily-return-cta", "public share Daily Tarot return CTA"],
  [files.sharePage, "shareDailyReturnFeatures", "public share Daily Tarot return feature list"],
  [files.sharePage, "Journal streak", "public share Daily Tarot journal retention copy"],
  [files.sharePage, "Reminder", "public share Daily Tarot reminder retention copy"],
  [files.sharePage, "Ask This Question Free", "public share same-question CTA"],
  [files.sharePage, "Start a New Question", "public share alternate new-question CTA"],
  [files.sharePage, "utm_medium: \"public_share\"", "public share attribution"],
  [files.sharePage, "publicShareRelatedQuestions", "public share related question selector"],
  [files.sharePage, "data-public-share-related-questions", "public share related questions section"],
  [files.sharePage, "data-public-share-related-question-card", "public share related question cards"],
  [files.sharePage, "data-public-share-related-question-start", "public share related question free-spread CTA"],
  [files.sharePage, "data-public-share-related-question-guide", "public share related question guide CTA"],
  [files.sharePage, "#related-question-paths", "public share related question structured data"],
  [files.sharePage, "public_share_related_question", "public share related question attribution"],
  [files.sharePage, "Start related free tarot spread", "public share related question structured action"],
]

for (const [file, needle, label] of publicShareConversionCoverage) {
  assertIncludes(file, needle, label)
}

const freeFirstReadingCoverage = [
  [files.memberGate, "export async function requireMemberAccess", "shared server member gate"],
  [files.memberGate, "Saved reading history is a membership feature", "history membership response copy"],
  [files.memberGate, "Deeper follow-up questions are a membership feature", "follow-up membership response copy"],
  [files.memberGate, "Advanced spreads are a membership feature", "advanced spread membership response copy"],
  [files.memberGate, "Monthly reports are a membership feature", "monthly report membership response copy"],
  [files.spreadConfig, "export const FREE_SPREAD_TYPES", "free spread allowlist"],
  [files.spreadConfig, "export function isAdvancedSpreadType", "advanced spread classifier"],
  [files.spreadConfig, "return SPREAD_CONFIGS.three_card", "advanced spread free fallback"],
  [files.readingRoute, "if (isFollowUp)", "follow-up-only auth gate"],
  [files.readingRoute, "const auth = await requireUser(req)", "follow-up auth check"],
  [files.readingRoute, "if (!auth.ok) return auth.response", "follow-up unauthorized response"],
  [files.readingRoute, "requireMemberAccess(auth.supabase, auth.user, \"followup\", lang)", "follow-up membership gate"],
  [files.readingRoute, "isAdvancedSpreadType(spread_type) || (Array.isArray(cards) && cards.length > 3)", "advanced spread server detection"],
  [files.readingRoute, "requireMemberAccess(auth.supabase, auth.user, \"advanced_spread\", lang)", "advanced spread membership gate"],
  [files.readingRoute, "getSpreadPromptInstruction", "reading prompt uses actual spread context"],
  [files.readingRoute, "Do not reframe the reading as past/present/future", "reading prompt avoids forced three-card framing"],
  [files.readingRoute, "getReadingTaskPrompt", "reading prompt localized task instructions"],
  [files.readingRoute, "getSpreadConfig(spreadType).positions", "reading fallback positions from spread config"],
  [files.readingDetailPage, "getReadingDetailPositionLabel", "reading detail uses spread-aware position labels"],
  [files.readingDetailPage, "if (card.position) return card.position", "reading detail preserves saved card position"],
  [files.readingDetailPage, "getSpreadConfig(spreadType).positions", "reading detail fallback positions from spread config"],
  [files.readingDetailPage, "resolveCatalogCard", "reading detail resolves saved cards against tarot catalog"],
  [files.readingSpreadsRoute, "is_advanced: isAdvancedSpreadType(spread.type)", "spread list advanced marker"],
  [files.readingClassifyRoute, "is_advanced: isAdvancedSpreadType(best.type)", "classified spread advanced marker"],
  [files.readingCreateRoute, "requireMemberAccess(auth.supabase, auth.user, \"history\", lang)", "history create membership gate"],
  [files.readingHistoryRoute, "requireMemberAccess(auth.supabase, auth.user, \"history\")", "history list membership gate"],
  [files.readingHistoryRoute, ".eq(\"user_id\", auth.user.id)", "history list current-user filter"],
  [files.readingDetailRoute, "requireMemberAccess(auth.supabase, auth.user, \"history\")", "history detail membership gate"],
  [files.readingDetailRoute, ".eq(\"user_id\", auth.user.id)", "history detail current-user filter"],
  [files.readingSaveRoute, "requireMemberAccess(auth.supabase, auth.user, \"history\", lang)", "history save membership gate"],
  [files.readingSaveRoute, ".eq(\"user_id\", auth.user.id)", "history save current-user filter"],
  [files.readingPage, "user?.is_member && !readingId", "member-only reading history creation"],
  [files.readingPage, "Creating anonymous share session", "share-only anonymous session"],
  [files.readingPage, "share_session_only", "share session analytics signal"],
  [files.inputPage, "resolveSpreadForAccess", "input advanced spread downgrade"],
  [files.inputPage, "Switched to a free starter spread", "advanced spread downgrade copy"],
  [files.inputPage, "data-input-intent-hint", "input matched SEO intent hint"],
  [files.inputPage, "data-input-mobile-intent-compact", "input matched SEO intent mobile compact hint"],
  [files.inputPage, "data-input-entry-context", "input advanced spread entry context"],
  [files.inputPage, "locale={readingLocale}", "input SEO locale propagation to card controls"],
  [files.inputPage, "Matched free spread", "input matched free spread copy"],
  [files.inputPage, "searchParams.get(\"source\")", "input source attribution label"],
  [files.inputPage, "router.push(\"/membership\")", "advanced spread upgrade CTA"],
  [files.readingPage, "fallback_share", "free reading fallback share URL"],
  [files.readingPage, "fallback: true", "free reading fallback share analytics metadata"],
  [files.readingPage, "share_template_copied", "free reading fallback share compatible analytics event"],
  [files.readingPage, "activeReadingLocale", "reading result SEO locale UI state"],
  [files.readingPage, "shareTemplateLocale", "regional share template safe fallback"],
  [files.readingPage, "data-reading-return-path", "free reading daily return path"],
  [files.readingPage, "data-reading-next-free-paths", "reading result next free question path"],
  [files.readingPage, "data-reading-next-free-question", "reading result next free question links"],
  [files.readingPage, "next_free_question", "reading result next free question attribution"],
  [files.readingPage, "source: \"reading_result\"", "reading result next free question source"],
  [files.readingPage, "spread: \"their_thoughts\"", "reading result love intent spread"],
  [files.readingPage, "spread: \"breakup_recovery\"", "reading result ex intent spread"],
  [files.readingPage, "spread: \"job_opportunity\"", "reading result career intent spread"],
  [files.readingPage, "utm_source=reading_result", "reading result return attribution"],
  [files.readingPage, "/daily-tarot?", "reading result Daily Tarot return link"],
  [files.readingDetailPage, "data-reading-detail-return-path", "saved reading Daily Tarot return path"],
  [files.readingDetailPage, "utm_source: \"reading_history\"", "saved reading return attribution"],
  [files.readingDetailPage, "utm_campaign: \"saved_reading\"", "saved reading return campaign"],
  [files.readingDetailPage, "/daily-tarot?", "saved reading Daily Tarot return link"],
  [files.readingPage, "Log in to create a public result page", "free reading share fallback copy"],
  [files.readingPage, "Log in to continue with deeper follow-up questions", "follow-up login boundary copy"],
  [files.readingPage, "isUpgradeErrorMessage(error)", "follow-up upgrade CTA detection"],
  [files.readingPage, "Upgrade to save history", "history-save membership prompt"],
  [files.profilePage, "History is a member feature", "profile history member gate copy"],
  [files.profilePage, "activeTab === \"history\" && isLoggedIn && user?.is_member", "profile history member-only fetch"],
  [files.readingPage, "Membership stays for deeper follow-ups", "membership boundary copy"],
]

for (const [file, needle, label] of freeFirstReadingCoverage) {
  assertIncludes(file, needle, label)
}

console.log("SEO coverage checks passed.")
