import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("editorial-policy")

export default function EditorialPolicyPage() {
  const page = getTrustPage("editorial-policy")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
