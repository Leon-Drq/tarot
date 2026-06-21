export const locales = ["zh", "en", "ja", "ko"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
}

export const localeOpenGraph: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
  ja: "ja_JP",
  ko: "ko_KR",
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function localePath(locale: Locale, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`
}

export function detectLocaleFromCountry(country: string | null | undefined): Locale | null {
  const code = country?.toUpperCase()
  if (!code) return null
  if (["CN", "HK", "MO", "TW", "SG"].includes(code)) return "zh"
  if (code === "JP") return "ja"
  if (code === "KR") return "ko"
  return "en"
}

export function detectLocaleFromAcceptLanguage(header: string | null | undefined): Locale {
  const value = header?.toLowerCase() || ""
  if (value.includes("zh")) return "zh"
  if (value.includes("ja")) return "ja"
  if (value.includes("ko")) return "ko"
  return "en"
}
