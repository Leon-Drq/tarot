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
  { name: "very short desktop", width: 1180, height: 680 },
  { name: "browser chrome desktop", width: 1536, height: 746 },
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
      await page.goto(absoluteUrl(pageConfig.path), { waitUntil: "domcontentloaded", timeout: 45_000 })
      await page.locator("body").waitFor({ state: "visible", timeout: 15_000 })
      await page.waitForTimeout(250)

      const initialResult = await page.evaluate(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector)
          if (!element) return null
          const bounds = element.getBoundingClientRect()
          return {
            top: Math.round(bounds.top),
            right: Math.round(bounds.right),
            bottom: Math.round(bounds.bottom),
            left: Math.round(bounds.left),
          }
        }
        const questionForm = rect("[data-home-question-form]")
        const scrollCue = rect("[data-home-scroll-cue]")
        const scrollAffordance = rect("[data-home-scroll-affordance]")
        const dailyPanel = rect("[data-home-daily-return-panel]")
        const scrollContent = rect("[data-home-scroll-content]")
        const secondaryNav = rect("[data-home-secondary-nav]")

        return {
          homeQuestionFormBottom: questionForm?.bottom ?? null,
          homeScrollCueBottom: scrollCue?.bottom ?? null,
          homeScrollAffordanceTop: scrollAffordance?.top ?? null,
          homeScrollAffordanceBottom: scrollAffordance?.bottom ?? null,
          homeDailyPanelTop: dailyPanel?.top ?? null,
          homeScrollContentTop: scrollContent?.top ?? null,
          homeSecondaryNavTop: secondaryNav?.top ?? null,
          homeSecondaryNavBottom: secondaryNav?.bottom ?? null,
        }
      })

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
      const hasVisibleScrollCue =
        Boolean(initialResult.homeScrollCueBottom && initialResult.homeScrollCueBottom <= result.clientHeight + 4) ||
        Boolean(
          initialResult.homeScrollAffordanceTop !== null &&
            initialResult.homeScrollAffordanceBottom !== null &&
            initialResult.homeScrollAffordanceTop >= 0 &&
            initialResult.homeScrollAffordanceBottom <= result.clientHeight - 4,
        )
      if (pageConfig.path === "/" && !hasVisibleScrollCue) {
        failures.push(`${label}: homepage scroll cue or desktop affordance is not visible in the desktop viewport`)
      }
      if (pageConfig.path === "/" && initialResult.homeDailyPanelTop <= initialResult.homeQuestionFormBottom) {
        failures.push(`${label}: daily return panel should sit below the first-screen question form`)
      }
      if (pageConfig.path === "/" && initialResult.homeScrollContentTop > result.clientHeight + 260) {
        failures.push(`${label}: scroll content starts too far below the desktop viewport`)
      }
      if (pageConfig.path === "/" && initialResult.homeScrollContentTop >= result.clientHeight && !hasVisibleScrollCue) {
        failures.push(`${label}: no next-section hint is visible in the desktop viewport`)
      }
      if (
        pageConfig.path === "/" &&
        initialResult.homeSecondaryNavTop &&
        initialResult.homeScrollCueBottom &&
        initialResult.homeScrollCueBottom <= result.clientHeight + 4 &&
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
