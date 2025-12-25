'use client'

interface NavChange {
  id: number
  fund_name: string
  fund_abbr: string
  nav_old: number
  nav_new: number
  change: number
  change_pct: number
}

interface TopPerformersProps {
  data: NavChange[]
  loading: boolean
}

export default function TopPerformers({ data, loading }: TopPerformersProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Get top 5 gainers and losers
  const gainers = [...data]
    .filter(d => d.change_pct > 0)
    .sort((a, b) => b.change_pct - a.change_pct)
    .slice(0, 5)

  const losers = [...data]
    .filter(d => d.change_pct < 0)
    .sort((a, b) => a.change_pct - b.change_pct)
    .slice(0, 5)

  const PerformerCard = ({ performer, rank }: { performer: NavChange; rank: number }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 transition rounded">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-400 w-6 text-center">{rank}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{performer.fund_abbr}</p>
            <p className="text-gray-600 text-xs truncate">{performer.fund_name}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${performer.change_pct > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {performer.change_pct > 0 ? '+' : ''}{performer.change_pct.toFixed(2)}%
        </p>
        <p className="text-gray-600 text-xs">
          {performer.nav_old.toFixed(4)} → {performer.nav_new.toFixed(4)}
        </p>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-200">
          <h3 className="font-bold text-green-900 text-lg">🚀 Top Gainers</h3>
          <p className="text-green-700 text-xs mt-1">Highest performing funds</p>
        </div>
        <div className="divide-y divide-gray-200">
          {gainers.length > 0 ? (
            gainers.map((fund, idx) => (
              <PerformerCard key={fund.id} performer={fund} rank={idx + 1} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No gainers</div>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 border-b border-red-200">
          <h3 className="font-bold text-red-900 text-lg">📉 Top Losers</h3>
          <p className="text-red-700 text-xs mt-1">Lowest performing funds</p>
        </div>
        <div className="divide-y divide-gray-200">
          {losers.length > 0 ? (
            losers.map((fund, idx) => (
              <PerformerCard key={fund.id} performer={fund} rank={idx + 1} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No losers</div>
          )}
        </div>
      </div>
    </div>
  )
}
