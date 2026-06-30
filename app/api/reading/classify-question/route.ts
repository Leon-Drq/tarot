import {
  getFreeSpreadFallback,
  getSpreadAccessTier,
  getSpreadConfig,
  getSpreadUpgradeFeature,
  isAdvancedSpreadType,
  SPREAD_CONFIGS,
  type SpreadConfig,
} from "@/lib/spread-config"
import { classifyQuestionIntent } from "@/lib/question-intent"
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
  const intent = classifyQuestionIntent(String(question))

  let best = getSpreadConfig(intent.recommendedSpreadType)
  let confidence = intent.confidence

  for (const config of Object.values(SPREAD_CONFIGS)) {
    if (config.type === "three_card") continue
    const matched = config.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
    const shouldPreserveDomainIntent =
      config.type === "yes_no" && ["love", "reconciliation", "career"].includes(intent.type)
    if (shouldPreserveDomainIntent) continue
    if (matched && config.type !== best.type) {
      best = config
      confidence = Math.max(confidence, 0.82)
      break
    }
  }

  const isAdvanced = isAdvancedSpreadType(best.type)
  const freeStarter = isAdvanced ? getFreeSpreadFallback(best.type) : best

  return jsonResponse({
    spread_type: best.type,
    deck_type: best.cardCount <= 3 ? "major" : "full",
    confidence,
    reason: best.type === "three_card" ? "使用默认三牌阵" : `根据${intent.reason}匹配到「${best.name}」`,
    question_type: intent.type,
    recommended_spread_type: intent.recommendedSpreadType,
    tone: intent.tone,
    is_yes_no: intent.isYesNo,
    is_love: intent.isLove,
    is_career: intent.isCareer,
    is_daily: intent.isDaily,
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
