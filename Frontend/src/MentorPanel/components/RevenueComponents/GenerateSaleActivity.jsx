import { useMemo, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const GeneralSaleActivity = ({ data = [], loading }) => {
  const [timePeriod, setTimePeriod] = useState("1 Year")

  const chartData = useMemo(() => {
    if (!data?.length) {
      return [{ label: 'No data', revenue: 0 }]
    }
    return data.map((item) => ({
      month: item.label,
      revenue: item.revenue,
    }))
  }, [data])

  const total = data.reduce((sum, item) => sum + (item.revenue || 0), 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">
          {formatCurrency(payload[0].value)}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">General Sale Activity</h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{loading ? '...' : `${formatCurrency(total)} USD`}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#5D38DE] text-sm hover:underline">View Report</button>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm border border-gray-700 focus:outline-none focus:border-[#5D38DE]"
          >
            <option>1 Year</option>
            <option>6 Months</option>
          </select>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal vertical={false} />
            <XAxis dataKey="month" stroke="#666" tick={{ fill: "#999", fontSize: 12 }} axisLine={{ stroke: "#333" }} />
            <YAxis stroke="#666" tick={{ fill: "#999", fontSize: 12 }} axisLine={{ stroke: "#333" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#666", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GeneralSaleActivity
