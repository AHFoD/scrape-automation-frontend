'use client'

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

export default function NavChanges({ data, loading }: { data: NavChange[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
        </div>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct)).slice(0, 20)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">📊 Latest Changes</h2>
        <p className="text-gray-600 text-sm mt-1">Top {sortedData.length} changes by magnitude</p>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No changes recorded</div>
        ) : (
          sortedData.map(item => {
            const isPositive = item.change_pct > 0
            return (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.fund_abbr}</p>
                    <p className="text-gray-600 text-xs mt-1">{item.fund_name}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.change_pct.toFixed(2)}%
                    </p>
                    <p className="text-gray-600 text-xs">
                      {item.nav_old.toFixed(4)} → {item.nav_new.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      width: `${Math.min(Math.abs(item.change_pct) * 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
