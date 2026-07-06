export const GET_NEW_RELEASES = `
  query GetNewReleases(
    $page: Int
    $perPage: Int
    $type: MediaType
    $statusIn: [MediaStatus]
    $search: String
    $sort: [MediaSort]
    $genreIn: [String]
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        countryOfOrigin: CN
        type: $type
        status_in: $statusIn
        search: $search
        sort: $sort
        genre_in: $genreIn
      ) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        format
        status
        genres
        description
        episodes
        chapters
        siteUrl
        startDate {
          year
          month
          day
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`

export const GET_MEDIA_BY_IDS = `
  query GetMediaByIds($ids: [Int]) {
    Page {
      media(id_in: $ids) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
        }
        bannerImage
        format
        status
        genres
        description
        episodes
        chapters
        siteUrl
        startDate {
          year
          month
          day
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`

export const GET_MEDIA_BY_ID = `
  query GetMediaById($id: Int) {
    Media(id: $id) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        medium
      }
      bannerImage
      format
      status
      genres
      description
      episodes
      chapters
      siteUrl
      startDate {
        year
        month
        day
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
    }
  }
`

