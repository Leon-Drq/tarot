import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("reviews")

export default function ReviewsPage() {
  const page = getTrustPage("reviews")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
