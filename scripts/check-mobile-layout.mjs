import { chromium } from "playwright"

const baseUrl = process.env.MOBILE_CHECK_BASE_URL || "http://localhost:3000"

const highIntentQuestionRequiredSelectors = [
  "[data-question-sticky-cta]",
  "[data-question-hero-spread-summary]",
  "[data-seo-question-tool-entry]",
  "[data-question-spread-position-answer]",
  "[data-question-result-preview]",
  "[data-question-decision-checklist]",
  "[data-question-return-loop]",
  "[data-question-return-loop-card]",
  "[data-seo-question-share]",
  "[data-seo-reader-trust]",
]

const pages = [
  {
    path: "/",
    name: "home",
    requiredSelectors: ["[data-home-card]", "[data-home-question-form]", "[data-home-daily-return-panel]", "[data-home-pwa-install]"],
    menuRequiredSelectors: [
      "[data-menu-free-first-primary]",
      "[data-menu-free-path-grid]",
      "[data-menu-trust-paths]",
      "[data-menu-depth-boundary]",
      "[data-menu-membership-boundary]",
    ],
    allowedWideSelector: "mix-blend-color-dodge",
  },
  {
    path: "/",
    name: "home Google app browser",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/318.0.650947740 Mobile/15E148 Safari/604.1",
    requiredSelectors: ["[data-home-header]", "[data-home-card]", "[data-home-question-form]", "[data-home-daily-return-panel]", "[data-home-pwa-install]"],
    menuRequiredSelectors: [
      "[data-menu-free-first-primary]",
      "[data-menu-free-path-grid]",
      "[data-menu-trust-paths]",
      "[data-menu-depth-boundary]",
      "[data-menu-membership-boundary]",
    ],
    allowedWideSelector: "mix-blend-color-dodge",
    embeddedTopGuard: 112,
  },
  {
    path: "/daily-tarot",
    name: "daily tarot",
    requiredSelectors: [
      "[data-daily-tarot-tool]",
      "[data-daily-sticky-cta]",
      "[data-daily-quick-actions]",
      "[data-daily-direct-return-actions]",
      "[data-daily-return-setup-mailto]",
      "[data-daily-reminder-pending-email-input]",
      "[data-daily-reminder-pending-save]",
      "[data-daily-pattern-next-action]",
      "[data-daily-question-paths]",
      "[data-daily-question-path]",
      "[data-daily-question-path-guide]",
      "[data-daily-question-path-focus]",
      "[data-daily-question-path-start]",
      "[data-daily-seven-day-plan]",
      "[data-daily-seven-day-link]",
    ],
  },
  {
    path: "/daily-tarot?daily_focus=love&return_focus=What%20should%20I%20understand%20about%20love%20today%3F&utm_source=seo&utm_medium=daily_focus_path&utm_campaign=daily-love-tarot",
    name: "daily tarot focused love entry",
    requiredSelectors: ["[data-daily-tarot-tool]", "[data-daily-focused-entry]", "[data-daily-focus=\"love\"]", "[data-daily-focused-entry-draw]", "[data-daily-return-setup]", "[data-daily-direct-return-actions]"],
    requiredLocalStorageKeyPrefix: "poptarot_daily_return_",
  },
  {
    path: "/daily-tarot?return_focus=Will%20my%20ex%20come%20back%20tarot&return_action=reminder&utm_source=seo&utm_medium=question_return_loop&utm_campaign=will-my-ex-come-back-tarot",
    name: "daily tarot linked return focus",
    requiredSelectors: ["[data-daily-tarot-tool]", "[data-daily-linked-return-focus]", "[data-daily-linked-return-focus-edit]", "[data-daily-return-setup]", "[data-daily-direct-return-actions]", "[data-daily-return-setup-mailto]"],
    requiredLocalStorageKeyPrefix: "poptarot_daily_return_",
  },
  {
    path: "/input?q=Will%20my%20ex%20come%20back%3F&auto=1&spread=breakup_recovery&source=mobile_free_first_check",
    name: "input advanced spread free-first fallback",
    waitMs: 1800,
    allowedWideSelector: "rounded-full pointer-events-none",
    requiredSelectors: [
      "[data-input-page]",
      "[data-input-advanced-spread-prompt]",
      "[data-input-free-first-boundary]",
      "[data-input-free-starter-spread]",
      "[data-input-member-spread-name]",
      "[data-input-member-upgrade-cta]",
    ],
  },
  {
    path: "/tarot-questions?q=love",
    name: "tarot questions",
    requiredSelectors: [
      "main",
      "[data-question-search-results]",
      "[data-question-quick-start-groups]",
      "[data-question-quick-start-group]",
      "[data-question-quick-start-card]",
      "[data-question-entry-group=\"daily\"]",
    ],
  },
  {
    path: "/tarot-card-meanings",
    name: "card meanings hub",
    requiredSelectors: [
      "[data-card-meaning-context-guide]",
      "[data-card-meaning-context-guide-item]",
      "[data-card-meaning-context-guide-link]",
      "[data-card-context-hubs]",
      "[data-card-meaning-free-starts]",
      "[data-card-meaning-free-start]",
      "[data-card-combination-paths]",
    ],
  },
  {
    path: "/es/significados-cartas-tarot",
    name: "Spanish card meanings hub",
    requiredSelectors: [
      "[data-card-meaning-context-guide]",
      "[data-card-meaning-context-guide-item]",
      "[data-card-meaning-context-guide-link]",
      "[data-card-context-hubs]",
      "[data-card-meaning-free-starts]",
      "[data-card-meaning-free-start]",
    ],
  },
  {
    path: "/pt-br/significados-cartas-tarot",
    name: "Portuguese card meanings hub",
    requiredSelectors: [
      "[data-card-meaning-context-guide]",
      "[data-card-meaning-context-guide-item]",
      "[data-card-meaning-context-guide-link]",
      "[data-card-context-hubs]",
      "[data-card-meaning-free-starts]",
      "[data-card-meaning-free-start]",
    ],
  },
  {
    path: "/one-card-tarot-reading",
    name: "one-card free spread format",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/three-card-tarot-reading",
    name: "three-card free spread format",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/past-present-future-tarot",
    name: "past present future free spread format",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/will-my-ex-come-back-tarot",
    name: "long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-move-on-tarot",
    name: "new breakup long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/no-contact-tarot-reading",
    name: "no contact long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/does-no-contact-work-tarot",
    name: "does no contact work long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/will-my-ex-reach-out-tarot",
    name: "ex reach out long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-stay-or-leave-tarot",
    name: "stay or leave long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-give-him-another-chance-tarot",
    name: "second chance long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/does-my-crush-like-me-tarot",
    name: "crush long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/does-she-love-me-tarot",
    name: "she love long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-text-her-tarot",
    name: "text her long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-break-up-with-her-tarot",
    name: "break up with her long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-start-a-business-tarot",
    name: "business startup long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/will-i-get-money-tarot",
    name: "money improvement long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/should-i-spend-money-tarot",
    name: "spending decision long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/financial-future-tarot-reading",
    name: "financial future long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/tarot-card-of-the-day",
    name: "tarot card of the day return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-tarot-card",
    name: "daily tarot card return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/love-tarot-card-of-the-day",
    name: "love tarot card of the day return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-love-tarot",
    name: "daily love tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-career-tarot",
    name: "daily career tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-yes-or-no-tarot",
    name: "daily yes or no tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-mood-tarot",
    name: "daily mood tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/daily-action-tarot",
    name: "daily action tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/es/tarot-diario-amor",
    name: "Spanish daily love tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/pt-br/tarot-diario-amor",
    name: "Portuguese daily love tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/weekly-tarot-reading",
    name: "weekly tarot return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/weekly-love-tarot",
    name: "weekly love return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/weekly-career-tarot",
    name: "weekly career return question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/will-i-get-promoted-tarot",
    name: "promotion long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/es/mi-ex-volvera-tarot",
    name: "Spanish long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/pt-br/meu-ex-vai-voltar-tarot",
    name: "Portuguese long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/es/recibire-dinero-tarot",
    name: "Spanish money long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/pt-br/vou-receber-dinheiro-tarot",
    name: "Portuguese money long-tail question",
    requiredSelectors: highIntentQuestionRequiredSelectors,
  },
  {
    path: "/tarot-card-meanings/the-fool",
    name: "card meaning",
    requiredSelectors: [
      "[data-tarot-card-meaning-page]",
      "[data-card-sticky-cta]",
      "[data-card-reader-trust]",
      "[data-card-reader-trust-review]",
      "[data-card-reader-trust-feedback]",
      "[data-card-reader-trust-link]",
      "[data-card-context-signal-grid]",
      "[data-card-context-signal-link]",
      "[data-card-daily-return]",
      "[data-card-daily-return-cta]",
      "[data-card-question-paths]",
      "[data-card-question-path]",
      "[data-card-question-path-guide]",
      "[data-card-question-path-start]",
      "[data-card-neighbor-nav]",
    ],
  },
  {
    path: "/es/tarot-card-meanings/the-fool",
    name: "Spanish card meaning",
    requiredSelectors: [
      "[data-tarot-card-meaning-page]",
      "[data-card-sticky-cta]",
      "[data-card-reader-trust]",
      "[data-card-reader-trust-review]",
      "[data-card-reader-trust-feedback]",
      "[data-card-reader-trust-link]",
      "[data-card-context-signal-grid]",
      "[data-card-context-signal-link]",
      "[data-card-daily-return]",
      "[data-card-daily-return-cta]",
      "[data-card-question-paths]",
      "[data-card-question-path]",
      "[data-card-question-path-guide]",
      "[data-card-question-path-start]",
      "[data-card-neighbor-nav]",
    ],
  },
  {
    path: "/pt-br/tarot-card-meanings/the-fool",
    name: "Portuguese card meaning",
    requiredSelectors: [
      "[data-tarot-card-meaning-page]",
      "[data-card-sticky-cta]",
      "[data-card-reader-trust]",
      "[data-card-reader-trust-review]",
      "[data-card-reader-trust-feedback]",
      "[data-card-reader-trust-link]",
      "[data-card-context-signal-grid]",
      "[data-card-context-signal-link]",
      "[data-card-daily-return]",
      "[data-card-daily-return-cta]",
      "[data-card-question-paths]",
      "[data-card-question-path]",
      "[data-card-question-path-guide]",
      "[data-card-question-path-start]",
      "[data-card-neighbor-nav]",
    ],
  },
  {
    path: "/tarot-card-combinations",
    name: "card combinations hub",
    requiredSelectors: [
      "[data-card-combinations-hub]",
      "[data-card-combination-start-free]",
      "[data-card-combination-hub-link]",
      "[data-card-combination-method]",
      "[data-card-combination-daily-return]",
      "[data-card-combination-faq]",
    ],
  },
  {
    path: "/es/combinaciones-cartas-tarot",
    name: "Spanish card combinations hub",
    requiredSelectors: [
      "[data-card-combinations-hub]",
      "[data-card-combination-start-free]",
      "[data-card-combination-hub-link]",
      "[data-card-combination-method]",
      "[data-card-combination-daily-return]",
      "[data-card-combination-faq]",
    ],
  },
  {
    path: "/pt-br/combinacoes-cartas-tarot",
    name: "Portuguese card combinations hub",
    requiredSelectors: [
      "[data-card-combinations-hub]",
      "[data-card-combination-start-free]",
      "[data-card-combination-hub-link]",
      "[data-card-combination-method]",
      "[data-card-combination-daily-return]",
      "[data-card-combination-faq]",
    ],
  },
  {
    path: "/free-tarot-tools",
    name: "free tools",
    requiredSelectors: [
      "[data-free-tools-quick-start-start]",
      "[data-free-tools-spread-formats]",
      "[data-free-tools-spread-format-start]",
      "[data-free-tools-spread-format-guide]",
      "[data-free-tools-social-proof]",
    ],
  },
  {
    path: "/es/herramientas-tarot-gratis",
    name: "Spanish free tools",
    requiredSelectors: [
      "[data-free-tools-quick-start-start]",
      "[data-free-tools-spread-formats]",
      "[data-free-tools-spread-format-start]",
      "[data-free-tools-spread-format-guide]",
      "[data-free-tools-social-proof]",
    ],
  },
  {
    path: "/pt-br/ferramentas-tarot-gratis",
    name: "Portuguese free tools",
    requiredSelectors: [
      "[data-free-tools-quick-start-start]",
      "[data-free-tools-spread-formats]",
      "[data-free-tools-spread-format-start]",
      "[data-free-tools-spread-format-guide]",
      "[data-free-tools-social-proof]",
    ],
  },
  {
    path: "/share/missing-public-share-for-mobile-check",
    name: "missing public share",
    requiredSelectors: [
      "[data-public-share-not-found]",
      "[data-public-share-not-found-start]",
      "[data-public-share-not-found-daily]",
      "[data-public-share-not-found-trust]",
      "[data-public-share-not-found-path]",
    ],
  },
  {
    path: "/membership",
    name: "membership free-first boundary",
    requiredSelectors: [
      "[data-membership-free-first]",
      "[data-membership-free-path-grid]",
      "[data-membership-depth-boundary]",
      "[data-membership-plan-section]",
      "[data-membership-payment-section]",
      "[data-membership-benefit-comparison]",
    ],
  },
  {
    path: "/about",
    name: "about trust page",
    requiredSelectors: ["main", "[data-trust-page]"],
  },
  {
    path: "/what-is-poptarot",
    name: "brand disambiguation trust page",
    requiredSelectors: ["[data-trust-page]", "[data-trust-page-slug=\"what-is-poptarot\"]", "[data-trust-default-free-action]"],
  },
  {
    path: "/reviews",
    name: "reviews trust page",
    requiredSelectors: [
      "[data-trust-page]",
      "[data-trust-testimonial-start]",
      "[data-trust-default-free-action]",
      "[data-reader-feedback-form]",
      "[data-reader-feedback-rating]",
      "[data-reader-feedback-submit]",
    ],
  },
  {
    path: "/tarot-reading-examples",
    name: "reading examples trust page",
    requiredSelectors: ["[data-trust-page]", "[data-trust-reading-example-start]", "[data-trust-reading-example-guide]"],
  },
]

