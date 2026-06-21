import { callFulfillment, verifyZpaySignature, type ZpayNotifyPayload } from "@/lib/server/payments"

const LEGACY_BACKEND_ROOT = (process.env.LEGACY_SIXYA_BACKEND_ROOT || "https://fenxiao.rayaigc.com").replace(/\/$/, "")

function text(body: string, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } })
}

async function readPayload(req: Request): Promise<ZpayNotifyPayload> {
  if (req.method === "GET") {
    const url = new URL(req.url)
    return Object.fromEntries(url.searchParams.entries())
  }

  const contentType = req.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return await req.json()
  }

  const form = await req.formData()
  const payload: ZpayNotifyPayload = {}
  for (const [key, value] of form.entries()) {
    payload[key] = String(value)
  }
  return payload
}

async function forwardLegacyNotify(req: Request, payload: ZpayNotifyPayload) {
  const params = new URLSearchParams(payload)

  if (req.method === "GET") {
    const url = new URL(`${LEGACY_BACKEND_ROOT}/api/payment/notify`)
    url.search = params.toString()
    return fetch(url, { method: "GET", cache: "no-store", redirect: "manual" })
  }

  return fetch(`${LEGACY_BACKEND_ROOT}/api/payment/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-store",
    redirect: "manual",
  })
}

async function handle(req: Request) {
  const payload = await readPayload(req)
  const orderNo = payload.out_trade_no

  if (orderNo?.startsWith("ORD")) {
    return forwardLegacyNotify(req, payload)
  }

  if (!verifyZpaySignature(payload)) return text("invalid sign", 400)

  const tradeNo = payload.trade_no || payload.api_trade_no || ""
  const tradeStatus = payload.trade_status || payload.status || ""

  if (!orderNo) return text("missing order", 400)
  if (!["TRADE_SUCCESS", "1", "success", "paid"].includes(String(tradeStatus))) {
    return text("success")
  }

  await callFulfillment({
    order_no: orderNo,
    trade_no: tradeNo,
    provider: "zpay",
    payload,
  })

  return text("success")
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}
