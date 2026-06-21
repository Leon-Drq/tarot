import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("ai-tarot-disclaimer")

export default function AiTarotDisclaimerPage() {
  const page = getTrustPage("ai-tarot-disclaimer")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
