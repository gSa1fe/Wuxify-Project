"use client"

import { Info } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Media } from "@/types"
import { useLanguage } from "@/hooks/useLanguage"
import { MediaDetailsHeader } from "./media-details-header"
import { MediaDetailsStats } from "./media-details-stats"
import { MediaDetailsActions } from "./media-details-actions"

interface MediaDetailsClientProps {
  media: Media
}

export function MediaDetailsClient({ media }: MediaDetailsClientProps) {
  const { t } = useLanguage()

  const formattedDate = media.startDate
    ? [
        media.startDate.year,
        media.startDate.month ? String(media.startDate.month).padStart(2, "0") : null,
        media.startDate.day ? String(media.startDate.day).padStart(2, "0") : null,
      ]
        .filter(Boolean)
        .join("-")
    : t("unknown")

  const actionsBlock = (
    <MediaDetailsActions mediaId={media.id} siteUrl={media.siteUrl} />
  )

  return (
    <article className="min-h-screen bg-void text-mist" aria-labelledby="media-title">
      {/* Header Section (Banner, Cover, Title, mobile actions) */}
      <MediaDetailsHeader media={media} actionsNode={actionsBlock} />

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Separator className="mb-8 bg-white/5" />

        {/* Details & Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-mist/70 mb-3 flex items-center gap-1.5">
                <Info size={16} /> {t("description")}
              </h3>
              <div
                className="text-mist/85 leading-relaxed text-sm block prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: media.description || t("noDescription"),
                }}
              />
            </div>

            {/* Genres */}
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-mist/60 mb-3">
                {t("genres")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-white/5 text-mist/70 hover:bg-white/10 border border-white/5 rounded-sm text-xs py-1 px-3 font-sans"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions (Right) */}
          <div className="md:col-span-1">
            <MediaDetailsStats
              media={media}
              formattedDate={formattedDate}
              actionsNode={actionsBlock}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
