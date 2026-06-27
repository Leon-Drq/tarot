const rootUrl = (
  process.env.SEARCH_ASSET_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://poptarot.com"
).replace(/\/$/, "")

const canonicalUrl = (process.env.SEARCH_ASSET_CANONICAL_URL || process.env.NEXT_PUBLIC_APP_URL || "https://poptarot.com").replace(
  /\/$/,
  "",
)

const requiredAssets = [
  { path: "/favicon.ico", contentType: "image/" },
  { path: "/favicon.png", contentType: "image/png" },
  { path: "/favicon-16x16.png", contentType: "image/png" },
  { path: "/favicon-32x32.png", contentType: "image/png" },
  { path: "/favicon-48x48.png", contentType: "image/png" },
  { path: "/favicon-96x96.png", contentType: "image/png" },
  { path: "/apple-touch-icon.png", contentType: "image/png" },
  { path: "/logo.png", contentType: "image/png" },
  { path: "/logo.svg", contentType: "image/svg+xml" },
  { path: "/icon.svg", contentType: "image/svg+xml" },
  { path: "/manifest.webmanifest", contentType: "application/manifest+json" },
  { path: "/site.webmanifest", contentType: "application/manifest+json" },
  { path: "/og-image.jpg", contentType: "image/jpeg" },
]

const requiredSitemapPaths = [
  "/",
  "/free-tarot-tools",
  "/daily-tarot",
  "/tarot-questions",
  "/tarot-spreads",
  "/tarot-card-meanings",
  "/will-my-ex-come-back-tarot",
  "/does-he-love-me-tarot",
  "/does-she-love-me-tarot",
  "/yes-or-no-tarot-love",
  "/career-tarot-reading",
  "/should-i-quit-my-job-tarot",
  "/no-contact-tarot-reading",
  "/does-no-contact-work-tarot",
  "/will-my-ex-reach-out-tarot",
  "/should-i-stay-or-leave-tarot",
  "/should-i-give-him-another-chance-tarot",
  "/es/mi-ex-volvera-tarot",
  "/pt-br/meu-ex-vai-voltar-tarot",
  "/about",
  "/official-channels",
  "/brand-assets",
  "/editorial-policy",
  "/ai-tarot-disclaimer",
  "/privacy",
  "/reviews",
  "/tarot-reading-examples",
]

const blockedSitemapPaths = ["/input", "/reading", "/reveal", "/loading-reading", "/profile", "/analytics"]
const robotsDisallows = ["/api/", "/auth/", "/profile", "/input", "/reading", "/reveal", "/loading-reading", "/analytics"]
const publicRobotsPaths = ["/", "/free-tarot-tools", "/daily-tarot", "/tarot-questions", "/brand-assets", "/reviews"]

function absolute(path) {
  return new URL(path, rootUrl).toString()
}

function canonical(path) {
  return new URL(path, canonicalUrl).toString()
}

function fail(message) {
  throw new Error(message)
}

async function fetchText(path) {
  const response = await fetch(absolute(path), {
    headers: { Accept: "text/plain,application/xml,text/html,*/*" },
    cache: "no-store",
  })
  const body = await response.text()
  if (!response.ok) fail(`${path} returned HTTP ${response.status}: ${body.slice(0, 120)}`)
  return { response, body }
}

async function checkAsset({ path, contentType }) {
  const response = await fetch(absolute(path), {
    method: "HEAD",
    cache: "no-store",
  })
  if (!response.ok) fail(`${path} returned HTTP ${response.status}`)

  const actualType = response.headers.get("content-type") || ""
  const isIconFallback = path.endsWith(".ico") && actualType.includes("image/vnd.microsoft.icon")
  if (!actualType.includes(contentType) && !isIconFallback) {
    fail(`${path} returned content-type ${actualType || "(missing)"}, expected ${contentType}`)
  }

  const cacheControl = response.headers.get("cache-control") || ""
  if (!cacheControl.includes("max-age=31536000") || !cacheControl.includes("immutable")) {
    fail(`${path} returned cache-control ${cacheControl || "(missing)"}, expected one-year immutable cache`)
  }

  const robotsTag = response.headers.get("x-robots-tag") || ""
  if (!robotsTag.includes("index") || !robotsTag.includes("follow")) {
    fail(`${path} returned x-robots-tag ${robotsTag || "(missing)"}, expected index, follow`)
  }

  return { path, contentType: actualType, cacheControl, robotsTag }
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`${label} missing: ${needle}`)
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) fail(`${label} should not include: ${needle}`)
}

