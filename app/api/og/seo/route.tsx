import { type NextRequest } from "next/server"
import { defaultLocale, isSeoLocale } from "@/lib/locales"
import { renderSeoOgImage } from "@/lib/seo-og-image"
import { getSeoPage } from "@/lib/seo-pages"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || ""
  const localeParam = request.nextUrl.searchParams.get("locale") || defaultLocale
  const locale = isSeoLocale(localeParam) ? localeParam : defaultLocale
  const page = getSeoPage(slug, locale)

  if (!page) {
    return new Response("Not found", { status: 404 })
  }

  const response = renderSeoOgImage(page)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
