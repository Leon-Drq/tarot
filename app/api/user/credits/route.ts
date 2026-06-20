import { getProfile, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const profile = await getProfile(auth.supabase, auth.user)
  return jsonResponse({ credits: profile.credits })
}
