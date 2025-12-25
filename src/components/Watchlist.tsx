'use client'

interface NavPrice {
  id: number
  fund_name: string
  fund_abbr: string
  nav: number
  chg: string
  chg_pct: string
  date: string
  created_at?: string
}

interface WatchlistProps {
  data: NavPrice[]
  watchlist: string[]
  onClearWatchlist: () => void
  onFundClick?: (fund: NavPrice) => void
}

export default function Watchlist({ data, watchlist, onClearWatchlist, onFundClick }: WatchlistProps) {
  const watchlistFunds = data.filter((f) => watchlist.includes(f.fund_abbr))

  if (watchlist.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-2xl mb-2">⭐</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
        <p className="text-gray-600">Click the star icon on any fund to add it to your watchlist</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">⭐ My Watchlist</h2>
          <p className="text-gray-600 mt-1">{watchlist.length} fund{watchlist.length !== 1 ? 's' : ''} favorited</p>
        </div>
        <button
          onClick={onClearWatchlist}
          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition"
        >
          Clear All
        </button>
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {watchlistFunds.map((fund) => (
              <tr key={fund.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{fund.fund_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{fund.fund_abbr}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {fund.nav.toFixed(4)}
                </td>
                <td className="px-6 py-4 text-sm text-right">{fund.chg}</td>
                <td className="px-6 py-4 text-sm text-right font-medium">
                  <span
                    className={
                      fund.chg_pct.includes('-')
                        ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                        : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                    }
                  >
                    {fund.chg_pct}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {onFundClick && (
                    <button
                      onClick={() => onFundClick(fund)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
        Showing {watchlistFunds.length} of {watchlist.length} favorited funds for the selected date
      </div>
    </div>
  )
}
