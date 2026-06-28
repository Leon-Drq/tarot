import { notFound } from "next/navigation"
import { TrustPageView } from "@/components/trust/trust-page"
import { getTrustMetadata, getTrustPage } from "@/lib/trust-pages"

export const metadata = getTrustMetadata("contact")

export default function ContactPage() {
  const page = getTrustPage("contact")
  if (!page) notFound()
  return <TrustPageView page={page} />
}
