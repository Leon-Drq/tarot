import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const LEGACY_BACKEND_ROOT = (process.env.LEGACY_SIXYA_BACKEND_ROOT || "https://fenxiao.rayaigc.com").replace(/\/$/, "")
const LEGACY_SIXYA_BASE_URL = `${LEGACY_BACKEND_ROOT}/api/sixya`

const FORWARDED_HEADERS = ["authorization", "content-type", "accept", "accept-language", "user-agent"]

function buildTargetUrl(req: NextRequest, path: string[]) {
  const requestUrl = new URL(req.url)
  const target = new URL(`${LEGACY_SIXYA_BASE_URL}/${path.map(encodeURIComponent).join("/")}`)
  target.search = requestUrl.search
  return target
}

function buildHeaders(req: NextRequest) {
  const headers = new Headers()
  for (const key of FORWARDED_HEADERS) {
    const value = req.headers.get(key)
    if (value) headers.set(key, value)
  }

  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) headers.set("x-forwarded-for", forwardedFor)
  headers.set("x-forwarded-host", req.headers.get("host") || "poptarot.com")
  headers.set("x-forwarded-proto", new URL(req.url).protocol.replace(":", ""))
  return headers
}

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const method = req.method.toUpperCase()
  const target = buildTargetUrl(req, path)
  const body = method === "GET" || method === "HEAD" ? undefined : await req.arrayBuffer()

  const response = await fetch(target, {
    method,
    headers: buildHeaders(req),
    body,
    cache: "no-store",
    redirect: "manual",
  })

  const headers = new Headers(response.headers)
  headers.delete("content-length")
  headers.delete("content-encoding")
  headers.delete("transfer-encoding")
  headers.set("x-poptarot-legacy-proxy", "sixya")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
export const OPTIONS = proxy
