"use client"

import React, { createContext, useState, useEffect } from "react"
import { translations, Language, TranslationKey } from "@/lib/i18n/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th")
  const [mounted, setMounted] = useState(false)

  // Load language from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    const savedLanguage = localStorage.getItem("wuxify-lang") as Language
    Promise.resolve().then(() => {
      if (savedLanguage === "en" || savedLanguage === "th") {
        setLanguageState(savedLanguage)
      }
      setMounted(true)
    })
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("wuxify-lang", lang)
    // Synchronize HTML lang attribute
    document.documentElement.lang = lang
  }

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    // If not mounted yet, render default 'th' values to prevent hydration mismatch
    const activeLang = mounted ? language : "th"
    const dict = translations[activeLang] || translations.th
    const text = (dict[key] || translations.th[key] || String(key)) as string

    if (!variables) return text

    return Object.entries(variables).reduce((acc, [varName, varValue]) => {
      return acc.replace(new RegExp(`{${varName}}`, "g"), String(varValue))
    }, text)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
