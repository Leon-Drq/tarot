import {
  getTarotCardCombinationHubMetadata,
  TarotCardCombinationsPageView,
} from "@/components/seo/tarot-card-combinations-page"

export const metadata = getTarotCardCombinationHubMetadata("es")

export default function SpanishTarotCardCombinationsPage() {
  return <TarotCardCombinationsPageView locale="es" />
}
