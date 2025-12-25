'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Fund {
  id: number
  fund_name: string
  fund_abbr: string
  nav: number
  chg: string
  chg_pct: string
  date: string
}

interface FundHistory {
  date: string
  nav: number
}

interface FundDetailsModalProps {
  fund: Fund | null
  isOpen: boolean
  onClose: () => void
}

export default function FundDetailsModal({ fund, isOpen, onClose }: FundDetailsModalProps) {
  const [history, setHistory] = useState<FundHistory[]>([])
  const [stats, setStats] = useState<{
    minNav: number
    maxNav: number
    avgNav: number
    changePercent: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (fund && isOpen) {
      fetchFundHistory()
    }
  }, [fund, isOpen])

  const fetchFundHistory = async () => {
    if (!fund) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('nav_prices')
        .select('date, nav')
        .eq('fund_abbr', fund.fund_abbr)
        .order('date', { ascending: true })

      if (error) throw error

      const historyData = data || []
      setHistory(historyData)

      // Calculate statistics
      if (historyData.length > 0) {
        const navs = historyData.map(h => h.nav)
        const minNav = Math.min(...navs)
        const maxNav = Math.max(...navs)
        const avgNav = navs.reduce((a, b) => a + b, 0) / navs.length
        const firstNav = historyData[0].nav
        const lastNav = historyData[historyData.length - 1].nav
        const changePercent = ((lastNav - firstNav) / firstNav) * 100

        setStats({ minNav, maxNav, avgNav, changePercent })
      }
    } catch (error) {
      console.error('Error fetching fund history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !fund) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b sticky top-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{fund.fund_abbr}</h2>
              <p className="text-gray-600 mt-1 text-sm">{fund.fund_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading details...</p>
            </div>
          ) : (
            <>
              {/* Current Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Current NAV</p>
                  <p className="text-2xl font-bold text-blue-600">${fund.nav.toFixed(4)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Change</p>
                  <p className={`text-2xl font-bold ${fund.chg_pct.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                    {fund.chg_pct}
                  </p>
                </div>
                {stats && (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Avg NAV</p>
                      <p className="text-2xl font-bold text-green-600">${stats.avgNav.toFixed(4)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Overall %</p>
                      <p className={`text-2xl font-bold ${stats.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Historical Data */}
              {stats && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Historical Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Minimum NAV</p>
                      <p className="text-lg font-bold text-gray-900">${stats.minNav.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Maximum NAV</p>
                      <p className="text-lg font-bold text-gray-900">${stats.maxNav.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Data Points</p>
                      <p className="text-lg font-bold text-gray-900">{history.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Historical Table */}
              {history.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price History</h3>
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-semibold text-gray-900">Date</th>
                          <th className="text-right p-3 font-semibold text-gray-900">NAV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {history.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-3 text-gray-600">{item.date}</td>
                            <td className="text-right p-3 font-semibold text-gray-900">
                              ${item.nav.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
