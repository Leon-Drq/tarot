import { chromium } from "playwright"

const baseUrl = (process.env.PWA_CHECK_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")

function absolute(path) {
  return new URL(path, baseUrl).toString()
}

function fail(message) {
  throw new Error(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

async function fetchText(path, accept = "text/plain,*/*") {
  const response = await fetch(absolute(path), {
    headers: { Accept: accept },
    cache: "no-store",
  })
  const body = await response.text()
  if (!response.ok) fail(`${path} returned HTTP ${response.status}: ${body.slice(0, 120)}`)
  return { response, body }
}

const manifestResult = await fetchText("/manifest.webmanifest", "application/manifest+json,application/json,*/*")
const manifest = JSON.parse(manifestResult.body)
assert(manifest.name === "POPTarot - Free AI Tarot Reading", "manifest product name must stay free-first")
assert(manifest.display === "standalone", "manifest display must be standalone")
assert(manifest.start_url?.includes("utm_source=pwa"), "manifest start_url must include PWA attribution")
assert(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.src === "/icon-512x512.png"), "manifest must include 512px icon")
assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.some((item) => item.url?.startsWith("/daily-tarot")), "manifest must include Daily Tarot shortcut")

const serviceWorkerResult = await fetchText("/sw.js", "text/javascript,application/javascript,*/*")
const serviceWorkerType = serviceWorkerResult.response.headers.get("content-type") || ""
assert(/javascript|text\/plain/.test(serviceWorkerType), `/sw.js content-type should be JavaScript-like, received ${serviceWorkerType}`)
for (const needle of [
  "self.addEventListener(\"install\"",
  "self.addEventListener(\"activate\"",
  "self.addEventListener(\"fetch\"",
  "PRIVATE_PATH_PREFIXES",
  "\"/api/\"",
  "\"/daily-tarot\"",
]) {
  assert(serviceWorkerResult.body.includes(needle), `/sw.js missing ${needle}`)
}

const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({
    serviceWorkers: "allow",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.route("**/api/analytics/event", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.goto(absolute("/daily-tarot?utm_source=pwa_check&utm_medium=installability"), {
    waitUntil: "networkidle",
    timeout: 45_000,
  })

  const registration = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return null
    const ready = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((resolve) => window.setTimeout(() => resolve(null), 10_000)),
    ])
    if (!ready) return null
    return {
      scope: ready.scope,
      activeScript: ready.active?.scriptURL || "",
      controller: Boolean(navigator.serviceWorker.controller),
    }
  })

  assert(registration?.scope === `${baseUrl}/`, `service worker scope should be ${baseUrl}/`)
  assert(registration.activeScript === absolute("/sw.js"), "service worker active script should be /sw.js")

  await page.goto(absolute("/?utm_source=pwa_check&utm_medium=home_install"), {
    waitUntil: "networkidle",
    timeout: 45_000,
  })
  const homeInstall = await page.evaluate(() => ({
    panel: Boolean(document.querySelector("[data-home-daily-return-panel]")),
    install: Boolean(document.querySelector("[data-home-pwa-install]")),
  }))
  assert(homeInstall.panel, "homepage must show Daily Tarot return panel")
  assert(homeInstall.install, "homepage Daily Tarot return panel must expose PWA install action")
  await context.close()
} finally {
  await browser.close()
}

console.log(`PWA installability checks passed for ${baseUrl}`)
