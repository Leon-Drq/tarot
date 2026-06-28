import { getLocalizedFreeToolsMetadata, LocalizedFreeToolsPage } from "@/components/seo/free-tools-localized-page"

export const metadata = getLocalizedFreeToolsMetadata("es")

export default function SpanishFreeTarotToolsPage() {
  return <LocalizedFreeToolsPage locale="es" />
}
