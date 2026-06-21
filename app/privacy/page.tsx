import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("privacy")

export default function PrivacyPage() {
  const page = getTrustPage("privacy")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
