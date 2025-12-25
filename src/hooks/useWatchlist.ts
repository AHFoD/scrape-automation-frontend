import { useState, useEffect } from 'react'

const WATCHLIST_KEY = 'nav-dashboard-watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(WATCHLIST_KEY)
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading watchlist:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
    }
  }, [watchlist, isLoaded])

  const toggleWatchlist = (fundAbbr: string) => {
    setWatchlist((prev) => {
      if (prev.includes(fundAbbr)) {
        return prev.filter((f) => f !== fundAbbr)
      } else {
        return [...prev, fundAbbr]
      }
    })
  }

  const isFavorite = (fundAbbr: string) => watchlist.includes(fundAbbr)

  const clearWatchlist = () => setWatchlist([])

  return {
    watchlist,
    toggleWatchlist,
    isFavorite,
    clearWatchlist,
    isLoaded,
  }
}
