import { requireMemberAccess } from "@/lib/server/member-gate"
import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response
  const member = await requireMemberAccess(auth.supabase, auth.user, "history")
  if (!member.ok) return member.response

  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get("page") || 1))
  const perPage = Math.min(50, Math.max(1, Number(url.searchParams.get("per_page") || 20)))
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await auth.supabase
    .from("tarot_readings")
    .select("id,question,cards,interpretation,spread_type,is_ai_analyzed,credits_used,created_at", { count: "exact" })
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) return jsonError(error.message)

  return jsonResponse({
    readings: data || [],
    total: count || 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((count || 0) / perPage),
  })
}
