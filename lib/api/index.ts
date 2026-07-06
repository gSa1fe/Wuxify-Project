export interface AniListFetchOptions {
  revalidate?: number
  tags?: string[]
}

export class AniListError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Array<{ message: string }>
  ) {
    super(message)
    this.name = "AniListError"
  }
}

export async function anilistFetch<T, V extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: V,
  options: AniListFetchOptions = {}
): Promise<T> {
  const ANILIST_URL = "https://graphql.anilist.co"

  const revalidate = options.revalidate !== undefined ? options.revalidate : 86400 // default 1 day

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate,
      tags: options.tags,
    },
  }

  try {
    const res = await fetch(ANILIST_URL, requestOptions)

    // Check rate limit remaining header if present
    const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining")
    if (rateLimitRemaining !== null) {
      const remaining = parseInt(rateLimitRemaining, 10)
      if (remaining <= 5) {
        console.warn(`[AniList API] Warning: Close to rate limit. X-RateLimit-Remaining: ${remaining}`)
      }
    }

    if (res.status === 429) {
      const retryAfterHeader = res.headers.get("Retry-After")
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
      console.error(`[AniList API] 429 Rate limit exceeded. Retry after ${retryAfter} seconds.`)
      throw new AniListError(`Rate limit exceeded. Please retry after ${retryAfter} seconds.`, 429)
    }

    if (!res.ok) {
      console.error(`[AniList API] Network error: HTTP status ${res.status}`)
      throw new AniListError(`Network error: ${res.statusText}`, res.status)
    }

    const json = await res.json()

    if (json.errors) {
      console.error("[AniList API] GraphQL Errors:", JSON.stringify(json.errors, null, 2))
      throw new AniListError("GraphQL query execution failed", res.status, json.errors)
    }

    return json.data as T
  } catch (err) {
    if (err instanceof AniListError) {
      throw err
    }
    const errorMsg = err instanceof Error ? err.message : "Unknown error occurred"
    console.error("[AniList API] Unexpected request error:", errorMsg)
    throw new AniListError(`API request failed: ${errorMsg}`)
  }
}
