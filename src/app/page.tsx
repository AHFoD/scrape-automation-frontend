'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useWatchlist } from '@/hooks/useWatchlist'
import NavTable from '@/components/NavTable'
import NavChanges from '@/components/NavChanges'
import Analytics from '@/components/Analytics'
import NavChart from '@/components/NavChart'
import TopPerformers from '@/components/TopPerformers'
import FundDetailsModal from '@/components/FundDetailsModal'
import Watchlist from '@/components/Watchlist'

interface NavPrice {
  id: number
  fund_name: string
  fund_abbr: string
  nav: number
  chg: string
  chg_pct: string
  date: string
  created_at: string
}

interface NavChange {
  id: number
  fund_name: string
  fund_abbr: string
  nav_old: number
  nav_new: number
  change: number
  change_pct: number
  date: string
}

interface ScrapeRun {
  id: number
  timestamp: string
  status: string
  row_count: number
  error_message: string | null
}

export default function Home() {
  const [navData, setNavData] = useState<NavPrice[]>([])
  const [changes, setChanges] = useState<NavChange[]>([])
  const [lastScrape, setLastScrape] = useState<ScrapeRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedFund, setSelectedFund] = useState<NavPrice | null>(null)
  const [showFundModal, setShowFundModal] = useState(false)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const { watchlist, toggleWatchlist, isFavorite, clearWatchlist, isLoaded } = useWatchlist()

  useEffect(() => {
    fetchData()
    // Set up real-time subscriptions
    const navSubscription = supabase
      .channel('public:nav_prices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nav_prices' }, () => {
        fetchAvailableDates()
        if (!selectedDate) fetchNavData()
      })
      .subscribe()

    return () => {
      navSubscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchNavDataForDate(selectedDate)
    }
  }, [selectedDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      await Promise.all([fetchAvailableDates(), fetchNavData(), fetchChanges(), fetchLastScrape()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableDates = async () => {
    const { data, error } = await supabase
      .from('nav_prices')
      .select('date')
      .order('date', { ascending: false })
      .limit(100)

    if (error) throw error
    const uniqueDates = Array.from(new Set(data?.map(d => d.date) || []))
    setAvailableDates(uniqueDates)
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0])
    }
  }

  const triggerScrape = async () => {
    try {
      const response = await fetch('/api/scrape', { method: 'POST' })
      if (!response.ok) {
        console.log('Scraper not yet configured on backend')
      }
    } catch (error) {
      console.log('Could not trigger scraper:', error)
    }
  }

  const fetchNavData = async () => {
    // Get latest date
    const { data: dateData, error: dateError } = await supabase
      .from('nav_prices')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)

    if (dateError) throw dateError
    
    if (dateData && dateData.length > 0) {
      const latestDate = dateData[0].date
      await fetchNavDataForDate(latestDate)
    }
  }

  const fetchNavDataForDate = async (date: string) => {
    const { data, error } = await supabase
      .from('nav_prices')
      .select('*')
      .eq('date', date)
      .order('fund_name', { ascending: true })

    if (error) throw error
    setNavData(data || [])
  }

  const fetchChanges = async () => {
    const { data, error } = await supabase
      .from('nav_changes')
      .select('*')
      .order('date', { ascending: false })
      .limit(100)

    if (error) throw error
    setChanges(data || [])
  }

  const fetchLastScrape = async () => {
    const { data, error } = await supabase
      .from('scrape_runs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)

    if (error) throw error
    if (data && data.length > 0) {
      setLastScrape(data[0])
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900">Error</h1>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 NAV Dashboard</h1>
              <p className="text-gray-600 mt-1">Public Mutual Fund Net Asset Values</p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {/* Date Picker */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">View data for:</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </div>
          
          {lastScrape && (
            <p className="text-sm text-gray-500 mt-3">
              Last updated: {new Date(lastScrape.timestamp).toLocaleString()}
              {lastScrape.status === 'success' && ' ✅'}
            </p>
          )}
          
          {/* Watchlist Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowWatchlist(!showWatchlist)}
              className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded transition"
            >
              ⭐ My Watchlist ({watchlist.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <Analytics navData={navData} />

        {/* Show Watchlist or Dashboard */}
        {showWatchlist ? (
          <div className="mt-8">
            <Watchlist 
              data={navData} 
              watchlist={watchlist} 
              onClearWatchlist={clearWatchlist}
              onFundClick={(fund) => {
                setSelectedFund(fund)
                setShowFundModal(true)
              }}
            />
          </div>
        ) : (
          <>
            {/* Charts and Top Performers */}
            <div className="mt-8 space-y-8">
              <NavChart data={navData} />
              <TopPerformers data={changes} loading={loading} />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* NAV Prices Table */}
              <div className="lg:col-span-2">
                <NavTable data={navData} loading={loading} />
              </div>

              {/* NAV Changes */}
              <div>
                <NavChanges data={changes} loading={loading} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Fund Details Modal */}
      <FundDetailsModal 
        fund={selectedFund} 
        isOpen={showFundModal} 
        onClose={() => setShowFundModal(false)}
      />
    </div>
  )
}
