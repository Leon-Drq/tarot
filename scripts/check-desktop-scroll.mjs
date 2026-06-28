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
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
    }))

    results.push({ ...pageConfig, ...result })
    if (result.scrollHeight <= result.clientHeight + pageConfig.minScrollY) {
      failures.push(`${pageConfig.name}: page is not tall enough to verify wheel scrolling`)
    }
    if (result.scrollY < pageConfig.minScrollY) {
      failures.push(`${pageConfig.name}: mouse wheel only moved to ${result.scrollY}px`)
    }
    if (result.htmlOverscrollY === "none" || result.bodyOverscrollY === "none") {
      failures.push(`${pageConfig.name}: vertical overscroll is locked`)
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
