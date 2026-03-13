import { useEffect, useState } from "react"
import { adminDashboardAPI } from "../../utils/api"
import { Loader2 } from "lucide-react"

export default function ActivityList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await adminDashboardAPI.getMentorLeaderboard(10)
        if (response.data?.success) {
          setRows(response.data.data?.data || [])
        } else {
          setError(response.data?.message || "We couldn't load the leaderboard. Please try again.")
        }
      } catch (err) {
        console.error("Error fetching mentor leaderboard:", err)
        setError(err.message || "We couldn't load the leaderboard. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <div className="text-sm text-white/60 text-center py-8">No ranking available.</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Mentor Leaderboard</h3>
        <p className="text-xs text-white/60">Top {rows.length} by services sold</p>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 pb-2 lg:mx-0 lg:px-0 lg:pb-0">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Rank</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Mentor</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Rating</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Badges</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Services Sold</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-white/80">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.id}-${idx}`} className="border-t border-white/10">
                <td className="px-4 py-3 whitespace-nowrap">#{idx + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.rating.toFixed(1)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.badges.length ? r.badges.join(', ') : '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{r.servicesSold}</td>
                <td className="px-4 py-3 whitespace-nowrap">${r.revenue.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
