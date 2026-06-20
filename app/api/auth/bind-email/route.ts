import { callAuthAdmin, getProfile, jsonError, jsonResponse, requireUser, serializeUser } from "@/lib/server/supabase"

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const { email, password, nickname } = await req.json()
  if (!email || !password) return jsonError("邮箱和密码不能为空")

  try {
    await callAuthAdmin({
      action: "update_user",
      user_id: auth.user.id,
      email,
      password,
      nickname,
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "邮箱绑定失败")
  }

  if (nickname) {
    await auth.supabase.from("profiles").update({ nickname }).eq("id", auth.user.id)
  }

  const profile = await getProfile(auth.supabase, { ...auth.user, email } as typeof auth.user)
  return jsonResponse({
    message: "邮箱绑定成功",
    user: serializeUser(profile),
  })
}
