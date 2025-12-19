import { useState, useEffect } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

export default function QuickActions() {
  const [range, setRange] = useState("7d") // 7d | monthly | yearly
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getTransactionsChart(range)
        if (response.data?.success) {
          setData(response.data.data || [])
        } else {
          setError(response.data?.message || "Failed to load transactions")
        }
      } catch (err) {
        console.error("Error fetching transactions chart:", err)
        setError(err.message || "Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [range])

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#161619] p-3 h-72 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#161619] p-3 h-72 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#161619] p-3 h-72 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-white">Transactions</p>
        <div className="flex gap-1">
          <button onClick={() => setRange('7d')} className={`px-2 py-1 rounded text-xs ${range==='7d' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>7D</button>
          <button onClick={() => setRange('monthly')} className={`px-2 py-1 rounded text-xs ${range==='monthly' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>Monthly</button>
          <button onClick={() => setRange('yearly')} className={`px-2 py-1 rounded text-xs ${range==='yearly' ? 'bg-[#5D38DE] text-white' : 'bg-white/5 hover:bg-white/10'}`}>Yearly</button>
        </div>
      </div>
      <div className="w-full mt-2 flex-1">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ffffff14" vertical={false} />
              <XAxis dataKey="x" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`$${v}`, 'Amount']} contentStyle={{ background: '#111', border: '1px solid #222', color: '#fff' }} />
              <Bar dataKey="y" fill="#5D38DE" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No transaction data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
  