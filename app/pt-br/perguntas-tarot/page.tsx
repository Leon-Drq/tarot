import { getTarotQuestionHubMetadata, TarotQuestionsPageView } from "@/components/seo/tarot-questions-page"

export const metadata = getTarotQuestionHubMetadata("pt-br")

export default function PortugueseTarotQuestionsPage() {
  return <TarotQuestionsPageView locale="pt-br" />
}
