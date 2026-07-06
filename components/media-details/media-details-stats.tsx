"use client"

import { Media } from "@/types"
import { Calendar, Video, BookOpen } from "@phosphor-icons/react"
import { useLanguage } from "@/hooks/useLanguage"
import React from "react"

interface MediaDetailsStatsProps {
  media: Media
  formattedDate: string
  actionsNode?: React.ReactNode
}

export function MediaDetailsStats({
  media,
  formattedDate,
  actionsNode,
}: MediaDetailsStatsProps) {
  const { t } = useLanguage()

  const latestEpisode =
    media.status === "RELEASING" &&
    media.nextAiringEpisode &&
    media.nextAiringEpisode.episode - 1 >= 1
      ? media.nextAiringEpisode.episode - 1
      : null

  return (
    <div className="flex flex-col gap-5 bg-black/50 p-5 rounded-sm border border-white/5 h-fit shadow-md">
      <div>
        <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-mist/40 mb-4">
          {t("releaseInfo")}
        </h4>
        <div className="flex flex-col gap-4 text-xs">
          <div className="flex items-center gap-2 text-mist/70">
            <Calendar size={16} className="text-mist/50" />
            <span>
              {t("start")}: {formattedDate}
            </span>
          </div>
          {latestEpisode !== null && (
            <div className="flex items-center gap-2 text-mist/70">
              <Video size={16} className="text-mist/50" />
              <span>
                {t("latestEpisode")}: {t("episodeNum", { num: latestEpisode })}
              </span>
            </div>
          )}
          {media.episodes !== null && (
            <div className="flex items-center gap-2 text-mist/70">
              <Video size={16} className="text-mist/50" />
              <span>
                {t("episodes")}: {media.episodes}
              </span>
            </div>
          )}
          {media.chapters !== null && (
            <div className="flex items-center gap-2 text-mist/70">
              <BookOpen size={16} className="text-mist/50" />
              <span>
                {t("chapters")}: {media.chapters}
              </span>
            </div>
          )}
          {media.nextAiringEpisode && (
            <div className="flex flex-col gap-1.5 p-3 rounded bg-white/5 border border-white/10 mt-1">
              <span className="text-[10px] text-mist/60 font-mono uppercase tracking-wider">
                {t("nextAiring")}
              </span>
              <span className="font-semibold text-mist">
                {t("episode")} {media.nextAiringEpisode.episode}
              </span>
              <span className="text-[10px] text-mist/50">
                {t("inDays", {
                  days: Math.ceil(media.nextAiringEpisode.timeUntilAiring / 86400),
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Render Actions for Desktop if provided */}
      {actionsNode && (
        <div className="hidden md:flex flex-col gap-2 mt-2">
          {actionsNode}
        </div>
      )}
    </div>
  )
}
