"use client"

import React, { createContext, useState, useEffect } from "react"

interface WatchlistContextType {
  watchlist: number[]
  addToWatchlist: (id: number) => void
  removeFromWatchlist: (id: number) => void
  isWatchlisted: (id: number) => boolean
}

export const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

const WATCHLIST_KEY = "wuxify-watchlist"

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<number[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          Promise.resolve().then(() => {
            setWatchlist(parsed)
          })
        }
      }
    } catch (e) {
      console.error("Failed to load watchlist from localStorage", e)
    }
  }, [])

  const addToWatchlist = (id: number) => {
    setWatchlist((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next))
      } catch (e) {
        console.error("Failed to save watchlist to localStorage", e)
      }
      return next
    })
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => {
      const next = prev.filter((item) => item !== id)
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next))
      } catch (e) {
        console.error("Failed to save watchlist to localStorage", e)
      }
      return next
    })
  }

  const isWatchlisted = (id: number) => {
    return watchlist.includes(id)
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isWatchlisted,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}
