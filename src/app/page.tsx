'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import NavTable from '@/components/NavTable'
import NavChanges from '@/components/NavChanges'
import Analytics from '@/components/Analytics'

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

  useEffect(() => {
    fetchData()
    // Set up real-time subscriptions
    const navSubscription = supabase
      .channel('public:nav_prices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nav_prices' }, () => {
        fetchNavData()
      })
      .subscribe()

    return () => {
      navSubscription.unsubscribe()
    }
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Optionally trigger a new scrape (commented out for now)
      // await triggerScrape()
      
      await Promise.all([fetchNavData(), fetchChanges(), fetchLastScrape()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
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
    const { data, error } = await supabase
      .from('nav_prices')
      .select('*')
      .order('date', { ascending: false })
      .limit(500)

    if (error) throw error
    // Get latest date and filter for that date only
    if (data && data.length > 0) {
      const latestDate = data[0].date
      const latestData = data.filter(d => d.date === latestDate)
      setNavData(latestData.sort((a, b) => a.fund_name.localeCompare(b.fund_name)))
    }
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
          {lastScrape && (
            <p className="text-sm text-gray-500 mt-3">
              Last updated: {new Date(lastScrape.timestamp).toLocaleString()}
              {lastScrape.status === 'success' && ' ✅'}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <Analytics navData={navData} />

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
      </main>
    </div>
  )
}
