'use client'

interface NavPrice {
  nav: number
}

export default function Analytics({ navData }: { navData: NavPrice[] }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-sm font-medium">Total Funds</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{navData.length}</p>
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
