"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { env } from "@/lib/env"

// Suppress React 19 script tag warning in development due to next-themes theme FOUC injection script
if (typeof window !== "undefined" && env.NODE_ENV === "development") {
  const origError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return
    origError.apply(console, args)
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
