import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const { data, error } = await auth.supabase
    .from("payment_orders")
    .select("order_no,product_type,product_name,amount,status,paid_at,created_at")
    .order("created_at", { ascending: false })

  if (error) return jsonError(error.message)
  return jsonResponse({ orders: data || [] })
}
