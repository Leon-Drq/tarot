import { getTarotSpreadHubMetadata, TarotSpreadsPageView } from "@/components/seo/tarot-spreads-page"

export const metadata = getTarotSpreadHubMetadata("pt-br")

export default function PortugueseTarotSpreadsPage() {
  return <TarotSpreadsPageView locale="pt-br" />
}
