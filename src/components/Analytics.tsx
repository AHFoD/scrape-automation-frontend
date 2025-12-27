'use client'

const EXPECTED_TOTAL_FUNDS = 182

interface NavPrice {
  nav: number
}

interface AnalyticsProps {
  navData: NavPrice[]
  selectedDate?: string
}

export default function Analytics({ navData, selectedDate }: AnalyticsProps) {
  if (navData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
      </div>
    )
  }

  const avgNav = navData.reduce((sum, d) => sum + d.nav, 0) / navData.length
  const maxNav = Math.max(...navData.map(d => d.nav))
  const minNav = Math.min(...navData.map(d => d.nav))
  const coverage = (navData.length / EXPECTED_TOTAL_FUNDS) * 100
  const isCoverageLow = coverage < 80
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Today'

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium">Total Funds ({formattedDate})</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{navData.length}</p>
      </div>

      <div className={`bg-white rounded-lg shadow p-6 ${ isCoverageLow ? 'border-l-4 border-yellow-500' : ''}`}>
        <p className="text-gray-600 text-sm font-medium flex items-center gap-1">
          Coverage
          {isCoverageLow && <span className="text-yellow-600 text-xs">⚠️</span>}
        </p>
        <p className={`text-3xl font-bold mt-2 ${ isCoverageLow ? 'text-yellow-600' : 'text-green-600'}`}>
          {coverage.toFixed(0)}%
        </p>
        <p className="text-xs text-gray-500 mt-1">{navData.length} of {EXPECTED_TOTAL_FUNDS}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium">Average NAV</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">${avgNav.toFixed(4)}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium">Highest NAV</p>
        <p className="text-3xl font-bold text-green-600 mt-2">${maxNav.toFixed(4)}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium">Lowest NAV</p>
        <p className="text-3xl font-bold text-red-600 mt-2">${minNav.toFixed(4)}</p>
      </div>
    </div>
  )
}
