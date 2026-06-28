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
  { path: "/search-favicon.png", contentType: "image/png" },
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

const crawlerRefreshAssetPaths = new Set([
  "/search-favicon.png",
  "/favicon.ico",
  "/favicon.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-48x48.png",
  "/favicon-96x96.png",
])

const requiredSitemapPaths = [
  "/",
  "/free-tarot-tools",
  "/es/herramientas-tarot-gratis",
  "/pt-br/ferramentas-tarot-gratis",
  "/daily-tarot",
  "/tarot-questions",
  "/tarot-spreads",
  "/one-card-tarot-reading",
  "/three-card-tarot-reading",
  "/past-present-future-tarot",
  "/tarot-card-meanings",
  "/tarot-card-combinations",
  "/es/combinaciones-cartas-tarot",
  "/pt-br/combinacoes-cartas-tarot",
  "/will-my-ex-come-back-tarot",
  "/does-he-love-me-tarot",
  "/does-she-love-me-tarot",
  "/should-i-text-her-tarot",
  "/what-does-she-think-of-me-tarot",
  "/will-she-contact-me-tarot",
  "/is-she-my-soulmate-tarot",
  "/does-he-miss-me-tarot",
  "/is-he-hiding-his-feelings-tarot",
  "/why-did-he-pull-away-tarot",
  "/es/el-me-extrana-tarot",
  "/es/oculta-sus-sentimientos-tarot",
  "/es/por-que-se-alejo-tarot",
  "/pt-br/ele-sente-minha-falta-tarot",
  "/pt-br/ele-esconde-os-sentimentos-tarot",
  "/pt-br/por-que-ele-se-afastou-tarot",
  "/es/que-piensa-ella-de-mi-tarot",
  "/es/ella-me-contactara-tarot",
  "/es/ella-es-mi-alma-gemela-tarot",
  "/does-she-miss-me-tarot",
  "/is-she-hiding-her-feelings-tarot",
  "/why-did-she-pull-away-tarot",
  "/es/ella-me-extrana-tarot",
  "/es/ella-oculta-sus-sentimientos-tarot",
  "/es/por-que-ella-se-alejo-tarot",
  "/pt-br/o-que-ela-pensa-de-mim-tarot",
  "/pt-br/ela-vai-entrar-em-contato-tarot",
  "/pt-br/ela-e-minha-alma-gemea-tarot",
  "/pt-br/ela-sente-minha-falta-tarot",
  "/pt-br/ela-esconde-os-sentimentos-tarot",
  "/pt-br/por-que-ela-se-afastou-tarot",
  "/yes-or-no-tarot-love",
  "/career-tarot-reading",
  "/should-i-quit-my-job-tarot",
  "/should-i-accept-this-job-offer-tarot",
  "/will-i-get-promoted-tarot",
  "/what-career-is-right-for-me-tarot",
  "/es/debo-aceptar-esta-oferta-de-trabajo-tarot",
  "/es/conseguire-un-ascenso-tarot",
  "/es/que-carrera-es-para-mi-tarot",
  "/pt-br/devo-aceitar-esta-oferta-de-trabalho-tarot",
  "/pt-br/vou-ser-promovido-tarot",
  "/pt-br/qual-carreira-combina-comigo-tarot",
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
const publicRobotsPaths = [
  "/",
  "/free-tarot-tools",
  "/es/herramientas-tarot-gratis",
  "/pt-br/ferramentas-tarot-gratis",
  "/daily-tarot",
  "/tarot-questions",
  "/tarot-card-combinations",
  "/es/combinaciones-cartas-tarot",
  "/pt-br/combinacoes-cartas-tarot",
  "/brand-assets",
  "/reviews",
]

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
  if (crawlerRefreshAssetPaths.has(path)) {
    if (!cacheControl.includes("max-age=86400")) {
      fail(`${path} returned cache-control ${cacheControl || "(missing)"}, expected one-day crawler refresh cache`)
    }
  } else if (!cacheControl.includes("max-age=31536000") || !cacheControl.includes("immutable")) {
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

function assertBefore(source, first, second, label) {
  const firstIndex = source.indexOf(first)
  const secondIndex = source.indexOf(second)
  if (firstIndex === -1) fail(`${label} missing first marker: ${first}`)
  if (secondIndex === -1) fail(`${label} missing second marker: ${second}`)
  if (firstIndex > secondIndex) fail(`${label} expected ${first} before ${second}`)
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

  for (const snippet of [
    `<image:loc>${canonical("/logo.png")}</image:loc>`,
    `<image:loc>${canonical("/search-favicon.png")}</image:loc>`,
    `<image:loc>${canonical("/favicon.png")}</image:loc>`,
    `<image:loc>${canonical("/og-image.jpg")}</image:loc>`,
  ]) {
    assertIncludes(sitemap, snippet, `sitemap brand image ${snippet}`)
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
    "/search-favicon.png",
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
    "/search-favicon.png",
    "/favicon.png",
    "/favicon-48x48.png",
    "/favicon.ico",
    'href="/favicon.ico" sizes="any"',
    'property="og:logo"',
    "/apple-touch-icon.png",
    "/manifest.webmanifest",
    "/og-image.jpg",
    `${canonicalUrl}/logo.png`,
    `"primaryImageOfPage":{"@id":"${canonicalUrl}/#logo"}`,
    `"image":{"@id":"${canonicalUrl}/#logo"}`,
    `"thumbnailUrl":"${canonicalUrl}/logo.png"`,
  ]) {
    assertIncludes(home, snippet, `homepage search asset ${snippet}`)
  }
  for (const snippet of ["favicon-48x48.png?v=", "favicon-96x96.png?v=", "favicon.ico?v="]) {
    assertNotIncludes(home, snippet, `homepage stable favicon URL ${snippet}`)
  }
  assertBefore(home, 'href="/search-favicon.png"', 'href="/favicon.ico"', "homepage search favicon link order")

  for (const snippet of [
    "48 x 48 search favicon",
    "96 x 96 browser favicon",
    "/search-favicon.png",
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
