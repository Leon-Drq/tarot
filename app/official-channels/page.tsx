import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("official-channels")

export default function OfficialChannelsPage() {
  const page = getTrustPage("official-channels")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
