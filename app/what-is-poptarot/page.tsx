import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("what-is-poptarot")

export default function WhatIsPoptarotPage() {
  const page = getTrustPage("what-is-poptarot")
  if (!page) return null
  return <TrustPageView page={page} />
}
