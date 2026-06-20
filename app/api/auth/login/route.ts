import { createAnonSupabase, createUserSupabase, getProfile, jsonError, jsonResponse, serializeUser } from "@/lib/server/supabase"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) return jsonError("邮箱和密码不能为空")

  const supabase = createAnonSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session || !data.user) {
    return jsonError(error?.message || "登录失败", 401)
  }

  const token = data.session.access_token
  const scoped = createUserSupabase(token)
  const profile = await getProfile(scoped, data.user)

  return jsonResponse({
    message: "登录成功",
    access_token: token,
    user: serializeUser(profile),
  })
}
