import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Shared POPTarot reading"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Params = {
  params: Promise<{ slug: string }>
}

type ShareRecord = {
  slug: string
  question: string
  cards: Array<{
    name?: string
    nameEn?: string
    image?: string
    isReversed?: boolean
  }>
  interpretation_excerpt?: string
}

async function getShare(slug: string): Promise<ShareRecord | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey || !/^[a-z0-9-]{8,64}$/.test(slug)) return null

  const fields = "slug,question,cards,interpretation_excerpt"
  const response = await fetch(
    `${supabaseUrl}/rest/v1/reading_shares?slug=eq.${encodeURIComponent(slug)}&is_active=eq.true&select=${fields}`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) return null
  const data = (await response.json()) as ShareRecord[]
  return data[0] || null
}

function shortText(value: string | undefined, maxLength: number) {
  if (!value) return ""
  const normalized = value.replace(/\s+/g, " ").trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized
}

export default async function Image({ params }: Params) {
  const { slug } = await params
  const share = await getShare(slug)
  const question = share?.question || "A POPTarot Reading"
  const cards = share?.cards?.slice(0, 3) || []

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #08030f 0%, #1c0d2f 48%, #36192e 100%)",
          color: "white",
          padding: 64,
          position: "relative",
          overflow: "hidden",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "radial-gradient(circle, rgba(220,179,96,0.28) 0%, rgba(220,179,96,0) 68%)",
            right: -120,
            top: -120,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", width: 700, zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#f3d58b",
              fontSize: 26,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            POP TAROT
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              color: "#ffffff",
              fontSize: 62,
              lineHeight: 1.05,
              fontWeight: 700,
            }}
          >
            {shortText(question, 96)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "rgba(255,255,255,0.72)",
              fontSize: 28,
              lineHeight: 1.35,
            }}
          >
            {shortText(share?.interpretation_excerpt || "Draw your cards and receive a personalized AI tarot interpretation.", 150)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "auto",
              color: "#f3d58b",
              fontSize: 24,
            }}
          >
            Free AI tarot reading at poptarot.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            flex: 1,
            zIndex: 1,
          }}
        >
          {cards.map((card, index) => (
            <div
              key={`${card.name || index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `translateY(${index === 1 ? "-30px" : "22px"}) rotate(${index === 0 ? "-8deg" : index === 2 ? "8deg" : "0deg"})`,
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 258,
                  display: "flex",
                  border: "3px solid rgba(243,213,139,0.78)",
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#211330",
                  boxShadow: "0 22px 60px rgba(0,0,0,0.5)",
                }}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.nameEn || card.name || "Tarot card"}
                    width={150}
                    height={258}
                    style={{
                      width: 150,
                      height: 258,
                      objectFit: "cover",
                      transform: card.isReversed ? "rotate(180deg)" : "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      padding: 18,
                      textAlign: "center",
                      color: "rgba(255,255,255,0.72)",
                      fontSize: 24,
                    }}
                  >
                    {card.nameEn || card.name || "Tarot Card"}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 18,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 21,
                  textAlign: "center",
                  maxWidth: 170,
                }}
              >
                {shortText(card.nameEn || card.name || "Tarot Card", 24)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  )
}
