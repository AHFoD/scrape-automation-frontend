'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  [key: string]: string | number
}

interface NavChartProps {
  data: ChartData[]
  selectedFunds?: string[]
}

export default function NavChart({ data, selectedFunds = [] }: NavChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No data available for chart</p>
      </div>
    )
  }

  // Colors for different funds
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 NAV Trends</h2>
      
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
            
            {/* Display all funds in data or only selected ones */}
            {Object.keys(data[0])
              .filter(key => key !== 'date')
              .slice(0, 6) // Limit to 6 funds to avoid clutter
              .map((fund, index) => (
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
        💡 Tip: View different dates using the date picker to see historical trends
      </p>
    </div>
  )
}
