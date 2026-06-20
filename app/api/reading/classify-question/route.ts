import { getSpreadConfig, SPREAD_CONFIGS, type SpreadConfig } from "@/lib/spread-config"
import { jsonResponse } from "@/lib/server/supabase"

function serializeSpread(config: SpreadConfig) {
  return {
    ...config,
    positions: config.positions.map((position) => ({
      ...position,
      nameJa: position.nameEn,
      nameKo: position.nameEn,
    })),
  }
}

export async function POST(req: Request) {
  const { question = "" } = await req.json()
  const normalized = String(question).toLowerCase()

  let best = getSpreadConfig("three_card")
  let confidence = 0.5

  for (const config of Object.values(SPREAD_CONFIGS)) {
    if (config.type === "three_card") continue
    const matched = config.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
    if (matched) {
      best = config
      confidence = 0.82
      break
    }
  }

  return jsonResponse({
    spread_type: best.type,
    deck_type: best.cardCount <= 3 ? "major" : "full",
    confidence,
    reason: best.type === "three_card" ? "使用默认三牌阵" : `根据问题关键词匹配到「${best.name}」`,
    spread_config: serializeSpread(best),
  })
}
