import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const { reading_id, interpretation } = await req.json()
  if (!reading_id || typeof interpretation !== "string") return jsonError("参数不完整")

  const { error } = await auth.supabase
    .from("tarot_readings")
    .update({ interpretation, is_ai_analyzed: true })
    .eq("id", reading_id)

  if (error) return jsonError(error.message)
  return jsonResponse({ message: "保存成功" })
}
