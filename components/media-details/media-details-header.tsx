"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Media } from "@/types"
import { useLanguage } from "@/hooks/useLanguage"
import React from "react"

interface MediaDetailsHeaderProps {
  media: Media
  actionsNode?: React.ReactNode
}

export function MediaDetailsHeader({ media, actionsNode }: MediaDetailsHeaderProps) {
  const { t } = useLanguage()

  return (
    <>
      {/* Banner Section */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full bg-gradient-to-r from-black to-ink overflow-hidden border-b border-white/5">
        {media.bannerImage ? (
          <Image
            src={media.bannerImage}
            alt={`${media.title} Banner`}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-ink to-black opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      </div>

      {/* Info Grid (Title, Cover, Badges) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-20 md:-mt-24 z-10">
        <div className="flex gap-4 md:gap-6 items-end">
          {/* Cover Image */}
          <div className="relative w-28 h-40 sm:w-36 sm:h-52 md:w-40 md:h-60 shrink-0 rounded-sm overflow-hidden border-2 border-white/20 shadow-xl bg-black">
            <Image
              src={media.coverImage}
              alt={media.title}
              fill
              className="object-cover"
              sizes="(max-w-768px) 112px, 160px"
              priority
            />
          </div>

          {/* Title & Metadata */}
          <div className="flex flex-col justify-end gap-2 pb-2 md:pb-4 flex-grow">
            <h1 id="media-title" className="font-heading text-xl sm:text-2xl md:text-4xl font-black text-mist leading-tight tracking-wide">
              {media.title}
            </h1>
            <div className="flex flex-col text-[10px] md:text-xs text-mist/60 gap-0.5">
              {media.titleRomaji !== media.title && (
                <span className="font-mono">Romaji: {media.titleRomaji}</span>
              )}
              {media.titleNative && (
                <span className="font-sans">Chinese: {media.titleNative}</span>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-1.5 mt-1 md:mt-2">
              <Badge variant="outline" className="bg-black text-mist/80 border-white/10 rounded-sm font-mono text-[9px] md:text-[10px] uppercase py-0.5 px-2">
                {media.format}
              </Badge>
              <Badge
                variant="outline"
                className={`bg-black rounded-sm font-mono text-[9px] md:text-[10px] uppercase py-0.5 px-2 ${
                  media.status === "RELEASING"
                    ? "text-mist/80 border-white/15"
                    : media.status === "NOT_YET_RELEASED"
                    ? "text-mist/60 border-white/10"
                    : "text-mist/50 border-white/5"
                }`}
              >
                {media.status === "RELEASING"
                  ? t("statusReleasing")
                  : media.status === "NOT_YET_RELEASED"
                  ? t("statusUpcoming")
                  : media.status.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Render Actions for Mobile if provided */}
        {actionsNode && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:hidden">
            {actionsNode}
          </div>
        )}
      </div>
    </>
  )
}
