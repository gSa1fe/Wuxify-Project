import { describe, it, expect } from "vitest"
import { mapRawMedia, mapRawMediaPage } from "./index"
import { RawMedia } from "@/lib/schemas/anilist"

describe("Mappers", () => {
  const mockRawMedia: RawMedia = {
    id: 1,
    title: {
      romaji: "Mo Dao Zu Shi",
      english: "Grandmaster of Demonic Cultivation",
      native: "魔道祖师",
    },
    coverImage: {
      extraLarge: "https://s4.anilist.co/cover/xlarge.jpg",
      large: "https://s4.anilist.co/cover/large.jpg",
      medium: "https://s4.anilist.co/cover/medium.jpg",
    },
    bannerImage: "https://s4.anilist.co/banner.jpg",
    format: "ONA",
    status: "FINISHED",
    genres: ["Action", "Adventure", "Fantasy", "Mystery"],
    description: "After triggering a series of tragic events...",
    episodes: 15,
    chapters: null,
    siteUrl: "https://anilist.co/anime/101972",
    startDate: {
      year: 2018,
      month: 7,
      day: 9,
    },
    nextAiringEpisode: null,
  }

  it("maps raw media correctly with english title preference", () => {
    const mapped = mapRawMedia(mockRawMedia)

    expect(mapped.id).toBe(1)
    expect(mapped.title).toBe("Grandmaster of Demonic Cultivation")
    expect(mapped.titleRomaji).toBe("Mo Dao Zu Shi")
    expect(mapped.titleEnglish).toBe("Grandmaster of Demonic Cultivation")
    expect(mapped.titleNative).toBe("魔道祖师")
    expect(mapped.coverImage).toBe("https://s4.anilist.co/cover/xlarge.jpg")
    expect(mapped.format).toBe("ONA")
    expect(mapped.status).toBe("FINISHED")
    expect(mapped.genres).toEqual(["Action", "Adventure", "Fantasy", "Mystery"])
    expect(mapped.startDate?.year).toBe(2018)
    expect(mapped.nextAiringEpisode).toBeNull()
  })

  it("falls back to romaji title if english is missing", () => {
    const rawWithoutEnglish: RawMedia = {
      ...mockRawMedia,
      title: {
        romaji: "Mo Dao Zu Shi",
        english: null,
        native: "魔道祖师",
      },
    }

    const mapped = mapRawMedia(rawWithoutEnglish)
    expect(mapped.title).toBe("Mo Dao Zu Shi")
  })

  it("falls back to native title if both english and romaji are missing", () => {
    const rawWithOnlyNative: RawMedia = {
      ...mockRawMedia,
      title: {
        romaji: "",
        english: null,
        native: "魔道祖师",
      },
    }

    const mapped = mapRawMedia(rawWithOnlyNative)
    expect(mapped.title).toBe("魔道祖师")
  })

  it("maps raw media page correctly", () => {
    const mockRawPage = {
      media: [mockRawMedia],
      pageInfo: {
        total: 1,
        perPage: 10,
        currentPage: 1,
        lastPage: 1,
        hasNextPage: false,
      },
    }

    const mappedPage = mapRawMediaPage(mockRawPage)

    expect(mappedPage.media).toHaveLength(1)
    expect(mappedPage.media[0].title).toBe("Grandmaster of Demonic Cultivation")
    expect(mappedPage.pageInfo.total).toBe(1)
    expect(mappedPage.pageInfo.hasNextPage).toBe(false)
  })
})