function absoluteUrl(path) {
  return new URL(path, baseUrl).toString()
}

function describeWideElement(item) {
  return `${item.tag}${item.id ? `#${item.id}` : ""}${item.className ? `.${item.className}` : ""} ${item.left}-${item.right}px`
}

async function checkPage(browser, pageConfig) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: pageConfig.userAgent,
  })

  await page.route("**/api/analytics/event", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(absoluteUrl(pageConfig.path), { waitUntil: "networkidle", timeout: 45_000 })
  await page.waitForTimeout(pageConfig.waitMs || 500)

  if (pageConfig.menuRequiredSelectors) {
    await page.click("[data-home-menu-button]")
    await page.waitForTimeout(350)
  }

  const allRequiredSelectors = [
    ...pageConfig.requiredSelectors,
    ...(pageConfig.menuRequiredSelectors || []),
  ]

  const result = await page.evaluate(({ requiredSelectors, embeddedTopGuard, requiredLocalStorageKeyPrefix }) => {
    const viewportWidth = document.documentElement.clientWidth
    const missingSelectors = requiredSelectors.filter((selector) => !document.querySelector(selector))
    const wideElements = Array.from(document.body.querySelectorAll("*"))
      .map((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.width <= viewportWidth + 1) return null
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: typeof element.className === "string" ? element.className.slice(0, 140) : "",
          width: Math.round(rect.width),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        }
      })
      .filter(Boolean)

    const homeLayout = (() => {
      const selectors = {
        header: "[data-home-header]",
        copy: "[data-home-hero-copy]",
        card: "[data-home-card]",
        form: "[data-home-question-form]",
        daily: "[data-home-daily-return-panel]",
        nav: "[data-home-secondary-nav-mobile], [data-home-secondary-nav]",
        scroll: "[data-home-scroll-content]",
      }
      const rects = {}
      for (const [key, selector] of Object.entries(selectors)) {
        const element = document.querySelector(selector)
        if (!element) return null
        const rect = element.getBoundingClientRect()
        rects[key] = {
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
        }
      }

      const gapChecks = [
        { name: "copy to card", gap: rects.card.top - rects.copy.bottom, min: 96 },
        { name: "card to form", gap: rects.form.top - rects.card.bottom, min: 32 },
        { name: "form to secondary nav", gap: rects.nav.top - rects.form.bottom, min: 16 },
        { name: "secondary nav to scroll content", gap: rects.scroll.top - rects.nav.bottom, min: 56 },
        { name: "scroll content to daily panel", gap: rects.daily.top - rects.scroll.top, min: 32 },
      ]
      const violations = gapChecks
        .filter((check) => check.gap < check.min)
        .map((check) => `${check.name} ${check.gap}px < ${check.min}px`)

      if (embeddedTopGuard && rects.header.top < embeddedTopGuard) {
        violations.push(`header top ${rects.header.top}px < embedded browser guard ${embeddedTopGuard}px`)
      }

      return { rects, violations }
    })()

    return {
      pathname: window.location.pathname,
      title: document.title,
      overflowX: document.documentElement.scrollWidth - viewportWidth,
      scrollHeight: document.documentElement.scrollHeight,
      missingSelectors,
      wideElements,
      homeLayout,
      missingLocalStoragePrefix:
        requiredLocalStorageKeyPrefix && !Object.keys(localStorage).some((key) => key.startsWith(requiredLocalStorageKeyPrefix))
          ? requiredLocalStorageKeyPrefix
          : "",
    }
  }, {
    requiredSelectors: allRequiredSelectors,
    embeddedTopGuard: pageConfig.embeddedTopGuard || 0,
    requiredLocalStorageKeyPrefix: pageConfig.requiredLocalStorageKeyPrefix || "",
  })

  await page.close()

  const unexpectedWideElements = result.wideElements.filter((item) => {
    if (!pageConfig.allowedWideSelector) return true
    return !item.className.includes(pageConfig.allowedWideSelector)
  })

  return {
    ...result,
    ...pageConfig,
    unexpectedWideElements,
  }
}

