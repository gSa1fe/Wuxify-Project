"use client"

import { BookmarkSimple, Bookmark, ArrowSquareOut } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage"
import { useWatchlist } from "@/hooks/useWatchlist"

interface MediaDetailsActionsProps {
  mediaId: number
  siteUrl: string
}

export function MediaDetailsActions({
  mediaId,
  siteUrl,
}: MediaDetailsActionsProps) {
  const { t } = useLanguage()
  const { isWatchlisted, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const watchlisted = isWatchlisted(mediaId)

  const handleToggleWatchlist = () => {
    if (watchlisted) {
      removeFromWatchlist(mediaId)
    } else {
      addToWatchlist(mediaId)
    }
  }

  return (
    <>
      {/* Watchlist toggle */}
      <Button
        onClick={handleToggleWatchlist}
        variant={watchlisted ? "outline" : "default"}
        className={`w-full rounded-sm font-heading font-black tracking-wide text-xs flex items-center justify-center gap-2 h-9 transition-colors ${
          watchlisted
            ? "bg-jade/10 border border-jade/30 text-jade hover:bg-jade/20 hover:border-jade/50 hover:text-jade"
            : "bg-primary text-primary-foreground hover:bg-primary/80"
        }`}
      >
        {watchlisted ? (
          <>
            <Bookmark size={16} weight="fill" />
            {t("removeWatchlist")}
          </>
        ) : (
          <>
            <BookmarkSimple size={16} />
            {t("addWatchlist")}
          </>
        )}
      </Button>

      {/* External link to AniList */}
      <Button
        nativeButton={false}
        variant="outline"
        className="w-full rounded-sm text-xs font-heading font-black tracking-wide border-white/10 text-mist/80 hover:bg-white/5 hover:text-jade flex items-center justify-center gap-2 h-9"
        render={<a href={siteUrl} target="_blank" rel="noopener noreferrer" />}
      >
        <ArrowSquareOut size={16} />
        {t("viewAnilist")}
      </Button>
    </>
  )
}
