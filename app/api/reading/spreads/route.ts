import { getAllSpreads } from "@/lib/spread-config"
import { jsonResponse } from "@/lib/server/supabase"

export async function GET() {
  return jsonResponse({
    spreads: getAllSpreads().map((spread) => ({
      ...spread,
      type: spread.type,
      positions: spread.positions.map((position) => ({
        ...position,
        nameJa: position.nameEn,
        nameKo: position.nameEn,
      })),
    })),
  })
}
