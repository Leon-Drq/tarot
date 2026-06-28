import {
  getTarotCardCombinationHubMetadata,
  TarotCardCombinationsPageView,
} from "@/components/seo/tarot-card-combinations-page"

export const metadata = getTarotCardCombinationHubMetadata("pt-br")

export default function PortugueseTarotCardCombinationsPage() {
  return <TarotCardCombinationsPageView locale="pt-br" />
}
