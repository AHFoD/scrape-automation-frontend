'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface NavHistoryRow {
  date: string
  fund_abbr: string
  nav: number
}

interface ChartPoint {
  date: string
  [fundAbbr: string]: number | string
}

interface NavChartProps {
  data: NavHistoryRow[]
  selectedDate?: string
}

export default function NavChart({ data, selectedDate }: NavChartProps) {
  const { chartData, uniqueDates, fundKeys } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], uniqueDates: new Set(), fundKeys: [] }
    }

    const byDate = new Map<string, ChartPoint>()

    data.forEach(row => {
      if (!byDate.has(row.date)) {
        byDate.set(row.date, { date: row.date })
      }
      byDate.get(row.date)![row.fund_abbr] = row.nav
    })

    const sorted = Array.from(byDate.values()).sort((a, b) =>
      (a.date as string).localeCompare(b.date as string)
    )

    const uniqueDates = new Set(data.map(row => row.date))
    const allFunds = Array.from(new Set(data.map(row => row.fund_abbr)))
    const fundKeys = allFunds.slice(0, 6)

    return { chartData: sorted, uniqueDates, fundKeys }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 NAV Trends</h2>
        <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-2">No historical data available yet</p>
            <p className="text-gray-500 text-sm">Check back later or select a different date</p>
          </div>
        </div>
      </div>
    )
  }

  if (chartData.length === 0 || uniqueDates.size < 2) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 NAV Trends</h2>
        <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-2">Not enough data to display trends</p>
            <p className="text-gray-500 text-sm">Trends require at least 2 dates with data</p>
          </div>
        </div>
      </div>
    )
  }

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 NAV Trends</h2>
      
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'NAV Price', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => (typeof value === 'number' ? value.toFixed(4) : value)}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
            />
            <Legend />
            
            {fundKeys.map((fund, index) => (
              <Line
                key={fund}
                type="monotone"
                dataKey={fund}
                stroke={colors[index % colors.length]}
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-gray-600 mt-4">
        💡 Showing trends for {fundKeys.length} of {Array.from(new Set(data.map(d => d.fund_abbr))).length} funds across {uniqueDates.size} date(s)
      </p>
    </div>
  )
}
