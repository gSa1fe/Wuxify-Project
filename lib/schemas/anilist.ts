import { z } from "zod"

export const RawFuzzyDateSchema = z.object({
  year: z.number().nullable(),
  month: z.number().nullable(),
  day: z.number().nullable(),
}).nullable()

export const RawAiringScheduleSchema = z.object({
  airingAt: z.number(),
  timeUntilAiring: z.number(),
  episode: z.number(),
}).nullable()

export const RawMediaTitleSchema = z.object({
  romaji: z.string(),
  english: z.string().nullable(),
  native: z.string().nullable(),
})

export const RawMediaCoverImageSchema = z.object({
  extraLarge: z.string().nullable(),
  large: z.string().nullable(),
  medium: z.string().nullable(),
})

export const RawMediaSchema = z.object({
  id: z.number(),
  title: RawMediaTitleSchema,
  coverImage: RawMediaCoverImageSchema,
  bannerImage: z.string().nullable(),
  format: z.string().nullable(),
  status: z.string().nullable(),
  genres: z.array(z.string()),
  description: z.string().nullable(),
  episodes: z.number().nullable(),
  chapters: z.number().nullable(),
  siteUrl: z.string(),
  startDate: RawFuzzyDateSchema,
  nextAiringEpisode: RawAiringScheduleSchema,
})

export const RawPageInfoSchema = z.object({
  total: z.number(),
  perPage: z.number(),
  currentPage: z.number(),
  lastPage: z.number(),
  hasNextPage: z.boolean(),
})

export const RawMediaPageSchema = z.object({
  media: z.array(RawMediaSchema),
  pageInfo: RawPageInfoSchema,
})

export type RawMedia = z.infer<typeof RawMediaSchema>
export type RawMediaPage = z.infer<typeof RawMediaPageSchema>
