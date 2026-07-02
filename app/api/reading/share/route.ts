import { jsonError, jsonResponse, requireUser } from "@/lib/server/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createReadingShareExcerpt } from "@/lib/reading-presentation"

type ShareCardInput = {
  id?: number
  name?: string
  nameEn?: string
  position?: string
  image?: string
  isReversed?: boolean
  meaning?: unknown
}

function trimText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return ""
  const normalized = value.replace(/\s+/g, " ").trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized
}

function cleanCards(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.slice(0, 10).map((card: ShareCardInput) => ({
    id: typeof card.id === "number" ? card.id : undefined,
    name: trimText(card.name, 80),
    nameEn: trimText(card.nameEn, 80),
    position: trimText(card.position, 80) || undefined,
    image: typeof card.image === "string" && card.image.startsWith("https://") ? card.image : undefined,
    isReversed: Boolean(card.isReversed),
    meaning: card.meaning && typeof card.meaning === "object" ? card.meaning : undefined,
  }))
}

function makeSlug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 14)
}

async function insertWithUniqueSlug(
  supabase: SupabaseClient,
  payload: Record<string, unknown>,
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = makeSlug()
    const { data, error } = await supabase
      .from("reading_shares")
      .insert({ ...payload, slug })
      .select("slug")
      .single()

    if (!error && data) return data.slug as string
    if (!error || error.code !== "23505") throw error
  }

  throw new Error("Unable to create a unique share link")
}

export async function POST(req: Request) {
  const auth = await requireUser(req)
  if (!auth.ok) return auth.response

  const body = await req.json().catch(() => ({}))
  const readingId = typeof body.reading_id === "string" ? body.reading_id : null

  let sourceReading:
    | {
        id: string
        question: string
        cards: unknown
        interpretation: string | null
        spread_type: string
      }
    | null = null

  if (readingId) {
    const { data, error } = await auth.supabase
      .from("tarot_readings")
      .select("id,question,cards,interpretation,spread_type")
      .eq("id", readingId)
      .eq("user_id", auth.user.id)
      .single()

    if (error || !data) return jsonError("解读记录不存在", 404)
    sourceReading = data
  }

  const question = trimText(sourceReading?.question || body.question || "My tarot reading", 220)
  const cards = cleanCards(body.cards || sourceReading?.cards)
  const interpretationExcerpt = createReadingShareExcerpt(sourceReading?.interpretation || body.interpretation || "", 1200)
  const spreadType = trimText(sourceReading?.spread_type || body.spread_type || "three_card", 60)

  if (!question || cards.length === 0) return jsonError("分享内容不完整")

  const payload = {
    reading_id: sourceReading?.id || null,
    owner_id: auth.user.id,
    question,
    cards,
    spread_type: spreadType || "three_card",
    interpretation_excerpt: interpretationExcerpt,
    is_active: true,
    updated_at: new Date().toISOString(),
  }

  try {
    if (sourceReading?.id) {
      const { data: existing, error: existingError } = await auth.supabase
        .from("reading_shares")
        .select("slug")
        .eq("reading_id", sourceReading.id)
        .eq("owner_id", auth.user.id)
        .maybeSingle()

      if (existingError) throw existingError

      if (existing?.slug) {
        const { error: updateError } = await auth.supabase
          .from("reading_shares")
          .update(payload)
          .eq("slug", existing.slug)

        if (updateError) throw updateError
        return jsonResponse({ slug: existing.slug, url: `/share/${existing.slug}` })
      }
    }

    const slug = await insertWithUniqueSlug(auth.supabase, payload)
    return jsonResponse({ slug, url: `/share/${slug}` })
  } catch (error) {
    console.error("[Share] Failed to create share:", error)
    return jsonError(error instanceof Error ? error.message : "创建分享链接失败", 500)
  }
}
