"use client"

import useSWR from "swr"
import { z } from "zod"
import { useWatchlist } from "@/hooks/useWatchlist"
import { GET_MEDIA_BY_IDS } from "@/lib/api/queries/media"
import { RawMediaSchema } from "@/lib/schemas/anilist"
import { mapRawMedia } from "@/lib/mappers"
import { MediaCard } from "@/components/media-card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkSimple, Warning } from "@phosphor-icons/react"
import { useLanguage } from "@/hooks/useLanguage"

const ANILIST_URL = "https://graphql.anilist.co"

const watchlistResponseSchema = z.object({
  data: z.object({
    Page: z.object({
      media: z.array(RawMediaSchema),
    }),
  }),
})

// SWR Fetcher
async function fetcher([, ids]: [string, number[]]) {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: GET_MEDIA_BY_IDS,
      variables: { ids },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch watchlist details")
  }

  const json = await response.json()
  const parsed = watchlistResponseSchema.safeParse(json)

  if (!parsed.success) {
    console.error("[Watchlist Validation Error]:", parsed.error.format())
    throw new Error("Invalid response format from API")
  }

  return parsed.data.data.Page.media.map(mapRawMedia)
}

export function WatchlistGrid() {
  const { watchlist } = useWatchlist()
  const { t } = useLanguage()

  // Only run SWR query if there are watchlisted IDs
  const { data: mediaItems, error, isLoading } = useSWR(
    watchlist.length > 0 ? ["watchlist-items", watchlist] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // dedupe requests for 1 minute
    }
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Page Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-wider text-mist">
          {t("watchlistTitle")} <span className="text-mist/50">{t("watchlistTitleHighlight")}</span>
        </h1>
        <p className="text-sm text-mist/40 font-sans max-w-2xl">
          {t("watchlistDesc")}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-ink border border-white/5 rounded-sm text-center">
          <BookmarkSimple size={48} className="text-mist/20 mb-4" />
          <h3 className="font-heading text-lg font-bold text-mist mb-1">{t("watchlistEmpty")}</h3>
          <p className="text-sm text-mist/40">{t("watchlistEmptyDesc")}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-ink border border-destructive/20 rounded-sm text-center">
          <Warning size={48} className="text-destructive mb-4" />
          <h3 className="font-heading text-lg font-bold text-mist mb-1">{t("watchlistLoadError")}</h3>
          <p className="text-sm text-mist/40">{t("dataUnavailable")}</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: Math.min(watchlist.length, 5) }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3 w-full">
              <Skeleton className="aspect-[3/4] w-full bg-ink/60 rounded-sm" />
              <Skeleton className="h-4 w-3/4 bg-ink/60 rounded-sm" />
              <Skeleton className="h-3 w-1/2 bg-ink/60 rounded-sm mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mediaItems?.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default WatchlistGrid
