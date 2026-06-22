"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { detectLocaleFromAcceptLanguage, isLocale, localeLabels, type Locale } from "@/lib/locales"

export type Language = Locale

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 语言配置
export const LANGUAGES = {
  zh: { name: localeLabels.zh, flag: "🇨🇳" },
  en: { name: localeLabels.en, flag: "🇺🇸" },
  ja: { name: localeLabels.ja, flag: "🇯🇵" },
  ko: { name: localeLabels.ko, flag: "🇰🇷" },
} as const

// 导入翻译数据
import { translations } from "@/lib/translations"

// 翻译数据类型
type Translations = Record<string, any>
type AllTranslations = Record<Language, Translations>

// 翻译数据
const translationsData: AllTranslations = translations

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Render immediately in English so static HTML contains crawlable content.
  // Saved or detected preferences are applied after hydration.
  const [language, setLanguageState] = useState<Language>("en")

  // 初始化语言设置
  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem("poptarot_language") as Language
      
      // 1. 如果有保存的偏好，直接使用
      if (savedLang && isLocale(savedLang)) {
        setLanguageState(savedLang)
        return
      }

      // 2. 如果没有保存的偏好，使用服务端从 Vercel/Cloudflare 地区和 Accept-Language 识别
      try {
        const response = await fetch("/api/i18n/detect", { cache: "no-store" })
        const data = await response.json()
        const detectedLang = isLocale(data.locale) ? data.locale : detectLocaleFromAcceptLanguage(navigator.language)
        setLanguageState(detectedLang)
      } catch (error) {
        console.error("Language detection failed:", error)
        // 4. 兜底逻辑：浏览器语言 -> 英文
        setLanguageState(detectLocaleFromAcceptLanguage(navigator.language))
      }
    }

    initLanguage()
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  // 设置语言并保存到 localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("poptarot_language", lang)
  }, [])

  // 翻译函数
  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      let value: any = translationsData[language]

      for (const k of keys) {
        if (value && typeof value === "object") {
          value = value[k]
        } else {
          // 如果找不到翻译，返回 key 或尝试使用中文翻译
          if (language !== "zh") {
            let zhValue: any = translationsData["zh"]
            for (const k2 of keys) {
              if (zhValue && typeof zhValue === "object") {
                zhValue = zhValue[k2]
              } else {
                return key
              }
            }
            return typeof zhValue === "string" ? zhValue : key
          }
          return key
        }
      }

      return typeof value === "string" ? value : key
    },
    [language]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
