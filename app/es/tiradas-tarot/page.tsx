import { getTarotSpreadHubMetadata, TarotSpreadsPageView } from "@/components/seo/tarot-spreads-page"

export const metadata = getTarotSpreadHubMetadata("es")

export default function SpanishTarotSpreadsPage() {
  return <TarotSpreadsPageView locale="es" />
}
