const CACHE_VERSION = "poptarot-return-v1"
const NAVIGATION_CACHE = `${CACHE_VERSION}-navigation`
const FALLBACK_URLS = ["/", "/daily-tarot"]
const PRIVATE_PATH_PREFIXES = [
  "/api/",
  "/auth/",
  "/profile",
  "/input",
  "/reading",
  "/reveal",
  "/loading-reading",
  "/analytics",
]

function isPrivatePath(pathname) {
  return PRIVATE_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(NAVIGATION_CACHE)
      .then((cache) => cache.addAll(FALLBACK_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("poptarot-return-") && key !== NAVIGATION_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const request = event.request
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (isPrivatePath(url.pathname)) return

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok && response.type === "basic") {
            const cache = await caches.open(NAVIGATION_CACHE)
            cache.put(request, response.clone()).catch(() => undefined)
          }
          return response
        })
        .catch(async () => {
          const cache = await caches.open(NAVIGATION_CACHE)
          return (await cache.match(request)) || (await cache.match("/daily-tarot")) || (await cache.match("/")) || Response.error()
        }),
    )
  }
})
