import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const { question, cards, spread_type } = await req.json()
  const { data, error } = await auth.supabase.rpc("create_tarot_reading", {
    p_question: question || "寻求指引",
    p_cards: cards || [],
    p_spread_type: spread_type || "three_card",
  })

  if (error) {
    if (error.message.includes("insufficient_credits")) {
      return jsonError("积分不足，请购买会员或积分", 402)
    }
    return jsonError(error.message)
  }

  const result = Array.isArray(data) ? data[0] : data
  return jsonResponse({
    reading_id: result.reading_id,
    credits_used: result.credits_used,
    message: result.message,
  })
}
