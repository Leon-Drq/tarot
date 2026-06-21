import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("tarot-reading-examples")

export default function TarotReadingExamplesPage() {
  const page = getTrustPage("tarot-reading-examples")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
