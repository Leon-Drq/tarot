import { chromium } from "playwright"

const baseUrl = process.env.DESKTOP_SCROLL_BASE_URL || "http://localhost:3000"

const pages = [
  { path: "/", name: "home", minScrollY: 240 },
  { path: "/daily-tarot", name: "daily tarot", minScrollY: 240 },
  { path: "/about", name: "about", minScrollY: 240 },
]

function absoluteUrl(path) {
  return new URL(path, baseUrl).toString()
}

const browser = await chromium.launch()
const results = []
const failures = []

try {
  for (const pageConfig of pages) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })
    await page.goto(absoluteUrl(pageConfig.path), { waitUntil: "networkidle", timeout: 45_000 })

    const initialResult = await page.evaluate(() => ({
      homeQuestionFormBottom: document.querySelector("[data-home-question-form]")
        ? Math.round(document.querySelector("[data-home-question-form]").getBoundingClientRect().bottom)
        : null,
      homeScrollCueBottom: document.querySelector("[data-home-scroll-cue]")
        ? Math.round(document.querySelector("[data-home-scroll-cue]").getBoundingClientRect().bottom)
        : null,
      homeDailyPanelTop: document.querySelector("[data-home-daily-return-panel]")
        ? Math.round(document.querySelector("[data-home-daily-return-panel]").getBoundingClientRect().top)
        : null,
      homeScrollContentTop: document.querySelector("[data-home-scroll-content]")
        ? Math.round(document.querySelector("[data-home-scroll-content]").getBoundingClientRect().top)
        : null,
    }))

    await page.mouse.move(720, 450)
    await page.mouse.wheel(0, 1200)
    await page.waitForTimeout(250)

    const result = await page.evaluate(() => ({
      pathname: window.location.pathname,
      scrollY: Math.round(window.scrollY),
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      htmlOverscrollY: getComputedStyle(document.documentElement).overscrollBehaviorY,
      bodyOverscrollY: getComputedStyle(document.body).overscrollBehaviorY,
      homeStageOverflowY: document.querySelector(".home-hero-stage")
        ? getComputedStyle(document.querySelector(".home-hero-stage")).overflowY
        : null,
      homeShellOverflow: document.querySelector("[data-home-hero-shell]")
        ? getComputedStyle(document.querySelector("[data-home-hero-shell]")).overflow
        : null,
      homeShellOverflowX: document.querySelector("[data-home-hero-shell]")
        ? getComputedStyle(document.querySelector("[data-home-hero-shell]")).overflowX
        : null,
      homeShellOverflowY: document.querySelector("[data-home-hero-shell]")
        ? getComputedStyle(document.querySelector("[data-home-hero-shell]")).overflowY
        : null,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
    }))

    results.push({ ...pageConfig, ...initialResult, ...result })
    if (result.scrollHeight <= result.clientHeight + pageConfig.minScrollY) {
      failures.push(`${pageConfig.name}: page is not tall enough to verify wheel scrolling`)
    }
    if (result.scrollY < pageConfig.minScrollY) {
      failures.push(`${pageConfig.name}: mouse wheel only moved to ${result.scrollY}px`)
    }
    if (result.htmlOverscrollY === "none" || result.bodyOverscrollY === "none") {
      failures.push(`${pageConfig.name}: vertical overscroll is locked`)
    }
    if (pageConfig.path === "/" && result.homeStageOverflowY !== "visible") {
      failures.push(`${pageConfig.name}: home stage should not create a nested vertical scroll container`)
    }
    if (pageConfig.path === "/" && !["clip", "visible"].includes(result.homeShellOverflowX)) {
      failures.push(`${pageConfig.name}: home hero shell should clip horizontal visuals without creating sideways scroll`)
    }
    if (pageConfig.path === "/" && result.homeShellOverflowY !== "visible") {
      failures.push(`${pageConfig.name}: home hero shell must not clip vertical page content`)
    }
    if (pageConfig.path === "/" && initialResult.homeQuestionFormBottom > result.clientHeight - 24) {
      failures.push(`${pageConfig.name}: homepage question form is clipped below the desktop viewport`)
    }
    if (pageConfig.path === "/" && (!initialResult.homeScrollCueBottom || initialResult.homeScrollCueBottom > result.clientHeight + 4)) {
      failures.push(`${pageConfig.name}: homepage scroll cue is not visible in the desktop viewport`)
    }
    if (pageConfig.path === "/" && initialResult.homeDailyPanelTop <= initialResult.homeQuestionFormBottom) {
      failures.push(`${pageConfig.name}: daily return panel should sit below the first-screen question form`)
    }
    if (pageConfig.path === "/" && initialResult.homeScrollContentTop > result.clientHeight + 260) {
      failures.push(`${pageConfig.name}: scroll content starts too far below the desktop viewport`)
    }

    await page.close()
  }
} finally {
  await browser.close()
}

for (const result of results) {
  console.log(
    `${result.name}: ok (${result.pathname}, y ${result.scrollY}px, height ${result.scrollHeight}px, scrollbar ${result.scrollbarWidth}px)`,
  )
}

if (failures.length > 0) {
  console.error(`\nDesktop scroll checks failed:\n- ${failures.join("\n- ")}`)
  process.exit(1)
}

console.log("Desktop scroll checks passed.")
