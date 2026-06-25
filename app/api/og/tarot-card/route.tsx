import { type NextRequest } from "next/server"
import { defaultLocale, isSeoLocale } from "@/lib/locales"
import { renderTarotCardOgImage } from "@/lib/seo-og-image"
import { getCardBySlug, getTarotCardSeoPage } from "@/lib/tarot-card-seo"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("card") || ""
  const localeParam = request.nextUrl.searchParams.get("locale") || defaultLocale
  const locale = isSeoLocale(localeParam) ? localeParam : defaultLocale
  const card = getCardBySlug(slug)

  if (!card) {
    return new Response("Not found", { status: 404 })
  }

  const page = getTarotCardSeoPage(card, locale)
  const response = renderTarotCardOgImage(page)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
