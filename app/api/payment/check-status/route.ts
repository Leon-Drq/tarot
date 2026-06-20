import { callFulfillment, queryZpayOrder } from "@/lib/server/payments"
import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

type OrderRow = {
  order_no: string
  trade_no: string | null
  amount: number
  product_name: string
  status: string
  paid_at: string | null
  pay_type: "alipay" | "wxpay" | "stripe"
}

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const orderNo = url.searchParams.get("order_no")
  if (!orderNo) return jsonError("缺少订单号")

  let { data: order, error } = await auth.supabase
    .from("payment_orders")
    .select("order_no,trade_no,amount,product_name,status,paid_at,pay_type")
    .eq("order_no", orderNo)
    .single<OrderRow>()

  if (error || !order) return jsonError("订单不存在", 404)

  if (order.status === "pending" && ["alipay", "wxpay"].includes(order.pay_type)) {
    const payment = await queryZpayOrder(order.order_no)
    if (payment.paid) {
      await callFulfillment({
        order_no: order.order_no,
        trade_no: payment.trade_no,
        provider: "zpay",
        payload: payment.raw,
      })

      const refreshed = await auth.supabase
        .from("payment_orders")
        .select("order_no,trade_no,amount,product_name,status,paid_at,pay_type")
        .eq("order_no", orderNo)
        .single<OrderRow>()

      if (!refreshed.error && refreshed.data) order = refreshed.data
    }
  }

  return jsonResponse({
    paid: order.status === "paid",
    status: order.status,
    order: {
      order_no: order.order_no,
      trade_no: order.trade_no || "",
      amount: Number(order.amount),
      product_name: order.product_name,
      paid_at: order.paid_at || undefined,
    },
  })
}
