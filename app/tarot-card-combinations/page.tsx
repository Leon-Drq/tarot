import {
  getTarotCardCombinationHubMetadata,
  TarotCardCombinationsPageView,
} from "@/components/seo/tarot-card-combinations-page"

export const metadata = getTarotCardCombinationHubMetadata("en")

export default function TarotCardCombinationsPage() {
  return <TarotCardCombinationsPageView locale="en" />
}
