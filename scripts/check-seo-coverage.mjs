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

function assertBefore(file, first, second, label) {
  const firstIndex = file.source.indexOf(first)
  const secondIndex = file.source.indexOf(second)
  if (firstIndex === -1) {
    throw new Error(`${file.path} is missing ${label} first marker: ${first}`)
  }
  if (secondIndex === -1) {
    throw new Error(`${file.path} is missing ${label} second marker: ${second}`)
  }
  if (firstIndex > secondIndex) {
    throw new Error(`${file.path} should place ${label} before fallback: ${first} before ${second}`)
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
  readme: { path: "README.md", source: read("README.md") },
  envExample: { path: ".env.example", source: read(".env.example") },
  packageJson: { path: "package.json", source: read("package.json") },
  nextConfig: { path: "next.config.mjs", source: read("next.config.mjs") },
  mobileCheck: { path: "scripts/check-mobile-layout.mjs", source: read("scripts/check-mobile-layout.mjs") },
  desktopScrollCheck: { path: "scripts/check-desktop-scroll.mjs", source: read("scripts/check-desktop-scroll.mjs") },
  pwaCheck: { path: "scripts/check-pwa-installability.mjs", source: read("scripts/check-pwa-installability.mjs") },
  layout: { path: "app/layout.tsx", source: read("app/layout.tsx") },
  homePage: { path: "app/page.tsx", source: read("app/page.tsx") },
  dailyTarotCopy: { path: "lib/daily-tarot.ts", source: read("lib/daily-tarot.ts") },
  dailyTarotPage: { path: "app/daily-tarot/page.tsx", source: read("app/daily-tarot/page.tsx") },
  dailyTarotTool: {
    path: "components/daily/daily-tarot-tool.tsx",
    source: read("components/daily/daily-tarot-tool.tsx"),
  },
  clientCalendarReminder: {
    path: "lib/client-calendar-reminder.ts",
    source: read("lib/client-calendar-reminder.ts"),
  },
  analyticsEventRoute: {
    path: "app/api/analytics/event/route.ts",
    source: read("app/api/analytics/event/route.ts"),
  },
  homeExperience: {
    path: "components/mystic-background.tsx",
    source: read("components/mystic-background.tsx"),
  },
  menuPanel: {
    path: "components/menu-panel.tsx",
    source: read("components/menu-panel.tsx"),
  },
  menuButton: {
    path: "components/menu-button.tsx",
    source: read("components/menu-button.tsx"),
  },
  globalStyles: { path: "app/globals.css", source: read("app/globals.css") },
  manifest: { path: "public/manifest.webmanifest", source: read("public/manifest.webmanifest") },
  siteManifest: { path: "public/site.webmanifest", source: read("public/site.webmanifest") },
  serviceWorker: { path: "public/sw.js", source: read("public/sw.js") },
  iconSvg: { path: "public/icon.svg", source: read("public/icon.svg") },
  logoSvg: { path: "public/logo.svg", source: existsSync(join(root, "public/logo.svg")) ? read("public/logo.svg") : "" },
  robots: { path: "app/robots.ts", source: read("app/robots.ts") },
  vercelConfig: { path: "vercel.json", source: read("vercel.json") },
  tarotCardSeo: { path: "lib/tarot-card-seo.ts", source: read("lib/tarot-card-seo.ts") },
  cardMeaningPage: {
    path: "components/seo/tarot-card-meaning-page.tsx",
    source: read("components/seo/tarot-card-meaning-page.tsx"),
  },
  tarotCardCombinationsPage: {
    path: "components/seo/tarot-card-combinations-page.tsx",
    source: read("components/seo/tarot-card-combinations-page.tsx"),
  },
  tarotCardCombinationsRoute: {
    path: "app/tarot-card-combinations/page.tsx",
    source: read("app/tarot-card-combinations/page.tsx"),
  },
  spanishTarotCardCombinationsRoute: {
    path: "app/es/combinaciones-cartas-tarot/page.tsx",
    source: read("app/es/combinaciones-cartas-tarot/page.tsx"),
  },
  portugueseTarotCardCombinationsRoute: {
    path: "app/pt-br/combinacoes-cartas-tarot/page.tsx",
    source: read("app/pt-br/combinacoes-cartas-tarot/page.tsx"),
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
  chineseTarotCardRoute: {
    path: "app/zh/tarot-card-meanings/[card]/page.tsx",
    source: read("app/zh/tarot-card-meanings/[card]/page.tsx"),
  },
  japaneseTarotCardRoute: {
    path: "app/ja/tarot-card-meanings/[card]/page.tsx",
    source: read("app/ja/tarot-card-meanings/[card]/page.tsx"),
  },
  koreanTarotCardRoute: {
    path: "app/ko/tarot-card-meanings/[card]/page.tsx",
    source: read("app/ko/tarot-card-meanings/[card]/page.tsx"),
  },
  seoPages: { path: "lib/seo-pages.ts", source: read("lib/seo-pages.ts") },
  site: { path: "lib/site.ts", source: read("lib/site.ts") },
  spreadConfig: { path: "lib/spread-config.ts", source: read("lib/spread-config.ts") },
  tarotSpreadsPage: {
    path: "components/seo/tarot-spreads-page.tsx",
    source: read("components/seo/tarot-spreads-page.tsx"),
  },
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
  seoQuestionShareActions: {
    path: "components/seo/seo-question-share-actions.tsx",
    source: read("components/seo/seo-question-share-actions.tsx"),
  },
  trustPages: { path: "lib/trust-pages.ts", source: read("lib/trust-pages.ts") },
  trustSignals: { path: "lib/trust-signals.ts", source: read("lib/trust-signals.ts") },
  trustPageView: {
    path: "components/trust/trust-page.tsx",
    source: read("components/trust/trust-page.tsx"),
  },
  readerFeedbackForm: {
    path: "components/trust/reader-feedback-form.tsx",
    source: read("components/trust/reader-feedback-form.tsx"),
  },
  feedbackRoute: {
    path: "app/api/feedback/route.ts",
    source: read("app/api/feedback/route.ts"),
  },
  readerFeedbackMigration: {
    path: "supabase/migrations/20260627122534_create_reader_feedback.sql",
    source: read("supabase/migrations/20260627122534_create_reader_feedback.sql"),
  },
  reminderCapability: {
    path: "app/api/daily-tarot/reminder-capability/route.ts",
    source: read("app/api/daily-tarot/reminder-capability/route.ts"),
  },
  reminderCron: {
    path: "app/api/cron/daily-tarot-reminders/route.ts",
    source: read("app/api/cron/daily-tarot-reminders/route.ts"),
  },
  reminderCronAuth: {
    path: "lib/server/cron-auth.ts",
    source: read("lib/server/cron-auth.ts"),
  },
  reminderCronTest: {
    path: "app/api/cron/daily-tarot-reminders/test/route.ts",
    source: read("app/api/cron/daily-tarot-reminders/test/route.ts"),
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
  reminderSchedule: {
    path: "lib/server/daily-reminder-schedule.ts",
    source: read("lib/server/daily-reminder-schedule.ts"),
  },
  reminderCheckScript: {
    path: "scripts/check-reminder-capability.mjs",
    source: read("scripts/check-reminder-capability.mjs"),
  },
  reminderScheduleCheckScript: {
    path: "scripts/check-reminder-schedule.mjs",
    source: read("scripts/check-reminder-schedule.mjs"),
  },
  reminderPrivateGrantMigration: {
    path: "supabase/migrations/20260627133221_tighten_daily_reminder_private_rpc_grants.sql",
    source: read("supabase/migrations/20260627133221_tighten_daily_reminder_private_rpc_grants.sql"),
  },
  reminderServiceGrantMigration: {
    path: "supabase/migrations/20260628084719_lock_daily_reminder_rpc_to_service_role.sql",
    source: read("supabase/migrations/20260628084719_lock_daily_reminder_rpc_to_service_role.sql"),
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
  membershipPage: {
    path: "app/membership/page.tsx",
    source: read("app/membership/page.tsx"),
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
  shareNotFound: {
    path: "app/share/not-found.tsx",
    source: read("app/share/not-found.tsx"),
  },
  shareRoute: {
    path: "app/api/reading/share/route.ts",
    source: read("app/api/reading/share/route.ts"),
  },
  shareTemplates: {
    path: "lib/share-templates.ts",
    source: read("lib/share-templates.ts"),
  },
  shareCopyActions: {
    path: "components/share/share-copy-actions.tsx",
    source: read("components/share/share-copy-actions.tsx"),
  },
  freeToolsPage: {
    path: "app/free-tarot-tools/page.tsx",
    source: read("app/free-tarot-tools/page.tsx"),
  },
  localizedFreeToolsPage: {
    path: "components/seo/free-tools-localized-page.tsx",
    source: read("components/seo/free-tools-localized-page.tsx"),
  },
  spanishFreeToolsRoute: {
    path: "app/es/herramientas-tarot-gratis/page.tsx",
    source: read("app/es/herramientas-tarot-gratis/page.tsx"),
  },
  portugueseFreeToolsRoute: {
    path: "app/pt-br/ferramentas-tarot-gratis/page.tsx",
    source: read("app/pt-br/ferramentas-tarot-gratis/page.tsx"),
  },
  sitemap: { path: "app/sitemap.ts", source: read("app/sitemap.ts") },
  searchAssetCheck: {
    path: "scripts/check-search-assets.mjs",
    source: read("scripts/check-search-assets.mjs"),
  },
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

for (const section of ["#spread-positions", "#example-readings", "#combinations", "#faq", "#question-paths", "#daily-practice", "#daily-return", "#context-signals", "#reader-trust"]) {
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
  ["representativeTestimonials.find", "card page representative testimonial reuse"],
  ["#reader-trust", "card reader trust structured data item list"],
  ["#reader-feedback", "card reader feedback structured data"],
  ["data-card-reader-trust", "card reader trust visible section"],
  ["data-card-reader-trust-review", "card reader trust review date"],
  ["data-card-reader-trust-item", "card reader trust signal cards"],
  ["data-card-reader-trust-feedback", "card reader trust representative feedback"],
  ["data-card-reader-trust-link", "card reader trust links"],
  ["cardReaderTrustLinks", "card reader trust link helper"],
  ["\"/editorial-policy\"", "card reader trust editorial policy link"],
  ["\"/ai-tarot-disclaimer\"", "card reader trust AI disclaimer link"],
  ["\"/privacy\"", "card reader trust privacy link"],
  ["\"/reviews\"", "card reader trust reviews link"],
  ["\"/tarot-reading-examples\"", "card reader trust examples link"],
  ["data-card-context-signal-grid", "English card context signal grid hook"],
  ["#context-signal-grid", "English card context signal structured data"],
  ["data-card-context-signal-link", "English card context signal free-spread links"],
  ["page.locale !== \"en\"", "card context signal English-first guard"],
  ["Open free spread", "English card context signal CTA"],
  ["getAllLocalizedSeoPages", "card question path SEO page lookup"],
  ["cardQuestionPathStartHref", "card question path direct spread helper"],
  ["source: \"card_meaning_question_path\"", "card question path direct spread source"],
  ["utm_medium: \"card_question_path\"", "card question path direct spread attribution"],
  ["data-card-question-paths", "card question path visible section"],
  ["data-card-question-path", "card question path visible cards"],
  ["data-card-question-path-guide", "card question path crawlable guide links"],
  ["data-card-question-path-start", "card question path direct free spread links"],
  ["Start free spread", "English card question direct spread CTA"],
  ["potentialAction", "card question path structured data direct action"],
  ["cardDailyReturnHref", "card meaning Daily Tarot return helper"],
  ["data-card-daily-return", "card meaning Daily Tarot return panel"],
  ["data-card-daily-return-cta", "card meaning Daily Tarot return CTA"],
  ["data-card-daily-return-free-reading", "card meaning Daily Tarot secondary free reading CTA"],
  ["return_focus: copy.focus", "card meaning Daily Tarot return focus"],
  ["utm_medium: \"card_daily_return\"", "card meaning Daily Tarot return attribution"],
  ["#daily-return-path", "card meaning Daily Tarot return structured data"],
  ["Use in Daily Tarot", "English card meaning Daily Tarot return CTA copy"],
  ["cardCombinationHref", "card combination internal-link helper"],
  ["combinationLinkLabel", "card combination localized link label"],
  ["#card-combinations", "card combination structured data item list"],
  ["Open paired card", "English paired-card link label"],
  ["createNeighborCardLinks", "card neighbor navigation helper"],
  ["data-card-neighbor-nav", "card neighbor visible navigation"],
  ["data-card-neighbor-link", "card neighbor visible links"],
  ["#neighbor-card-meanings", "card neighbor structured data item list"],
  ["Previous card", "English previous card label"],
  ["Next card", "English next card label"],
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
assertIncludes(files.seoLanding, "#card-meaning-context-guide", "card meaning context guide structured data")
assertIncludes(files.seoLanding, "data-card-meaning-context-guide", "card meaning context guide visible section")
assertIncludes(files.seoLanding, "data-card-meaning-context-guide-item", "card meaning context guide item cards")
assertIncludes(files.seoLanding, "data-card-meaning-context-guide-link", "card meaning context guide visible links")
assertIncludes(files.seoLanding, "cardMeaningContextGuideHref", "card meaning context guide href helper")
assertIncludes(files.seoLanding, "What advice do these cards have for me right now?", "card meaning context guide advice free spread")
assertIncludes(files.seoLanding, "Capas de significado", "Spanish card meaning context guide copy")
assertIncludes(files.seoLanding, "Que consejo tienen estas cartas para mi ahora?", "Spanish card meaning context guide advice question")
assertIncludes(files.seoLanding, "Camadas de significado", "Portuguese card meaning context guide copy")
assertIncludes(files.seoLanding, "Que conselho estas cartas tem para mim agora?", "Portuguese card meaning context guide advice question")
assertIncludes(files.seoLanding, "#card-context-hubs", "card context hub structured data")
assertIncludes(files.seoLanding, "data-card-context-hubs", "card context visible hub links")
assertIncludes(files.seoLanding, "cardIndexHref(cardPage, activeCardIndexMode)", "card context card anchor hrefs")
assertIncludes(files.seoLanding, "#card-meaning-free-starts", "card meaning free-start structured data")
assertIncludes(files.seoLanding, "data-card-meaning-free-starts", "card meaning free-start visible section")
assertIncludes(files.seoLanding, "data-card-meaning-free-start", "card meaning free-start cards")
assertIncludes(files.seoLanding, "cardMeaningFreeStartHref(page, cardPage, activeCardIndexMode)", "card meaning free-start direct hrefs")
assertIncludes(files.seoLanding, "utm_medium: \"card_meaning_free_start\"", "card meaning free-start attribution")

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
  "does-he-miss-me-tarot",
  "is-he-hiding-his-feelings-tarot",
  "why-did-he-pull-away-tarot",
  "is-she-thinking-about-me-tarot",
  "should-i-text-her-tarot",
  "does-my-crush-like-me-tarot",
  "will-he-text-me-tarot",
  "does-she-love-me-tarot",
  "how-does-she-feel-about-me-tarot",
  "will-she-text-me-tarot",
  "what-are-her-intentions-tarot",
  "what-does-she-think-of-me-tarot",
  "will-she-contact-me-tarot",
  "does-she-miss-me-tarot",
  "is-she-hiding-her-feelings-tarot",
  "why-did-she-pull-away-tarot",
  "should-i-break-up-with-him-tarot",
  "should-i-break-up-with-her-tarot",
  "when-will-i-find-love-tarot",
  "what-are-his-intentions-tarot",
  "will-we-get-back-together-tarot",
  "is-he-my-soulmate-tarot",
  "is-she-my-soulmate-tarot",
  "money-tarot-reading",
  "will-i-get-money-tarot",
  "should-i-spend-money-tarot",
  "financial-future-tarot-reading",
  "weekly-tarot-reading",
  "weekly-love-tarot",
  "weekly-career-tarot",
  "what-does-he-think-of-me-tarot",
  "will-he-contact-me-tarot",
  "is-this-relationship-over-tarot",
  "should-i-move-on-tarot",
  "no-contact-tarot-reading",
  "does-no-contact-work-tarot",
  "will-my-ex-reach-out-tarot",
  "should-i-stay-or-leave-tarot",
  "should-i-give-him-another-chance-tarot",
  "should-i-give-her-another-chance-tarot",
  "twin-flame-tarot-reading",
  "will-i-get-married-tarot",
  "will-i-get-the-job-tarot",
  "should-i-take-this-job-tarot",
  "should-i-accept-this-job-offer-tarot",
  "will-i-get-promoted-tarot",
  "what-career-is-right-for-me-tarot",
  "should-i-start-a-business-tarot",
  "will-my-business-succeed-tarot",
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

const freeSpreadFormatSlugs = [
  "one-card-tarot-reading",
  "three-card-tarot-reading",
  "past-present-future-tarot",
]

for (const slug of freeSpreadFormatSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `free spread format SEO page ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `free spread format site link ${slug}`)
  assertIncludes(files.mobileCheck, `/${slug}`, `mobile check spread format page ${slug}`)
  assertIncludes(files.searchAssetCheck, `"/${slug}"`, `search asset sitemap check for ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `spread format related cluster for ${slug}`,
  )
}

assertIncludes(files.spreadConfig, "| 'single_card'", "single-card free spread type")
assertIncludes(files.spreadConfig, "single_card: {", "single-card spread config")
assertIncludes(files.spreadConfig, "'single_card',", "single-card free spread access")
assertIncludes(files.tarotSpreadsPage, "\"single_card\"", "tarot spreads includes single-card spread")
assertIncludes(files.site, "freeSpreadFormatLinks", "site graph free spread format links")
assertIncludes(files.site, "freeSpreadFormatJsonLdItems", "site graph free spread format structured data")
assertIncludes(files.seoLanding, "freeSpreadFormatLinks", "SEO landing imports free spread format links")
assertIncludes(files.seoLanding, "seo_spread_format_page", "SEO landing spread format source attribution")
assertIncludes(files.seoLanding, "actionIntentSlugs", "SEO landing action intent enhancement includes spread formats")

const sheFocusedRegionalQuestionSlugs = [
  "what-does-she-think-of-me-tarot",
  "will-she-contact-me-tarot",
  "is-she-my-soulmate-tarot",
  "does-she-miss-me-tarot",
  "is-she-hiding-her-feelings-tarot",
  "why-did-she-pull-away-tarot",
]

for (const slug of sheFocusedRegionalQuestionSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `she-focused regional SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `she-focused regional locale control ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `regional question hub entry ${slug}`)
}

for (const [localizedSlug, label] of [
  ["que-piensa-ella-de-mi-tarot", "Spanish what does she think localized slug"],
  ["ella-me-contactara-tarot", "Spanish will she contact localized slug"],
  ["ella-es-mi-alma-gemela-tarot", "Spanish she soulmate localized slug"],
  ["ella-me-extrana-tarot", "Spanish does she miss me localized slug"],
  ["ella-oculta-sus-sentimientos-tarot", "Spanish she hiding feelings localized slug"],
  ["por-que-ella-se-alejo-tarot", "Spanish why she pulled away localized slug"],
  ["o-que-ela-pensa-de-mim-tarot", "Portuguese what does she think localized slug"],
  ["ela-vai-entrar-em-contato-tarot", "Portuguese will she contact localized slug"],
  ["ela-e-minha-alma-gemea-tarot", "Portuguese she soulmate localized slug"],
  ["ela-sente-minha-falta-tarot", "Portuguese does she miss me localized slug"],
  ["ela-esconde-os-sentimentos-tarot", "Portuguese she hiding feelings localized slug"],
  ["por-que-ela-se-afastou-tarot", "Portuguese why she pulled away localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Tarot: ¿qué piensa ella de mí?",
  "Tarot: ¿ella me contactará?",
  "Tarot: ¿ella es mi alma gemela?",
  "Tarot: ¿ella me extraña?",
  "Tarot: ¿ella oculta sus sentimientos?",
  "Tarot: ¿por qué ella se alejó?",
  "Tarot: o que ela pensa de mim?",
  "Tarot: ela vai entrar em contato?",
  "Tarot: ela é minha alma gêmea?",
  "Tarot: ela sente minha falta?",
  "Tarot: ela esconde os sentimentos?",
  "Tarot: por que ela se afastou?",
  "Que piensa ella de mi?",
  "Ella me contactara?",
  "Ella es mi alma gemela?",
  "Ella me extrana?",
  "Ella oculta sus sentimientos?",
  "Por que ella se alejo?",
  "O que ela pensa de mim?",
  "Ela vai entrar em contato?",
  "Ela e minha alma gemea?",
  "Ela sente minha falta?",
  "Ela esconde os sentimentos?",
  "Por que ela se afastou?",
]) {
  const file = regionalCopy.startsWith("Tarot:") ? files.seoPages : files.tarotQuestions
  assertIncludes(file, regionalCopy, `she-focused regional copy ${regionalCopy}`)
}

const maleEmotionRegionalQuestionSlugs = [
  "does-he-miss-me-tarot",
  "is-he-hiding-his-feelings-tarot",
  "why-did-he-pull-away-tarot",
]

for (const slug of maleEmotionRegionalQuestionSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `male emotion regional SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `male emotion regional locale control ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `regional male emotion question hub entry ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `male emotion related question cluster for ${slug}`,
  )
}

for (const [localizedSlug, label] of [
  ["el-me-extrana-tarot", "Spanish does he miss me localized slug"],
  ["oculta-sus-sentimientos-tarot", "Spanish hiding feelings localized slug"],
  ["por-que-se-alejo-tarot", "Spanish pull away localized slug"],
  ["ele-sente-minha-falta-tarot", "Portuguese does he miss me localized slug"],
  ["ele-esconde-os-sentimentos-tarot", "Portuguese hiding feelings localized slug"],
  ["por-que-ele-se-afastou-tarot", "Portuguese pull away localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Tarot: ¿él me extraña?",
  "Tarot: ¿oculta sus sentimientos?",
  "Tarot: ¿por qué se alejó?",
  "Tarot: ele sente minha falta?",
  "Tarot: ele esconde os sentimentos?",
  "Tarot: por que ele se afastou?",
  "El me extrana?",
  "Oculta sus sentimientos?",
  "Por que se alejo?",
  "Ele sente minha falta?",
  "Ele esconde os sentimentos?",
  "Por que ele se afastou?",
]) {
  const file = regionalCopy.startsWith("Tarot:") ? files.seoPages : files.tarotQuestions
  assertIncludes(file, regionalCopy, `male emotion regional copy ${regionalCopy}`)
}

const careerFocusedRegionalQuestionSlugs = [
  "should-i-accept-this-job-offer-tarot",
  "will-i-get-promoted-tarot",
  "what-career-is-right-for-me-tarot",
]

for (const slug of careerFocusedRegionalQuestionSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `career-focused regional SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `career-focused regional locale control ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `regional career question hub entry ${slug}`)
}

for (const [localizedSlug, label] of [
  ["debo-aceptar-esta-oferta-de-trabajo-tarot", "Spanish accept job offer localized slug"],
  ["conseguire-un-ascenso-tarot", "Spanish promotion localized slug"],
  ["que-carrera-es-para-mi-tarot", "Spanish career direction localized slug"],
  ["devo-aceitar-esta-oferta-de-trabalho-tarot", "Portuguese accept job offer localized slug"],
  ["vou-ser-promovido-tarot", "Portuguese promotion localized slug"],
  ["qual-carreira-combina-comigo-tarot", "Portuguese career direction localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Tarot: ¿debo aceptar esta oferta de trabajo?",
  "Tarot: ¿conseguiré un ascenso?",
  "Tarot: ¿qué carrera es para mí?",
  "Tarot: devo aceitar esta oferta de trabalho?",
  "Tarot: vou ser promovido?",
  "Tarot: qual carreira combina comigo?",
  "Deberia aceptar esta oferta de trabajo?",
  "Conseguire un ascenso?",
  "Que carrera es para mi?",
  "Devo aceitar esta oferta de trabalho?",
  "Vou ser promovido?",
  "Qual carreira combina comigo?",
]) {
  const file = regionalCopy.startsWith("Tarot:") ? files.seoPages : files.tarotQuestions
  assertIncludes(file, regionalCopy, `career-focused regional copy ${regionalCopy}`)
}

const moneyFocusedRegionalQuestionSlugs = [
  "will-i-get-money-tarot",
  "should-i-spend-money-tarot",
  "financial-future-tarot-reading",
]

for (const slug of moneyFocusedRegionalQuestionSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `money-focused regional SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `money-focused regional locale control ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `regional money question hub entry ${slug}`)
  assertIncludes(files.mobileCheck, `/${slug}`, `mobile check money-focused page ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `money-focused related question cluster for ${slug}`,
  )
}

for (const [localizedSlug, label] of [
  ["recibire-dinero-tarot", "Spanish money improvement localized slug"],
  ["debo-gastar-dinero-tarot", "Spanish spending decision localized slug"],
  ["lectura-tarot-futuro-financiero", "Spanish financial future localized slug"],
  ["vou-receber-dinheiro-tarot", "Portuguese money improvement localized slug"],
  ["devo-gastar-dinheiro-tarot", "Portuguese spending decision localized slug"],
  ["leitura-tarot-futuro-financeiro", "Portuguese financial future localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Tarot: ¿recibire dinero?",
  "Tarot: ¿debo gastar dinero?",
  "Lectura de tarot del futuro financiero",
  "Tarot: vou receber dinheiro?",
  "Tarot: devo gastar dinheiro?",
  "Leitura de tarot do futuro financeiro",
  "Recibire dinero?",
  "Debo gastar dinero?",
  "Futuro financiero tarot",
  "Vou receber dinheiro?",
  "Devo gastar dinheiro?",
  "Futuro financeiro tarot",
]) {
  const file = regionalCopy.startsWith("Tarot:") || regionalCopy.startsWith("Lectura") || regionalCopy.startsWith("Leitura") ? files.seoPages : files.tarotQuestions
  assertIncludes(file, regionalCopy, `money-focused regional copy ${regionalCopy}`)
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

const dailyCardReturnSlugs = [
  "tarot-card-of-the-day",
  "daily-tarot-card",
  "love-tarot-card-of-the-day",
]

for (const slug of dailyCardReturnSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `daily card return SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `daily card return regional locale control ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `daily card return site link ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `tarot questions daily card return entry ${slug}`)
  assertIncludes(files.mobileCheck, `/${slug}`, `mobile check daily card return page ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `daily card return related question cluster for ${slug}`,
  )
}

for (const [localizedSlug, label] of [
  ["carta-tarot-del-dia", "Spanish tarot card of the day localized slug"],
  ["carta-diaria-tarot", "Spanish daily tarot card localized slug"],
  ["carta-tarot-amor-del-dia", "Spanish love tarot card of the day localized slug"],
  ["carta-tarot-do-dia", "Portuguese tarot card of the day localized slug"],
  ["carta-diaria-tarot", "Portuguese daily tarot card localized slug"],
  ["carta-tarot-amor-do-dia", "Portuguese love tarot card of the day localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Carta de tarot del día",
  "Carta diaria de tarot",
  "Carta de tarot del amor del día",
  "Carta de tarot do dia",
  "Carta diária de tarot",
  "Carta de tarot do amor do dia",
]) {
  assertIncludes(files.seoPages, regionalCopy, `daily card regional SEO copy ${regionalCopy}`)
}

for (const regionalCopy of [
  "Carta de tarot del dia",
  "Carta de tarot do dia",
]) {
  assertIncludes(files.tarotQuestions, regionalCopy, `daily card regional question copy ${regionalCopy}`)
}

const weeklyReturnSlugs = [
  "weekly-tarot-reading",
  "weekly-love-tarot",
  "weekly-career-tarot",
]

for (const slug of weeklyReturnSlugs) {
  assertIncludes(files.seoPages, `slug: "${slug}"`, `weekly return SEO page ${slug}`)
  assertIncludes(files.seoPages, 'locales: ["en", "es", "pt-br"]', `weekly return regional locale control ${slug}`)
  assertIncludes(files.site, `href: "/${slug}"`, `weekly return site link ${slug}`)
  assertIncludes(files.tarotQuestions, `slug: "${slug}"`, `tarot questions weekly return entry ${slug}`)
  assertIncludes(files.mobileCheck, `/${slug}`, `mobile check weekly return page ${slug}`)
  assertMatches(
    files.seoLanding,
    new RegExp(`"${slug}"\\s*:\\s*\\[`),
    `weekly return related question cluster for ${slug}`,
  )
}

for (const [localizedSlug, label] of [
  ["lectura-tarot-semanal", "Spanish weekly tarot localized slug"],
  ["tarot-semanal-amor", "Spanish weekly love localized slug"],
  ["tarot-semanal-carrera", "Spanish weekly career localized slug"],
  ["leitura-tarot-semanal", "Portuguese weekly tarot localized slug"],
  ["tarot-semanal-amor", "Portuguese weekly love localized slug"],
  ["tarot-semanal-carreira", "Portuguese weekly career localized slug"],
]) {
  assertIncludes(files.seoPages, `"${localizedSlug}"`, label)
}

for (const regionalCopy of [
  "Lectura de tarot semanal",
  "Tarot semanal del amor",
  "Tarot semanal de carrera",
  "Leitura de tarot semanal",
  "Tarot semanal do amor",
  "Tarot semanal de carreira",
]) {
  assertIncludes(files.seoPages, regionalCopy, `weekly return regional copy ${regionalCopy}`)
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
assertIncludes(files.dailyTarotPage, "data-daily-question-paths", "Daily Tarot English daily question path section")
assertIncludes(files.dailyTarotPage, "data-daily-question-path", "Daily Tarot English daily question path cards")
assertIncludes(files.dailyTarotPage, "data-daily-question-path-guide", "Daily Tarot crawlable English guide links")
assertIncludes(files.dailyTarotPage, "data-daily-question-path-focus", "Daily Tarot focused daily card links")
assertIncludes(files.dailyTarotPage, "data-daily-question-path-start", "Daily Tarot direct free reading links")
assertIncludes(files.dailyTarotPage, "#daily-question-paths", "Daily Tarot English question path structured data")
assertIncludes(files.dailyTarotPage, "dailyChallengeDays", "Daily Tarot seven-day return challenge data")
assertIncludes(files.dailyTarotPage, "dailyChallengeHref", "Daily Tarot seven-day challenge link helper")
assertIncludes(files.dailyTarotPage, "data-daily-seven-day-plan", "Daily Tarot seven-day return plan section")
assertIncludes(files.dailyTarotPage, "data-daily-seven-day-link", "Daily Tarot seven-day return plan links")
assertIncludes(files.dailyTarotPage, "#seven-day-return-plan", "Daily Tarot seven-day return plan structured data")
assertIncludes(files.dailyTarotPage, "seven_day_challenge", "Daily Tarot seven-day challenge attribution")
assertIncludes(files.dailyTarotPage, "day-${index + 1}", "Daily Tarot seven-day challenge day attribution")
assertIncludes(files.dailyTarotPage, "Give the first week a reason to come back", "Daily Tarot seven-day challenge copy")
assertIncludes(files.dailyTarotPage, "dailyPromptGuideHref", "Daily Tarot guide link helper")
assertIncludes(files.dailyTarotPage, "dailyFocusedToolHref", "Daily Tarot focused tool link helper")
assertIncludes(files.dailyTarotPage, "daily_question_path", "Daily Tarot question path attribution")
assertIncludes(files.dailyTarotPage, "Open focused daily card", "Daily Tarot focused daily CTA copy")
assertIncludes(files.dailyTarotPage, "Start deeper free spread", "Daily Tarot deeper free spread CTA copy")
assertIncludes(files.dailyTarotPage, "Read guide", "Daily Tarot crawlable guide CTA copy")
assertIncludes(files.dailyTarotPage, "`${appUrl}${dailyPromptGuideHref(prompt)}`", "Daily Tarot structured data points to crawlable guide")
assertIncludes(files.seoLanding, "utm_medium: \"daily_landing\"", "Daily Tarot SEO landing attribution")
assertIncludes(files.seoLanding, "page.slug === \"daily-tarot\"", "Daily Tarot SEO pages open the daily tool")
assertIncludes(files.dailyTarotTool, "data-daily-quick-actions", "Daily Tarot first-screen quick action rail")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot", "Daily Tarot first-screen habit snapshot")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot-pattern", "Daily Tarot habit snapshot pattern CTA")
assertIncludes(files.dailyTarotTool, "data-daily-habit-snapshot-return-cue", "Daily Tarot habit snapshot return cue CTA")
assertIncludes(files.dailyTarotTool, "Check streak, notes, and the main 7-day theme", "Daily Tarot habit snapshot free return positioning")
assertIncludes(files.dailyTarotTool, "data-daily-pattern-detail-stats", "Daily Tarot 7-day pattern detailed stats")
assertIncludes(files.dailyTarotTool, "data-daily-pattern-timeline", "Daily Tarot 7-day pattern timeline")
assertIncludes(files.dailyTarotTool, "data-daily-pattern-day", "Daily Tarot 7-day pattern day cells")
assertIncludes(files.dailyTarotTool, "completionRate", "Daily Tarot 7-day completion rate")
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
assertIncludes(files.dailyTarotTool, "daily_focus", "Daily Tarot focused intent URL parameter")
assertIncludes(files.dailyTarotTool, "normalizeDailyFocus", "Daily Tarot focused intent parser")
assertIncludes(files.dailyTarotTool, "activeDailyQuestion", "Daily Tarot focused question override")
assertIncludes(files.dailyTarotTool, "data-daily-focused-entry", "Daily Tarot focused entry visible panel")
assertIncludes(files.dailyTarotTool, "data-daily-focused-entry-draw", "Daily Tarot focused entry draw CTA")
assertIncludes(files.dailyTarotTool, "return_action", "Daily Tarot return action URL parameter")
assertIncludes(files.dailyTarotTool, "[data-daily-return-setup]", "Daily Tarot return action reminder scroll target")
assertIncludes(files.dailyTarotTool, "daily_return_email_opened", "Daily Tarot self-email return tracking")
assertIncludes(files.dailyTarotTool, "daily_return_link_copied", "Daily Tarot copied return link tracking")
assertIncludes(files.dailyTarotTool, "data-daily-reminder-email-fallback", "Daily Tarot shows email pending fallback state")
assertIncludes(files.dailyTarotTool, "data-daily-reminder-calendar-fallback", "Daily Tarot calendar fallback CTA")
assertIncludes(files.dailyTarotTool, "data-daily-reminder-mailto-fallback", "Daily Tarot self-email reminder fallback CTA")
assertIncludes(files.dailyTarotTool, "disabled={!emailDeliveryEnabled}", "Daily Tarot disables scheduled email controls until provider is ready")
assertIncludes(files.dailyTarotTool, "copy.emailSetupPendingAction", "Daily Tarot explains scheduled email setup state")
assertIncludes(files.dailyTarotCopy, "emailSetupDisabled", "Daily Tarot email-disabled copy")
assertIncludes(files.dailyTarotCopy, "emailSetupPendingAction", "Daily Tarot email setup pending copy")
assertIncludes(files.dailyTarotTool, "data-daily-direct-return-actions", "Daily Tarot first-screen direct/mail return actions")
assertIncludes(files.dailyTarotTool, "data-daily-direct-return-copy", "Daily Tarot first-screen copy return link action")
assertIncludes(files.dailyTarotTool, "data-daily-direct-return-mailto", "Daily Tarot first-screen mailto return action")
assertIncludes(files.dailyTarotTool, "data-daily-direct-return-calendar", "Daily Tarot first-screen calendar return action")
assertIncludes(files.dailyTarotTool, "data-daily-direct-return-google-calendar", "Daily Tarot first-screen Google Calendar return action")
assertIncludes(files.dailyTarotTool, "Direct / Mail return", "Daily Tarot direct/mail return copy")
assertIncludes(files.dailyTarotTool, "data-daily-linked-return-focus", "Daily Tarot linked return focus visible panel")
assertIncludes(files.dailyTarotTool, "data-daily-linked-return-focus-edit", "Daily Tarot linked return focus edit CTA")
assertIncludes(files.dailyTarotTool, "localStorage.setItem(localReturnCommitmentKey(today), JSON.stringify(linkedCommitment))", "Daily Tarot linked return focus persistence")
assertIncludes(files.dailyTarotTool, "Carried-in question", "Daily Tarot linked return focus English copy")
assertIncludes(files.mobileCheck, "daily tarot focused love entry", "mobile check focused Daily Tarot page")
assertIncludes(files.mobileCheck, "daily_focus=love", "mobile check focused Daily Tarot query")
assertIncludes(files.mobileCheck, "daily tarot linked return focus", "mobile check linked return focus page")
assertIncludes(files.mobileCheck, "return_focus=Will%20my%20ex%20come%20back%20tarot", "mobile check linked return focus query")
assertIncludes(files.mobileCheck, "return_action=reminder", "mobile check linked return reminder action")
assertIncludes(files.mobileCheck, "requiredLocalStorageKeyPrefix: \"poptarot_daily_return_\"", "mobile check linked return focus persistence")
assertIncludes(files.mobileCheck, "input advanced spread free-first fallback", "mobile check advanced spread free-first fallback page")
assertIncludes(files.mobileCheck, "spread=breakup_recovery", "mobile check advanced spread query")
assertIncludes(files.mobileCheck, "[data-input-free-starter-spread]", "mobile check advanced spread free starter selector")
assertIncludes(files.mobileCheck, "[data-input-member-spread-name]", "mobile check advanced spread member selector")
assertIncludes(files.mobileCheck, "highIntentQuestionRequiredSelectors", "mobile check shared high-intent selector guard")
assertIncludes(files.mobileCheck, "[data-question-return-loop]", "mobile check long-tail return loop")
assertIncludes(files.mobileCheck, "[data-question-return-loop-card]", "mobile check long-tail return loop cards")
assertIncludes(files.mobileCheck, "[data-question-decision-checklist]", "mobile check long-tail decision checklist")
assertIncludes(files.packageJson, "\"check:desktop-scroll\": \"node scripts/check-desktop-scroll.mjs\"", "desktop scroll package script")
assertIncludes(files.desktopScrollCheck, "page.mouse.wheel", "desktop scroll mouse wheel assertion")
assertIncludes(files.desktopScrollCheck, "htmlOverscrollY", "desktop scroll overscroll guard")
assertIncludes(files.seoLanding, "return_action: \"reminder\"", "long-tail Daily Tarot return action parameter")

assertIncludes(files.freeToolsPage, "freeToolsHubAlternates", "English free tools metadata alternates")
assertIncludes(files.freeToolsPage, "highIntentQuestionLinks.map", "free tools high-intent daily links")
assertIncludes(files.freeToolsPage, "quickStartIntents", "free tools quick-start intent data")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start", "free tools quick-start visible section")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start-card", "free tools quick-start cards")
assertIncludes(files.freeToolsPage, "data-free-tools-quick-start-start", "free tools quick-start direct CTA")
assertIncludes(files.freeToolsPage, "utm_medium: \"quick_start\"", "free tools quick-start attribution")
assertIncludes(files.freeToolsPage, "#quick-start-free-readings", "free tools quick-start structured data")
assertIncludes(files.freeToolsPage, "freeSpreadFormatLinks", "free tools uses shared spread format links")
assertIncludes(files.freeToolsPage, "spreadFormatTools", "free tools spread format data")
assertIncludes(files.freeToolsPage, "data-free-tools-spread-formats", "free tools spread format visible section")
assertIncludes(files.freeToolsPage, "data-free-tools-spread-format-card", "free tools spread format cards")
assertIncludes(files.freeToolsPage, "data-free-tools-spread-format-start", "free tools spread format direct CTA")
assertIncludes(files.freeToolsPage, "data-free-tools-spread-format-guide", "free tools spread format guide CTA")
assertIncludes(files.freeToolsPage, "utm_medium: \"spread_format\"", "free tools spread format attribution")
assertIncludes(files.freeToolsPage, "#free-spread-formats", "free tools spread format structured data")
assertIncludes(files.freeToolsPage, "data-free-tools-question-start", "free tools direct high-intent start CTA")
assertIncludes(files.freeToolsPage, "data-free-tools-question-guide", "free tools high-intent guide CTA")
assertIncludes(files.freeToolsPage, "utm_medium: \"question_grid\"", "free tools high-intent question attribution")
assertIncludes(files.freeToolsPage, "getSeoPage(slug, \"en\")", "free tools high-intent SEO page lookup")
assertIncludes(files.freeToolsPage, "Start matching free tarot spread", "free tools high-intent structured action")
assertIncludes(files.freeToolsPage, "freeUpgradeBoundary", "free tools free-vs-upgrade boundary data")
assertIncludes(files.freeToolsPage, "data-free-tools-membership-boundary", "free tools visible membership boundary section")
assertIncludes(files.freeToolsPage, "data-free-tools-membership-boundary-row", "free tools visible membership boundary rows")
assertIncludes(files.freeToolsPage, "#free-vs-upgrade-boundary", "free tools membership boundary structured data")
assertIncludes(files.freeToolsPage, "Free first", "free tools boundary free-first label")
assertIncludes(files.freeToolsPage, "Upgrade later", "free tools boundary upgrade-later label")
assertIncludes(files.freeToolsPage, "data-free-tools-social-proof", "free tools visible reader proof section")
assertIncludes(files.freeToolsPage, "data-free-tools-example-readings", "free tools visible example readings section")
assertIncludes(files.freeToolsPage, "#reader-feedback", "free tools reader feedback structured data")
assertIncludes(files.freeToolsPage, "#example-readings", "free tools example readings structured data")
assertIncludes(files.freeToolsPage, "representativeTestimonials.slice(0, 3)", "free tools representative testimonial reuse")
assertIncludes(files.freeToolsPage, "getTrustPage(\"tarot-reading-examples\")", "free tools sample reading example reuse")
assertIncludes(files.sitemap, "freeToolsHubAlternates", "free tools sitemap alternates")
assertIncludes(files.sitemap, 'path: "/es/herramientas-tarot-gratis"', "Spanish free tools sitemap route")
assertIncludes(files.sitemap, 'path: "/pt-br/ferramentas-tarot-gratis"', "Portuguese free tools sitemap route")
assertIncludes(files.mobileCheck, 'path: "/es/herramientas-tarot-gratis"', "Spanish free tools mobile check")
assertIncludes(files.mobileCheck, 'path: "/pt-br/ferramentas-tarot-gratis"', "Portuguese free tools mobile check")
assertIncludes(files.searchAssetCheck, '"/es/herramientas-tarot-gratis"', "Spanish free tools search asset route")
assertIncludes(files.searchAssetCheck, '"/pt-br/ferramentas-tarot-gratis"', "Portuguese free tools search asset route")
assertIncludes(files.spanishFreeToolsRoute, 'getLocalizedFreeToolsMetadata("es")', "Spanish free tools route metadata")
assertIncludes(files.portugueseFreeToolsRoute, 'getLocalizedFreeToolsMetadata("pt-br")', "Portuguese free tools route metadata")
assertIncludes(files.spanishFreeToolsRoute, 'locale="es"', "Spanish free tools route locale")
assertIncludes(files.portugueseFreeToolsRoute, 'locale="pt-br"', "Portuguese free tools route locale")
for (const [needle, label] of [
  ["Herramientas de Tarot Gratis con IA", "Spanish free tools title"],
  ["Ferramentas de Tarot Gratis com IA", "Portuguese free tools title"],
  ["localizedFreeToolsPaths", "localized free tools paths"],
  ["freeToolsHubAlternates", "localized free tools hreflang alternates"],
  ["data-free-tools-quick-start-start", "localized free tools quick-start CTA"],
  ["data-free-tools-spread-formats", "localized free tools spread section"],
  ["data-free-tools-spread-format-start", "localized free tools spread CTA"],
  ["data-free-tools-spread-format-guide", "localized free tools spread guide"],
  ["data-free-tools-social-proof", "localized free tools trust section"],
  ["getSeoPage(item.slug, copy.locale)", "localized free tools uses localized SEO pages"],
  ["localizedHubPath", "localized free tools hub links"],
  ["isAccessibleForFree: true", "localized free tools free schema"],
]) {
  assertIncludes(files.localizedFreeToolsPage, needle, label)
}
assertIncludes(files.freeToolsPage, "Tarot Card Combinations", "free tools card combinations path")
assertIncludes(files.homePage, "Tarot Card Combinations", "homepage card combinations path")
assertIncludes(files.homeExperience, "/tarot-card-combinations", "homepage scroll card combinations path")
assertIncludes(files.menuPanel, "/tarot-card-combinations", "menu card combinations path")
assertIncludes(files.site, "Tarot Card Combinations", "site graph card combinations core tool")
assertIncludes(files.site, "Tarot card combinations", "application feature list card combinations")
assertIncludes(files.sitemap, 'path: "/tarot-card-combinations"', "card combinations sitemap route")
assertIncludes(files.sitemap, 'path: "/es/combinaciones-cartas-tarot"', "Spanish card combinations sitemap route")
assertIncludes(files.sitemap, 'path: "/pt-br/combinacoes-cartas-tarot"', "Portuguese card combinations sitemap route")
assertIncludes(files.sitemap, "combinationHubAlternates", "card combinations sitemap alternates")
assertIncludes(files.mobileCheck, 'path: "/es/combinaciones-cartas-tarot"', "Spanish card combinations mobile route")
assertIncludes(files.mobileCheck, 'path: "/pt-br/combinacoes-cartas-tarot"', "Portuguese card combinations mobile route")
assertIncludes(files.searchAssetCheck, '"/es/combinaciones-cartas-tarot"', "Spanish card combinations search asset sitemap check")
assertIncludes(files.searchAssetCheck, '"/pt-br/combinacoes-cartas-tarot"', "Portuguese card combinations search asset sitemap check")
assertIncludes(files.tarotCardCombinationsRoute, 'getTarotCardCombinationHubMetadata("en")', "English card combinations route metadata")
assertIncludes(files.spanishTarotCardCombinationsRoute, 'getTarotCardCombinationHubMetadata("es")', "Spanish card combinations route metadata")
assertIncludes(files.portugueseTarotCardCombinationsRoute, 'getTarotCardCombinationHubMetadata("pt-br")', "Portuguese card combinations route metadata")
assertIncludes(files.spanishTarotCardCombinationsRoute, 'locale="es"', "Spanish card combinations route locale")
assertIncludes(files.portugueseTarotCardCombinationsRoute, 'locale="pt-br"', "Portuguese card combinations route locale")

for (const [needle, label] of [
  ["data-card-combinations-hub", "card combinations visible page hook"],
  ["Tarot Card Combinations", "card combinations page title"],
  ["Combinaciones de Cartas de Tarot", "Spanish card combinations page title"],
  ["Combinacoes de Cartas de Tarot", "Portuguese card combinations page title"],
  ["Common Tarot Card Combination Paths", "card combinations path section"],
  ["Rutas comunes de combinaciones de tarot", "Spanish card combinations path section"],
  ["Caminhos comuns de combinacoes de tarot", "Portuguese card combinations path section"],
  ["getTarotCardSeoPage(source, locale)", "card combinations reuse localized card SEO data"],
  ["`${sourcePage.path}#combinations`", "card combinations source page anchor links"],
  ["getSeoPage(slug, locale)", "card combinations localized context hub links"],
  ["tarotCardCombinationHubPaths", "card combinations localized hub paths"],
  ["hubAlternates", "card combinations metadata alternates"],
  ["data-card-combination-hub-link", "card combinations hub internal links"],
  ["data-card-combination-start-free", "card combinations free reading CTA"],
  ["data-card-combination-daily-return", "card combinations Daily Tarot return CTA"],
  ["data-card-combination-method", "card combinations method section hook"],
  ["data-card-combination-faq", "card combinations FAQ section hook"],
  ["\"@type\": \"CollectionPage\"", "card combinations CollectionPage schema"],
  ["\"@type\": \"HowTo\"", "card combinations HowTo schema"],
  ["\"@type\": \"FAQPage\"", "card combinations FAQ schema"],
  ["isAccessibleForFree: true", "card combinations free access schema"],
]) {
  assertIncludes(files.tarotCardCombinationsPage, needle, label)
}
assertIncludes(files.tarotSpreadsPage, "data-spread-access-boundary", "tarot spreads visible free/member boundary")
assertIncludes(files.tarotSpreadsPage, "#free-starter-spread-boundary", "tarot spreads boundary structured data")
assertIncludes(files.tarotSpreadsPage, "isAdvancedSpreadType(type)", "tarot spreads advanced spread detection")
assertIncludes(files.tarotSpreadsPage, "data-spread-access={isAdvanced ? \"member-depth\" : \"free\"}", "tarot spreads per-card access label")
assertIncludes(files.tarotSpreadsPage, "data-spread-free-start-mode={isAdvanced ? \"starter\" : \"direct\"}", "tarot spreads free starter CTA mode")
assertIncludes(files.tarotSpreadsPage, "Start free starter", "tarot spreads advanced free starter CTA")
assertIncludes(files.tarotSpreadsPage, "isAccessibleForFree: !isAdvanced", "tarot spreads structured free access marker")
assertIncludes(files.membershipPage, "data-membership-free-first", "membership page free-first section")
assertIncludes(files.membershipPage, "data-membership-free-path-grid", "membership page free path grid")
assertIncludes(files.membershipPage, "data-membership-free-path", "membership page free path item")
assertIncludes(files.membershipPage, "data-membership-depth-boundary", "membership page depth upgrade boundary")
assertIncludes(files.membershipPage, "data-membership-plan-section", "membership page plan section after free boundary")
assertIncludes(files.membershipPage, "data-membership-payment-section", "membership page payment section after plans")
assertIncludes(files.membershipPage, "data-membership-benefit-comparison", "membership page benefit comparison")
assertIncludes(files.membershipPage, "Membership is not the starting gate", "membership free-first positioning copy")
assertIncludes(files.membershipPage, "Still free now", "membership current free access copy")
assertIncludes(files.membershipPage, "First AI reading", "membership first reading remains free")
assertIncludes(files.membershipPage, "Daily card and streak", "membership Daily Tarot remains free")
assertIncludes(files.membershipPage, "78 card meanings", "membership card meanings remain free")
assertMatches(
  files.membershipPage,
  /data-membership-free-first[\s\S]*data-membership-free-path-grid[\s\S]*data-membership-depth-boundary[\s\S]*data-membership-plan-section[\s\S]*data-membership-payment-section/,
  "membership orders free paths before depth boundary before payment",
)
assertIncludes(files.homeExperience, "data-home-example-start", "homepage one-tap example start CTA")
assertIncludes(files.homeExperience, "data-home-hero-quick-start", "homepage quick-start visible section")
assertIncludes(files.homeExperience, "data-home-hero-quick-start-link", "homepage quick-start link hook")
assertIncludes(files.homeExperience, "\"home_example\"", "homepage example source attribution")
assertIncludes(files.homeExperience, "utm_medium", "homepage hero attribution")
assertIncludes(files.homeExperience, "hero_quick_start", "homepage quick-start campaign medium")
assertIncludes(files.menuButton, "data-home-menu-button", "homepage menu button selector")
assertIncludes(files.menuPanel, "data-menu-free-first-primary", "menu primary free reading CTA")
assertIncludes(files.menuPanel, "data-menu-free-first-daily", "menu daily tarot free return CTA")
assertIncludes(files.menuPanel, "data-menu-free-path-grid", "menu free path grid")
assertIncludes(files.menuPanel, "data-menu-trust-paths", "menu trust path section")
assertIncludes(files.menuPanel, "data-menu-depth-boundary", "menu upgrade-later depth boundary")
assertIncludes(files.menuPanel, "data-menu-membership-boundary", "menu membership demoted to depth section")
assertIncludes(files.menuPanel, "Upgrade later for deeper follow-ups, saved history, advanced spreads, and monthly reports.", "menu free-first upgrade boundary copy")
assertMatches(
  files.menuPanel,
  /data-menu-free-path-grid[\s\S]*data-menu-trust-paths[\s\S]*data-menu-depth-boundary/,
  "menu orders free paths before trust paths before depth features",
)
assertMatches(
  files.menuPanel,
  /data-menu-free-first-primary[\s\S]*data-menu-free-first-daily[\s\S]*href="\/auth\/login"/,
  "menu shows free reading and Daily Tarot before login prompt",
)
for (const spread of ["breakup_recovery", "their_thoughts", "job_opportunity", "yes_no"]) {
  assertIncludes(files.homeExperience, spread, `homepage quick-start spread ${spread}`)
}
assertIncludes(files.homePage, "#homepage-quick-start-free-readings", "homepage quick-start structured data")
assertIncludes(files.homePage, "homeQuickStartActionTarget", "homepage quick-start structured action target")
assertIncludes(files.homePage, "InteractAction", "homepage quick-start structured interact action")
assertIncludes(files.globalStyles, "overscroll-behavior-y: auto", "vertical desktop wheel scrolling remains enabled")
assertNotIncludes(files.globalStyles, "overscroll-behavior: none", "global vertical scroll lock")
assertNotIncludes(files.globalStyles, "body:has(.allow-scroll)::-webkit-scrollbar", "desktop scrollbar is not hidden on scroll-enabled pages")
assertIncludes(files.globalStyles, "--home-hero-browser-offset: min(var(--home-mobile-browser-offset, 0px), 7rem)", "homepage browser chrome offset variable")
assertIncludes(files.globalStyles, "--home-hero-focal-y: calc(var(--home-hero-browser-offset) + clamp(24.75rem, 58svh, 28.5rem))", "homepage mobile focal centering with browser chrome offset")
assertIncludes(files.globalStyles, "--home-hero-card-height: calc(var(--home-hero-card-width) * 1.7142857)", "homepage card size variable")
assertIncludes(files.globalStyles, "--home-hero-card-half-y: calc(var(--home-hero-card-height) / 2)", "homepage card half-height variable")
assertIncludes(files.globalStyles, "--home-hero-shell-min-height", "homepage hero shell dynamic height reserve")
assertIncludes(files.globalStyles, "--home-hero-browser-bottom-offset: min(var(--home-mobile-browser-bottom-offset, 0px), 10rem)", "homepage browser bottom chrome offset variable")
assertIncludes(files.globalStyles, "--home-hero-actions-fallback-height: 38rem", "homepage mobile action fallback prevents overlap before measurement")
assertIncludes(files.globalStyles, "--home-hero-after-actions-gap", "homepage measured action bottom spacing")
assertIncludes(files.globalStyles, "--home-hero-actions-bottom", "homepage measured action bottom variable")
assertIncludes(files.globalStyles, "calc(var(--home-hero-actions-bottom) + var(--home-hero-after-actions-gap))", "homepage shell follows measured hero action bottom")
assertIncludes(files.globalStyles, "max(\n        118svh,", "homepage mobile shell keeps following content below hero actions")
assertIncludes(files.globalStyles, "calc(var(--home-hero-content-y) + var(--home-hero-actions-fallback-height))", "homepage hero action fallback reserve")
assertIncludes(files.homeExperience, "data-home-hero-actions", "homepage hero actions measurement hook")
assertIncludes(files.homeExperience, "data-home-pwa-install", "homepage PWA install return action")
assertIncludes(files.homeExperience, "beforeinstallprompt", "homepage PWA install prompt listener")
assertIncludes(files.homeExperience, "installFallback", "homepage PWA install fallback copy")
assertIncludes(files.homeExperience, "heroActionsRef", "homepage hero actions ref for mobile overlap measurement")
assertIncludes(files.homeExperience, "ResizeObserver", "homepage hero action resize observer")
assertIncludes(files.homeExperience, "stage.style.setProperty(\"--home-hero-actions-bottom\"", "homepage measured action bottom setter")
assertIncludes(files.homeExperience, "--home-mobile-browser-offset", "homepage visual viewport browser chrome offset")
assertIncludes(files.homeExperience, "--home-mobile-browser-bottom-offset", "homepage visual viewport browser bottom chrome offset")
assertIncludes(files.homeExperience, "layoutHeight - topOffset - viewportHeight", "homepage browser bottom offset calculation")
assertIncludes(files.homeExperience, "data-home-hero-shell", "homepage hero shell measurement hook")
assertIncludes(files.homeExperience, "home-hero-shell", "homepage hero shell class")
assertIncludes(files.globalStyles, "overflow-x: clip", "homepage stage clips horizontal overflow without nested vertical scroll")
assertIncludes(files.globalStyles, "overflow-y: visible", "homepage stage leaves document vertical scrolling native")
assertIncludes(
  files.globalStyles,
  ".home-hero-shell {\n    min-height: var(--home-hero-shell-min-height);\n    overflow-x: clip;\n    overflow-y: visible;\n  }",
  "homepage hero shell clips horizontal visuals without clipping vertical page content",
)
assertIncludes(files.homeExperience, "overflow-x-auto", "homepage mobile quick-start avoids wrapping into hero controls")
assertIncludes(files.homeExperience, "bg-[#0b0314]", "homepage solid mobile panels prevent text bleed-through")
assertIncludes(files.homeExperience, "data-home-daily-return-panel", "homepage daily return panel measurement hook")
assertIncludes(files.homeExperience, "data-home-secondary-nav", "homepage secondary nav measurement hook")
assertIncludes(files.homeExperience, "data-home-scroll-cue", "homepage desktop scroll affordance hook")
assertIncludes(files.homeExperience, "data-home-scroll-content", "homepage scroll content measurement hook")
assertIncludes(files.homeExperience, "data-home-focal-glow", "homepage focal glow hook")
assertIncludes(files.homeExperience, "data-home-card-anchor", "homepage card anchor hook")
assertIncludes(files.homeExperience, "style={{ transform: \"translate3d(-50%, -50%, 0)\" }}", "homepage card and glow center transform")
assertIncludes(files.tarotQuestions, "TarotQuestionSearchResults", "tarot questions public search results import")
assertIncludes(files.tarotQuestions, "searchEntries(copy)", "tarot questions public search result entries")
assertIncludes(files.tarotQuestions, "quickStartGroups", "tarot questions grouped quick-start high-intent lists")
assertIncludes(files.tarotQuestions, "quickStartGroupedEntries(copy)", "tarot questions grouped quick-start visible entries")
assertIncludes(files.tarotQuestions, "quickStartEntries(copy)", "tarot questions quick-start visible entries")
assertIncludes(files.tarotQuestions, "data-question-quick-start", "tarot questions quick-start section")
assertIncludes(files.tarotQuestions, "data-question-quick-start-groups", "tarot questions quick-start grouped section")
assertIncludes(files.tarotQuestions, "data-question-quick-start-group", "tarot questions quick-start group cards")
assertIncludes(files.tarotQuestions, "data-question-quick-start-card", "tarot questions quick-start card links")
assertIncludes(files.tarotQuestions, "data-question-quick-start-slug", "tarot questions quick-start slug hooks")
assertIncludes(files.tarotQuestions, "data-question-quick-start-spread", "tarot questions quick-start spread hooks")
assertIncludes(files.tarotQuestions, "data-question-quick-start-group-card", "tarot questions quick-start group card attribution")
for (const dailySlug of [
  "tarot-card-of-the-day",
  "daily-tarot-card",
  "love-tarot-card-of-the-day",
  "daily-love-tarot",
  "daily-career-tarot",
  "daily-yes-or-no-tarot",
  "daily-mood-tarot",
  "daily-action-tarot",
]) {
  assertIncludes(files.tarotQuestions, `slug: "${dailySlug}"`, `tarot questions Daily Tarot entry ${dailySlug}`)
}
assertIncludes(files.tarotQuestions, 'group: "daily"', "tarot questions Daily Tarot group")
assertIncludes(files.tarotQuestions, "aria-label={`${copy.startFree}: ${entry.query}`}", "tarot questions start CTA accessible query label")
assertIncludes(files.tarotQuestions, "#quick-start-question-paths", "tarot questions quick-start structured data")
assertIncludes(files.tarotQuestions, "question_hub_quick_start", "tarot questions quick-start attribution")
assertIncludes(files.tarotQuestions, "utm_medium", "tarot questions free-reading UTM attribution")
assertIncludes(files.tarotQuestions, "utm_campaign", "tarot questions campaign attribution")
assertIncludes(files.tarotQuestions, "data-question-entry-card", "tarot questions entry card hook")
assertIncludes(files.tarotQuestions, "data-question-entry-slug", "tarot questions entry slug hook")
assertIncludes(files.tarotQuestions, "data-question-entry-spread", "tarot questions entry spread hook")
assertIncludes(files.tarotQuestions, "data-question-entry-group", "tarot questions entry group hook")
assertIncludes(files.tarotQuestions, "data-question-entry-start", "tarot questions entry free-start CTA hook")
assertIncludes(files.tarotQuestions, "data-question-entry-guide", "tarot questions entry guide CTA hook")
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

const sitemapHreflangCoverage = [
  [files.sitemap, "getSeoAlternates", "SEO page sitemap hreflang alternates"],
  [files.sitemap, "absoluteAlternates", "absolute sitemap alternate URLs"],
  [files.sitemap, "spreadHubAlternates", "spread hub sitemap alternates"],
  [files.sitemap, "questionHubAlternates", "question hub sitemap alternates"],
  [files.sitemap, "cardAlternates", "card page sitemap alternates"],
  [files.sitemap, "brandIdentityImages", "brand image sitemap registry"],
  [files.sitemap, '"/search-favicon.png"', "search favicon sitemap image"],
  [files.sitemap, '"/logo.png"', "logo sitemap image"],
  [files.sitemap, '"/og-image.jpg"', "Open Graph sitemap image"],
  [files.sitemap, "images: route.images.map(absoluteUrl)", "sitemap image output"],
  [files.sitemap, "\"x-default\"", "sitemap x-default alternates"],
  [files.sitemap, "alternates: {", "sitemap alternate output"],
  [files.sitemap, "languages: absoluteAlternates(route.alternates)", "sitemap hreflang language map"],
]

for (const [file, needle, label] of sitemapHreflangCoverage) {
  assertIncludes(file, needle, label)
}

for (const conversionSignal of [
  "const highIntentQuestionSlugs = new Set",
  "createFallbackQuestionToolkit(page, recommendedSpread)",
  "data-question-hero-start",
  "data-question-hero-tool",
  "data-question-matched-spread",
  "data-question-hero-spread-summary",
  "data-seo-question-tool-entry",
  "data-long-tail-free-spread-entry",
  "data-seo-question-tool-primary",
  "data-seo-question-related-direct-start",
  "spreadPositionDescriptionForLocale",
  "data-question-spread-position-answer",
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
  "questionDecisionGuideCopy",
  "#decision-checklist",
  "data-question-decision-checklist",
  "data-question-decision-checklist-item",
  "Use the reading to check signals, not to force certainty",
  "Use the spread to separate stress from a real work signal",
  "questionReturnLoopCopy",
  "#question-return-loop",
  "data-question-return-loop",
  "data-question-return-loop-card",
  "question_return_loop",
  "return_focus: page.ctaQuestion",
  "monthly-pattern",
  "#related-question-cluster",
  "data-question-cluster-card",
  "data-question-cluster-start",
  "data-question-cluster-guide",
  "Start related free tarot spread",
  "data-question-sticky-cta",
  "utm_medium: \"question_prompt\"",
  "SeoQuestionShareActions",
  "\"@type\": \"ShareAction\"",
  "question_share_return",
  "questionTrustCopy",
  "#reader-trust-signals",
  "data-seo-reader-trust",
  "data-seo-reader-trust-highlights",
  "data-seo-reader-trust-testimonials",
  "data-seo-reader-trust-testimonial-start",
  "representativeTestimonials.slice(0, 3)",
  "trustHighlights.map",
]) {
  assertIncludes(files.seoLanding, conversionSignal, `high-intent question conversion signal ${conversionSignal}`)
}

for (const shareSignal of [
  "data-seo-question-share",
  "data-seo-question-share-native",
  "data-seo-question-share-copy",
  "data-seo-question-daily-return",
  "data-seo-question-share-start",
  "navigator.share",
  "navigator.clipboard?.writeText",
  "surface: \"seo_question_page\"",
]) {
  assertIncludes(files.seoQuestionShareActions, shareSignal, `SEO question share action ${shareSignal}`)
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
  "el-me-extrana-tarot",
  "oculta-sus-sentimientos-tarot",
  "por-que-se-alejo-tarot",
  "cuando-encontrare-amor-tarot",
  "cuales-son-sus-intenciones-tarot",
  "volveremos-a-estar-juntos-tarot",
  "es-mi-alma-gemela-tarot",
  "lectura-tarot-dinero",
  "que-piensa-de-mi-tarot",
  "me-contactara-tarot",
  "ella-me-extrana-tarot",
  "ella-oculta-sus-sentimientos-tarot",
  "por-que-ella-se-alejo-tarot",
  "esta-relacion-termino-tarot",
  "deberia-seguir-adelante-tarot",
  "lectura-tarot-llama-gemela",
  "me-casare-tarot",
  "conseguire-el-trabajo-tarot",
  "deberia-aceptar-este-trabajo-tarot",
  "debo-aceptar-esta-oferta-de-trabajo-tarot",
  "conseguire-un-ascenso-tarot",
  "que-carrera-es-para-mi-tarot",
  "tendre-exito-tarot",
  "ele-esta-pensando-em-mim-tarot",
  "tarot-amor-sim-ou-nao",
  "devo-mandar-mensagem-tarot",
  "ele-sente-minha-falta-tarot",
  "ele-esconde-os-sentimentos-tarot",
  "por-que-ele-se-afastou-tarot",
  "quando-vou-encontrar-amor-tarot",
  "quais-sao-as-intencoes-dele-tarot",
  "vamos-voltar-tarot",
  "ele-e-minha-alma-gemea-tarot",
  "leitura-tarot-dinheiro",
  "leitura-tarot-carreira",
  "devo-pedir-demissao-tarot",
  "o-que-ele-pensa-de-mim-tarot",
  "ele-vai-entrar-em-contato-tarot",
  "ela-sente-minha-falta-tarot",
  "ela-esconde-os-sentimentos-tarot",
  "por-que-ela-se-afastou-tarot",
  "este-relacionamento-acabou-tarot",
  "devo-seguir-em-frente-tarot",
  "leitura-tarot-chama-gemea",
  "vou-me-casar-tarot",
  "vou-conseguir-o-emprego-tarot",
  "devo-aceitar-este-trabalho-tarot",
  "devo-aceitar-esta-oferta-de-trabalho-tarot",
  "vou-ser-promovido-tarot",
  "qual-carreira-combina-comigo-tarot",
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
  [files.trustSignals, "actionHref:", "testimonial free action hrefs"],
  [files.trustSignals, "source=reviews", "testimonial free action attribution"],
  [files.trustPages, "readingExamples:", "reading examples content"],
  [files.trustPages, "startQuestion:", "reading examples direct start questions"],
  [files.trustPages, "spreadType:", "reading examples free spread type"],
  [files.trustPages, "startHref:", "reading examples direct daily start href"],
  [files.trustPages, "brandAssets:", "brand asset registry"],
  [files.trustPages, "actionLinks:", "trust-to-free-reading action links"],
  [files.site, "officialVerificationLinks", "official verification registry"],
  [files.trustSignals, "Free first", "free-first trust highlight"],
  [files.trustSignals, "Membership second", "membership-second trust highlight"],
  [files.trustSignals, "Responsible AI", "responsible AI trust highlight"],
  [files.trustPageView, "#testimonials", "testimonial structured data"],
  [files.trustPageView, "data-trust-testimonial-card", "testimonial visible action cards"],
  [files.trustPageView, "data-trust-testimonial-start", "testimonial visible free start CTA"],
  [files.trustPageView, "item.actionHref", "testimonial structured direct action"],
  [files.trustPageView, "#sample-readings", "sample reading structured data"],
  [files.trustPageView, "readingExampleStartHref", "sample reading direct-start helper"],
  [files.trustPageView, "data-trust-reading-example-card", "sample reading visible cards"],
  [files.trustPageView, "data-trust-reading-example-start", "sample reading direct free start CTA"],
  [files.trustPageView, "data-trust-reading-example-guide", "sample reading guide CTA"],
  [files.trustPageView, "Try this example free", "sample reading direct-start copy"],
  [files.trustPageView, "\"@type\": \"InteractAction\"", "sample reading structured direct action"],
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
  [files.trustPageView, "#brand-verification-facts", "brand verification facts structured data"],
  [files.trustPageView, "data-official-brand-verification-facts", "official channel brand verification visible section"],
  [files.trustPageView, "data-official-brand-verification-fact", "official channel brand verification fact cards"],
  [files.trustPageView, "Official Social Accounts", "official social account section"],
  [files.trustPageView, "Where POPTarot Confirms Its Identity", "official verification visible section"],
  [files.site, "brandVerificationFacts", "brand verification fact registry"],
  [files.site, "additionalProperty: brandVerificationFacts.map", "Organization brand verification properties"],
  [files.trustPages, "Brand search terms", "official channels brand search term copy"],
  [files.trustPages, "Crawlable sources", "official channels crawlable source copy"],
]

for (const [file, needle, label] of trustDataCoverage) {
  assertIncludes(file, needle, label)
}

const readerFeedbackCoverage = [
  [files.trustPageView, "ReaderFeedbackForm", "reviews page feedback form component"],
  [files.trustPageView, "isReviewsPage && <ReaderFeedbackForm />", "reviews-only feedback form mount"],
  [files.trustPages, "Real submissions", "reviews page real submission copy"],
  [files.readerFeedbackForm, "data-reader-feedback-form", "reader feedback form selector"],
  [files.readerFeedbackForm, "data-reader-feedback-rating", "reader feedback rating selector"],
  [files.readerFeedbackForm, "data-reader-feedback-submit", "reader feedback submit selector"],
  [files.readerFeedbackForm, "data-reader-feedback-success", "reader feedback success loop selector"],
  [files.readerFeedbackForm, "data-reader-feedback-next-action", "reader feedback next action selector"],
  [files.readerFeedbackForm, "Keep the Free Loop Going", "reader feedback free return loop copy"],
  [files.readerFeedbackForm, "/daily-tarot?utm_source=reviews&utm_medium=feedback_success", "reader feedback Daily Tarot return path"],
  [files.readerFeedbackForm, "/free-ai-tarot-reading?utm_source=reviews&utm_medium=feedback_success", "reader feedback free reading return path"],
  [files.readerFeedbackForm, "/tarot-reading-examples?utm_source=reviews&utm_medium=feedback_success", "reader feedback examples return path"],
  [files.readerFeedbackForm, "new URLSearchParams(window.location.search)", "reader feedback URL parameter prefill"],
  [files.readerFeedbackForm, "setSurface(safeSurface", "reader feedback source surface prefill"],
  [files.readerFeedbackForm, "setLocale(safeLocale", "reader feedback locale prefill"],
  [files.readerFeedbackForm, "data-reader-feedback-source", "reader feedback visible source context"],
  [files.readerFeedbackForm, "source_context: sourceContext || null", "reader feedback submitted source context"],
  [files.readerFeedbackForm, "permission_to_feature", "reader feedback quote permission"],
  [files.readerFeedbackForm, "website", "reader feedback honeypot"],
  [files.feedbackRoute, "reader_feedback", "reader feedback API insert"],
  [files.feedbackRoute, "getBearerToken", "reader feedback optional authenticated submit"],
  [files.feedbackRoute, "permission_to_feature", "reader feedback API quote permission"],
  [files.feedbackRoute, "source_context", "reader feedback API source context metadata"],
  [files.feedbackRoute, "user_agent", "reader feedback privacy-limited request metadata"],
  [files.readerFeedbackMigration, "create table if not exists public.reader_feedback", "reader feedback table migration"],
  [files.readerFeedbackMigration, "alter table public.reader_feedback enable row level security", "reader feedback RLS"],
  [files.readerFeedbackMigration, "grant insert on table public.reader_feedback to anon, authenticated", "reader feedback public insert grant"],
  [files.readerFeedbackMigration, "for insert", "reader feedback insert policies"],
  [files.readerFeedbackMigration, "permission_to_feature", "reader feedback public quote permission column"],
]

for (const [file, needle, label] of readerFeedbackCoverage) {
  assertIncludes(file, needle, label)
}

assertNotIncludes(
  files.readerFeedbackMigration,
  "grant select on table public.reader_feedback to anon",
  "anonymous reader feedback select grant",
)

const structuredDataCoverage = [
  [files.site, "logo: {", "Organization logo"],
  [files.site, "brandLogoPath = \"/logo.png\"", "canonical logo path constant"],
  [files.site, "brandFaviconPath = \"/favicon.png\"", "canonical favicon path constant"],
  [files.site, "`${appUrl}${brandLogoPath}`", "Organization logo asset"],
  [files.site, "Official brand name", "Organization official brand fact"],
  [files.site, "Canonical domain", "Organization canonical domain fact"],
  [files.site, "Favicon source", "Organization favicon verification fact"],
  [files.site, "Social preview image", "Organization social preview verification fact"],
  [files.site, "Free product stance", "Organization free product stance fact"],
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
  [files.layout, "PwaServiceWorker", "PWA service worker registration component"],
  [files.layout, "shortcut: [", "stable shortcut favicon metadata"],
  [files.layout, "{ url: \"/favicon-48x48.png\", sizes: \"48x48\", type: \"image/png\" }", "preferred 48px shortcut favicon metadata"],
  [files.layout, "{ url: \"/favicon.ico\", sizes: \"any\" }", "ICO shortcut favicon fallback metadata"],
  [files.layout, "thumbnail: `${appUrl}${brandLogoPath}`", "absolute thumbnail logo metadata"],
  [files.layout, "\"og:logo\": `${appUrl}${brandLogoPath}`", "absolute Open Graph logo metadata"],
  [files.layout, "property=\"og:logo\"", "standard Open Graph logo property metadata"],
  [files.layout, "href={brandSearchFaviconPath} sizes=\"48x48\"", "explicit search favicon head link"],
  [files.layout, "href=\"/favicon.ico\" sizes=\"any\"", "explicit ICO favicon head link"],
  [files.layout, "/favicon.png", "canonical search favicon metadata"],
  [files.layout, "/favicon.ico", "ICO favicon metadata"],
  [files.layout, "/favicon-16x16.png", "16px favicon metadata"],
  [files.layout, "/favicon-32x32.png", "32px favicon metadata"],
  [files.layout, "/favicon-48x48.png", "48px favicon metadata"],
  [files.layout, "/favicon-96x96.png", "96px favicon metadata"],
  [files.layout, "/icon.png", "canonical PNG icon metadata"],
  [files.layout, "/apple-touch-icon.png", "Apple touch icon metadata"],
  [files.layout, "/og-image.jpg", "Open Graph image metadata"],
  [files.homeExperience, "data-home-brand-logo", "visible homepage brand logo"],
  [files.homeExperience, "alt=\"POPTarot logo\"", "homepage logo alt text"],
  [files.manifest, "\"name\": \"POPTarot - Free AI Tarot Reading\"", "manifest product name"],
  [files.manifest, "\"start_url\": \"/?utm_source=pwa&utm_medium=homescreen&utm_campaign=app_launch\"", "manifest homescreen attribution"],
  [files.manifest, "\"shortcuts\"", "manifest shortcuts"],
  [files.manifest, "\"url\": \"/daily-tarot?utm_source=pwa&utm_medium=shortcut&utm_campaign=daily_tarot\"", "Daily Tarot manifest shortcut attribution"],
  [files.manifest, "\"url\": \"/input?source=pwa_shortcut&utm_source=pwa&utm_medium=shortcut&utm_campaign=free_reading\"", "Free Reading manifest shortcut opens tool"],
  [files.manifest, "\"url\": \"/tarot-card-meanings?utm_source=pwa&utm_medium=shortcut&utm_campaign=card_meanings\"", "card meanings manifest shortcut attribution"],
  [files.manifest, "\"src\": \"/search-favicon.png\"", "search favicon manifest icon"],
  [files.manifest, "\"src\": \"/favicon.png\"", "search favicon manifest icon"],
  [files.manifest, "\"src\": \"/icon.png\"", "canonical PNG manifest icon"],
  [files.manifest, "\"src\": \"/icon-512x512.png\"", "512px manifest icon"],
  [files.serviceWorker, "self.addEventListener(\"fetch\"", "PWA fetch handler for installability"],
  [files.serviceWorker, "PRIVATE_PATH_PREFIXES", "PWA private path guard"],
  [files.serviceWorker, "\"/api/\"", "PWA API cache exclusion"],
  [files.serviceWorker, "\"/daily-tarot\"", "PWA Daily Tarot offline return fallback"],
  [files.nextConfig, "Service-Worker-Allowed", "service worker scope header"],
  [files.nextConfig, "source: \"/sw.js\"", "service worker cache header route"],
  [files.packageJson, "\"check:pwa\": \"node scripts/check-pwa-installability.mjs\"", "PWA installability check package script"],
  [files.pwaCheck, "navigator.serviceWorker.ready", "PWA runtime registration check"],
  [files.pwaCheck, "manifest.shortcuts", "PWA manifest shortcut runtime check"],
  [files.pwaCheck, "[data-home-pwa-install]", "PWA runtime homepage install action check"],
  [files.siteManifest, "\"name\": \"POPTarot - Free AI Tarot Reading\"", "site manifest product name"],
  [files.siteManifest, "\"src\": \"/search-favicon.png\"", "site manifest search favicon icon"],
  [files.siteManifest, "\"src\": \"/favicon.png\"", "site manifest search favicon icon"],
  [files.siteManifest, "\"src\": \"/icon.png\"", "site manifest canonical icon"],
  [files.iconSvg, "viewBox=\"0 0 512 512\"", "512px SVG icon viewBox"],
  [files.logoSvg, "viewBox=\"0 0 512 512\"", "512px SVG logo viewBox"],
  [files.iconSvg, "#140E24", "POPTarot dark icon background"],
  [files.iconSvg, "#B8A5FF", "POPTarot lavender icon mark"],
  [files.trustPages, "PT monogram logo", "brand asset PT monogram copy"],
  [files.trustPages, "48 x 48 search favicon", "brand asset search favicon copy"],
  [files.trustPages, "96 x 96 browser favicon", "brand asset browser favicon copy"],
  [files.trustPages, "Multi-size favicon.ico", "brand asset ICO favicon copy"],
  [files.trustPages, "SVG icon", "brand asset SVG icon consistency copy"],
  [files.trustPages, "512 x 512 SVG icon", "brand asset SVG icon card"],
  [files.trustPages, "Search crawler source", "brand asset search crawler explanation"],
  [files.trustPageView, "previewSrc ?? item.src", "brand asset preview fallback"],
  [files.nextConfig, "brandAssetHeaders", "brand asset cache header registry"],
  [files.nextConfig, "max-age=31536000, immutable", "long-lived brand asset cache header"],
  [files.nextConfig, "X-Robots-Tag", "brand asset crawler index header"],
  [files.nextConfig, "/search-favicon.png", "search favicon header coverage"],
  [files.nextConfig, "/favicon.ico", "favicon ICO header coverage"],
  [files.nextConfig, "/favicon.png", "favicon PNG header coverage"],
  [files.nextConfig, "/logo.png", "logo header coverage"],
  [files.nextConfig, "/manifest.webmanifest", "manifest header coverage"],
]

for (const [file, needle, label] of identityMetadataCoverage) {
  assertIncludes(file, needle, label)
}
assertBefore(files.layout, "href={brandSearchFaviconPath} sizes=\"48x48\"", "href=\"/favicon.ico\" sizes=\"any\"", "search favicon head link order")
assertBefore(files.layout, "{ url: brandSearchFaviconPath, sizes: \"48x48\", type: \"image/png\" }", "{ url: \"/favicon.ico\", sizes: \"any\" }", "search favicon metadata order")

for (const unstableFavicon of ["favicon-48x48.png?v=", "favicon-96x96.png?v=", "favicon.ico?v="]) {
  assertNotIncludes(files.layout, unstableFavicon, "stable search favicon metadata")
}

const searchAssetRuntimeCoverage = [
  [files.packageJson, "\"check:search-assets\": \"node scripts/check-search-assets.mjs\"", "search asset package script"],
  [files.searchAssetCheck, "SEARCH_ASSET_BASE_URL", "search asset production base URL override"],
  [files.searchAssetCheck, "requiredAssets", "search asset runtime asset registry"],
  [files.searchAssetCheck, "\"/search-favicon.png\"", "search asset search favicon check"],
  [files.searchAssetCheck, "crawlerRefreshAssetPaths", "search asset crawler refresh cache registry"],
  [files.searchAssetCheck, "\"/favicon-48x48.png\"", "search asset 48px favicon check"],
  [files.searchAssetCheck, "\"/favicon.ico\"", "search asset ICO check"],
  [files.searchAssetCheck, "\"/logo.png\"", "search asset canonical logo check"],
  [files.searchAssetCheck, "\"/logo.svg\"", "search asset SVG logo check"],
  [files.searchAssetCheck, "\"/og-image.jpg\"", "search asset OG image check"],
  [files.searchAssetCheck, "requiredSitemapPaths", "search asset sitemap path registry"],
  [files.searchAssetCheck, "\"/free-tarot-tools\"", "search asset free hub sitemap check"],
  [files.searchAssetCheck, "\"/es/herramientas-tarot-gratis\"", "search asset Spanish free tools sitemap check"],
  [files.searchAssetCheck, "\"/pt-br/ferramentas-tarot-gratis\"", "search asset Portuguese free tools sitemap check"],
  [files.searchAssetCheck, "\"/daily-tarot\"", "search asset Daily Tarot sitemap check"],
  [files.searchAssetCheck, "\"/tarot-card-combinations\"", "search asset card combinations sitemap check"],
  [files.searchAssetCheck, "\"/es/combinaciones-cartas-tarot\"", "search asset Spanish card combinations sitemap check"],
  [files.searchAssetCheck, "\"/pt-br/combinacoes-cartas-tarot\"", "search asset Portuguese card combinations sitemap check"],
  [files.searchAssetCheck, "\"/one-card-tarot-reading\"", "search asset one-card spread format sitemap check"],
  [files.searchAssetCheck, "\"/three-card-tarot-reading\"", "search asset three-card spread format sitemap check"],
  [files.searchAssetCheck, "\"/past-present-future-tarot\"", "search asset past-present-future spread format sitemap check"],
  [files.searchAssetCheck, "\"/will-i-get-money-tarot\"", "search asset money improvement sitemap check"],
  [files.searchAssetCheck, "\"/should-i-spend-money-tarot\"", "search asset spending decision sitemap check"],
  [files.searchAssetCheck, "\"/financial-future-tarot-reading\"", "search asset financial future sitemap check"],
  [files.searchAssetCheck, "\"/es/recibire-dinero-tarot\"", "search asset Spanish money improvement sitemap check"],
  [files.searchAssetCheck, "\"/pt-br/vou-receber-dinheiro-tarot\"", "search asset Portuguese money improvement sitemap check"],
  [files.searchAssetCheck, "\"/will-my-ex-come-back-tarot\"", "search asset long-tail sitemap check"],
  [files.searchAssetCheck, "\"/es/mi-ex-volvera-tarot\"", "search asset Spanish long-tail sitemap check"],
  [files.searchAssetCheck, "\"/pt-br/meu-ex-vai-voltar-tarot\"", "search asset Portuguese long-tail sitemap check"],
  [files.searchAssetCheck, "\"/brand-assets\"", "search asset brand page sitemap check"],
  [files.searchAssetCheck, "\"/reviews\"", "search asset reviews sitemap check"],
  [files.searchAssetCheck, "blockedSitemapPaths", "search asset private flow sitemap guard"],
  [files.searchAssetCheck, "robotsDisallows", "search asset robots disallow guard"],
  [files.searchAssetCheck, "publicRobotsPaths", "search asset public robots guard"],
  [files.searchAssetCheck, "max-age=31536000", "search asset cache header guard"],
  [files.searchAssetCheck, "x-robots-tag", "search asset robots header guard"],
  [files.searchAssetCheck, "Googlebot-Image", "search asset Googlebot Image guard"],
  [files.searchAssetCheck, "hreflang=\"x-default\"", "search asset hreflang guard"],
  [files.searchAssetCheck, "homepage search asset", "search asset homepage metadata guard"],
  [files.searchAssetCheck, "brand assets page signal", "search asset brand page signal guard"],
]

for (const [file, needle, label] of searchAssetRuntimeCoverage) {
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

for (const route of [
  files.tarotCardRoute,
  files.spanishTarotCardRoute,
  files.portugueseTarotCardRoute,
  files.chineseTarotCardRoute,
  files.japaneseTarotCardRoute,
  files.koreanTarotCardRoute,
]) {
  assertIncludes(route, "seoLocales", `full SEO locale hreflang set in ${route.path}`)
  assertIncludes(route, "cardAlternates(page.slug)", `card alternate metadata in ${route.path}`)
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
  [files.cardMeaningPage, "id=\"reader-trust\"", "card page reader trust anchor"],
  [files.cardMeaningPage, "id=\"context-signals\"", "card page context signal anchor"],
  [files.cardMeaningPage, "id=\"combinations\"", "card page combinations anchor"],
  [files.cardMeaningPage, "id=\"example-readings\"", "card page example readings anchor"],
  [files.cardMeaningPage, "id=\"faq\"", "card page FAQ anchor"],
  [files.cardMeaningPage, "Reader trust", "English card reader trust copy"],
  [files.cardMeaningPage, "Confianza del lector", "Spanish card reader trust copy"],
  [files.cardMeaningPage, "Confiança do leitor", "Portuguese card reader trust copy"],
  [files.cardMeaningPage, "data-card-context-signal-grid", "card page context grid"],
  [files.cardMeaningPage, "data-card-context-signal-link", "card page context grid free spread links"],
  [files.cardMeaningPage, "Señales por contexto", "Spanish card context grid copy"],
  [files.cardMeaningPage, "Sinais por contexto", "Portuguese card context grid copy"],
  [files.cardMeaningPage, "Abrir tirada gratis", "Spanish context grid free spread CTA"],
  [files.cardMeaningPage, "Abrir tiragem grátis", "Portuguese context grid free spread CTA"],
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
  [files.robots, '"Googlebot-Image"', "Googlebot Image brand asset allow"],
  [files.robots, "brandAssets", "brand asset robots registry"],
  [files.robots, '"/favicon.png"', "favicon robots allow"],
  [files.robots, '"/logo.png"', "logo robots allow"],
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
  ["public/favicon.ico", "ICO favicon"],
  ["public/favicon.png", "canonical search favicon"],
  ["public/favicon-16x16.png", "16px favicon"],
  ["public/favicon-32x32.png", "32px favicon"],
  ["public/favicon-48x48.png", "48px favicon"],
  ["public/favicon-96x96.png", "96px favicon"],
  ["public/apple-touch-icon.png", "Apple touch icon"],
  ["public/logo.png", "canonical logo"],
  ["public/logo.svg", "canonical SVG logo"],
  ["public/site.webmanifest", "site web manifest compatibility alias"],
  ["public/icon-192x192.png", "192px app icon"],
  ["public/icon.png", "canonical PNG app icon"],
  ["public/icon-512x512.png", "512px app icon"],
  ["public/icon.svg", "SVG icon"],
  ["public/og-image.jpg", "Open Graph image"],
]) {
  assertFileExists(path, label)
}

const dailyReminderCoverage = [
  [files.vercelConfig, "\"path\": \"/api/cron/daily-tarot-reminders\"", "Vercel cron path"],
  [files.vercelConfig, "\"schedule\": \"0 * * * *\"", "hourly reminder cron schedule"],
  [files.reminderCron, "isCronAuthorized", "cron shared authorization helper"],
  [files.reminderCronAuth, "process.env.CRON_SECRET", "cron auth helper reads shared secret"],
  [files.reminderCronAuth, "authorization", "cron auth helper checks authorization header"],
  [files.reminderCronAuth, "Bearer", "cron auth helper checks bearer token"],
  [files.reminderCron, "dry_run", "cron dry-run mode"],
  [files.reminderCron, "dryRun", "cron dry-run camelCase alias"],
  [files.reminderCron, "email_provider_configured", "cron dry-run email provider status"],
  [files.reminderCron, "emailProviderStatus", "cron dry-run detailed email provider status"],
  [files.reminderCron, "hasEmailProvider()", "cron email provider guard"],
  [files.reminderCron, "isDailyReminderDue", "cron shared due-time scheduler"],
  [files.reminderCron, "newestReminderPerUser", "cron per-user reminder dedupe"],
  [files.reminderCron, "dailyReminderUnsubscribeUrl", "cron unsubscribe URL"],
  [files.reminderCron, "dailyTarotReminderText", "cron plain-text reminder fallback"],
  [files.reminderCron, "List-Unsubscribe", "cron list unsubscribe header"],
  [files.reminderCron, "List-Unsubscribe-Post", "cron one-click unsubscribe header"],
  [files.reminderCron, "tags: [", "cron email provider tags"],
  [files.reminderCron, "idempotencyKey", "cron email idempotency"],
  [files.reminderCapability, "emailProviderStatus", "reminder detailed email provider status"],
  [files.reminderCapability, "email_provider_status", "reminder provider status payload"],
  [files.reminderCapability, "email_from_configured", "reminder from-address capability"],
  [files.reminderCapability, "email_reply_to_configured", "reminder reply-to capability"],
  [files.reminderCapability, "unsubscribe_configured", "reminder unsubscribe capability"],
  [files.reminderCapability, "checkDailyReminderUnsubscribeAccess", "reminder unsubscribe RPC capability check"],
  [files.reminderCapability, "unsubscribe_rpc", "reminder missing unsubscribe RPC capability"],
  [files.reminderCapability, "delivery_status", "reminder delivery status"],
  [files.reminderCapability, "next_setup_step", "reminder next setup step"],
  [files.reminderCheckScript, "check-reminder-capability", "reminder capability check script identity"],
  [files.reminderCheckScript, "can_send_email_reminders", "reminder capability check script scheduled email output"],
  [files.reminderCheckScript, "email_provider", "reminder capability email provider output"],
  [files.reminderCheckScript, "email_from_configured", "reminder capability from-address output"],
  [files.reminderCheckScript, "email_reply_to_configured", "reminder capability reply-to output"],
  [files.reminderCheckScript, "--strict", "reminder capability strict mode"],
  [files.reminderCheckScript, "--cron", "reminder cron dry-run option"],
  [files.reminderCheckScript, "--send-test", "reminder protected test email option"],
  [files.reminderCheckScript, "CHECK_REMINDER_CRON_SECRET", "reminder cron dry-run secret env"],
  [files.reminderCheckScript, "CHECK_REMINDER_TEST_EMAIL", "reminder protected test email target env"],
  [files.reminderCheckScript, "REMINDER_CHECK_BASE_URL", "reminder capability target URL alias"],
  [files.reminderCheckScript, "/api/cron/daily-tarot-reminders?dry_run=1", "reminder cron dry-run endpoint"],
  [files.reminderCheckScript, "/api/cron/daily-tarot-reminders/test", "reminder protected test email endpoint"],
  [files.reminderCronTest, "export async function POST", "protected reminder test POST endpoint"],
  [files.reminderCronTest, "isCronAuthorized", "protected reminder test cron authorization"],
  [files.reminderCronTest, "hasEmailProvider()", "protected reminder test provider guard"],
  [files.reminderCronTest, "dailyTarotReminderHtml", "protected reminder test HTML template"],
  [files.reminderCronTest, "dailyTarotReminderText", "protected reminder test text template"],
  [files.reminderCronTest, "List-Unsubscribe", "protected reminder test unsubscribe header"],
  [files.reminderCronTest, "reminder_test", "protected reminder test email tag"],
  [files.reminderSchedule, "hourCycle: \"h23\"", "reminder scheduler 00-23 hour cycle"],
  [files.reminderSchedule, "rawHour === 24 ? 0", "reminder scheduler 24-hour midnight normalization"],
  [files.reminderSchedule, "localDateTimeParts(\"UTC\", now)", "reminder scheduler invalid timezone fallback"],
  [files.reminderScheduleCheckScript, "New York 00:30 must not normalize to 24:30", "reminder schedule midnight regression check"],
  [files.reminderScheduleCheckScript, "already-sent reminder must not repeat", "reminder schedule duplicate-send regression check"],
  [files.packageJson, "\"check:reminders:schedule\": \"node --no-warnings scripts/check-reminder-schedule.mjs\"", "reminder schedule package script"],
  [files.packageJson, "\"check:reminders:test\": \"node scripts/check-reminder-capability.mjs --send-test\"", "reminder protected test package script"],
  [files.readme, "REMINDER_CHECK_BASE_URL=https://poptarot.com npm run check:reminders", "production reminder capability README command"],
  [files.readme, "CHECK_REMINDER_TEST_EMAIL=you@example.com", "production reminder protected test README command"],
  [files.readme, "CHECK_REMINDER_APP_URL", "production reminder capability legacy README env alias"],
  [files.readme, "RESEND_REPLY_TO=optional_support_or_reply_email", "optional Resend reply-to README env"],
  [files.envExample, "CHECK_REMINDER_TEST_EMAIL=", "reminder protected test email env example"],
  [files.envExample, "RESEND_REPLY_TO=", "optional Resend reply-to env example"],
  [files.reminderServiceGrantMigration, "security invoker", "reminder public RPC wrapper invoker mode"],
  [files.reminderServiceGrantMigration, "revoke all on function public.daily_tarot_reminder_candidates(text, integer) from public, anon, authenticated", "public reminder candidates anon/auth revoke"],
  [files.reminderServiceGrantMigration, "revoke all on function public.disable_daily_tarot_reminders(text, uuid) from public, anon, authenticated", "public reminder unsubscribe anon/auth revoke"],
  [files.reminderServiceGrantMigration, "revoke execute on function private.daily_tarot_reminder_candidates(text, integer) from public, anon, authenticated", "private reminder candidates direct revoke"],
  [files.reminderServiceGrantMigration, "revoke execute on function private.mark_daily_tarot_reminder_sent(text, uuid, date) from public, anon, authenticated", "private reminder sent direct revoke"],
  [files.reminderServiceGrantMigration, "revoke execute on function private.mark_daily_tarot_reminder_failed(text, uuid, text) from public, anon, authenticated", "private reminder failed direct revoke"],
  [files.reminderServiceGrantMigration, "revoke execute on function private.disable_daily_tarot_reminders(text, uuid) from public, anon, authenticated", "private reminder unsubscribe direct revoke"],
  [files.reminderServiceGrantMigration, "revoke usage on schema private from anon, authenticated", "private schema usage revoke"],
  [files.reminderServiceGrantMigration, "grant usage on schema private to service_role", "private schema service role usage"],
  [files.reminderServiceGrantMigration, "grant execute on function public.daily_tarot_reminder_candidates(text, integer) to service_role", "public reminder candidates service role grant"],
  [files.reminderServiceGrantMigration, "grant execute on function public.disable_daily_tarot_reminders(text, uuid) to service_role", "public reminder unsubscribe service role grant"],
  [files.reminderRpc, "createServiceSupabase().rpc(\"daily_tarot_reminder_candidates\"", "reminder candidates use service role client"],
  [files.reminderRpc, "createServiceSupabase().rpc(\"disable_daily_tarot_reminders\"", "reminder unsubscribe uses service role client"],
  [files.reminderUnsubscribe, "export async function POST", "one-click unsubscribe POST handler"],
  [files.reminderUnsubscribe, "disabled_count", "one-click unsubscribe JSON confirmation"],
  [files.reminderUnsubscribe, "verifyDailyReminderUnsubscribeToken", "unsubscribe token verification"],
  [files.reminderUnsubscribe, "disableDailyReminders", "unsubscribe disables reminders through RPC"],
  [files.reminderRpc, "disable_daily_tarot_reminders", "unsubscribe RPC helper"],
  [files.reminderUnsubscribeToken, "DAILY_TAROT_UNSUBSCRIBE_SECRET", "dedicated unsubscribe secret"],
  [files.reminderUnsubscribeToken, "timingSafeEqual", "safe unsubscribe token comparison"],
  [files.dailyTarotTool, "data-daily-return-setup", "Daily Tarot return setup panel"],
  [files.dailyTarotTool, "data-daily-return-setup-calendar", "Daily Tarot prominent calendar reminder CTA"],
  [files.dailyTarotTool, "data-daily-return-setup-google-calendar", "Daily Tarot prominent Google Calendar CTA"],
  [files.dailyTarotTool, "data-daily-return-setup-mailto", "Daily Tarot prominent self-email return CTA"],
  [files.dailyTarotTool, "data-daily-return-setup-reminder", "Daily Tarot reminder preference CTA"],
  [files.dailyTarotTool, "returnSetupMail", "Daily Tarot self-email return setup localized copy"],
  [files.clientCalendarReminder, "downloadDailyReturnCalendar", "shared Daily Tarot calendar download helper"],
  [files.clientCalendarReminder, "createGoogleCalendarDailyReturnUrl", "shared Daily Tarot Google Calendar helper"],
  [files.clientCalendarReminder, "https://calendar.google.com/calendar/render", "Google Calendar render URL"],
  [files.clientCalendarReminder, "ctz: timezone", "Google Calendar timezone parameter"],
  [files.clientCalendarReminder, "recur: \"RRULE:FREQ=DAILY;INTERVAL=1\"", "Google Calendar recurring rule"],
  [files.clientCalendarReminder, "X-WR-TIMEZONE", "Daily Tarot calendar timezone"],
  [files.clientCalendarReminder, "DTSTART;TZID=", "Daily Tarot calendar timezone-aware start"],
  [files.clientCalendarReminder, "RRULE:FREQ=DAILY;INTERVAL=1", "Daily Tarot recurring calendar rule"],
  [files.clientCalendarReminder, "BEGIN:VALARM", "Daily Tarot calendar alarm block"],
  [files.clientCalendarReminder, "TRIGGER:-PT10M", "Daily Tarot calendar notification trigger"],
  [files.dailyTarotTool, "downloadDailyReturnCalendar", "Daily Tarot uses shared calendar helper"],
  [files.dailyTarotTool, "createGoogleCalendarDailyReturnUrl", "Daily Tarot uses shared Google Calendar helper"],
  [files.dailyTarotTool, "handleOpenGoogleCalendarReminder", "Daily Tarot Google Calendar handler"],
  [files.dailyTarotTool, "daily_google_calendar_opened", "Daily Tarot Google Calendar analytics action"],
  [files.dailyTarotTool, "provider: \"google_calendar\"", "Daily Tarot Google Calendar analytics provider"],
  [files.dailyTarotTool, "googleCalendarReminder", "Daily Tarot Google Calendar localized copy"],
  [files.dailyTarotTool, "googleCalendarOpened", "Daily Tarot Google Calendar status copy"],
  [files.dailyTarotTool, "url: buildDailyReturnUrl(\"return_link\")", "Daily Tarot calendar events use direct return URL"],
  [files.dailyTarotTool, "daily_calendar_reminder_downloaded", "Daily Tarot calendar reminder analytics event"],
  [files.dailyTarotTool, "daily_reminder_preference_saved", "Daily Tarot reminder preference analytics event"],
  [files.dailyTarotTool, "synced_to_cloud", "Daily Tarot reminder preference cloud sync metadata"],
  [files.dailyTarotTool, "missing_capabilities", "Daily Tarot reminder provider capability metadata"],
  [files.dailyTarotTool, "daily_install_prompt_opened", "Daily Tarot install prompt analytics event"],
  [files.dailyTarotTool, "daily_install_completed", "Daily Tarot install completion analytics event"],
  [files.dailyTarotTool, "daily_install_fallback_shown", "Daily Tarot install fallback analytics event"],
  [files.analyticsEventRoute, "daily_calendar_reminder_downloaded", "Daily Tarot calendar analytics allowlist"],
  [files.analyticsEventRoute, "daily_reminder_preference_saved", "Daily Tarot reminder preference analytics allowlist"],
  [files.analyticsEventRoute, "daily_install_completed", "Daily Tarot install analytics allowlist"],
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
  [files.dailyTarotTool, "data-daily-pattern-next-action", "Daily Tarot pattern next return action"],
  [files.dailyTarotTool, "patternCopy.nextActionLabel", "Daily Tarot next action localized copy"],
  [files.dailyTarotTool, "patternCopy.noteRate", "Daily Tarot journal rate signal"],
  [files.dailyTarotTool, "patternCopy.missed", "Daily Tarot missed-day signal"],
  [files.dailyTarotTool, "data-daily-feedback-link", "Daily Tarot reader feedback CTA"],
  [files.dailyTarotTool, "surface: \"daily_tarot_tool\"", "Daily Tarot reader feedback attribution surface"],
  [files.dailyTarotTool, "type: \"daily_tarot\"", "Daily Tarot reader feedback type"],
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
  [files.shareTemplates, "SeoLocale", "share templates support regional SEO locales"],
  [files.shareTemplates, "Tarot de hoy", "share templates include Spanish copy"],
  [files.shareTemplates, "Tarot de hoje", "share templates include Portuguese copy"],
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
  [files.shareCopyActions, "data-public-share-copy-actions", "public share visible copy/share action group"],
  [files.shareCopyActions, "data-public-share-native-share", "public share native share CTA"],
  [files.shareCopyActions, "data-public-share-copy-link", "public share copy link CTA"],
  [files.shareCopyActions, "data-public-share-email-self", "public share self-email CTA"],
  [files.shareCopyActions, "data-public-share-calendar-reminder", "public share calendar return CTA"],
  [files.shareCopyActions, "data-public-share-google-calendar", "public share Google Calendar return CTA"],
  [files.shareCopyActions, "downloadDailyReturnCalendar", "public share calendar helper"],
  [files.shareCopyActions, "createGoogleCalendarDailyReturnUrl", "public share Google Calendar helper"],
  [files.shareCopyActions, "surface: \"public_share_page\"", "public share calendar analytics surface"],
  [files.shareCopyActions, "public_share_google_calendar_opened", "public share Google Calendar analytics action"],
  [files.shareCopyActions, "provider: \"google_calendar\"", "public share Google Calendar analytics provider"],
  [files.shareCopyActions, "mailto:?subject=", "public share self-email mailto"],
  [files.shareCopyActions, "reading_email_self_opened", "public share self-email analytics event"],
  [files.shareCopyActions, "public_share_email", "public share self-email Daily Tarot attribution"],
  [files.shareCopyActions, "data-public-share-copy-template", "public share social template CTAs"],
  [files.shareCopyActions, "max-w-2xl gap-2 sm:grid-cols-2 lg:grid-cols-3", "public share action grid can expand without mobile overflow"],
  [files.shareCopyActions, "copyByLanguage", "public share multilingual share action copy"],
  [files.shareCopyActions, "\"pt-br\"", "public share Portuguese copy"],
  [files.shareCopyActions, "native_public_share", "public share native-share analytics action"],
  [files.shareCopyActions, "copy_public_share_url", "public share copy-link analytics action"],
  [files.shareNotFound, "data-public-share-not-found", "missing public share fallback page"],
  [files.shareNotFound, "data-public-share-not-found-start", "missing public share free start CTA"],
  [files.shareNotFound, "data-public-share-not-found-daily", "missing public share Daily Tarot CTA"],
  [files.shareNotFound, "data-public-share-not-found-trust", "missing public share trust section"],
  [files.shareNotFound, "data-public-share-not-found-path", "missing public share path cards"],
  [files.shareNotFound, "public_share_missing", "missing public share attribution source"],
  [files.shareNotFound, "missing_share", "missing public share attribution medium"],
  [files.shareNotFound, "Start a fresh free reading", "missing public share free-first copy"],
  [files.shareNotFound, "Review%20a%20question%20from%20a%20shared%20reading", "missing public share Daily Tarot return focus"],
  [files.shareNotFound, "/free-tarot-tools", "missing public share free tools path"],
  [files.shareNotFound, "/reviews", "missing public share reviews path"],
  [files.shareNotFound, "/ai-tarot-disclaimer", "missing public share AI disclaimer path"],
  [files.shareNotFound, "/privacy", "missing public share privacy path"],
  [files.shareNotFound, "/tarot-reading-examples", "missing public share examples path"],
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
  [files.spreadConfig, "'reconciliation_starter'", "free reconciliation starter spread"],
  [files.spreadConfig, "'love_starter'", "free love starter spread"],
  [files.spreadConfig, "'career_starter'", "free career starter spread"],
  [files.spreadConfig, "'decision_starter'", "free decision starter spread"],
  [files.spreadConfig, "export function isAdvancedSpreadType", "advanced spread classifier"],
  [files.spreadConfig, "FREE_STARTER_FALLBACKS", "contextual advanced spread free fallback map"],
  [files.spreadConfig, "breakup_recovery: 'reconciliation_starter'", "breakup recovery free starter fallback"],
  [files.spreadConfig, "their_thoughts: 'love_starter'", "love intent free starter fallback"],
  [files.spreadConfig, "job_opportunity: 'career_starter'", "career intent free starter fallback"],
  [files.spreadConfig, "interpersonal: 'decision_starter'", "decision intent free starter fallback"],
  [files.spreadConfig, "return SPREAD_CONFIGS.three_card", "unknown spread generic free fallback"],
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
  [files.readingSpreadsRoute, "membership_boundary", "spread list free-first membership boundary"],
  [files.readingSpreadsRoute, "free_starter_spread_type", "spread list free starter fallback"],
  [files.readingSpreadsRoute, "access_tier: getSpreadAccessTier(spread.type)", "spread list access tier"],
  [files.readingSpreadsRoute, "upgrade_feature: getSpreadUpgradeFeature(spread.type)", "spread list upgrade feature"],
  [files.readingClassifyRoute, "const isAdvanced = isAdvancedSpreadType(best.type)", "classified spread advanced marker"],
  [files.readingClassifyRoute, "effective_free_spread_type", "classified spread effective free starter"],
  [files.readingClassifyRoute, "free_starter_spread_config", "classified spread free starter config"],
  [files.readingClassifyRoute, "member_spread_config", "classified spread member-depth config"],
  [files.readingClassifyRoute, "free_first_message", "classified spread free-first message"],
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
  [files.inputPage, "result.free_starter_spread_config", "input consumes API free starter config"],
  [files.inputPage, "result.free_first_message", "input consumes API free-first message"],
  [files.inputPage, "Switched to a free starter spread", "advanced spread downgrade copy"],
  [files.inputPage, "data-input-advanced-spread-prompt", "input advanced spread prompt selector"],
  [files.inputPage, "data-input-free-first-boundary", "input free-first boundary selector"],
  [files.inputPage, "data-input-free-starter-spread", "input visible free starter spread"],
  [files.inputPage, "data-input-member-spread-name", "input visible member spread name"],
  [files.inputPage, "data-input-member-upgrade-cta", "input visible member upgrade CTA"],
  [files.inputPage, "\"free love starter\": \"Inicio gratis de amor\"", "input Spanish free love starter localization"],
  [files.inputPage, "\"free career starter\": \"Inicio gratis de carreira\"", "input Portuguese free career starter localization"],
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
  [files.readingPage, "data-reading-email-self", "free reading self-email CTA"],
  [files.readingPage, "data-reading-feedback-link", "free reading result feedback CTA"],
  [files.readingPage, "surface: \"reading_result\"", "free reading feedback attribution surface"],
  [files.readingPage, "type: \"free_reading\"", "free reading feedback type"],
  [files.readingPage, "buildSelfEmailBody", "free reading self-email body helper"],
  [files.readingPage, "mailto:?subject=", "free reading self-email mailto"],
  [files.readingPage, "reading_email_self_opened", "free reading self-email analytics event"],
  [files.analyticsEventRoute, "reading_email_self_opened", "analytics self-email event allowlist"],
  [files.readingPage, "data-reading-return-calendar", "free reading result calendar return CTA"],
  [files.readingPage, "data-reading-return-google-calendar", "free reading result Google Calendar return CTA"],
  [files.readingPage, "handleDownloadReadingReturnCalendar", "free reading result calendar handler"],
  [files.readingPage, "handleOpenReadingReturnGoogleCalendar", "free reading result Google Calendar handler"],
  [files.readingPage, "createGoogleCalendarDailyReturnUrl", "free reading result Google Calendar helper"],
  [files.readingPage, "surface: \"reading_result\"", "free reading result calendar analytics surface"],
  [files.readingPage, "reading_google_calendar_opened", "free reading result Google Calendar analytics action"],
  [files.readingPage, "provider: \"google_calendar\"", "free reading result Google Calendar analytics provider"],
  [files.readingPage, "poptarot-reading-daily-return.ics", "free reading result calendar filename"],
  [files.readingPage, "data-reading-free-share-loop", "free reading visible share loop"],
  [files.readingPage, "data-reading-free-share-step", "free reading share loop steps"],
  [files.readingPage, "Share and revisit first, upgrade later", "free reading share-before-upgrade copy"],
  [files.readingPage, "Public result pages, social captions, and self-email", "free reading share feature boundary"],
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
