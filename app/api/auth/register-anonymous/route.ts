import {
  callAuthAdmin,
  createAnonSupabase,
  createUserSupabase,
  getProfile,
  jsonError,
  jsonResponse,
  serializeUser,
} from "@/lib/server/supabase"

export async function POST() {
  const supabase = createAnonSupabase()
  const id = crypto.randomUUID().replace(/-/g, "")
  const email = `anon-${id}@anon.poptarot.com`
  const password = crypto.randomUUID() + crypto.randomUUID()
  const nickname = `Mystic-${id.slice(0, 6).toUpperCase()}`

  try {
    await callAuthAdmin({
      action: "create_user",
      email,
      password,
      nickname,
      is_anonymous: true,
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "匿名用户创建失败", 500)
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError || !signInData.session || !signInData.user) {
    return jsonError("匿名用户创建失败，请稍后重试", 500)
  }

  const scoped = createUserSupabase(signInData.session.access_token)
  const profile = await getProfile(scoped, signInData.user)

  return jsonResponse({
    message: "匿名用户创建成功",
    access_token: signInData.session.access_token,
    user: serializeUser(profile),
  })
}
