import { jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  return jsonResponse({
    referral_count: 0,
    total_orders: 0,
    total_amount: 0,
    total_commission: 0,
  })
}
