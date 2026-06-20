import {
  callAuthAdmin,
  createAnonSupabase,
  createUserSupabase,
  getProfile,
  jsonError,
  jsonResponse,
  serializeUser,
} from "@/lib/server/supabase"

export async function POST(req: Request) {
  const { email, password, nickname, referral_code } = await req.json()
  if (!email || !password) return jsonError("邮箱和密码不能为空")

  const supabase = createAnonSupabase()
  const displayName = nickname || email.split("@")[0]

  try {
    await callAuthAdmin({
      action: "create_user",
      email,
      password,
      nickname: displayName,
      referral_code,
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "注册失败")
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError || !signInData.session || !signInData.user) {
    return jsonError(signInError?.message || "注册后登录失败", 500)
  }

  const scoped = createUserSupabase(signInData.session.access_token)
  const profile = await getProfile(scoped, signInData.user)

  if (nickname && nickname !== profile.nickname) {
    await scoped.from("profiles").update({ nickname }).eq("id", signInData.user.id)
  }

  const refreshed = await getProfile(scoped, signInData.user)
  return jsonResponse({
    message: "注册成功",
    access_token: signInData.session.access_token,
    user: serializeUser(refreshed),
  })
}
