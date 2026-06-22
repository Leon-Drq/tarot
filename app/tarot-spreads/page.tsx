import { getTarotSpreadHubMetadata, TarotSpreadsPageView } from "@/components/seo/tarot-spreads-page"

export const metadata = getTarotSpreadHubMetadata("en")

export default function TarotSpreadsPage() {
  return <TarotSpreadsPageView locale="en" />
}
