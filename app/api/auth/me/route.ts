import { getProfile, jsonResponse, requireUser, serializeUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const profile = await getProfile(auth.supabase, auth.user)
  return jsonResponse(serializeUser(profile))
}
