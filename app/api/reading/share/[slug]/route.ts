import { createAnonSupabase, jsonError, jsonResponse } from "@/lib/server/supabase"

type Params = {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params
  if (!/^[a-z0-9-]{8,64}$/.test(slug)) return jsonError("分享不存在", 404)

  const supabase = createAnonSupabase()
  const { data, error } = await supabase
    .from("reading_shares")
    .select("slug,question,cards,spread_type,interpretation_excerpt,created_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !data) return jsonError("分享不存在", 404)
  return jsonResponse(data)
}
