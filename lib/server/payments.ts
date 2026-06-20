import crypto from "node:crypto"

import { getSupabaseUrl } from "@/lib/server/supabase"

export type ZpayNotifyPayload = Record<string, string>

const DEFAULT_ZPAY_API_URL = "https://zpayz.cn/submit.php"
const DEFAULT_ZPAY_QUERY_URL = "https://zpayz.cn/api.php"

export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return "https://poptarot.com"
}

function getZpayPid() {
  return process.env.ZPAY_PID || ""
}

function getZpayKey() {
  return process.env.ZPAY_KEY || ""
}

export function isZpayConfigured() {
  return Boolean(getZpayPid() && getZpayKey())
}

export function createZpaySignature(params: Record<string, string>, key = getZpayKey()) {
  const signSource =
    Object.entries(params)
      .filter(([name, value]) => value !== "" && name !== "sign" && name !== "sign_type")
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
      .map(([name, value]) => `${name}=${value}`)
      .join("&") + key

  return crypto.createHash("md5").update(signSource, "utf8").digest("hex")
}

export function verifyZpaySignature(params: Record<string, string>) {
  const provided = params.sign || ""
  if (!provided || !getZpayKey()) return false
  const expected = createZpaySignature(params)
  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length) return false
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer)
}

export function createZpayUrl(input: {
  orderNo: string
  productName: string
  amount: number
  payType: "alipay" | "wxpay"
}) {
  if (!isZpayConfigured()) {
    throw new Error("支付网关未配置")
  }

  const appUrl = getAppUrl()
  const params: Record<string, string> = {
    pid: getZpayPid(),
    type: input.payType,
    out_trade_no: input.orderNo,
    notify_url: `${appUrl}/api/payment/notify`,
    return_url: `${appUrl}/membership?payment=success&order_no=${encodeURIComponent(input.orderNo)}`,
    name: input.productName,
    money: input.amount.toFixed(2),
  }

  params.sign = createZpaySignature(params)
  params.sign_type = "MD5"

  const url = new URL(process.env.ZPAY_API_URL || DEFAULT_ZPAY_API_URL)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

export async function queryZpayOrder(orderNo: string) {
  if (!isZpayConfigured()) return { paid: false, trade_no: "", status: "not_configured", raw: null as unknown }

  const url = new URL(process.env.ZPAY_QUERY_URL || DEFAULT_ZPAY_QUERY_URL)
  url.searchParams.set("act", "order")
  url.searchParams.set("pid", getZpayPid())
  url.searchParams.set("key", getZpayKey())
  url.searchParams.set("out_trade_no", orderNo)

  const response = await fetch(url, { cache: "no-store" })
  const raw = await response.json().catch(() => null)
  const code = raw?.code
  const status = raw?.status || raw?.trade_status
  const paid = (code === 1 || code === "1") && (status === 1 || status === "1" || status === "TRADE_SUCCESS")

  return {
    paid,
    trade_no: raw?.trade_no || raw?.api_trade_no || "",
    status,
    raw,
  }
}

export async function callFulfillment(input: {
  order_no: string
  trade_no?: string
  provider: "zpay" | "stripe" | "manual"
  payload?: unknown
}) {
  const secret = process.env.POPTAROT_FULFILLMENT_SECRET
  if (!secret) throw new Error("Missing POPTAROT_FULFILLMENT_SECRET")

  const functionsUrl = process.env.SUPABASE_FUNCTIONS_URL || `${getSupabaseUrl()}/functions/v1`
  const response = await fetch(`${functionsUrl}/poptarot-fulfill-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-poptarot-secret": secret,
    },
    body: JSON.stringify(input),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || "支付开通失败")
  }
  return data
}
