"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Media } from "@/types"
import React from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { WatchlistButton } from "@/components/watchlist-button"

interface MediaCardProps {
  media: Media
}

export function MediaCard({
  media,
}: MediaCardProps) {
  const { t } = useLanguage()
  // Format release year or start date
  const releaseYear = media.startDate?.year || t("unknown")

  return (
    <Link href={`/media/${media.id}`} className="group block w-full focus-visible:outline-none">
      <div
        className="relative cursor-pointer flex flex-col w-full bg-ink border border-white/5 group-hover:border-white/20 rounded-sm overflow-hidden transform group-hover:-translate-y-1.5 transition-[transform,border-color] duration-300 ease-out shadow-md select-none focus-within:ring-1 focus-within:ring-jade"
      >
        {/* Cover Image Container */}
        <div className="relative aspect-[3/4] w-full bg-void overflow-hidden">
          <Image
            src={media.coverImage}
            alt={`Cover image for ${media.title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-w-640px) 50vw, (max-w-1024px) 25vw, 220px"
          />

          {/* Pulse Signal Dot for Releasing (Airing) Titles */}
          {media.status === "RELEASING" && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-jade"></span>
              </span>
              <span className="font-mono text-[9px] font-bold text-mist uppercase tracking-wider">
                {media.nextAiringEpisode && media.nextAiringEpisode.episode - 1 >= 1
                  ? t("liveEpisode", { num: media.nextAiringEpisode.episode - 1 })
                  : t("live")}
              </span>
            </div>
          )}

          {/* Format Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <Badge
              variant="outline"
              className="bg-black/70 backdrop-blur-xs text-mist/80 border-white/10 rounded-sm font-mono text-[9px] uppercase py-0 px-1.5"
            >
              {media.format}
            </Badge>
          </div>

          {/* Watchlist Toggle Button (Overlay) */}
          <WatchlistButton
            mediaId={media.id}
            className="absolute top-2.5 right-2.5 size-8 hover:border-white/20"
          />

          {/* Dynamic Metadata Hover Overlay */}
          <div className="absolute inset-0 z-0 bg-black/90 p-4 opacity-0 group-hover:opacity-100 group-hover:z-10 transition-opacity duration-300 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-mist/70">
                {media.format} &bull; {releaseYear}
              </span>
              <p className="text-xs text-mist/80 font-sans line-clamp-6 leading-relaxed">
                {media.description
                  ? media.description.replace(/<[^>]*>/g, "") // Strip HTML tags for clean card description
                  : t("noDescription")}
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {media.genres.slice(0, 3).map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-white/5 hover:bg-white/10 text-mist/60 text-[9px] font-sans px-1 rounded-sm border border-white/5"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-3.5 flex flex-col gap-1 bg-ink flex-grow">
          <h3 className="font-heading text-sm font-bold text-mist group-hover:text-jade transition-colors duration-200 line-clamp-2 tracking-wide leading-snug">
            {media.title}
          </h3>
          <div className="flex items-center justify-between mt-auto pt-2 text-[11px] text-mist/40 font-mono">
            <span>{releaseYear}</span>
            <span
              className={`${
                media.status === "RELEASING"
                  ? "text-mist/70"
                  : media.status === "NOT_YET_RELEASED"
                  ? "text-mist/50"
                  : ""
              }`}
            >
              {media.status === "RELEASING"
                ? t("statusReleasing")
                : media.status === "NOT_YET_RELEASED"
                ? t("statusUpcoming")
                : media.status.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
export default MediaCard
