import { jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  return jsonResponse({ referrals: [], total: 0 })
}
