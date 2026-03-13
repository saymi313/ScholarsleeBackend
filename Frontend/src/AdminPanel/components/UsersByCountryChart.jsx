import { useEffect, useState } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Loader2 } from "lucide-react"

export default function UsersByCountryChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getUsersByCountry()
        if (response.data?.success) {
          setData(response.data.data?.data || [])
        } else {
          setError(response.data?.message || "We couldn't load country data. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching users by country:", err)
        setError(err.message || "We couldn't load country data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const COLORS = ["#5D38DE", "#38bdf8", "#f59e0b", "#10b981", "#ef4444", "#a78bfa", "#22d3ee", "#fbbf24"]

  const total = data.reduce((sum, d) => sum + d.count, 0) || 1

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 h-[420px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 h-[420px] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#161619] p-4 h-80 lg:h-[420px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Users by Country</h3>
      </div>
      <div className="h-[85%] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="country"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              labelLine={false}
              label={({ name, value }) => `${name} (${Math.round((value / total) * 100)}%)`}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${Math.round((value / total) * 100)}%)`, name]}
              contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111' }}
              labelStyle={{ color: '#111' }}
              itemStyle={{ color: '#111' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


