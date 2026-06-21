import { detectLocaleFromAcceptLanguage, detectLocaleFromCountry } from "@/lib/locales"

export async function GET(req: Request) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code")
  const locale = detectLocaleFromCountry(country) || detectLocaleFromAcceptLanguage(req.headers.get("accept-language"))

  return Response.json({ locale, country: country || null })
}
