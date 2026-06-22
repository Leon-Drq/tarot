import { getTarotQuestionHubMetadata, TarotQuestionsPageView } from "@/components/seo/tarot-questions-page"

export const metadata = getTarotQuestionHubMetadata("en")

export default function TarotQuestionsPage() {
  return <TarotQuestionsPageView locale="en" />
}
