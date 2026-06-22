import { getTarotQuestionHubMetadata, TarotQuestionsPageView } from "@/components/seo/tarot-questions-page"

export const metadata = getTarotQuestionHubMetadata("es")

export default function SpanishTarotQuestionsPage() {
  return <TarotQuestionsPageView locale="es" />
}
