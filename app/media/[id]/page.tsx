import { notFound } from "next/navigation"
import { anilistFetch } from "@/lib/api"
import { GET_MEDIA_BY_ID } from "@/lib/api/queries/media"
import { RawMediaSchema } from "@/lib/schemas/anilist"
import { mapRawMedia } from "@/lib/mappers"
import { MediaDetailsClient } from "@/components/media-details"

interface MediaDetailsPageProps {
  params: Promise<{ id: string }>
}

async function fetchMedia(id: number) {
  try {
    const rawData = await anilistFetch<{ Media: unknown }>(
      GET_MEDIA_BY_ID,
      { id },
      { revalidate: 86400 } // cache for 1 day
    )

    if (!rawData || !rawData.Media) return null

    const parsed = RawMediaSchema.safeParse(rawData.Media)
    if (!parsed.success) {
      console.error("[Zod Validation Error on Details Page]:", parsed.error.format())
      return null
    }

    return mapRawMedia(parsed.data)
  } catch (err) {
    console.error("[AniList Load Error on Details Page]:", err)
    return null
  }
}

export async function generateMetadata({ params }: MediaDetailsPageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  
  if (isNaN(id)) {
    return { title: "Invalid Title | Wuxify" }
  }

  const media = await fetchMedia(id)
  if (!media) {
    return { title: "Title Not Found | Wuxify" }
  }

  return {
    title: `${media.title} - Wuxify`,
    description: media.description
      ? media.description.replace(/<[^>]*>/g, "").slice(0, 160)
      : `Details for ${media.title}`,
    alternatives: {
      canonical: `/media/${id}`, // Canonical URL
    },
  }
}

export default async function MediaDetailsPage({ params }: MediaDetailsPageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)

  if (isNaN(id)) {
    notFound()
  }

  const media = await fetchMedia(id)
  if (!media) {
    notFound()
  }

  return <MediaDetailsClient media={media} />
}
