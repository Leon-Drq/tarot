import { getProfile, isMemberActive, isPartnerActive, jsonResponse, requireUser } from "@/lib/server/supabase"

export async function GET(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const profile = await getProfile(auth.supabase, auth.user)
  const partner = isPartnerActive(profile)
  const member = partner || isMemberActive(profile)

  return jsonResponse({
    is_member: member,
    member_type: partner ? "partner" : member ? profile.member_type : undefined,
    member_expire_at: partner ? profile.partner_expire_at : member ? profile.member_expire_at : undefined,
    is_partner: partner,
    partner_expire_at: partner ? profile.partner_expire_at : undefined,
  })
}
