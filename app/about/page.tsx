import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("about")

export default function AboutPage() {
  const page = getTrustPage("about")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