const browser = await chromium.launch({ headless: true })
const failures = []
const results = []

try {
  for (const pageConfig of pages) {
    const result = await checkPage(browser, pageConfig)
    results.push(result)
    if (result.overflowX > 1) {
      failures.push(`${result.name}: horizontal overflow ${result.overflowX}px`)
    }
    if (result.unexpectedWideElements.length > 0) {
      failures.push(`${result.name}: wide elements ${result.unexpectedWideElements.map(describeWideElement).join("; ")}`)
    }
    if (result.missingSelectors.length > 0) {
      failures.push(`${result.name}: missing selectors ${result.missingSelectors.join(", ")}`)
    }
    if (result.missingLocalStoragePrefix) {
      failures.push(`${result.name}: missing localStorage key prefix ${result.missingLocalStoragePrefix}`)
    }
    if (result.homeLayout?.violations.length > 0) {
      failures.push(`${result.name}: home layout gaps ${result.homeLayout.violations.join("; ")}`)
    }
  }
} finally {
  await browser.close()
}

for (const result of results) {
  console.log(`${result.name}: ok (${result.pathname}, ${result.scrollHeight}px tall, overflow ${result.overflowX}px)`)
}

if (failures.length > 0) {
  console.error(`\nMobile layout checks failed:\n- ${failures.join("\n- ")}`)
  process.exit(1)
}

console.log("Mobile layout checks passed.")
