import { chromium } from "playwright"

const baseUrl = process.env.MOBILE_CHECK_BASE_URL || "http://localhost:3000"

const pages = [
  {
    path: "/",
    name: "home",
    requiredSelectors: ["[data-home-card]", "[data-home-question-form]", "[data-home-daily-return-panel]"],
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
    requiredSelectors: ["[data-home-header]", "[data-home-card]", "[data-home-question-form]", "[data-home-daily-return-panel]"],
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
    requiredSelectors: ["[data-daily-tarot-tool]", "[data-daily-sticky-cta]", "[data-daily-quick-actions]", "[data-daily-direct-return-actions]"],
  },
  {
    path: "/daily-tarot?return_focus=Will%20my%20ex%20come%20back%20tarot&utm_source=seo&utm_medium=question_return_loop&utm_campaign=will-my-ex-come-back-tarot",
    name: "daily tarot linked return focus",
    requiredSelectors: ["[data-daily-tarot-tool]", "[data-daily-linked-return-focus]", "[data-daily-linked-return-focus-edit]", "[data-daily-direct-return-actions]"],
    requiredLocalStorageKeyPrefix: "poptarot_daily_return_",
  },
  {
    path: "/tarot-questions?q=love",
    name: "tarot questions",
    requiredSelectors: ["main", "[data-question-search-results]"],
  },
  {
    path: "/will-my-ex-come-back-tarot",
    name: "long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]", "[data-seo-question-share]", "[data-seo-reader-trust]"],
  },
  {
    path: "/should-i-move-on-tarot",
    name: "new breakup long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]", "[data-seo-question-share]", "[data-seo-reader-trust]"],
  },
  {
    path: "/es/mi-ex-volvera-tarot",
    name: "Spanish long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]", "[data-seo-question-share]", "[data-seo-reader-trust]"],
  },
  {
    path: "/pt-br/meu-ex-vai-voltar-tarot",
    name: "Portuguese long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]", "[data-seo-question-share]", "[data-seo-reader-trust]"],
  },
  {
    path: "/tarot-card-meanings/the-fool",
    name: "card meaning",
    requiredSelectors: ["[data-tarot-card-meaning-page]", "[data-card-sticky-cta]", "[data-card-neighbor-nav]"],
  },
  {
    path: "/es/tarot-card-meanings/the-fool",
    name: "Spanish card meaning",
    requiredSelectors: ["[data-tarot-card-meaning-page]", "[data-card-sticky-cta]", "[data-card-neighbor-nav]"],
  },
  {
    path: "/pt-br/tarot-card-meanings/the-fool",
    name: "Portuguese card meaning",
    requiredSelectors: ["[data-tarot-card-meaning-page]", "[data-card-sticky-cta]", "[data-card-neighbor-nav]"],
  },
  {
    path: "/free-tarot-tools",
    name: "free tools",
    requiredSelectors: ["[data-free-tools-quick-start-start]", "[data-free-tools-social-proof]"],
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
  await page.waitForTimeout(500)

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
        nav: "[data-home-secondary-nav]",
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
        { name: "form to daily panel", gap: rects.daily.top - rects.form.bottom, min: 16 },
        { name: "daily panel to secondary nav", gap: rects.nav.top - rects.daily.bottom, min: 16 },
        { name: "secondary nav to scroll content", gap: rects.scroll.top - rects.nav.bottom, min: 56 },
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
