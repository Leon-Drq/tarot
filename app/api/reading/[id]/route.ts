import { requireMemberAccess } from "@/lib/server/member-gate"
import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: Params) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response
  const member = await requireMemberAccess(auth.supabase, auth.user, "history")
  if (!member.ok) return member.response

  const { id } = await params
  const { data, error } = await auth.supabase
    .from("tarot_readings")
    .select("id,question,cards,interpretation,spread_type,is_ai_analyzed,credits_used,created_at")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .single()

  if (error || !data) return jsonError("记录不存在", 404)
  return jsonResponse(data)
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response
  const member = await requireMemberAccess(auth.supabase, auth.user, "history")
  if (!member.ok) return member.response

  const { id } = await params
  const { error } = await auth.supabase.from("tarot_readings").delete().eq("id", id).eq("user_id", auth.user.id)
  if (error) return jsonError(error.message)
  return jsonResponse({ message: "删除成功" })
}
