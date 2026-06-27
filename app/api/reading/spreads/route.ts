import {
  FREE_SPREAD_TYPES,
  getAllSpreads,
  getFreeSpreadFallback,
  getSpreadAccessTier,
  getSpreadUpgradeFeature,
  isAdvancedSpreadType,
} from "@/lib/spread-config"
import { jsonResponse } from "@/lib/server/supabase"

function serializeSpread(spread: ReturnType<typeof getAllSpreads>[number]) {
  return {
    ...spread,
    type: spread.type,
    is_advanced: isAdvancedSpreadType(spread.type),
    access_tier: getSpreadAccessTier(spread.type),
    upgrade_feature: getSpreadUpgradeFeature(spread.type),
    positions: spread.positions.map((position) => ({
      ...position,
      nameJa: position.nameEn,
      nameKo: position.nameEn,
    })),
  }
}

export async function GET() {
  return jsonResponse({
    membership_boundary: {
      free_first: true,
      free_spread_types: Array.from(FREE_SPREAD_TYPES),
      member_features: ["deeper_followups", "saved_history", "advanced_spreads", "monthly_reports"],
      advanced_spread_feature: "advanced_spread",
      default_free_starter_spread_type: getFreeSpreadFallback().type,
    },
    spreads: getAllSpreads().map((spread) => {
      const freeStarter = isAdvancedSpreadType(spread.type) ? getFreeSpreadFallback(spread.type) : spread
      return {
        ...serializeSpread(spread),
        free_starter_spread_type: freeStarter.type,
        free_starter_spread: serializeSpread(freeStarter),
      }
    }),
  })
}
