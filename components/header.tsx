"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Compass, BookmarkSimple, MagnifyingGlass } from "@phosphor-icons/react"
import { useLanguage } from "@/hooks/useLanguage"

function LanguageSwitcher({
  language,
  setLanguage,
}: {
  language: string
  setLanguage: (lang: "en" | "th") => void
}) {
  return (
    <div className="flex items-center gap-0.5 bg-ink border border-border/80 rounded-sm p-0.5 font-mono text-[9px] font-bold shadow-inner">
      <button
        onClick={() => setLanguage("en")}
        className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors focus-visible:outline-none ${language === "en"
          ? "bg-white/10 text-mist"
          : "text-mist/40 hover:text-jade"
          }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("th")}
        className={`px-1.5 py-0.5 rounded-[1px] cursor-pointer transition-colors focus-visible:outline-none ${language === "th"
          ? "bg-white/10 text-mist"
          : "text-mist/40 hover:text-jade"
          }`}
        aria-label="เปลี่ยนเป็นภาษาไทย"
      >
        TH
      </button>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, setLanguage, t } = useLanguage()

  const isSearchOpen = searchParams.get("searchOpen") === "true"

  const handleSearchToggle = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get("searchOpen") === "true") {
      params.delete("searchOpen")
    } else {
      params.set("searchOpen", "true")
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <>
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-void/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade">
            <Image
              src="/icon.jpg"
              alt="Wuxify icon"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-heading text-xl font-black tracking-wider text-mist">
              WUXI<span className="text-jade">FY</span>
            </span>
          </Link>

          {/* Desktop: Nav + Language */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4" aria-label="Main Navigation">
              <Link
                href="/"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-jade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade px-2.5 py-1.5 rounded-sm ${pathname === "/" ? "text-mist font-semibold" : "text-mist/50"
                  }`}
              >
                <Compass size={18} />
                <span>{t("browse")}</span>
              </Link>
              <Link
                href="/watchlist"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-jade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade px-2.5 py-1.5 rounded-sm ${pathname === "/watchlist" ? "text-mist font-semibold" : "text-mist/50"
                  }`}
              >
                <BookmarkSimple size={18} />
                <span>{t("watchlist")}</span>
              </Link>
              <button
                onClick={handleSearchToggle}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-jade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade px-2.5 py-1.5 rounded-sm cursor-pointer ${isSearchOpen ? "text-jade font-semibold" : "text-mist/50"
                  }`}
                aria-label="Toggle search and filters"
              >
                <MagnifyingGlass size={18} />
                <span>{t("search")}</span>
              </button>
            </nav>

            <div className="h-4 w-px bg-border/40" />

            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>

          {/* Mobile: Search + Language */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleSearchToggle}
              className={`p-2 rounded-sm cursor-pointer transition-colors hover:text-jade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade ${isSearchOpen ? "text-jade" : "text-mist/50"
                }`}
              aria-label="Toggle search and filters"
            >
              <MagnifyingGlass size={20} />
            </button>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/5 bg-void/95 backdrop-blur-md"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-stretch h-14">
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors relative ${pathname === "/"
              ? "text-jade"
              : "text-mist/40 active:text-mist/70"
              }`}
          >
            {/* Active indicator line */}
            {pathname === "/" && (
              <span className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-jade rounded-b-full" />
            )}
            <Compass size={22} weight={pathname === "/" ? "fill" : "regular"} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              {t("browse")}
            </span>
          </Link>

          <div className="w-px my-3 bg-white/5" />

          <Link
            href="/watchlist"
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors relative ${pathname === "/watchlist"
              ? "text-jade"
              : "text-mist/40 active:text-mist/70"
              }`}
          >
            {pathname === "/watchlist" && (
              <span className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-jade rounded-b-full" />
            )}
            <BookmarkSimple size={22} weight={pathname === "/watchlist" ? "fill" : "regular"} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              {t("watchlist")}
            </span>
          </Link>
        </div>
      </nav>
    </>
  )
}
