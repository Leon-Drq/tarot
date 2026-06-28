import { chromium } from "playwright"

const baseUrl = process.env.DESKTOP_SCROLL_BASE_URL || "http://localhost:3000"

const pages = [
  { path: "/", name: "home", minScrollY: 240 },
  { path: "/daily-tarot", name: "daily tarot", minScrollY: 240 },
  { path: "/about", name: "about", minScrollY: 240 },
]

const viewports = [
  { name: "large desktop", width: 1440, height: 900 },
  { name: "short desktop", width: 1280, height: 720 },
  { name: "compact desktop", width: 1024, height: 768 },
  { name: "narrow desktop", width: 907, height: 778 },
]

function absoluteUrl(path) {
  return new URL(path, baseUrl).toString()
}

const browser = await chromium.launch()
const results = []
const failures = []

try {
  for (const pageConfig of pages) {
    for (const viewport of viewports) {
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
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
        homeSecondaryNavTop: document.querySelector("[data-home-secondary-nav]")
          ? Math.round(document.querySelector("[data-home-secondary-nav]").getBoundingClientRect().top)
          : null,
        homeSecondaryNavBottom: document.querySelector("[data-home-secondary-nav]")
          ? Math.round(document.querySelector("[data-home-secondary-nav]").getBoundingClientRect().bottom)
          : null,
      }))

      await page.mouse.move(Math.round(viewport.width / 2), Math.round(viewport.height / 2))
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

      const label = `${pageConfig.name} ${viewport.name} (${viewport.width}x${viewport.height})`
      results.push({ ...pageConfig, viewport: viewport.name, ...initialResult, ...result })
      if (result.scrollHeight <= result.clientHeight + pageConfig.minScrollY) {
        failures.push(`${label}: page is not tall enough to verify wheel scrolling`)
      }
      if (result.scrollY < pageConfig.minScrollY) {
        failures.push(`${label}: mouse wheel only moved to ${result.scrollY}px`)
      }
      if (result.htmlOverscrollY === "none" || result.bodyOverscrollY === "none") {
        failures.push(`${label}: vertical overscroll is locked`)
      }
      if (pageConfig.path === "/" && result.homeStageOverflowY !== "visible") {
        failures.push(`${label}: home stage should not create a nested vertical scroll container`)
      }
      if (pageConfig.path === "/" && !["clip", "visible"].includes(result.homeShellOverflowX)) {
        failures.push(`${label}: home hero shell should clip horizontal visuals without creating sideways scroll`)
      }
      if (pageConfig.path === "/" && result.homeShellOverflowY !== "visible") {
        failures.push(`${label}: home hero shell must not clip vertical page content`)
      }
      if (pageConfig.path === "/" && initialResult.homeQuestionFormBottom > result.clientHeight - 24) {
        failures.push(`${label}: homepage question form is clipped below the desktop viewport`)
      }
      if (pageConfig.path === "/" && (!initialResult.homeScrollCueBottom || initialResult.homeScrollCueBottom > result.clientHeight + 4)) {
        failures.push(`${label}: homepage scroll cue is not visible in the desktop viewport`)
      }
      if (pageConfig.path === "/" && initialResult.homeDailyPanelTop <= initialResult.homeQuestionFormBottom) {
        failures.push(`${label}: daily return panel should sit below the first-screen question form`)
      }
      if (pageConfig.path === "/" && initialResult.homeScrollContentTop > result.clientHeight + 260) {
        failures.push(`${label}: scroll content starts too far below the desktop viewport`)
      }
      if (pageConfig.path === "/" && initialResult.homeScrollContentTop >= result.clientHeight) {
        failures.push(`${label}: no next-section hint is visible in the desktop viewport`)
      }
      if (
        pageConfig.path === "/" &&
        initialResult.homeSecondaryNavTop &&
        initialResult.homeScrollCueBottom &&
        initialResult.homeSecondaryNavTop < initialResult.homeScrollCueBottom + 4
      ) {
        failures.push(`${label}: desktop next-section nav overlaps the scroll cue`)
      }

      await page.close()
    }
  }
} finally {
  await browser.close()
}

for (const result of results) {
  console.log(
    `${result.name} ${result.viewport}: ok (${result.pathname}, y ${result.scrollY}px, height ${result.scrollHeight}px, scrollbar ${result.scrollbarWidth}px)`,
  )
}

if (failures.length > 0) {
  console.error(`\nDesktop scroll checks failed:\n- ${failures.join("\n- ")}`)
  process.exit(1)
}

console.log("Desktop scroll checks passed.")
