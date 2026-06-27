import {
  getFreeSpreadFallback,
  getSpreadAccessTier,
  getSpreadConfig,
  getSpreadUpgradeFeature,
  isAdvancedSpreadType,
  SPREAD_CONFIGS,
  type SpreadConfig,
} from "@/lib/spread-config"
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

  const isAdvanced = isAdvancedSpreadType(best.type)
  const freeStarter = isAdvanced ? getFreeSpreadFallback(best.type) : best

  return jsonResponse({
    spread_type: best.type,
    deck_type: best.cardCount <= 3 ? "major" : "full",
    confidence,
    reason: best.type === "three_card" ? "使用默认三牌阵" : `根据问题关键词匹配到「${best.name}」`,
    is_advanced: isAdvanced,
    access_tier: getSpreadAccessTier(best.type),
    upgrade_feature: getSpreadUpgradeFeature(best.type),
    effective_free_spread_type: freeStarter.type,
    free_starter_spread_type: freeStarter.type,
    free_starter_deck_type: freeStarter.cardCount <= 3 ? "major" : "full",
    free_starter_spread_config: serializeSpread(freeStarter),
    member_spread_config: isAdvanced ? serializeSpread(best) : null,
    free_first_message: isAdvanced
      ? "This question matches a deeper member spread, but the first reading should start with a free starter spread."
      : "This question can start directly with a free spread.",
    spread_config: serializeSpread(best),
  })
}
