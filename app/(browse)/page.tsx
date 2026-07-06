import { anilistFetch } from "@/lib/api"
import { GET_NEW_RELEASES } from "@/lib/api/queries/media"
import { RawMediaPageSchema } from "@/lib/schemas/anilist"
import { mapRawMediaPage } from "@/lib/mappers"
import { MediaGrid } from "@/components/media-grid"
import { Warning } from "@phosphor-icons/react/dist/ssr"
import { Media, MediaPage } from "@/types"

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = "force-dynamic"

interface ParsedFilters {
  page: number
  perPage: number
  type?: "ANIME" | "MANGA"
  search?: string
  genre?: string
  sort: string[]
  statusIn?: string[]
}

// Helper to parse search parameters into sanitized filters
function parseFilters(params: Record<string, string | string[] | undefined>): ParsedFilters {
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1
  const perPage = 20

  const type =
    params.type === "ANIME" || params.type === "MANGA"
      ? params.type
      : undefined

  const search =
    typeof params.search === "string" && params.search.trim()
      ? params.search.trim()
      : undefined

  const genre =
    typeof params.genre === "string" && params.genre.trim()
      ? params.genre.trim()
      : undefined

  const rawSort = typeof params.sort === "string" ? params.sort : "UPDATED_AT_DESC"
  const sort = [rawSort]

  // Default definition of "new releases" filters for status: prefer RELEASING and NOT_YET_RELEASED
  let statusIn: string[] | undefined = ["RELEASING", "NOT_YET_RELEASED"]
  if (params.status === "RELEASING") {
    statusIn = ["RELEASING"]
  } else if (params.status === "NOT_YET_RELEASED") {
    statusIn = ["NOT_YET_RELEASED"]
  } else if (params.status === "ALL") {
    statusIn = undefined
  }

  return { page, perPage, type, search, genre, sort, statusIn }
}

// Fetch featured media for the top banner (Page 1, default view only)
async function fetchFeaturedMedia(filters: ParsedFilters): Promise<Media[] | null> {
  const { page, search, genre } = filters
  if (page !== 1 || search || genre) return null

  try {
    const bannerData = await anilistFetch<{ Page: unknown }>(
      GET_NEW_RELEASES,
      {
        page: 1,
        perPage: 24, // 3 slides * 8 items
        sort: ["POPULARITY_DESC"],
        statusIn: ["RELEASING", "NOT_YET_RELEASED"],
      },
      {
        revalidate: 3600, // cache for 1 hour
      }
    )

    const parsed = RawMediaPageSchema.safeParse(bannerData.Page)
    if (parsed.success) {
      return mapRawMediaPage(parsed.data).media
    } else {
      console.error("[Zod Banner Validation Error]:", parsed.error.format())
    }
  } catch (err) {
    console.error("[AniList Banner Load Error]:", err)
  }
  return null
}

// Fetch catalog media list matching filters
async function fetchCatalogMedia(filters: ParsedFilters): Promise<{ data: MediaPage | null; error: string | null }> {
  const { page, perPage, type, statusIn, search, sort, genre } = filters

  try {
    const rawData = await anilistFetch<{ Page: unknown }>(
      GET_NEW_RELEASES,
      {
        page,
        perPage,
        type,
        statusIn,
        search,
        sort,
        genreIn: genre ? [genre] : undefined,
      },
      {
        revalidate: search ? 300 : 3600, // shorter cache when searching
      }
    )

    // Validate using Zod
    const parsed = RawMediaPageSchema.safeParse(rawData.Page)
    if (parsed.success) {
      return { data: mapRawMediaPage(parsed.data), error: null }
    } else {
      console.error("[Zod Validation Error]:", parsed.error.format())
      return { data: null, error: "Data format received from API is invalid." }
    }
  } catch (err) {
    console.error("[AniList Load Error]:", err)
    return { data: null, error: "Data temporarily unavailable, please try again later." }
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const filters = parseFilters(resolvedSearchParams)

  // Fetch banner data and catalog list in parallel
  const [featuredMedia, catalogResult] = await Promise.all([
    fetchFeaturedMedia(filters),
    fetchCatalogMedia(filters),
  ])

  return (
    <>
      {catalogResult.error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-ink border border-destructive/20 rounded-sm text-center">
          <Warning size={48} className="text-destructive mb-4" />
          <h3 className="font-heading text-lg font-bold text-mist mb-1">Could not load content</h3>
          <p className="text-sm text-mist/40 max-w-md">{catalogResult.error}</p>
        </div>
      ) : catalogResult.data ? (
        <MediaGrid initialData={catalogResult.data} featuredMedia={featuredMedia || undefined} />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-ink border border-white/5 rounded-sm text-center">
          <h3 className="font-heading text-lg font-bold text-mist mb-1">No data available</h3>
        </div>
      )}
    </>
  )
}
