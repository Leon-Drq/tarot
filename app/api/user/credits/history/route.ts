import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get("page") || 1))
  const perPage = Math.min(50, Math.max(1, Number(url.searchParams.get("per_page") || 20)))
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await auth.supabase
    .from("credit_transactions")
    .select("id,amount,type,description,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) return jsonError(error.message)
  return jsonResponse({ history: data || [], total: count || 0 })
}