function robotsLines(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

try {
  const [sitemapResult, robotsResult, homeResult, brandResult, ...assetResults] = await Promise.all([
    fetchText("/sitemap.xml"),
    fetchText("/robots.txt"),
    fetchText("/"),
    fetchText("/brand-assets"),
    ...requiredAssets.map(checkAsset),
  ])

  const sitemap = sitemapResult.body
  const robots = robotsResult.body
  const home = homeResult.body
  const brand = brandResult.body
  const robotRules = robotsLines(robots)

  for (const path of requiredSitemapPaths) {
    assertIncludes(sitemap, `<loc>${canonical(path)}</loc>`, `sitemap loc ${path}`)
  }

  for (const path of blockedSitemapPaths) {
    assertNotIncludes(sitemap, `<loc>${canonical(path)}</loc>`, `sitemap private flow ${path}`)
  }

  for (const snippet of [
    `hreflang="x-default" href="${canonical("/daily-tarot")}"`,
    `hreflang="es" href="${canonical("/es/mi-ex-volvera-tarot")}"`,
    `hreflang="pt-br" href="${canonical("/pt-br/meu-ex-vai-voltar-tarot")}"`,
    `hreflang="x-default" href="${canonical("/will-my-ex-come-back-tarot")}"`,
  ]) {
    assertIncludes(sitemap, snippet, "sitemap hreflang")
  }

  assertIncludes(robots, `Sitemap: ${canonical("/sitemap.xml")}`, "robots sitemap")
  for (const path of robotsDisallows) {
    if (!robotRules.includes(`Disallow: ${path}`)) {
      fail(`robots disallow ${path} missing: Disallow: ${path}`)
    }
  }
  for (const path of publicRobotsPaths) {
    if (robotRules.includes(`Disallow: ${path}`)) {
      fail(`robots public path ${path} should not include exact rule: Disallow: ${path}`)
    }
  }
  if (!robotRules.includes("User-Agent: Googlebot-Image")) {
    fail("robots Googlebot-Image brand asset rule missing")
  }
  for (const path of [
    "/favicon.ico",
    "/favicon.png",
    "/favicon-48x48.png",
    "/favicon-96x96.png",
    "/logo.png",
    "/logo.svg",
    "/og-image.jpg",
  ]) {
    if (!robotRules.includes(`Allow: ${path}`)) {
      fail(`robots Googlebot-Image allow missing: Allow: ${path}`)
    }
  }

  for (const snippet of [
    "/favicon.png",
    "/favicon-48x48.png",
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/manifest.webmanifest",
    "/og-image.jpg",
    `${canonicalUrl}/logo.png`,
  ]) {
    assertIncludes(home, snippet, `homepage search asset ${snippet}`)
  }
  for (const snippet of ["favicon-48x48.png?v=", "favicon-96x96.png?v=", "favicon.ico?v="]) {
    assertNotIncludes(home, snippet, `homepage stable favicon URL ${snippet}`)
  }

  for (const snippet of [
    "96 x 96 search favicon",
    "/favicon.ico",
    "/icon.svg",
    "/og-image.jpg",
  ]) {
    assertIncludes(brand, snippet, `brand assets page signal ${snippet}`)
  }

  console.log(`check-search-assets: ${rootUrl} canonical ${canonicalUrl}`)
  for (const result of assetResults) {
    console.log(`${result.path.padEnd(26)} ${result.contentType} ${result.cacheControl}`)
  }
  console.log(`sitemap paths checked       ${requiredSitemapPaths.length}`)
  console.log("Search asset checks passed.")
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
