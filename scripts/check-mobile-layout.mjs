import { chromium } from "playwright"

const baseUrl = process.env.MOBILE_CHECK_BASE_URL || "http://localhost:3000"

const pages = [
  {
    path: "/",
    name: "home",
    requiredSelectors: ["[data-home-card]", "[data-home-question-form]", "[data-home-daily-return-panel]"],
    allowedWideSelector: "mix-blend-color-dodge",
  },
  {
    path: "/daily-tarot",
    name: "daily tarot",
    requiredSelectors: ["[data-daily-tarot-tool]", "[data-daily-sticky-cta]", "[data-daily-quick-actions]"],
  },
  {
    path: "/tarot-questions?q=love",
    name: "tarot questions",
    requiredSelectors: ["main", "[data-question-search-results]"],
  },
  {
    path: "/will-my-ex-come-back-tarot",
    name: "long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]"],
  },
  {
    path: "/es/mi-ex-volvera-tarot",
    name: "Spanish long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]"],
  },
  {
    path: "/pt-br/meu-ex-vai-voltar-tarot",
    name: "Portuguese long-tail question",
    requiredSelectors: ["[data-seo-question-tool-entry]", "[data-question-result-preview]"],
  },
  {
    path: "/tarot-card-meanings/the-fool",
    name: "card meaning",
    requiredSelectors: ["[data-tarot-card-meaning-page]", "[data-card-sticky-cta]"],
  },
  {
    path: "/es/tarot-card-meanings/the-fool",
    name: "Spanish card meaning",
    requiredSelectors: ["[data-tarot-card-meaning-page]", "[data-card-sticky-cta]"],
  },
  {
    path: "/free-tarot-tools",
    name: "free tools",
    requiredSelectors: ["[data-free-tools-quick-start-start]", "[data-free-tools-social-proof]"],
  },
  {
    path: "/about",
    name: "about trust page",
    requiredSelectors: ["main", "[data-trust-page]"],
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

  const result = await page.evaluate((requiredSelectors) => {
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

    return {
      pathname: window.location.pathname,
      title: document.title,
      overflowX: document.documentElement.scrollWidth - viewportWidth,
      scrollHeight: document.documentElement.scrollHeight,
      missingSelectors,
      wideElements,
    }
  }, pageConfig.requiredSelectors)

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
