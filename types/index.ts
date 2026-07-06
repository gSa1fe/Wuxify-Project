export interface FuzzyDate {
  year: number | null
  month: number | null
  day: number | null
}

export interface AiringSchedule {
  airingAt: number
  timeUntilAiring: number
  episode: number
}

export interface Media {
  id: number
  title: string
  titleRomaji: string
  titleEnglish: string | null
  titleNative: string
  coverImage: string
  bannerImage: string | null
  format: string
  status: string
  genres: string[]
  description: string | null
  episodes: number | null
  chapters: number | null
  siteUrl: string
  startDate: FuzzyDate | null
  nextAiringEpisode: AiringSchedule | null
}

export interface MediaPage {
  media: Media[]
  pageInfo: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    hasNextPage: boolean
  }
}
