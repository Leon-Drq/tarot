import { callFulfillment, verifyZpaySignature, type ZpayNotifyPayload } from "@/lib/server/payments"
import { createServiceSupabase, hasSupabaseServiceKey } from "@/lib/server/supabase"
import { trackServerAnalyticsEvent } from "@/lib/server/analytics"

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

  let analyticsUserId: string | null = null
  const analyticsMetadata: Record<string, unknown> = {
    order_no: orderNo,
    trade_no: tradeNo,
  }

  if (hasSupabaseServiceKey()) {
    const supabase = createServiceSupabase()
    const { data: order } = await supabase
      .from("payment_orders")
      .select("user_id,product_type,amount,pay_type,status")
      .eq("order_no", orderNo)
      .single()

    analyticsUserId = order?.user_id || null
    analyticsMetadata.product_type = order?.product_type
    analyticsMetadata.amount = order?.amount
    analyticsMetadata.pay_type = order?.pay_type
    analyticsMetadata.status = order?.status
  }

  await trackServerAnalyticsEvent({
    event_name: "payment_completed",
    user_id: analyticsUserId,
    path: "/api/payment/notify",
    source: "zpay",
    metadata: analyticsMetadata,
  })

  return text("success")
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}
