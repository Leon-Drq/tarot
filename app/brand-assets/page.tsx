import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("brand-assets")

export default function BrandAssetsPage() {
  const page = getTrustPage("brand-assets")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
