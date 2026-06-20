import { getProfile, jsonError, jsonResponse, requireUser, serializeUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const profile = await getProfile(auth.supabase, auth.user)
  return jsonResponse({
    ...serializeUser(profile),
    referral_count: 0,
  })
}

export async function PUT(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const body = await req.json()
  const patch: Record<string, string> = {}

  if (typeof body.nickname === "string") patch.nickname = body.nickname.trim()
  if (typeof body.avatar_url === "string") patch.avatar_url = body.avatar_url
  if (typeof body.birthday === "string") patch.birthday = body.birthday

  if (Object.keys(patch).length === 0) return jsonError("没有要更新的内容")

  const { error } = await auth.supabase.from("profiles").update(patch).eq("id", auth.user.id)
  if (error) return jsonError(error.message)

  return jsonResponse({ message: "更新成功" })
}
