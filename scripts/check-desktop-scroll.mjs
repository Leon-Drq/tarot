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
      if (pageConfig.path === "/") {
        await page
          .waitForFunction(() => {
            const cue = document.querySelector("[data-home-scroll-cue]")
            const content = document.querySelector("[data-home-scroll-content]")
            const stage = document.querySelector(".home-hero-stage")
            const form = document.querySelector("[data-home-question-form]")
            return Boolean(cue && content && stage && form)
          }, null, { timeout: 5_000 })
          .catch(() => {})
      }
      await page.waitForTimeout(pageConfig.path === "/" ? 750 : 250)

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
            width: Math.round(bounds.width),
            height: Math.round(bounds.height),
          }
        }
        const center = (selector) => {
          const element = document.querySelector(selector)
          if (!element) return null
          const bounds = element.getBoundingClientRect()
          return {
            x: Math.round(bounds.left + bounds.width / 2),
            y: Math.round(bounds.top + bounds.height / 2),
          }
        }
        const heroCopy = rect("[data-home-hero-copy]")
        const heroCard = rect("[data-home-card]")
        const heroCardCenter = center("[data-home-card]")
        const heroGlowCenter = center("[data-home-focal-glow]")
        const questionForm = rect("[data-home-question-form]")
        const primaryCta = rect("[data-home-hero-primary-cta]")
        const scrollCue = rect("[data-home-scroll-cue]")
        const dailyPanel = rect("[data-home-daily-return-panel]")
        const scrollContent = rect("[data-home-scroll-content]")
        const desktopNav = rect("[data-home-header] nav")
        const membership = rect("[data-home-membership]")
        const cardRotator = document.querySelector("[data-home-card-rotator]")
        const cardAnimationStyle = cardRotator ? getComputedStyle(cardRotator) : null

        return {
          homeHeroCopyBottom: heroCopy?.bottom ?? null,
          homeHeroCardTop: heroCard?.top ?? null,
          homeHeroCardBottom: heroCard?.bottom ?? null,
          homeHeroCardCenter: heroCardCenter,
          homeHeroGlowCenter: heroGlowCenter,
          homeCardAnimationName: cardAnimationStyle?.animationName ?? null,
          homeCardAnimationDuration: cardAnimationStyle?.animationDuration ?? null,
          homeCardAnimationTimingFunction: cardAnimationStyle?.animationTimingFunction ?? null,
          homeQuestionFormTop: questionForm?.top ?? null,
          homeQuestionFormBottom: questionForm?.bottom ?? null,
          homePrimaryCtaBottom: primaryCta?.bottom ?? null,
          homeScrollCueBottom: scrollCue?.bottom ?? null,
          homeDailyPanelTop: dailyPanel?.top ?? null,
          homeScrollContentTop: scrollContent?.top ?? null,
          homeDesktopNavWidth: desktopNav?.width ?? null,
          homeMembershipTop: membership?.top ?? null,
        }
      })

      let clickResult = null
      if (pageConfig.path === "/") {
        await page.locator("[data-home-scroll-cue]").click({ timeout: 5_000 })
        await page.waitForTimeout(700)
        clickResult = await page.evaluate(() => {
          const content = document.querySelector("[data-home-scroll-content]")
          const bounds = content?.getBoundingClientRect()
          return {
            hash: window.location.hash,
            scrollY: Math.round(window.scrollY),
            contentTop: bounds ? Math.round(bounds.top) : null,
          }
        })
        await page.evaluate(() => {
          window.history.replaceState(null, "", window.location.pathname + window.location.search)
          window.scrollTo(0, 0)
        })
        await page.waitForTimeout(250)
      }

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
      if (pageConfig.path === "/" && initialResult.homePrimaryCtaBottom > result.clientHeight - 12) {
        failures.push(`${label}: homepage primary CTA is clipped below the desktop viewport`)
      }
      if (
        pageConfig.path === "/" &&
        initialResult.homeHeroCopyBottom !== null &&
        initialResult.homeHeroCardTop !== null &&
        initialResult.homeHeroCopyBottom > initialResult.homeHeroCardTop - 4
      ) {
        failures.push(
          `${label}: homepage hero copy overlaps the tarot card ` +
            `(copy bottom ${initialResult.homeHeroCopyBottom}, card top ${initialResult.homeHeroCardTop})`,
        )
      }
      if (
        pageConfig.path === "/" &&
        initialResult.homeHeroCardBottom !== null &&
        initialResult.homeQuestionFormTop !== null &&
        initialResult.homeQuestionFormTop < initialResult.homeHeroCardBottom + 4
      ) {
        failures.push(
          `${label}: homepage question form sits too close to the tarot card ` +
            `(form top ${initialResult.homeQuestionFormTop}, card bottom ${initialResult.homeHeroCardBottom})`,
        )
      }
      if (
        pageConfig.path === "/" &&
        initialResult.homeHeroCardCenter &&
        initialResult.homeHeroGlowCenter &&
        (Math.abs(initialResult.homeHeroCardCenter.x - initialResult.homeHeroGlowCenter.x) > 3 ||
          Math.abs(initialResult.homeHeroCardCenter.y - initialResult.homeHeroGlowCenter.y) > 3)
      ) {
        failures.push(
          `${label}: homepage tarot card is not centered on the focal glow ` +
            `(card ${initialResult.homeHeroCardCenter.x},${initialResult.homeHeroCardCenter.y}; ` +
            `glow ${initialResult.homeHeroGlowCenter.x},${initialResult.homeHeroGlowCenter.y})`,
        )
      }
      if (pageConfig.path === "/" && initialResult.homeCardAnimationName !== "rotateCard") {
        failures.push(`${label}: homepage tarot card should use rotateCard animation`)
      }
      if (pageConfig.path === "/" && initialResult.homeCardAnimationTimingFunction !== "linear") {
        failures.push(
          `${label}: homepage tarot card rotation should be linear, got ${initialResult.homeCardAnimationTimingFunction}`,
        )
      }
      if (pageConfig.path === "/" && initialResult.homeCardAnimationDuration !== "16s") {
        failures.push(
          `${label}: homepage tarot card rotation should run at a steady 16s cycle, got ${initialResult.homeCardAnimationDuration}`,
        )
      }
      const hasVisibleScrollCue = Boolean(
        initialResult.homeScrollCueBottom && initialResult.homeScrollCueBottom <= result.clientHeight + 4,
      )
      if (pageConfig.path === "/" && !hasVisibleScrollCue) {
        failures.push(`${label}: homepage scroll cue is not visible in the desktop viewport`)
      }
      if (pageConfig.path === "/" && (!clickResult || clickResult.scrollY < pageConfig.minScrollY)) {
        failures.push(`${label}: desktop scroll cue click only moved to ${clickResult?.scrollY ?? "unknown"}px`)
      }
      if (pageConfig.path === "/" && clickResult?.hash !== "#home-free-paths") {
        failures.push(`${label}: desktop scroll cue click should preserve the #home-free-paths hash`)
      }
      if (pageConfig.path === "/" && initialResult.homeDailyPanelTop <= initialResult.homeQuestionFormBottom) {
        failures.push(`${label}: daily return panel should sit below the first-screen question form`)
      }
      const nextSectionPeek = 24
      const hasNextSectionHint =
        Boolean(initialResult.homeScrollContentTop !== null && initialResult.homeScrollContentTop <= result.clientHeight - nextSectionPeek) ||
        Boolean(initialResult.homeDailyPanelTop !== null && initialResult.homeDailyPanelTop <= result.clientHeight - 8) ||
        hasVisibleScrollCue

      if (pageConfig.path === "/" && !hasNextSectionHint) {
        failures.push(
          `${label}: homepage next section must be visible enough to make desktop scrolling obvious ` +
            `(content top ${initialResult.homeScrollContentTop}, daily top ${initialResult.homeDailyPanelTop}, viewport ${result.clientHeight})`,
        )
      }
      if (pageConfig.path === "/" && initialResult.homeScrollContentTop >= result.clientHeight && !hasVisibleScrollCue) {
        failures.push(`${label}: no next-section hint is visible in the desktop viewport`)
      }
      if (pageConfig.path === "/" && viewport.width >= 1024 && (initialResult.homeDesktopNavWidth ?? 0) < 200) {
        failures.push(`${label}: desktop primary navigation is not visible`)
      }
      if (pageConfig.path === "/" && initialResult.homeMembershipTop === null) {
        failures.push(`${label}: membership section is missing`)
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
