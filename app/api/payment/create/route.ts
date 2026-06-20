import { createZpayUrl } from "@/lib/server/payments"
import { getProfile, jsonError, jsonResponse, makeOrderNo, requireUser } from "@/lib/server/supabase"

type ProductRow = {
  type: string
  name: string
  price: number
  duration_days: number
  credits: number
  stripe_enabled: boolean
}

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const { product_type, pay_type = "alipay" } = await req.json()
  if (!["member_week", "member_month", "member_year", "partner"].includes(product_type)) {
    return jsonError("无效的商品类型")
  }
  if (!["alipay", "wxpay", "stripe"].includes(pay_type)) {
    return jsonError("无效的支付方式")
  }

  const { data: product, error: productError } = await auth.supabase
    .from("membership_products")
    .select("type,name,price,duration_days,credits,stripe_enabled")
    .eq("type", product_type)
    .eq("active", true)
    .single<ProductRow>()

  if (productError || !product) return jsonError("商品不存在")
  if (pay_type === "stripe") return jsonError("Stripe 尚未配置，请先使用支付宝")

  const profile = await getProfile(auth.supabase, auth.user)
  const orderNo = makeOrderNo()
  const amount = Number(product.price)
  let payUrl: string
  try {
    payUrl = createZpayUrl({
      orderNo,
      productName: product.name,
      amount,
      payType: pay_type,
      appUrl: new URL(req.url).origin,
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "支付网关未配置")
  }

  const { error } = await auth.supabase.from("payment_orders").insert({
    order_no: orderNo,
    user_id: auth.user.id,
    product_type: product.type,
    product_name: product.name,
    amount,
    pay_type,
    status: "pending",
    pay_url: payUrl,
    provider_payload: {
      email: profile.email,
      product_duration_days: product.duration_days,
    },
  })

  if (error) return jsonError(error.message)

  return jsonResponse({
    order_no: orderNo,
    pay_url: payUrl,
    amount,
    product_name: product.name,
  })
}
