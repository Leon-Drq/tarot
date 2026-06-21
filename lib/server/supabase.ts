import { createClient, type SupabaseClient, type User as SupabaseUser } from "@supabase/supabase-js"

export type ProfileRow = {
  id: string
  email: string | null
  nickname: string
  avatar_url: string | null
  credits: number
  member_type: string | null
  member_expire_at: string | null
  partner_expire_at: string | null
  referral_code: string
  referred_by: string | null
  birthday: string | null
}

type AuthResult =
  | { ok: true; token: string; user: SupabaseUser; supabase: SupabaseClient }
  | { ok: false; response: Response }

export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  return url
}

export function getSupabaseKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return key
}

export function createAnonSupabase() {
  return createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createUserSupabase(token: string) {
  return createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

export function getSupabaseServiceKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  return key
}

export function hasSupabaseServiceKey() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY)
}

export function createServiceSupabase() {
  return createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function callAuthAdmin(payload: {
  action: "create_user" | "update_user"
  user_id?: string
  email: string
  password: string
  nickname?: string
  is_anonymous?: boolean
  referral_code?: string
}) {
  const secret = process.env.POPTAROT_FULFILLMENT_SECRET
  if (!secret) throw new Error("Missing POPTAROT_FULFILLMENT_SECRET")

  const functionsUrl = process.env.SUPABASE_FUNCTIONS_URL || `${getSupabaseUrl()}/functions/v1`
  const response = await fetch(`${functionsUrl}/poptarot-auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-poptarot-secret": secret,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || "Auth admin action failed")
  return data
}

export function getBearerToken(req: Request) {
  const header = req.headers.get("authorization") || ""
  const [scheme, token] = header.split(" ")
  return scheme?.toLowerCase() === "bearer" && token ? token : null
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export function jsonError(error: string, status = 400) {
  return jsonResponse({ error }, { status })
}

export async function requireUser(req: Request): Promise<AuthResult> {
  const token = getBearerToken(req)
  if (!token) return { ok: false, response: jsonError("Unauthorized", 401) }

  const supabase = createUserSupabase(token)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return { ok: false, response: jsonError("Unauthorized", 401) }

  return { ok: true, token, user: data.user, supabase }
}

export function isAnonymousEmail(email: string | null | undefined) {
  return Boolean(email && (email.endsWith("@anon.poptarot.com") || email.endsWith("@anon.poptarot.local")))
}

export function isMemberActive(profile: Pick<ProfileRow, "member_expire_at"> | null | undefined) {
  if (!profile?.member_expire_at) return false
  return new Date(profile.member_expire_at).getTime() > Date.now()
}

export function isPartnerActive(profile: Pick<ProfileRow, "partner_expire_at"> | null | undefined) {
  if (!profile?.partner_expire_at) return false
  return new Date(profile.partner_expire_at).getTime() > Date.now()
}

export function serializeUser(profile: ProfileRow) {
  const memberActive = isMemberActive(profile)
  const partnerActive = isPartnerActive(profile)

  return {
    id: profile.id,
    email: isAnonymousEmail(profile.email) ? null : profile.email,
    nickname: profile.nickname,
    avatar_url: profile.avatar_url || undefined,
    credits: profile.credits,
    is_member: memberActive || partnerActive,
    member_type: partnerActive ? "partner" : memberActive ? profile.member_type || undefined : undefined,
    member_expire_at: partnerActive ? profile.partner_expire_at || undefined : memberActive ? profile.member_expire_at || undefined : undefined,
    is_partner: partnerActive,
    referral_code: profile.referral_code,
    is_anonymous: isAnonymousEmail(profile.email),
    birthday: profile.birthday || undefined,
  }
}

export async function getProfile(supabase: SupabaseClient, user: SupabaseUser) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,nickname,avatar_url,credits,member_type,member_expire_at,partner_expire_at,referral_code,referred_by,birthday")
    .eq("id", user.id)
    .single<ProfileRow>()

  if (!error && data) return data

  const fallbackNickname =
    typeof user.user_metadata?.nickname === "string" && user.user_metadata.nickname.trim()
      ? user.user_metadata.nickname.trim()
      : user.email?.split("@")[0] || "Mystic Guest"

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email || null,
      nickname: fallbackNickname,
      referral_code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
    })
    .select("id,email,nickname,avatar_url,credits,member_type,member_expire_at,partner_expire_at,referral_code,referred_by,birthday")
    .single<ProfileRow>()

  if (insertError || !inserted) throw new Error(insertError?.message || "Failed to create profile")
  return inserted
}

export function makeOrderNo() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14)
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()
  return `PT${stamp}${random}`
}
