"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"
import { isSeoLocale } from "@/lib/locales"

function analyticsLocale(pathname: string | null, language: string) {
  const segment = pathname?.split("/").filter(Boolean)[0] || ""
  return isSeoLocale(segment) ? segment : language
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { language } = useLanguage()

  useEffect(() => {
    analyticsApi.track("page_view", {
      ...getCurrentAttribution(),
      path: `${pathname}${window.location.search}`,
      locale: analyticsLocale(pathname, language),
      metadata: {
        title: document.title,
      },
    })
  }, [language, pathname])

  return null
}
