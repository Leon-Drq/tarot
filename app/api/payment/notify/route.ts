import { callFulfillment, verifyZpaySignature, type ZpayNotifyPayload } from "@/lib/server/payments"

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

async function handle(req: Request) {
  const payload = await readPayload(req)
  if (!verifyZpaySignature(payload)) return text("invalid sign", 400)

  const orderNo = payload.out_trade_no
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
