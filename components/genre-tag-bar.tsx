"use client"

import React, { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/hooks/useLanguage"
import { TranslationKey } from "@/lib/i18n/translations"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

// Available genres with translation key and API query value
interface GenreItem {
  key: TranslationKey
  value: string | null // null means 'ALL'
}

const GENRES: GenreItem[] = [
  { key: "genreAll", value: null },
  { key: "genreAction", value: "Action" },
  { key: "genreFantasy", value: "Fantasy" },
  { key: "genreRomance", value: "Romance" },
  { key: "genreComedy", value: "Comedy" },
  { key: "genreSupernatural", value: "Supernatural" },
  { key: "genreDrama", value: "Drama" },
  { key: "genreAdventure", value: "Adventure" },
  { key: "genreSciFi", value: "Sci-Fi" },
  { key: "genreMystery", value: "Mystery" },
  { key: "genreSliceOfLife", value: "Slice of Life" },
]

export function GenreTagBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const activeGenre = searchParams.get("genre") || null

  const handleGenreClick = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete("genre")
    } else {
      params.set("genre", value)
    }
    params.delete("page") // Reset page when filtering
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const target =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: target,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative w-full flex items-center bg-void border-y border-border/20 py-2.5 my-2">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 z-10 p-1 bg-void/90 text-mist/60 hover:text-jade hover:bg-white/5 rounded-sm transition-colors border border-border/10 mr-1 hidden sm:block cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade"
        aria-label="Scroll tags left"
      >
        <CaretLeft size={16} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none px-1 sm:px-8 w-full select-none"
      >
        {GENRES.map((genre) => {
          const isActive = activeGenre === genre.value
          return (
            <button
              key={genre.key}
              onClick={() => handleGenreClick(genre.value)}
              className={`inline-block px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-sm border cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade ${
                isActive
                  ? "bg-jade/10 border-jade text-jade shadow-sm shadow-jade/20"
                  : "bg-transparent border-border/20 text-mist/55 hover:border-white/20 hover:text-mist hover:bg-white/5"
              }`}
            >
              {t(genre.key)}
            </button>
          )
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 p-1 bg-void/90 text-mist/60 hover:text-jade hover:bg-white/5 rounded-sm transition-colors border border-border/10 ml-1 hidden sm:block cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade"
        aria-label="Scroll tags right"
      >
        <CaretRight size={16} />
      </button>
    </div>
  )
}

export default GenreTagBar
