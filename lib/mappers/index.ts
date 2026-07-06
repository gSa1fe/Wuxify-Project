import { Media, MediaPage } from "@/types"
import { RawMedia, RawMediaPage } from "@/lib/schemas/anilist"

export function mapRawMedia(raw: RawMedia): Media {
  const title = raw.title.english || raw.title.romaji || raw.title.native || "Unknown Title"
  const coverImage = raw.coverImage.extraLarge || raw.coverImage.large || raw.coverImage.medium || "/placeholder-cover.jpg"

  return {
    id: raw.id,
    title,
    titleRomaji: raw.title.romaji,
    titleEnglish: raw.title.english,
    titleNative: raw.title.native || "",
    coverImage,
    bannerImage: raw.bannerImage,
    format: raw.format || "TBA",
    status: raw.status || "UNKNOWN",
    genres: raw.genres,
    description: raw.description,
    episodes: raw.episodes,
    chapters: raw.chapters,
    siteUrl: raw.siteUrl,
    startDate: raw.startDate
      ? {
          year: raw.startDate.year,
          month: raw.startDate.month,
          day: raw.startDate.day,
        }
      : null,
    nextAiringEpisode: raw.nextAiringEpisode
      ? {
          airingAt: raw.nextAiringEpisode.airingAt,
          timeUntilAiring: raw.nextAiringEpisode.timeUntilAiring,
          episode: raw.nextAiringEpisode.episode,
        }
      : null,
  }
}

export function mapRawMediaPage(raw: RawMediaPage): MediaPage {
  return {
    media: raw.media.map(mapRawMedia),
    pageInfo: {
      total: raw.pageInfo.total,
      perPage: raw.pageInfo.perPage,
      currentPage: raw.pageInfo.currentPage,
      lastPage: raw.pageInfo.lastPage,
      hasNextPage: raw.pageInfo.hasNextPage,
    },
  }
}
