import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { Loader2 } from "lucide-react"

export default function RevenueChart() {
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("7d") // 7d | monthly | yearly
  const [data, setData] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getRevenueChart(range)
        if (response.data?.success) {
          setData(response.data.data?.data || [])
        } else {
          setError(response.data?.message || "Failed to load chart data")
        }
      } catch (err) {
        console.error("Error fetching revenue chart data:", err)
        setError(err.message || "Failed to load chart data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [range])

  return (
    <div className="h-72 relative rounded-xl border border-white/10 bg-[#161619] p-3">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-sm font-semibold text-white">User Load</p>
        <div className="flex gap-1">
          <button onClick={() => setRange('7d')} className={`px-2 py-1 rounded text-xs ${range==='7d' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>7D</button>
          <button onClick={() => setRange('monthly')} className={`px-2 py-1 rounded text-xs ${range==='monthly' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>Monthly</button>
          <button onClick={() => setRange('yearly')} className={`px-2 py-1 rounded text-xs ${range==='yearly' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>Yearly</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5D38DE" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#5D38DE" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ffffff14" vertical={false} />
          <XAxis dataKey="m" stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
          <Tooltip labelClassName="text-white" formatter={(v) => [v, 'User load']} contentStyle={{ background: "#111", border: "1px solid #222", color: "#fff" }} />
          <Area type="monotone" dataKey="v" stroke="#89f17f" fill="url(#g)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
