import { getLocalizedFreeToolsMetadata, LocalizedFreeToolsPage } from "@/components/seo/free-tools-localized-page"

export const metadata = getLocalizedFreeToolsMetadata("pt-br")

export default function PortugueseFreeTarotToolsPage() {
  return <LocalizedFreeToolsPage locale="pt-br" />
}
