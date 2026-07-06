import type { Metadata } from "next"
import { Suspense } from "react"
import { Kanit, IBM_Plex_Sans_Thai, IBM_Plex_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { WatchlistProvider } from "@/components/watchlist-provider"
import { Header } from "@/components/header"
import "./globals.css"

const kanit = Kanit({
  variable: "--font-heading",
  weight: ["700", "800", "900"],
  subsets: ["latin"],
})

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Wuxify - Chinese Donghua & Manhua Releases",
  description: "Track new Chinese donghua and manhua releases, airing schedules, and title metadata in a clean Jade Broadcast interface.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSansThai.variable} ${kanit.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <WatchlistProvider>
              <div className="flex flex-col min-h-screen bg-void text-mist font-sans">
                <Suspense fallback={<div className="h-14 md:h-16 w-full border-b border-border bg-void/90" />}>
                  <Header />
                </Suspense>
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
              </div>
            </WatchlistProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
