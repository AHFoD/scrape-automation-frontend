'use client'

import { useState, useMemo } from 'react'

interface NavPrice {
  id: number
  fund_name: string
  fund_abbr: string
  nav: number
  chg: string
  chg_pct: string
}

export default function NavTable({ data, loading }: { data: NavPrice[]; loading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'nav'>('name')

  const filteredData = useMemo(() => {
    let result = data

    if (searchTerm) {
      result = result.filter(
        item =>
          item.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.fund_abbr.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortBy === 'nav') {
      result = result.sort((a, b) => b.nav - a.nav)
    } else {
      result = result.sort((a, b) => a.fund_name.localeCompare(b.fund_name))
    }

    return result
  }, [data, searchTerm, sortBy])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Current NAV Prices</h2>
        <input
          type="text"
          placeholder="Search funds..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sort by Name
          </button>
          <button
            onClick={() => setSortBy('nav')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              sortBy === 'nav'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sort by NAV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fund Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abbr
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAV
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.fund_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.fund_abbr}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {item.nav.toFixed(4)}
                </td>
                <td className="px-6 py-4 text-sm text-right">{item.chg}</td>
                <td className="px-6 py-4 text-sm text-right font-medium">
                  <span
                    className={
                      item.chg_pct.includes('-')
                        ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                        : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                    }
                  >
                    {item.chg_pct}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
        Showing {filteredData.length} of {data.length} funds
      </div>
    </div>
  )
}
