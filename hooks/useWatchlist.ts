"use client"

import { useState, useEffect } from "react"

const WATCHLIST_KEY = "wuxify-watchlist"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<number[]>([])

  // Load from LocalStorage on mount to avoid hydration mismatch in SSR
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        Promise.resolve().then(() => {
          setWatchlist(parsed)
        })
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

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatchlisted,
  }
}
