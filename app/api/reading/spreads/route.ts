import { getAllSpreads, isAdvancedSpreadType } from "@/lib/spread-config"
import { jsonResponse } from "@/lib/server/supabase"

export async function GET() {
  return jsonResponse({
    spreads: getAllSpreads().map((spread) => ({
      ...spread,
      type: spread.type,
      is_advanced: isAdvancedSpreadType(spread.type),
      positions: spread.positions.map((position) => ({
        ...position,
        nameJa: position.nameEn,
        nameKo: position.nameEn,
      })),
    })),
  })
}
