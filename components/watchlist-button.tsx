"use client"

import React from "react"
import { useWatchlist } from "@/hooks/useWatchlist"
import { useLanguage } from "@/hooks/useLanguage"
import { Bookmark, BookmarkSimple } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface WatchlistButtonProps {
  mediaId: number
  className?: string
  iconSize?: number
}

export function WatchlistButton({
  mediaId,
  className,
  iconSize = 16,
}: WatchlistButtonProps) {
  const { isWatchlisted, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const { t } = useLanguage()
  const watchlisted = isWatchlisted(mediaId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (watchlisted) {
      removeFromWatchlist(mediaId)
    } else {
      addToWatchlist(mediaId)
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "z-20 flex items-center justify-center rounded-sm bg-black/70 hover:bg-white/10 text-mist/70 hover:text-jade border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade cursor-pointer",
        className
      )}
      aria-label={watchlisted ? t("removeWatchlist") : t("addWatchlist")}
    >
      {watchlisted ? (
        <Bookmark size={iconSize} weight="fill" className="text-mist" />
      ) : (
        <BookmarkSimple size={iconSize} />
      )}
    </button>
  )
}

export default WatchlistButton
