"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { analyticsApi } from "@/lib/api"
import { getCurrentAttribution } from "@/lib/client-analytics"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const { language } = useLanguage()

  useEffect(() => {
    analyticsApi.track("page_view", {
      ...getCurrentAttribution(),
      path: `${pathname}${window.location.search}`,
      locale: language,
      metadata: {
        title: document.title,
      },
    })
  }, [language, pathname])

  return null
}
